// scenario

function scenarioGetContentByIndex(scenario, index) {
  return scenario[index];
}
module.exports.scenarioGetContentByIndex = scenarioGetContentByIndex;

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

function scenarioGetId(scenario, scenarioIndex, selectionIndex = -1) {
  return (selectionIndex == -1) ?
    scenario[scenarioIndex].id : scenario[scenarioIndex].selections[selectionIndex].id;
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

function scenarioGetNodeById(scenario, id) {
  var node = null;
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'single') {
      if (scenario[i].id == id) {
        node = scenario[i];
        break;
      }
    } else if (scenario[i].nodeType == 'group') {
      var selections = scenario[i].selections;
      for (var j = 0; j < selections.length; j++) {
        if (selections[j].id == id) {
          node = selections[j];
          break;
        }
      }
    }
  }
  return node;
}
module.exports.scenarioGetNodeById = scenarioGetNodeById;

// Was: getNormalNodesFromScenarioByNext
function scenarioGetNodesThatConnectTo(scenario, id) {
  var nodes = [];
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'single' && scenario[i].next == id) {
      nodes.push(scenario[i]);
    }
  }
  return nodes;
}
module.exports.scenarioGetNodesThatConnectTo = scenarioGetNodesThatConnectTo;

// Was: getSelectionsFromScenarioByNext
function scenarioGetSelectionsThatConnectTo(scenario, id) {
  var results = [];
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'group') {
      var selections = scenario[i].selections;
      for (var j = 0; j < selections.length; j++) {
        if (selections[j].next == id) {
          results.push(selections[j]);
        }
      }
    }
  }
  return results;
}
module.exports.scenarioGetSelectionsThatConnectTo = scenarioGetSelectionsThatConnectTo;

// Was: getIndexesOfNormalNodesFromScenarioByNext
function scenarioGetNormalNodeIndexesThatConnectTo(scenario, id) {
  var indexes = [];
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'single' && scenario[i].next == id) {
      indexes.push({ scenarioIndex: i });
    }
  }
  return indexes;
}
module.exports.scenarioGetNormalNodeIndexesThatConnectTo = scenarioGetNormalNodeIndexesThatConnectTo;

// Was: getIndexesOfSelectionsFromScenarioByNext
function scenarioGetSelectionIndexesThatConnectTo(scenario, id) {
  var indexes = [];
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'group') {
      var selections = scenario[i].selections;
      for (var j = 0; j < selections.length; j++) {
        if (selections[j].next == id) {
          indexes.push({ scenarioIndex: i, selectionIndex: j });
        }
      }
    }
  }
  return indexes;
}
module.exports.scenarioGetSelectionIndexesThatConnectTo = scenarioGetSelectionIndexesThatConnectTo;

// Was: getEventOfGoToByToId
function scenarioGetGoToEventsThatJumpTo(scenario, id) {
  var events = [];
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].type == 'goto' && scenario[i].toId == id) {
      events.push(scenario[i]);
    }
  }
  return events;
}
module.exports.scenarioGetGoToEventsThatJumpTo = scenarioGetGoToEventsThatJumpTo;

function scenarioIsSingle(scenario, index) {
  return scenario[index].nodeType == 'single';
}
module.exports.scenarioIsSingle = scenarioIsSingle;

function scenarioIsGroup(scenario, index) {
  return scenario[index].nodeType == 'group';
}
module.exports.scenarioIsGroup = scenarioIsGroup;

function scenarioIsNormal(scenario, index) {
  return scenario[index].type == 'normal';
}
module.exports.scenarioIsNormal = scenarioIsNormal;

function scenarioIsOpenQuestion(scenario, index) {
  return scenario[index].type == 'openquestion';
}
module.exports.scenarioIsOpenQuestion = scenarioIsOpenQuestion;

function scenarioIsGoTo(scenario, index) {
  return scenario[index].type == 'goto';
}
module.exports.scenarioIsGoTo = scenarioIsGoTo;

function scenarioIsGoToAnotherProject(scenario, index) {
  return scenario[index].type == 'gotoAnotherProject';
}
module.exports.scenarioIsGoToAnotherProject = scenarioIsGoToAnotherProject;

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

// Drawing

function scenarioDrawNodes(scenario, drawNode) {
  for (var i = 0; i < scenario.length; i++) {
    drawNode(scenario, i);
  }
}
module.exports.scenarioDrawNodes = scenarioDrawNodes;

function scenarioDrawLines(scenario, drawLine) {
  for (var i = 0; i < scenario.length; i++) {
    drawLine(scenario, i);
  }
}
module.exports.scenarioDrawLines = scenarioDrawLines;

function scenarioGetTopLinePosition(scenario, index) {
  return scenario[index].gui.topLinePosition;
}
module.exports.scenarioGetTopLinePosition = scenarioGetTopLinePosition;

function scenarioGetTopLineId(scenario, index) {
  return scenario[index].gui.topLineId;
}
module.exports.scenarioGetTopLineId = scenarioGetTopLineId;

function scenarioGroupDrawLines(scenario, index, drawLine) {
  var selections = scenario[index].selections;
  for (var i = 0; i < selections.length; i++) {
    drawLine(selections, i);
  }
}
module.exports.scenarioGroupDrawLines = scenarioGroupDrawLines;

function scenarioSelectionGetTopLinePosition(selections, index) {
  return selections[index].topLinePosition;
}
module.exports.scenarioSelectionGetTopLinePosition = scenarioSelectionGetTopLinePosition;

function scenarioSelectionGetTopLineId(selections, index) {
  return selections[index].topLineId;
}
module.exports.scenarioSelectionGetTopLineId = scenarioSelectionGetTopLineId;
