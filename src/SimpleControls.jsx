var React = require('react')
  , Icon = require('./Icon')
  , controlsIconId = require('../res/svg/control-dial.svg')
  , scaryControlsIconId = require('../res/svg/scary-controls.svg')
  , magicWandIconId = require('../res/svg/magic-wand.svg')
  , resetIconId = require('../res/svg/reset.svg')
  ;

require('./SimpleControls.styl');

module.exports = React.createClass({
  getDefaultProps() {
    return {
      controlsVisible: false,
      resetEnabled: false,
      ruleSetLabel: null,
      coloringLabel: null,
      onShowControls: () => {},
      onHideControls: () => {},
      onImpatientUser: () => {},
      onReset: () => {}
    };
  },

  handleShowControls() {
    this.props.onShowControls();
  },

  handleHideControls() {
    this.props.onHideControls();
  },

  handleImpatientUser() {
    this.props.onImpatientUser();
  },

  handleReset() {
    this.props.onReset();
  },

  renderControlToggle() {
    if (this.props.controlsVisible === true) {
      return (
        <button type="button" className="iconified focusable" onClick={this.handleHideControls}>
          <Icon id={scaryControlsIconId} width={20} height={20} /> Controls Scare Me
        </button>
      );
    } else {
      return (
        <button type="button" className="iconified focusable" onClick={this.handleShowControls}>
          <Icon id={controlsIconId} width={20} height={20} /> I Need Control
        </button>
      );
    }
  },

  simpleResetClassNames() {
    var classes = ['iconified', 'focusable'];

    if (this.props.resetEnabled) {
      classes.push('active');
    }

    return classes.join(' ');
  },

  render() {
    return (
      <div className="controls-container">
        <p id="rule-color-label">{this.props.ruleSetLabel}, {this.props.coloringLabel}</p>

        <button
          type="button"
          id="simple-reset-button"
          className={this.simpleResetClassNames()}
          disabled={!this.props.resetEnabled}
          onClick={this.handleReset}>
          <Icon id={resetIconId} width={16} height={16} /> Reset Display
        </button>

        <div className="control-group">
          {this.renderControlToggle()}
        </div>

        <div className="control-group">
          <button
            type="button"
            className="iconified focusable"
            onClick={this.handleImpatientUser}>
            <Icon id={magicWandIconId} width={20} height={20} /> Just Do Something
          </button>
        </div>
      </div>
    );
  }
});
