// scenario
var module = {};

function scenarioGetContent(scenario, id) {
  for (var i = 0; i < scenario.length; i++) {
    if (scenario[i].id == id) {
      return scenario[i];
    }
  }
  return null;
}
//module.exports.scenarioGetContent = scenarioGetContent;

function scenarioAddContent(scenario, content) {
  scenario.push(content);
}


function scenarioConnectFromSingleNode(from, toId) {
  from.next = toId;
}


function scenarioConnectFromGroupNode(from, toId) {
  var selections = from.selections;
  for(var i=0; i<selections.length; i++){
    if(selections[i].id==targetSelectionEventId){
      selections[i].next = toId;
      break;
    }
  }
  from.selections = selections;
}


// TO DOあるidのnextを持つsingle nodeを取り出す


// TO DOあるidのnextを持つgroup nodeを取り出す



function scenarioUpdateContent(scenario, id, content) {
    for (var i = 0; i < scenario.length; i++) {
        if (scenario[i].id == id) {
            scenario[i] = content;
            break;  // Was missing in Ko-chan's code
        }
    }
}
//module.exports.scenarioUpdateContent = scenarioUpdateContent;

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

function scenarioDeleteNode(scenario, id) {
    for (var i = 0; i < scenario.length; i++) {
        if (scenario[i].id == id) {
            scenario.splice(i, 1);
            break;
        }
    }
}
//module.exports.scenarioDeleteNode = scenarioDeleteNode;

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