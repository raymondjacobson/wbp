/**
 * White Blank Page
 * helpers.js
 * Raymond Jacobson 2015
 */

var save_text_val;
var help_text_on = false;

/* Helper functions*/
var hereDoc = function(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

var help_text = hereDoc(function() {/*!
Welcome to White Blank Page.

This is a minamalistic notetaking application.

Too much in life do we get bogged down with
managing many accounts,
complex user interfaces,
and bloated functionality.

Write what you need to write here and it will be here when you come back.

Useful hotkeys (mac only, PC get out):

⌘/ : Display this message again. Pressing it a subsequent time makes it go away.
⌘E : Type out and highlight an email address, press the hotkey, and an email
        with a link to the note will be sent to the email address highlighted
        (use this to authenticate new devices, browsers, etc.)
⌘I : Automatically inserts today's date at the cursor position.
⌘S : Share this page with someone. Link copied to clipboard. They won't be able to edit.
⌘D : Download the current note as a .txt

Now that you've learned what to do, ⌘ + / to start, and get on with your life.

P.S. Refrain from putting critical & sensitive information (SSN, phone, personal information, etc.) here for security reasons.




Project built with <3 by @raymondjacobson
https://github.com/raymondjacobson/wbp
*/});


var downloadFile = function(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  pom.click();
}

var getWeekday = function(number) {
  var weekday = new Array(7);
  weekday[0]=  "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tues";
  weekday[3] = "Wed";
  weekday[4] = "Thurs";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  return weekday[number];
}

var getTextFieldSelection = function(textArea) {
  var ta_val = textArea.value;
  return ta_val.substring(textArea.selectionStart, textArea.selectionEnd);
}

var setSelectionRange = function(textArea, selectionStart, selectionEnd) {
  if (textArea.setSelectionRange) {
    textArea.focus();
    textArea.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (textArea.createTextRange) {
    var range = textArea.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

var setCaretToPos = function(textArea, pos) {
  setSelectionRange(textArea, pos, pos);
}

var showHideHelpText = function() {
  if (!help_text_on) {
    data_exchange_on = false;
    help_text_on = true;
    save_text_val = $("textarea")[0].value;
    $("textarea")[0].value = help_text;
    $("textarea")[0].disabled = true;
  }
  else {
    help_text_on = false;
    $("textarea")[0].value = save_text_val;
    $("textarea")[0].disabled = false;
    $("textarea")[0].focus();
    data_exchange_on = true;
  }
}

module.exports = {
  help_text: help_text,
  downloadFile: downloadFile,
  getWeekday: getWeekday,
  setCaretToPos: setCaretToPos,
  showHideHelpText: showHideHelpText,
  getTextFieldSelection: getTextFieldSelection
}