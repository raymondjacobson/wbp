/**
 * White Blank Page
 * auth_cookie.js
 * Raymond Jacobson 2014
 */

module.exports = {
  // Gets a cookie with cname, returns value or empty string if nonexistant
  getCookie: function(cname) {
    var name = cname + "=";
    var cookies = document.cookie.split(';');
    for(var i=0; i<cookies.length; ++i) {
      var c = cookies[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  },

  // Sets a cookie with cname: cvalue to expire in exdays
  setCookie: function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
  },

  // If cookie is set, retrieve the key
  // Else cookie is not set, display help text, generate cookie
  getAuthKey: function(exdays) {
    var auth_key = getCookie(auth_cookie_name);
    if (auth_key != "") {
      return auth_key;
    }
    else {
      setCookie(auth_cookie_name, generateNewAuthKey(), exdays);
    }
  }
};