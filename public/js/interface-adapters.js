// ノードを作成する
createNodeAsDom = function(tagName, content){

  // 最初の要素を入れ込む
  var itemWrapper = document.createElement('div');
  
  itemWrapper.classList.add(`wrap${tagName}`);
  itemWrapper.dataset.id = content.id;
  itemWrapper.id = content.id;
  itemWrapper.style.position = 'absolute';

  itemWrapper.addEventListener("mousedown", mdownOnNode, false);
  itemWrapper.addEventListener("touchstart", mdownOnNode, false);

  canvasNodes.appendChild(itemWrapper);

  riot.mount(itemWrapper, tagName, {content: content});
  riot.update();

  return itemWrapper;

}

// ノードを読み込む
var loadNode = function(x, y, content, tagName){
  var nodeAsDom = createNodeAsDom(tagName, content);
  nodeAsDom.style.left = `${x}px`;
  nodeAsDom.style.top = `${y}px`;
}

// ノードをcanvasに追加する
var addNode = function(x, y, content, tagName){ 
  var nodeAsDom = createNodeAsDom(tagName, content);
  nodeAsDom.style.left = `${x}px`;
  nodeAsDom.style.top = `${y - nodeAsDom.offsetHeight/2}px`;

  content.gui.position.x = x;
  content.gui.position.y = y - nodeAsDom.offsetHeight/2;

  // go-toの時のtargetEventは選択したノード自体になってしまうためgotoノード以外で行う。
  if(tagName!='item-goto-node' && tagName!='item-goto-another-project-node'){
    if(targetEvent.nodeType=='single' || targetEvent.nodeType=='point'){
      scenarioConnectFromSingleNode(targetEvent, content.id);
    }else if(targetEvent.nodeType=='group'){
      scenarioConnectFromGroupNode(targetEvent, content.id);
    }
    
    scenarioUpdateContent(scenarioArray, targetEvent.id, targetEvent);
  }

  // イベントをシナリオに追加
  scenarioAddContent(scenarioArray, content);
}


var addLine = function(arrowOrigin, arrowTo, id){
  var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  topLine.setAttribute('x1', arrowOrigin.x);
  topLine.setAttribute('y1', arrowOrigin.y);
  topLine.setAttribute('x2', arrowTo.x);
  topLine.setAttribute('y2', arrowTo.y);
  topLine.setAttribute('stroke', '#2196F3');
  topLine.setAttribute('id', id);

  canvasSvg.appendChild(topLine);

  return topLine;
}