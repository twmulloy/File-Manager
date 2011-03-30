<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Email extends CI_Controller {
	
	protected $data;

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
		
		// verify has params
		if(!$this->input->post('data')) return false;
		
		$this->data = $this->input->post('data');

		session_start();
	}
	
	function index(){
		// require user
		if(!isset($_SESSION['user'])){
			
			$result = array(
				'status'=>'fail',
				'explain'=>'Permission denied'
			);
			
			return $this->output
				->set_content_type('application/json')
				->set_output(json_encode($result));
		}
		
		// default result
		$result = array(
			'status'=>'fail'
		);
		
		// required email
		if(isset($this->data['email']) && !empty($this->data['email'])){
			
			$this->load->library('email');
			
			#$this->email->to('marketing-request@spyder.com');
			$this->email->to('tm@cthedrl.com');
			$this->email->from($this->data['email']);
			$this->email->subject('Request from Marketing Files App');
			$this->email->message($this->data['message']);	


			if($this->email->send()){
				$result = array(
					'status'=>'success'
				);
			}
		}

		return $this->output
			->set_content_type('application/json')
			->set_output(json_encode($result));
		
	}

}