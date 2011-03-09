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

		return get_dir_file_info($file, true);
	}

}