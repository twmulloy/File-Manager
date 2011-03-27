<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Search extends CI_Controller {
	
	protected $data, $search, $result;

	function __construct()
	{
		parent::__construct();
		
		if(!$this->input->post('data')) return false;
		$this->data = $this->input->post('data');
	}
	
	function index(){
		// no search criteria
		if(!isset($this->data['search']) || empty($this->data['search'])) return false;

		$this->search = $this->data['search'];
		$this->result = $this->storage->search($this->search);
		
		// route ajax request
		if($this->input->is_ajax_request()) $this->ajax();
	}
	
	function ajax(){
		return $this->output
			->set_content_type('application/json')
			->set_output(json_encode($this->result));
	}

}