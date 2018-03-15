//create a DocumentMouseTracking object
var tracker = new DocumentMouseTracking("userId","documentId");	//TODO add actual user identifier and document identifier

$( document ).ready(function() {
	//track click relevant button
	$("#relevantButton").click(function() {
	 	handleButtonClick(true);
	});

	//track click relevant button
	$("#notRelevantButton").click(function() {
	 	handleButtonClick(false);
	});

	//add listener for mouse events
	$( document ).mousemove(function( event ) {
			//console.log("Mouse move:" + event.pageX + ", " + event.pageY);
			tracker.add(event.pageX, event.pageY);
	});
});


/**
*	handles the click of the (non)relevant buttons
*
*	param clickedRelevant: determines if the relevant button was clicked
**/
function handleButtonClick(clickedRelevant){
	console.log(tracker.trackingResult());

	//TODO save results to server
}


