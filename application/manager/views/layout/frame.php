<?=form_open()?>
<?=form_close()?>

<div id="frame" > 
	<div id="header">
		<ul>
			<li><?=form_input()?></li>
			<li>some/current/path</li>
			<li>zoom slider?</li>
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
</div>