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

		switch($this->data['item']){
			case 'folder':
				$data['array'] = $this->storage->createDirectory($this->data, $this->path);
				break;
		}
		$this->load->view('layout/json', $data);
	}
	
	function read(){
		
		$data['array'] = array();
		$this->load->view('layout/json', $data);
	}
	
	function update(){
		
		$data['array'] = array();
		$this->load->view('layout/json', $data);
	}
	
	function delete(){
		
		$data['array'] = array();
		$this->load->view('layout/json', $data);
	}


	
}