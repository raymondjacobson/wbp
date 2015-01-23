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
              console.log(send_email_url);
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