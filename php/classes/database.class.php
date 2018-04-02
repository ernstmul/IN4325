<?php
	
class database{
		protected $host;
		protected $databaseName;
		protected $account;
		

		public function __construct(){
			
			$this->host = "127.0.0.1";
			$this->databaseName = "IN4325"; 
			$this->databaseUser = "IN4325";
			$this->databasePassword = preg_replace('/\s+/', '', file_get_contents(__DIR__."/database.conf"));
			
			try{
				$this->handler = new PDO("mysql:host=".$this->host.";dbname=".$this->databaseName.";charset=utf8", $this->databaseUser, $this->databasePassword, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'")); 
				}catch(PDOException $e) {
					return false;
				}

		}


		/*	getTopics
		*
		*	return the 4 least used topics
		*/
		public function getTopics($precision){
			//prepare the statement
			$stmt = $this->handler->prepare("SELECT * FROM `topics` WHERE `precision`=:precision ORDER BY `count` ASC LIMIT 0,4");

			$stmt->bindParam(":precision", $precision);

			//execute
			if($stmt->execute()){
				//output array
				$output_array = array();

				//turn the results into Topic classes
				foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $topic){
					array_push($output_array, new Topic($topic));
				}

				return $output_array;
				
			}
			else{
				return array();
			}
		}

		/*	incrementTopicCount
		*
		*	increment the topic count
		*/
		public function incrementTopicCount($topicId, $precision){
			//prepare the statement
			$stmt = $this->handler->prepare("UPDATE`topics` SET `count`=`count`+1 WHERE `precision`=:precision AND `topicId`=:topicId");

			$stmt->bindParam(":precision", $precision);
			$stmt->bindParam(":topicId", $topicId);

			//execute
			$stmt->execute();
		}

		/*	saveMeasurement
		*
		*	save measurement in the database
		*/
		public function saveMeasurement($jsonstring, $timestamp){
			//prepare the statement
			$stmt = $this->handler->prepare("INSERT INTO `measurements` (`jsonstring`, `timestamp`) VALUES (:jsonstring, :timestamp)");

			$stmt->bindParam(":jsonstring", $jsonstring);
			$stmt->bindParam(":timestamp", $timestamp);

			//execute
			$stmt->execute();
		}

		

	}