<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		
		// handle xhr
		if($this->input->is_ajax_request()){
			$email = $this->input->post('email');
			$password = $this->input->post('password');
		}
		
		if($this->form_validation->run('user'))
		{
			echo "yo";
			#$this->auth->has('admin');
		}
	}

	function login()
	{
		$data['partial'] = $this->load->view('login', null, true);	
		$this->load->view($this->config->item('default_layout'), $data);
	}
	
	function register()
	{
		$data['partial'] = $this->load->view('register', null, true);	
		$this->load->view($this->config->item('default_layout'), $data);
	}
}