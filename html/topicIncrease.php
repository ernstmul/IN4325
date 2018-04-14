<?php
	$topicId = isset($_POST['topicId']) ? $_POST['topicId'] : null;
	$precision = isset($_POST['precision']) ? $_POST['precision'] : null;

	//ignore if no valid topic is found
	if($topicId != null){
		//get database
		require_once(__DIR__."/../php/classes/database.class.php");
		$database = new database();

		//update
		$database->incrementTopicCount($topicId, $precision);
	}
?>