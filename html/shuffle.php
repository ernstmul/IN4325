<?php
	$original = json_decode(file_get_contents(__DIR__."/../labelling/division.json"), true);
	//echo "<pre>".print_r($original, true)."</pre>";

	$newRemco = array_merge($original['remcoIDs'], $original['labelOverlapIDs']);
	shuffle($newRemco);

	$newErnst = array_merge($original['ernstIDs'], $original['labelOverlapIDs']);
	shuffle($newErnst);

	$result = array(
		"refineOverlapIDs"	=> $original['refineOverlapIDs'],
		"labelOverlapIDs"	=> $original['labelOverlapIDs'],
		"remcoIDs"				=>	$newRemco,
		"ernstIDs"				=>	$newErnst

	);

	echo json_encode($result);