
class DocumentMouseTracking{

	constructor(userId){
		this.userId 	= userId;
		this.documentId = null;
		this.topicId 	= null;
		this.decision 	= null;
		this.viewportX	= window.innerWidth;
		this.viewportY	= window.innerHeight;
		this.tracking 	= new Array();
		this.isSummary	= null;
	}

	/**
	*	topicId: integer
	**/
	addTopicId(topicId){
		this.topicId = topicId;
	}

	/**
	*	documentId: string
	**/
	addDocumentId(documentId){
		this.documentId = documentId;
	}
	
	/**
	*	pageX: integer
	*	pageY: integer
	**/
	add(pageX, pageY){
		
		//add the event to the tracking array
		this.tracking.push({x: pageX, y: pageY, scrollOffset: window.pageYOffset, time: new Date().getTime()});
	}

	trackingResult(){
		return this;
	}

	/**
	*	reset, reset all tracking values
	*/
	reset(){
		this.tracking = new Array();
	}
}