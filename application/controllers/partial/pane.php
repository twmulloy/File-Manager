<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pane extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
	{
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;

		// required params
		if(!$this->input->post('path')) return false;
		
		$data['array'] = array();
		
		// return json encode with data
		$this->load->view('layout/json', $data);
	}
	
	
}