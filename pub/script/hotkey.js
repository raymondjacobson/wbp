/**
 * White Blank Page
 * helpers.js
 * Raymond Jacobson 2014
 */

var getTextFieldSelection = function(textField) {
  return textField.value.substring(textField.selectionStart, textField.selectionEnd);
}

// Set up listeners
var listenForKeys = function() {
  $(window).keydown(function(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode == 191) {
      if (e.metaKey) {
        e.preventDefault();
        switch(String.fromCharCode(e.keyCode)) {
          case '¿':
            console.log("help");
            break;
          case 'E':
            console.log("email");
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