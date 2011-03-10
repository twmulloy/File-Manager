<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
	{
		// get root file tree
		$tree['dir_content'] = $this->storage->getDirectory();
		
		#echo '<pre>';
		#print_r($tree['dir_content']);
		#die;
		$data['tree'] = $this->load->view('tree', $tree, true);
		
		// get root stack
		#$content['stack'] = 
		
		$data['partial'] = $this->load->view('layout/frame', $data, true);
		$this->load->view($this->config->item('default_layout'), $data);
	}
	
	
}