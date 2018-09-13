var consent_check=0;
$(document).ready(function(){
	
	//Introduction page changes 
	$('#consent, #consentButton, #resize, #resizeButton, #instructions, #instructionsBody, #begin').hide();
	$('#welcome').click(function(){ 
    $('#optional, #mainBody, #welcome').hide();
	$('#consent, #consentButton').show().fadeIn("slow");
    });
	
	$('#resizeButton').click(function(){
	$('#resize, #resizeButton').hide();	
	$('#begin, #instructionsBody').show().fadeIn("slow");	
	});	
	
	$( "#begin" ).click(function() { 
	$(location).attr('href', 'preference.html')
});
	//Consent page safeguard 
	$('input[type=checkbox][name=consent_test]').change(function(){
	$(".safe-button").children("button").css({"cursor":"pointer"});
	consent_check=1;
});

$( "#consent_Q tr td" ).click(function() {
	$('#consentCheckbox').trigger('click');
	$(this).find('input[type="checkbox"]').each(function() {
	$(this).prop('checked',true);
	});
	$("#consent_Q").css("border-left","3px solid #00cc00");
});

$( "#consentButton" ).click(function() { 
   if(consent_check==1)
	{
		$('#consent, #consentButton').hide();
	$('#resize, #resizeButton').show().fadeIn("slow");
	}
});

//preference page rating
$("#movie_").change(function(){
	if('input[type=radio][name^=rating_]'.length >=1 )
	{

		$(".img-block").css({
				"border": "4px solid blue"
			});
	}
});

//preference page, when movie is selected, show interaction
 $("input[type='radio']").click(function(){
 	$("input.prefStar:checked").parentsUntil(".wrapper-block").not(".middle, .rating").css({"border": "5px solid gold"});

 });
 

	//end of consent safeguard 
    $("#mov1").hover(function(){
    $(".card-title").text("Lion King"); 
    $(".card-img").attr('src', 'img/m1.jpg');	
       $("#tester").toggle();
    });
	
	$("#mov2").hover(function(){
    $(".card-title").text("The Notebook");    
       $("#tester").toggle();
    });
	
	$("#mov3").hover(function(){
    $(".card-title").text("Men in Black");    
       $("#tester").toggle();
    });
	
	$("#mov4").hover(function(){
    $(".card-title").text("The Curious Case of Benjamin Button");    
       $("#tester").toggle();
    });

    $("#mov5").hover(function(){
    $(".card-title").text("300");    
       $("#tester").toggle();
    });

    $("#mov6").hover(function(){
    $(".card-title2").text("Star Wars");    
       $("#tester2").toggle();
    });

    $("#mov7").hover(function(){
    $(".card-title2").text("The Avengers");    
       $("#tester2").toggle();
    });

    $("#mov8").hover(function(){
    $(".card-title2").text("Citizen Kane");    
       $("#tester2").toggle();
    });

    $("#mov9").hover(function(){
    $(".card-title2").text("Inception");    
       $("#tester2").toggle();
    });

    $("#mov10").hover(function(){
    $(".card-title2").text("Porta ac consectetur ac");    
       $("#tester2").toggle();
    });
	
	$( "#preference" ).click(function() { 
   $(location).attr('href', 'pg1.html');
});
});