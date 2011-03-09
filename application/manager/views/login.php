<?=form_open(current_url())?>
<fieldset>
	
	<legend>Login</legend>
	
	<ul>
		
		<li class="<?php if(form_error('email')){ echo 'error'; }?>">
			<?=form_label('Email', 'email')?>
			<?=form_input(array(
				'name'	=>	'email',
				'id'	=>	'email',
				'value'	=>	set_value('email'),
				'placeholder' => 'user@domain.com'
			))?>
		</li>
		
		<li class="<?php if(form_error('password')){ echo 'error'; }?>">
			<?=form_label('Password', 'password')?>
			<?=form_password(array(
				'name'	=>	'password',
				'id'	=>	'password',
				'value'	=>	set_value('password'),
				'placeholder' => 'password123'
			))?>
		</li>
		
	</ul>

	<ul class="action">
		<li>
			<?=form_submit('submit', 'Login')?>
			<?=anchor('#', 'Login', array('class'=>'submit button primary left'))?><?=anchor('/forgot', 'I Forgot', array('class'=>'button right'))?>
		</li>
		
	</ul>

</fieldset>
<?=form_close()?>