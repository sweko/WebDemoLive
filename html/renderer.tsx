/// <reference path="../typings/react/react.d.ts" />

var AuthorList = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.getJSON(this.props.url, function(data) {
        console.log("here");
        this.setState({data: data});
      }.bind(this));
  },
  render: function(){
    console.log("rendering");
    var authorNodes = this.state.data.map(author => (<Author name={author.name} key={author.id}></Author>));
    return (
      <div className="commentList">
        {authorNodes}
      </div>
    );
    return null;

  }
});

var Author = React.createClass({
    render: function(){return (<div className="author">{this.props.name}</div>)}
})

ReactDOM.render(
  <AuthorList url="/api/authors" />,
  document.getElementById('content')
);


//var data = 