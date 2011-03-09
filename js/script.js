$(function(){
	
	// start params object with needed csrf
	var params = $('input[name^="csrf_token_"]').closest('form').serializeArray();

	// get requested path
	$('.directory').live('click', function(){
		var path = $(this).attr('href').replace(/^#/, ''),
			parent = $(this).closest('.partial');
			
		// push params
		params.push(
			{name:'path', value: path}
		);
		
		$.ajax({
				url : '/partial/tree',
				data: params,
				type: 'post',
				dataType: 'json',
				success: function(resp){
					// build new tree
					$.each(resp, function(){
						$('<li>').append($('<a/>').html(this.name)).appendTo(parent.find('.list'));
					});
				}
		});
		
		return false;
	});

/*
	var area = '.partial',
		loading = '.loading';

	// cache
	$(area).each(function(){
		$(this).data('partial', {
			cache: {
				
			}
		});
	});

	// push state to history
	$('a[href^=#]', area).live( 'click', function(e){
		var state = {},
			id = $(this).closest(area).attr('id'),
			url = $(this).attr('href').replace(/^#/, '');

		// Set the state
		state[id] = url;
		$.bbq.pushState(state);
		return false;
	});
	
	// hashchange
	$(window).bind( 'hashchange', function(e) {
		$(area).each(function(){
			var that = $(this),
				data = that.data('partial'),
				url = $.bbq.getState( that.attr( 'id' ) ) || '';
				
			// do nothing if hash unchanged
			if ( data.url === url ) { return; }
			
			// Store the url for the next time around.
			data.url = url;
		});
	});
	
	$(window).trigger( 'hashchange' );
	
	*/

	// handle static notifications
	$('.notifications').notify();

	// css3 submit buttons
	$('.submit').click(function(){
		var form = $(this).closest('form'),
				url = window.location.href,
				data = form.serializeArray();
				
		$.post(url, data);
		return false;
	});
	
	
	
});