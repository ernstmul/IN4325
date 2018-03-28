//create a DocumentMouseTracking object
var tracker = new DocumentMouseTracking("userId");	//TODO add actual user identifier and document identifier
var currentTopic = null;

$( document ).ready(function() {

	//show topic
	switchTopic();


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
*	handle showing a new topic
**/
function switchTopic(){
	// pick the topic
	currentTopic = topics.shift();
	
	// add topic to the tracker
	tracker.addTopicId(currentTopic.topicId);

	// ping the server to increase the topic count
	$.post( "/topicIncrease.php", { topicId: currentTopic.topicId, precision: currentTopic.precision} );

	// start a timer
	setTimeout(function(){ switchTopic(); }, (10*60*1000)); //10 minutes in milliseconds

	// show the next document of the topic
	showNextDocument();
}

/**
*	show a new document within the topic
*/
function showNextDocument(){
	//pick next document
	var selected_document = currentTopic.documentIds.shift();

	//get the document JSON
	$.getJSON( "/docs/"+currentTopic.topicId+"/"+selected_document.relevance + "/" + selected_document.url, function( data ) {
		$("#articleArea").html(data.Text);

	});

	//reset the tracker
	tracker.reset();

	//add the documentId to the tracker
	tracker.addDocumentId(selected_document.url);

	console.log("show document");
}


/**
*	handles the click of the (non)relevant buttons
*
*	param clickedRelevant: determines if the relevant button was clicked
**/
function handleButtonClick(clickedRelevant){
	console.log(tracker.trackingResult());

	//TODO save results to server
}


