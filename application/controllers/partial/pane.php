<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pane extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}

	function index()
	{
		// required params
		if(!$this->input->post('path')) return false;
		
		$json = array();
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}
	
	
}