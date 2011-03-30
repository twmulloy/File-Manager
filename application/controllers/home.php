<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {
	
	protected $is_admin = false;

	function __construct()
	{
		parent::__construct();
		
		session_start();
		$_SESSION['user']['admin'] = 1;

		// require user
		if(!isset($_SESSION) || !isset($_SESSION['user'])) return redirect('../');
		
		// set admin
		if(isset($_SESSION['user']['admin']) && $_SESSION['user']['admin']) $this->is_admin = true;
		
		
	}

	function index()
	{
		
		// admin flag
		$data['is_admin'] = $this->is_admin;
		
		// get root file tree
		$data['dir_content'] = $this->storage->getDirectory();
		
		#echo '<pre>';
		#print_r($data['dir_content']);
		#die;
		$data['tree'] = $this->load->view('tree', $data, true);
		
		// get file stack
		$data['stack'] = $this->load->view('stack', $data, true);
		
		// information, upload queue, export panes
		$data['pane'] = $this->load->view('pane', $data, true);
		
		$data['partial'] = $this->load->view('layout/frame', $data, true);
		$this->load->view($this->config->item('default_layout'), $data);
	}
	
	
}