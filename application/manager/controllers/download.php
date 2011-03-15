<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Download extends CI_Controller {
	
	protected $data;

	function __construct()
	{
		parent::__construct();
		
		// verify has params
		if(!$this->input->post('data')) return false;
		$this->data = $this->input->post('data');
	}
	
	// download queue as zip
	function zip(){
		return $this->storage->buildZipFromHashes($this->data['queue']);
	}

	
}