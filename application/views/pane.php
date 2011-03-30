<div class="control">
	<?php if($is_admin): ?>
		<a class="button upload active" href="#"><span class="icon uparrow"></span>Upload</a>
		<a class="button download" href="#"><span class="icon downarrow"></span>Download</a>
	<?php else: ?>
		<a class="button download" href="#"><span class="icon downarrow"></span>Download</a>
	<?php endif; ?>
</div>

<div class="pane">
	
	<?php if($is_admin): ?>
	<div id="pane-upload">
		<h3>Upload History</h3>
		<ul id="files" class="queue"></ul>
		<div class="control">
		<?=form_open_multipart('upload', array('id'=>'file_upload'))?>
			<input type="hidden" name="path" value="" />
			<input type="file" name="file" multiple />
			<button>Upload</button>
			<div>Upload file(s)</div>
		<?=form_close()?>
		<a href="#" class="button queue-clear">Clear History</a>
		</div>
	</div>
	<?php endif; ?>
	
	<!-- droppable region -->
	<div id="pane-download" class="droppable" <?php if(!$is_admin): ?>style="margin-left: 0px !important;"<?php endif; ?>>
		<h3>Download Queue</h3>
		<ul class="queue"></ul>
		<?=form_open('download/zip', array('target'=>'_blank'))?>
		<div class="control">
			<a href="#" class="button download-zip">Download .zip</a>
			<a href="#" class="button queue-clear">Clear Queue</a>
		</div>
		<?=form_close()?>

	</div>
	<!-- end droppable region -->
	
</div>