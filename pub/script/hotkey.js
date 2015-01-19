/**
 * White Blank Page
 * helpers.js
 * Raymond Jacobson 2014
 */

function hereDoc(f) {
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

⌘ + / : Display this message again. Pressing it a subsequent time makes it go away.
⌘ + E : Type out and highlight an email address, press the hotkey, and an email
        with a link to the note will be sent to the email address highlighted
        (use this to authenticate new devices, browsers, etc.)
⌘ + T : Automatically inserts today's date at the cursor position.
⌘ + S : Share this page with someone. Link copied to clipboard. They won't be able to edit.
⌘ + D : Download the current note as a .txt

Now that you've learned what to do, ⌘ + / to start, and get on with your life.

P.S. Refrain from putting critical & sensitive information (SSN, phone, personal information, etc.) here for security reasons.




Project built with <3 by @raymondjacobson
https://github.com/raymondjacobson/wbp
*/});

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

// Set up listeners
var listenForKeys = function() {
  $(window).keydown(function(e) {
    /* Accept a possible set of hotkeys */
    var valid_keys = ['¿', 'E', 'T', 'S', 'D'];
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
  help_text: help_text,
  listenForKeys: listenForKeys
}