<?php
	//make the drawing
	$drawing = new makeDrawing();
	$drawing->create();
	
	class makeDrawing{
		private $measurementId;
		private $measurement;
		private $database;
		private $content;
		private $topicName;

		/**
		*	create class
		**/
		public function __construct(){
			//require database, and initialize
			require_once(__DIR__."/../classes/database.class.php");
			$this->database = new database();

		}

		/**
		*	get required info and draw
		*/
		public function create(){

			//get the ID
			$this->measurementId = isset($_GET['id']) ? $_GET['id'] : null;

			if($this->measurementId != null){
				//get the measurement
				$this->measurement = $this->database->getMeasurement($this->measurementId);

				 // echo "<pre>".print_r($this->measurement, true)."</pre>";
				 // exit();

				//get the page content
				if(file_exists(__DIR__."/../../html/docs/".$this->measurement['topicId']."/0/".$this->measurement['documentId'])){
					$fileContent = json_decode(file_get_contents(__DIR__."/../../html/docs/".$this->measurement['topicId']."/0/".$this->measurement['documentId']), true);
				}
				else if(file_exists(__DIR__."/../../html/docs/".$this->measurement['topicId']."/1/".$this->measurement['documentId'])){
					$fileContent = json_decode(file_get_contents(__DIR__."/../../html/docs/".$this->measurement['topicId']."/1/".$this->measurement['documentId']), true);
				}
				else if(file_exists(__DIR__."/../../html/docs/".$this->measurement['topicId']."/2/".$this->measurement['documentId'])){
					$fileContent = json_decode(file_get_contents(__DIR__."/../../html/docs/".$this->measurement['topicId']."/2/".$this->measurement['documentId']), true);
				}

				//initialize empty string
				$this->content = "";

				//check if we show full test or only the summary
				if($this->measurement['isSummary']){
					$paragraphMax = 2;
				}
				else{
					$paragraphMax = count($fileContent['Text']);
				}

				//add the needed paragraphs to the body
				for($paragraphCount = 0; $paragraphCount < $paragraphMax; $paragraphCount++){
					$this->content .= "<p>".$fileContent['Text'][$paragraphCount]."</p>";
				}

				//get the topic name
				$this->topicName = $this->database->getTopicName($this->measurement['topicId']);


				$this->renderPage();
			}
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
					<script src="/script/canvasDrawing.js"></script>

					<script>
						var tracking = <?php echo json_encode($this->measurement['tracking']);?>;
						var canvasWidth = <?php echo $this->measurement['viewportX']; ?>;
						var canvasHeight = <?php echo $this->measurement['viewportY']; ?>;
					</script>
				</head>

				<body style='background-color: white; font-size: 16px;'>
					<canvas id='drawing' style='position: absolute; top: 0; left: 0;'></canvas>
					<nav>
						Please judge the document below as relevant or not relevant to the following search topic <span id='topic_name'><strong><?php echo $this->topicName;?></strong></span>.
						<br/><br/>
						<input type='button' value='Relevant' id='relevantButton'/> <input type='button' value='Not Relevant' id='notRelevantButton'/>
						
					</nav>
					<section class='article' id='articleArea'>
						<?php echo print_r($this->content); ?>
					</section>
				</body>
			</html>

			<?php
		}


	}

?>