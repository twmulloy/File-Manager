<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Image extends CI_Model
{
	
	function __construct()
	{
		parent::__construct();
		$this->load->library('image_lib');
	}
	
	function createThumb(array $data){
		
		$path = $this->config->item('thumb_directory');
		$thumbSize = $this->config->item('thumb_size');
		
		// fallbacks
		if(!$thumbSize) $thumbSize = 64;
	
		// generate thumb
		$config['create_thumb'] = true;
		$config['source_image'] = '/'.$data['file_path'].'/'.$data['file_name'];
		$config['thumb_marker'] = '';
		$config['new_image'] = $path . '/' . $data['file_name'];
		$config['maintain_ratio'] = true;
		$config['quality'] = '100%';
		$config['width'] = $thumbSize;
		$config['height'] = $thumbSize;

		$orientation = $this->getOrientation($data['image_width'], $data['image_height']);
		
		switch($orientation){
			case 'landscape':
				$config['master_dim'] = 'height';
				break;
				
			case 'portrait':
			default:
				$config['master_dim'] = 'width';
				break;
		}
		$this->image_lib->initialize($config);
		
		if(!$this->image_lib->resize())
			return error_log($this->image_lib->display_errors('',''));
		
		// reset everything since our scope is changing to the thumb and not source.
		$this->image_lib->clear();
		unset($config);
		
		// crop the thumb
		$thumbPath = $path . '/' . $data['file_name'];
		$thumbData = $this->image_lib->get_image_properties($thumbPath, true); 
		$config['source_image'] = $thumbPath;
		$config['maintain_ratio'] = false;
		$config['quality'] = '100%';
		
		switch($orientation){
			case 'landscape':
				$config['width'] = $config['height'] = $thumbData['height'];
				$config['x_axis'] = (($thumbData['width'] / 2) - ($config['width'] / 2));
				break;
				
			case 'portrait':
			default:
				$config['height'] = $config['width'] = $thumbData['width'];
				$config['y_axis'] = (($thumbData['height'] / 2) - ($config['height'] / 2));
				break;
		}
			
		$this->image_lib->initialize($config);
		
		if(!$this->image_lib->crop())
			return error_log($this->image_lib->display_errors('',''));

	}
	
	function getOrientation($width, $height){
		if($width > $height)
			return 'landscape';
			
		return 'portrait';
	}
}