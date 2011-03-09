<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}
	
	function create(){
		#$this->db->insert('users', $data);
	}
}