var React = require('react')
  , Icon = require('./Icon')
  , SelectControl = require('./SelectControl')
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
      active: false,
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
      onReset: () => {},
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

  handleReset() {
    this.props.onReset();
  },

  handleScaleChange(newScale) {
    this.props.onScaleChange(newScale);
  },

  handleControlFreakUser() {
    this.props.onActivate();
  },

  handleLaiserFaireUser() {
    this.props.onDeactivate();
  },

  handleImpatientUser() {
    this.props.onImpatientUser();
  },

  controlsWrapperClassNames() {
    var classes = ['controls-container'];

    if (this.props.active === true) {
      classes.push('active');
    }

    return classes.join(' ');
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
      <div id="controls-wrapper" className={this.controlsWrapperClassNames()}>
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
          <button type="button" className="focusable" onClick={this.handleReset}>Reset</button>
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
    );
  }
});

