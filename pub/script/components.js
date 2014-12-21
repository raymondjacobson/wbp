/**
 * White Blank Page
 * Raymond Jacobson 2014
 */

var TextArea = React.createClass({
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
    return {data: []};
  },
  componentDidMount: function() {
    this.getTextAreaContent();
    setInterval(this.saveTextAreaContent, this.props.savePollInterval);
  },
  render: function() {
    console.log(typeof this.state.data[1]);
    if (typeof (this.state.data[1]) != undefined) {
      return (
        <h1>{this.state.data[1]}</h1>
      )
    }
  }
});

React.render(
  <TextArea url="/page/f/" savePollInterval={2000} />,
  document.getElementById('content')
);