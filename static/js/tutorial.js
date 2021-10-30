/**
  Author:    Ping Cheng Chung
  Partner:   Michael Blum, Shiyang Li, Sungyeon Han
  Date:      10/25/2021
  University of Utah
 */

var tutorial_ids = ["#step_1", "#step_2", "#step_3", "#step_4"];

function tutorial_skip() {
  $("#tutorial_panel").hide();
}

function turorial_change_page(input_index) {
  for (let i = 0; i < tutorial_ids.length; i++) {
    if (i == input_index) {
      $(tutorial_ids[i]).show();
    } else {
      $(tutorial_ids[i]).show().hide();
    }
  }

  $("#tutorial_image").hide();
  $("#tutorial_image1").show();
}
