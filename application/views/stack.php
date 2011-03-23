<?php if(isset($dir_content)): ?>
<ul class="stack">
	<?php foreach($dir_content as $item): ?>
	<?php #if($item['type'] == 'file'): ?>
	<li class="<?=$item['type']?>" data-type="<?=$item['type']?>" data-name="<?=$item['name']?>" data-hash="<?=$item['hash']?>">
		<div class="visual">
		<?php if(isset($item['thumb']) && $item['thumb']['path']): ?>
			<img src="<?=$item['thumb']['path']?>" />
		<?php endif; ?>
		</div>
		<ul class="details">
			<li><a href="#" title="<?=$item['name']?>" class="name"><?=$item['short_name']?></a></li>
			<li><?=$item['formatted_size']?></li>
			<li class="admin controls"><a href="#" class="icon delete"></a></li>
		</ul>
	</li>
	<?php #endif; ?>
	<?php endforeach; ?>
</ul>
<?php else: ?>
<p>Empty</p>
<?php endif; ?>