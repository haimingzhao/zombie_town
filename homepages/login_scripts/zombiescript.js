$(document).ready(function() {

		$('#backpanel').hide();

		$('#play').hide(); 
		$('#loadgame').hide(); 
		$('#signup').hide(); 
		$('#leaderboard').hide(); 
		$('#rules').hide(); 
		
		$('#titularpanel').hide(); 
		$('#backpanel').slideDown("slow"); 
		$('#titularpanel').hide();

		$('#titularpanel').delay(100).fadeIn("slow"); 
		

		$('#play').delay(300).fadeIn("slow"); 
		$('#loadgame').delay(600).fadeIn("slow"); 
		$('#signup').delay(900).fadeIn("slow");  
		$('#leaderboard').delay(1200).fadeIn("slow");  
		$('#rules').delay(1500).fadeIn("slow");  


   /*$('#play').click(function() {
       $('#homediv').fadeOut("slow", function(){*/
		 /* $('#logindiv').fadeIn('slow');*/
			/*});
   }); */

/*	 $('#homediv').click(function() {
			var result = '<?php echo "cheese" ?>'; 
			alert(result);  
	 }); */

		

/*    $('#play").click(function(e1) {
          $("#newgame").fadeOut(500, function(e2) { // fade first
                $("#newgame").submit(); // then call submit
                e2.preventDefault();
          });
          e.preventDefault();
    });*/
});
