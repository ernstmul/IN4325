<?php
	$outputJson = isset($_POST['outputJson']) ? $_POST['outputJson'] : null;
	
	//ignore if no valid outputJson is found
	if($outputJson != null){
		//get database
		require_once(__DIR__."/../php/classes/database.class.php");
		$database = new database();

		//update
		$database->saveMeasurement($outputJson, time());
	}
?>