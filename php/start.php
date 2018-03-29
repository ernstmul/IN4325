<?php

	$IN4325 = new IN4325();
	$IN4325->run();	//run the system

	class IN4325{

		private $database;
		private $topics;				//array with topics, containing the selected documents

		/**
		*	create class
		**/
		public function __construct(){
			//require database, and initialize
			require_once(__DIR__."/classes/database.class.php");
			$this->database = new database();

			//require topic class
			require_once(__DIR__."/classes/Topic.class.php");

		}

		/**
		*	Select topic, precision, accuracy, documents and show the interface
		*/
		public function run(){
			#1. get the precision
			$precision = isset($_GET['precision']) ? $_GET['precision'] : $this->getRandomPrecision();

			#2. get the 4 least used topics from the database
			$this->topics = $this->database->getTopics($precision);

			#3. get document id's for all topics
			foreach($this->topics as $topic){
				//get the document ids 
				$topic->getDocumentIds();
			}
			
			#4. render the html page
			$this->renderPage();
		}

		/**
		*	render the page
		*/
		private function renderPage(){
			?>
			<!DOCTYPE html>
			<html lang='en'>
				<head>
					<title>IN4325 - Relevance checker</title>

					<!-- Styling -->
					<link href='/css/style.css' rel='stylesheet' />

					<!-- Scripts -->
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
					<script src="/script/DocumentMouseTracking.js"></script>
					<script src="/script/mousetracker.js"></script>
					<script>
						var idunit = <?php echo "'".(isset($_GET['_idunit']) ? $_GET['_idunit'] : "")."'"; ?>;
						var topics = <?php echo json_encode($this->topics); ?>;

					</script>
				</head>

				<body>
					<nav>
						Please judge the document below as relevant or not relevant to the following search topic <span id='topic_name'></span>.
						<br/><br/>
						<input type='button' value='Relevant' id='relevantButton'/> <input type='button' value='Not Relevant' id='notRelevantButton'/>
						
					</nav>
					<section class='article' id='articleArea'>
						
					</section>
				</body>
			</html>

			<?php
		}



		/**
		*	determine a random 50/50 precision
		*/
		private function getRandomPrecision(){
			$precision = array(0.3, 0.6);

			return $precision[rand(0,1)];
		}


	}
?>