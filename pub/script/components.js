/**
 * White Blank Page
 * components.js
 * Raymond Jacobson 2014
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
        //   if (response != "") this.setState({data: response});
        //   else {
        //     this.setState({data: hotkey.help_text});
        //   }
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
  },
  handleChange: function(event) {
    if (data_exchange_on) {
      this.setState({data: event});
      var key = auth_cookie.getAuthCookieKey();
      this.saveTextAreaContent(key);
    }
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
  hotkey.listenForKeys();
});