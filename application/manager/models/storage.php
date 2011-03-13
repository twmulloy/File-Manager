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
				if(is_dir($content['server_path'])) 
					$contents[$name]['type'] = 'folder';
				else
					$contents[$name]['type'] = 'file';
					
				// append unique hash
				$contents[$name]['hash'] = md5($content['date'] + $content['name'] + $content['size']);
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

}