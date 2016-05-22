module.exports = {
  colorings: [ createColoring('Classic',
                              [1.0, 1.0, 1.0], [1.0, 1.0, 1.0],
                              [0.0, 0.0, 0.0], [-1.0, -1.0, -1.0])
             , createColoring('Sunsetish',
                              [1.0, 1.0, 0.0], [0.0, -0.01, 0.0],
                              [1.0, 0.0, 1.0], [-0.02, 0.0, -0.01])
             , createColoring('Citrus',
                              [1.0, 1.0, 0.5], [-0.01, 0.0, -0.01],
                              [0.4, 0.8, 0.0], [-0.01, -0.01, -1.0])
             ]
}

function createColoring(label, liveInitial, liveStep, deadInitial, deadStep) {
  return {
    label: label,
    liveInitial: liveInitial,
    liveStep: liveStep,
    deadInitial: deadInitial,
    deadStep: deadStep
  };
}
