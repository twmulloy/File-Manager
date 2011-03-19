<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tree extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}

	function index()
	{
		$json = $this->storage->getDirectory($this->input->post('path'));
		
		return $this->output
			->set_content_type('application/json')
			->set_output(json_encode($json));
	}
}