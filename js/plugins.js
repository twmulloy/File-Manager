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


