function setFrameHeight(height){
	$('#frame').css({'height':height});
	$('.partial').css({'height':height});
	return false;
}

var globals = {
	originalIndex: 0,
	paneWidth: 0
};

$(function(){
	
	// hide loading
	$('.loading').hide();
	
	// set globals, most dimensions from css
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

	

	/* directory tree, left pane */
	var treePosition = 0;
	// move backward through tree
	$('.control .button.back', '#w').click(function(){
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
				// clear stack
				$('.stack', '#c').empty();
				// load previous ...
				
			});
		}	
		return false;
	});
	
	// move forward through tree
	$('.list a.folder', '#w').live('click', function(){
		
		// change button state
		$(this).addClass('active').find('.icon.folder').removeClass('folder').addClass('folder-open');
		
		var path = $(this).attr('href').replace(/^#/, ''),
			parent = $(this).closest('.partial');

		// push params
		params.push(
			{name:'path', value: path}
		);

		// get and load next tree layer
		$.ajax({
				url : '/partial/tree',
				data: params,
				type: 'post',
				dataType: 'json',
				beforeSend: function(){
					// trigger tree loading
					parent.find('.loading').show();
					// trigger stack loading
					$('.loading', '#c').show();
				},
				success: function(resp){
					// don't do anything with false
					if(!resp) return false;
					
					++treePosition;
					
					// append new list
					$('<ul/>').addClass('list').appendTo(parent).css({
						'left': 200
					});
					
					// empty stack list in main window, otherwise create it
					var stack = $('.stack', '#c');
					if(stack.length){ stack.empty(); }
					else{ stack = $('<ul/>').addClass('stack').appendTo('#c'); }
					
					// slide tree over
					parent.children('.list').animate({'left':'-=200'}, 250);
					$.each(resp, function(){
							// build new tree
							$('<li>').append(
								$('<a/>').attr({'href':'#'+this.relative_path+'/'+this.name}).addClass(this.type).html(this.name).prepend(
									$('<span/>').addClass('icon '+this.type)
								)
							).appendTo(parent.children('.list:last-child'));
							
							// since tree data is similar to stack data build stack using this same loop
							$('<li>').append(
								$('<span/>').addClass('icon '+this.type)
							).appendTo(stack);
							
					});
					
					// bind new stack
					bindStack();			
				},
				complete: function(){
					// end loading
					parent.find('.loading').hide();
					$('.loading', '#c').hide();
				}
		});

		return false;
	});
	
	// files in tree
	$('.list a.file', '#w').live('click', function(){
		alert('i am a file');
		return false;
	});
	
	// new folder
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
	
	// right panel
	$('.control .button', '#e').click(function(){
		var parent = $(this).closest('.partial'),
			index = $(this).index(),
			width = $('.pane > div', parent).width();
		
		// reset active pane
		$('.active', parent).removeClass('active');
		// set active
		$(this).addClass('active');
		
		// position proper pane
		$('.pane', parent).animate({
			'marginLeft': -index*width
		}, 500);

		return false;
	});
	
	// download queue pane is droppable
	$('#pane-download', '#e').droppable({
		accept: '#c .stack > li'
	});
	
	// enable dragging on stack items
	bindStack();
	
	function bindStack(){
		// stack items are draggable
		$('.stack > li', '#c').draggable({
			revert: true, 
			scroll: false,
			stack: '',
			zIndex: 1,
			helper: 'clone', // causing issues with redragging jquery 1.5 removes draggable class
			start: function(event, ui) {
				// record original pane position to global
				globals.originalIndex = $('.control .button.active', '#e').index();
				globals.paneWidth = $('.pane > div', '#e').width();

				// index of download pane
				var downloadIndex = $('.control .button.download', '#e').index(),
					margin = -downloadIndex * globals.paneWidth;
				// change to pane-download
				$('.pane', '#e').animate({
					'marginLeft': margin
				}, 500);

			},
			stop: function(event, ui) {
				var margin = -globals.originalIndex * globals.paneWidth;
				// scroll back to original pane
				$('.pane', '#e').animate({
					'marginLeft': margin
				}, 500);
			}
		}).disableSelection();		
		return false;
	}

	

	
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