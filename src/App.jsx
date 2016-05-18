var React = require('react')
  , ReactDOM = require('react-dom')
  , Render = require('./Render')
  , Controls = require('./Controls')
  , App
  ;

require('./App.styl');

App = React.createClass({
  getInitialState() {
    return {
      playing: false,
      speed: 1
    };
  },

  handlePlay() {
    this.state.playing = true;
    this.setState(this.state);
  },

  handleStop() {
    this.state.playing = false;
    this.setState(this.state);
  },

  handleSpeedChange(newSpeed) {
    this.state.speed = newSpeed;
    this.setState(this.state);
  },

  render() {
    return (
      <div id="container">
        <Render appState={this.state} />
        <Controls
          playing={this.state.playing}
          speed={this.state.speed}
          onPlay={this.handlePlay}
          onStop={this.handleStop}
          onSpeedChange={this.handleSpeedChange} />
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app-mount'));
