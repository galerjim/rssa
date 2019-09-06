window.STUDY = (function() {
	let _instance;

	function init() {
		if(window.LogRocket) {
			window.LogRocket.init('548y59/rssa');
			window.LogRocket.identify(window.SESSION_DATA.userid);
		}
		
		var stepData = {};


		
		
		function getStepData(step, successCb, failureCb) {
			return $.ajax({
				type: 'GET',
				url: '/api/' + window.SESSION_DATA.userid + '/data/step/' + step,
				data: {},
				dataType: 'json',
				success: successCb,
				error: failureCb
			});
		}
		
		function pushStepData(step, key, value) {
			if(!stepData.hasOwnProperty(step)) {
				stepData[step] = {};
			}
			stepData[step][key] = value;
		}
		
		function popStepData(step, key) {
			if(!stepData.hasOwnProperty(step)) {
				stepData[step] = {};
			}
			if(stepData[step].hasOwnProperty(key)) {
				var result = stepData[step][key];
				delete stepData[step][key];
				return result;
			}
			return null;
		}
		
		function postStepData(step, successCb, failureCb) {
			return $.ajax({
				type: 'POST',
				url: '/api/' + window.SESSION_DATA.userid + '/update/step/' + step,
				data: {
					stepData: JSON.stringify(stepData[step])
				},
				dataType: 'json',
				success: successCb,
				error: failureCb
			});
		}
		
		function postEvent(event, eventdesc, successCb, failureCb) {
			return $.ajax({
				type: 'POST',
				url: '/api/' + window.SESSION_DATA.userid + '/update/event',
				data: {
					event: event,
					eventdesc: JSON.stringify(stepData[step])
				},
				dataType: 'json',
				success: successCb,
				error: failureCb
			});
		}
		
		function move(newStep) {
			var form = $('<form></form>');
			form.attr('method', 'post');
			form.attr('action', '/' + window.SESSION_DATA.userid + '/move');
			var field = $('<input></input>');
			field.attr('type', 'hidden');
			field.attr('name', 'newStep');
			field.attr('value', newStep);
			form.append(field);
			$(document.body).append(form);
			form.submit();
		}
		
		function postRatings(ratings) {
			return $.ajax({
				type: 'POST',
				//url: '/api/update/ratings',
				url: '/api/' + window.SESSION_DATA.userid + '/update/ratings',
				data: {
					//userid = 
					ratings: JSON.stringify(ratings)
				},
				dataType: 'json',
				error: function(err) {
					console.log(err.responseText);
				}
			});
		}

		function recommende() {
			return $.ajax({
				type: 'POST',
				//url: '/api/update/ratings',
				url: '/api/' + window.SESSION_DATA.userid + '/recommende',
				data: {
				},
				dataType: 'json',
				error: function(err) {
					console.log(err.responseText);
				}
			});
		}

		return {
		//	getMovie: getMovie,
		//	getMovieCount: getMovieCount,
			getStepData: getStepData,
			pushStepData: pushStepData,
			popStepData: popStepData,
			postStepData: postStepData,
			postEvent: postEvent,
			postRatings: postRatings,
			recommende: recommende,
			move: move
		};
	};
	
	return {
		getInstance: function() {
			if (!_instance) {
				_instance = init();
			}
			return _instance;
		}
	};
})();