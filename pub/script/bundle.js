(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/raymond/code/whiteblankpage/pub/script/auth_cookie.js":[function(require,module,exports){
/**
 * White Blank Page
 * auth_cookie.js
 * Raymond Jacobson 2014
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

module.exports = {
  getAuthCookieKey: getAuthCookieKey,
  getSetAuthKey: getSetAuthKey
}

// Check to see if we're authenticating a new browser
$(document).ready(function() {
  var win_loc = window.location
  var url_breaks = win_loc.pathname.split("/");
  var key = url_breaks[url_breaks.length-1]
  if (key !== "") {
    deleteCookie(auth_cookie_name);
    console.log("new");
    setCookie(auth_cookie_name, key, cookie_exp_days);
    window.location = win_loc.origin;
  }
});
},{}],"/Users/raymond/code/whiteblankpage/pub/script/components.js":[function(require,module,exports){
/**
 * White Blank Page
 * components.js
 * Raymond Jacobson 2014
 */

//TODO Switch to non browser JSX transform before production
var auth_cookie = require("./auth_cookie.js");
var poll_interval = 2000;

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
        this.setState({data: response});
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
    setInterval(function() {
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
  },
  handleChange: function(event) {
    this.setState({data: event});
    var key = auth_cookie.getAuthCookieKey();
    this.saveTextAreaContent(key);
  },

  // TODO: Keypress handlers

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
},{"./auth_cookie.js":"/Users/raymond/code/whiteblankpage/pub/script/auth_cookie.js"}]},{},["/Users/raymond/code/whiteblankpage/pub/script/components.js"]);
