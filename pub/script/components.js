/**
 * White Blank Page
 * components.js
 * Raymond Jacobson 2014
 */

//TODO Switch to non browser JSX transform before production
var auth_cookie = require("./auth.js");

// React object for main text area on page
var TextArea = React.createClass({

  // Data Handling functions
  // Fetch data (on initial load)
  getTextAreaContent: function(key) {
    var fetch_url = this.props.url + key + "/fetch/";
    $.ajax({
      url: fetch_url,
      dataType: 'json',
      success: function(response) {
        console.log(response[0].text);
        this.setState({data: response[0].text});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // Edit data (via polling)
  // TODO: complicated based on typing rate (or something)
  saveTextAreaContent: function (key) {
    var edit_url = this.props.url + key + "/edit/";
    $.ajax({
      url: edit_url,
      dataType: 'json',
      type: 'POST',
      data: $("#main").val(),
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
  // TODO
  // If the component has properly mounted, retrieve a auth key
  componentDidMount: function() {
    var key = auth_cookie.getAuthKey();
    console.log(key);
    this.getTextAreaContent(key);
    setInterval(this.saveTextAreaContent, this.props.savePollInterval);
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
    this.setState({data: event.target.value});
  },

  // TODO: Keypress handlers

  // Render the text area, reactive data
  render: function() {
    return (
      <textarea id="main" value={this.state.data} onChange={this.handleChange}>
      </textarea>
    );
  }
});

React.render(
  <TextArea url="/page/" savePollInterval={2000} />,
  document.getElementById('content')
);