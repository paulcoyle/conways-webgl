precision highp float;

attribute vec3 position;

varying vec2 out_texCoord;

void main() {
  out_texCoord = (position.xy / 2.0) + vec2(0.5, 0.5);
  gl_Position = vec4(position, 1);
}
