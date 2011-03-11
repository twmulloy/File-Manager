<?php if(isset($dir_content)): ?>
<ul class="stack">
	<?php foreach($dir_content as $item): ?>
	<li>
		<span class="icon <?=$item['type']?>"></span>
		<?=$item['name']?>
	</li>
	<?php endforeach; ?>
</ul>
<?php else: ?>
<div class="silhouette">
	<p>Empty</p>
</div>
<?php endif; ?>