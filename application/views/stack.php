<?php if(isset($dir_content)): ?>
<ul class="stack">
	<?php foreach($dir_content as $item): ?>
	<li class="<?=$item['type']?>" data-type="<?=$item['type']?>" data-name="<?=$item['name']?>" data-hash="<?=$item['hash']?>">
		
		<ul class="controls">
			<?php if($is_admin): ?>
			<li class="admin">
				<a href="#" title="Delete" class="icon delete"></a>
			</li>
			<?php endif; ?>
			<?php if($item['type'] == 'file'): ?>
			<li>
				<a href="#" title="Download" class="icon download"></a>
			</li>
			<?php endif; ?>
			<?php if($item['type'] == 'folder'): ?>
			<?php if($is_admin): ?>
			<li>
				<a href="#" title="Rename folder" class="icon rename"></a>
			</li>
			<?php endif; ?>
			<?php endif; ?>
		</ul>
		
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