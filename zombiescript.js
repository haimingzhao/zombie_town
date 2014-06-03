$(document).ready(function() {
   /*$('#play').click(function() {
       $('#homediv').fadeOut("slow", function(){*/
		 /* $('#logindiv').fadeIn('slow');*/
			/*});
   }); */

/*	 $('#homediv').click(function() {
			var result = '<?php echo "cheese" ?>'; 
			alert(result);  
	 }); */

    $('#play").click(function(e1) {
          $("#newgame").fadeOut(500, function(e2) { // fade first
                $("#newgame").submit(); // then call submit
                e2.preventDefault();
          });
          e.preventDefault();
    });
});
