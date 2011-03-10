<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Storage extends CI_Model
{
	
	protected $path;
	
	function __construct()
	{
		parent::__construct();
	}
	
	function getDirectory($file = null){

		$root = $this->config->item('storage_directory');

		// if root directory isn't present then add it
		if(!preg_match('/^'.$root.'/', $file))
			$file = !$file ? $root : $root . '/' . $file;

		// get only top level files
		$contents = get_dir_file_info($file, true);
		
		if(count($contents)){
			foreach($contents as $name => $content){
				// determine whether folder or file
				if(is_dir($content['server_path'])) 
					$contents[$name]['type'] = 'folder';
				else
					$contents[$name]['type'] = 'file';
			}
		}
		
		return $contents;
		
	}

}