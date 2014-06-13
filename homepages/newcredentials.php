#!/usr/bin/php

<html>
	<head>
		<link rel="stylesheet" type="text/css" href="css/zombiestyle.css">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script type="text/javascript" src="login_scripts/zombiescript.js"></script>

		<title>ZombieGame</title>


	</head>
	<body style="background-image:url('images/HomescrnTheme.jpg')">

	<div class="outer">

		<div class="inner" align="center">
			
			<div id="homediv">
					<div>
						<br>
						<form name="newgame"> 
							<div class="buttonborder" id="play">
							<input id="play" class="button" type="submit" value="Play!">
							</div>
						</form>
					</div>

					<div>
						<br>
						<form name="loadgame" method="link" action="login.html"> 
							<div class="buttonborder">
								<input class="button" type="submit" value="Login">
							</div>
						</form>
					</div>

					<div>
						<br>
						<form name="signup" method="link" action="signup.html"> 
							<div class="buttonborder">
								<input class="button" type="submit" value="Sign Up">
							</div>
						</form>
					</div>
	
					<div>
						<br>
						<form name="rules" method="link" action="rules.html"> 
							<div class="buttonborder">
								<input class="button" type="submit" value="Rules">
							</div>
						</form>
					</div>
			</div>
		</div>		
	</div>
<body>


</html>


<?php


$connex = pg_pconnect("host=db.doc.ic.ac.uk port=5432 dbname=g1327117_u user=g1327117_u password=4TYHhrcGVG"); 

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
		$result2 = pg_query($connex, "INSERT INTO Users VALUES('" . $newusername . "', '" . $newpassword . "', 0);"); 

		echo "successfully added new user\n"; 
		


		/*pg_close($connex); */

	}
?>


