<?php if(isset($dir_content)): ?>
<ul class="stack">
	<?php foreach($dir_content as $item): ?>
	<?php #if($item['type'] == 'file'): ?>
	<li data-type="<?=$item['type']?>" data-name="<?=$item['name']?>">
		<span class="icon <?=$item['type']?>"></span>
		
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
<div class="silhouette">
	<p>Empty</p>
</div>
<?php endif; ?>