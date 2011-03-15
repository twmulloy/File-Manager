function setFrameHeight(height){
	$('#frame').css({'height':height});
	$('.partial').css({'height':height});
	return false;
}

// clean up and set the path
function setPath(path){
	// prep path
	if(path){
		path = path.replace(/(^storage(\/)?)?/gi, '');
		path = path.replace(/\//gi, '<span class="slash">/</span>');
	}else{
		path = null;
	}

	return $('#path', '#frame').html(path);
}

// maintain dom consistency
function buildStack(data, appendTo){
	// only files
	//if(data.type !== 'file'){ return false; }
	
	return $('<li>').attr({
				'data-type':data.type, 
				'data-name':data.name,
				'data-hash':data.hash
			}).append(
			$('<span/>').addClass('icon '+data.type)
		)
		.append(
			$('<ul/>').addClass('controls')
				.append($('<li/>').append($('<a/>').attr({'class':'icon delete'})))
		)
		.append(
			$('<ul/>').addClass('details')
				.append($('<li/>').html(data.name))
				.append($('<li/>').html(data.size))
				.append($('<li/>').html(data.date))
		)
		.appendTo(appendTo);
}

function buildTree(data, appendTo){
	// only folders
	if(data.type !== 'folder'){ return false; }
	// build new tree
	return $('<li>').attr('data-name',data.name).append(
		$('<a/>')
			.attr({
				'href':'#'+data.relative_path+'/'+data.name,
				'data-type':data.type
			})
			.addClass(data.type)
			.html(data.name)
			.prepend(
				$('<span/>').addClass('icon '+data.type)
		)
	).appendTo(appendTo);
}

function bindStack(){
	// stack items are draggable
	$('.stack > li', '#c').draggable({
		revert: true, 
		scroll: false,
		stack: '.stack',
		zIndex: 2,
		helper: function(event){
			var that = $(this);
			// build a better helper
			return $('<li/>').attr({
				'data-type':that.data('type'),
				'data-name':that.data('name')
			})
			.append(that.find('span.icon').clone())
			.append(that.find('.details').clone());
		},
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
			}, 500, function(){
				// do something when done
			});

		},
		stop: function(event, ui) {
			var margin = -globals.originalIndex * globals.paneWidth;
			// scroll back to original pane
			$('.pane', '#e').animate({
				'marginLeft': margin
			}, 500);
		}
	})
	.disableSelection();
	return false;
}

var globals = {
	originalIndex: 0,
	paneWidth: 0,
	curDir: '', // current directory
	trail: [] // root of storage directory
};

$(function(){

	// hide loading
	$('.loading').hide();
	
	// set globals, most dimensions from css
	// start params object with needed csrf
	var params = {
			csrf_token_manager : $('input[name^="csrf_token_"]').val(),
			path : globals.curDir,
			crud : null,
			data : {} 
		},
		appPath = window.location.pathname;

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
			});
		}else{
			// reset dirs
			globals.curDir = '';
			globals.trail = [];
		}
		
		// grab last trail and remove
		params.path = globals.curDir = globals.trail.pop();
		
		$.ajax({
			url: appPath + 'partial/tree',
			data: params,
			type: 'post',
			dataType: 'json',
			beforeSend: function(){
				// trigger stack loading
				$('.loading', '#c').show();
			},
			success: function(resp){
				// don't do anything with false
				if(!resp) return false;

				// empty stack list in main window, otherwise create it
				var stack = $('.stack', '#c');
				if(stack.length){ stack.empty(); }
				else{ stack = $('<ul/>').addClass('stack').appendTo('#c'); }

				$.each(resp, function(){
					buildStack(this, stack);
				});
				
				// bind new stack
				bindStack();			
			},
			complete: function(){
				// end loading
				$('.loading', '#c').hide();
				setPath(globals.curDir);
			}
		});
		
		return false;
	});
	
	// move forward through tree
	$('.list a.folder', '#w').live('click', function(){
		
		// change button state
		$(this).addClass('active').find('.icon.folder').removeClass('folder').addClass('folder-open');
		
		var path = $(this).attr('href').replace(/^#/, ''),
			parent = $(this).closest('.partial'),
			type = $(this).data('type');
			
		if(!path || !type){ return alert('path or type error'); }
		
		// push params
		params.path = path;
			
		// set previous folder history
		if(type == 'folder'){
			globals.trail.push(globals.curDir);
			globals.curDir = path;
		}
		
		// get and load next tree layer
		$.ajax({
				url : appPath + 'partial/tree',
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
						buildTree(this, parent.children('.list:last-child'));
						buildStack(this, stack);	
					});
					
					// bind new stack
					bindStack();			
				},
				complete: function(){
					// end loading
					parent.find('.loading').hide();
					$('.loading', '#c').hide();
					
					// set path
					setPath(globals.curDir);
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
		content: $('<input/>').attr({'placeholder':'Name'}),
		buttons: {
			'Cancel':function(){
				$(this).inlineDialog('close');
			},
			'Add': function(){
				var folder = $('.ui-inline-dialog-content').find('input').val(),
					that = this;
				
				// alert notification
				if(!folder){
					return $.gritter.add({
						title: 'Alert',
						text: 'Folder name is required',
						image: appPath + 'css/img/icons/folder-exclamation.png'
					});
				}
				
				var thisParams = params;
				thisParams.crud = 'create';
				thisParams.data = {
					item : 'folder',
					name : folder
				};
				
				// create new folder
				$.ajax({
					url: appPath + 'xhr/create',
					data: thisParams,
					type: 'post',
					dataType: 'json',
					success: function(resp){	
						if(resp.status === 'fail'){
							return $.gritter.add({
								title: 'Error',
								text: 'Folder could not be created',
								image: appPath + 'css/img/icons/folder-exclamation.png'
							});
						}
						
						if(typeof resp.data === 'object' && resp.status === 'success'){
							
							$(that).inlineDialog('close');
							
							// refresh current tree/stack
							$.post(appPath + 'partial/tree', params, function(json){
								var stack = $('.stack', '#c'),
									tree = $('.list:eq('+treePosition+')', '#w');
									
								stack.empty();
								tree.empty();
								
								$.each(json, function(){
									buildTree(this, tree);
									buildStack(this, stack);
								});
								
								bindStack();
								
							}, 'json');
							
							$.gritter.add({
								title: 'Success',
								text: 'Folder <strong>'+resp.data.name+'</strong> has been created',
								image: appPath + 'css/img/icons/folder-plus.png'
							});
							
							
						}
					},
					error: function(){
						return $.gritter.add({
							title: 'Error',
							text: 'Folder already exists',
							image: appPath + 'css/img/icons/folder-exclamation.png'
						});
					},
					complete: function(){
					}
				});
				
			}
		}
	});
	
	// right panel
	$('.control .button', '#e').click(function(){
		var parent = $(this).closest('.partial'),
			index = $(this).index(),
			width = $('.pane > div', parent).width()
			that = this;
				
		// position proper pane
		$('.pane', parent).animate({
			'marginLeft': -index*width
		}, 500, function(){
			// reset active pane
			$('.active', parent).removeClass('active');
			// set active
			$(that).addClass('active');
		});

		return false;
	});
	
	// enable dragging on stack items
	bindStack();
	
	// download queue pane is droppable
	$('#pane-download', '#e').droppable({
		accept: '#c .stack > li',
		hoverClass: 'drophover',
		activeClass: 'dropactive',
		over: function(event, ui){
			//console.log(event, ui);
		},
		drop: function(event, ui){
			
			// clone but remove residual draggable stuff
			var item = ui.draggable.clone(),
				type = item.data('type'),
				name = item.data('name'),
				hash = item.data('hash'),
				list = $(this).find('.queue');
			
			// check if hash exists in list, deny if it does
			if(list.find('*[data-hash="'+hash+'"]').length){
				// notify of collision
				return $.gritter.add({
					title: 'Alert',
					text: type + ' <strong>' + name + '</strong> is already in download queue',
					image: appPath + 'css/img/icons/exclamation.png'
				});
			}
				
			// build new item
			$('<li/>').attr({'data-hash':hash}).append(
					$('<span/>').attr({'class':'icon '+type})
				)
				.append(
					$('<ul/>').attr({'class':'controls'}).append(
						$('<li/>').append(
							$('<a/>').attr({'class':'icon delete','href':'#confirm-delete-download'})
						)
					)
				)
				.append(item.find('.details'))
				.appendTo(list)
				.effect('highlight');
			
			// notify
			$.gritter.add({
				title: 'Success',
				text: 'Added ' + type + ' <strong>' + name + '</strong> to download queue',
				image: appPath + 'css/img/icons/plus-circle.png'
			});
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