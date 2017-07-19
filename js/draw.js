var DrawLine = function () {
  var JSONgeneral = "";

  var contexts;
  var outcomes;
  var events;
  var mouseDown = false;
  var diffEventPositions = {};
  var draggableIds = [];
  var boxEndpoint = ['', 'BottomCenter', 'BottomLeft', 'BottomRight'];

  var findObject = function(id) {
    for (var i = 0; i < contexts.length; i ++) {
      if (contexts[i].id == id) {
        return contexts[i];
      }
    }

    for (var i = 0; i < outcomes.length; i ++) {
      if (outcomes[i].id == id) {
        return outcomes[i];
      }
    }

    for (var i = 0; i < events.length; i++) {
      if (events[i].id == id) {
        return events[i];
      }
    }
  }

  var defineValues = function () {
    contexts = JSONgeneral.bdt.contexts;
    outcomes = JSONgeneral.bdt.outcomes;
    events = JSONgeneral.bdt.events;

    for (var i = 0; i < contexts.length; i ++) {
      contexts[i].in = [];;
    }

    for (var i = 0; i < outcomes.length; i ++) {
      outcomes[i].in = [];
    }


    for (var i = 0; i < events.length; i++) {
      for (var j = 0; j < contexts.length; j++) {
        if (contexts[j].id == events[i].toId) {
          var diffX = events[i].ui.x - contexts[j].ui.x;
          var diffY = events[i].ui.y - contexts[j].ui.y;
          diffEventPositions[events[i].id] = {x: diffX, y: diffY};

          contexts[j].in.push(events[i].id);
        }
      }
      for (var j = 0; j < outcomes.length; j++) {
        if (outcomes[j].id == events[i].toId) {
          var diffX = events[i].ui.x - outcomes[j].ui.x;
          var diffY = events[i].ui.y - outcomes[j].ui.y;
          diffEventPositions[events[i].id] = {x: diffX, y: diffY};

          outcomes[j].in.push(events[i].id);
        }
      }

      events[i].in = [];
      for (var j = 0; j < events[i].connection.length; j ++) {
        events[i].in.push(events[i].connection[j].fromId);
      }
    }
  }

  var drawElements = function () {
    var html_str = '';

    html_str += '<div id="drawPanel" style="width: ' + JSONgeneral.bdt.width + '; height: ' + JSONgeneral.bdt.height + '" >';
    for (var i = 0; i < contexts.length; i++) {
      var titleLength = contexts[i].title.length;
      html_str += '<div id="' + contexts[i].id + '" class="contexts shadow" style="position: absolute; top: ' + contexts[i].ui.y + 'px; left: ' + contexts[i].ui.x + 'px; height: ' + contexts[i].ui.h + 'px;">'
      html_str += '<div class="boxes" style="line-height:' + contexts[i].ui.h + 'px;">' + contexts[i].title + '</div>'
      html_str += '<div id="numberCirle" class="boxes-icon numberCircle">B</div>'
      html_str += '<div id="box-img" class="boxes-icon" style="display: none;"><img class="numberCircle-img" src="image/collapsed_icon.png"></div>';
      html_str += '<div class="setting"><i class="fa fa-cog"></i></div>'
      html_str += '</div>';
      draggableIds.push("" + contexts[i].id);
    }

    for (var i = 0; i < outcomes.length; i++) {
      var titleLength = outcomes[i].title.length;
      html_str += '<div id="' + outcomes[i].id + '" class="outcomes shadow" style="position: absolute; top: ' + outcomes[i].ui.y + 'px; left: ' + outcomes[i].ui.x + 'px; height: ' + outcomes[i].ui.h + 'px;">'
      html_str += '<div class="boxes" style="line-height:' + contexts[i].ui.h + 'px;">' + outcomes[i].title + '</div>'
      html_str += '<div id="numberCirle" class="boxes-icon numberCircle">B</div>'
      html_str += '<div id="box-img" class="boxes-icon" style="display: none;"><img class="numberCircle-img" src="image/collapsed_icon.png"></div>';
      html_str += '<div class="setting"><i class="fa fa-cog"></i></div>'
      html_str += '</div>';

      draggableIds.push("" + outcomes[i].id);
    }

    for (var i = 0; i < events.length; i++) {
      var type = events[i].type;
      // if (events[i].type == "and") {
      //   type = "<";
      // } else {
      //   type = ">";
      // }
      html_str += '<div id="' + events[i].id + '" class="events shadow" style="padding-right: 20px; position: absolute; top: ' + events[i].ui.y + 'px; left: ' + events[i].ui.x + 'px; height: ' + events[i].ui.h + 'px;">'
      html_str += '<div id="' + events[i].id + '_box" class="types vertical-text">' + type + '</div>';
      html_str += '<div id="eventbox" class="boxes eventbox" style="margin-top: -25px;">' + events[i].action + '</div></div>';
      draggableIds.push("" + events[i].id);
    }

    html_str += '</div>';

    html_str += '<div>';
    html_str += '<div>';
    html_str += 'JSON Data:';
    html_str += '</div>';
    html_str += '<textarea id="mySavedModel" style="width:100%;height:500px">';
    html_str += '</textarea>';
    html_str += '</div>';

    $('body').append(html_str);
  }

  var showJson = function () {
    var str = JSON.stringify(JSONgeneral, undefined, 4);
    document.getElementById("mySavedModel").value = str;
  }

  var drawLines = function () {
    $('#drawPanel > div').each(function () {
      var id = $(this).attr('id');
      drawLine(id);
    });
  }

  var drawLine = function (id) {
    var count = 0;
    for (var i = 0; i < events.length; i++) {
      var boxEndpoint = ['', 'BottomCenter', 'BottomLeft', 'BottomRight'];
      for (var j = 0; j < events[i].connection.length; j++) {
        if (id == events[i].connection[j].fromId) {
          jsPlumb.connect({
            source: id,
            target: events[i].id,
            anchors: ["RightMiddle", "LeftMiddle"],
            hoverPaintStyle: {stroke: "rgb(0, 0, 135)"},
            paintStyle: {strokeStyle: "#3175ca", lineWidth: 2},
            endpoint: ["Dot", {radius: 0.1}],
            endpointStyle: {fillStyle: "white"},
            connector: ["Bezier", {curviness: 100}]
          });
        }
      }
      var boxEndpoint = ['', 'BottomCenter', 'BottomLeft', 'BottomRight', 'TopRight', 'TopCenter', 'TopLeft'];
      if (id == events[i].id) {
        if (i > 0 && events[i].toId == events[i - 1].toId) {
          jsPlumb.connect({
            source: events[i].id,
            target: events[i].toId,
            anchors: ["TopCenter", boxEndpoint[count]],
            hoverPaintStyle: {stroke: "rgb(0, 0, 135)"},
            paintStyle: {strokeStyle: "#3175ca", lineWidth: 2},
            endpoint: ["Dot", {radius: 0.1}],
            endpointStyle: {fillStyle: "white"},
            connector: ["Bezier", {curviness: 20}]
          });
        } else {
          jsPlumb.connect({
            source: events[i].id,
            target: events[i].toId,
            anchors: ["RightMiddle", "LeftMiddle"],
            hoverPaintStyle: {stroke: "rgb(0, 0, 135)"},
            paintStyle: {strokeStyle: "#3175ca", lineWidth: 2},
            endpoint: ["Dot", {radius: 0.1}],
            endpointStyle: {fillStyle: "white"},
            connector: ["Bezier", {curviness: 20}]
          });
        }
      }
      count++;
    }
  }

  var initEvents = function () {
    jsPlumb.draggable(draggableIds);

    boxMoveEvent();

    boxEditEvent();

  }

  var boxMoveEvent = function () {
    $('.boxes').mousedown(function () {
      mouseDown = true;
    });
    $('.boxes').mouseup(function () {
      mouseDown = false;
      var id = $(this).parent().attr('id');
      var $text = $('#' + id).find('.boxes').text();
      var offset = $('#' + id).offset();
      var y = parseFloat(offset.top).toFixed(0);
      var x = parseFloat(offset.left).toFixed(0);
      var w = parseFloat($(this).width()).toFixed(0);
      changeData(id, w, $text, x, y);
    });

    $('.events').mouseup(function () {
      mouseDown = false;
      var id = $(this).attr('id');
      var offset = $('#' + id).offset();
      var $text = $('#' + id).find('.boxes').text();
      var y = parseFloat(offset.top).toFixed(0);
      var x = parseFloat(offset.left).toFixed(0);
      var w = parseFloat($(this).width()).toFixed(0);
      changeData(id, w, $text, x, y);
    });

    $('.boxes').mousemove(function (event) {
      var eventIds = [];
      if (mouseDown == true) {
        var position = $(this).position();
        for (var i = 0; i < events.length; i++) {
          if (events[i].toId == $(this).attr('id')) {
            eventIds.push(events[i].id);
          }
        }
        for (var i = 0; i < eventIds.length; i++) {
          var x = position.left + diffEventPositions[eventIds[i]].x;
          var y = position.top + diffEventPositions[eventIds[i]].y;
          $('#' + eventIds[i]).css({top: y, left: x});
          removeEventsArc();
        }
      }
    });
  }

  var changeData = function (id, w, title = false, x = false, y = false) {
    var dataJSON = JSONgeneral;
    for (var i = 0; i < dataJSON.bdt.contexts.length; i++) {
      if (dataJSON.bdt.contexts[i].id == id) {
        dataJSON.bdt.contexts[i].ui.x = x;
        dataJSON.bdt.contexts[i].ui.y = y;
        dataJSON.bdt.contexts[i].ui.w = w;
        dataJSON.bdt.contexts[i].title = title;
      }
    }
    for (var i = 0; i < dataJSON.bdt.outcomes.length; i++) {
      if (dataJSON.bdt.outcomes[i].id == id) {
        dataJSON.bdt.outcomes[i].ui.x = x;
        dataJSON.bdt.outcomes[i].ui.y = y;
        dataJSON.bdt.outcomes[i].ui.w = w;
        dataJSON.bdt.outcomes[i].title = title;
      }
    }
    for (var i = 0; i < dataJSON.bdt.events.length; i++) {
      if (dataJSON.bdt.events[i].id == id) {
        dataJSON.bdt.events[i].ui.x = x;
        dataJSON.bdt.events[i].ui.y = y;
        dataJSON.bdt.events[i].ui.w = w;
        dataJSON.bdt.events[i].title = title;
      }
    }
    showJson(dataJSON);
  }
  var showMenuDialog = function (type, $boxobj, menuId) {

    var w = $('#drawPanel').width();
    var h = $('#drawPanel').height();

    var overview = '<div id="menu-overview-panel" class = ' + menuId + ' style="display:none; position: absolute; top: 0; left: 0; width:' + w + 'px; height: ' + h + 'px; background: rgba(0, 0, 0, 0);">';
    overview += '<div class="overview-div" style="position: absolute; top: 0; left: 0; width:100%; height:100%;" background: rgba(0, 0, 0, 0);"></div>';

    var menu_top = 0;
    var menu_left = 0;
    var arrow_pos_class = "arrow-bottom";
    var menu_html = '';
    if (type == 'event') {
      menu_html += '<div id="events-menu" class="events-menu menu-div">';
      menu_html += '<form><input type="radio" id = "events-pop-and"  name="events-menu" value="and" onclick="DrawLine.selectInput(this)"><label for="events-pop-and">And</label><br>';
      menu_html += '<input type="radio" id = "events-pop-or" name="events-menu" value="or" onclick="DrawLine.selectInput(this)"><label for="events-pop-or">Or</label><br></form>';
      menu_html += '<div class="events-arrow"></div>';
      menu_html += '</div>';

      var pos = $($boxobj).position();
      var id = $boxobj[0].id;
      if (pos.top > 100) {
        menu_top = pos.top - 90;
      } else {
        menu_top = pos.top + 55;
        arrow_pos_class = "arrow-top";
      }
      menu_left = pos.left;
      overview += menu_html;

    } else if (type == 'setting') {
      menu_html += '<div id="setting-menu" class="setting-menu menu-div">';
      menu_html += '<div class="pull-left setting-radio">';
      menu_html += '<form>';
      menu_html += '<input type="radio" id = "setting-option1" name = "setting-menu" value = "option1" onclick = "DrawLine.selectInput(this)"><label for="setting-option1">Option1</label><br>';
      menu_html += '<input type="radio" id = "setting-option2" name = "setting-menu" value = "option2" onclick = "DrawLine.selectInput(this)"><label for="setting-option2">Option2</label><br>';
      menu_html += '</form>';
      menu_html += '</div>';
      menu_html += '<div class="pull-left setting-checkbox">';
      menu_html += '<form>';
      menu_html += '<input type="checkbox" id = "setting-option3" name = "setting-menu" value = "option3" onclick = "DrawLine.selectInput(this)"><label for="setting-option3">Option3</label><br>';
      menu_html += '<input type="checkbox" id = "setting-option4" name = "setting-menu" value = "option4" onclick = "DrawLine.selectInput(this)"><label for="setting-option4">Option4</label><br>';
      menu_html += '</form>';
      menu_html += '</div>';
      menu_html += '<div class="pull-left setting-label">';
      menu_html += '<form>';
      menu_html += '<label id = "sub-menu1" class = "sub-menu" onclick="DrawLine.selectInput(this)" for="sub-menu1">Menu1</label><br>';
      menu_html += '<label id = "sub-menu2" class = "sub-menu" onclick="DrawLine.selectInput(this)" for="sub-menu2">Menu2</label><br>';
      menu_html += '</form>';
      menu_html += '</div>';
      menu_html += '<div class="setting-arrow"></div>';
      menu_html += '</div>';

      var pos = $boxobj.position();
      var width = $boxobj.width();
      if (pos.top > 100) {
        menu_top = pos.top - 105;
      } else {
        menu_top = pos.top + 70;
        arrow_pos_class = "arrow-top";
      }
      menu_left = pos.left - (280 - width) + 25;
      overview += menu_html;
    } else {
      var pos = $($boxobj).position();
      var id = $boxobj[0].id;
      menu_html += '<div class="boxes-menu menu-div">';
      menu_html += '<form>';
      menu_html += '<label id = ' + id + ' class = "collapse-menu" onclick="DrawLine.selectInput(this)" for="hidden">Hidden</label>';
      menu_html += '<label id = ' + id + ' class = "collapse-menu" onclick="DrawLine.selectInput(this)" for="show" style="display: none">Show</label>';
      menu_html += '</form>';
      menu_html += '<div class="boxes-arrow"></div>';
      menu_html += '</div>';

      if (pos.top > 100) {
        menu_top = pos.top - 60;
      } else {
        menu_top = pos.top + 70;
        arrow_pos_class = "arrow-top";
      }
      menu_left = pos.left;
      overview += menu_html;

    }

    overview += '</div>';

    $("body").append(overview);

    $("#menu-overview-panel .menu-div").css({top: menu_top, left: menu_left}).addClass(arrow_pos_class);
    $("#menu-overview-panel").show();

    $("#menu-overview-panel .overview-div").click(function () {
      var boxeId = $("#menu-overview-panel").attr('class');
      $("#menu-overview-panel").remove();
      // $("#" + boxeId + " .boxes-icon").toggle();
    });

  }

  var boxEditEvent = function () {
    $('.boxes').dblclick(function (e) {
      editBox($(this));
    });
    $(".setting").click(function (e) {
      var menuId = $(this).parent().attr('id');
      showMenuDialog("setting", $(this).parent(), menuId);
    });
    $(".types").click(function (e) {
      var menuId = $(this).parent().attr('id');
      showMenuDialog("event", $(this).parent(), menuId);
    });
    $(".boxes-icon").click(function (e) {
      var id = $(this).attr('id');
      var menuId = $(this).parent().attr('id');

      showMenuDialog("boxes", $(this).parent(), menuId);

      if (id == 'numberCirle') {
        $(".collapse-menu[for='hidden']").show();
        $(".collapse-menu[for='show']").hide();
      } else {
        $(".collapse-menu[for='hidden']").hide();
        $(".collapse-menu[for='show']").show();
      }
    });
  }

  var editBox = function (boxeObj) {
    var id = boxeObj.parent().attr('id');
    var $text = boxeObj.text();
    var width = boxeObj.width() * 1;
    var $edBox = '<input id="' + id + '_edit" class="editboxes" value="' + $text + '" style="width: ' + (width + 10) + 'px;" onblur="DrawLine.inputFocusEvent(this)"/>';
    boxeObj.html($edBox);

    drawLine(id);

    $('#' + id + '_edit').focus();
    $('#' + id + '_edit').select();
    $('#' + id + '_edit').keyup(function (e) {

      if (e.which == 13) {
        var inputObj = $(this);
        setTimeout(function () {
          focusBoxInput(document.getElementById(id + "_edit"));
        }, 1);
      }
    });

    $('#' + id + '_edit').keydown(function (e) {
      if (e.which == 13) {
        return;
      }

      var $input = $(this);

      if ((new Date()).getTime() - edit_box_drawed_time < edit_box_runtime) {
        return;
      }
      if (edit_box_timer) {
        clearTimeout(edit_box_timer);
        edit_box_timer = null;
      }
      edit_box_timer = setTimeout(function () {
        var textW = $("#text-calc").text($input.val()).width();
        var n_w = textW + 12;
        if (n_w < 30) {
          n_w = 30;
        }
        $input.width(n_w);

        drawLine(id);

        edit_box_drawed_time = (new Date()).getTime();
      }, edit_box_runtime);
    });
  }
  var edit_box_runtime = 20;
  var edit_box_drawed_time = 0;
  var edit_box_timer = null;

  var focusBoxInput = function (inputObj) {
    var boxDiv = $(inputObj).parent();

    var id = boxDiv.parent().attr('id');
    var $text = $('#' + id + '_edit').val();
    try {
      boxDiv.text($text);
    } catch (e) {
    }
    var offset = $('#' + id).offset();
    var y = parseFloat(offset.top).toFixed(0);
    var x = parseFloat(offset.left).toFixed(0);
    var w = parseFloat(boxDiv.width()).toFixed(0);
    drawLine(id);
    changeData(id, w, $text, x, y);
  }
  var MenuSelectEvent = function (inputObj) {
    var id = inputObj.id;
    var panel = $('.menu-div').parent();
    var boxId = panel[0].className;
    var value = $("#" + id).val();
    changeEvent(boxId, value);

  }
  var BoxesCollapse = function (boxId, state) {
    $('#' + boxId + ' .boxes-icon').toggle();
    if (state == "Hidden") {
      remove_leftbox(boxId);
    } else {
      redraw_leftbox(boxId);
    }
  }

  var remove_leftbox = function (boxId) {
    var selectedObj = findObject(boxId);
    for (var i = 0; i < selectedObj.in.length; i ++) {
      hiddenInBox(selectedObj.in[i]);
    }
  }


  var hiddenInBox = function(boxId) {
    var hiddenObj = findObject(boxId);

    $("#" + boxId).hide();
    jsPlumb.detachAllConnections(boxId);

    for (var i = 0; i < hiddenObj.in.length; i ++) {
      hiddenInBox(hiddenObj.in[i]);
    }
  }


  var redraw_leftbox = function (boxId) {
    var selectedObj = findObject(boxId);
    for (var i = 0; i < selectedObj.in.length; i ++) {
      showInBox(selectedObj.in[i]);
    }
  }

  var showInBox = function (boxId) {
    var showObj = findObject(boxId);

    $("#" + boxId).show();
    drawLine(boxId);
    for (var i = 0; i < showObj.in.length; i ++) {
      showInBox(showObj.in[i]);
    }
  }

  var removeEventsArc = function () {
    for (var i = 0; i < events.length; i++) {
      jsPlumb.detachAllConnections(events[i].id);
    }
  }

  var changeEvent = function (boxId, value) {
    $('#' + boxId + "_box").text(value);

  }

  var drawSubMenu = function (subMenuId, inputObj) {
    var pos = $('#' + subMenuId).parent().offset();
    var panel = $('#' + subMenuId).parents();
    var panelId = panel[3].id;
    menu_top = pos.top + 30;
    menu_left = pos.left - 10 ;

    var subMenu_str = '';
    subMenu_str += '<div class="submenu" style="top:'+ menu_top +'px; left: '+ menu_left +'px; ">';
    subMenu_str += '<form>';
    subMenu_str += '<label id = "submenu1" class = "sub-menu" for="submenu1">Submenu1</label><br>';
    subMenu_str += '<label id = "submenu2" class = "sub-menu" for="submenu2">Submenu2</label>';
    subMenu_str += '</form>';
    subMenu_str += '</div>';

    $("#" + panelId).append(subMenu_str);

  }

  var drawSubDescription = function (subMenuId, inputObj) {
    var pos = $('#' + subMenuId).parent().offset();
    var panel = $('#' + subMenuId).parents();
    var panelId = panel[3].id;
    menu_top = pos.top + 50;
    menu_left = pos.left - 10 ;

    var description_str = '';
    description_str += '<div class="subdescription" style="top:'+ menu_top +'px; left: '+ menu_left +'px; ">';
    description_str += '<form>';
    description_str += '<label style="padding-right: 10px">Description : </label><input style="width: 150px; color: #000">';
    description_str += '</form>';
    description_str += '</div>';

    $("#" + panelId).append(description_str);
  }


  return {
    draw: function () {
      var drawObj = this;
      this.getJsonData(function () {
        defineValues();

        drawElements();

        drawLines();

        showJson();

        initEvents();
      });
    },
    getJsonData: function (callback) {
      $.getJSON("./data.json?v=2", function (data) {
        JSONgeneral = data;

        callback();
      });
    },
    inputFocusEvent: function (inputObj) {
      focusBoxInput(inputObj);
    },
    selectInput: function (inputObj) {
      var className = inputObj.className;
      if (className == "collapse-menu") {
        var state = $(inputObj).text()
        var $panel = $('.' + className).parents();
        var boxId = $panel[2].className;

        $('.' + className).toggle();
        BoxesCollapse(boxId, state);
      }
      if ($(inputObj).parent().parent().parent().attr('id') == "setting-menu") {
        var subMenuId = inputObj.id;
        if (subMenuId == "sub-menu1") {
          drawSubMenu(subMenuId, inputObj);
        }
        if (subMenuId == "sub-menu2") {
          drawSubDescription(subMenuId, inputObj);
        }

      }
      if ($(inputObj).parent().parent().attr('id') == "events-menu") {
        MenuSelectEvent(inputObj);
      }


    },
  }
}();

jsPlumb.ready(function () {
  DrawLine.draw();
});