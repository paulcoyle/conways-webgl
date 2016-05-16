(function() {
  'use strict';

  var gol = {};


  /*
  * UI Controls
  */
  (function(ui, render) {
    var displayElement
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
      , speedLabels = ['Slow', 'Moderate', 'Fast']
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

    init();

    function init() {
      displayElement = document.getElementById('gol');
      displayElement.addEventListener('mousewheel', function(event) {
        scaleDelta(Math.sign(event.deltaY) * -0.1);
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
        speed: FAST,
        scale: 1.0,
        nextRender: Date.now(),
        ruleset: 0
      };

      updateControls();
      addRuleOptions(ruleSelect, rules);
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

    function scaleDelta(delta) {
      scale(state.scale + delta);
    }

    function resetDisplay() {
      scale(1.0);
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
      speedValue.innerHTML = speedLabels[state.speed];
      scaleValue.innerHTML = 'x' + state.scale;
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
  })(gol.ui || (gol.ui = {}), gol.render || (gol.render = {}));


  /*
  * Rendering
  */
  (function(render) {
    var gl = document.getElementById('gol').getContext('webgl')
      , seedCanvas = document.getElementById('seed')
      , size
      , drawProgram
      , computeProgram
      , quadPosBuffer
      , frameBuffers
      , frameBufferIndex
      , birthRule
      , deathRule
      , drawScale
      ;

    render.clear = clear;
    render.seed = seed;
    render.draw = draw;
    render.step = computeNextCycle;
    render.setBirths = setBirths;
    render.setDeaths = setDeaths;
    render.setScale = setScale;

    init();
    clear();
    draw();

    function init() {
      var renderElement = document.getElementById('gol');

      gl = renderElement.getContext('webgl');
      size = {
        width: renderElement.width,
        height: renderElement.height
      };
      seedCanvas = document.getElementById('seed');

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      drawProgram = compileAndLinkProgram(
        'draw-vert-shader',
        'draw-frag-shader'
      );
      computeProgram = compileAndLinkProgram(
        'compute-vert-shader',
        'compute-frag-shader'
      );

      quadPosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
      ]), gl.STATIC_DRAW);

      frameBuffers = [
        createFrameBufferTexturePair(),
        createFrameBufferTexturePair()
      ];
      frameBufferIndex = 0;

      birthRule = fillArrayToSize([2, 3], 8, -1);
      deathRule = fillArrayToSize([3], 8, -1);

      drawScale = 1.0;
    }

    function clear() {
      var ctx = seedCanvas.getContext('2d');

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, size.width, size.height);

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, frameBuffers[frameBufferIndex].texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, seedCanvas);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }

    function seed() {
      var ctx = seedCanvas.getContext('2d')
        , blocksize = 20;

      ctx.fillStyle = '#ff0';
      for (var i = 0; i < 400; i++) {
        ctx.fillRect(
          Math.round(Math.random() * (size.width - blocksize)),
          Math.round(Math.random() * (size.height - blocksize)),
          Math.round(Math.random() * blocksize),
          Math.round(Math.random() * blocksize)
        );
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, frameBuffers[frameBufferIndex].texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, seedCanvas);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }

    function setBirths(births) {
      birthRule = fillArrayToSize(births.slice(), 8, -1);
    }

    function setDeaths(deaths) {
      deathRule = fillArrayToSize(deaths.slice(), 8, -1);
    }

    function setScale(k) {
      drawScale = k;
    }

    function fillArrayToSize(arr, size, value) {
      while (arr.length < size) {
        arr.push(value);
      }

      return arr;
    }

    function draw() {
      gl.useProgram(drawProgram);
      globalUniforms(drawProgram);
      drawingUniforms(drawProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);

      drawQuad(drawProgram, frameBuffers[frameBufferIndex].texture);
    }

    function computeNextCycle() {
      var nextFrameBufferIndex = (frameBufferIndex + 1) % frameBuffers.length
        , nextPair = frameBuffers[nextFrameBufferIndex]
        , currentPair = frameBuffers[frameBufferIndex]
        ;

      gl.useProgram(computeProgram);
      globalUniforms(computeProgram);
      computeUniforms(computeProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, nextPair.frameBuffer);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);

      drawQuad(computeProgram, currentPair.texture);

      frameBufferIndex = nextFrameBufferIndex;
    }

    function globalUniforms(program) {
      var pixelStepUniformLocation = gl.getUniformLocation(program, 'pixelStep');

      gl.uniform2fv(pixelStepUniformLocation, [1/size.width, 1/size.height]);
    }

    function drawingUniforms(program) {
      var scaleStepUniformLocation = gl.getUniformLocation(program, 'scale');

      gl.uniform1f(scaleStepUniformLocation, drawScale);
    }

    function computeUniforms(program) {
      var birthUniformLocation = gl.getUniformLocation(program, 'birth')
        , deathUniformLocation = gl.getUniformLocation(program, 'death')
        ;

      gl.uniform1iv(birthUniformLocation, birthRule);
      gl.uniform1iv(deathUniformLocation, deathRule);
    }

    function drawQuad(program, texture) {
      var positionAttribLocation = gl.getAttribLocation(program, 'position')
        , texUniformLocation = gl.getUniformLocation(program, 'tex');

      gl.enableVertexAttribArray(positionAttribLocation);
      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 12, 0);

      gl.uniform1i(texUniformLocation, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function createFrameBufferTexturePair() {
      var texture = gl.createTexture()
        , frameBuffer = gl.createFramebuffer();

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size.width, size.height,
                    0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindTexture(gl.TEXTURE_2D, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return {
        texture: texture,
        frameBuffer: frameBuffer
      };
    }

    function compileAndLinkProgram(vertexShaderScriptId, fragmentShaderScriptId) {
      var vertexShaderScript = fetchShaderScriptById(vertexShaderScriptId)
        , fragmentShaderScript = fetchShaderScriptById(fragmentShaderScriptId)
        , vertexShader = compileShader(vertexShaderScript)
        , fragmentShader = compileShader(fragmentShaderScript)
        , program = gl.createProgram()
        ;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Linking of "' + vertexShaderScriptId + '"' +
                        ' and "' + fragmentShaderScriptId + '"' +
                        ' failed.');
      }

      return program;
    }

    function compileShader(shaderScript) {
      var shader = gl.createShader(shaderScript.type);

      gl.shaderSource(shader, shaderScript.content);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Shader compile failed: ' + gl.getShaderInfoLog(shader));
      }

      return shader;
    }

    function fetchShaderScriptById(id) {
      var script = document.getElementById(id);

      if (script === null) {
        throw new Error('Script for id "' + id + '" not found.');
      }

      return {
        type: getShaderTypeByMimeType(script.type),
        content: script.innerHTML.trim()
      };
    }

    function getShaderTypeByMimeType(mimeType) {
      switch (mimeType) {
        case 'x-shader/x-vertex':
          return gl.VERTEX_SHADER;

        case 'x-shader/x-fragment':
          return gl.FRAGMENT_SHADER;

        default:
          throw new Error('Shader type for mime "' + mimeType + '" does not exist.');
      }
    }
  })(gol.render || (gol.render = {}));
})();
