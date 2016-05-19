var React = require('react')
  , ReactDOM = require('react-dom')
  , Render = require('./Render')
  , Controls = require('./Controls')
  , Rules = require('../lib/Rules')
  , App
  ;

require('./App.styl');

App = React.createClass({
  getInitialState() {
    return {
      ruleSets: Rules.ruleSets,
      currentRuleSetIndex: 0,
      playing: false,
      speed: 1,
      scale: 1,
      offset: {
        x: 0, y: 0
      },
      clearIndex: 0,
      seedIndex: 0,
      stepIndex: 0
    };
  },

  currentRuleSet() {
    return this.state.ruleSets[this.state.currentRuleSetIndex];
  },

  setScale(scale) {
    this.state.scale = Math.min(10, Math.max(1, scale));
    this.setState(this.state);
  },

  handleRenderDrag(offset) {
    this.state.offset.x += offset.x / this.state.scale;
    this.state.offset.y += offset.y / this.state.scale;
    this.setState(this.state);
  },

  handleRenderZoom(deltaScale) {
    this.setScale(this.state.scale + (deltaScale * this.state.scale));
  },

  handleStateClear() {
    this.state.clearIndex += 1;
    this.setState(this.state);
  },

  handleStateSeed() {
    this.state.seedIndex += 1;
    this.setState(this.state);
  },

  handleRuleSetChange(ruleSetIndex) {
    this.state.currentRuleSetIndex = ruleSetIndex;
    this.setState(this.state);
  },

  handleStep() {
    this.state.stepIndex += 1;
    this.setState(this.state);
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

  handleDisplayReset() {
    this.state.scale = 1;
    this.state.offset.x = 0;
    this.state.offset.y = 0;
    this.setState(this.state);
  },

  handleScaleChange(newScale) {
    this.state.scale = newScale;
    this.setState(this.state);
  },

  render() {
    return (
      <div id="container">
        <Render
          clearIndex={this.state.clearIndex}
          seedIndex={this.state.seedIndex}
          stepIndex={this.state.stepIndex}
          ruleSet={this.currentRuleSet()}
          playing={this.state.playing}
          speed={this.state.speed}
          scale={this.state.scale}
          offset={this.state.offset}
          onDrag={this.handleRenderDrag}
          onZoom={this.handleRenderZoom} />

        <Controls
          ruleSets={this.state.ruleSets}
          currentRuleSetIndex={this.state.currentRuleSetIndex}
          playing={this.state.playing}
          speed={this.state.speed}
          scale={this.state.scale}
          offset={this.state.offset}
          onStateClear={this.handleStateClear}
          onStateSeed={this.handleStateSeed}
          onRuleSetChange={this.handleRuleSetChange}
          onStep={this.handleStep}
          onPlay={this.handlePlay}
          onStop={this.handleStop}
          onSpeedChange={this.handleSpeedChange}
          onDisplayReset={this.handleDisplayReset}
          onScaleChange={this.handleScaleChange} />
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app-mount'));
