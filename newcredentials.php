#!/usr/bin/php

<?php


$connex = pg_connect("host=db.doc.ic.ac.uk port=5432 dbname=g1327117_u user=g1327117_u password=4TYHhrcGVG"); 

	if ($connex) { 

		$newusername = $_POST["newusername"];
		$newpassword = $_POST["newpassword"];
		$confirmpassword = $_POST["confirmpassword"]; 

		$countprev = pg_query($connex, "SELECT COUNT(*) FROM Users"); 
		$result = pg_query($connex, "SELECT Username FROM Users"); 		

		// Check if the username is already in use. 
	/*	$i = 0; 
		for($i; $i < $count; $i++) {
			$arr = pg_fetch_array($result, $i, PGSQL_NUM);
			if ($arr[0] == $newusername) {
				// username taken...deal with this
			} 
		}*/

		// Check passwords match.
		if ($newpassword != $confirmpassword) {
			// do something
		}

		// If not in use already, add credentials to the database. 
		/*$result2 = pg_query($connex, "INSERT INTO Users VALUES('" . $newusername . "', '" . $newpassword . "', 0);"); 
		
		$countnext = pg_query($connex, "SELECT COUNT(*) FROM Users"); 
*/
		$arr = pg_fetch_array($result, 0, PGSQL_NUM);
		echo $arr[0] . "\n"; 
		echo $arr[1] . "\n"; 
		echo $arr[2] . "\n\n"; 
		$arr = pg_fetch_array($result, 1, PGSQL_NUM);
		echo $arr[0] . "\n"; 
		echo $arr[1] . "\n"; 
		echo $arr[2] . "\n\n"; 



		pg_close($connex); 
	}
?>
