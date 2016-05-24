var React = require('react')
  , Icon = require('./Icon')
  , chevronDownId = require('../res/svg/chevron-down.svg');

require('./SelectControl.styl');

module.exports = React.createClass({
  propTypes: {
    options: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        label: React.PropTypes.string.isRequired
      })
    ).isRequired,
    selected: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func
  },

  getInitialState() {
    return {
      focused: false
    };
  },

  getDefaultProps() {
    return {
      options: [],
      selected: -1,
      onChange: () => {}
    };
  },

  handleChange(e) {
    var value = e.target.valueAsNumber || parseInt(e.target.value);
    this.props.onChange(value);
  },

  handleFocus() {
    this.state.focused = true;
    this.setState(this.state);
  },

  handleBlur() {
    this.state.focused = false;
    this.setState(this.state);
  },

  rootClassNames() {
    var classes = ['select', 'focusable'];

    if (this.state.focused) {
      classes.push('focus');
    }

    return classes.join(' ');
  },

  renderOptions() {
    return this.props.options.map((option, i) => {
      return <option key={i} value={i}>{option.label}</option>
    });
  },

  render() {
    return (
      <div className={this.rootClassNames()}>
        <Icon id={chevronDownId} width={16} height={16} />
        <select
          value={this.props.selected}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
});
