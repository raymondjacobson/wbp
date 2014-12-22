/**
 * White Blank Page
 * Raymond Jacobson 2014
 */

var TextArea = React.createClass({

  // Data Handling functions
  // Fetch data (on initia)
  getTextAreaContent: function () {
    var fetch_url = this.props.url + "fetch/";
    $.ajax({
      url: fetch_url,
      dataType: 'json',
      success: function(data) {
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Edit data (via polling TODO: complicated based on typing ratio)
  saveTextAreaContent: function () {
    var edit_url = this.props.url + "edit/";
    $.ajax({
      url: edit_url,
      dataType: 'json',
      type: 'POST',
      data: 'f'/* GET TEXT AREA TEXT */,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    // this.getTextAreaContent();
    return {data: "dicjs"};
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
      .val(val)
  },

  // TODO: Keypress handlers

  // Render the text area, reactive data
  render: function() {
    return (
      <textarea id="main">
        {this.state.data}
      </textarea>
    )
  }
});

React.render(
  <TextArea url="/page/f/" savePollInterval={2000} />,
  document.getElementById('content')
);