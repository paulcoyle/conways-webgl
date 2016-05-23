precision highp float;

uniform vec2 pixelStep;
uniform sampler2D tex;

varying vec2 out_texCoord;

void main() {
  vec4 fragColor = texture2D(tex, out_texCoord);
  fragColor.a = 1.0;
  gl_FragColor = fragColor;
}
