/**
 * White Blank Page
 * Raymond Jacobson 2014
 */

var TextArea = React.createClass({

  // Data Handling functions
  // Fetch data (on initial load)
  getTextAreaContent: function() {
    var fetch_url = this.props.url + "fetch/";
    $.ajax({
      url: fetch_url,
      dataType: 'json',
      success: function(data) {
        console.log(data[0].text);
        this.setState({data: data[0].text});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // Edit data (via polling)
  // TODO: complicated based on typing rate (or something)
  saveTextAreaContent: function () {
    var edit_url = this.props.url + "edit/";
    $.ajax({
      url: edit_url,
      dataType: 'json',
      type: 'POST',
      data: 'f'/* GET TEXT AREA TEXT */,
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: ""};
  },
  componentDidMount: function() {
    this.getTextAreaContent();
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
  <TextArea url="/page/f/" savePollInterval={2000} />,
  document.getElementById('content')
);