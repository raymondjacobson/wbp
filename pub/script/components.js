/**
 * White Blank Page
 * Raymond Jacobson 2014
 */

var TextArea = React.createClass({
  getTextAreaContent: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.getTextAreaContent();
    setInterval(this.getTextAreaContent, this.props.pollInterval);
  },
  render: function() {
    console.log(this.state.data);
    return (
      <h1>{this.state.data[1]}</h1>
    );
  }
});

React.render(
  <TextArea url="/page/f/fetch" pollInterval={2000} />,
  document.getElementById('content')
);