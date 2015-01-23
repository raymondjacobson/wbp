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