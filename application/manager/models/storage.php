<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Storage extends CI_Model
{
	
	protected $path;
	
	function __construct()
	{
		parent::__construct();
	}
	
	function getDirectory($path = null){
		
		// root of storage directory, from config
		$path = implode('/', array(
			$this->config->item('storage_directory'),
			$path
			)
		);
		
		return get_dir_file_info($path, true);
	}

}