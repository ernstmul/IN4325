<?php
	
class Topic{


	public $topicId;
	private $title;
	public $precision;
	private $count;

	public $documentIds;

	/**
	*	create the Topic by the values of the database
	**/
	public function __construct($values_array){
		$this->topicId 		= isset($values_array['topicId']) ? intval($values_array['topicId']) : null;
		$this->title 		= isset($values_array['title']) ? $values_array['title'] : null;
		$this->precision 	= isset($values_array['precision']) ? doubleval($values_array['precision']): null;
		$this->count 		= isset($values_array['count']) ? intval($values_array['count']) : null;
	}

	/**
	*	select the document id's needed for this topic
	*/
	public function getDocumentIds(){

		#1. create empty array
		$this->documentIds = array();

		#2. look in the folder ../docs/{topicId}/{0 || 1 || 2}/ to find the (non)relevant documents
		$docsPerRelevance = array(
			0	=>	$this->getDocumentsWithRelevance(0),
			1	=>	$this->getDocumentsWithRelevance(1),
			2	=>	$this->getDocumentsWithRelevance(2),
		); 

		#3. add the relevance 1 documents to the documentIds (we use all relevant docs for the array)
		foreach($docsPerRelevance[1] as $document){
			$this->documentIds[] = array("relevance" => 1, "url" => $document);
		}
		#4. add the relevance 2 documents to the documentIds (we use all relevant docs for the array)
		foreach($docsPerRelevance[2] as $document){
			$this->documentIds[] = array("relevance" => 2, "url" => $document);
		}

		#5 fill the documentIds array with non-relevant documents to meet the $precision level required
		$neededNonRelevantDocs = (count($this->documentIds) / ($this->precision * 10)) * ((1-$this->precision)*10);
		for($nonRelevantCount = 0; $nonRelevantCount < $neededNonRelevantDocs; $nonRelevantCount++){
			//add tot the documents, if exists
			if(isset($docsPerRelevance[0][$nonRelevantCount])){
				$this->documentIds[] = array("relevance" => 0, "url" => $docsPerRelevance[0][$nonRelevantCount]);	
			}
			else{
				//if this else gets hit, the precision number isn't correct anymore. There will be more relevant documents in the output than required. We need to check with the dataset if this can actually occur
			}
			
		}
	}


	/**
	*	return array with document ids of documents for the topic and relevance level
	*/
	private function getDocumentsWithRelevance($relevance_level){
		#1.	setup output array
		$output_array = array();

		#2. open the folder handle
		$handle = opendir(__DIR__."/../../html/docs/".$this->topicId."/".$relevance_level);

		#3. loop through the folder content to find the documents, and add them to the output_array
		while (false !== ($entry = readdir($handle))) {
			//entry must contain .json, otherwise its not a file we want to show (e.g. a previous folder ("..") is also an entry here)
	        if (strpos($entry, ".json") != false) {
	        	//add the the output_array
	            array_push($output_array, $entry);
	        }
	    }

	    #4. close the handle
	    closedir($handle);

	   	#5. if looking into the non-relevant files, we shuffle the array (so we eventually get all documents)
	   	shuffle($output_array);

	    #5. return the output_array
	    return $output_array;
	}
}