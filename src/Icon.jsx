var React = require('react');

module.exports = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      className: '',
      width: 24,
      height: 24
    };
  },

  rootClassNames() {
    return 'icon ' + this.props.className;
  },

  render() {
    return (
      <svg
        className={this.rootClassNames()}
        width={this.props.width}
        height={this.props.height}>
        <use xlinkHref={this.props.id} />
      </svg>
    );
  }
});
