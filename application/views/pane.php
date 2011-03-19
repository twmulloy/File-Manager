<div class="control">
	<a class="button left information active" href="#"><span class="icon book"></span>Info.</a><a class="button middle upload" href="#"><span class="icon uparrow"></span>Upload</a><a class="button right download" href="#"><span class="icon downarrow"></span>Download</a>
</div>

<div class="pane">
	<div id="pane-info">
		<h3>Information</h3>
		

	</div>

	<div id="pane-upload">
		<h3>Upload History</h3>
		<ul id="files" class="queue"></ul>
		<?=form_open_multipart('upload', array('id'=>'file_upload'))?>
			<input type="hidden" name="path" value="" />
			<input type="file" name="file" multiple />
			<button>Upload</button>
			<div>Upload file(s)</div>
		<?=form_close()?>
	</div>

	<!-- droppable region -->
	<div id="pane-download" class="droppable">
		<h3>Download Queue</h3>
		<ul class="queue"></ul>
		<?=form_open('download/zip', array('target'=>'_blank'))?>
		<a href="#" class="button primary left download-zip">Download .zip</a><a href="#" class="button negative right queue-clear">Clear Queue</a>
		<?=form_close()?>
	</div>
	<!-- end droppable region -->
</div>