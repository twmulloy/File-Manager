<?=form_open()?>
<?=form_close()?>

<div id="frame" > 
	<div id="header">
		<ul>
			<li id="search"><?=form_input()?></li>
			<li id="path">some/current/path</li>
		</ul>
	</div>
	
	<div class="content"> 

			<div id="c" class="partial"> 
				<span class="loading">Loading...</span>
				<?=$stack?>
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
	<div id="create-folder"></div>
	<div id="confirm-delete-stack"></div>
	<div id="confirm-delete-download"></div>
</div>