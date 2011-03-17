<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Storage extends CI_Model
{
	
	protected $root;
	
	function __construct()
	{
		parent::__construct();
		$this->root = $this->config->item('storage_directory');
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
		
		if(count($contents)){
			foreach($contents as $name => $content){
				// determine whether folder or file
				if(is_dir($content['server_path'])){
					$contents[$name]['type'] = 'folder';
				}else{
					$contents[$name]['type'] = 'file';
					#$contents[$name]['mime'] = get_mime_by_extension($content['server_path']);
				}
					
					
				// append unique hash
				$contents[$name]['hash'] = $this->generateHash($content['server_path']);
				
			}
		}
		return $contents;
		
	}
	
	function createDirectory($data, $path){
		
		$path = $this->getPath($path);
		
		// build response array, needs to make required data for tree
		$response = array(
			'data'=> array(
				'name'	=> $data['name'],
				'type'	=> 'folder',
				'relative_path'	=> $path
			)
		);
		
		// create the physical directory
		$status = mkdir($path.'/'.$data['name'], 0755);
		
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

}