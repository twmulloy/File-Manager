<div class="control">
	<a class="button upload active" href="#"><span class="icon uparrow"></span>Upload</a>
	<a class="button download" href="#"><span class="icon downarrow"></span>Download</a>
</div>

<div class="pane">
	
	<div id="pane-upload">
		<h3>Upload History</h3>
		<?=form_open_multipart('upload', array('id'=>'file_upload'))?>
			<input type="hidden" name="path" value="" />
			<input type="file" name="file" multiple />
			<button>Upload</button>
			<div>Upload file(s)</div>
		<?=form_close()?>
		<a href="#" class="button negative right queue-clear">Clear History</a>
		<ul id="files" class="queue"></ul>
	</div>
	<!-- droppable region -->
	<div id="pane-download" class="droppable">
		<h3>Download Queue</h3>
		<?=form_open('download/zip', array('target'=>'_blank'))?>
		<a href="#" class="button primary left download-zip">Download .zip</a><a href="#" class="button negative right queue-clear">Clear Queue</a>
		<?=form_close()?>
		<ul class="queue"></ul>
	</div>
	<!-- end droppable region -->
	
</div>