initDraw(document.getElementById("canvas"));
var drawing_color = "";
created = true;

//detect the current mouse position on the canvas
function initDraw(canvas) {
  function setMousePosition(e) {
    var ev = e || window.event; //Moz || IE
    if (ev.pageX) {
      //Moz
      mouse.x = ev.pageX + window.pageXOffset;
      mouse.y = ev.pageY + window.pageYOffset;
    } else if (ev.clientX) {
      //IE
      mouse.x = ev.clientX + document.body.scrollLeft;
      mouse.y = ev.clientY + document.body.scrollTop;
    }
  }

  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };
  var element = null;
  var move_element = null;
  canvas.onmousemove = function (e) {
    setMousePosition(e);
    if (element !== null) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + "px";
      element.style.height = Math.abs(mouse.y - mouse.startY) + "px";
      element.style.left =
        mouse.x - mouse.startX < 0
          ? mouse.x - xOffset + "px"
          : mouse.startX - xOffset + "px";
      element.style.top =
        mouse.y - mouse.startY < 0
          ? mouse.y - yOffset + "px"
          : mouse.startY - yOffset + "px";
    }
    if (move_element !== null) {
      move_element.style.left =
        mouse.x - mouse.startX < 0
          ? mouse.x - xOffset + "px"
          : mouse.startX - xOffset + "px";
      move_element.style.top =
        mouse.y - mouse.startY < 0
          ? mouse.y - yOffset + "px"
          : mouse.startY - yOffset + "px";
    }
  };
  canvas.onclick = function (e) {
    if (!created && drawing_color != "") {
      if (!created) {
        console.log("begun.");
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        element = document.createElement("div");
        element.className = "dot";
        element.id = drawing_color;
        yOffset = window.pageYOffset;
        xOffset = window.pageXOffset;
        element.style.left = mouse.x - xOffset - 4 + "px";
        element.style.top = mouse.y - yOffset - 4 + "px";
        canvas.appendChild(element);
        dragElement(element);
        element = null;
        canvas.style.cursor = "default";
        console.log("finsihed.");
        created = true;


      }
    } else {
      //move the dot
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
    }
  };
}

//a pop up msg box to display the input string
function oops_alert(msg) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: msg,
    footer:
      '<a  target="_blank" class="guideline" href="/help">Why do I have this issue?</a>'
  });
}

function delete_div(key_name) {
  $("#" + key_name).remove();
  created = false;
  console.log(key_name);
}

//"All set" button action
$("#set_button").on("click", function () {
  //check if all set
  if (document.querySelector("#color_Q") == null) {
    oops_alert("haven't set Q");
    return;
  }
  if (document.querySelector("#color_A") == null) {
    oops_alert("haven't set A");
    return;
  }
  if (document.querySelector("#color_Z") == null) {
    oops_alert("haven't set Z");
    return;
  }
  if (document.querySelector("#color_M") == null) {
    oops_alert("haven't set M");
    return;
  }
  if ($("#user_name_input").val() == "") {
    oops_alert("user name is necessary");
    return;
  }
  //build json first
  let canv = $("#canvas").position();
  let Q_key = $("#color_Q");
  let A_key = $("#color_A");
  let Z_key = $("#color_Z");
  let M_key = $("#color_M");
  $("#user_name_input").prop("disabled", true);
  let JSON_data = JSON.stringify({
    user_name: $("#user_name_input").val(),
    "Q-key": {
      top: Q_key.position().top - canv.top,
      left: Q_key.position().left - canv.left,
      height: Q_key.height(),
      width: Q_key.width()
    },
    "A-key": {
      top: A_key.position().top - canv.top,
      left: A_key.position().left - canv.left,
      height: A_key.height(),
      width: A_key.width()
    },
    "Z-key": {
      top: Z_key.position().top - canv.top,
      left: Z_key.position().left - canv.left,
      height: Z_key.height(),
      width: Z_key.width()
    },
    "M-key": {
      top: M_key.position().top - canv.top,
      left: M_key.position().left - canv.left,
      height: M_key.height(),
      width: M_key.width()
    }
  });
  //disable all set button
  $("#set_button").prop("disabled", true);
  //ajax send all position
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/submit_keys",
    data: JSON_data,
    success: function (response) {
      $(".dot").hide();
      $("#set-div").hide();
      $("#record-div").show();
    },
    error: function (response) {
      console.log("server return Error,url:/allset");
      $("#set_button").prop("disabled", false);
    }
  });
});

//////////////////test db//////////////////////////
$("#db_button").on("click", function () {
  $.ajax({
    type: "GET",
    url: "/db_test",
    success: function () {
      console.log("db request succe");
    },
    error: function () {
      console.log("db request failed");
    }
  });
});

//setting the dot for Q key
$("#Q_button").on("click", function () {
  drawing_color = "color_Q";
  if (document.querySelector("#color_Q")) {
    $("#color_Q").show();
    created = true;
  } else {
    created = false;
  }
});

//setting the dot for A key
$("#A_button").on("click", function () {
  drawing_color = "color_A";
  if (document.querySelector("#color_A")) {
    $("#color_A").show();
    created = true;
  } else {
    created = false;
  }
});

//setting the dot for Z key
$("#Z_button").on("click", function () {
  drawing_color = "color_Z";
  if (document.querySelector("#color_Z")) {
    $("#color_Z").show();
    created = true;
  } else {
    created = false;
  }
});

//setting the dot for M key
$("#M_button").on("click", function () {
  drawing_color = "color_M";
  if (document.querySelector("#color_M")) {
    $("#color_M").show();
    created = true;
  } else {
    created = false;
  }
});

function stream_toggle_click() {
  if ($("#stream_toggle").is(":checked")) display_stream();
  else hide_stream();
  function display_stream() {
    $("#canvas").show();
  }

  function hide_stream() {
    $("#canvas").hide();
  }
}

//draw a div on the canvas
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
