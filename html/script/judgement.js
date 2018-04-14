
function getDocument(){
	//get the judger
	var judger = $('input[name=judger]:checked').val();

	//get the image to judge
	$.getJSON( "/judgement.php?action=new&judger="+judger, function( data ) {
	  $("#imageId").html(data.imageId);
	  $("#documentId").html(data.documentId);
	  $("#topicId").html(data.topicId);
	  $("#isSummary").html(data.isSummary);
	  $("#userDecidedRelevant").html(data.userDecidedRelevant);
	  $("#articleIsRelevant").html(data.articleDecidedRelevant);
	  $("#set").html(data.set);
	  $("#userId").html(data.userId);
	  $("#screenshot").prop("src", "/screenshots/" + data.imageId + ".jpeg");
	});
}

function saveJudgement(){
		//get the judger
	var judger = $('input[name=judger]:checked').val();

	if(typeof judger == "undefined"){
		alert("Select judger first");
		return;
	}

	var labelObject = {
		decisionOnly: $("#decision-only").prop("checked"),
		horizontal: $("#horizontal").prop("checked"),
		vertical: $("#vertical").prop("checked"),
		highlighting: $("#highlighting").prop("checked"),
		reScoping: $("#re-scoping").prop("checked"),
		scrolling: $("#scrolling").prop("checked"),
		random: $("#random").prop("checked"),
		noMovement: $("#no-movement").prop("checked"),
	}

	var sendObject = {
		imageId: $("#imageId").html(),
	  	documentId: $("#documentId").html(),
	  	topicId: $("#topicId").html(),
	  	isSummary: $("#isSummary").html(),
	  	userDecidedRelevant: $("#userDecidedRelevant").html(),
	  	articleIsRelevant: $("#articleIsRelevant").html(),
	  	labels: labelObject
	}



	$.ajax({
	  url: '/judgement.php?action=save&judger=' + judger,
	  type: 'POST',
	  data: sendObject,
	  success: function(data){
	    //reset the checkboxes
	    decisionOnly: $("#decision-only").prop("checked", false);
		horizontal: $("#horizontal").prop("checked", false);
		vertical: $("#vertical").prop("checked", false);
		highlighting: $("#highlighting").prop("checked", false);
		reScoping: $("#re-scoping").prop("checked", false);
		scrolling: $("#scrolling").prop("checked", false);
		random: $("#random").prop("checked", false);
		noMovement: $("#no-movement").prop("checked", false);

		//and get new
		getDocument();

	  }
	});
}