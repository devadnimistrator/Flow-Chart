var DrawLine = function() {
	
	$('.boxes').mousedown(function() {
		mouseDown = true;
	});
	$('.boxes').mouseup(function() {
		mouseDown = false;
		var id = $(this).parent().attr('id');
		var $text = $('#' + id).find('.boxes').text();
		var offset = $('#' + id).offset();
		var y = parseFloat(offset.top).toFixed(0);
		var x = parseFloat(offset.left).toFixed(0);
		var w = parseFloat($(this).width()).toFixed(0);
 		changeData(id, w, $text, x, y);
	});
	
	$('.events').mouseup(function() {
		mouseDown = false;
		var id = $(this).attr('id');
		var offset = $('#' + id).offset();
		var $text = $('#' + id).find('.boxes').text();
		var y = parseFloat(offset.top).toFixed(0);
		var x = parseFloat(offset.left).toFixed(0);
		var w = parseFloat($(this).width()).toFixed(0);
 		changeData(id, w, $text, x, y);
	});
	
	$('.boxes').mousemove(function( event ) {
		var eventIds = [];
		if (mouseDown == true) {
			var position = $(this).position();
			for (var i = 0; i < events.length; i ++) {
				if (events[i].toId == $(this).attr('id')) {
					eventIds.push(events[i].id);
				}
			}
			for (var i = 0; i < eventIds.length; i ++) {
				var x = position.left + diffEventPositions[eventIds[i]].x;
				var y = position.top + diffEventPositions[eventIds[i]].y;
				$('#' + eventIds[i]).css({top: y, left: x});
				removeEventsArc();
			}
		}
	});
	
	// Edit Boxes
	$('.outcomes, .events, .contexts').dblclick(function() {
		console.log('OK');
		editBox($(this).find(".boxes"));
	});
	
	function editBox(boxeObj) {
		var id = boxeObj.parent().attr('id');
		var $text = boxeObj.text();
		var width = boxeObj.width() * 1;
		var $edBox = '<input id="' + id + '_edit" class="editboxes" value="' + $text + '" style="width: ' + width + 'px; min-width:30px;" onblur="focusBoxInput(this)"/>';  
		boxeObj.html($edBox);
		$('#' + id + '_edit').focus();
		$('#' + id + '_edit').select();
		$('#' + id + '_edit').keydown(function(e) {
			/*boxeObj.css("color","black");*/
			if(e.which == 13) {
				var inputObj = $(this);
				setTimeout(function() {
					inputObj.parent().trigger('focusout');
				}, 1);
			}
			
		});
	}
	
	function focusBoxInput(inputObj) {
		var boxDiv = $(inputObj).parent();
		
		var id = boxDiv.parent().attr('id');
		var $text = $('#' + id + '_edit').val();
		boxDiv.text($text);
		var offset = $( '#' + id ).offset();
		var y = parseFloat(offset.top).toFixed(0);
		var x = parseFloat(offset.left).toFixed(0);
		var w = parseFloat(boxDiv.width()).toFixed(0);
		drawLine(id);
		changeData(id, w, $text, x, y);
	}
	var boxEndpoint = ['','BottomCenter','BottomLeft','BottomRight'];
		
	function removeEventsArc() {
		for (var i = 0 ; i < events.length ; i ++) {
			jsPlumb.detachAllConnections(events[i].id);
		}
	}
	///////change JSON data///////
	function changeData(id, w, title = false, x = false, y = false) {
		var dataJSON = JSONgeneral;
		for (var i = 0; i < dataJSON.bdt.contexts.length; i ++) {
			if(dataJSON.bdt.contexts[i].id == id){
				dataJSON.bdt.contexts[i].ui.x = x;
				dataJSON.bdt.contexts[i].ui.y = y;
				dataJSON.bdt.contexts[i].ui.w = w;
				dataJSON.bdt.contexts[i].title = title;
			}
		}
		for (var i = 0; i < dataJSON.bdt.outcomes.length; i ++) {
			if(dataJSON.bdt.outcomes[i].id == id){
				dataJSON.bdt.outcomes[i].ui.x = x;
				dataJSON.bdt.outcomes[i].ui.y = y;
				dataJSON.bdt.outcomes[i].ui.w = w;
				dataJSON.bdt.outcomes[i].title = title;
			}
		}
		for (var i = 0; i < dataJSON.bdt.events.length; i ++) {
			if(dataJSON.bdt.events[i].id == id){
				dataJSON.bdt.events[i].ui.x = x;
				dataJSON.bdt.events[i].ui.y = y;
				dataJSON.bdt.events[i].ui.w = w;
				dataJSON.bdt.events[i].title = title;
			}
		}
		showJson(dataJSON);
	}
	///////////
	
	/////////DrawEvents/////////////	
	function drawEvents(JSONdata) {
		var events = JSONdata.bdt.events;
		var contexts = JSONdata.bdt.contexts;
		var outcomes = JSONdata.bdt.outcomes;
		var width = JSONgeneral.bdt.width;
		var height = JSONgeneral.bdt.height;
		var toId = [];
		var toIdXPoint = [];
		var toIdYPoint = [];
		var fromId = [];
		var fromIdXPoint = [];
		var fromIdYPoint = [];
		var clength = [];
		for (var i = 0 ; i < events.length; i ++ ) {
			clength.push(events[i].connection.length);
			for (var j = 0 ; j < contexts.length; j ++) {
				if (events[i].toId == contexts[j].id) {
					toId.push(events[i].toId);
					toIdXPoint.push(parseFloat(contexts[j].ui.x).toFixed(0));
					toIdYPoint.push(parseFloat(contexts[j].ui.y + contexts[j].ui.h / 2).toFixed(0));
				}
				for (var z = 0 ; z < events[i].connection.length ; z ++) {
					if (events[i].connection[z].fromId == contexts[j].id) {
						fromId.push(contexts[j].id);
						fromIdXPoint.push(parseFloat(contexts[j].ui.x + contexts[j].ui.w).toFixed(0)); 
						fromIdYPoint.push(parseFloat(contexts[j].ui.y + contexts[j].ui.h / 2).toFixed(0)); 
					}
				}
			}
			for (var j = 0 ; j < outcomes.length; j ++) {
				if (events[i].toId == outcomes[j].id) {
					toId.push(events[i].toId);
					toIdXPoint.push(parseFloat(outcomes[j].ui.x).toFixed(0));
					toIdYPoint.push(parseFloat(outcomes[j].ui.y + outcomes[j].ui.h / 2).toFixed(0));
				}
				for (var z = 0 ; z < events[i].connection.length ; z ++) {
					if (events[i].connection[z].fromId == outcomes[j].id) {
						fromId.push(outcomes[j].id);
						fromIdXPoint.push(parseFloat(outcomes[j].ui.x + outcomes[j].ui.w).toFixed(0)); 
						fromIdYPoint.push(parseFloat(outcomes[j].ui.y + outcomes[j].ui.h / 2).toFixed(0)); 
					}
				}
			}
		}
	}

	/////////////
	
	return {
		init : function() {
      $.getJSON("./data.json", function(data) {
        console.log(data);
      });
      
      
			for (var i = 0; i < events.length; i ++) {
				for (var j = 0; j < contexts.length; j ++) {
					if (contexts[j].id == events[i].toId) {
						var diffX = events[i].ui.x - contexts[j].ui.x;
						var diffY = events[i].ui.y - contexts[j].ui.y;
						diffEventPositions[events[i].id] = {x: diffX, y: diffY};
					}
				}
				for (var j = 0; j < outcomes.length; j ++) {
					if (outcomes[j].id == events[i].toId) {
						var diffX = events[i].ui.x - outcomes[j].ui.x;
						var diffY = events[i].ui.y - outcomes[j].ui.y;
						diffEventPositions[events[i].id] = {x: diffX, y: diffY};
					}
				}
			}
		}
	}
}();

jsPlumb.ready(function() {
	DrawLine.init();
	
	DrawLine.start();
});

