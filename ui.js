(function(gol) {
  'use strict';

  /*
  * UI Controls
  */
  (function(ui, drag, render) {
    var displayElement
      , displayDragDispose
      , justMakeItGoButton
      , clearButton
      , seedButton
      , stepButton
      , playStopButton
      , speedSlider
      , speedValue
      , ruleSelect
      , displayResetButton
      , scaleSlider
      , scaleValue
      , FAST = 2
      , NORMAL = 1
      , SLOW = 0
      , speedLabels = ['Slow', 'Normal', 'Fast']
      , state
      , rules =
        [ createRule('Conway\'s Life', [2, 3], [3])
        , createRule('Mazectric', [1, 2, 3, 4], [3])
        , createRule('Maze', [1, 2, 3, 4, 5], [3])
        , createRule('Serviettes', [], [2, 3, 4])
        , createRule('DotLife', [0, 2, 3], [3])
        , createRule('Coral', [4, 5, 6, 7, 8], [3])
        , createRule('34 Life', [3, 4], [3, 4])
        , createRule('Assimilation', [4, 5, 6, 7], [3, 4, 5])
        , createRule('Long Life', [5], [3, 4, 5])
        , createRule('Diamoeba', [5, 6, 7, 8], [3, 5, 6, 7, 8])
        , createRule('Amoeba', [1, 3, 5, 8], [3, 5, 7])
        , createRule('Pseudo Life', [2, 3, 8], [3, 5, 7])
        , createRule('2x2', [1, 2, 5], [3, 6])
        , createRule('HighLife', [2, 3], [3, 6])
        , createRule('Move', [2, 4, 5], [3, 6, 8])
        , createRule('Stains', [2, 3, 5, 6, 7, 8], [3, 6, 7, 8])
        , createRule('Day & Night', [3, 4, 6, 7, 8], [3, 6, 7, 8])
        , createRule('DryLife', [2, 3], [3, 7])
        , createRule('Coagulations', [2, 3, 5, 6, 7, 8], [3, 7, 8])
        , createRule('Walled Cities', [2, 3, 4, 5], [4, 5, 6, 7, 8])
        , createRule('Vote 4/5', [3, 5, 6, 7, 8], [4, 6, 7, 8])
        , createRule('Vote', [4, 5, 6, 7, 8], [5, 6, 7, 8])
        ] 
      ;

    ui.init = init;

    function init() {
      displayElement = document.getElementById('gol');
      displayElement.addEventListener('mousewheel', function(event) {
        scaleDelta(Math.sign(event.deltaY) * -0.1);
        event.preventDefault();
      });
      displayDragDispose = drag.onDrag(displayElement, function(delta) {
        panBy(delta);
      });

      justMakeItGoButton = document.getElementById('just-make-it-go');
      justMakeItGoButton.addEventListener('click', function() {
        randomStateAndPlay();
      });

      clearButton = document.getElementById('clear');
      clearButton.addEventListener('click', function() {
        clear();
      });

      seedButton = document.getElementById('reseed');
      seedButton.addEventListener('click', function() {
        reseed();
      });

      stepButton = document.getElementById('step');
      stepButton.addEventListener('click', function() {
        step();
      });

      playStopButton = document.getElementById('play-stop');
      playStopButton.addEventListener('click', function() {
        togglePlayback();
      });

      speedSlider = document.getElementById('speed');
      speedSlider.addEventListener('input', function() {
        state.speed = this.valueAsNumber;
        updateControls();
      });

      speedValue = document.getElementById('speed-value');

      ruleSelect = document.getElementById('ruleset');
      ruleSelect.addEventListener('change', function() {
        var value = parseInt(this.value, 10)
          , rule = rules[value];

        setRules(rule.birth, rule.death);
      });

      displayResetButton = document.getElementById('display-reset');
      displayResetButton.addEventListener('click', function() {
        resetDisplay();
      });

      scaleSlider = document.getElementById('scale');
      scaleSlider.addEventListener('input', function() {
        scale(this.valueAsNumber);
      });

      scaleValue = document.getElementById('scale-value');

      state = {
        playing: false,
        speed: NORMAL,
        scale: 1.0,
        pan: { x: 0.0, y: 0.0 },
        nextRender: Date.now(),
        ruleset: 0
      };

      updateControls();
      addRuleOptions(ruleSelect, rules);
    }

    function randomStateAndPlay() {
      var rule;

      state.ruleset = Math.floor(Math.random() * rules.length);
      rule = rules[state.ruleset];
      setRules(rule.birth, rule.death);

      state.speed = FAST;

      clear();
      reseed();
      play();
    }

    function clear() {
      render.clear();
      render.draw();
    }

    function reseed() {
      render.seed();
      render.draw();
    }

    function step() {
      render.step();
      render.draw();
    }

    function play() {
      state.playing = true;
      updateControls();
      runPlayback();
    }

    function stop() {
      state.playing = false;
      updateControls();
    }

    function setRules(births, deaths) {
      render.setBirths(births);
      render.setDeaths(deaths);
    }

    function scale(k) {
      k = Math.min(10, Math.max(1, k));

      state.scale = k;
      scaleSlider.value = k;
      updateControls();
      render.setScale(k);
      render.draw();
    }

    function panBy(offsets) {
      panTo({
        x: state.pan.x + offsets.x / state.scale,
        y: state.pan.y + offsets.y / state.scale
      });
    }

    function panTo(offsets) {
      state.pan = offsets;
      render.setPan(state.pan.x, state.pan.y);
      render.draw();
    }

    function scaleDelta(delta) {
      scale(state.scale + delta);
    }

    function resetDisplay() {
      scale(1.0);
      panTo({x: 0.0, y: 0.0});
    }

    function togglePlayback() {
      if (state.playing === true) {
        stop();
      } else {
        play();
      }
    }

    function updateControls() {
      stepButton.disabled = state.playing;
      playStopButton.innerHTML = (state.playing === true) ? 'Stop' : 'Play';
      speedSlider.value = state.speed;
      speedValue.innerHTML = speedLabels[state.speed];
      scaleValue.innerHTML = 'x' + (Math.round(state.scale * 10) / 10);
      ruleSelect.value = state.ruleset;
    }

    function runPlayback() {
      var now = Date.now();

      if (state.nextRender && now > state.nextRender) {
        state.nextRender = nextRenderTime(now);
        step();
      }

      if (state.playing === true) {
        requestAnimationFrame(runPlayback);
      }
    }

    function nextRenderTime(now) {
      switch (state.speed) {
        case FAST:
          return now;

        case NORMAL:
          return now + (1000 / 10);

        case SLOW:
          return now + (1000 / 3);
      }
    }

    function createRule(label, birth, death) {
      return {
        label: label,
        birth: birth,
        death: death
      };
    }

    function addRuleOptions(select, rules) {
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i]
          , option = document.createElement('option');
        option.value = i;
        option.text = rule.label + ' (' + rule.birth.join('') + '/' + rule.death.join('') + ')';

        select.appendChild(option);
      }
    }
  })(gol.ui || (gol.ui = {})
   , gol.drag || (gol.drag = {})
   , gol.render || (gol.render = {})
   );

})(window.gol || (window.gol = {}));
