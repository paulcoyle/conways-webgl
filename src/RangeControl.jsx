var React = require('react');

require('./RangeControl.styl');

module.exports = React.createClass({
  getDefaultProps() {
    return {
      id: '__none__',
      label: 'Range',
      valueLabel: null,
      range: {
        min: 0,
        max: 1
      },
      step: 0.1,
      value: 0.5,
      onChange: () => {}
    };
  },

  getLabel() {
    if (this.props.valueLabel !== null) {
      return this.props.valueLabel;
    } else {
      return this.props.value;
    }
  },

  handleRangeChange(e) {
    var value;

    if (e.target.hasOwnProperty('valueAsNumber')) {
      value = e.target.valueAsNumber;
    } else {
      value = parseFloat(e.target.value);
    }

    this.props.onChange(value);
  },

  render() {
    return (
      <div className="range">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input
          id={this.props.id}
          type="range"
          min={this.props.range.min}
          max={this.props.range.max}
          step={this.props.step}
          value={this.props.value}
          onChange={this.handleRangeChange} />
        <span className="value">{this.getLabel()}</span>
      </div>
    );
  }
});
