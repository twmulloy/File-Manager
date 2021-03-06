<!doctype html>  

<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<title>Marketing Files</title>
<meta name="description" content="">
<meta name="author" content="Thomas Mulloy">

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon" href="/favicon.ico">

<?=$this->load->view('layout/stylesheets')?>
	
<script src="js/libs/modernizr-1.6.min.js"></script>
	
<script>
<?php if($is_admin): ?>
var is_admin = true;
<?php else: ?>	
var is_admin = false;
<?php endif; ?>

</script>

<?=$this->load->view('layout/scripts')?>
	
</head>

<body class="admin <?=$this->router->class?>">
	
	<?=$this->load->view('layout/notifications')?>
	
	<div id="container">
		
		<div id="main">
			<?php if(isset($partial)): ?>
			<?=$partial?>
			<?php endif; ?>
		</div>
		
		<?=$this->load->view('layout/footer')?>
	</div> <!-- end of #container -->	
</body>
</html>