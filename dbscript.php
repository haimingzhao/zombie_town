#!/usr/bin/php

<?php


$connex = pg_connect("host=db.doc.ic.ac.uk port=5432 dbname=g1327117_u user=g1327117_u password=4TYHhrcGVG"); 

	if ($connex) { 

/*				$count = pg_query("SELECT COUNT(*) FROM Users"); 
				$result = pg_query("SELECT * FROM Users"); 		
				$i = 0; 
				for($i; $i < 2; $i++) {
					$arr = pg_fetch_array($result, $i, PGSQL_NUM);
					echo $arr[0] . "\n";
					echo $arr[1] . "\n";
					echo $arr[2] . "\n";
				}
*/

		$username = $_POST["username"];
		$password = $_POST["password"];

		$count = pg_query("SELECT COUNT(*) FROM Users"); 
		$result = pg_query("SELECT Username, Password FROM Users"); 		

		$i = 0; 
		for($i; $i < $count; $i++) {
			$arr = pg_fetch_array($result, $i, PGSQL_NUM);
			if ($arr[0] == $username) {
				if ($arr[1] == $password) {
					echo "successful login!"; 
				} else {
					echo "incorrect password :("; 
				}
			} 
		}

/* 
-Get the username entered
-Get the password entered
-Get the password corresponding to the entered username
-See if it matches the provided password
*/
		
		pg_close($connex); 
	}
?>
