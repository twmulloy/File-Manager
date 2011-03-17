<div class="control">
	<a class="button left information active" href="#"><span class="icon book"></span>Info.</a><a class="button middle upload" href="#"><span class="icon uparrow"></span>Upload</a><a class="button right download" href="#"><span class="icon downarrow"></span>Download</a>
</div>

<div class="pane">
	<div id="pane-info">
		<h3>Information</h3>
		

	</div>

	<div id="pane-upload">
		<h3>Upload Queue</h3>
		<ul id="files" class="queue"></ul>
		<form id="file_upload" action="upload.php" method="POST" enctype="multipart/form-data">
		    <input type="file" name="file" multiple>
		    <button>Upload</button>
		    <div>Upload files</div>
		</form>
		<script>
		/*global $ */
		$(function () {
		    $('#file_upload').fileUploadUI({
		        uploadTable: $('#files'),
		        downloadTable: $('#files'),
		        buildUploadRow: function (files, index) {
		            return $('<li/>').html(files[index].name)
													.append(
														$('<div/>').addClass('file_upload_progress')
															.append($('<div/>'))
													)
													.append(
														$('<div/>').addClass('file_upload_cancel')
															.append(
																$('<button/>').attr({
																	'class':'ui-state-default ui-corner-all',
																	'title':'Cancel'
																}).append(
																		$('<span/>').attr({
																			'class':'ui-icon ui-icon-cancel'
																		}).html('Cancel')
																	)
															)
													);
		        },
		        buildDownloadRow: function (file) {
		            return $('<li/>').html(file.name);
		        }
		    });
		});
		</script>
	</div>

	<!-- droppable region -->
	<div id="pane-download" class="droppable">
		<h3>Download Queue</h3>
		<ul class="queue"></ul>
		<?=form_open('download/zip', array('target'=>'_blank'))?>
		<a href="#" class="button primary left download-zip">Download *.zip</a><a href="#" class="button negative right queue-clear">Clear Queue</a>
		<?=form_close()?>
	</div>
	<!-- end droppable region -->
</div>