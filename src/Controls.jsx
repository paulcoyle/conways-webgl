var React = require('react')
  , RangeControl = require('./RangeControl')
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
      onStep: () => {},
      onPlay: () => {},
      onStop: () => {},
      onSpeedChange: () => {},
      onDisplayReset: () => {},
      onScaleChange: () => {}
    };
  },

  getPlayStopLabel() {
    if (this.props.playing) {
      return "Stop";
    } else {
      return "Play";
    }
  },

  ruleOptions() {
    return this.props.ruleSets.map((rule, i) => {
      return <option key={i} value={i}>{rule.label}</option>
    });
  },

  handleStateClear() {
    this.props.onStateClear();
  },

  handleStateSeed() {
    this.props.onStateSeed();
  },

  handleRuleChange(e) {
    this.props.onRuleSetChange(e.target.value);
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

  offsetX() {
    return this.roundValue(this.props.offset.x, 100);
  },

  offsetY() {
    return this.roundValue(this.props.offset.y, 100);
  },

  roundValue(value, decimal) {
    return Math.round(value * decimal) / decimal;
  },

  render() {
    return (
      <div className="controls-container">
        <div className="control-group">
          <p>Initial State</p>
          <button type="button" onClick={this.handleStateClear}>Clear</button>
          <button type="button" onClick={this.handleStateSeed}>Seed</button>
        </div>

        <div className="control-group">
          <p>Rules</p>
          <select value={this.props.currentRuleSetIndex} onChange={this.handleRuleChange}>
            {this.ruleOptions()}
          </select>
        </div>

        <div className="control-group">
          <p>Simulation</p>
          <button type="button" onClick={this.handleStep} disabled={this.props.playing}>Step</button>
          <button type="button" onClick={this.handlePlayStop}>{this.getPlayStopLabel()}</button>
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
          <button type="button" onClick={this.handleDisplayReset}>Reset</button>
          <RangeControl
            id="scale"
            label="Scale"
            range={this.state.scaleRange}
            step="0.1"
            value={this.props.scale}
            valueLabelRounding="100"
            onChange={this.handleScaleChange} />

          <div className="coords">
            <p>(<span>{this.offsetX()}</span>,<span>{this.offsetY()}</span>)</p>
          </div>
        </div>
      </div>
    );
  }
});

