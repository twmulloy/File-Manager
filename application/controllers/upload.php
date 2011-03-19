<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}

	function index(){
		
		$path = $this->storage->getPath($this->input->post('path'));
		$config['upload_path'] 		= $path;
		$config['allowed_types']	= 'gif|jpg|jpeg|png|tiff|psd|pdf|txt';
		$config['overwrite']			= true;
		$config['remove_spaces']	= true;
		
		$this->load->library('upload', $config);

		if($this->upload->do_upload('file')){
			
			$data = $this->upload->data();
			
			$result = array(
				'status'=>'success',
				'data'=> $data
			);
			
			// for images
			if(isset($data['is_image']) && $data['is_image'] == true)
				$this->is_image($data);
			
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
		$this->image->makeThumb($data);

	}
	
}