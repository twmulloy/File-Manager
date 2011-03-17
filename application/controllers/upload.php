<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {
	
	protected $file;

	function __construct()
	{
		parent::__construct();
	}

	function index(){
		$file = $_FILES['file'];
		echo '{"name":"'.$file['name'].'","type":"'.$file['type'].'","size":"'.$file['size'].'"}';
	}
	
}