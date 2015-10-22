var React = require('react');
var ReactDOM = require('react-dom');
var Bootstrap = require('react-bootstrap');

var Main = React.createClass({

  getInitialState: function() {
    return {
      spaces: []
    };
  },

  componentDidMount: function() {
    $.get('js/gameData.json', function(result) {
      if(this.isMounted()) {
        this.setState({
          questions: result.questions,
          spaces: result.spaces
        });
      }
    }.bind(this));
  },

  render: function () {
    return (
      <div>
        <h1>Earth Layers Game</h1>
        <div id="game">
          {this.state.spaces.map(function(space, index) {
            return (
              <div className="space" key={'space-' + index} style={{left: space.x, top: space.y}}></div>
            );
          })}
        </div>
      </div>
    );
  }

});

module.exports = Main;
