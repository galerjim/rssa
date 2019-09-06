var nrOfMovies = $(".movie-block").length;
var movieIDs = [];

$(document).ready(function() {
    //loadRandomMovies();

    $("#start").click(function() {
        //$(location).attr('href', 'pg1.html');
        
        
        loadRandomMovies();
        $('#start').hide();
        $('#preference1').show().fadeIn("slow");
   
	});

    $("#preference1").click(function() {
        //$(location).attr('href', 'pg1.html');
        
        var hookpage = $("#movie_ribbon");
		if (isRatingComplete(hookpage)) {
            collectRatings(hookpage);
            console.log("test2");
            resetRating(hookpage);
            loadRandomMovies();
            $('#preference1').hide();
		    $('#preference2').show().fadeIn("slow");
        } 
        else{
            console.log("not complete");
        }
	});
	$("#preference2").click(function() {
		//$(location).attr('href', 'pg1.html');
		var hookpage = $("#movie_ribbon");
		if (isRatingComplete(hookpage)) {
            collectRatings(hookpage);
            resetRating(hookpage);
            loadRandomMovies();
            $('#preference2').hide();
		    $('#preference3').show().fadeIn("slow");
		} 

	});
	$("#preference3").click(function() {
        //$(location).attr('href', 'pg1.html');
        
        window.STUDY.getInstance().recommende();
      //  window.STUDY.getInstance().move(2);
	});

    $(".rating").click(function() {
        //$(location).attr('href', 'pg1.html');
        var hookpage = $("#movie_ribbon");
        
        var element = document.getElementById("ratingscount");
        element.innerHTML = ratingCount(hookpage).toString();
 
	});

});


function loadRandomMovies() {
    getMoviesCount(function(count) {
        

		for (var i = 0; i < nrOfMovies; i++) {
			var mID = 1 + Math.floor(Math.random() * count.result);
			//match randomly selected movie to movieID
            loadMovieInfo(i, mID, 'id_number');
		}
		$.when.apply($, movieIDs).done(function() {
	//		postInitialMovies();
		});
	});
}


/**
 * Load the movie info on screen
 */
function loadMovieInfo(itemNr, mID, mType) {

	return getMovie(mID, mType, function(movieInfo) {
		//movies[itemNr] = movieInfo;
		itemNr++;

		// Load the correct poster URL
		var pictureURL;
		//if (movieInfo.rtPictureURL.length > 0)
        // pictureURL = movieInfo.rtPictureURL;
        
        if (movieInfo){
            if (movieInfo.result.poster.length > 0){
                pictureURL = movieInfo.result.poster;
                movieIDs.push(mID);
            }
            else
                pictureURL = '/img/m_1.jpg';

            if (movieInfo.result.title.length > 0)
                movietitle = movieInfo.result.title
            else
                movietitle = "Example"
        }
        else{
            pictureURL = '/img/m_1.jpg';
        }
        $('#TN_' + itemNr).prop('src', pictureURL);
        $('#moviename_' + itemNr).text(movietitle);
        
		//$('.block_holder li:nth-child(' + itemNr + ') .img-block').css('background-image', 'url(' + pictureURL + ')');
		//$('.block_holder li:nth-child(' + itemNr + ') .movietitle').text(movieInfo.title);
		//$('.block_holder li:nth-child(' + itemNr + ') .movieyear').text(movieInfo.year);
	});
}

function getMovie(id, type, successCb, failureCb) {
    return $.ajax({
        type: 'GET',
        url: '/api/movies',
        data: {
            id: id,
            type: type
        },
        dataType: 'json',
        success: successCb,
        error: failureCb
    });
}

function getMoviesCount(successCb, failureCb) {
    return $.ajax({
        type: 'GET',
        url: '/api/movies/count',
        data: {},
        dataType: 'json',
        success: successCb,
        error: failureCb
    });
}

function isRatingComplete(hookpage) {
    var counter = 0;
    for (var i = 1; i <= hookpage.find('.rating').length; i++) {
        if (!hookpage.find('input[name=rating_' + i + ']:checked').length) {
            hookpage.find('input[name=rating_' + i + ']').parent().parent().parent().css("border-left", "3px solid #ff3300");
            counter = 1;

        }
    };
    if (counter == 1) return false;
    else {
/*
        for (var i = 1; i <= hookpage.find('.question .rad_row').length; i++) {
            firstanswers.push(hookpage.find('input[name=radOpt_' + i + ']:checked').val());
        };
        return true;
        */
        return true;
    }
}


function resetRating(hookpage) {
    
    hookpage.find('input').removeAttr('checked');
 
}

function collectRatings(hookpage) {
    var ratings = [];
    for (var i = 1; i <= nrOfMovies; i++) {
        var ratingVal = hookpage.find('input[name=rating_' + i + ']:checked').val();
        if(!ratingVal) {
            $(this).attr("data-under-process", "false");
            return;
        }
        ratings.push([movieIDs[i-1], ratingVal]);
    }
    window.STUDY.getInstance().postRatings(ratings);
}



function ratingCount(hookpage) {
    var counter = 0;
    for (var i = 1; i <= hookpage.find('.rating').length; i++) {
        if (hookpage.find('input[name=rating_' + i + ']:checked').length) {
            counter += 1;
        }
    };
    return counter;
}
