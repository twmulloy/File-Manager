<h3>Directories</h3>

<ul class="list">
	<?php foreach($dir_content as $item): ?>
	<li><a href="#<?=$item['name']?>" class="directory"><span class="icon"></span><?=$item['name']?></a></li>
	<?php endforeach; ?>
</ul>