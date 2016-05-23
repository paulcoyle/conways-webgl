var type = {
      DECAYED: 1,
      NEIGHBOUR: 2 
    };

Object.freeze(type);

module.exports = {
  type: type,
  colorings: [ createDecayedColoring('Classic',
                                     [1.0, 1.0, 1.0], [1.0, 1.0, 1.0],
                                     [0.0, 0.0, 0.0], [-1.0, -1.0, -1.0])
             , createDecayedColoring('Sunsetish',
                                     [1.0, 1.0, 0.0], [0.0, -0.01, 0.0],
                                     [1.0, 0.0, 1.0], [-0.02, 0.0, -0.01])
             , createDecayedColoring('Citrus',
                                     [1.0, 1.0, 0.5], [-0.01, 0.0, -0.01],
                                     [0.4, 0.8, 0.0], [-0.01, -0.01, -1.0])
             , createNeighbourColoring('Neighbour')
             ],
  fillStylerForSeed: fillStylerForSeed
}

function createDecayedColoring(label, liveInitial, liveStep, deadInitial, deadStep) {
  return {
    label: label,
    type: type.DECAYED,
    liveInitial: liveInitial,
    liveStep: liveStep,
    deadInitial: deadInitial,
    deadStep: deadStep
  };
}

function createNeighbourColoring(label) {
  return {
    label: label,
    type: type.NEIGHBOUR
  };
}

function fillStylerForSeed(colorType, initial) {
  switch (colorType) {
    case type.DECAYED:
      var decayedSeed = color3fvToFillStyle(initial, 1.0);
      return () => { return decayedSeed };

    case type.NEIGHBOUR:
      return randomBrightColor;

    default:
      throw new Error('Unknown seed type or not defined: ' + colorType);
  }
}

function color3fvToFillStyle(arr, alpha) {
  return 'rgba(' +
         Math.round(arr[0] * 255) + ',' +
         Math.round(arr[1] * 255) + ',' +
         Math.round(arr[2] * 255) + ',' +
         Math.round(alpha * 255) + ')';
}

function randomBrightColor() {
  return 'hsla(' +
         Math.floor(Math.random() * 360) + ',' +
         '100%, 50%, 1.0)';
}
