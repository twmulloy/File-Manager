<?php if(isset($stack)): ?>
<ul class="stack">
	<?php foreach($stack as $item): ?>
	<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
	<?php endforeach; ?>
</ul>
<?php else: ?>
<div class="silhouette">
	<p>No contents</p>
</div>
<?php endif; ?>