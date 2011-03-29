<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Download extends CI_Controller {
	
	protected $data;

	function __construct()
	{
		parent::__construct();

	}
	
	// download single file
	function index(){
		
		// verify has params
		if(!$this->input->get_post('data')) return false;
		$this->data = $this->input->get_post('data');
		
		if(!isset($this->data['hash']) || !isset($this->data['name'])) return false;
		
		$this->load->helper('download');
		// decrypt hash
		$path = $this->storage->reverseHash($this->data['hash']);
		// grab data
		$data = file_get_contents($path);
		$name = $this->data['name'];
		
		return force_download($name, $data);
	}
	
	// download queue as zip
	function zip(){
		// verify has params
		if(!$this->input->post('data') ) return false;
		$this->data = $this->input->post('data');
		return $this->storage->buildZipFromHashes($this->data['queue']);
	}

	
}