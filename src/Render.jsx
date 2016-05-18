var React = require('react');

require('./Render.styl');

module.exports = React.createClass({
  componentDidMount() {
    // Pass refs to canvases to rendering library initialization.
  },

  componentWillUnmount() {
    // Notify rendering library to cleanup.
  },

  componentWillReceiveProps(newProps) {
    // Update rendering library with any changes in state.
  },

  render() {
    return (
      <div id="render-container">
        <canvas id="gol" ref="render" width="1024" height="512"></canvas>
        <canvas id="seed" ref="seed" width="1024" height="512"></canvas>
      </div>
    );
  }
});
