/*
	Detects static notifications and passes data to gritter
	requires: jquery, jquery ui, gritter
	
	Cathedral Inc., Thomas Mulloy, tm@cthedrl.com
*/
(function($, undefined){
	$.widget("ui.notify", {
		_create: function(){
			this._parent = this.element.remove();
			this._notifications = this._parent.children();
			
			var class_name = this._type = this._parent.data('notification-type');
				title = this._title = this._getTitle();
				
			$.each(this._notifications, function(index){
				$.gritter.add({
					title: title,
					text: $(this).html(),
					class_name: class_name
				});
			});		
		},
		_getTitle: function(){
			// static key conversion (need to switch to dynamic, pulling from app language)
			switch(this._type){
				case 'good': return 'Success';
				case 'bad': return 'Oops';
				case 'ugly': return 'Error';
				default: return 'Notice';
			}
		}
	});
})(jQuery);



window.log = function(){
  log.history = log.history || [];   
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};
(function(doc){
  var write = doc.write;
  doc.write = function(q){ 
    log('document.write(): ',arguments); 
    if (/docwriteregexwhitelist/.test(q)) write.apply(doc,arguments);  
  };
})(document);


/* gritter */
(function($){$.gritter={};$.gritter.options={fade_in_speed:'medium',fade_out_speed:1000,time:6000}
$.gritter.add=function(params){try{return Gritter.add(params||{});}catch(e){var err='Gritter Error: '+e;(typeof(console)!='undefined'&&console.error)?console.error(err,params):alert(err);}}
$.gritter.remove=function(id,params){Gritter.removeSpecific(id,params||{});}
$.gritter.removeAll=function(params){Gritter.stop(params||{});}
var Gritter={fade_in_speed:'',fade_out_speed:'',time:'',_custom_timer:0,_item_count:0,_is_setup:0,_tpl_close:'<div class="gritter-close"></div>',_tpl_item:'<div id="gritter-item-[[number]]" class="gritter-item-wrapper [[item_class]]" style="display:none"><div class="gritter-top"></div><div class="gritter-item">[[image]]<div class="[[class_name]]"><span class="gritter-title">[[username]]</span><p>[[text]]</p></div><div style="clear:both"></div></div><div class="gritter-bottom"></div></div>',_tpl_wrap:'<div id="gritter-notice-wrapper"></div>',add:function(params){if(!params.title||!params.text){throw'You need to fill out the first 2 params: "title" and "text"';}
if(!this._is_setup){this._runSetup();}
var user=params.title,text=params.text,image=params.image||'',sticky=params.sticky||false,item_class=params.class_name||'',time_alive=params.time||'';this._verifyWrapper();this._item_count++;var number=this._item_count,tmp=this._tpl_item;$(['before_open','after_open','before_close','after_close']).each(function(i,val){Gritter['_'+val+'_'+number]=($.isFunction(params[val]))?params[val]:function(){}});this._custom_timer=0;if(time_alive){this._custom_timer=time_alive;}
var image_str=(image!='')?'<img src="'+image+'" class="gritter-image" />':'',class_name=(image!='')?'gritter-with-image':'gritter-without-image';tmp=this._str_replace(['[[username]]','[[text]]','[[image]]','[[number]]','[[class_name]]','[[item_class]]'],[user,text,image_str,this._item_count,class_name,item_class],tmp);this['_before_open_'+number]();$('#gritter-notice-wrapper').append(tmp);var item=$('#gritter-item-'+this._item_count);item.fadeIn(this.fade_in_speed,function(){Gritter['_after_open_'+number]($(this));});if(!sticky){this._setFadeTimer(item,number);}
$(item).bind('mouseenter mouseleave',function(event){if(event.type=='mouseenter'){if(!sticky){Gritter._restoreItemIfFading($(this),number);}}
else{if(!sticky){Gritter._setFadeTimer($(this),number);}}
Gritter._hoverState($(this),event.type);});return number;},_countRemoveWrapper:function(unique_id,e){e.remove();this['_after_close_'+unique_id](e);if($('.gritter-item-wrapper').length==0){$('#gritter-notice-wrapper').remove();}},_fade:function(e,unique_id,params,unbind_events){var params=params||{},fade=(typeof(params.fade)!='undefined')?params.fade:true;fade_out_speed=params.speed||this.fade_out_speed;this['_before_close_'+unique_id](e);if(unbind_events){e.unbind('mouseenter mouseleave');}
if(fade){e.animate({opacity:0},fade_out_speed,function(){e.animate({height:0},300,function(){Gritter._countRemoveWrapper(unique_id,e);})})}
else{this._countRemoveWrapper(unique_id,e);}},_hoverState:function(e,type){if(type=='mouseenter'){e.addClass('hover');var find_img=e.find('img');(find_img.length)?find_img.before(this._tpl_close):e.find('span').before(this._tpl_close);e.find('.gritter-close').click(function(){var unique_id=e.attr('id').split('-')[2];Gritter.removeSpecific(unique_id,{},e,true);});}
else{e.removeClass('hover');e.find('.gritter-close').remove();}},removeSpecific:function(unique_id,params,e,unbind_events){if(!e){var e=$('#gritter-item-'+unique_id);}
this._fade(e,unique_id,params||{},unbind_events);},_restoreItemIfFading:function(e,unique_id){clearTimeout(this['_int_id_'+unique_id]);e.stop().css({opacity:''});},_runSetup:function(){for(opt in $.gritter.options){this[opt]=$.gritter.options[opt];}
this._is_setup=1;},_setFadeTimer:function(e,unique_id){var timer_str=(this._custom_timer)?this._custom_timer:this.time;this['_int_id_'+unique_id]=setTimeout(function(){Gritter._fade(e,unique_id);},timer_str);},stop:function(params){var before_close=($.isFunction(params.before_close))?params.before_close:function(){};var after_close=($.isFunction(params.after_close))?params.after_close:function(){};var wrap=$('#gritter-notice-wrapper');before_close(wrap);wrap.fadeOut(function(){$(this).remove();after_close();});},_str_replace:function(search,replace,subject,count){var i=0,j=0,temp='',repl='',sl=0,fl=0,f=[].concat(search),r=[].concat(replace),s=subject,ra=r instanceof Array,sa=s instanceof Array;s=[].concat(s);if(count){this.window[count]=0;}
for(i=0,sl=s.length;i<sl;i++){if(s[i]===''){continue;}
for(j=0,fl=f.length;j<fl;j++){temp=s[i]+'';repl=ra?(r[j]!==undefined?r[j]:''):r[0];s[i]=(temp).split(f[j]).join(repl);if(count&&s[i]!==temp){this.window[count]+=(temp.length-s[i].length)/f[j].length;}}}
return sa?s:s[0];},_verifyWrapper:function(){if($('#gritter-notice-wrapper').length==0){$('body').append(this._tpl_wrap);}}}})(jQuery);

/* uploader */
/*
 * jQuery File Upload Plugin 3.8.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*jslint browser: true */
/*global File, FileReader, FormData, unescape, jQuery */

(function ($) {

    var defaultNamespace = 'file_upload',
        undef = 'undefined',
        func = 'function',
        num = 'number',
        FileUpload,
        methods,

        MultiLoader = function (callBack, numberComplete) {
            var loaded = 0;
            this.complete = function () {
                loaded += 1;
                if (loaded === numberComplete) {
                    callBack();
                }
            };
        };
        
    FileUpload = function (container) {
        var fileUpload = this,
            uploadForm,
            fileInput,
            settings = {
                namespace: defaultNamespace,
                uploadFormFilter: function (index) {
                    return true;
                },
                fileInputFilter: function (index) {
                    return true;
                },
                cssClass: defaultNamespace,
                dragDropSupport: true,
                dropZone: container,
                url: function (form) {
                    return form.attr('action');
                },
                method: function (form) {
                    return form.attr('method');
                },
                fieldName: function (input) {
                    return input.attr('name');
                },
                formData: function (form) {
                    return form.serializeArray();
                },
                multipart: true,
                multiFileRequest: false,
                withCredentials: false,
                forceIframeUpload: false
            },
            documentListeners = {},
            dropZoneListeners = {},
            protocolRegExp = /^http(s)?:\/\//,
            optionsReference,

            isXHRUploadCapable = function () {
                return typeof XMLHttpRequest !== undef && typeof File !== undef && (
                    !settings.multipart || typeof FormData !== undef || typeof FileReader !== undef
                );
            },

            initEventHandlers = function () {
                if (settings.dragDropSupport) {
                    if (typeof settings.onDocumentDragEnter === func) {
                        documentListeners['dragenter.' + settings.namespace] = function (e) {
                            settings.onDocumentDragEnter(e);
                        };
                    }
                    if (typeof settings.onDocumentDragLeave === func) {
                        documentListeners['dragleave.' + settings.namespace] = function (e) {
                            settings.onDocumentDragLeave(e);
                        };
                    }
                    documentListeners['dragover.'   + settings.namespace] = fileUpload.onDocumentDragOver;
                    documentListeners['drop.'       + settings.namespace] = fileUpload.onDocumentDrop;
                    $(document).bind(documentListeners);
                    if (typeof settings.onDragEnter === func) {
                        dropZoneListeners['dragenter.' + settings.namespace] = function (e) {
                            settings.onDragEnter(e);
                        };
                    }
                    if (typeof settings.onDragLeave === func) {
                        dropZoneListeners['dragleave.' + settings.namespace] = function (e) {
                            settings.onDragLeave(e);
                        };
                    }
                    dropZoneListeners['dragover.'   + settings.namespace] = fileUpload.onDragOver;
                    dropZoneListeners['drop.'       + settings.namespace] = fileUpload.onDrop;
                    settings.dropZone.bind(dropZoneListeners);
                }
                fileInput.bind('change.' + settings.namespace, fileUpload.onChange);
            },

            removeEventHandlers = function () {
                $.each(documentListeners, function (key, value) {
                    $(document).unbind(key, value);
                });
                $.each(dropZoneListeners, function (key, value) {
                    settings.dropZone.unbind(key, value);
                });
                fileInput.unbind('change.' + settings.namespace);
            },

            initUploadEventHandlers = function (files, index, xhr, settings) {
                if (typeof settings.onProgress === func) {
                    xhr.upload.onprogress = function (e) {
                        settings.onProgress(e, files, index, xhr, settings);
                    };
                }
                if (typeof settings.onLoad === func) {
                    xhr.onload = function (e) {
                        settings.onLoad(e, files, index, xhr, settings);
                    };
                }
                if (typeof settings.onAbort === func) {
                    xhr.onabort = function (e) {
                        settings.onAbort(e, files, index, xhr, settings);
                    };
                }
                if (typeof settings.onError === func) {
                    xhr.onerror = function (e) {
                        settings.onError(e, files, index, xhr, settings);
                    };
                }
            },

            getUrl = function (settings) {
                if (typeof settings.url === func) {
                    return settings.url(settings.uploadForm || uploadForm);
                }
                return settings.url;
            },
            
            getMethod = function (settings) {
                if (typeof settings.method === func) {
                    return settings.method(settings.uploadForm || uploadForm);
                }
                return settings.method;
            },
            
            getFieldName = function (settings) {
                if (typeof settings.fieldName === func) {
                    return settings.fieldName(settings.fileInput || fileInput);
                }
                return settings.fieldName;
            },

            getFormData = function (settings) {
                var formData;
                if (typeof settings.formData === func) {
                    return settings.formData(settings.uploadForm || uploadForm);
                } else if ($.isArray(settings.formData)) {
                    return settings.formData;
                } else if (settings.formData) {
                    formData = [];
                    $.each(settings.formData, function (name, value) {
                        formData.push({name: name, value: value});
                    });
                    return formData;
                }
                return [];
            },

            isSameDomain = function (url) {
                if (protocolRegExp.test(url)) {
                    var host = location.host,
                        indexStart = location.protocol.length + 2,
                        index = url.indexOf(host, indexStart),
                        pathIndex = index + host.length;
                    if ((index === indexStart || index === url.indexOf('@', indexStart) + 1) &&
                            (url.length === pathIndex || $.inArray(url.charAt(pathIndex), ['/', '?', '#']) !== -1)) {
                        return true;
                    }
                    return false;
                }
                return true;
            },

            setRequestHeaders = function (xhr, settings, sameDomain) {
                if (sameDomain) {
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                } else if (settings.withCredentials) {
                    xhr.withCredentials = true;
                }
                if ($.isArray(settings.requestHeaders)) {
                    $.each(settings.requestHeaders, function (index, header) {
                        xhr.setRequestHeader(header[0], header[1]);
                    });
                } else if (settings.requestHeaders) {
                    $.each(settings.requestHeaders, function (name, value) {
                        xhr.setRequestHeader(name, value);
                    });
                }
            },

            nonMultipartUpload = function (file, xhr, sameDomain) {
                if (sameDomain) {
                    xhr.setRequestHeader('X-File-Name', unescape(encodeURIComponent(file.name)));
                }
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            },

            formDataUpload = function (files, xhr, settings) {
                var formData = new FormData(),
                    i;
                $.each(getFormData(settings), function (index, field) {
                    formData.append(field.name, field.value);
                });
                for (i = 0; i < files.length; i += 1) {
                    formData.append(getFieldName(settings), files[i]);
                }
                xhr.send(formData);
            },

            loadFileContent = function (file, callBack) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    file.content = e.target.result;
                    callBack();
                };
                fileReader.readAsBinaryString(file);
            },

            buildMultiPartFormData = function (boundary, files, filesFieldName, fields) {
                var doubleDash = '--',
                    crlf     = '\r\n',
                    formData = '';
                $.each(fields, function (index, field) {
                    formData += doubleDash + boundary + crlf +
                        'Content-Disposition: form-data; name="' +
                        unescape(encodeURIComponent(field.name)) +
                        '"' + crlf + crlf +
                        unescape(encodeURIComponent(field.value)) + crlf;
                });
                $.each(files, function (index, file) {
                    formData += doubleDash + boundary + crlf +
                        'Content-Disposition: form-data; name="' +
                        unescape(encodeURIComponent(filesFieldName)) +
                        '"; filename="' + unescape(encodeURIComponent(file.name)) + '"' + crlf +
                        'Content-Type: ' + file.type + crlf + crlf +
                        file.content + crlf;
                });
                formData += doubleDash + boundary + doubleDash + crlf;
                return formData;
            },
            
            fileReaderUpload = function (files, xhr, settings) {
                var boundary = '----MultiPartFormBoundary' + (new Date()).getTime(),
                    loader,
                    i;
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                loader = new MultiLoader(function () {
                    xhr.sendAsBinary(buildMultiPartFormData(
                        boundary,
                        files,
                        getFieldName(settings),
                        getFormData(settings)
                    ));
                }, files.length);
                for (i = 0; i < files.length; i += 1) {
                    loadFileContent(files[i], loader.complete);
                }
            },

            upload = function (files, index, xhr, settings) {
                var url = getUrl(settings),
                    sameDomain = isSameDomain(url),
                    filesToUpload;
                initUploadEventHandlers(files, index, xhr, settings);
                xhr.open(getMethod(settings), url, true);
                setRequestHeaders(xhr, settings, sameDomain);
                if (!settings.multipart) {
                    nonMultipartUpload(files[index], xhr, sameDomain);
                } else {
                    if (typeof index === num) {
                        filesToUpload = [files[index]];
                    } else {
                        filesToUpload = files;
                    }
                    if (typeof FormData !== undef) {
                        formDataUpload(filesToUpload, xhr, settings);
                    } else if (typeof FileReader !== undef) {
                        fileReaderUpload(filesToUpload, xhr, settings);
                    } else {
                        $.error('Browser does neither support FormData nor FileReader interface');
                    }
                }
            },

            handleUpload = function (event, files, input, form, index) {
                var xhr = new XMLHttpRequest(),
                    uploadSettings = $.extend({}, settings);
                uploadSettings.fileInput = input;
                uploadSettings.uploadForm = form;
                if (typeof uploadSettings.initUpload === func) {
                    uploadSettings.initUpload(
                        event,
                        files,
                        index,
                        xhr,
                        uploadSettings,
                        function () {
                            upload(files, index, xhr, uploadSettings);
                        }
                    );
                } else {
                    upload(files, index, xhr, uploadSettings);
                }
            },

            handleFiles = function (event, files, input, form) {
                var i;
                if (settings.multiFileRequest) {
                    handleUpload(event, files, input, form);
                } else {
                    for (i = 0; i < files.length; i += 1) {
                        handleUpload(event, files, input, form, i);
                    }
                }
            },

            legacyUploadFormDataInit = function (input, form, settings) {
                var formData = getFormData(settings);
                form.find(':input').not(':disabled')
                    .attr('disabled', true)
                    .addClass(settings.namespace + '_disabled');
                $.each(formData, function (index, field) {
                    $('<input type="hidden"/>')
                        .attr('name', field.name)
                        .val(field.value)
                        .addClass(settings.namespace + '_form_data')
                        .appendTo(form);
                });
                input
                    .attr('name', getFieldName(settings))
                    .appendTo(form);
            },

            legacyUploadFormDataReset = function (input, form, settings) {
                input.detach();
                form.find('.' + settings.namespace + '_disabled')
                    .removeAttr('disabled')
                    .removeClass(settings.namespace + '_disabled');
                form.find('.' + settings.namespace + '_form_data').remove();
            },

            legacyUpload = function (input, form, iframe, settings) {
                var originalAction = form.attr('action'),
                    originalMethod = form.attr('method'),
                    originalTarget = form.attr('target');
                iframe
                    .unbind('abort')
                    .bind('abort', function (e) {
                        iframe.readyState = 0;
                        // javascript:false as iframe src prevents warning popups on HTTPS in IE6
                        // concat is used here to prevent the "Script URL" JSLint error:
                        iframe.unbind('load').attr('src', 'javascript'.concat(':false;'));
                        if (typeof settings.onAbort === func) {
                            settings.onAbort(e, [{name: input.val(), type: null, size: null}], 0, iframe, settings);
                        }
                    })
                    .unbind('load')
                    .bind('load', function (e) {
                        iframe.readyState = 4;
                        if (typeof settings.onLoad === func) {
                            settings.onLoad(e, [{name: input.val(), type: null, size: null}], 0, iframe, settings);
                        }
                        // Fix for IE endless progress bar activity bug (happens on form submits to iframe targets):
                        $('<iframe src="javascript:false;" style="display:none"></iframe>').appendTo(form).remove();
                    });
                form
                    .attr('action', getUrl(settings))
                    .attr('method', getMethod(settings))
                    .attr('target', iframe.attr('name'));
                legacyUploadFormDataInit(input, form, settings);
                iframe.readyState = 2;
                form.get(0).submit();
                legacyUploadFormDataReset(input, form, settings);
                form
                    .attr('action', originalAction)
                    .attr('method', originalMethod)
                    .attr('target', originalTarget);
            },

            handleLegacyUpload = function (event, input, form) {
                // javascript:false as iframe src prevents warning popups on HTTPS in IE6:
                var iframe = $('<iframe src="javascript:false;" style="display:none" name="iframe_' +
                    settings.namespace + '_' + (new Date()).getTime() + '"></iframe>'),
                    uploadSettings = $.extend({}, settings);
                uploadSettings.fileInput = input;
                uploadSettings.uploadForm = form;
                iframe.readyState = 0;
                iframe.abort = function () {
                    iframe.trigger('abort');
                };
                iframe.bind('load', function () {
                    iframe.unbind('load');
                    if (typeof uploadSettings.initUpload === func) {
                        uploadSettings.initUpload(
                            event,
                            [{name: input.val(), type: null, size: null}],
                            0,
                            iframe,
                            uploadSettings,
                            function () {
                                legacyUpload(input, form, iframe, uploadSettings);
                            }
                        );
                    } else {
                        legacyUpload(input, form, iframe, uploadSettings);
                    }
                }).appendTo(form);
            },
            
            initUploadForm = function () {
                uploadForm = (container.is('form') ? container : container.find('form'))
                    .filter(settings.uploadFormFilter);
            },
            
            initFileInput = function () {
                fileInput = uploadForm.find('input:file')
                    .filter(settings.fileInputFilter);
            },
            
            replaceFileInput = function (input) {
                var inputClone = input.clone(true);
                $('<form/>').append(inputClone).get(0).reset();
                input.after(inputClone).detach();
                initFileInput();
            };

        this.onDocumentDragOver = function (e) {
            if (typeof settings.onDocumentDragOver === func &&
                    settings.onDocumentDragOver(e) === false) {
                return false;
            }
            e.preventDefault();
        };
        
        this.onDocumentDrop = function (e) {
            if (typeof settings.onDocumentDrop === func &&
                    settings.onDocumentDrop(e) === false) {
                return false;
            }
            e.preventDefault();
        };

        this.onDragOver = function (e) {
            if (typeof settings.onDragOver === func &&
                    settings.onDragOver(e) === false) {
                return false;
            }
            var dataTransfer = e.originalEvent.dataTransfer;
            if (dataTransfer && dataTransfer.files) {
                dataTransfer.dropEffect = dataTransfer.effectAllowed = 'copy';
                e.preventDefault();
            }
        };

        this.onDrop = function (e) {
            if (typeof settings.onDrop === func &&
                    settings.onDrop(e) === false) {
                return false;
            }
            var dataTransfer = e.originalEvent.dataTransfer;
            if (dataTransfer && dataTransfer.files && isXHRUploadCapable()) {
                handleFiles(e, dataTransfer.files);
            }
            e.preventDefault();
        };
        
        this.onChange = function (e) {
            if (typeof settings.onChange === func &&
                    settings.onChange(e) === false) {
                return false;
            }
            var input = $(e.target),
                form = $(e.target.form);
            if (form.length === 1) {
                input.data(defaultNamespace + '_form', form);
                replaceFileInput(input);
            } else {
                form = input.data(defaultNamespace + '_form');
            }
            if (!settings.forceIframeUpload && e.target.files && isXHRUploadCapable()) {
                handleFiles(e, e.target.files, input, form);
            } else {
                handleLegacyUpload(e, input, form);
            }
        };

        this.init = function (options) {
            if (options) {
                $.extend(settings, options);
                optionsReference = options;
            }
            initUploadForm();
            initFileInput();
            if (container.data(settings.namespace)) {
                $.error('FileUpload with namespace "' + settings.namespace + '" already assigned to this element');
                return;
            }
            container
                .data(settings.namespace, fileUpload)
                .addClass(settings.cssClass);
            settings.dropZone.not(container).addClass(settings.cssClass);
            initEventHandlers();
        };

        this.options = function (options) {
            var oldCssClass,
                oldDropZone,
                uploadFormFilterUpdate,
                fileInputFilterUpdate;
            if (typeof options === undef) {
                return $.extend({}, settings);
            }
            if (optionsReference) {
                $.extend(optionsReference, options);
            }
            removeEventHandlers();
            $.each(options, function (name, value) {
                switch (name) {
                case 'namespace':
                    $.error('The FileUpload namespace cannot be updated.');
                    return;
                case 'uploadFormFilter':
                    uploadFormFilterUpdate = true;
                    fileInputFilterUpdate = true;
                    break;
                case 'fileInputFilter':
                    fileInputFilterUpdate = true;
                    break;
                case 'cssClass':
                    oldCssClass = settings.cssClass;
                    break;
                case 'dropZone':
                    oldDropZone = settings.dropZone;
                    break;
                }
                settings[name] = value;
            });
            if (uploadFormFilterUpdate) {
                initUploadForm();
            }
            if (fileInputFilterUpdate) {
                initFileInput();
            }
            if (typeof oldCssClass !== undef) {
                container
                    .removeClass(oldCssClass)
                    .addClass(settings.cssClass);
                (oldDropZone ? oldDropZone : settings.dropZone).not(container)
                    .removeClass(oldCssClass);
                settings.dropZone.not(container).addClass(settings.cssClass);
            } else if (oldDropZone) {
                oldDropZone.not(container).removeClass(settings.cssClass);
                settings.dropZone.not(container).addClass(settings.cssClass);
            }
            initEventHandlers();
        };
        
        this.option = function (name, value) {
            var options;
            if (typeof value === undef) {
                return settings[name];
            }
            options = {};
            options[name] = value;
            fileUpload.options(options);
        };
        
        this.destroy = function () {
            removeEventHandlers();
            container
                .removeData(settings.namespace)
                .removeClass(settings.cssClass);
            settings.dropZone.not(container).removeClass(settings.cssClass);
        };
    };

    methods = {
        init : function (options) {
            return this.each(function () {
                (new FileUpload($(this))).init(options);
            });
        },
        
        option: function (option, value, namespace) {
            namespace = namespace ? namespace : defaultNamespace;
            var fileUpload = $(this).data(namespace);
            if (fileUpload) {
                if (typeof option === 'string') {
                    return fileUpload.option(option, value);
                }
                return fileUpload.options(option);
            } else {
                $.error('No FileUpload with namespace "' + namespace + '" assigned to this element');
            }
        },
                
        destroy : function (namespace) {
            namespace = namespace ? namespace : defaultNamespace;
            return this.each(function () {
                var fileUpload = $(this).data(namespace);
                if (fileUpload) {
                    fileUpload.destroy();
                } else {
                    $.error('No FileUpload with namespace "' + namespace + '" assigned to this element');
                }
            });

        }
    };
    
    $.fn.fileUpload = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.fileUpload');
        }
    };
    
}(jQuery));

/*
 * jQuery File Upload User Interface Plugin 3.7.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

/*jslint browser: true */
/*global jQuery, FileReader, URL */

(function ($) {

    var undef = 'undefined',
        func = 'function',
        UploadHandler,
        methods,

        LocalImage = function (file, imageTypes) {
            var img,
                fileReader;
            if (!imageTypes.test(file.type)) {
                return null;
            }
            img = document.createElement('img');
            if (typeof URL !== undef && typeof URL.createObjectURL === func) {
                img.src = URL.createObjectURL(file);
                img.onload = function () {
                    URL.revokeObjectURL(this.src);
                };
                return img;
            }
            if (typeof FileReader !== undef) {
                fileReader = new FileReader();
                if (typeof fileReader.readAsDataURL === func) {
                    fileReader.onload = function (e) {
                        img.src = e.target.result;
                    };
                    fileReader.readAsDataURL(file);
                    return img;
                }
            }
            return null;
        };
        
    UploadHandler = function (container, options) {
        var uploadHandler = this,
            dragOverTimeout,
            isDropZoneEnlarged;
        
        this.requestHeaders = {'Accept': 'application/json, text/javascript, */*; q=0.01'};
        this.dropZone = container;
        this.imageTypes = /^image\/(gif|jpeg|png)$/;
        this.previewSelector = '.file_upload_preview';
        this.progressSelector = '.file_upload_progress div';
        this.cancelSelector = '.file_upload_cancel button';
        this.cssClassSmall = 'file_upload_small';
        this.cssClassLarge = 'file_upload_large';
        this.cssClassHighlight = 'file_upload_highlight';
        this.dropEffect = 'highlight';
        this.uploadTable = this.downloadTable = null;
        
        this.buildUploadRow = this.buildDownloadRow = function () {
            return null;
        };

        this.addNode = function (parentNode, node, callBack) {
            if (node) {
                node.css('display', 'none').appendTo(parentNode).fadeIn(function () {
                    if (typeof callBack === func) {
                        try {
                            callBack();
                        } catch (e) {
                            // Fix endless exception loop:
                            $(this).stop();
                            throw e;
                        }
                    }
                });
            } else if (typeof callBack === func) {
                callBack();
            }
        };

        this.removeNode = function (node, callBack) {
            if (node) {
                node.fadeOut(function () {
                    $(this).remove();
                    if (typeof callBack === func) {
                        try {
                            callBack();
                        } catch (e) {
                            // Fix endless exception loop:
                            $(this).stop();
                            throw e;
                        }
                    }
                });
            } else if (typeof callBack === func) {
                callBack();
            }
        };

        this.onAbort = function (event, files, index, xhr, handler) {
            handler.removeNode(handler.uploadRow);
        };
        
        this.cancelUpload = function (event, files, index, xhr, handler) {
            var readyState = xhr.readyState;
            xhr.abort();
            // If readyState is below 2, abort() has no effect:
            if (isNaN(readyState) || readyState < 2) {
                handler.onAbort(event, files, index, xhr, handler);
            }
        };
        
        this.initProgressBar = function (node, value) {
            if (typeof node.progressbar === func) {
                return node.progressbar({
                    value: value
                });
            } else {
                var progressbar = $('<progress value="' + value + '" max="100"/>').appendTo(node);
                progressbar.progressbar = function (key, value) {
                    progressbar.attr('value', value);
                };
                return progressbar;
            }
        };
        
        this.initUploadRow = function (event, files, index, xhr, handler, callBack) {
            var uploadRow = handler.uploadRow = handler.buildUploadRow(files, index, handler);
            if (uploadRow) {
                handler.progressbar = handler.initProgressBar(
                    uploadRow.find(handler.progressSelector),
                    0
                );
                uploadRow.find(handler.cancelSelector).click(function (e) {
                    handler.cancelUpload(e, files, index, xhr, handler);
                });
                uploadRow.find(handler.previewSelector).each(function () {
                    $(this).append(new LocalImage(files[index], handler.imageTypes));
                });
            }
            handler.addNode(
                (typeof handler.uploadTable === func ? handler.uploadTable(handler) : handler.uploadTable),
                uploadRow,
                callBack
            );
        };
        
        this.initUploadProgress = function (xhr, handler) {
            if (!xhr.upload) {
                handler.progressbar.progressbar(
                    'value',
                    100 // indeterminate progress displayed by a full animated progress bar
                );
            }
        };
        
        this.initUpload = function (event, files, index, xhr, handler, callBack) {
            handler.initUploadRow(event, files, index, xhr, handler, function () {
                if (typeof handler.beforeSend === func) {
                    handler.beforeSend(event, files, index, xhr, handler, function () {
                        handler.initUploadProgress(xhr, handler);
                        callBack();
                    });
                } else {
                    handler.initUploadProgress(xhr, handler);
                    callBack();
                }
            });
        };
        
        this.onProgress = function (event, files, index, xhr, handler) {
            if (handler.progressbar) {
                handler.progressbar.progressbar(
                    'value',
                    parseInt(event.loaded / event.total * 100, 10)
                );
            }
        };
        
        this.parseResponse = function (xhr) {
            if (typeof xhr.responseText !== undef) {
                return $.parseJSON(xhr.responseText);
            } else {
                // Instead of an XHR object, an iframe is used for legacy browsers:
                return $.parseJSON(xhr.contents().text());
            }
        };
        
        this.initDownloadRow = function (event, files, index, xhr, handler, callBack) {
            var json, downloadRow;
            try {
                json = handler.response = handler.parseResponse(xhr);
                downloadRow = handler.downloadRow = handler.buildDownloadRow(json, handler);
                handler.addNode(
                    (typeof handler.downloadTable === func ? handler.downloadTable(handler) : handler.downloadTable),
                    downloadRow,
                    callBack
                );
            } catch (e) {
                if (typeof handler.onError === func) {
                    handler.originalEvent = event;
                    handler.onError(e, files, index, xhr, handler);
                } else {
                    throw e;
                }
            }
        };
        
        this.onLoad = function (event, files, index, xhr, handler) {
            handler.removeNode(handler.uploadRow, function () {
                handler.initDownloadRow(event, files, index, xhr, handler, function () {
                    if (typeof handler.onComplete === func) {
                        handler.onComplete(event, files, index, xhr, handler);
                    }
                });
            });
        };

        this.dropZoneEnlarge = function () {
            if (!isDropZoneEnlarged) {
                if (typeof uploadHandler.dropZone.switchClass === func) {
                    uploadHandler.dropZone.switchClass(
                        uploadHandler.cssClassSmall,
                        uploadHandler.cssClassLarge
                    );
                } else {
                    uploadHandler.dropZone.addClass(uploadHandler.cssClassLarge);
                    uploadHandler.dropZone.removeClass(uploadHandler.cssClassSmall);
                }
                isDropZoneEnlarged = true;
            }
        };
        
        this.dropZoneReduce = function () {
            if (typeof uploadHandler.dropZone.switchClass === func) {
                uploadHandler.dropZone.switchClass(
                    uploadHandler.cssClassLarge,
                    uploadHandler.cssClassSmall
                );
            } else {
                uploadHandler.dropZone.addClass(uploadHandler.cssClassSmall);
                uploadHandler.dropZone.removeClass(uploadHandler.cssClassLarge);
            }
            isDropZoneEnlarged = false;
        };

        this.onDocumentDragEnter = function (event) {
            uploadHandler.dropZoneEnlarge();
        };
        
        this.onDocumentDragOver = function (event) {
            if (dragOverTimeout) {
                clearTimeout(dragOverTimeout);
            }
            dragOverTimeout = setTimeout(function () {
                uploadHandler.dropZoneReduce();
            }, 200);
        };
        
        this.onDragEnter = this.onDragLeave = function (event) {
            uploadHandler.dropZone.toggleClass(uploadHandler.cssClassHighlight);
        };
        
        this.onDrop = function (event) {
            if (dragOverTimeout) {
                clearTimeout(dragOverTimeout);
            }
            if (uploadHandler.dropEffect && typeof uploadHandler.dropZone.effect === func) {
                uploadHandler.dropZone.effect(uploadHandler.dropEffect, function () {
                    uploadHandler.dropZone.removeClass(uploadHandler.cssClassHighlight);
                    uploadHandler.dropZoneReduce();
                });
            } else {
                uploadHandler.dropZone.removeClass(uploadHandler.cssClassHighlight);
                uploadHandler.dropZoneReduce();
            }
        };

        $.extend(this, options);
    };

    methods = {
        init : function (options) {
            return this.each(function () {
                $(this).fileUpload(new UploadHandler($(this), options));
            });
        },
        
        option: function (option, value, namespace) {
            if (typeof option === undef || (typeof option === 'string' && typeof value === undef)) {
                return $(this).fileUpload('option', option, value, namespace);
            }
            return this.each(function () {
                $(this).fileUpload('option', option, value, namespace);
            });
        },
            
        destroy : function (namespace) {
            return this.each(function () {
                $(this).fileUpload('destroy', namespace);
            });
        }
    };
    
    $.fn.fileUploadUI = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.fileUploadUI');
        }
    };
    
}(jQuery));

/* vinnie franco */
/* 
* Inline Dialog Widget v0.4.6
*
* Provides a better dialog.
* Will work like ui.dialog but be relational in display similar to:
* http://cdn.jquery.net/mobile/wp-content/uploads/2010/08/jquery-mobile-tablet-11aug20101.png
* Look at the trash icon. Like that bitch? You like it when I do that?!
* 
* Authors: Vincent Franco, Justin Jones
*
* Depends:
*  jquery.ui.core.js
*  jquery.ui.widget.js
*/
(function( $, undefined ) {

  var uiInlineClasses = "ui-inline-dialog";

  $.widget( "ui.inlineDialog", {
    options: {
      title: "",
      referenceClass: "", 
      content: "",
      currentUri: "default",
      targetClass: "ui-dialog-button",
      hasTitle: false,
      buttons: {},
      buffer: 10, // minimum distance dialog can display from the edge
      zIndex: 2011,
      mHeight: 50,
      mWidth: 50,
      autoOpen: false
    },
    _create: function() {
      
      
      this.originalTitle = this.element.attr("title");

      this.element.addClass(this.options.targetClass)
      .bind('click', function(event) {
        self._toggleDialog();
        event.preventDefault();
      });

      if ( typeof this.originalTitle !== "string") {
        this.originalTitle = "";
      }

      this.options.title = this.options.title || this.originalTitle;

      var self = this,
          options = self.options,
          title = options.title,
          uiInlineDialogContent = ( self.uiInlineDialogContent = $("<div />") )
            .addClass('ui-inline-dialog-content'),
          uiInlineDialogContainer = ( self.uiInlineDialogContainer = $("<div />") )
            .addClass("ui-inline-dialog-container")
            .css({
              minHeight: options.mHeight,
              minWidth:  options.mWidth
            })
            .append(uiInlineDialogContent),
          uiInlineDialog = (self.uiInlineDialog = $("<div />"))
            .appendTo(document.body)
            .hide()
            .addClass(uiInlineClasses)
            .css({
              zIndex: options.zIndex
            })
            .append(uiInlineDialogContainer);

      if (options.title !== "") {
        var uiInlineDialogTitle = $("<span />")
        .addClass("ui-inline-dialog-title")
        .html(title)
        .prependTo(uiInlineDialogContainer);
      }

      self._createButtons(options.buttons);
      
      self._isOpen = false;
      
      if (options.autoOpen) {
        self._toggleDialog();
        self._isOpen = true;
        event.preventDefault();
      }
      
    },
    _toggleDialog: function() {

      // Get content from the element
      this._getContent(this, function(self) {
        
        var options	= self.options,
            dir		= '',
            pos     = self.element.offset(),
            _tPos   = 0,
            _lPos   = 0,
            pWidth  = $(document).width(), 
            pHeight = $(document).height(),
            dWidth  = self.uiInlineDialog.outerWidth(),
            dHeight = self.uiInlineDialog.outerHeight(),
            eWidth  = self.element.outerWidth(), 
            eHeight = self.element.outerHeight();

        var rBuffer = Math.floor(pWidth - (pos.left+eWidth)),
            lBuffer = Math.floor(pos.left),
            bBuffer = Math.floor(pHeight - (pos.top+eHeight)),
            tBuffer = Math.floor(pos.top);

        // X axis

        // is it colliding on the right side?
        if (rBuffer < dWidth) {
          _lPos = pWidth - (rBuffer + dWidth - (eWidth / 2));
          if ((_lPos + dWidth) >= pWidth) _lPos -= (_lPos + dWidth - pWidth + options.buffer);
        }
        // is it colliding on the left side?
        else if (lBuffer < dWidth) { 
          _lPos = lBuffer - eWidth / 2;
          if (_lPos < 0) _lPos = options.buffer;
        }
        // center that bitch
        else {
          _lPos = lBuffer + (eWidth / 2) - (dWidth / 2);
        }

        // Y axis
        // _tPos = tBuffer + eHeight;
        if ((tBuffer < dHeight) || (bBuffer > dHeight)) {
          _tPos = tBuffer + eHeight;
          dir = 'top';
        } else {
          _tPos = tBuffer - dHeight;
          dir = 'bottom';
        }

        /*
        TODO get the width of the stem dynamically,
        will have to make it it's own element
        */
        self.uiInlineDialog
          .removeClass('top bottom')
          .addClass(dir)
          .css({
            position: "absolute",
            backgroundPosition: Math.ceil(((lBuffer + (eWidth / 2)) - _lPos) - 45) + "px " + dir,
            top:  Math.floor(_tPos)+"px",
            left: Math.floor(_lPos)+"px"
          })
          .toggle();
      });

    },
    _getContent: function(self, callback) {
      
      var currentUri = self.options.currentUri,
          href = self.element.attr('href'),
          content = self.options.content;
      
      // No need to get content if we have it.
      if (href && currentUri === href) { callback(self); return; }
      
      if (content !== '') {
        self.uiInlineDialogContent.html(content);
        callback(self); return;
      } else if (href) {
        var target = href.match(/^#/);

        // Inline target.
        if (target !== null) {
          content = $(href);
          self.uiInlineDialogContent.append(content.show());
          callback(self);
        
        // XHR target.
        } else {
          content = $.getJSON(href, function(res) {
            /*
              FIXME This is inflexible. Make not be.
              Right now this is forced to be form content.
              Should not be like that.
            */
            if (res.content.form) {
              self.uiInlineDialogContent.html(res.content.form);
              callback(self);
              self.options.currentUri = href;
            }
          });
        }
        
      }
    },
    _createButtons: function(buttons) {
      var self = this,
          hasButtons = false,
          uiDialogButtonPane = $('<div/>')
            .addClass(
              'ui-inline-dialog-buttonpane ' +
              'ui-widget-content '    +
              'ui-helper-clearfix'
            ),
          uiButtonSet = $( "<div></div>" )
            .addClass( "ui-dialog-buttonset" )
            .appendTo( uiDialogButtonPane );

      // if we already have a button pane, remove it
      self.uiInlineDialog
        .find('.ui-dialog-buttonpane')
        .remove();

      if (typeof buttons === 'object' && buttons !== null) {
        $.each(buttons, function() {
          return !(hasButtons = true);
        });
      }
      if (hasButtons) {
        $.each(buttons, function(name, props) {
          props = $.isFunction( props ) ?
                    { click: props, text: name } : props;
                    
          var button = $('<button/>', props)
                .unbind('click')
                .click(function() {
                  props.click.apply(self.element[0], arguments);
                })
                .appendTo(uiButtonSet);
                
          if ($.fn.button) { button.button(); }
          
        });
        uiDialogButtonPane
          .appendTo(self.uiInlineDialogContainer);
      }
    },
    close: function() {
      var self = this,
          uiInlineDialog = self.uiInlineDialog;
          uiInlineDialog.hide();
          self._isOpen = false;

      return false;
    },
    open: function(event) {
      var self = this,
          uiInlineDialog = self.uiInlineDialog;
          uiInlineDialog.show();
          self._isOpen = true;
        
      event.preventDefault();
    },
    reset: function() {
      this.uiInlineDialogContent.html('');
      this.close();
    },
    destroy: function() {
      this.uiInlineDialog.hide();
    }
  });

  $.extend( $.ui.inlineDialog, { version: "0.4.5" } );

}(jQuery));

/* bbq */
/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I:{},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);
