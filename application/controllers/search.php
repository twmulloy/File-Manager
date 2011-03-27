<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Search extends CI_Controller {
	
	protected $search;

	function __construct()
	{
		parent::__construct();
		if(!$this->input->post('search')) return false;
		$this->search = $this->input->post('search');
	}
	
	function index(){
		$this->storage->search($this->search);
	}
	
}