precision highp float;

uniform vec2 pixelStep;
uniform vec2 translate;
uniform float scale;

attribute vec3 position;

varying vec2 out_texCoord;

void main() {
  vec2 pan = translate * pixelStep * 2.0;

  mat4 scaleMat = mat4(scale, 0.0, 0.0, 0.0,
                       0.0, scale, 0.0, 0.0,
                       0.0, 0.0, 1.0, 0.0,
                       0.0, 0.0, 0.0, 1.0);

  mat4 translateMat = mat4(1.0, 0.0, 0.0, 0.0,
                           0.0, 1.0, 0.0, 0.0,
                           0.0, 0.0, 1.0, 0.0,
                           pan.x, -pan.y, 0.0, 1.0);

  out_texCoord = (position.xy / 2.0) + vec2(0.5, 0.5);
  gl_Position = scaleMat * translateMat * vec4(position, 1.0);
}
