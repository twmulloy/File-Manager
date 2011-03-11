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
		
		// get file stack
		$data['stack'] = $this->load->view('stack', null, true);
		
		// information, upload queue, export panes
		$data['pane'] = $this->load->view('pane', null, true);
		
		$data['partial'] = $this->load->view('layout/frame', $data, true);
		$this->load->view($this->config->item('default_layout'), $data);
	}
	
	
}