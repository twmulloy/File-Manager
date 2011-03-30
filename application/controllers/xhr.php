<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Xhr extends CI_Controller {
	
	protected $data, $path;

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
		
		// verify has params
		if(!$this->input->post('data')) return false;

		$this->data = $this->input->post('data');
		$this->path = $this->input->post('path');
	}
	
	function create(){
		
		// require admin
		session_start();
		if(!isset($_SESSION['user']['admin']) || !$_SESSION['user']['admin']){
			
			$result = array(
				'status'=>'fail',
				'explain'=>'Permission denied'
			);
			
			return $this->output
				->set_content_type('application/json')
				->set_output(json_encode($result));
		}

		$json = array();

		switch($this->data['item']){
			case 'folder':
				$json = $this->storage->createDirectory($this->data, $this->path);
				break;
		}
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}
	
	function delete(){
		
		// require admin
		session_start();
		if(!isset($_SESSION['user']['admin']) || !$_SESSION['user']['admin']){
			
			$result = array(
				'status'=>'fail',
				'explain'=>'Permission denied'
			);
			
			return $this->output
				->set_content_type('application/json')
				->set_output(json_encode($result));
		}

		$json = array();
		
		if(!isset($this->data['hash'])) return false;
		
		// send to delete
		$json = $this->storage->deletePath($this->data['hash']);
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));
	}
	
	function update(){
		
		// require admin
		session_start();
		if(!isset($_SESSION['user']['admin']) || !$_SESSION['user']['admin']){
			
			$result = array(
				'status'=>'fail',
				'explain'=>'Permission denied'
			);
			
			return $this->output
				->set_content_type('application/json')
				->set_output(json_encode($result));
		}
		
		$json = array();
		
		if(!isset($this->data['hash']) || !isset($this->data['to'])) return false;
		
		// send to rename
		$json = $this->storage->rename($this->data['hash'], $this->data['to']);
		
		return $this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($json));		
	}

	
}