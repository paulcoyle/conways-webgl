precision highp float;

uniform vec2 pixelStep;
uniform sampler2D tex;

varying vec2 out_texCoord;

void main() {
  gl_FragColor = texture2D(tex, out_texCoord);
}
