var React = require('react')
  , raf = require('raf')
  , createRenderer = require('../lib/Renderer.js')
  , createDragWatcher = require('../lib/Drag.js')
  ;

require('./Render.styl');

module.exports = React.createClass({
  getInitialState() {
    return {
      clearIndex: 0,
      seedIndex: 0,
      stepIndex: 0,
      rafHandle: null,
      nextFrameDeadline: 0
    };
  },

  getDefaultProps() {
    return {
      playing: false,
      frameDuration: 500,
      onDrag: () => {},
      onZoom: () => {}
    };
  },

  componentDidMount() {
    this._renderer = createRenderer(this.refs.render, this.refs.seed);
    this._dragDispose = createDragWatcher(this.refs.render, this.handleDrag);
    this.updateWithProps(this.props);
  },

  componentWillReceiveProps(newProps) {
    this.updateWithProps(newProps);
  },

  componentWillUnmount() {
    this._dragDispose();
  },

  updateWithProps(props) {
    this.executeClears(props);
    this.executeSeeds(props);
    this._renderer.setScale(props.scale);
    this._renderer.setPan(props.offset.x, props.offset.y);
    this._renderer.setLiveRule(props.ruleSet.live);
    this._renderer.setDeadRule(props.ruleSet.dead);
    this._renderer.setLiveColoring(props.coloring.liveInitial,
                                   props.coloring.liveStep);
    this._renderer.setDeadColoring(props.coloring.deadInitial,
                                   props.coloring.deadStep);
    this.executeSteps(props);
    this.executePlayback(props);

    this._renderer.draw();
  },

  executeIndexedPairing(props, indexName, fn) {
    var index = this.state[indexName];

    while (index < props[indexName]) {
      fn();
      index++;
    }

    this.state[indexName] = props[indexName];
    this.setState(this.state);
  },

  executeClears(props) {
    this.executeIndexedPairing(props, 'clearIndex', () => {
      this._renderer.clear();
    });
  },

  executeSeeds(props) {
    this.executeIndexedPairing(props, 'seedIndex', () => {
      this._renderer.seed();
    });
  },

  executeSteps(props) {
    this.executeIndexedPairing(props, 'stepIndex', () => {
      this._renderer.step();
    });
  },

  executePlayback(props) {
    if (props.playing === true && this.state.rafHandle === null) {
      this.state.nextFrameDeadline = Date.now();
      this.setState(this.state);
      this.handlePlaybackFrame();
    } else if (props.playing === false && this.state.rafHandle !== null) {
      raf.cancel(this.state.rafHandle);
      this.state.rafHandle = null;
      this.setState(this.state);
    }
  },

  handlePlaybackFrame() {
    if (Date.now() > this.state.nextFrameDeadline) {
      this._renderer.step();
      this._renderer.draw();
      this.state.nextFrameDeadline = Date.now() + this.props.frameDuration;
    }

    this.state.rafHandle = raf(this.handlePlaybackFrame);
    this.setState(this.state);
  },

  handleDrag(deltas) {
    this.props.onDrag(deltas);
  },

  handleRenderWheel(event) {
    event.preventDefault();
    this.props.onZoom(Math.sign(event.deltaY) * -0.025);
  },

  render() {
    return (
      <div id="render-container">
        <canvas id="gol" ref="render" width="1024" height="512" onWheel={this.handleRenderWheel}></canvas>
        <canvas id="seed" ref="seed" width="1024" height="512"></canvas>
      </div>
    );
  }
});
