<?=form_open()?>
<?=form_close()?>

<div id="frame" class="colmask"> 
	<div id="header">
		<ul>
			<li><?=form_input()?></li>
			<li>some/current/path</li>
			<li>zoom slider?</li>
		</ul>
	</div>
	<div class="colmid"> 
		<div class="colleft"> 
			
			<div class="col1wrap"> 
				<div id="c" class="col1 partial"> 
					<span class="loading">Loading...</span>
					<?=$stack?>
				</div><!-- end middle -->
			</div> 
			
			<div id="w" class="col2 partial"> 
				<span class="loading">Loading...</span>				
				<?=$tree?>
			</div><!-- end left -->
			
			<div id="e" class="col3 partial"> 
				<span class="loading">Loading...</span>
				<?=$pane?>
				
			</div><!-- end right-->
			
		</div> 
	</div> 
</div>