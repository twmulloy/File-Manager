function setFrameHeight(height){
	$('#frame').css({'height':height});
	$('.partial').css({'height':height});
	return false;
}

// clean up and set the path
function cleanPath(path){
	var clean = path;
	// prep path
	if(clean){
		clean = clean.replace(/(^storage(\/)?)?/gi, '');
	}else{
		clean = '';
	}
	return clean;
}
function setPath(path){
	var clean = cleanPath(path);
	
	$.bbq.pushState({'!':clean});
	
	if(clean){
		clean = clean.replace(/\//gi, '<span class="slash">/</span>');
	}
	return $('#path', '#frame').html(clean);
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
				.append($('<li/>').append($('<a/>').attr({'class':'icon delete', 'href':'#'})))
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
		
		// set current upload path
		$('input[name="path"]').val(params.path);
		
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
	
	// move forward via folder in stack double click
	$('.stack', '#c').dblclick(function(){
		alert('sup');
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
		// set current upload path
		$('input[type="hidden"][name="path"]', '#e').val(params.path);
			
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
			$('<li/>').attr({
					'data-hash':hash,
					'data-type':type
				}).append(
					$('<span/>').attr({'class':'icon '+type})
				)
				.append(
					$('<ul/>').attr({'class':'controls'}).append(
						$('<li/>').append(
							$('<a/>').attr({'class':'icon delete', 'href':'#'})
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
	
	// remove from queue
	$('a.delete', '.queue').live('click', function(){
		$(this).closest('*[data-type]').fadeOut('fast', function(){
			$(this).remove();
		});
		return false;
	});
	
	$('a.delete', '#c, #w').live('click', function(){
		alert('delete an item');
		
		$.ajax({
			type: 'delete',
			url: appPath + 'xhr/delete',
			data: params,
			dataType: 'json',
			success: function(resp){
				console.log(resp);
			}
			
			
		});
		
		return false;
	});

	// css3 submit buttons
	$('.submit').click(function(){
		var form = $(this).closest('form'),
				url = window.location.href,
				data = form.serializeArray();
				
		$.post(url, data);
		return false;
	});
	
	/* upload */
	$('#file_upload').fileUploadUI({
		uploadTable: $('#files'),
		downloadTable: $('#files'),
		buildUploadRow: function (files, index) {
			return $('<li/>')
				.html(files[index].name)
				.append(
					$('<div/>')
						.addClass('file_upload_progress')
						.append(
							$('<div/>')
						)
				)
				.append(
					$('<div/>')
						.addClass('file_upload_cancel')
						.append(
							$('<a/>')
								.attr({
									'class':'button pill'
								})
								.html('Cancel')
						)
				);
			},
			buildDownloadRow: function(file){
				if(file.status !== 'success'){
					/*
					$.gritter.add({
						title: 'Error',
						text: '<strong>'+file.data.name+'</strong> ' + file.explain,
						image: appPath + 'css/img/icons/exclamation.png'
					});
					*/
					
					return $('<li/>')
						.html('<span class="icon file-error"></span>' + file.data.name + file.explain);
				}
				return $('<li/>')
					.html('<span class="icon file"></span>'+file.data.file_name);
			},
			onComplete: function (event, files, index, xhr, handler) {
				handler.onCompleteAll(files);
			},
			onAbort: function (event, files, index, xhr, handler) {
				handler.removeNode(handler.uploadRow);
				handler.onCompleteAll(files);
			},
			onCompleteAll: function (files) {
				// The files array is a shared object between the instances of an upload selection.
				// We extend it with a uploadCounter to calculate when all uploads have completed:
				if (!files.uploadCounter) {
				    files.uploadCounter = 1;  
				} else {
				    files.uploadCounter = files.uploadCounter + 1;
				}
				if (files.uploadCounter === files.length) {
				    /* your code after all uplaods have completed */
						
						// refresh current tree/stack
						$.post(appPath + 'partial/tree', params, function(json){
							var stack = $('.stack', '#c');
								
							stack.empty();
							
							$.each(json, function(){
								buildStack(this, stack);
							});
							
							bindStack();
							
							$.gritter.add({
								title: 'Done',
								text: 'Upload finished',
								image: ''
							});
							
						}, 'json');
						
				}
			}
	});
	
	/* clear download queue */
	$('.button.queue-clear', '#pane-download').click(function(){
		var form = $(this).closest('form');
		// dom list
		$('ul.queue > li', '#pane-download').remove();
		// reset form
		$(form).children('input[type="hidden"]').remove();
		
		$.gritter.add({
			title: 'Success',
			text: 'Download queue cleared'
		});
		
		return false;
	});
	
	/* magical zip */
	$('.button.download-zip', '#e').click(function(){
		var domQueue = $('ul.queue > li', '#pane-download'),
			queue = [],
			form = $(this).closest('form');
			
		// nothing in queue
		if(!domQueue.length){
			return $.gritter.add({
				title: 'Alert',
				text: 'Download queue is empty',
				image: appPath + 'css/img/icons/exclamation.png'
			});
		}

		// clear form for new queue
		$(form).children('input[type="hidden"]').remove();
		
		// build download queue
		$.each(domQueue, function(index){
			
			$('<input/>').attr({
					'type':'hidden',
					'name':'data[queue]['+index+'][hash]'
				}).val($(this).data('hash')).appendTo(form);
			
			$('<input/>').attr({
					'type':'hidden',
					'name':'data[queue]['+index+'][type]'
				}).val($(this).data('type')).appendTo(form);
				
			// remove item from queue
			/*
			$(this).fadeOut(function(){
				$(this).remove();
			});
			*/

		});

		// submit the queue
		$(form).submit();
		return false;
	});
});