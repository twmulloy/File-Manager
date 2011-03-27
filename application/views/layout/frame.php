<?=form_open()?>
<?=form_close()?>

<div id="frame" > 
	<div id="header">
		<div id="path">&nbsp;</div>
	</div>
	
	<div class="content"> 

			<div id="c" class="partial"> 
				<span class="loading">Loading...</span>
				<?=form_open('search', array('id'=>'searchbox'))?>
						<?=form_input(array('id'=>'search-input', 'name'=>'search', 'placeholder'=>'Search'))?>
						<?=form_submit(array('id'=>'search-submit','value'=>'Search'))?>
				<?=form_close()?>
				<?=$stack?>
				<div id="delete-stack"></div>
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