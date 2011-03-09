<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Track {
	
	// history trail
	var $trail = 3;
	
	// set the page requested to session
	function request()
	{
		$CI =& get_instance();
		$array = array('track' => null);
	
		// get active trail
		$array['track'] = $CI->session->userdata('track');
	
		// get the current request
		$request = $CI->uri->uri_string();
		
		// track only if request has changed from the previous
		if(!$array['track'])
		{
			$array['track'][0] = $request;
		}
		else
		{
			if($array['track'][count($array['track']) - 1] !== $request)
				$array['track'][] = $request;
			else 
				return false;
		}
		
		// prune trail
		if(count($array['track']) > $this->trail)
			$array['track'] = array_slice($array['track'], -$this->trail);
			
		return $CI->session->set_userdata($array);
	}
}
