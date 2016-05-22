precision highp float;

uniform vec2 pixelStep;
uniform sampler2D tex;

uniform int liveRule[8];
uniform int deadRule[8];

uniform vec3 liveInitialColor;
uniform vec3 liveColorStep;
uniform vec3 deadInitialColor;
uniform vec3 deadColorStep;

varying vec2 out_texCoord;

// Forward decls.
int countNeighbours(in sampler2D tex,
                    in vec2 loc,
                    out vec3 offspringColor);

bool isCellAlive(in vec4 cellColor);

vec4 nextCycleForLivingCell(in vec4 currentColor,
                            in int neighbourCount,
                            in vec3 offspringColor);

vec4 nextCycleForDeadCell(in vec4 currentColor,
                          in int neighbourCount,
                          in vec3 offspringColor);

bool isContainedIn(in int[8] list, in int value);

// Program and functions.
void main() {
  vec4 cellColor = texture2D(tex, out_texCoord);
  bool cellAlive = isCellAlive(cellColor);
  vec3 offspringColor = vec3(0.0);
  int neighbours = countNeighbours(tex, out_texCoord, offspringColor);

  if (cellAlive) {
    gl_FragColor = nextCycleForLivingCell(cellColor, neighbours, offspringColor);
  } else {
    gl_FragColor = nextCycleForDeadCell(cellColor, neighbours, offspringColor);
  }
}

int countNeighbours(in sampler2D tex, in vec2 loc, out vec3 offspringColor) {
  int count = 0;

  // Sadly, GLSL ES 2.0 doesn't allow constant arrays because it doesn't
  // support array constructors.
  vec2 neighbourOffsets[8];
  neighbourOffsets[0] = vec2(-1.0, -1.0);
  neighbourOffsets[1] = vec2( 0.0, -1.0);
  neighbourOffsets[2] = vec2( 1.0, -1.0);
  neighbourOffsets[3] = vec2(-1.0,  0.0);
  neighbourOffsets[4] = vec2( 1.0,  0.0);
  neighbourOffsets[5] = vec2(-1.0,  1.0);
  neighbourOffsets[6] = vec2( 0.0,  1.0);
  neighbourOffsets[7] = vec2( 1.0,  1.0);

  offspringColor = vec3(0.0, 0.0, 0.0);

  for (int i = 0; i < 8; i++) {
    vec2 neighbourLoc = loc + (neighbourOffsets[i] * pixelStep);
    vec4 neighbourColor = texture2D(tex, neighbourLoc);

    if (isCellAlive(neighbourColor)) {
      offspringColor += neighbourColor.rgb;
      count++;
    }
  }

  offspringColor /= float(count);

  return count;
}

bool isCellAlive(in vec4 cellColor) {
  return cellColor.a == 1.0;
}

vec4 nextCycleForLivingCell(in vec4 currentColor,
                            in int neighbourCount,
                            in vec3 offspringColor) {
  if (isContainedIn(liveRule, neighbourCount)) {
    return currentColor + vec4(liveColorStep, 0.0);
  } else {
    return vec4(deadInitialColor, 0.0);
  }
}

vec4 nextCycleForDeadCell(in vec4 currentColor,
                          in int neighbourCount,
                          in vec3 offspringColor) {
  if (isContainedIn(deadRule, neighbourCount)) {
    return vec4(liveInitialColor, 1.0);
  } else {
    return currentColor + vec4(deadColorStep, 0.0);
  }
}

bool isContainedIn(in int[8] list, in int value) {
  for (int i = 0; i < 8; i++) {
    if (list[i] == value) {
      return true;
    }
  }

  return false;
}
