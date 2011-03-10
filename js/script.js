function setFrameHeight(height){
	$('#frame').css({'height':height});
	$('.partial').css({'height':height});
	return false;
}

$(function(){
	
	// hide loading
	$('.loading').hide();
	
	// start params object with needed csrf
	var params = $('input[name^="csrf_token_"]').closest('form').serializeArray();

	// handle static notifications
	$('.notifications').notify();
	
	
	/* layout */
	// set initial height
	setFrameHeight($(document).height());
	// bind onresize
	$(window).resize(function(){
		setFrameHeight($(this).height());
	});

	

	/* directory tree */
	var treePosition = 0;
	// move backward through tree
	$('.button.back').click(function(){
		var parent = $(this).closest('.partial'),
				tree = parent.children('.list');
				
		//reset all active
		$('.active.folder', parent).removeClass('active').find('.icon.folder-open').removeClass('folder-open').addClass('folder');

		// slide tree over if tree is not at root
		if(treePosition){ 
			--treePosition;
			tree.animate({'left':'+=200'}, 250, function(){
				// remove forward tree
				tree.eq(treePosition + 1).remove();
			});
		}	
		return false;
	});
	
	// move forward through tree
	$('a.folder', '.list').live('click', function(){
		
		// change button state
		$(this).addClass('active').find('.icon.folder').removeClass('folder').addClass('folder-open');
		
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
				beforeSend: function(){
					parent.find('.loading').show();
				},
				success: function(resp){

					// don't do anything with false
					if(!resp) return false;
					
					++treePosition;
					
					// append new list
					$('<ul/>').addClass('list').appendTo(parent).css({
						'left': 200
					});
					
					// slide tree over
					parent.children('.list').animate({'left':'-=200'}, 250);
					// build new tree
					$.each(resp, function(){
							$('<li>').append(
								$('<a/>').attr({'href':'#'+this.relative_path+'/'+this.name}).addClass(this.type).html(this.name).prepend(
									$('<span/>').addClass('icon '+this.type)
								)
							).appendTo(parent.children('.list:last-child'));
					});
				},
				complete: function(){
					parent.find('.loading').hide();
				}
		});

		return false;
	});
	
	// files in tree
	$('a.file', '.list').live('click', function(){
		alert('i am a file');
		return false;
	});
	
	
	$('.dialog-inline').inlineDialog({
		content: $('<input/>'),
		buttons: {
			'Add': function(){
				//$(this).inlineDialog('close');
			},
			'Cancel':function(){
				$(this).inlineDialog('close');
			}
		}
	});
	
	// css3 submit buttons
	$('.submit').click(function(){
		var form = $(this).closest('form'),
				url = window.location.href,
				data = form.serializeArray();
				
		$.post(url, data);
		return false;
	});
	
});

/* hashchange */
$(function(){
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
});