<div class="control">
	<a class="button back" href="#"><span class="icon leftarrow"></span>Back</a>
	<?php if($is_admin): ?><a class="button dialog-inline" href="#create-folder"><span class="icon plus"></span>New Folder</a><?php endif; ?>
</div>
<h3>Folders</h3>
<ul class="list">
	<?php foreach($dir_content as $item): ?>
	<?php if($item['type'] == 'folder'): ?>
	<li data-name="<?=$item['name']?>"><a href="#<?=$item['name']?>" title="<?=$item['name']?>" class="<?=$item['type']?>" data-type="<?=$item['type']?>"><span class="icon <?=$item['type']?>"></span><?=$item['short_name']?><span class="count"><?=$item['count']?></span></a></li>
	<?php endif; ?>
	<?php endforeach; ?>
</ul>