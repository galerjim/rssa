var consent_check = 0;



$(document).ready(function() {

	//Introduction page changes 
	$('#consent, #consentButton, #resize, #resizeButton, #instructions, #instructionsBody, #begin, #preference2, #preference3').hide();
	$('#welcome').click(function() {
		$('#optional, #mainBody, #welcome').hide();
		$('#consent, #consentButton').show().fadeIn("slow");
	});

	$('#resizeButton').click(function() {
		$('#resize, #resizeButton').hide();
		$('#begin, #instructionsBody').show().fadeIn("slow");
	});

	$("#begin").click(function() {
		//$(location).attr('href', 'preference.html')
		window.STUDY.getInstance().move(1);
	});
	//Consent page safeguard 
	$('input[type=checkbox][name=consent_test]').change(function() {
		$(".safe-button").children("button").css({
			"cursor": "pointer"
		});
		consent_check = 1;
	});

	$("#consent_Q tr td").click(function() {
		$('#consentCheckbox').trigger('click');
		$(this).find('input[type="checkbox"]').each(function() {
			$(this).prop('checked', true);
		});
		$("#consent_Q").css("border-left", "3px solid #00cc00");
	});

	$("#consentButton").click(function() {
		if (consent_check == 1) {
			$('#consent, #consentButton').hide();
			$('#resize, #resizeButton').show().fadeIn("slow");
		}
	});
	//end of consent safeguard 
	$("#mov1").hover(function() {
		$(".card-title").text("Lion King");
		$(".card-img").attr('src', 'img/m1.jpg');
		$("#tester").toggle();
	});

	$("#mov2").hover(function() {
		$(".card-title").text("The Notebook");
		$("#tester").toggle();
	});

	$("#mov3").hover(function() {
		$(".card-title").text("Men in Black");
		$("#tester").toggle();
	});

	$("#mov4").hover(function() {
		$(".card-title").text("The Curious Case of Benjamin Button");
		$("#tester").toggle();
	});

	
});