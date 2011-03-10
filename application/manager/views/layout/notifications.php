<?php if(validation_errors()): ?>
	<ol class="notifications" data-notification-type="bad">
		<?=validation_errors('<li>','</li>')?>
	</ol>
<?php endif; ?>

<?#=$this->session->flashdata('notice')?>