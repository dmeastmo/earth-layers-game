var React = require('react');
var ReactDOM = require('react-dom');
var Bootstrap = require('react-bootstrap');

var Button = Bootstrap.Button;

var Main = React.createClass({

  getInitialState: function() {
    return {
      spaces: [],
      viewedQuestions: []
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

  showQuestion: function() {
    // give the user a random question
    // try 100 times to get an unshown question
    var questionShown = false;
    for(var i = 0; i < 100; i++) {
      var randomPosition = Math.floor(Math.random() * this.state.questions.length);
      if(this.state.viewedQuestions.indexOf(randomPosition) === -1) {
        // question hasn't been displayed yet
        // add it to the viewed questions
        this.setState({'viewedQuestions': this.state.viewedQuestions.concat(randomPosition)});
        // and show it to the user
        alert(this.state.questions[randomPosition].question);
        questionShown = true;
        break;
      }
    }
    if(!questionShown) {
      // player has seen all the questions
      alert("Sorry - no more questions");
    }
  },

  render: function () {
    return (
      <div>
        <h1>Earth Layers Game</h1>
        <div id="game">
          <div id="game-piece"></div>
          {this.state.spaces.map(function(space, index) {
            return (
              <div className="space" key={'space-' + index} style={{left: space.x, top: space.y}}></div>
            );
          })}
        </div>
        <Button onClick={this.showQuestion}>Give me a question!</Button>
      </div>
    );
  }

});

module.exports = Main;
