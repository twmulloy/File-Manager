function setFrameHeight(height){
	var headerHeight = $('#header', '#frame').height();
	
	$('#frame').css({'height':height});
	// pushed down by header
	$('.partial', '#frame').css({'height':height-headerHeight});
	// pushed down by header, controls (the extra 30)
	$('.pane > div', '#frame').css({'height':height-headerHeight-30});
	return height;
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
	
	// set current upload path
	$('input[name="path"]').val(clean);
	
	if(clean){
		clean = clean.replace(/\//gi, '<span class="slash">/</span>');
	}
	
	return $('#path', '#frame').html(clean);
}

// maintain dom consistency
function buildStack(data, appendTo){
	// only files
	//if(data.type !== 'file'){ return false; }
	var visual = $('<div/>').addClass('visual'),
		details = $('<ul/>')
			.addClass('details')
			.append(
				$('<li/>')
					.append(
						$('<a/>')
						.attr({
							'href':'#', 
							'title':data.name, 
							'class':'name'
						})
						.html(data.short_name)
					)
			)
			
	switch(data.type){
		case 'folder':
			var verbiage = ' Items';
			if(data.count == 1){ verbiage = ' Item'}
			
			details.append(
				$('<li/>').html(data.count + verbiage)
			);
			break;
			
		case 'file':
		default:
			details.append(
				$('<li/>').html(data.formatted_size)
			);
			break;
	}

			
	// if admin logic here..
	var controls = $('<span/>')
		.attr({
			'class':'admin controls'
		})
		.append(
			$('<a/>')
				.attr({
					'class':'icon delete',
					'href':'#'
				})
		);
	
	if(typeof data.thumb === 'object'){
		visual = visual.append(
			$('<img>').attr({
				'src':data.thumb.path
			})
		);
	}

	
	return $('<li>')
		.append(controls)
		.attr({
				'data-type':data.type, 
				'data-name':data.name,
				'data-hash':data.hash,
				'class':data.type
		})
		.append(visual)
		.append(details)
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
				'data-type':data.type,
				'title':data.name
			})
			.addClass(data.type)
			.html(data.short_name)
			.append(
				$('<span/>').addClass('count').html(data.count)
			)
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
		helper: function(){
			var that = $(this);
			// build a better helper
			return $('<li/>').attr({
				'data-type':that.data('type'),
				'data-name':that.data('name'),
				'class':that.data('type')+' drag'
			})
			.append(that.find('.visual').clone())
			.append(that.find('.name').clone());
		},
		start: function(event, ui) {
			/*
			// record original pane position to global
			globals.originalIndex = $('.control .button.active', '#e').index();
			globals.paneWidth = $('.pane > div', '#e').width();

			// index of download pane
			var downloadIndex = $('.control .button.download', '#e').index(),
				margin = -downloadIndex * globals.paneWidth;

			// change to pane-download
			$('.pane', '#e').animate({
				'left': margin
			}, 500, function(){
				// do something when done
			});
			*/

		},
		stop: function(event, ui) {
			/*
			var margin = -globals.originalIndex * globals.paneWidth;
			// scroll back to original pane
			$('.pane', '#e').animate({
				'left': margin
			}, 500);
			*/
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
	
	setPath('');

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
		appPath = window.location.pathname,
		height = setFrameHeight($(document).height()),	// set initial height
		gritterTimeout = 1000;

	// handle static notifications
	$('.notifications').notify();
	
	
	/* layout */
	// bind onresize
	$(window).resize(function(){
		height = setFrameHeight($(this).height());
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
				if(stack.length){ 
					stack.empty(); 
					tree.empty(); 
				}else{ 
					stack = $('<ul/>').addClass('stack').appendTo('#c'); 
				}
				$.each(resp, function(){
					buildTree(this, parent.children('.list').eq(treePosition));
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
	
	// information dialog
	$( "#item-info" ).dialog({
		autoOpen: false,
		position: [50,50],
		width: 'auto',
		height: 'auto',
		title: 'Information &mdash; [esc] to close',
		open: function(event, ui){
			var thisParams = params,
				that = $(this);
				
			// clear
			that.empty();
			
			thisParams.data = {
				'hash':that.data('hash')
			};
			// load in information
			$.ajax({
				url: appPath + 'partial/info',
				type: 'post',
				dataType: 'json',
				data: thisParams,
				success: function(resp){
					if(!resp && typeof resp !== 'object'){ return false; }
					
					var visual = '';
					
					if(resp.is_image){
						visual = $('<img/>').attr({
							'src':resp.image.path
						})
					}
					
					$('<div/>')
						.addClass('visual')
						.append(visual)
						.appendTo(that);
					
					$('<ul/>')
						.append($('<li/>').html(resp.name))
						.append($('<li/>').html(resp.formatted_size))
						.append($('<li/>').html(resp.formatted_date))
						.appendTo(that);
					
				}
			})
		},
		buttons: {	
			Close: function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
	// open details
	$('li.file', '#c .stack').live('dblclick', function(){
		// set the dialog information
		var item = $(this),
			hash = item.data('hash'),
			dialogInfo = $( "#item-info" );
		
		// close any existing dialog
		dialogInfo.dialog('close');
			
		dialogInfo.data('hash', hash).dialog('open');
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
	
	// new folder
	$('.dialog-inline').inlineDialog({
		content: $('<input/>').attr({'placeholder':'Name'}),
		buttons: {
			'Cancel':function(){
				$(this).inlineDialog('close');
			},
			'Add': function(){
				var input = $('.ui-inline-dialog-content').find('input'),
					folder = input.val(),
					that = this;
				
				// alert notification
				if(!folder){
					return $.gritter.add({
						title: 'Alert',
						text: 'Folder name is required',
						image: appPath + 'css/img/icons/48x48/attention.png',
						time: gritterTimeout
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
								image: appPath + 'css/img/icons/48x48/cancel.png',
								time: gritterTimeout
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
								image: appPath + 'css/img/icons/48x48/folder_plus.png',
								time: gritterTimeout
							});
							
							
						}
					},
					error: function(){
						return $.gritter.add({
							title: 'Error',
							text: 'Folder already exists',
							image: appPath + 'css/img/icons/48x48/attention.png',
							time: gritterTimeout
						});
					},
					complete: function(){
						// reset dialog
						input.val('');
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
				short_name = item.find('.name').html(),
				list = $(this).find('.queue');
			
			// check if hash exists in list, deny if it does
			if(list.find('*[data-hash="'+hash+'"]').length){
				// notify of collision
				return $.gritter.add({
					title: 'Alert',
					text: type + ' <strong>' + name + '</strong> is already in download queue',
					image: appPath + 'css/img/icons/48x48/attention.png',
					time: gritterTimeout
				});
			}
				
			// build new item
			$('<li/>')
					.attr({
						'data-hash':hash,
						'data-type':type
					})
					.append(
						$('<span/>').attr({'class':'icon '+type})
					)
					.append(
						$('<a/>').attr({'class':'icon delete', 'href':'#'})
					)
					.append(short_name)
					.appendTo(list)
					.effect('highlight');
			
			// notify
			$.gritter.add({
				title: 'Success',
				text: 'Added ' + type + ' <strong>' + name + '</strong> to download queue',
				image: appPath + 'css/img/icons/48x48/download.png',
				time: gritterTimeout
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
	
	/* delete item from stack */
	$( "#delete-stack" ).dialog({
		autoOpen: false,
		resizable: false,
		position: ['center', 50],
		draggable: false,
		modal: true,
		title: 'Confirm',
		minWidth: 384,
		maxWidth: 512,
		open: function(event, ui){
			$(this).empty();
			
			if($(this).data('type') === 'folder'){
				$(this).append($('<p/>').html('Delete folder <strong>' + $(this).data('name')+'</strong> and all contents?'));
			}else{
				$(this).append($('<p/>').html('Delete file <strong>' + $(this).data('name')+'</strong>?'));
			}
			
		},
		buttons: {
			
			'No': function() {
				$(this).dialog( "close" );
			},
			
			'Yes': function(){
				var hash = $(this).data('hash'),
					item = $(this).data('item'),
					that = $(this);
				if(!hash){ $( this ).dialog( "close" ); }
				
				var thisParams = params;

				thisParams.data = {
					'hash':hash
				};

				$.ajax({
					type: 'post',
					url: appPath + 'xhr/delete',
					data: thisParams,
					dataType: 'json',
					success: function(resp){
						if(!resp){ return false; }
						
						that.dialog('close');
						
						// failure
						if(resp.status !== 'success'){
							$.gritter.add({
								title: 'Error',
								text: 'Could not delete',
								image: appPath + 'css/img/icons/48x48/cancel.png',
								time: gritterTimeout
							});
						}
						
						// success, perform cleanup
						item.fadeOut(function(){
							$(this).remove();
							// rebuild tree
							$.post(appPath + 'partial/tree', params, function(json){
								var tree = $('.list:eq('+treePosition+')', '#w');
								tree.empty();

								$.each(json, function(){
									buildTree(this, tree);
								});
							}, 'json');

							$.gritter.add({
								title: 'Success',
								text: '</strong>'+resp.data.name+'</strong> was deleted',
								image: appPath + 'css/img/icons/48x48/delete.png',
								time: gritterTimeout
							});

						});
						
					}

				});
			
			}
		}
	});
	
	$('a.delete', '#c .stack').live('click', function(){
		// set the dialog information
		var item = $(this).closest('li'),
			hash = item.data('hash'),
			name = item.data('name'),
			type = item.data('type'),
			dialogDel = $( "#delete-stack" );
		
		// close any existing dialog
		dialogDel.dialog('close');
			
		dialogDel.data({
				'hash':hash,
				'name': name,
				'type':type,
				'item':item
			}).dialog('open');
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
					return $('<li/>')
						.html('<span class="icon file-error"></span>' + file.data.short_name + file.explain);
				}
				return $('<li/>')
					.html('<span class="icon file"></span>'+file.data.short_name);
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
								image: appPath + 'css/img/icons/48x48/save.png',
								time: gritterTimeout
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
			text: 'Download queue cleared',
			image: appPath + 'css/img/icons/48x48/fire.png',
			time: gritterTimeout
		});
		
		return false;
	});
	
	/* clear upload history */
	$('.button.queue-clear', '#pane-upload').click(function(){
		// dom list
		$('ul.queue > li', '#pane-upload').remove();
		$.gritter.add({
			title: 'Success',
			text: 'Upload history cleared',
			image: appPath + 'css/img/icons/48x48/fire.png',
			time: gritterTimeout
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
				image: appPath + 'css/img/icons/48x48/attention.png',
				time: gritterTimeout
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
	
	// search functionality
	$('#searchbox').submit(function(){
		var search = $('#search-input').val(),
			searchResults = 0,
			thisParams = params;

		thisParams.data = {
			'search':search
		};
		
		// loading
		$('.loading', '#c').show();
		
		$.ajax({
			type: 'post',
			url: appPath + 'search',
			dataType: 'json',
			data: thisParams,
			success: function(json){
				if(!json){ return false; }

				var stack = $('.stack', '#c');
				
				searchResults = json.length;
					
				stack.empty();
				
				// similar results
				$.each(json, function(){
					buildStack(this, stack);
				});
				bindStack();
			},
			complete: function(){
				// header
				var verbiage = 's';
				if(searchResults === 1){ verbiage = ''; }
				$('#path', '#frame').html('Found '+searchResults+' result'+verbiage+' for "'+search+'"');
				$('.loading', '#c').hide();
			}
		});
		
		return false;
	});
	
});