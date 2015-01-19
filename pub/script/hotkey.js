/**
 * White Blank Page
 * helpers.js
 * Raymond Jacobson 2014
 */

/* Helper functions*/
var hereDoc = function(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

var downloadFile = function(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  pom.click();
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
⌘ + I : Automatically inserts today's date at the cursor position.
⌘ + S : Share this page with someone. Link copied to clipboard. They won't be able to edit.
⌘ + D : Download the current note as a .txt

Now that you've learned what to do, ⌘ + / to start, and get on with your life.

P.S. Refrain from putting critical & sensitive information (SSN, phone, personal information, etc.) here for security reasons.




Project built with <3 by @raymondjacobson
https://github.com/raymondjacobson/wbp
*/});

var save_text_val;
var help_text_on = false;

var weekday = new Array(7);
weekday[0]=  "Sun";
weekday[1] = "Mon";
weekday[2] = "Tues";
weekday[3] = "Wed";
weekday[4] = "Thurs";
weekday[5] = "Fri";
weekday[6] = "Sat";

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

/* Set up listeners */
var listenForKeys = function() {
  $(window).keydown(function(e) {
    /* Accept a possible set of hotkeys */
    var valid_keys = ['¿', 'E', 'I', 'S', 'D'];
    var key = String.fromCharCode(e.keyCode);
    if (valid_keys.indexOf(key) != -1) {
      if (e.metaKey) {
        e.preventDefault();
        /* Determine appropriate action */
        switch(String.fromCharCode(e.keyCode)) {
          case '¿': // Help text
            console.log("help");
            showHideHelpText();
            break;
          case 'E': // Email note link
            console.log("email");
            console.log(getTextFieldSelection($("textarea")[0]))
            break;
          case 'I': // Insert today's date
            var d = new Date();
            var day = d.getDate()
              , month = d.getMonth() + 1
              , year = d.getYear() - 100
              , dow = weekday[d.getDay()];
            $("textarea")[0].value += dow+" "+day+"/"+month+"/"+year;
            $("textarea")[0].change();
            break;
          case 'S': // Share the note with someone
            break;
          case 'D': // Download the current note as .txt
            var content = $("textarea")[0].value;
            var d = new Date();
            var day = d.getDate()
              , month = d.getMonth() + 1
              , year = d.getYear() - 100
              , dow = weekday[d.getDay()];
            downloadFile("page_on_"+day+"."+month+"."+year+".txt", content);
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