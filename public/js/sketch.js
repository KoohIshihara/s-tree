
var canvas, canvasNodes, canvasSvg;

var loadCanvas = function(firstEventId, letScrollToFirst){

  canvas = document.querySelector('module-canvas');
  canvasSvg = document.querySelector('#canvasSvg');
  canvasNodes = document.querySelector('#canvasNodes');
  
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  /*
  // nodeを追加
  var event;
  for(var i=0; i<scenarioArray.length; i++){
    
    event = scenarioArray[i];
    var pos = event.gui.position;

    if(scenarioIsSingle(scenarioArray, i)){
      if(scenarioIsNormal(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-message-node'); //addSimpleMessage(pos.x, pos.y, event, true);
      if(scenarioIsOpenQuestion(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-open-question-node'); //addOpenQuestion(pos.x, pos.y, event, true);
      if(scenarioIsGoTo(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-goto-node'); //addGoToNode(pos.x, pos.y, event, true);
      if(scenarioIsGoToAnotherProject(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-goto-another-project-node'); //addGoToAnotherProjectNode(pos.x, pos.y, event, true);
    }
    if(scenarioIsGroup(scenarioArray, i)){
      loadNode(pos.x, pos.y, event, 'item-selection-node'); //addSelections(pos.x, pos.y, event, true);
    }
    
    if(letScrollToFirst && firstEventId==scenarioGetId(scenarioArray, i)){
      // はじめのメッセージのところまでスクロール
      document.querySelector('module-canvas').scrollLeft = pos.x - 100;
      document.querySelector('module-canvas').scrollTop = pos.y - window.innerHeight/2;

      // firstのイベントにフォーカスさせる
      focusNode(scenarioGetContentByIndex(scenarioArray, i));
    }

  }
  */


  scenarioDrawNodes(scenarioArray, (scenarioArray, i) => {

    var event = scenarioGetContentByIndex(scenarioArray, i);
    var pos = event.gui.position;
  
    if(scenarioIsSingle(scenarioArray, i)){
      if(scenarioIsNormal(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-message-node'); //addSimpleMessage(pos.x, pos.y, event, true);
      if(scenarioIsOpenQuestion(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-open-question-node'); //addOpenQuestion(pos.x, pos.y, event, true);
      if(scenarioIsGoTo(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-goto-node'); //addGoToNode(pos.x, pos.y, event, true);
      if(scenarioIsGoToAnotherProject(scenarioArray, i)) loadNode(pos.x, pos.y, event, 'item-goto-another-project-node'); //addGoToAnotherProjectNode(pos.x, pos.y, event, true);
    }
    if(scenarioIsGroup(scenarioArray, i)){
      loadNode(pos.x, pos.y, event, 'item-selection-node'); //addSelections(pos.x, pos.y, event, true);
    }
    
    if(letScrollToFirst && firstEventId==scenarioGetId(scenarioArray, i)){
      // はじめのメッセージのところまでスクロール
      document.querySelector('module-canvas').scrollLeft = pos.x - 100;
      document.querySelector('module-canvas').scrollTop = pos.y - window.innerHeight/2;

      // firstのイベントにフォーカスさせる
      focusNode(scenarioGetContentByIndex(scenarioArray, i));
    }

  })


  // 全てのlineを追加（ノードの座標から始点と終点を計算して線を引く）
  scenarioDrawLines(scenarioArray, (scenarioArray, i) => {
    if(scenarioIsSingle(scenarioArray, i)) {

      if(scenarioGetNext(scenarioArray, i)){
        var node = document.getElementById(scenarioGetId(scenarioArray, i));
        var boundingRect = node.getBoundingClientRect();

        var pos = scenarioGetNodePosition(scenarioArray, i);

        var from = {
          x: pos.x + boundingRect.width + 10,
          y: pos.y + boundingRect.height/2,
        };

        var nextId = scenarioGetNext(scenarioArray, i);
        var nextEvent = scenarioGetContent(scenarioArray, nextId);
        var nextNode = document.getElementById(nextId);
        
        var nextPos = nextEvent.gui.position;

        if(nextNode){
          var nextBoundingRect = nextNode.getBoundingClientRect();
          var to = {
            x: nextPos.x,
            y: nextPos.y + nextBoundingRect.height/2,
          };

          var topLineId = scenarioGetTopLineId(scenarioArray, i);

          addLine(from, to, topLineId);
        }
      }

    }else if(scenarioIsGroup(scenarioArray, i)){

      scenarioGroupDrawLines(scenarioArray, i, (selections, j) => {

        var groupNodePos = scenarioGetNodePosition(scenarioArray, i);
        var groupNode = document.getElementById(scenarioGetId(scenarioArray, i));
        var groupNodeBoundingRect = groupNode.getBoundingClientRect();

        if(scenarioSelectionGetNext(selections, j)){
          
          var selectionId = scenarioSelectionGetId(selections, j);
          var node = document.getElementById(selectionId);
          var boundingRect = node.getBoundingClientRect();
          var relativePos = $(`#${selectionId}`).position();
          
          var from = {
            x: groupNodePos.x + groupNodeBoundingRect.width + 8,
            y: groupNodePos.y + relativePos.top + boundingRect.height/2,
          };

          var nextId = scenarioSelectionGetNext(selections, j);
          var nextEvent = scenarioGetContent(scenarioArray, nextId);
          var nextNode = document.getElementById(nextId);

          var nextBoundingRect = nextNode.getBoundingClientRect();
          var to = {
            x: nextEvent.gui.position.x,
            y: nextEvent.gui.position.y + nextBoundingRect.height/2,
          };

          var topLineId = scenarioSelectionGetTopLineId(selections, j);
          addLine(from, to, topLineId);
          
        } // scenarioGroupDrawLines

      }) // scenarioGroupDrawLines

    }else if(scenarioIsPoint(scenarioArray, i)){

      if(scenarioGetNext(scenarioArray, i)){
        var node = document.getElementById(scenarioGetNext(scenarioArray, i));
        var boundingRect = node.getBoundingClientRect();
        var from = {
          x: 100 + 14/2,
          y: 100000/2 + 14/2,
        };

        var nextId = scenarioGetNext(scenarioArray, i);
        var nextEvent = getEventFromScenarioById(nextId);
        var nextNode = document.getElementById(nextId);
        var nextBoundingRect = nextNode.getBoundingClientRect();
        var to = {
          x: nextEvent.gui.position.x,
          y: nextEvent.gui.position.y + nextBoundingRect.height/2,
        };

        var topLineId = scenarioGetTopLineId(scenarioArray, i);
        addLine(from, to, topLineId);
      }

    }
  }) // scenarioDrawLines


  // gotoのプレヴュー用のlineを追加
  var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  topLine.setAttribute('stroke', '#FF4081');
  topLine.setAttribute('id', 'lineForGoToPreview');

  canvasSvg.appendChild(topLine);

}

//-------------------------------------------------------------

var targetEvent;
var targetSelectionEventId

var x, y;
//マウスが押された際の関数
var mdownOnNode = function(e) {

  e.stopPropagation();
  
  //タッチデイベントとマウスのイベントの差異を吸収
  var event = (e.type == "mousedown") ? e : e.changedTouches[0];

  var targetId = $(e.target).parents('.node')[0].dataset.id;
  targetEvent = scenarioGetContent(scenarioArray, targetId);

  //クラス名に .drag を追加
  this.classList.add("drag");

  //要素内の相対座標を取得
  x = event.pageX - this.offsetLeft;
  y = event.pageY - this.offsetTop;

  //ムーブイベントにコールバック
  document.body.addEventListener("mousemove", mmoveOnNode, false);
  document.body.addEventListener("touchmove", mmoveOnNode, false);

  // マウスボタンが離されたとき、またはカーソルが外れたとき発火
  document.body.addEventListener("mouseup", mupOnNode, false);
  document.body.addEventListener("touchleave", mupOnNode, false);

}

//マウスカーソルが動いたときに発火
var mmoveOnNode = function(e) {

  e.stopPropagation();
  
  // タッチデイベントとマウスのイベントの差異を吸収
  var event = (e.type == "mousemove") ? e : e.changedTouches[0];

  //フリックしたときに画面を動かさないようにデフォルト動作を抑制
  e.preventDefault();
 
  //ドラッグしている要素を取得
  var drag = document.getElementsByClassName("drag")[0];
  var preLeft = drag.style.left;
  var preTop = drag.style.top;

  // マウスが動いた場所に要素を動かす
  drag.style.left = event.pageX - x + "px";
  drag.style.top = event.pageY - y + "px";

  scenarioUpdatePosition(scenarioArray, targetEvent.id, {
    x: event.pageX - x,
    y: event.pageY - y
  });

  scenarioUpdateContent(scenarioArray, targetEvent.id, targetEvent);

  var gapX = parseInt(drag.style.left) - parseInt(preLeft);
  var gapY = parseInt(drag.style.top) - parseInt(preTop);

  // 次のテンプレートにつないでいるlineの始点を修正
  var topLine = document.querySelector(`#${targetEvent.gui.topLineId}`); //targetEvent.gui.topLine;
  if(topLine){    
    topLine.setAttribute("x1", parseInt(topLine.getAttribute("x1")) + gapX);
    topLine.setAttribute("y1", parseInt(topLine.getAttribute("y1")) + gapY);
  }

  if(targetEvent.nodeType=='group'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].topLineId){
        if(selections[i].topLinePosition){
          selections[i].topLinePosition.origin.x += gapX;
          selections[i].topLinePosition.origin.y += gapY;
        }
        var selectionTopLine = document.querySelector(`#${selections[i].topLineId}`);
        selectionTopLine.setAttribute("x1", parseInt(selectionTopLine.getAttribute("x1")) + gapX);
        selectionTopLine.setAttribute("y1", parseInt(selectionTopLine.getAttribute("y1")) + gapY);
      }
    }
  }

  // 前のテンプレートからつながってるlineの終点を修正
  var preNormalNodes = scenarioGetNodesThatConnectTo(scenarioArray, targetEvent.id);
  for(var i=0; i<preNormalNodes.length; i++){
    var bLineId = preNormalNodes[i].gui.topLineId;
    var bLine = document.querySelector(`#${bLineId}`);
    bLine.setAttribute("x2", parseInt(bLine.getAttribute("x2")) + gapX);
    bLine.setAttribute("y2", parseInt(bLine.getAttribute("y2")) + gapY);
  }

  var preSelectionNodes = scenarioGetSelectionsThatConnectTo(scenarioArray, targetEvent.id);
  for(var i=0; i<preSelectionNodes.length; i++){
    var bLineId = preSelectionNodes[i].topLineId;
    var bLine = document.querySelector(`#${bLineId}`);
    bLine.setAttribute("x2", parseInt(bLine.getAttribute("x2")) + gapX);
    bLine.setAttribute("y2", parseInt(bLine.getAttribute("y2")) + gapY);
  }

  
  
}

//マウスボタンが上がったら発火
var mupOnNode = function(e) {

  e.stopPropagation();

  var drag = document.getElementsByClassName("drag")[0];

  if(drag){
    drag.removeEventListener("mouseup", mupOnNode, false);
    drag.removeEventListener("touchend", mupOnNode, false);
    //クラス名 .drag も消す
    drag.classList.remove("drag");

    saveScenarioAsSubcollection();
  }

  //ムーブベントハンドラの消去
  document.body.removeEventListener("mousemove", mmoveOnNode, false);
  document.body.removeEventListener("touchmove", mmoveOnNode, false);

}



//----------------------------------------------------------------------------------



// 扱っているlineの始点と終点
var arrowFrom = {};
var arrowTo = {};

// ドラック中かどうかを判定
var isDraging = false;

var mdownOnLineStart = function(e){
  e.stopPropagation();
  
  isDraging = true;

  // タッチデイベントとマウスのイベントの差異を吸収
  var event = (e.type == "mousedown") ? e : e.changedTouches[0];

  // 操作しているテンプレートに紐づくイベントを取得
  var targetId = $(e.target).parents('.node')[0].dataset.id;
  targetEvent = scenarioGetContent(scenarioArray, targetId);

  // イベントがgroupだった場合、グループの子ノードのidを取得する
  if(targetEvent.nodeType=='group') targetSelectionEventId = e.target.dataset.selectionid;

  // lineの始点を取得
  var button = event.target.getBoundingClientRect();

  var radiusOfButton = 8;
  var buttonOffset = radiusOfButton/2;
  arrowFrom.x = button.left + buttonOffset + canvas.scrollLeft;
  arrowFrom.y = button.top + buttonOffset + canvas.scrollTop-48;


  // 始点がNodeに接続されていないlineがあったら削除してポップがでてたらそれも消す
  var unConnectedLine = document.querySelector('.unconnected-line');
  if(unConnectedLine){
    unConnectedLine.parentNode.removeChild(unConnectedLine);
    var pop = document.querySelector('wrap-pop-after-drag');
    pop.classList.remove('show-pop');

    var nodeId = unConnectedLine.id.split('-')[1];
    var node = scenarioGetContent(scenarioArray, nodeId);
    delete node.topLineId;
    delete node.topLinePosition;
  }


  document.body.addEventListener("mousemove", moveOnLineStart, false);
  document.body.addEventListener("touchmove", moveOnLineStart, false);
}

var moveOnLineStart = function(e){
  
  // タッチデイベントとマウスのイベントの差異を吸収
  var event = (e.type == "mousemove") ? e : e.changedTouches[0];

  // lineの終点の取得
  var headerHeight = 48;
  arrowTo.x = e.pageX + canvas.scrollLeft;
  arrowTo.y = e.pageY + canvas.scrollTop - headerHeight;

  // プレヴュー用のlineを表示
  var lineForPreview = document.querySelector('#lineForPreview');
  lineForPreview.classList.add('show');
  lineForPreview.setAttribute('x1', arrowFrom.x);
  lineForPreview.setAttribute('y1', arrowFrom.y);
  lineForPreview.setAttribute('x2', arrowTo.x);
  lineForPreview.setAttribute('y2', arrowTo.y);
  lineForPreview.setAttribute('stroke', '#1976d2');


  document.body.addEventListener("mouseup", upOnLineStart, false);
  document.body.addEventListener("touchleave", upOnLineStart, false);
}

var upOnLineStart = function(e){

  isDraging = false;

  // プレヴュー用のlineを非表示
  var lineForPreview = document.querySelector('#lineForPreview');
  lineForPreview.classList.remove('show');

  // 次のテンプレートにつなぐlineを追加
  var topLine = addLine(arrowFrom, arrowTo, targetEvent.id);
  topLine.classList.add('unconnected-line');


  if(targetEvent.nodeType=='single' || targetEvent.nodeType=='point'){
    // 前に描画したtoplineがあるなら削除
    var preTopLine = document.querySelector(`#${targetEvent.gui.topLineId}`);
    if(preTopLine) preTopLine.parentNode.removeChild(preTopLine);

    topLine.setAttribute('id', 'line-'+targetEvent.id);
    
    targetEvent.topLineId = 'line-'+targetEvent.id;
    targetEvent.gui.topLineId = 'line-'+targetEvent.id;

  }else if(targetEvent.nodeType=='group'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(targetSelectionEventId==selections[i].id){
        // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
        var preTopLine = document.querySelector(`#${selections[i].topLineId}`);
        if(preTopLine) preTopLine.parentNode.removeChild(preTopLine);

        topLine.setAttribute('id', 'line-'+targetSelectionEventId);
        selections[i].topLineId = 'line-'+targetSelectionEventId;
      }
    } // for()
  }

  scenarioUpdateContent(scenarioArray, targetEvent.id, targetEvent);


  // ドラッグしているマウスがtemplateの上ならそのテンプレートとイベントをつなげる
  if(isOverTemplate){
    // topLineの終点をマウスオーバーしているテンプレートの座標に修正
    var elemX = parseInt(overTemplateElm.style.left);
    var elemY = parseInt(overTemplateElm.style.top);
    var offsetY = overTemplateElm.offsetHeight/2;
    topLine.setAttribute('x2', elemX);
    topLine.setAttribute('y2', elemY + offsetY);

    // nextイベントをマウスオーバーしているテンプレートのイベントに紐付け
    if(targetEvent.nodeType=='single' || targetEvent.nodeType=='point'){

      scenarioConnectFromSingleNode(targetEvent, idOfOverTemplate);
      //targetEvent.topLineId = `line-${targetEvent.id}`;

    }else if(targetEvent.nodeType=='group'){

      scenarioConnectFromGroupNode(targetEvent, idOfOverTemplate);

      for(var i=0; i<targetEvent.selections.length; i++){
        if(targetEvent.selections[i].id==targetSelectionEventId){
          targetEvent.selections[i].next = idOfOverTemplate;
          //targetEvent.selections[i].topLineId = `line-${selections[i].id}`;
        }
      }

    }

    saveScenarioAsSubcollection();

  }else{
    // 終点にポップを出す
    riot.mount('wrap-pop-after-drag', 'item-pop-after-drag');
    riot.update();

    var pop = document.querySelector('wrap-pop-after-drag');
    pop.classList.add('show-pop');

    var popOffset = pop.offsetHeight/2; //= 66.5/2;
    pop.style.left = `${arrowTo.x}px`;
    pop.style.top = `${arrowTo.y - popOffset}px`;
  }

  document.body.removeEventListener("mousemove", moveOnLineStart, false);
  document.body.removeEventListener("mouseup", upOnLineStart, false);
  document.body.removeEventListener("touchmove", upOnLineStart, false);
}



//--------------------------------------------------------------------------------------



var underChoiceOfGoTo = false;
var goToFrom, goToFromId; // goToNodeを作ろうとした時の派生元のノードのイベントを一時保存しておく変数

var clickOnNode = function(e){

  var targetId = $(e.target).parents('.node')[0].dataset.id;
  targetEvent = getEventFromScenarioById(targetId);
  
  // ノードにフォーカスする
  focusNode(targetEvent);

  // Go toの先を選択する場合
  if(underChoiceOfGoTo){

    underChoiceOfGoTo = false;

    var goToContent = {
      author: session.user.uid,
      id: `goToTmp${riot.currentProject.nodeNum}`,
      toId: targetEvent.id,
      num: riot.currentProject.nodeNum,//scenarioArray.length,
      type: 'goto',
      nodeType: 'single',
      text: targetEvent.num,
      gui: {
        position: {},
      },
    };

    var preNode = getNodeFromScenarioById(goToFromId);
    preNode.next = `goToTmp${riot.currentProject.nodeNum}`;

    //addGoToNode(arrowTo.x, arrowTo.y, goToContent, false);
    addNode(arrowTo.x, arrowTo.y, goToContent, 'item-goto-node');

    riot.currentProject.nodeNum++;

    //saveScenario();
    saveScenarioAsSubcollection(goToContent);
 
    // ポップを消去
    var pop = document.querySelector('wrap-pop-after-drag');
    pop.classList.remove('show-pop');


    // オーバーレイを閉じてもとのz-indexにもどす
    $('#canvasOverlay').fadeOut(400);
    var canvasNodes = document.getElementById('canvasNodes');
    canvasNodes.classList.remove('add-node-z');

  }

  underSelectionOfGoTo = false;

}

var currentFocusedEvent;
var focusNode = function(focusedEvent){

  currentFocusedEvent = focusedEvent;

  $('.focused-node').removeClass('focused-node');
  var node = document.getElementById(focusedEvent.id);
  if(node) node.classList.add('focused-node');

  // Go Toのプレヴュー用のラインを削除
  var lineForGoToPreview = document.getElementById('lineForGoToPreview');
  if(lineForGoToPreview) lineForGoToPreview.classList.remove('show');

  switch(focusedEvent.type){
    case 'goto':
      var toId = focusedEvent.toId;
      var toEvent = getEventFromScenarioById(toId);

      var toNode = document.getElementById(toEvent.id);
      if(toNode) toNode.classList.add('focused-node');

      // Go Toがどこにつながっているかをプレヴュー
      var fromNode = document.getElementById(focusedEvent.id);
      
      var x1 = parseInt(fromNode.style.left);
      var y1 = parseInt(fromNode.style.top) + fromNode.offsetHeight/2;
      var x2 = parseInt(toNode.style.left) + toNode.offsetWidth;///2;
      var y2 = parseInt(toNode.style.top) + toNode.offsetHeight/2;

      if(lineForGoToPreview){
        lineForGoToPreview.classList.add('show');
        lineForGoToPreview.setAttribute('x1', x1);
        lineForGoToPreview.setAttribute('y1', y1);
        lineForGoToPreview.setAttribute('x2', x2);
        lineForGoToPreview.setAttribute('y2', y2);
        lineForGoToPreview.id = 'lineForGoToPreview';
      }

    break;
  }

}



