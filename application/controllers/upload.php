<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {
	
	protected $file;

	function __construct()
	{
		parent::__construct();
		
		// only allow ajax requests
		if(!$this->input->is_ajax_request()) return false;
	}

	function index(){
		$file = $_FILES['file'];
		
		// do something with the file...
		
		$json = $file;
		
		// From uploader documentation:"
		// They will only register a load event if the Content-type of the response is set to text/plain or text/html, 
		// not if it is set to application/json.
		
		return $this->output
			->set_content_type('text/html')
			#->set_content_type('application/json')
			->set_output(json_encode($json));
		
	}
	
}