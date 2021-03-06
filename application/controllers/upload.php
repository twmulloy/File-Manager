<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}

	function index(){
		
		// require admin
		session_start();
		if(!isset($_SESSION['user']['admin']) || empty($_SESSION['user']['admin'])){
			
			$result = array(
				'status'=>'fail',
				'explain'=>'Permission denied',
				'data'=>$_FILES['file']
			);
			
			return $this->output
				->set_content_type('text/html')
				->set_output(json_encode($result));
		}
		
		
		$path = $this->input->post('path');
		$config['upload_path'] 		= $path ? $this->storage->getPath($path) : $this->config->item('storage_directory');
		$config['allowed_types']	= 'gif|jpg|jpeg|png|tiff|psd|pdf|txt|xls|docx|ai|eps|xlsx';
		$config['overwrite'] 			= true;
		$config['remove_spaces']	= true;
		$this->load->library('upload', $config);
		unset($config);
		
		if($this->upload->do_upload('file')){
			$data = $this->upload->data();
			
			// append additional values
			$data['short_name'] = ellipsize($data['file_name'], 18, .5);
			
			$result = array(
				'status'=>'success',
				'data'=> $data
			);
			
			// for images
			if(isset($data['is_image']) && $data['is_image'] == true){
				$this->is_image($data);
			}
				

		}else{
			$result = array(
				'status'=>'fail',
				'explain'=>$this->upload->display_errors('', ''),
				'data'=>$_FILES['file']
			);
	}
		/*
			From uploader documentation:
			They will only register a load event if the Content-type of the response is set to text/plain or text/html, 
			not if it is set to application/json.
		*/
		return $this->output
			->set_content_type('text/html')
			#->set_content_type('application/json')
			->set_output(json_encode($result));
		
	}
	
	// additional work for images
	private function is_image(array $data){
		$this->load->model('image');
		return $this->image->createThumb($data);
	}
	
}
