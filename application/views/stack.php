<?php if(isset($dir_content)): ?>
<ul class="stack">
	<?php foreach($dir_content as $item): ?>
	<?php #if($item['type'] == 'file'): ?>
	<li data-type="<?=$item['type']?>" data-name="<?=$item['name']?>" data-hash="<?=$item['hash']?>">
		<span class="icon type <?=$item['type']?>"></span>
		
		<div class="visual">
		<?php if(isset($item['thumb']) && $item['thumb']['path']): ?>
			<img src="<?=$item['thumb']['path']?>" />
		<?php endif; ?>
		</div>
		
		
		<ul class="controls">
			<li><a href="#" class="icon delete"></a></li>
		</ul>
		<ul class="details">
			<li><?=$item['name']?></li>
			<li><?=$item['size']?></li>
			<li><?=$item['date']?></li>
		</ul>

	</li>
	<?php #endif; ?>
	<?php endforeach; ?>
</ul>
<?php else: ?>
<p>Empty</p>
<?php endif; ?>