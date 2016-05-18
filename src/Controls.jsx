var React = require('react')
  , RangeControl = require('./RangeControl')
  , SPEED_LABELS = ['Slow', 'Normal', 'Fast']
  ;

require('./Controls.styl');

module.exports = React.createClass({
  getInitialState() {
    return {
      speedRange: {min: 0, max: 2}
    };
  },

  getDefaultProps() {
    return {
      playing: false,
      speed: 0,
      onPlay: () => {},
      onStop: () => {},
      onSpeedChange: () => {}
    };
  },

  getPlayStopLabel() {
    if (this.props.playing) {
      return "Stop";
    } else {
      return "Play";
    }
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

  render() {
    return (
      <div className="controls-container">
        <div className="control-group">
          <p>Playback</p>
          <button type="button" disabled={this.props.playing}>Step</button>
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
      </div>
    );
  }
});

