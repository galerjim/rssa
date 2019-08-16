var consent_check=0;
var nrOfQns = 0;

$(document).ready(function(){
	
	//Introduction page changes 
	$('#consent, #consentButton, #resize, #resizeButton, #instructions, #instructionsBody, #begin').hide();
	$('#welcome').click(function(){ 
    	$('#optional, #mainBody, #welcome').hide();
		$('#consent, #consentButton').show().fadeIn("slow");
    });
$("#consent_Q tr td").click(function() {
		$('#consentCheckbox').trigger('click');
		$(this).find('input[type="checkbox"]').each(function() {
			$(this).prop('checked', true);
		});
		$("#consent_Q").css("border-left", "3px solid #00cc00");
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

	
	document.getElementById("preference").style.background='#ccc';
	
//preference page, when movie is selected, show interaction
 	$("input[type='radio']").click(function(){

 		
 		//$("input.prefStar:checked").parentUntil(".wrapper-block").not(".middle, .rating").css({"border": "5px solid gold"}).addClass("rated");
 		$("input.prefStar:checked").parent().parent().parent().css({"border": "5px solid gold"}).addClass("rated");

        document.getElementById('NumberOfRankedMovies').innerHTML = document.querySelectorAll('.rated').length;	

        if(document.querySelectorAll('.rated').length == 15) {
        	document.getElementById("preference").disabled = false;
        	document.getElementById("preference").style.background='#0275d8';
        }

 	});


 $('#left-list a').on('click', function (e) {
  e.preventDefault()
  $(this).('show')
})

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
	

	//pg2 when choose buttin is clicked
	$('span.choice').click(function(){
		$(this).toggleClass("choice-button");
 		$(this).toggleClass("btn-primary");
	});

	//attention textbox 
	$('#textbox').keyup(function() {
		if ($(this).val().length != 0) {
			$('#attentionButton').attr('disabled', false);
			$('.survey-next-button button').css({
				"cursor": "pointer",
				"opacity": "1",
				"background-color": "#5cb85c"
			});
		} else {
			$('#attentionButton').attr('disabled', true);
		}

	});

//preference pages
/*
	$('#prefPage2, #prefPage3').hide();

	let prefPgNo = 1;

	$('#preferenceButton').click(function() {

		if(prefPgNo != 3) {
						$('#prefPage' + prefPgNo).hide().fadeOut("slow", function() {
							prefPgNo = prefPgNo + 1;
							$('#prefPage' + prefPgNo + '').show().fadeIn("slow");
						});

		} else {
						window.location.href = "pg1.html";

		}

	});
  
*/	
	
	//survey page visual cue for completion (red/green) 
	$(".question .rad_row td").click(function() {
		$(this).find('input[type="radio"]').each(function() {
			$(this).prop('checked', true);
		});
		$(this).parent().parent().css("border-left", "3px solid #00cc00");
	});
	
/*
$('#surveypage2, #surveypage3,#surveypage4, #surveypage5, #surveypage6, #surveypage7, #surveypage8, #surveypage9, #surveypage10,#surveypage11,#surveypage12, #surveypage13, #surveypage14').hide();
	
	let pageNo = 1;
			$('#survey-next-button').click(function() {

					if(pageNo != 14) {
						$('#surveypage' + pageNo).hide().fadeOut("slow", function() {
						pageNo = pageNo + 1;
						$('#surveypage' + pageNo + '').show().fadeIn("slow");
					});

					} else {

					}

					
				
			});	*/

});