<?=form_open()?>
<?=form_close()?>

<div id="frame" > 
	<div id="header">
		<div id="search"><?=form_input()?></div>
		<div id="path"></div>
	</div>
	
	<div class="content"> 

			<div id="c" class="partial"> 
				<span class="loading">Loading...</span>
				<?=$stack?>
				<div id="create-folder"></div>
			</div><!-- end middle -->

			<div id="w" class="partial"> 
				<span class="loading">Loading...</span>				
				<?=$tree?>
			</div><!-- end left -->

			<div id="e" class="partial"> 
				<span class="loading">Loading...</span>
				<?=$pane?>
			</div><!-- end right-->

		</div> 
	</div>
</div>