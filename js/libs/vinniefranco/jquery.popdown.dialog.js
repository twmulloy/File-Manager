/* 
* Popdown Dialog Widget v0.4.7
* 
* Authors: Vincent Franco, Justin Jones
*
* Depends:
*  jquery.ui.core.js
*  jquery.ui.widget.js
*/
(function( $, undefined ) {

  var uiPopdownClasses = "ui-popdown-dialog";

  $.widget( "ui.popdownDialog", {
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
      mHeight: 150,
      mWidth: 300,
      autoOpen: false
    },
    _create: function() {
      
      this.originalTitle = this.element.attr("title");
      var self = this;
      
      this.element.addClass(this.options.targetClass)
      .bind('click', function(event) {
        self._getContent(function() {
          self._toggleDialog();
        });
        event.preventDefault();
      });

      if ( typeof this.originalTitle !== "string") {
        this.originalTitle = "";
      }

      this.options.title = this.options.title || this.originalTitle;

      var options = self.options,
          title = options.title,
          uiPopdownDialogContent = ( self.uiPopdownDialogContent = $("<div />") )
            .addClass('ui-popdown-dialog-content'),
          uiPopdownDialogContainer = ( self.uiPopdownDialogContainer = $("<div />") )
            .addClass("ui-popdown-dialog-container")
            .css({
              minHeight: options.mHeight,
              minWidth:  options.mWidth
            })
            .append(uiPopdownDialogContent),
          uiPopdownDialog = ( self.uiPopdownDialog = $("<div />") )
            .appendTo(document.body)
            .hide()
            .addClass(uiPopdownClasses)
            .css({
              zIndex: options.zIndex
            })
            .append(uiPopdownDialogContainer),
          uiWidgetOverlay = ( self.uiWidgetOverlay = $('<div />', { 'class' : 'ui-widget-overlay' }) )
            .hide()
            .appendTo(document.body);

      if (options.title !== "") {
        var uiPopdownDialogTitle = $("<span />")
        .addClass("ui-popdown-dialog-title")
        .html(title)
        .prependTo(uiPopdownDialogContainer);
      }
      
      self._isOpen = false;
      
      if (options.autoOpen) {
        self._toggleDialog();
        self._isOpen = true;
        event.preventDefault();
      }
      
    },
    _toggleDialog: function() {
      ( ! this._isOpen)? this.open() : this.close();
    },
    open: function() {
      
      var uiPopdownDialog = this.uiPopdownDialog,
          uiWidgetOverlay = this.uiWidgetOverlay,
          options	= this.options,
          pageWidth  = $(document).width(), 
          dialogWidth  = this.uiPopdownDialog.outerWidth(),
          dialogHeight = (this.dialogHeight = this.uiPopdownDialog.outerHeight()),
          leftPos = "-"+dialogWidth / 2+"px",
          topPos = (this._topPos = "-"+20-this.dialogHeight+"px");
        
      uiPopdownDialog.css({
        position: "absolute", top: topPos, left: "50%",
        marginLeft: leftPos
      });

      uiPopdownDialog
        .show()
        .animate({ top:  "0px" }, 250 );
        
      uiWidgetOverlay
        .show();
        
      this._isOpen = true;
    },
    close: function() {
      
      var uiPopdownDialog = this.uiPopdownDialog,
          uiWidgetOverlay = this.uiWidgetOverlay;
      
      uiPopdownDialog
        .animate({ top: this._topPos },300, function() {
          uiPopdownDialog.hide();
        });
        
      uiWidgetOverlay
        .hide();
        
      this._isOpen = false;
    },
    _getContent: function(callback) {
      
      var self = this,
          currentUri = self.options.currentUri,
          href = self.element.attr('href'),
          content = self.options.content;
      
      // No need to get content if we have it.
      if (href && currentUri === href) { 
        callback(); return; 
      }
      
      if (content !== '') {
        self.uiPopdownDialogContent.html(content);
        callback(); return;
      } else if (href) {
        var target = href.match(/^#/);

        // Inline target.
        if (target !== null) {
          content = $(href);
          self.uiPopdownDialogContent.append(content.show());
          callback();
        
        // XHR target.
        } else {
          content = $.getJSON(href, function(res) {
            /*
              FIXME This is inflexible. Make not be.
              Right now this is forced to be form content.
              Should not be like that.
            */
            if (res.content.form) {
              self.uiPopdownDialogContent.html(res.content.form);
              self.options.currentUri = href;
              callback();
            }
          });
        }
        
      }
    },
    reset: function() {
      this.close();
      this.uiPopdownDialogContent.html('');
    },
    destroy: function() {
      this.uiPopdownDialog.hide();
    }
  });

  $.extend( $.ui.popdownDialog, { version: "0.4.7" } );

  }(jQuery));
  
$(document).ready(function() {
  $("a.popdown-cancel").live("click", function(event) {
    $(".dialog-popdown").popdownDialog("close");
    event.preventDefault();
  });
  // Event listener for inline dialogs.
  $("a.dialog-popdown").popdownDialog();
});
