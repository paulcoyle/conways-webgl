module.exports = createDragWatcher;

function createDragWatcher(element, handler) {
  var initalPosition
    , lastPosition;

  element.addEventListener('mousedown', handleInitiation);

  return function() {
    cleanup();
  };

  function handleInitiation(event) {
    initalPosition = lastPosition = {
      x: event.pageX,
      y: event.pageY
    };

    addDragListeners();
  }

  function handleMove(event) {
    var currentPosition = {
          x: event.pageX,
          y: event.pageY
        }
      , delta = {
          x: currentPosition.x - lastPosition.x,
          y: currentPosition.y - lastPosition.y
        }
      ;

    lastPosition = currentPosition;

    handler(delta);
  }

  function handleCompletetion(event) {
    removeDragListeners();
    initalPosition = undefined;
    lastPosition = undefined;
  }

  function addDragListeners() {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleCompletetion);
  }

  function removeDragListeners() {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleCompletetion);
  }

  function cleanup() {
    element.removeEventListener('mousedown', handleInitiation);
    removeDragListeners();
  }
}
