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
  document.cookie = cname + "=" + cvalue + ";" + expires;
}

// If cookie is set, retrieve the key
// Else cookie is not set, display help text, generate cookie
exports.getAuthKey = function() {
  var auth_key = getCookie(auth_cookie_name);
  if (auth_key != "") {
    return auth_key;
  }
  else {
    setCookie(auth_cookie_name, generateNewAuthKey(key_length), cookie_exp_days);
  }
}