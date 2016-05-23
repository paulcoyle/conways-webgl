var React = require('react')
  , ReactDOM = require('react-dom')
  , Render = require('./Render')
  , Controls = require('./Controls')
  , Rules = require('../lib/Rules')
  , Coloring = require('../lib/Coloring')
  , App
  , frameDurations = [1000 / 2.0, 1000 / 15.0, 1000 / 60.0];
  ;

require('./App.styl');

App = React.createClass({
  getInitialState() {
    return {
      ruleSets: Rules.ruleSets,
      currentRuleSetIndex: 0,
      colorings: Coloring.colorings,
      currentColoringIndex: 0,
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

  currentColoring() {
    return this.state.colorings[this.state.currentColoringIndex];
  },

  currentFrameDuration() {
    return frameDurations[this.state.speed];
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

  handleColoringChange(coloringIndex) {
    this.state.currentColoringIndex = coloringIndex;
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

  handleImpatientUser() {
    this.state.currentRuleSetIndex = Math.floor(Math.random() * this.state.ruleSets.length);
    this.state.currentColoringIndex = Math.floor(Math.random() * (this.state.colorings.length - 1)) + 1;
    this.state.clearIndex += 1;
    this.state.seedIndex += Math.floor(Math.random() * 4) + 1;
    this.state.speed = 2;
    this.state.playing = true;
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
          coloring={this.currentColoring()}
          playing={this.state.playing}
          frameDuration={this.currentFrameDuration()}
          speed={this.state.speed}
          scale={this.state.scale}
          offset={this.state.offset}
          onDrag={this.handleRenderDrag}
          onZoom={this.handleRenderZoom} />

        <Controls
          ruleSets={this.state.ruleSets}
          currentRuleSetIndex={this.state.currentRuleSetIndex}
          colorings={this.state.colorings}
          currentColoringIndex={this.state.currentColoringIndex}
          playing={this.state.playing}
          speed={this.state.speed}
          scale={this.state.scale}
          offset={this.state.offset}
          onStateClear={this.handleStateClear}
          onStateSeed={this.handleStateSeed}
          onRuleSetChange={this.handleRuleSetChange}
          onColoringChange={this.handleColoringChange}
          onStep={this.handleStep}
          onPlay={this.handlePlay}
          onStop={this.handleStop}
          onSpeedChange={this.handleSpeedChange}
          onDisplayReset={this.handleDisplayReset}
          onScaleChange={this.handleScaleChange}
          onImpatientUser={this.handleImpatientUser} />
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app-mount'));
