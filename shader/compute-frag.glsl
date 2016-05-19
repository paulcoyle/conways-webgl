precision highp float;

uniform vec2 pixelStep;
uniform sampler2D tex;
uniform int birth[8];
uniform int death[8];

varying vec2 out_texCoord;

// Forward decls.
int countNeighbours(in sampler2D tex, in vec2 loc);
bool isCellAlive(in vec4 cellColor);
vec4 nextCycleForLivingCell(in vec4 currentColor, in int neighbourCount);
vec4 nextCycleForDeadCell(in vec4 currentColor, in int neighbourCount);
bool isContainedIn(in int[8] list, in int value);

void main() {
  vec4 cellColor = texture2D(tex, out_texCoord);
  bool cellAlive = isCellAlive(cellColor);
  int neighbours = countNeighbours(tex, out_texCoord);

  if (cellAlive) {
    gl_FragColor = nextCycleForLivingCell(cellColor, neighbours);
  } else {
    gl_FragColor = nextCycleForDeadCell(cellColor, neighbours);
  }
}

int countNeighbours(in sampler2D tex, in vec2 loc) {
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

  for (int i = 0; i < 8; i++) {
    vec2 neighbourLoc = loc + (neighbourOffsets[i] * pixelStep);
    vec4 neighbourColor = texture2D(tex, neighbourLoc);

    if (isCellAlive(neighbourColor)) {
      count++;
    }
  }

  return count;
}

bool isCellAlive(in vec4 cellColor) {
  return cellColor.r == 1.0;
}

vec4 nextCycleForLivingCell(in vec4 currentColor, in int neighbourCount) {
  if (isContainedIn(birth, neighbourCount)) {
    return currentColor + vec4(0.0, -0.01, 0.0, 0.0);
  } else {
    return vec4(0.9, 0.0, 1.0, 1.0);
  }
}

vec4 nextCycleForDeadCell(in vec4 currentColor, in int neighbourCount) {
  if (isContainedIn(death, neighbourCount)) {
    return vec4(1.0, 1.0, 0.3, 1.0);
  } else {
    return currentColor + vec4(-0.02, 0, -0.01, 0.0);
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
