<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tree extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
	{
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;

		$data['array'] = $this->storage->getDirectory($this->input->post('path'));
		
		// return json encode with data
		$this->load->view('layout/json', $data);
	}
	
	
}