<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Xhr extends CI_Controller {
	
	protected $data, $path;

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
		
		// verify has params
		if(!$this->input->post('data')) return false;

		$this->data = $this->input->post('data');
		$this->path = $this->input->post('path');
	}
	
	function create(){

		$json = array();

		switch($this->data['item']){
			case 'folder':
				$json = $this->storage->createDirectory($this->data, $this->path);
				break;
		}
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}
	
	function read(){
		
		$json = array();
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}
	
	function update(){
		
		$json = array();
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}
	
	function delete(){
		
		$json = array();
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}

	
}