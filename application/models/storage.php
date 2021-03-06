<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Storage extends CI_Model
{
	
	protected $root;
	
	function __construct()
	{
		parent::__construct();
		$this->root = $this->config->item('storage_directory');
		if(!$this->root) die('no storage directory set');
	}
	
	// builds the real path
	function getPath($filename){
		// if root directory isn't present then add it
		if(!preg_match('/^'.$this->root.'/', $filename))
			$filename = !$filename ? $this->root : $this->root . '/' . $filename;
			
		return $filename;
		
	}
	
	function getDirectory($file = null){
		
		$file = $this->getPath($file);

		// get only top level files
		$contents = get_dir_file_info($file, true);
		
		$this->load->library('image_lib');
		$thumbPath = $this->config->item('thumb_directory');
		if(!$thumbPath) die('no thumb path set');
		
		if(count($contents)){
			foreach($contents as $name => $content){
				
				// convert data
				$contents[$name]['short_name'] = ellipsize($name, 18, .5);
				$contents[$name]['formatted_date'] = date('Y-m-d h:m:sA', $contents[$name]['date']);
				$contents[$name]['formatted_size'] = $this->cleanFilesize($contents[$name]['size']);
				
				// determine whether folder or file
				if(is_dir($content['server_path'])){
					$contents[$name]['type'] = 'folder';
					$contents[$name]['count'] = count(get_dir_file_info($content['server_path'], true));
				}else{
					$contents[$name]['type'] = 'file';
					
					// thumb details
					$thumb = $this->image_lib->get_image_properties($content['server_path'], true);
					if($thumb['image_type']){
						$contents[$name]['thumb'] = $thumb;
						$contents[$name]['thumb']['path'] = $thumbPath . '/' . $name;
					} 
				}
								
				$contents[$name]['mime'] = get_mime_by_extension($name);
				// append unique hash
				$contents[$name]['hash'] = $this->generateHash($content['server_path']);
				
			}
		}
		return $contents;
		
	}
	
	function createDirectory($data, $path){
		
		$path = $this->getPath($path);
		$file = $path.'/'.$data['name'];
		$status = 0;
		$response = array();
		
		if(!file_exists($file)){
			// build response array, needs to make required data for tree
			$response['data'] = array(
					'name'	=> $data['name'],
					'type'	=> 'folder',
					'relative_path'	=> $path
			);

			// create the physical directory
			$status = mkdir($file, 0755);
		}
		
		if($status) $response['status'] = 'success';
		else $response['status'] = 'fail';
		
		return $response;
	}
	
	/**
	 * hash generator, to maintain consistency.
	 * this is a 2-way encryption hash to allow us to pass the storage path for building a zip
	 *
	 * @param string $server_path
	 * @return hash
	 * @author Thomas Mulloy
	 */
	function generateHash($path){
		return $this->encrypt->encode($path);
	}
	
	function reverseHash($hash){
		return $this->encrypt->decode($hash);
	}
	
	/**
	 * send array of hashes
	 *
	 * @param array $hashes 
	 * @return zip archive of hashes for download
	 * @author Thomas Mulloy
	 */
	function buildZipFromHashes(array $queue){
		$this->load->library('zip');
		// build array of data
		foreach($queue as $item){
			// reverse hash
			$path = $this->reverseHash($item['hash']);
			
			switch($item['type']){
				
				case 'folder':
					$this->zip->read_dir($path.'/', false); 
					break;
					
				case 'file':
					$this->zip->read_file($path, false);
					break;
					
			}
		}
		
		$zip_name = 'download_'.date('Ymd_His').'.zip';
		
		return $this->zip->download($zip_name);

	}
	
	function cleanFilesize($size){
		if(strlen($size) <= 9 && strlen($size) >= 7){
			$size = number_format($size / 1048576,1);
			return $size .'MB';
		}elseif(strlen($size) >= 10){
			$size = number_format($size / 1073741824,1);
			return $size.'GB';
		}else{
			$size = number_format($size / 1024,1);
			return $size.'KB';
		}
	}
	
	// get all the details for a single directory or file
	function getInfo($hash, $path){
		// decrypt hash
		$file = $this->reverseHash($hash);
		$info = get_file_info($file);
		
		if(!is_array($info)) return false;
		
		// add additional information
		$info['formatted_date'] = date('Y-m-d h:m:sA', $info['date']);
		$info['formatted_size'] = $this->cleanFilesize($info['size']);
		
		// check if has thumb
		$this->load->library('image_lib');
		$thumbPath = $this->config->item('thumb_directory');
		
		$image = $this->image_lib->get_image_properties($info['server_path'], true);
		
		if($image['image_type']){
			$info['is_image'] = true;
			$info['image'] = $image;
			$info['image']['path'] = $this->getPath($path) . '/' . $info['name'];
			$info['thumb'] = $thumbPath . '/' . $info['name'];
		}

		
		// this is where to add any additional data...
		
		return $info;
	}
	
	// delete file or all contents of a path
	function deletePath($hash){
		// reverse hash
		$path = $this->reverseHash($hash);
		$status = 0;
		$response = array();
		
		// check if it exists
		if(file_exists($path)){
			$response['data'] = get_file_info($path);
			
			if(is_dir($path)){
				// delete files of folder (and directories contained)
				$status = delete_files($path, true);
				// delete the actual folder
				if($status) rmdir($path);
			}else{
				// delete a file
				$status = unlink($path);
			}
		}
		
		if($status) $response['status'] = 'success';
		else $response['status'] = 'fail';
		
		return $response;

	}
	
	// setter upper for file files
	function search($search){
		// search files
		$files = get_dir_file_info($this->root, false);
		
		$pattern = '/'.$search.'/i';
		
		// result array
		$array = array();
		
		if(count($files)){
			
			// thumb stuff
			$this->load->library('image_lib');
			$thumbPath = $this->config->item('thumb_directory');
			if(!$thumbPath) die('no thumb path set');
			
			foreach($files as $file => $info){

				// match found
				if(preg_match($pattern, $file)){
					
					$info['short_name'] = ellipsize($file, 18, .5);
					$info['formatted_date'] = date('Y-m-d h:m:sA', $info['date']);
					$info['formatted_size'] = $this->cleanFilesize($info['size']);
					$info['type'] = 'file';
					// append unique hash
					$info['hash'] = $this->generateHash($info['server_path']);

					// thumb details
					$thumb = $this->image_lib->get_image_properties($info['server_path'], true);
					if($thumb['image_type']){
						$info['thumb'] = $thumb;
						$info['thumb']['path'] = $thumbPath . '/' . $file;
					}
					
					$array[] = $info;	
				} 
			}
		}
		return $array;
	}
	
	// rename only folders
	function rename($hash, $to){
		// get existing folder name
		$oldPath = $this->reverseHash($hash);
		
		$status = 0;
		$response = array();
		
		// verify this exists
		if(file_exists($oldPath)){
			// construct path for renamed file
			$newPath = explode('/', $oldPath);
			// remove last segment (file name?)
			array_pop($newPath);
			// combine back into new path
			$newPath = implode('/', $newPath);
			// verify parent path exists
			if(file_exists($newPath)){
				// append the new name
				$newPath = $newPath.'/'. $to;
				// make sure new path doesn't exist
				if(!file_exists($newPath)){
					// finally rename it
					$status = rename($oldPath, $newPath);
					// get new data and return it
					if($status){
						$response['data'] = get_file_info($newPath);
						// append additional data
						$response['data']['short_name'] = ellipsize($response['data']['name'], 18, .5);
						$response['data']['formatted_date'] = date('Y-m-d h:m:sA', $response['data']['date']);
						$response['data']['formatted_size'] = $this->cleanFilesize($response['data']['size']);
					}
				}
			}
		}
		
		if($status) $response['status'] = 'success';
		else $response['status'] = 'fail';
		
		return $response;
	}

	
}