<?php if(isset($dir_content)): ?>
<ul class="stack">
	<?php foreach($dir_content as $item): ?>
	<li class="<?=$item['type']?>" data-type="<?=$item['type']?>" data-name="<?=$item['name']?>" data-hash="<?=$item['hash']?>">
		<span class="admin controls"><a href="#" title="Delete" class="icon delete"></a><?php if($item['type'] == 'folder'):?><a href="#" title="Rename folder" class="icon rename"></a><?php endif; ?></span>
		<div class="visual">
		<?php if(isset($item['thumb']) && $item['thumb']['path']): ?>
			<img src="<?=$item['thumb']['path']?>" />
		<?php endif; ?>
		</div>
		<ul class="details">
			<li><a href="#" title="<?=$item['name']?>" class="name"><?=$item['short_name']?></a></li>
			<?php if($item['type'] == 'folder'): ?>
			<li><?=$item['count']?> Item<?php if($item['count']!=1) echo 's';?></li>
			<?php else: ?>
			<li><?=$item['formatted_size']?></li>
			<?php endif; ?>
		</ul>
	</li>
	<?php endforeach; ?>
</ul>
<?php else: ?>
<p>Empty</p>
<?php endif; ?>