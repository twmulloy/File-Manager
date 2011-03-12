<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Xhr extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}
	
	function create(){
		
		$this->load->view('layout/json', $data);
	}
	
	function read(){
		
		$this->load->view('layout/json', $data);
	}
	
	function update(){
		
		$this->load->view('layout/json', $data);
	}
	
	function delete(){
		
		$this->load->view('layout/json', $data);
	}
	
}