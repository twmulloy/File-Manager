<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Auth extends CI_Model
{
	function __construct()
	{
		parent::__construct();
	}
	
	// check if user has credentials
	function has($access)
	{
		// get user data
		
	}
	
	// continue user onto desired route
	function proceed()
	{
			$trail = $this->session->userdata('track');
			// get previous request, with how the hook is set the previous request is not the last request.
			// the last request will be the current request because it will count the post.
			if($request = isset($trail[count($trail) - 2]))
				$prev = $request;
			// redirect only if the previous request was another controller
			if(isset($prev) && $prev != $this->router->class){
				redirect('/'.$prev);	
			}
			// otherwise redirect to home
			redirect('/');
	}
	
	// send back to login and notify
	function decline()
	{
		
	}
	
	// generates a hash and if provided a table, will verify it's uniqueness to table
	function uniqueHash($table = null)
	{
		// generate hash (taken from session hash generate)
		$hash = md5(uniqid(mt_rand(0, mt_getrandmax()), true));
		// if table and row exists then loop until it's unique
		if($table && $this->db->get_where($table, array('id' => $hash))->num_rows())
			return self::uniqueHash($table);
		
		return $hash;
	}

}