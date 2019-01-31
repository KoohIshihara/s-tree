// scenario

function scenarioGetContent(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      return scenario[i];
    }
  }
  return null;
}
module.exports.scenarioGetContent = scenarioGetContent;

function scenarioUpdateContent(scenario, id, content) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario[i] = content;
      break;  // Was missing in Ko-chan's code
    }
  }
}
module.exports.scenarioUpdateContent = scenarioUpdateContent;

function scenarioGetSize(scenario) {
  return scenario.length;
}
module.exports.scenarioGetSize = scenarioGetSize;

function scenarioGetId(scenario, index) {
  if (-1 < index && index < scenario.length) {
    return scenario[index].id;
  } else {
    throw new Error('Index Out of Bounds');
  }
}
module.exports.scenarioGetId = scenarioGetId;

function scenarioDeleteNode(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario.splice(i, 1);
      break;
    }
  }
}
module.exports.scenarioDeleteNode = scenarioDeleteNode;

function _disconnectNode(node) {
  delete node.next;
  delete node.gui.topLineId;
  delete node.gui.topLinePosition;
}

function scenarioDisconnectNormalNode(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'single' && scenario[i].next == id) {
      delete scenario[i].next;
      delete scenario[i].gui.topLineId;
      delete scenario[i].gui.topLinePosition;
    }
  }
}
module.exports.scenarioDisconnectNormalNode = scenarioDisconnectNormalNode;

function scenarioDisconnectSelectionsNode(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'group') {
      var selections = scenario[i].selections;
      for (var j = 0; j < selections.length; j++) {
        if (selections[j].next == id) {
          delete selections[j].next;
          delete selections[j].topLineId;
          delete selections[j].topLinePosition;
        }
      }
    }
  }
}
module.exports.scenarioDisconnectSelectionsNode = scenarioDisconnectSelectionsNode;

function scenarioGetEventById(scenario, id) {
  var event = null;
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      event = scenario[i];
      break;
    }
  }
  return event;
}
module.exports.scenarioGetEventById = scenarioGetEventById;

// scenarioHistories

const MAX_HISTORY = 10;
function scenarioHistoriesAddHistory(scenarioHistory, history) {
  if (scenarioHistory.length > MAX_HISTORY) {
    scenarioHistory.shift();
  }
  scenarioHistory.push(history);
}
module.exports.scenarioHistoriesAddHistory = scenarioHistoriesAddHistory;

function scenarioHistoriesIncrementIndex(scenarioHistory, index) {
  return (index < scenarioHistory.length) ? index + 1 : index;
}
module.exports.scenarioHistoriesIncrementIndex = scenarioHistoriesIncrementIndex;

function scenarioHistoriesDecrementIndex(scenarioHistory, index) {
  return (index > 0) ? index - 1 : index;
}
module.exports.scenarioHistoriesDecrementIndex = scenarioHistoriesDecrementIndex;

function scenarioHistoriesIsHistoryAvailable(scenarioHistory, index) {
  return scenarioHistory(scenarioHistory.length - index) ? true : false;
}
module.exports.scenarioHistoriesIsHistoryAvailable = scenarioHistoriesIsHistoryAvailable;

function scenarioHistoriesGetHistory(scenarioHistory, index) {
  return scenarioHistory[scenarioHistory.length - index];
}
module.exports.scenarioHistoriesGetHistory = scenarioHistoriesGetHistory;
