$( document ).ready(function() {
  $( document ).mousemove(function( event ) {
  	console.log("Mouse move:" + event.pageX + ", " + event.pageY);
	});
});