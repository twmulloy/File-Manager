<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Image extends CI_Model
{
	
	function __construct()
	{
		parent::__construct();
	}

	function makeThumb(array $data){
		$path = $this->config->item('thumb_directory');
		
		// generate thumb
		$config['create_thumb'] = true;
		$config['new_image'] = $path . '/' . $data['file_name'];

		$this->load->library('image_lib', $config);
		
		// determine if landscape of portrait
		$width = $data['image_width'];
		$height = $data['image_height'];
		
		$orientation = $this->orientation($width, $height);
		
	}
	
	function orientation($width, $height){
		if($width > $height) return 'landscape';
		return 'portrait'; 
	}
}