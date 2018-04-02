//create a DocumentMouseTracking object
var tracker = new DocumentMouseTracking("");
var currentTopic = null;
var showSummary = false;

$( document ).ready(function() {

	//alert the user with an explanation about the research
	alert("Hello! Thanks for participating!\n\nYou'll be shown 4 different topics. Every topic is covered for 10 minutes (the system will automatically switch topic). Below the gray box you'll see an article (or part of it).\n\nPlease read the text in full, and use the buttons to decide if the article was relevant to the topic.")

	//set the userid
	tracker.userId = idunit;

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
			tracker.add(event.pageX, event.pageY);
	});
});

/**
*	handle showing a new topic
**/
function switchTopic(){
	// pick the topic
	currentTopic = topics.shift();

	if(currentTopic == null){
		alert("You're done! Thanks for fully completing our research!");
	}
	else{
		// add topic to the tracker
		tracker.addTopicId(currentTopic.topicId);

		// ping the server to increase the topic count
		$.post( "/topicIncrease.php", { topicId: currentTopic.topicId, precision: currentTopic.precision} );

		//display the topic name
		displayTopicName(currentTopic.topicId);

		// start a timer
		setTimeout(function(){ switchTopic(); }, (10*60*1000)); //10 minutes in milliseconds

		// show the next document of the topic
		showNextDocument();
	}
	
	
}

/**
*	show a new document within the topic
*/
function showNextDocument(){
	//pick next document
	var selected_document = currentTopic.documentIds.shift();


	if(selected_document == null){
		//the user got through all documents for the topic within  10 minutes
		switchTopic();
	}
	else{

		//get the document JSON
		$.getJSON( "/docs/"+currentTopic.topicId+"/"+selected_document.relevance + "/" + selected_document.url, function( data ) {
			var htmlText = "";

			//determine the amount of paragraphs we're going to show (alternating summary or full document)
			var maxParagraphs = data.Text.length;
			if(showSummary && data.Text.length > 2){maxParagraphs = 2;}

			for(var paragraphCount = 0; paragraphCount < maxParagraphs; paragraphCount++){
				htmlText += "<p>" + data.Text[paragraphCount] + "</p>";
			}

			$("#articleArea").html(htmlText);

			//store if we selected a summary or not
			tracker.isSummary = showSummary;

			//switch summary variable
			showSummary = !showSummary;

		});

		//reset the tracker
		tracker.reset();

		//add the documentId to the tracker
		tracker.addDocumentId(selected_document.url);
	}

}

/**
*	show the topic name to the user
*/
function displayTopicName(topicId){
	var name;

	switch(topicId){
		case 310:
			name = "Radio Waves and Brain Cancer";
			break;
		case 336:
			name = "Black Bear Attacks";
			break;
		case 362:
			name = "Human Smuggling";
			break;
		case 367:
			name = "Piracy";
			break;
		case 383:
			name = "Mental Illness Drugs";
			break;
		case 426:
			name = "Law Enforcement, Dogs";
			break;
		case 427:
			name = "UV Damage, Eyes";
			break;
		case 436:
			name = "Railway Accidents";
			break;
	}

	$("#topic_name").html("<strong>" + name + "</strong>");
}


/**
*	handles the click of the (non)relevant buttons
*
*	param clickedRelevant: determines if the relevant button was clicked
**/
function handleButtonClick(clickedRelevant){
	//set the decision
	tracker.decision = clickedRelevant;

	//we make a json copy of the object
	var saveTracker =JSON.stringify(tracker);

	//save to own server
	$.post( "/saveMeasurement.php", { outputJson: saveTracker} );

	//save to APONE - code snippet from https://github.com/marrerom/ClientE/blob/master/WebContent/js/search.js
	var inputJson = new Object();
		inputJson.idunit = idunit;
		inputJson.idconfig = "5abd350510801c2f2c6fe2a1";
		inputJson.etype = "JSON";
		inputJson.ename = "relevanceClicked";
		inputJson.evalue = JSON.parse(saveTracker);
	
	var xhttp = getXMLHttpRequest();
		
		xhttp.open("POST", "http://ireplatform.ewi.tudelft.nl:8080/IN4325/service/event/register");
		xhttp.setRequestHeader("Content-Type", "text/plain");   //This same endpoint is also implemented to receive JSON, but if it is used
		var inputTxt = JSON.stringify(inputJson);				//from the client-side as in this case, it may not work due to CORS (Cross-Origin Resource Sharing)
		xhttp.send(inputTxt);


	//show next document
	showNextDocument();
	
}

function getXMLHttpRequest() {
	if (window.XMLHttpRequest) {
		// code for modern browsers
		xmlhttp = new XMLHttpRequest();
	} else {
		// code for old IE browsers
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
}



