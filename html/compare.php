<?php
	$original = json_decode(file_get_contents(__DIR__."/../labelling/division.json"), true);

	$index = isset($_GET['index']) ? $_GET['index'] : 0;

	$imageId = $original['refineOverlapIDs'][$index];

	require_once(__DIR__."/../php/classes/database.class.php");
	$database = new database();


	$judgements = $database->getJudgementForImage($imageId);

	echo $judgements[0]['judger']."<br/>".$judgements[0]['labels']."<br/><br/>";
	echo $judgements[1]['judger']."<br/>".$judgements[1]['labels']."<br/><br/>";

	echo "<img src='/screenshots/".$imageId.".jpeg/>";

?>