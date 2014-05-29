#!/usr/bin/php

<?php

$connex = pg_connect("host=db.doc.ic.ac.uk port=5432 dbname=g1327117_u user=g1327117_u password=4TYHhrcGVG"); 

	if ($connex) { 
 
		// Get values from page.
		$username = $_POST["username"];
		$password = $_POST["password"];

		// Make the queries. 
		$count = pg_query($connex, "SELECT COUNT(*) FROM Users"); 
		$result = pg_query($connex, "SELECT Username, Password FROM Users"); 		

		// Verify the supplied credentials. 
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
	
		pg_close($connex); 
	}
?>
