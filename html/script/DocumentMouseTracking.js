
class DocumentMouseTracking{

	constructor(userId, documentId){
		this.userId 	= userId;
		this.documentId = documentId;
		this.tracking = new Array();
	}
	
	/**
	*	pageX: integer
	*	pageY: integer
	**/
	add(pageX, pageY){
		
		//add the event to the tracking array
		this.tracking.push({x: pageX, y: pageY, time: new Date().getTime()});
	}

	trackingResult(){
		return this;
	}
}