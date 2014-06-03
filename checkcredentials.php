#!/usr/bin/php


<html>
	<head>
		<link rel="stylesheet" type="text/css" href="zombiestyle.css">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script type="text/javascript" src="zombiescript.js"></script>

		<title>ZombieGame</title>


	</head>
	<body style="background-image:url('HomescrnTheme.jpg')">

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

		// Get values from page.
		$username = $_POST["username"];
		$password = $_POST["password"];

		// Make the queries. 
		$result = pg_query($connex, "SELECT Username, Password FROM Users"); 		
		$rows = pg_num_rows($result);	

		// Verify the supplied credentials. 
		$i = 0;
 
		for($i; $i < $rows; $i++) {
			$arr = pg_fetch_array($result, $i, PGSQL_NUM);
			if ($arr[0] == $username) {
				if ($arr[1] == $password) {
						echo "successful login!"; 
				} 
			} 
		}


	/*	pg_close($connex); */

	}

?>





