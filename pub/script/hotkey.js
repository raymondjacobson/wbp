/**
 * White Blank Page
 * helpers.js
 * Raymond Jacobson 2014
 */

// var Mousetrap = require('./mousetrap.min.js');

var getTextFieldSelection = function(textField) {
  return textField.value.substring(textField.selectionStart, textField.selectionEnd);
}

// Set up listeners
var listenForKeys = function() {
  Mousetrap.bind('esc', function() {
      console.log("wow");
      return false;
  });
}

module.exports = {
  listenForKeys: listenForKeys
}