/**
  Author:    Ping Cheng Chung
  Partner:   Michael Blum, Shiyang Li, Sungyeon Han
  Date:      10/25/2021
  University of Utah
 */

var recording = false;
var socket;
var error_counter = 0;
var audio_volume = 1;
var key_finger_dic={
    "Q": "L_Pinky",
    "A": "L_Pinky",
    "Z": "L_Pinky",
    "W": "L_Ring",
    "S": "L_Ring",
    "X": "L_Ring",
    "E": "L_Middle",
    "D": "L_Middle",
    "C": "L_Middle",
    "R": "L_Pointer",
    "F": "L_Pointer",
    "V": "L_Pointer",
    "T": "L_Pointer",
    "G": "L_Pointer",
    "B": "L_Pointer",
    "Y": "R_Pointer",
    "H": "R_Pointer",
    "N": "R_Pointer",
    "U": "R_Pointer",
    "J": "R_Pointer",
    "M": "R_Pointer",
    "I": "R_Middle",
    "K": "R_Middle",
    "O": "R_Ring",
    "L": "R_Ring",
    "P": "R_Pinky",
}

function make_sound(file_name) {
  let audio = new Audio("/static/sound/" + file_name + ".mp3");
  audio.volume = audio_volume;
  audio.play();
}

function set_volume() {
  let value = parseInt($("#volume-input").attr("value"));
  audio_volume = value / 100;
}

function test_volume() {
  set_volume();
  console.log(audio_volume);
  make_sound("F");
}

//when user connect to main page, build a socket with server.
$(document).ready(function () {
  socket = io.connect(
    "http://" + document.domain + ":" + location.port + "/feedback"
  );

  socket.on("connect", function () {
    socket.emit("join", {});
  });

  socket.on("status", function (data) {
    console.log("get server confirm");
  });

  socket.on("key_error", function (data) {
    // display the error list on page
    error_counter++;
    let filename = data["file"];
    let time = data["time"];
    let key = data["key"][1].toUpperCase();
    let parameter =
      data["key"].toUpperCase() + ",'" + time + "','" + filename + "'";
    $("#errorlist_tbody").prepend(
      '<tr class="table-row" onclick="see_detail(' +
        parameter +
        ')"><th scope="row">' +
        error_counter +
        "</th> <td>" +
        key +
        "</td><td>" +
        key_finger_dic[key] +
        "</td><td>" +
        time +
        "</td> </tr>"
    );
    make_sound(key);
    console.log("Received key error from key listener!");
  });
});

// play button action
$("#play_button").on("click", function () {
  $("#play_button").prop("disabled", true);
  $.ajax({
    type: "GET",
    url: "/start_session",
    success: function () {
      $("#play_button").hide();
      $(".rectangle").hide();
      $("#adjust-volume").hide();
      $("#stop_button").show();
      $("#table-div").show();

      recording = true;
    }
  });
});

// stop button action
$("#stop_button").on("click", function () {
  $.ajax({
    type: "GET",
    url: "/stop_session",
    success: function () {
      $("#stop_button").prop("disabled", true);
      $("#stop_button").hide();
      recording = false;
      //pop up submit success
      Swal.fire({
        title: "Please Wait",
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,

        timer: 1500,
        timerProgressBar: true,
        onOpen: () => {
          Swal.showLoading();
        }
      }).then((result) => {
        Swal.fire({
          title: "submitted successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  });
});

$("#quit_button").on("click", function () {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    "http://" + document.domain + ":" + location.port + "/exit"
  );
  xmlHttp.send(null);
  return;
});

//pop up the Error detail
function see_detail(key, time, filename) {
  Swal.fire({
    title: key,
    text: time,
    imageUrl: filename,
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "Custom image",
    footer:
      '<a  target="_blank" class="guideline" href="mailto:u1176174@utah.edu?subject=something goes wrong&body=TThe message">Is the result wrong? Help make it better</a>'
  });
}
