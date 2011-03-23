<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Info extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}

	function index()
	{
		$data = $this->input->post('data');
		if(!isset($data['hash'])) return false;
		
		$json = $this->storage->getInfo($data['hash'], $this->input->post('path'));
		
		return $this->output
			->set_content_type('application/json')
			->set_output(json_encode($json));
	}
}