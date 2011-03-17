<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config = array(
	'user' => array(
		array(
			'field' => 'email',
			'label' => 'email',
			'rules' => 'trim|required|xss_clean|valid_email'
		),
		array(
			'field' => 'password',
			'label' => 'password',
			'rules' => 'trim|required'
		)
	)
);