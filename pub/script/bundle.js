(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/raymond/code/whiteblankpage/pub/script/auth_cookie.js":[function(require,module,exports){
/**
 * White Blank Page
 * auth_cookie.js
 * Raymond Jacobson 2015
 */

// Constants
var auth_cookie_name = "wbp-cookie-auth";
var key_length = 30;
var cookie_exp_days = 100000;

var generateNewAuthKey = function(size) {
  var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var key = "";
  for (var i=0; i<size; ++i)
    key+=characters.charAt(Math.floor(Math.random() * characters.length));
  console.log("Key generated " + key);
  return key;
}

// Gets a cookie with cname, returns value or empty string if nonexistant
var getCookie = function(cname) {
  var name = cname + "=";
  var cookies = document.cookie.split(';');
  for(var i=0; i<cookies.length; ++i) {
    var c = cookies[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

// Sets a cookie with cname: cvalue to expire in exdays
var setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";" + " path=/";
}

// Deletes the cookie with the given cname
var deleteCookie = function(cname) {
  document.cookie = cname + '==; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

// Gets the wbp specific cookie
var getAuthCookieKey = function() {
  var auth_key = getCookie(auth_cookie_name);
  return auth_key;
}

// If cookie is set, retrieve the key
// Else cookie is not set, display help text, generate cookie
var getSetAuthKey = function() {
  var auth_key = getAuthCookieKey();
  if (auth_key != "") {
    return auth_key;
  }
  else {
    var new_key = generateNewAuthKey(key_length);
    setCookie(auth_cookie_name, new_key, cookie_exp_days);
    return new_key;
  }
}

// Set up the cookie for a reauth. Just delete whatever cookie is there and renew
var forceNewAuth = function(auth_key) {
  deleteCookie(auth_cookie_name);
  setCookie(auth_cookie_name, auth_key, cookie_exp_days);
}

// Check to see if we're authenticating a new browser
// If we are, we need to clear any possibly existing cookies
// and set up a new cookie with the key provided by the URL
var handleNewBrowser = function() {
  var win_loc = window.location
  var url_breaks = win_loc.pathname.split("/");
  var key = url_breaks[url_breaks.length-1]
  if (key !== "") {
    deleteCookie(auth_cookie_name);
    console.log("new");
    setCookie(auth_cookie_name, key, cookie_exp_days);
    window.location = win_loc.origin;
  }
}

module.exports = {
  forceNewAuth: forceNewAuth,
  getAuthCookieKey: getAuthCookieKey,
  getSetAuthKey: getSetAuthKey,
  handleNewBrowser: handleNewBrowser
}
},{}],"/Users/raymond/code/whiteblankpage/pub/script/components.js":[function(require,module,exports){
/**
 * White Blank Page
 * components.js
 * Raymond Jacobson 2015
 */

//TODO Switch to non browser JSX transform before production
data_exchange_on = true;
var auth_cookie = require("./auth_cookie.js");
var hotkey = require("./hotkey.js");
var poll_interval = 200;

// React object for main text area on page
var TextArea = React.createClass({

  // Data Handling functions
  // Fetch data (on initial load)
  getTextAreaContent: function(key) {
    var fetch_url = this.props.url + key + "/fetch/";
    $.ajax({
      url: fetch_url,
      dataType: 'text',
      success: function(response) {
        console.log("page get");
        if (data_exchange_on) {
          this.setState({data: response});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  // Edit data (via polling)
  // TODO: complicated based on typing rate (or something)
  saveTextAreaContent: function(key) {
    var edit_url = this.props.url + key + "/edit/";
    var page_content = $("#main").val();
    $.ajax({
      url: edit_url,
      dataType: 'text',
      type: 'POST',
      data: page_content,
      success: function(response) {
        console.log(response);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  // Properly checks to see if sync is on and sets the data state
  // Retrieves auth key and saves based on key
  syncData: function(data) {
    if (data_exchange_on) {
      this.setState({data: data});
      var key = auth_cookie.getAuthCookieKey();
      this.saveTextAreaContent(key);
    }
  },

  // Set up keybinding listeners
  listenForKeys: function() {
    var TextArea = this;
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
              hotkey.showHideHelpText();
              break;
            case 'E': // Email note link
              var email_address = hotkey.getTextFieldSelection($("textarea")[0]);
              var send_email_url = "/sendemail/" + email_address +
                "/" + auth_cookie.getAuthCookieKey();
              console.log(send_email_url)
              $.get(send_email_url);
              break;
            case 'I': // Insert today's date
              var d = new Date();
              var day = d.getDate()
                , month = d.getMonth() + 1
                , year = d.getYear() - 100
                , dow = hotkey.getWeekday(d.getDay());
              var ta = $("textarea")[0];
              var ta_val = ta.value;
              var ta_start = ta.selectionStart;
              var date_string = dow+" "+day+"/"+month+"/"+year;
              var new_data = ta_val.substring(0, ta_start) + date_string
                + ta_val.substring(ta.selectionStart, ta_val.length);
              TextArea.syncData(new_data);
              hotkey.setCaretToPos(ta, ta_start + date_string.length);
              break;
            case 'S': // Share the note with someone
              break;
            case 'D': // Download the current note as .txt
              var content = $("textarea")[0].value;
              var d = new Date();
              var day = d.getDate()
                , month = d.getMonth() + 1
                , year = d.getYear() - 100
                , dow = hotkey.getWeekday(d.getDay());
              hotkey.downloadFile("page_on_"+day+"."+month+"."+year+".txt", content);
              break;
            default:
              console.log("Invalid command.");
              break;
          }
        }
      }
    });
  },

  // Default is an empty page if there was a React issue
  getInitialState: function() {
    return {data: ""};
  },

  // If the component has properly mounted, retrieve a auth key
  componentDidMount: function() {
    var key = auth_cookie.getSetAuthKey();
    this.getTextAreaContent(key);
    // Poll for update to text area content
    var getTAC = this.getTextAreaContent;
    var getIntervalId = setInterval(function() {
        getTAC(key)
      }, this.props.pollInterval);
    // Put the cursor at the end of the textarea
    // TODO: Better way to do this?
    var textarea = $("#main"),
        val = textarea.val();
    textarea
      .focus()
      .val("")
      .val(val);
    this.listenForKeys();
  },

  // The event represents the keystroke character
  handleChange: function(event) {
    this.syncData(event);
  },

  // Render the text area, reactive data
  render: function() {
    var valueLink = {
      value: this.state.data,
      requestChange: this.handleChange
    };
    return (
      <textarea id="main" valueLink={valueLink}>
      </textarea>
    );
  }
});

React.render(
  <TextArea url="/page/" pollInterval={poll_interval} />,
  document.getElementById('content')
);

$(document).ready(function() {
  auth_cookie.handleNewBrowser();
});
},{"./auth_cookie.js":"/Users/raymond/code/whiteblankpage/pub/script/auth_cookie.js","./hotkey.js":"/Users/raymond/code/whiteblankpage/pub/script/hotkey.js"}],"/Users/raymond/code/whiteblankpage/pub/script/hotkey.js":[function(require,module,exports){
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
},{}]},{},["/Users/raymond/code/whiteblankpage/pub/script/components.js"]);
