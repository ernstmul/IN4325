<?php

	$judgement = new Judgement();
	$judgement->run();	//run the system

	class Judgement{

		private $database;
		
		/**
		*	create class
		**/
		public function __construct(){
			//require database, and initialize
			require_once(__DIR__."/classes/database.class.php");
			$this->database = new database();

		}

		/**
		*	run
		**/
		public function run(){
			$action = isset($_GET['action']) ? $_GET['action'] : null;

			if($action == "new"){
				//get a new to be judged entry
				echo json_encode($this->getNewDocumentToJudge());
			}
			else if($action == "save"){
				//save a judgement
				//get the judger	
				$judger = isset($_GET['judger']) ? $_GET['judger'] : null;

				//loop through the posted labels
				$labelString = "";
				foreach(array_keys($_POST['labels']) as $key){
					if($_POST['labels'][$key] == "true"){
						$labelString .= $key .",";
					}
				}

				//save
				$this->database->saveJudgement(
					$_POST['imageId'],
					$_POST['documentId'],
					$_POST['topicId'],
					($_POST['isSummary'] == "false") ? false : true,
					($_POST['userDecidedRelevant'] == "false") ? false : true,
					$_POST['articleIsRelevant'],
					$labelString,
					$judger
				);
			}
			else{
				$this->showTemplate();
			}
		}


		/**
		*	show the template
		**/
		private function showTemplate(){
			?>
			<!DOCTYPE html>
				<head>
					<title>Label</title>
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
					<script src="/script/judgement.js"></script>
				</head>
				<body>
					<div style='float: left; width: 150px;'/>
						<h1>Judger</h1>
							<label><input type='radio' value='remco' name='judger' onClick='getDocument()'> Remco</label><br/>
							<label><input type='radio' value='ernst' name='judger' onClick='getDocument()'> Ernst</label>

						<h1>Labels</h1>
							<label><input type='checkbox' id='decision-only'/> decision-only</label><br/>
							<label><input type='checkbox' id='horizontal'/> horizontal</label><br/>
							<label><input type='checkbox' id='vertical'/> vertical</label><br/>
							<label><input type='checkbox' id='highlighting'/> highlighting</label><br/>
							<label><input type='checkbox' id='re-scoping'/> re-scoping</label><br/>
							<label><input type='checkbox' id='scrolling'/> scrolling</label><br/>
							<label><input type='checkbox' id='random'/> random</label><br/>
							<label><input type='checkbox' id='no-movement'/> no-movement</label><br/><br/>

							<input type='button' value='Save' onClick='saveJudgement()'/>
					</div>	
					<div style='float: left; width: calc(100% - 180px)'/>
						<h1>Info</h1>
						Set: <strong><span id='set'></span></strong><br/>
						Image: <span id='imageId'></span><br/>
						Document: <span id='documentId'></span><br/>
						Topic: <span id='topicId'></span><br/>
						Is summary: <span id='isSummary'></span><br/>
						User decided relevant: <span id='userDecidedRelevant'></span><br/>
						Article is relevant: <span id='articleIsRelevant'></span> (0, 1 or 2)<br/>
						UserId: <span id='userId'></span>
						<br/><br/>
						<img src='' id='screenshot' style='width:100%;'/>
					</div>
				</body>
			</html

			<?php
		}

		/**
		*	getNewDocumentToJudge
		**/
		private function getNewDocumentToJudge(){		
			//get the judger	
			$judger = isset($_GET['judger']) ? $_GET['judger'] : null;

			//load division
			$division = json_decode(file_get_contents(__DIR__."/../labelling/division.json"), true);

			//load already performed ids by judger
			$performedIds = $this->database->getJudgedIds($judger);

			//check if we need to perform labelOverps
			$labelOverlapDifference = array_diff($division['labelOverlapIDs'], $performedIds);
			$labelOverlapDifference = array_values($labelOverlapDifference);

			if(count($labelOverlapDifference) > 0){
				//not all overlap ids are checked, so return one of these
				$random = rand(0, count($labelOverlapDifference) - 1);
				if(!isset($labelOverlapDifference[$random])){
					echo "Count: ".count($labelOverlapDifference)."\nrandom:".$random;

					echo "\n\n";
					echo print_r($labelOverlapDifference, true);
					return;
				}
				return $this->prepareJudgement($labelOverlapDifference[$random], "labelOverlapIDs (to go:".(count($labelOverlapDifference) - 1).")");
			}
			else{
				//check for refineOverlapIds
				$labelRefineOverlapDifference = array_diff($division['refineOverlapIDs'], $performedIds);
				$labelRefineOverlapDifference = array_values($labelRefineOverlapDifference);

				if(count($labelRefineOverlapDifference) > 0){
					//not all refined overlap IDs are performed, so return on of these
					return $this->prepareJudgement($labelRefineOverlapDifference[rand(0, count($labelRefineOverlapDifference) - 1)], "refineOverlapIDs (to go:".(count($labelRefineOverlapDifference) - 1).")");
				}
				else{
					//get one of the personal ids
					$personalIds = ($judger == "remco") ? $division['remcoIDs'] : $division['ernstIDs'];

					$labelPersonalDifference = array_diff($personalIds, $performedIds);
					$labelPersonalDifference = array_values($labelPersonalDifference);

					if(count($labelPersonalDifference) > 0){
						//get a personal Id
						return $this->prepareJudgement($personalIds[rand(0, count($personalIds) - 1)], "personal (to go:".(count($labelPersonalDifference) - 1).")");
					}
					else{
						//user is done
						return null;
					}
				}

			}


			return null;
		}

		/**
		*	get the information ready to be display
		**/
		private function prepareJudgement($id, $set){
			//get the measurement
			$measurement = $this->database->getMeasurement($id);

			$documentId = substr($measurement['documentId'], 0, -5);

			$output = array(
				"imageId"					=> $id,
				"documentId"				=> $documentId,
				"topicId"					=> $measurement['topicId'],
				"isSummary"					=> ($measurement['isSummary']) ? "true" : "false",
				"userDecidedRelevant"		=> ($measurement['decision']) ? "true" : "false",
				"articleDecidedRelevant"	=> $this->findActualRelevance($documentId),
				"set"						=> $set,
				"userId"						=> $measurement['userId']
			);
			
			return $output;
		}

		/**
		*	find the actual relevance value
		**/
		private function findActualRelevance($documentId){
			$actualRelevanceList = explode("\n",file_get_contents(__DIR__."/../data/relevance_judgements_processed.txt"));

			foreach($actualRelevanceList as $entry){
				list($topicId, $number, $id, $relevance) = explode(" ", $entry);

				if($id == $documentId){
					return intval(substr($relevance, 0,1));
				}
			}

			return -1;
		}

	}