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
          uiDialogButtonPane = $('<div></div>')
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
                    
          var button = $('<button></button>', props)
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