var Coloring = require('./Coloring')
  , drawVertShader = require('../shader/draw-vert.glsl')
  , drawFragShader = require('../shader/draw-frag.glsl')
  , computeVertShader = require('../shader/compute-vert.glsl')
  , computeFragShader = require('../shader/compute-frag.glsl')
  ;

module.exports = createRenderer;

function createRenderer(renderCanvas, seedCanvas) {
  var gl
    , size
    , drawProgram
    , computeProgram
    , quadPosBuffer
    , frameBuffers
    , frameBufferIndex
    , liveRule
    , deadRule
    , colorType
    , liveInitialColor
    , liveColorStep
    , deadInitialColor
    , deadColorStep
    , drawScale
    , drawPan
    ;

  init();

  return {
    clear: clear,
    seed: seed,
    draw: draw,
    step: computeNextCycle,
    setLiveRule: setLiveRule,
    setDeadRule: setDeadRule,
    setColorType: setColorType,
    setLiveColoring: setLiveColoring,
    setDeadColoring: setDeadColoring,
    setScale: setScale,
    setPan: setPan
  };

  function init() {
    gl = renderCanvas.getContext('webgl', {antialias: true});
    size = {
      width: renderCanvas.width,
      height: renderCanvas.height
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    drawProgram = compileAndLinkProgram(drawVertShader, drawFragShader);
    computeProgram = compileAndLinkProgram(computeVertShader, computeFragShader);

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

    liveRule = fillArrayToSize([2, 3], 8, -1);
    deadRule = fillArrayToSize([3], 8, -1);

    colorType = Coloring.type.DECAYED;
    liveInitialColor = [1.0, 1.0, 0.0];
    liveColorStep = [0.0, -0.01, 0.0];
    deadInitialColor = [1.0, 0.0, 1.0];
    deadColorStep = [-0.02, 0.0, -0.01];

    drawScale = 1.0;
    drawPan = [0.0, 0.0];

    clear();
    draw();
  }

  function clear() {
    var ctx = seedCanvas.getContext('2d');

    ctx.clearRect(0, 0, size.width, size.height);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, frameBuffers[frameBufferIndex].texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, seedCanvas);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  function seed() {
    var ctx = seedCanvas.getContext('2d')
      , seedFillStyler = Coloring.fillStylerForSeed(colorType, liveInitialColor)
      , blocksize = 20;

    for (var i = 0; i < 400; i++) {
      ctx.fillStyle = seedFillStyler();
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

  function setLiveRule(rule) {
    liveRule = fillArrayToSize(rule.slice(), 8, -1);
  }

  function setDeadRule(rule) {
    deadRule = fillArrayToSize(rule.slice(), 8, -1);
  }

  function setColorType(type) {
    colorType = type;
  }

  function setLiveColoring(initial, step) {
    liveInitialColor = initial;
    liveColorStep = step;
  }

  function setDeadColoring(initial, step) {
    deadInitialColor = initial;
    deadColorStep = step;
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
    var liveRuleUniformLocation = gl.getUniformLocation(program, 'liveRule')
      , deadRuleUniformLocation = gl.getUniformLocation(program, 'deadRule')
      , colorTypeUniformLocation = gl.getUniformLocation(program, 'colorType')
      , liveInitialColorUniformLocation = gl.getUniformLocation(program, 'liveInitialColor')
      , liveColorStepUniformLocation = gl.getUniformLocation(program, 'liveColorStep')
      , deadInitialColorUniformLocation = gl.getUniformLocation(program, 'deadInitialColor')
      , deadColorStepUniformLocation = gl.getUniformLocation(program, 'deadColorStep')
      ;

    gl.uniform1iv(liveRuleUniformLocation, liveRule);
    gl.uniform1iv(deadRuleUniformLocation, deadRule);
    gl.uniform1i(colorTypeUniformLocation, colorType);

    if (colorType === Coloring.type.DECAYED) {
      gl.uniform3fv(liveInitialColorUniformLocation, liveInitialColor);
      gl.uniform3fv(liveColorStepUniformLocation, liveColorStep);
      gl.uniform3fv(deadInitialColorUniformLocation, deadInitialColor);
      gl.uniform3fv(deadColorStepUniformLocation, deadColorStep);
    }
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
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

  function compileAndLinkProgram(vertexShaderScript, fragmentShaderScript) {
    var vertexShader = compileShader(vertexShaderScript, gl.VERTEX_SHADER)
      , fragmentShader = compileShader(fragmentShaderScript, gl.FRAGMENT_SHADER)
      , program = gl.createProgram()
      ;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Linking of shader program failed.');
    }

    return program;
  }

  function compileShader(shaderScript, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compile failed: ' + gl.getShaderInfoLog(shader));
    }

    return shader;
  }
}
