var React = require('react');
var ReactDOM = require('react-dom');
var Bootstrap = require('react-bootstrap');
var GSAP = require('react-gsap-enhancer');

var Button = Bootstrap.Button;
var Modal = Bootstrap.Modal;

function createAnim(utils) {
  var gamePiece = document.getElementById('game-piece');
  return new TimelineMax()
    .to(gamePiece, 1.5, {
      left: utils.options.x,
      top: utils.options.y,
      ease: Elastic.easeOut,
    })
}

var Main = GSAP.default()(React.createClass({

  getInitialState: function() {
    return {
      spaces: [],
      viewedQuestions: [],
      questionDisplayed: false,
      currentQuestionPosition: -1,
      currentGameTokenPosition: -1
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
        this.setState({currentQuestionPosition: randomPosition});
        this.setState({activeQuestion: this.state.questions[randomPosition].question});
        this.setState({questionDisplayed: true});
        questionShown = true;
        break;
      }
    }
    if(!questionShown) {
      // player has seen all the questions
      alert("Sorry - no more questions, play again");
    }
  },

  activeAnswer: function() {
    if(this.state.currentQuestionPosition >= 0) {
      return this.state.questions[this.state.currentQuestionPosition].answer;
    }
  },

  checkTrue: function() {
    if(this.activeAnswer() == 'TRUE') {
      this.handleCorrectAnswer();
    } else {
      alert('Better luck next time');
    }
    this.setState({questionDisplayed: false});
  },

  checkFalse: function() {
    if(this.activeAnswer() == 'FALSE') {
      this.handleCorrectAnswer();
    } else {
      alert('Better luck next time');
    }
    this.setState({questionDisplayed: false});
  },

  handleCorrectAnswer: function() {
    // for now just move them 1 spaces
    if((this.state.currentGameTokenPosition + 1) >= this.state.spaces.length) {
      this.addAnimation(createAnim, {
        x: 518,
        y: 365,
      });
      alert("Congratulations!!!");
    } else {
      var space = this.state.spaces[this.state.currentGameTokenPosition + 1];
      this.setState({'currentGameTokenPosition': this.state.currentGameTokenPosition + 1});
      this.addAnimation(createAnim, {
        x: space.x - 12,
        y: space.y - 25,
      });
    }
  },

  questionHidden: function() {
  },

  render: function () {
    return (
      <div>
        <h1>Journey to the Center of the Earth!</h1>
        <div id="game">
          <div id="game-piece"></div>
          {this.state.spaces.map(function(space, index) {
            return (
              <div className="space" key={'space-' + index} id={'space-' + index} style={{left: space.x, top: space.y}}></div>
            );
          })}
        </div>
        <div className="modal-container" style={{height: 300}}>
          <Button href="rules.html" bsStyle="warning">Read the rules</Button>
          <Button onClick={this.showQuestion} bsStyle="success">Give me a question!</Button>
          <Modal show={this.state.questionDisplayed} container={this} onHide={this.questionHidden}>
            <Modal.Header>
              <Modal.Title>Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.activeQuestion}
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="success" onClick={this.checkTrue}>True</Button>
              <Button bsStyle="danger" onClick={this.checkFalse}>False</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

}));

module.exports = Main;
