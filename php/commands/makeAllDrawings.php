<?php
	require_once(__DIR__."/../classes/database.class.php");
	$database = new database();
	
	$measurements = $database->getAllMeasurements();

	foreach($measurements as $measurement){
		$jsonInfo = json_decode($measurement['jsonstring'], true);

		//filter out all empty userIds (they were testing)
		if($jsonInfo['userId'] != ""){
			//make the screenshot
			echo "Drawing:".$measurement['id']."\n";
			shell_exec("phantomjs /Sites/IN4325/screenshots.js ".$measurement['id']);
		}
	}
?>