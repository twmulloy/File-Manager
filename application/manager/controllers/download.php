<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Download extends CI_Controller {
	
	protected $data;

	function __construct()
	{
		parent::__construct();
		// only allow ajax requests
		#if(!$this->input->is_ajax_request()) return false;
		
		// verify has params
		#if(!$this->input->post('data')) return false;

		#$this->data = $this->input->post('data');
	}
	
	// download queue as zip
	function zip(){
		#if(!isset($this->data['queue'])) return false;
		
		#$this->storage->buildZipFromHashes($this->data['queue']);
		
		$this->load->library('zip');
		
		$queue = array(
			/*
			0 => array(
				'hash'=>'R+v7CrT+LMhEdOXXOj84Rjm+6L4+8fxIAEagTt3WEXeY3s1n7vQCPnI/fDUy4Y0JOoxpn3amLxA+XmIpkDjfug==',
				'type'=>'folder'
			),
			*/
			1 => array(
				'hash'=>'8y90BuNWDzN42w3iBx3fMnDCnneNWiLLnfPk68LiTSaFjcrNQwzGlDfZ9EWSuzhurkr2vyrenJU/yqLWBxQf8g==',
				'type'=>'file'
			)
		);
		
		// build array of data
		foreach($queue as $item){
			// reverse hash
			$path = $this->storage->reverseHash($item['hash']);
			
			switch($item['type']){
				
				case 'folder':
					$this->zip->read_dir($path.'/', false); 
					break;
					
				case 'file':
					$this->zip->read_file($path, false); 
					break;
					
			}
			
		}
		
		
		$this->zip->download('archive.zip');
		
		#$data['array'] = $this->data;
		#$this->load->view('layout/json', $data);
		
	}

	
}