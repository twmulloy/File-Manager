<div class="control">
	<a class="button left back" href="#"><span class="icon leftarrow"></span>Back</a><a class="button right dialog-inline" href="#create-folder"><span class="icon plus"></span>New Folder</a>
</div>
<h3>Folders</h3>
<div id="create-folder"></div>
<ul class="list">
	<?php foreach($dir_content as $item): ?>
	<li><a href="#<?=$item['name']?>" class="<?=$item['type']?>"><span class="icon <?=$item['type']?>"></span><?=ellipsize($item['name'], 18, .6)?></a></li>
	<?php endforeach; ?>
</ul>