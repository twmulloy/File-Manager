<?=form_open()?>
<?=form_close()?>

<div id="frame" > 
	
	<div class="content"> 

			<div id="c" class="partial">
				<div id="header">
					<div id="path">&nbsp;</div>
				</div>
				
				<span class="loading">Loading...</span>
				
				<a href="#" id="send-email-button" class="button" title="Send request for marketing file(s)"><span class="icon mail"></span>Send Request</a>
				
				<?=form_open('search', array('id'=>'searchbox'))?>
						<?=form_input(array('id'=>'search-input', 'name'=>'search', 'placeholder'=>'Search'))?>
						<?=form_submit(array('id'=>'search-submit','value'=>'Search'))?>
				<?=form_close()?>
				
				<?=$stack?>
				<div id="delete-stack"></div>
				<div id="rename-folder"></div>
				<div id="item-info"></div>
			</div><!-- end middle -->

			<div id="w" class="partial"> 
				<span class="loading">Loading...</span>
				<?=$tree?>
				<div id="create-folder"></div>
			</div><!-- end left -->

			<div id="e" class="partial"> 
				<span class="loading">Loading...</span>
				<?=$pane?>
			</div><!-- end right-->

		</div> 
	</div>
</div>

<div id="send-mail">
	<form>
		<ul>
			<li>
				<label>My email address</label>
				<input type="text" name="email" />
			</li>
			<li>
				<label>Request</label>
				<textarea name="message"></textarea>
			</li>
		</ul>
	</form>
</div>