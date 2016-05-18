(function(gol) {
  'use strict';

  gol.init = init;

  function init() {
    gol.ui.init();
    gol.render.init();
  }

})(window.gol || (window.gol = {}));
