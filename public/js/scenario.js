// scenario
var scenarioArray;

function scenarioGetContentByIndex(scenario, index) {
  return scenario[index];
}

function scenarioGetContent(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      return scenario[i];
    }
  }
  return null;
}
//module.exports.scenarioGetContent = scenarioGetContent;


// kooh--------------------
function scenarioAddContent(scenario, content) {
  scenario.push(content);
}


function scenarioConnectFromSingleNode(from, toId) {
  from.next = toId;
  from.topLineId = `line-${from.id}`;
  from.gui.topLineId = `line-${from.id}`;
}


function scenarioConnectFromGroupNode(from, toId, selectionsNum) {
  var selections = from.selections;
  for(var i=0; i<selections.length; i++){
    if(selections[i].id==targetSelectionEventId){
      selections[i].next = toId;
      //selections[i].topLineId = `line-${selections[i].id}`;
      break;
    }
  }
  from.selections = selections;
}
// --------------------



function scenarioUpdateContent(scenario, id, content) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario[i] = content;
      break;  // Was missing in Ko-chan's code
    }
  }
}
//module.exports.scenarioUpdateContent = scenarioUpdateContent;

// kooh--------------------
function scenarioUpdatePosition(scenario, id, position) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario[i].gui.position = position;
      break;  // Was missing in Ko-chan's code
    }
  }
}

function scenarioIncrementSelectionCounter(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario[i].addedSelectionsCounter++;
      break;
    }
  }
}

function scenarioAddSelectionToSelectionNode(scenario, id, content) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario[i].selections.push(content);
      break;
    }
  }
}

// --------------------

function scenarioGetSize(scenario) {
    return scenario.length;
}
//module.exports.scenarioGetSize = scenarioGetSize;

function scenarioGetId(scenario, index) {
  if (-1 < index && index < scenario.length) {
    return scenario[index].id;
  } else {
    throw new Error('Index Out of Bounds');
  }
}
//module.exports.scenarioGetId = scenarioGetId;

function scenarioGetNext(scenario, index) {
  return scenario[index].next;
}
//module.exports.scenarioGetId = scenarioGetId;

function scenarioSelectionGetId(selections, index) {
  return selections[index].id;
}
//module.exports.scenarioSelectionGetId = scenarioSelectionGetId;

function scenarioSelectionGetNext(selections, index) {
  return selections[index].next;
}
//module.exports.scenarioSelectionGetNext = scenarioSelectionGetNext;

function scenarioDeleteNode(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      scenario.splice(i, 1);
      break;
    }
  }
}
//module.exports.scenarioDeleteNode = scenarioDeleteNode;

// kooh-----------
function scenarioDeleteSelection(selections, id) {
  for(var i=0; i<selections.length; i++){
    if(selections[i].id == id){
      selections.splice(i, 1);
    }
  }
}
// -----------

function _disconnectNode(node) {
  delete node.next;
  delete node.gui.topLineId;
}

function scenarioDisconnectNormalNode(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if ((scenario[i].nodeType == 'single' || scenario[i].nodeType == 'point') && scenario[i].next == id) {
      delete scenario[i].next;
      delete scenario[i].gui.topLineId;
    }
  }
}
//module.exports.scenarioDisconnectNormalNode = scenarioDisconnectNormalNode;

function scenarioDisconnectSelectionsNode(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].nodeType == 'group') {
      var selections = scenario[i].selections;
      for (var j = 0; j < selections.length; j++) {
        if (selections[j].next == id) {
          delete selections[j].next;
          delete selections[j].topLineId;
        }
      }
    }
  }
}
//module.exports.scenarioDisconnectSelectionsNode = scenarioDisconnectSelectionsNode;

// kooh-----------------------------
function scenarioDisconnectNormalNodeByIndex(scenario, i) {
  delete scenario[i].next;
  delete scenario[i].gui.topLineId;
}

function scenarioDisconnectSelectionsNodeByIndex(scenario, i, j) {  
  delete scenario[i].selections[j].next;
  delete scenario[i].selections[j].topLineId;
}
// -----------------------------


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
//module.exports.scenarioGetEventById = scenarioGetEventById;

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
//module.exports.scenarioGetNodeById = scenarioGetNodeById;

// Was: getNormalNodesFromScenarioByNext
function scenarioGetNodesThatConnectTo(scenario, id) {
  var nodes = [];
  for (var i = 0; i < scenario.length; i++) {
    if ((scenario[i].nodeType == 'single' || scenarioArray[i].nodeType=='point') && scenario[i].next == id) {
      nodes.push(scenario[i]);
    }
  }
  return nodes;
}
//module.exports.scenarioGetNodesThatConnectTo = scenarioGetNodesThatConnectTo;

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
//module.exports.scenarioGetSelectionsThatConnectTo = scenarioGetSelectionsThatConnectTo;

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
//module.exports.scenarioGetNormalNodeIndexesThatConnectTo = scenarioGetNormalNodeIndexesThatConnectTo;

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
//module.exports.scenarioGetSelectionIndexesThatConnectTo = scenarioGetSelectionIndexesThatConnectTo;

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
//module.exports.scenarioGetGoToEventsThatJumpTo = scenarioGetGoToEventsThatJumpTo;

function scenarioIsSingle(scenario, index) {
  return scenario[index].nodeType == 'single';
}

function scenarioIsGroup(scenario, index) {
  return scenario[index].nodeType == 'group';
}

function scenarioIsPoint(scenario, index) {
  return scenario[index].nodeType == 'point';
}

function scenarioIsNormal(scenario, index) {
  return scenario[index].type == 'normal';
}

function scenarioIsOpenQuestion(scenario, index) {
  return scenario[index].type == 'openquestion';
}

function scenarioIsGoTo(scenario, index) {
  return scenario[index].type == 'goto';
}

function scenarioIsGoToAnotherProject(scenario, index) {
  return scenario[index].type == 'gotoAnotherProject';
}



// scenarioHistories

const MAX_HISTORY = 10;
function scenarioHistoriesAddHistory(scenarioHistory, history) {
  if (scenarioHistory.length > MAX_HISTORY) {
    scenarioHistory.shift();
  }
  var historyObj = history.concat();
  scenarioHistory.push(historyObj);
}
//module.exports.scenarioHistoriesAddHistory = scenarioHistoriesAddHistory;

function scenarioHistoriesIncrementIndex(scenarioHistory, index) {
  return (index < scenarioHistory.length) ? index + 1 : index;
}
//module.exports.scenarioHistoriesIncrementIndex = scenarioHistoriesIncrementIndex;

function scenarioHistoriesDecrementIndex(scenarioHistory, index) {
  return (index > 0) ? index - 1 : index;
}
//module.exports.scenarioHistoriesDecrementIndex = scenarioHistoriesDecrementIndex;

function scenarioHistoriesIsHistoryAvailable(scenarioHistory, index) {
  return scenarioHistory(scenarioHistory.length - index) ? true : false;
}
//module.exports.scenarioHistoriesIsHistoryAvailable = scenarioHistoriesIsHistoryAvailable;

function scenarioHistoriesGetHistory(scenarioHistory, index) {
  return scenarioHistory[scenarioHistory.length - index];
}
//module.exports.scenarioHistoriesGetHistory = scenarioHistoriesGetHistory;



// Drawing

function scenarioDrawNodes(scenario, drawNode) {
  for (var i = 0; i < scenario.length; i++) {
    drawNode(scenario, i);
  }
}

function scenarioDrawLines(scenario, drawLine) {
  for (var i = 0; i < scenario.length; i++) {
    drawLine(scenario, i);
  }
}

function scenarioGetNodePosition(scenario, index) {
  return scenario[index].gui.position;
}

function scenarioGetTopLinePosition(scenario, index) {
  return scenario[index].gui.topLinePosition;
}

function scenarioGetTopLineId(scenario, index) {
  return scenario[index].gui.topLineId;
}

function scenarioGroupDrawLines(scenario, index, drawLine) {
  var selections = scenario[index].selections;
  for (var i = 0; i < selections.length; i++) {
    drawLine(selections, i);
  }
}

function scenarioSelectionGetTopLinePosition(selections, index) {
  return selections[index].topLinePosition;
}

function scenarioSelectionGetTopLineId(selections, index) {
  return selections[index].topLineId;
}



// export

function scenarioGetAllSelectionNode(scenario) {

  var nodes = [];
  for(var i=0; i<scenario.length; i++){
    if(scenario[i].type == 'selection'){
      nodes.push(scenario[i]);
    }
  }

  return nodes;

}

function scenarioGetAllSelections(scenario) {

  var allSelections = [];
  for(var i=0; i<scenario.length; i++){
    if(scenario[i].type == 'selection'){
      var selections = scenario[i].selections;
      for(var j=0; j<selections.length; j++){
        allSelections.push(selections[j]);
      }
    }
  }

  return selections;

}

function scenarioGetOpenQuestionNode(scenario) {

  var nodes = [];
  for(var i=0; i<scenario.length; i++){
    if(scenario[i].type == 'openquestion'){
      nodes.push(scenario[i]);
    }
  }

  return nodes;

}