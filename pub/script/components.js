/**
 * White Blank Page
 * Raymond Jacobson 2014
 */

var TextArea = React.createClass({
  render: function() {
    return (
      <h1>hello</h1>
    );    
  }
});

React.render(
  <TextArea url="sample.json" pollInterval={2000} />,
  document.getElementById('content')
);