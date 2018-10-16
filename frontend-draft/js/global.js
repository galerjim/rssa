var consent_check=0;
var nrOfQns = 0;

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

	nrOfQns = $('.question').length;
	$('#surveypage1, #surveypage1button,#surveypage2, #surveypage2button, #surveypage3, #surveypage3button, #surveypage4, #surveypage4button').hide();
	$(".question .rad_row td").click(function() {
		$(this).find('input[type="radio"]').each(function() {
			$(this).prop('checked', true);
		});
		$(this).parent().parent().css("border-left", "3px solid #00cc00");
	});


	
	$('#surveypage1, #surveypage1button').show().fadeIn("slow");

	

		$('#surveypage1button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#surveypage1button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $('#surveypage1');
		if (isSurveyComplete(hookpage)) {
			postEvent('START_FINAL_SURVEY', {message: 'Started Final Survey'});
			//go to page 2
			secondanswers = saveSurveyResults(hookpage, secondanswers);
			$('#surveypage1, #surveypage1button').fadeOut("slow", function() {
				$('#surveypage1, #surveypage1button').hide();
				$('#surveypage2, #surveypage2button').show().fadeIn("slow");
			});
		} else {
			$(this).attr("data-under-process", "false");
		}
	});
	
	for(let pageNo = 2; pageNo <= 15; pageNo++) {
		(function(pageNo) {
			$('#surveypage' + pageNo + 'button').click(function() {
				var isUnderProcess = $(this).attr('data-under-process');
				if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
					console.warn('#surveypage' + pageNo + 'button :: Prevented multiple clicks.');
					return;
				}
				$(this).attr("data-under-process", "true");
				let hookpage = $("#surveypage" + pageNo);
				if (isSurveyComplete(hookpage)) {
					secondanswers = saveSurveyResults(hookpage, secondanswers);
					$('#surveypage' + pageNo + ', #surveypage' + pageNo + 'button').fadeOut("slow", function() {
						let nextPageNo = pageNo + 1;
						$('#surveypage' + pageNo + ', #surveypage' + pageNo + 'button').hide();
						$('#surveypage' + nextPageNo + ', #surveypage' + nextPageNo + 'button').show().fadeIn("slow");
					});
				} else {
					$(this).attr("data-under-process", "false");
				}
			});
		})(pageNo);
	}

	//last survey page
	$('#surveypage16button').click(function() {
		var isUnderProcess = $(this).attr('data-under-process');
		if(typeof isUnderProcess !== typeof undefined && isUnderProcess == "true") {
			console.warn("#surveypage16button :: Prevented multiple clicks.");
			return;
		}
		$(this).attr("data-under-process", "true");
		var hookpage = $('#surveypage16');
		if (isSurveyComplete(hookpage)) {
			secondanswers = saveSurveyResults(hookpage, secondanswers);
			finish();
		} else {
			$(this).attr("data-under-process", "false");
		}
	});

	

});