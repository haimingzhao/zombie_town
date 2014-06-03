#!/usr/bin/php

<html>

	<head>
		<link rel="stylesheet" type="text/css" href="zombiestyle.css">
	</head>
		<body style="background-image:url('HomescrnTheme.jpg')">;

	<!--<body style="background-image:url('HomescrnTheme.jpg')">-->

<div class="outer">
	<div class="inner" align="center">
		<div class="rules">
			<div class="pbackground">
<?php 

$connex = pg_connect("host=db.doc.ic.ac.uk port=5432 dbname=g1327117_u user=g1327117_u password=4TYHhrcGVG"); 

	if ($connex) { 

		$result = pg_query("SELECT * FROM Users ORDER BY HighScore DESC"); 
		$rows = pg_num_rows($result);	
		$row0 = pg_fetch_array($result, 0, PGSQL_NUM);
		$row1 = pg_fetch_array($result, 1, PGSQL_NUM);
		$row2 = pg_fetch_array($result, 2, PGSQL_NUM);
		$row3 = pg_fetch_array($result, 3, PGSQL_NUM);
		$row4 = pg_fetch_array($result, 4, PGSQL_NUM);
	
		$username_attr = 0;
		$highscore_attr = 2; 

		echo "<table>
		<tr><th>User</th><th>High Score</th></tr>
		<tr><td class=\"column\">" . $row0[$username_attr] . "</td><td class=\"columnhs\">" . $row0[$highscore_attr] . "</td></tr>
		<tr><td class=\"column\">" . $row1[$username_attr] . "</td><td class=\"columnhs\">" . $row1[$highscore_attr] . "</td></tr>
		<tr><td class=\"column\">" . $row2[$username_attr] . "</td><td class=\"columnhs\">" . $row2[$highscore_attr] . "</td></tr>
		<tr><td class=\"column\">" . $row3[$username_attr] . "</td><td class=\"columnhs\">" . $row3[$highscore_attr] . "</td></tr>
		<tr><td class=\"column\">" . $row4[$username_attr] . "</td><td class=\"columnhs\">" . $row4[$highscore_attr] . "</td></tr>
		</table>";
	}

?>
			</div>
		</div>
	
		<br>
		<form name="back" method="link" action="homepage.html"> 
			<div class="buttonborder">
				<input class="button" type="submit" value="Back">
			</div>
		</form>

	</div>
</div>

</html>


