(function(gol) {
  'use strict';

  /*
  * Rendering
  */
  (function(render) {
    var gl
      , seedCanvas
      , size
      , drawProgram
      , computeProgram
      , quadPosBuffer
      , frameBuffers
      , frameBufferIndex
      , birthRule
      , deathRule
      , drawScale
      , drawPan
      ;

    render.init = init;
    render.clear = clear;
    render.seed = seed;
    render.draw = draw;
    render.step = computeNextCycle;
    render.setBirths = setBirths;
    render.setDeaths = setDeaths;
    render.setScale = setScale;
    render.setPan = setPan;

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
      drawPan = [0.0, 0.0];

      clear();
      draw();
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

    function setPan(x, y) {
      drawPan = [x, y];
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
      var scaleUniformLocation = gl.getUniformLocation(program, 'scale')
        , translateUniformLocation = gl.getUniformLocation(program, 'translate');

      gl.uniform1f(scaleUniformLocation, drawScale);
      gl.uniform2fv(translateUniformLocation, drawPan);
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
      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

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

})(window.gol || (window.gol = {}));
