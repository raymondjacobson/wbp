/**
 * White Blank Page
 * helpers.js
 * Raymond Jacobson 2014
 */

var help_text = "Help.";
var save_text_val;
var help_text_on = false;

var getTextFieldSelection = function(textField) {
  var ta_val = textField.value;
  return ta_val.substring(textField.selectionStart, textField.selectionEnd);
}

var showHideHelpText = function() {
  if (!help_text_on) {
    data_exchange_on = false;
    help_text_on = true;
    save_text_val = $("textarea")[0].value;
    $("textarea")[0].value = help_text;
  }
  else {
    help_text_on = false;
    $("textarea")[0].value = save_text_val;
    data_exchange_on = true;
  }
}

// Set up listeners
var listenForKeys = function() {
  $(window).keydown(function(e) {
    /* Accept a possible set of hotkeys */
    var valid_keys = ['¿', 'E'];
    var key = String.fromCharCode(e.keyCode);
    if (valid_keys.indexOf(key) != -1) {
      if (e.metaKey) {
        e.preventDefault();
        /* Determine appropriate action */
        switch(String.fromCharCode(e.keyCode)) {
          case '¿':
            console.log("help");
            showHideHelpText();
            break;
          case 'E':
            console.log("email");
            console.log(getTextFieldSelection($("textarea")[0]))
            break;
          default:
            console.log("Invalid command.");
            break;
        }
      }
    }
  });
}

module.exports = {
  listenForKeys: listenForKeys
}