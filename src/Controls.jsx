var React = require('react')
  , Icon = require('./Icon')
  , SelectControl = require('./SelectControl')
  , RangeControl = require('./RangeControl')
  , controlsIconId = require('../res/svg/control-dial.svg')
  , magicWandIconId = require('../res/svg/magic-wand.svg')
  , SPEED_LABELS = ['Slow', 'Normal', 'Fast']
  ;

require('./Controls.styl');

module.exports = React.createClass({
  getInitialState() {
    return {
      speedRange: {min: 0, max: 2},
      scaleRange: {min: 1, max: 10}
    };
  },

  getDefaultProps() {
    return {
      ruleSets: [],
      currentRuleSetIndex: -1,
      playing: false,
      speed: 0,
      scale: 1,
      offset: {
        x: 0, y: 0
      },
      onStateClear: () => {},
      onStateSeed: () => {},
      onRuleSetChange: () => {},
      onColoringChange: () => {},
      onStep: () => {},
      onPlay: () => {},
      onStop: () => {},
      onSpeedChange: () => {},
      onDisplayReset: () => {},
      onScaleChange: () => {},
      onImpatientUser: () => {}
    };
  },

  getPlayStopLabel() {
    if (this.props.playing) {
      return "Stop";
    } else {
      return "Play";
    }
  },

  handleStateClear() {
    this.props.onStateClear();
  },

  handleStateSeed() {
    this.props.onStateSeed();
  },

  handleRuleChange(index) {
    this.props.onRuleSetChange(index);
  },

  handleColoringChange(index) {
    this.props.onColoringChange(index);
  },

  handleStep() {
    this.props.onStep();
  },

  handlePlayStop() {
    if (this.props.playing) {
      this.props.onStop();
    } else {
      this.props.onPlay();
    }
  },

  handleSpeedChange(newSpeed) {
    this.props.onSpeedChange(newSpeed);
  },

  handleDisplayReset() {
    this.props.onDisplayReset();
  },

  handleScaleChange(newScale) {
    this.props.onScaleChange(newScale);
  },

  handleImpatientUser() {
    this.props.onImpatientUser();
  },

  offsetX() {
    return this.roundValue(this.props.offset.x, 100);
  },

  offsetY() {
    return this.roundValue(this.props.offset.y, 100);
  },

  roundValue(value, decimal) {
    return Math.round(value * decimal) / decimal;
  },

  currentRuleSetLabel() {
    return this.props.ruleSets[this.props.currentRuleSetIndex].label;
  },

  currentColoringLabel() {
    return this.props.colorings[this.props.currentColoringIndex].label;
  },

  render() {
    return (
      <div>
        <div className="controls-container">
          <p id="rule-color-label">{this.currentRuleSetLabel()}, {this.currentColoringLabel()}</p>
          <div className="control-group">
            <button type="button" className="iconified focusable">
              <Icon id={controlsIconId} width={20} height={20} /> I Need Control
            </button>
          </div>
          <div className="control-group">
            <button type="button" className="iconified focusable" onClick={this.handleImpatientUser}>
              <Icon id={magicWandIconId} width={20} height={20} /> Just Do Something
            </button>
          </div>
        </div>

        <div className="controls-container">
          <div className="control-group">
            <p>Initial State</p>
            <button type="button" className="focusable" onClick={this.handleStateClear}>Clear</button>
            <button type="button" className="focusable" onClick={this.handleStateSeed}>Seed</button>
          </div>

          <div className="control-group">
            <p>Rules</p>
            <SelectControl
              options={this.props.ruleSets}
              selected={this.props.currentRuleSetIndex}
              onChange={this.handleRuleChange} />
          </div>

          <div className="control-group">
            <p>Simulation</p>
            <button type="button" className="focusable" onClick={this.handleStep} disabled={this.props.playing}>Step</button>
            <button type="button" className="focusable" onClick={this.handlePlayStop}>{this.getPlayStopLabel()}</button>
            <RangeControl
              id="speed"
              label="Speed"
              range={this.state.speedRange}
              step="1"
              value={this.props.speed}
              valueLabel={SPEED_LABELS[this.props.speed]}
              onChange={this.handleSpeedChange} />
          </div>

          <div className="control-group">
            <p>Display</p>
            <button type="button" className="focusable" onClick={this.handleDisplayReset}>Reset</button>
            <RangeControl
              id="scale"
              label="Scale"
              range={this.state.scaleRange}
              step="0.1"
              value={this.props.scale}
              valueLabelRounding="100"
              onChange={this.handleScaleChange} />
          </div>

          <div className="control-group">
            <p>Colouring</p>
            <SelectControl
              options={this.props.colorings}
              selected={this.props.currentColoringIndex}
              onChange={this.handleColoringChange} />
          </div>
        </div>
      </div>
    );
  }
});

