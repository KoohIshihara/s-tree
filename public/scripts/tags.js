
riot.tag2('app', '<header> <util-header></util-header> </header> <div class="wrap-content"> <content></content> <modal-content></modal-content> <up-modal-content></up-modal-content> </div> <util-now-loading id="loading"></util-now-loading> <util-now-loading id="loadingForModal"></util-now-loading> <util-modal></util-modal>', 'app,[data-is="app"]{display:block;width:100%;height:100vh;overflow:hidden;background:#fff} app .full-height,[data-is="app"] .full-height{height:100% !important;top:0 !important} app .wrap-content,[data-is="app"] .wrap-content{position:relative;display:block;width:100%;height:100%;height:calc(100% - 48px);top:48px;overflow:hidden} app .wrap-content content,[data-is="app"] .wrap-content content{display:block;position:absolute;z-index:1;width:100%;height:100%;overflow-y:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;top:0;left:0;background:#fff;transition:all .4s;opacity:0} app .wrap-content .not-opacity,[data-is="app"] .wrap-content .not-opacity{opacity:1} app .wrap-content modal-content,[data-is="app"] .wrap-content modal-content{display:block;position:absolute;z-index:5;width:100%;height:100%;overflow-y:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;top:0;background:#fff;transition:all .4s;opacity:0;left:100%} app .wrap-content up-modal-content,[data-is="app"] .wrap-content up-modal-content{display:block;position:absolute;z-index:4;width:100%;height:100%;overflow-y:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;left:0;background:#fff;transition:all .4s;opacity:0;top:100%} app .wrap-content .show,[data-is="app"] .wrap-content .show{opacity:1;top:0;left:0} app #wrapSaving,[data-is="app"] #wrapSaving{display:none;position:fixed;top:24px;right:32px;z-index:300}', '', function(opts) {
    var self = this;

    this.contents = {
      test: {
        title: 'title',
        body: 'body',
        label: 'link label',
      },
    };

    this.afterAuth = function(user){
      console.log('after');
      mixpanel.identify(user.uid);
      mixpanel.register({
        userId: user.uid,
        name: user.name
      });
      mixpanel.people.set({
        "$email": user.email,
        "$last_login": new Date(),
        userId: user.uid,
        name: user.name
      });
    }

    riot.loadAppTimer = setInterval(function(){
      if(session.user){
        clearInterval(riot.loadAppTimer);
        self.afterAuth(session.user);
      }
    }, 800);
});

riot.tag2('atom-add-selection', '<div class="wrap-atom f fh py8"> <p class="label pl7 pr8" onclick="{addSelection}">＋ Add Selection</p> </div>', 'atom-add-selection,[data-is="atom-add-selection"]{display:block;cursor:pointer} atom-add-selection .wrap-atom .label,[data-is="atom-add-selection"] .wrap-atom .label{width:100%;font-weight:300;color:#2196F3;font-size:14px;letter-spacing:.6px}', '', function(opts) {
    var self = this;
    this.content = this.opts.content;

    this.addSelection = function(){

      var node = self.root;
      var parentGroup = $(node).parents('.node')[0];

      var preWidth = parentGroup.offsetWidth;
      var preHeight = parentGroup.offsetHeight;

      scenarioIncrementSelectionCounter(scenarioArray, self.content.id);
      var contentToAdd = {
        label: 'Selection',
        id: `selectionTmp${self.content.num}-selection${self.content.addedSelectionsCounter}`,
      };
      scenarioAddSelectionToSelectionNode(scenarioArray, self.content.id, contentToAdd)
      riot.update();

      var addedSelection = document.getElementById(contentToAdd.id);
      var textarea = addedSelection.getElementsByClassName('selection-textarea')[0];
      textarea.focus();
      textarea.select();

      var gapX = parentGroup.offsetWidth - preWidth;
      var gapY = parentGroup.offsetHeight - preHeight;

      var content = scenarioGetContent(scenarioArray, parentGroup.id);
      var preNodePosY = content.gui.position.y;
      content.gui.position.y = preNodePosY - gapY/2;
      parentGroup.style.top = content.gui.position.y + 'px';

      var selections = content.selections;
      for(var i=0; i<selections.length; i++){
        if(selections[i].next){

          var id = scenarioSelectionGetId(selections, i);
          var topLine = document.getElementById(`line-${id}`);

          var selectionNode = document.getElementById(id);

          var dragButton = selectionNode.children[2];
          var absoluteTop = dragButton.getBoundingClientRect().top;

          var y = absoluteTop + 16 + canvas.scrollTop - 48;

          if(topLine) topLine.setAttribute('y1', y);
        }

        if(self.id==id) self.selectionIndex = i;
      }

    }
});

riot.tag2('atom-delete-node', '<div class="wrap-atom f fh" onclick="{deleteNode.bind(this, opts.id)}"> <p>Delete</p> </div>', 'atom-delete-node .wrap-atom p,[data-is="atom-delete-node"] .wrap-atom p{font-size:12px;font-weight:500;color:#FF5252;border-bottom:solid #FF5252 .5px}', '', function(opts) {
    var self = this;
    this.id = opts.id;
    this.deleteNode = function(id, e) {

      mixpanel.track('node was deleted');

      if(e){
        e.preventDefault();
        e.stopPropagation();
      }

      var preIndexesOfNomalNodes = scenarioGetNormalNodeIndexesThatConnectTo(scenarioArray, id);
      for(var i=0; i<preIndexesOfNomalNodes.length; i++){
        var index = preIndexesOfNomalNodes[i];

        var lineName = `line-${scenarioArray[index.scenarioIndex].id}`;
        var line = document.getElementById(lineName);
        if(line) line.parentNode.removeChild(line);

        scenarioDisconnectNormalNodeByIndex(scenarioArray, index.scenarioIndex);

      }

      var preIndexesOfSelectionNodes = scenarioGetSelectionIndexesThatConnectTo(scenarioArray, id);
      for(var i=0; i<preIndexesOfSelectionNodes.length; i++){
        var index = preIndexesOfSelectionNodes[i];

        var lineName = `line-${scenarioArray[index.scenarioIndex].selections[index.selectionIndex].id}`;
        var line = document.getElementById(lineName);
        if(line) line.parentNode.removeChild(line);

        scenarioDisconnectSelectionsNodeByIndex(scenarioArray, index.scenarioIndex, index.selectionIndex);

      }

      var selfNode = scenarioGetEventById(scenarioArray, id);

      if(selfNode.nodeType=='single'){

        var lineName = `line-${selfNode.id}`;
        var line = document.getElementById(lineName);
        if(line) line.parentNode.removeChild(line);

      }else if(selfNode.nodeType=='group'){

        var selections = selfNode.selections;
        for(var i=0; i<selections.length; i++){
          var lineName = `line-${selections[i].id}`;
          var line = document.getElementById(lineName);
          if(line) line.parentNode.removeChild(line);
        }

      }

      var node = document.getElementById(id);
      node.parentNode.removeChild(node);

      scenarioDeleteNode(scenarioArray, id);

      var gotoEvents = scenarioGetGoToEventsThatJumpTo(scenarioArray, id);;
      for(var i=0; i<gotoEvents.length; i++){
        this.deleteNode(gotoEvents[i].id);
      }

      var lineForGoToPreview = document.getElementById('lineForGoToPreview');
      if(lineForGoToPreview) lineForGoToPreview.classList.remove('show');

    }
});

riot.tag2('atom-float-action-preview', '<div class="wrap-atom f fh"><img src="./img/icon/preview.svg"></div>', 'atom-float-action-preview,[data-is="atom-float-action-preview"]{display:block;position:fixed;z-index:12;right:16px;bottom:16px;width:48px;height:48px;background:#2196F3;border-radius:50%;filter:drop-shadow(2px 1px 1px rgba(0,0,0,0.2));cursor:pointer} atom-float-action-preview .wrap-atom,[data-is="atom-float-action-preview"] .wrap-atom{width:100%;height:100%} atom-float-action-preview .wrap-atom img,[data-is="atom-float-action-preview"] .wrap-atom img{width:26px}', 'onclick="{togglePreview}"', function(opts) {
    var self = this;
    this.scenarioId = opts.id;

    this.isFirstOpen = true;

    this.togglePreview = function(){
      $('atom-float-action-preview').fadeOut(200);
      $('.wrap-conversation-preview').fadeIn(200);

      if(self.isFirstOpen){
        riot.mount('wrapper-module-conversation', 'module-conversation', {
          id: self.scenarioId
        });
        riot.update();
        self.isFirstOpen = false;
      }
    }

    this.on('mount', function(){

    });
});

riot.tag2('atom-now-loading-icon', '<div class="lds-ellipsis"> <div></div> <div></div> <div></div> <div></div> </div>', 'atom-now-loading-icon .lds-ellipsis,[data-is="atom-now-loading-icon"] .lds-ellipsis{display:inline-block;position:relative;width:64px;height:64px} atom-now-loading-icon .lds-ellipsis div,[data-is="atom-now-loading-icon"] .lds-ellipsis div{position:absolute;top:27px;width:11px;height:11px;border-radius:50%;background:#2a2a2a;animation-timing-function:cubic-bezier(0, 1, 1, 0)} atom-now-loading-icon .lds-ellipsis div:nth-child(1),[data-is="atom-now-loading-icon"] .lds-ellipsis div:nth-child(1){left:6px;animation:lds-ellipsis1 .6s infinite} atom-now-loading-icon .lds-ellipsis div:nth-child(2),[data-is="atom-now-loading-icon"] .lds-ellipsis div:nth-child(2){left:6px;animation:lds-ellipsis2 .6s infinite} atom-now-loading-icon .lds-ellipsis div:nth-child(3),[data-is="atom-now-loading-icon"] .lds-ellipsis div:nth-child(3){left:26px;animation:lds-ellipsis2 .6s infinite} atom-now-loading-icon .lds-ellipsis div:nth-child(4),[data-is="atom-now-loading-icon"] .lds-ellipsis div:nth-child(4){left:45px;animation:lds-ellipsis3 .6s infinite}@keyframes lds-ellipsis1{ 0%{transform:scale(0)} 100%{transform:scale(1)}}@keyframes lds-ellipsis3{ 0%{transform:scale(1)} 100%{transform:scale(0)}}@keyframes lds-ellipsis2{ 0%{transform:translate(0, 0)} 100%{transform:translate(19px, 0)}} atom-now-loading-icon p,[data-is="atom-now-loading-icon"] p{text-align:center}', '', function(opts) {
});

riot.tag2('atom-open-question-answer', '<div class="wrap-text f fm flex-between mt6 mb8"> <textarea class="textarea px8" onkeyup="{updateText.bind(e, this)}">{expectedAnswer}</textarea> <p class="hidden-label px8">{expectedAnswer}</p> </div>', 'atom-open-question-answer,[data-is="atom-open-question-answer"]{display:block;width:100%} atom-open-question-answer .wrap-text,[data-is="atom-open-question-answer"] .wrap-text{position:relative} atom-open-question-answer .wrap-text .textarea,[data-is="atom-open-question-answer"] .wrap-text .textarea{font-size:14px;width:100%;color:#999;letter-spacing:.6px;font-weight:100;outline:none;resize:none;min-height:16px} atom-open-question-answer .wrap-text .hidden-label,[data-is="atom-open-question-answer"] .wrap-text .hidden-label{display:inline-block;width:100%;color:#999;letter-spacing:.6px;font-weight:100;font-size:14px;position:absolute;left:0;top:0;word-break:break-all;pointer-events:none;visibility:hidden}', '', function(opts) {
    var self = this;

    this.expectedAnswer = opts.expected;
    this.id = opts.id;

    this.down = mdownOnLineStart;

    this.on('mount', function(){

      var textarea = self.root.getElementsByClassName('textarea')[0];
      var hiddenText = self.root.getElementsByClassName('hidden-label')[0];
      hiddenText.innerHTML = textarea.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      textarea.style.width = `${w}px`;
      textarea.style.height = `${h}px`;

    });

    this.updateText = function(self, e){

      var textarea = self.root.getElementsByClassName('textarea')[0];

      if(e.keyCode==13){
        var text = textarea.value;
        text = text.replace(/\r?\n/g, '');
        textarea.value = text;
      }

      var node = self.root;
      var parentGroup = $(node).parents('.node')[0];

      var preWidth = parentGroup.offsetWidth;
      var preHeight = parentGroup.offsetHeight;

      var hiddenText = node.getElementsByClassName('hidden-label')[0];
      hiddenText.innerHTML = e.target.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      e.target.style.width = `${w}px`;
      e.target.style.height = `${h}px`;

      var gapX = parentGroup.offsetWidth - preWidth;
      var gapY = parentGroup.offsetHeight - preHeight;

      var content = getEventFromScenarioById(parentGroup.id);
      var preNodePosY = content.gui.position.y;
      content.gui.position.y = preNodePosY - gapY/2;
      parentGroup.style.top = content.gui.position.y + 'px';

      content.expectedAnswer = textarea.value;

      clearTimeout(self.saveTimer);
      self.saveTimer = setTimeout(function(){
        saveScenarioAsSubcollection();
      }, 800);

    }
});

riot.tag2('atom-selection', '<textarea class="selection-textarea px8" onkeyup="{updateSelectionText.bind(e, this)}">{label}</textarea> <p class="hidden-label px8">{label}</p> <div class="wrap-drag-button f fm"> <div class="drag-button" onmousedown="{down}" data-selectionid="{id}"></div> </div>', 'atom-selection,[data-is="atom-selection"]{position:relative;border-bottom:solid .6px rgba(0,0,0,0.2);background:rgba(0,0,0,0)} atom-selection .selection-textarea,[data-is="atom-selection"] .selection-textarea{font-size:14px;width:100%;color:#2a2a2a;letter-spacing:.6px;font-weight:bold;outline:none;resize:none;min-height:16px} atom-selection .hidden-label,[data-is="atom-selection"] .hidden-label{display:inline-block;width:100%;color:#2a2a2a;letter-spacing:.6px;font-weight:bold;font-size:14px;position:absolute;left:0;top:0;word-break:break-all;pointer-events:none;visibility:hidden} atom-selection .wrap-drag-button,[data-is="atom-selection"] .wrap-drag-button{position:absolute;cursor:pointer;top:0;left:calc(100% + 6px);z-index:10;height:100%} atom-selection .wrap-drag-button .drag-button,[data-is="atom-selection"] .wrap-drag-button .drag-button{cursor:pointer;background:#2196F3;width:8px;height:8px;border-radius:50%}', 'class="wrap-atom wrap-text f fm flex-between py8" id="{id}"', function(opts) {
    var self = this;

    this.id = opts.selection.id;
    this.label = opts.selection.label;

    this.down = mdownOnLineStart;

    this.on('mount', function(){

      var selectionTextarea = self.root.getElementsByClassName('selection-textarea')[0];
      var hiddenText = self.root.getElementsByClassName('hidden-label')[0];
      hiddenText.innerHTML = selectionTextarea.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      selectionTextarea.style.width = `${w}px`;
      selectionTextarea.style.height = `${h}px`;

    });

    self.letDeleteSelf = false;
    this.updateSelectionText = function(self, e){

      var textarea = self.root.getElementsByClassName('selection-textarea')[0];

      if(e.keyCode==13){
        var text = textarea.value;
        text = text.replace(/\r?\n/g, '');
        textarea.value = text;
      }

      if(e.keyCode==8 && textarea.value==''){

        if(self.letDeleteSelf){

          var groupId = self.id.split('-')[0];
          var parentContent = scenarioGetContent(scenarioArray, groupId);

          scenarioDeleteSelection(parentContent.selections, self.id);

          var parentGroup = document.getElementById(groupId);

          var preWidth = parentGroup.offsetWidth;
          var preHeight = parentGroup.offsetHeight;

          self.root.parentNode.removeChild(self.root);

          var line = document.getElementById(`line-${self.id}`);
          if(line) line.parentNode.removeChild(line);

          var gapX = parentGroup.offsetWidth - preWidth;
          var gapY = parentGroup.offsetHeight - preHeight;

          var preNodePosY = parentContent.gui.position.y;

          scenarioUpdatePosition(scenarioArray, targetEvent.id, {
            x: parentContent.gui.position.x,
            y: preNodePosY - gapY/2
          });
          parentGroup.style.top = `${parentContent.gui.position.y}px`;

          var selections = parentContent.selections;
          for(var i=0; i<selections.length; i++){
            if(selections[i].next){
              var topLineId = selections[i].topLineId;
              var topLine = document.getElementById(topLineId);

              var relativePos = $(`#${selections[i].id}`).position();

              var nodeOfSelection = document.getElementById(selections[i].id);
              var boundingRect = nodeOfSelection.getBoundingClientRect();

              var y = parentContent.gui.position.y + relativePos.top + boundingRect.height/2;

              topLine.setAttribute('y1', y);
            }

            if(self.id==selections[i].id) self.selectionIndex = i;
          }

          var preSelection = parentContent.selections[parentContent.selections.length-1];
          if(preSelection){
            var preNode = document.getElementById(preSelection.id);
            preNode.firstChild.focus();
          }

          return;
        }
        self.letDeleteSelf = true;
      }

      var node = self.root;
      var parentGroup = $(node).parents('.node')[0];

      var preWidth = parentGroup.offsetWidth;
      var preHeight = parentGroup.offsetHeight;

      var hiddenText = node.getElementsByClassName('hidden-label')[0];
      hiddenText.innerHTML = e.target.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      e.target.style.width = `${w}px`;
      e.target.style.height = `${h}px`;

      var gapX = parentGroup.offsetWidth - preWidth;
      var gapY = parentGroup.offsetHeight - preHeight;

      var content = scenarioGetContent(scenarioArray, parentGroup.id);
      var preNodePosY = content.gui.position.y;

      scenarioUpdatePosition(scenarioArray, targetEvent.id, {
        x: targetEvent.gui.position.x,
        y: preNodePosY - gapY/2
      });
      parentGroup.style.top = content.gui.position.y + 'px';

      var selections = content.selections;
      for(var i=0; i<selections.length; i++){
        if(selections[i].next){
          var topLineId = selections[i].topLineId;
          var topLine = document.getElementById(topLineId);

          var groupId = parentGroup.id;
          var groupEvent = getEventFromScenarioById(groupId);

          var selection = selections[i];
          var relativePos = $(`#${selection.id}`).position();

          var nodeOfSelection = document.getElementById(selection.id);
          var boundingRect = nodeOfSelection.getBoundingClientRect();

          var y = groupEvent.gui.position.y + relativePos.top + boundingRect.height/2;

          if(topLine) topLine.setAttribute('y1', y);
        }

        if(self.id==selections[i].id) self.selectionIndex = i;
      }

      content.selections[self.selectionIndex].label = e.target.value;
      scenarioUpdateContent(scenarioArray, content.id, content);

      clearTimeout(self.saveTimer);
      self.saveTimer = setTimeout(function(){
        saveScenarioAsSubcollection(self.content);
      }, 800);

    }
});

riot.tag2('item-bubble-message', '<div class="wrap-item f mt12 mb12 node-focused"> <div class="wrap-user-icon"><img riot-src="{userIcon}"></div> <div class="wrap-bubble"> <p class="px10 py8">{messageText}</p> </div> </div>', 'item-bubble-message,[data-is="item-bubble-message"]{transform:translateY(24px);opacity:0;transition:all 400ms ease} item-bubble-message .wrap-item .wrap-user-icon,[data-is="item-bubble-message"] .wrap-item .wrap-user-icon{width:24px;height:24px;overflow:hidden;border-radius:50%;margin-right:10px} item-bubble-message .wrap-item .wrap-user-icon img,[data-is="item-bubble-message"] .wrap-item .wrap-user-icon img{height:100%;object-fit:cover} item-bubble-message .wrap-item .wrap-bubble,[data-is="item-bubble-message"] .wrap-item .wrap-bubble{max-width:70%} item-bubble-message .wrap-item .wrap-bubble p,[data-is="item-bubble-message"] .wrap-item .wrap-bubble p{font-weight:lighter;background:#f0f0f0;border-radius:3px;font-size:14px;word-break:break-all} item-bubble-message .is-mine,[data-is="item-bubble-message"] .is-mine{flex-direction:row-reverse} item-bubble-message .is-mine .wrap-user-icon,[data-is="item-bubble-message"] .is-mine .wrap-user-icon{display:none} item-bubble-message .is-mine .wrap-bubble p,[data-is="item-bubble-message"] .is-mine .wrap-bubble p{background:#2196F3;color:#FFF} item-bubble-message.active,[data-is="item-bubble-message"].active{transform:translateY(0) !important;opacity:1 !important}', '', function(opts) {
    var self = this;

    this.content = opts.__proto__.content;
    this.isMine = opts.__proto__.isMine;

    var photoUrl = currentProjectForConversation.userIcon;
    this.userIcon = `${photoUrl}?width=280&amp;height=280`;
    this.messageText = this.content.text;

    this.on('mount', function(){
      if(self.isMine) self.root.children[0].classList.add('is-mine');
    });

    this.on('updated', function(){
      this.root.classList.add('active');

      var wrapMessages = document.getElementById('wrapMessages');
      wrapMessages.scrollTop = wrapMessages.scrollHeight;
    });
});

riot.tag2('item-conversation-input-message', '<div class="wrap-item f fm flex-between px8"> <textarea class="pt2 pb3 px5 mr8" placeholder="Message" id="conversationMessageInput"></textarea> <div class="wrap-send f fh"><img src="./img/icon/send.svg" onclick="{send}" id="conversationSendIcon"></div> </div>', 'item-conversation-input-message,[data-is="item-conversation-input-message"]{width:100%} item-conversation-input-message .wrap-item,[data-is="item-conversation-input-message"] .wrap-item{width:100%;height:36px;border-top:solid rgba(0,0,0,0.4) .5px} item-conversation-input-message .wrap-item textarea,[data-is="item-conversation-input-message"] .wrap-item textarea{border:solid rgba(0,0,0,0.4) .5px;border-radius:3px;width:100%;height:24px;outline:none;resize:none;font-size:14px} item-conversation-input-message .wrap-item .wrap-send,[data-is="item-conversation-input-message"] .wrap-item .wrap-send{height:100%} item-conversation-input-message .wrap-item .wrap-send img,[data-is="item-conversation-input-message"] .wrap-item .wrap-send img{cursor:pointer;width:20px}', '', function(opts) {
    var self = this;

    this.send = function(e){
      var textarea = document.getElementById('conversationMessageInput');
      var text = textarea.value;

      if(text=='') return;

      var isMine = true;
      addMessageToConversationByEvent({
        text: text,
      }, isMine);
      textarea.value = '';

      var next = e.target.dataset.next;
      if(next){
        fireEventOfConversation(next);
        e.target.removeAttribute('data-next');
      }
    }
});

riot.tag2('item-conversation-input-selection', '<div class="wrap-item px8 my6 f flex-wrap"> <div class="wrap-selection-bubble mr6 mb6" each="{item in selections}"> <p class="selection-bubble px12 py8 f fh" data-next="{item.next}" onclick="{clickBubble}">{item.label}</p> </div> </div>', 'item-conversation-input-selection,[data-is="item-conversation-input-selection"]{width:100%} item-conversation-input-selection .wrap-item,[data-is="item-conversation-input-selection"] .wrap-item{width:100%;max-height:120px;overflow:scroll;transition:all 400ms ease} item-conversation-input-selection .wrap-item .wrap-selection-bubble,[data-is="item-conversation-input-selection"] .wrap-item .wrap-selection-bubble{display:none} item-conversation-input-selection .wrap-item .wrap-selection-bubble .selection-bubble,[data-is="item-conversation-input-selection"] .wrap-item .wrap-selection-bubble .selection-bubble{background:#2196F3;color:#fff;border-radius:12px;font-weight:lighter;font-size:14px;letter-spacing:.4px;cursor:pointer}', '', function(opts) {
    var self = this;

    this.content = opts.__proto__.content;
    this.selections = this.content.selections;

    this.clickBubble = function(e){

      $('.wrap-selection-bubble').slideToggle(400, resizeWrapMessages);

      var next = e.target.dataset.next;
      var isMine = true;
      addMessageToConversationByEvent({
        text: e.target.innerText,
      }, isMine);
      fireEventOfConversation(next);
    }
});

riot.tag2('item-goto-another-project-node', '<div class="wrap-node"> <div class="wrap-node-content"> <p class="text line-clamp-1 px8 pt8 pb7">{text}</p> </div> </div> <div class="wrap-num"> <p>{num}</p> </div> <div class="wrap-icon f fh"> <atom-delete-node id="{id}"></atom-delete-node> </div>', 'item-goto-another-project-node,[data-is="item-goto-another-project-node"]{position:absolute;display:inline-block;transition:transform .2s;cursor:grab} item-goto-another-project-node .wrap-node,[data-is="item-goto-another-project-node"] .wrap-node{border:solid #2196F3 .5px;background:#2196F3;border-radius:3px;overflow:hidden;transform:scale(1)} item-goto-another-project-node .wrap-node .wrap-node-content,[data-is="item-goto-another-project-node"] .wrap-node .wrap-node-content{position:relative;overflow:visible} item-goto-another-project-node .wrap-node .wrap-node-content p,[data-is="item-goto-another-project-node"] .wrap-node .wrap-node-content p{display:block;color:#fff;letter-spacing:.6px;font-weight:300;width:100%;max-width:180px} item-goto-another-project-node.drag,[data-is="item-goto-another-project-node"].drag{cursor:grabbing !important} item-goto-another-project-node.active-over,[data-is="item-goto-another-project-node"].active-over{transform:scale(1.05) !important} item-goto-another-project-node.focused-node .wrap-node,[data-is="item-goto-another-project-node"].focused-node .wrap-node{border:solid #FF4081 2px !important;box-shadow:1px 1px 4px rgba(0,0,0,0.4)} item-goto-another-project-node .wrap-num,[data-is="item-goto-another-project-node"] .wrap-num{position:absolute;left:4px;top:-20px} item-goto-another-project-node .wrap-num p,[data-is="item-goto-another-project-node"] .wrap-num p{font-size:14px;text-align:center;color:#2196F3} item-goto-another-project-node .wrap-icon,[data-is="item-goto-another-project-node"] .wrap-icon{position:absolute;right:0;top:-20px;cursor:pointer;display:none} item-goto-another-project-node.focused-node .wrap-icon,[data-is="item-goto-another-project-node"].focused-node .wrap-icon{display:block}', 'class="node" onclick="{click}" onmouseover="{over}" onmouseout="{out}" id="{id}" data-id="{id}"', function(opts) {
    var self = this;
    this.id = this.opts.content.id;
    this.text = this.opts.content.text;
    this.num = this.opts.content.num;

    this.down = mdownOnLineStart;

    this.click = clickOnNode;
    this.over = moverTemplate;
    this.out = moutTemplate;

    this.on('mount', function(){

    });
});

riot.tag2('item-goto-node', '<div class="wrap-node f fh"> <p>{linkedNum}</p> </div> <div class="wrap-icon f fh"> <atom-delete-node id="{id}"> </atom-delete-node> </div>', 'item-goto-node,[data-is="item-goto-node"]{display:block;border:solid rgba(0,0,0,0.2) .5px;border-radius:50%;width:40px;height:40px;background:#fff;cursor:grab} item-goto-node .wrap-node,[data-is="item-goto-node"] .wrap-node{width:100%;height:100%} item-goto-node .wrap-node p,[data-is="item-goto-node"] .wrap-node p{color:#2a2a2a} item-goto-node.focused-node,[data-is="item-goto-node"].focused-node{border:solid #FF4081 2px !important;box-shadow:1px 1px 4px rgba(0,0,0,0.4)} item-goto-node .wrap-icon,[data-is="item-goto-node"] .wrap-icon{position:absolute;right:0;top:-20px;cursor:pointer;display:none} item-goto-node.focused-node .wrap-icon,[data-is="item-goto-node"].focused-node .wrap-icon{display:block} item-goto-node.drag,[data-is="item-goto-node"].drag{cursor:grabbing !important} item-goto-node.active-over,[data-is="item-goto-node"].active-over{transform:scale(1.05) !important}', 'class="node" onclick="{click}" onmouseover="{over}" onmouseout="{out}" data-id="{id}"', function(opts) {
    var self = this;
    this.linkedNum = this.opts.content.text;

    this.id = this.opts.content.id;

    this.click = clickOnNode;
    this.over = moverTemplate;
    this.out = moutTemplate;
});

riot.tag2('item-message-node', '<div class="wrap-node"> <div class="wrap-node-content f fm flex-between py4"> <textarea class="textarea px12" onkeyup="{updateText.bind(e, this)}">{text}</textarea> <p class="text hidden-text px12">{text}</p> </div> </div> <div class="wrap-drag-button f fm"> <div class="drag-button" onmousedown="{down}"></div> </div> <div class="wrap-num"> <p>{num}</p> </div> <div class="wrap-icon f fh"> <atom-delete-node id="{id}"></atom-delete-node> </div>', 'item-message-node,[data-is="item-message-node"]{position:relative;display:inline-block;transition:transform .2s;cursor:grab} item-message-node .wrap-node,[data-is="item-message-node"] .wrap-node{border:solid rgba(0,0,0,0.2) .5px;border-radius:3px;overflow:hidden;position:relative;z-index:2;transform:scale(1)} item-message-node .wrap-node .wrap-node-content,[data-is="item-message-node"] .wrap-node .wrap-node-content{position:relative;overflow:visible;background:#fff} item-message-node .wrap-node .wrap-node-content .text,[data-is="item-message-node"] .wrap-node .wrap-node-content .text{display:inline-block;color:#2a2a2a;letter-spacing:.6px;font-weight:400;max-width:180px;position:absolute;left:0;top:4px;word-break:break-all;visibility:hidden;pointer-events:none} item-message-node .wrap-node .wrap-node-content .textarea,[data-is="item-message-node"] .wrap-node .wrap-node-content .textarea{display:inline-block;color:#2a2a2a;letter-spacing:.6px;font-weight:400;width:100%;min-width:14px;max-width:180px;min-height:19px;outline:none;resize:none;height:34px} item-message-node .wrap-drag-button,[data-is="item-message-node"] .wrap-drag-button{position:absolute;top:0;left:calc(100% + 6px);z-index:10;height:100%;cursor:pointer} item-message-node .wrap-drag-button .drag-button,[data-is="item-message-node"] .wrap-drag-button .drag-button{cursor:pointer;background:#2196F3;width:8px;height:8px;border-radius:50%} item-message-node .start-node-overlay,[data-is="item-message-node"] .start-node-overlay{position:absolute;z-index:1;border:dotted rgba(33,150,243,0.4) 2.4px;border-radius:3px;width:calc(100% + 48px);height:calc(100% + 96px);top:-64px;left:-24px} item-message-node .start-node-overlay p,[data-is="item-message-node"] .start-node-overlay p{text-align:center;color:#2196F3} item-message-node.drag,[data-is="item-message-node"].drag{cursor:grabbing !important} item-message-node.active-over,[data-is="item-message-node"].active-over{transform:scale(1.05) !important} item-message-node.focused-node .wrap-node,[data-is="item-message-node"].focused-node .wrap-node{border:solid #2196F3 .8px !important;box-shadow:1px 1px 4px rgba(0,0,0,0.4)} item-message-node .wrap-num,[data-is="item-message-node"] .wrap-num{position:absolute;left:2px;top:-18px} item-message-node .wrap-num p,[data-is="item-message-node"] .wrap-num p{font-size:12px;font-weight:300;text-align:center;color:#999} item-message-node .wrap-icon,[data-is="item-message-node"] .wrap-icon{position:absolute;right:0;top:-20px;cursor:pointer;display:none;z-index:2} item-message-node.focused-node .wrap-icon,[data-is="item-message-node"].focused-node .wrap-icon{display:block} item-message-node.is-go-to-node .wrap-node,[data-is="item-message-node"].is-go-to-node .wrap-node{border:none} item-message-node.is-go-to-node .wrap-node .wrap-node-content,[data-is="item-message-node"].is-go-to-node .wrap-node .wrap-node-content{background:#FF5722} item-message-node.is-go-to-node .wrap-node .wrap-node-content p,[data-is="item-message-node"].is-go-to-node .wrap-node .wrap-node-content p{color:#fff} item-message-node.is-go-to-node .wrap-node .wrap-node-content .wrap-drag-button,[data-is="item-message-node"].is-go-to-node .wrap-node .wrap-node-content .wrap-drag-button{display:none}', 'class="node" onclick="{click}" onmouseover="{over}" onmouseout="{out}" id="{id}" data-id="{id}"', function(opts) {
    var self = this;

    this.content = this.opts.content;

    this.id = this.opts.content.id;
    this.text = this.opts.content.text;
    this.next = this.opts.content.next;
    this.num = this.opts.content.num;

    this.down = mdownOnLineStart;

    this.click = clickOnNode;
    this.over = moverTemplate;
    this.out = moutTemplate;

    this.on('mount', function(){

      var node = document.getElementById(self.id);
      var nodeText = node.getElementsByClassName('text')[0];
      if(self.text=='') self.text = 'Start Message';
      nodeText.innerText = self.text;

      var hiddenText = self.root.getElementsByClassName('hidden-text')[0];
      var textarea = self.root.getElementsByClassName('textarea')[0];

      hiddenText.innerHTML = self.text;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      textarea.style.width = `${w+10}px`;
      textarea.style.height = `${h}px`;

    });

    this.updateText = function(self, e){

      if(e.keyCode==13){
        var textarea = self.root.getElementsByClassName('textarea')[0];
        var text = textarea.value;
        text = text.replace(/\r?\n/g, '');
        textarea.value = text;

      }

      var node = self.root;

      var preWidth = node.offsetWidth;
      var preHeight = node.offsetHeight;

      var hiddenText = node.getElementsByClassName('hidden-text')[0];

      hiddenText.innerHTML = e.target.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      e.target.style.width = `${w+4}px`;
      e.target.style.height = `${h}px`;

      var gapX = node.offsetWidth - preWidth;
      var gapY = node.offsetHeight - preHeight;

      var content = scenarioGetContent(scenarioArray, self.id);
      var preNodePosY = content.gui.position.y;

      scenarioUpdatePosition(scenarioArray, content.id, {
        x: content.gui.position.x,
        y: preNodePosY - gapY/2,
      });
      node.style.top = `${preNodePosY - gapY/2}px`;

      var topLine = document.getElementById(`line-${content.id}`);
      if(topLine){
        var preX = parseInt(topLine.getAttribute('x1'));
        var x = preX + gapX;
        topLine.setAttribute('x1', x);
      }

      content.text = e.target.value;

      scenarioUpdateContent(scenarioArray, content.id, content);

      clearTimeout(self.saveTimer);
      self.saveTimer = setTimeout(function(){
        saveScenarioAsSubcollection(self.content);
      }, 800);

    }
});

riot.tag2('item-open-question-node', '<div class="wrap-node"> <div class="wrap-node-content"> <div class="wrap-question-text px8 pt10"> <textarea class="question-textarea" onkeyup="{updateQuestionText.bind(e, this)}">{questionText}</textarea> <p class="hidden-text">{questionText}</p> </div> <atom-open-question-answer id="{id}" expected="{expectedAnswer}"></atom-open-question-answer> </div> </div> <div class="wrap-drag-button pr8 f fm" onmousedown="{down}"> <div class="drag-button" data-selectionid="{id}"></div> </div> <div class="wrap-num"> <p>{num}</p> </div> <div class="wrap-icon f fh"> <atom-delete-node id="{id}"></atom-delete-node> </div>', 'item-open-question-node,[data-is="item-open-question-node"]{position:absolute;display:inline-block;width:200px;cursor:grab;transition:transform .2s;transform:scale(1)} item-open-question-node .wrap-node,[data-is="item-open-question-node"] .wrap-node{border:solid #999 .5px;border-radius:3px;background:#fff} item-open-question-node .wrap-node .wrap-node-content,[data-is="item-open-question-node"] .wrap-node .wrap-node-content{overflow:visible} item-open-question-node .wrap-node .wrap-node-content .wrap-question-text,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-question-text{border-bottom:solid .6px rgba(0,0,0,0.2)} item-open-question-node .wrap-node .wrap-node-content .wrap-question-text .hidden-text,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-question-text .hidden-text{display:inline-block;color:#2a2a2a;letter-spacing:.6px;font-size:14px;font-weight:400;max-width:180px;position:absolute;left:0;top:0;word-break:break-all;visibility:hidden;pointer-events:none} item-open-question-node .wrap-node .wrap-node-content .wrap-question-text .question-textarea,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-question-text .question-textarea{display:inline-block;color:#2a2a2a;letter-spacing:.6px;font-size:14px;font-weight:400;max-width:180px;outline:none;resize:none;height:34px} item-open-question-node .wrap-node .wrap-node-content .wrap-answer,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-answer{display:block;border-radius:3px;width:100%} item-open-question-node .wrap-node .wrap-node-content .wrap-answer .wrap-text,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-answer .wrap-text{position:relative} item-open-question-node .wrap-node .wrap-node-content .wrap-answer .wrap-text p,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-answer .wrap-text p{width:100%;color:#999;letter-spacing:.6px;font-weight:300;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap} item-open-question-node .wrap-node .wrap-node-content .wrap-answer .wrap-text .wrap-drag-button,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-answer .wrap-text .wrap-drag-button{position:absolute;top:0;left:calc(100% + 6px);z-index:10;height:100%;cursor:pointer} item-open-question-node .wrap-node .wrap-node-content .wrap-answer .wrap-text .wrap-drag-button .drag-button,[data-is="item-open-question-node"] .wrap-node .wrap-node-content .wrap-answer .wrap-text .wrap-drag-button .drag-button{background:#2196F3;width:8px;height:8px;border-radius:50%} item-open-question-node .wrap-drag-button,[data-is="item-open-question-node"] .wrap-drag-button{position:absolute;cursor:pointer;top:0;left:calc(100% + 6px);z-index:10;height:100%} item-open-question-node .wrap-drag-button .drag-button,[data-is="item-open-question-node"] .wrap-drag-button .drag-button{background:#2196F3;width:8px;height:8px;border-radius:50%;cursor:pointer} item-open-question-node.drag,[data-is="item-open-question-node"].drag{cursor:grabbing !important} item-open-question-node.active-over,[data-is="item-open-question-node"].active-over{transform:scale(1.05) !important} item-open-question-node.focused-node .wrap-node,[data-is="item-open-question-node"].focused-node .wrap-node{border:solid #2196F3 .8px !important;box-shadow:1px 1px 4px rgba(0,0,0,0.4)} item-open-question-node .wrap-num,[data-is="item-open-question-node"] .wrap-num{position:absolute;left:4px;top:-20px} item-open-question-node .wrap-num p,[data-is="item-open-question-node"] .wrap-num p{font-size:12px;text-align:center;color:#999} item-open-question-node .wrap-icon,[data-is="item-open-question-node"] .wrap-icon{position:absolute;right:2px;top:-18px;cursor:pointer;display:none} item-open-question-node.focused-node .wrap-icon,[data-is="item-open-question-node"].focused-node .wrap-icon{display:block}', 'class="node" onclick="{click}" onmouseover="{over}" onmouseout="{out}" data-id="{id}"', function(opts) {
    var self = this;

    this.id = this.opts.content.id;
    this.questionText = this.opts.content.text;

    this.expectedAnswer = this.opts.content.expectedAnswer;
    this.num = this.opts.content.num;

    this.down = mdownOnLineStart;

    this.click = clickOnNode;
    this.over = moverTemplate;
    this.out = moutTemplate;

    this.on('mount', function(){

      var node = document.getElementById(self.id);
      var nodeText = node.getElementsByClassName('hidden-text')[0];
      if(self.questionText=='') self.questionText = 'Question Message';
      nodeText.innerText = self.questionText;

      var hiddenText = self.root.getElementsByClassName('hidden-text')[0];
      var textarea = self.root.getElementsByClassName('question-textarea')[0];

      hiddenText.innerHTML = self.questionText;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      textarea.style.width = `${w+20}px`;
      textarea.style.height = `${h}px`;

    });

    this.updateQuestionText = function(self, e){

      if(e.keyCode==13){
        var textarea = self.root.getElementsByClassName('question-textarea')[0];
        var text = textarea.value;
        text = text.replace(/\r?\n/g, '');
        textarea.value = text;
      }

      var node = document.getElementById(self.id);

      var node = self.root;

      var preWidth = node.offsetWidth;
      var preHeight = node.offsetHeight;

      var hiddenText = node.getElementsByClassName('hidden-text')[0];
      hiddenText.innerHTML = e.target.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      e.target.style.width = `${w+20}px`;
      e.target.style.height = `${h}px`;

      var gapX = node.offsetWidth - preWidth;
      var gapY = node.offsetHeight - preHeight;

      var content = scenarioGetContent(scenarioArray, self.id);
      var preNodePosY = content.gui.position.y;
      scenarioUpdatePosition(scenarioArray, content.id, {
        x: content.gui.position.x,
        y: preNodePosY - gapY/2,
      });
      node.style.top = content.gui.position.y + 'px';

      content.text = e.target.value;

      scenarioUpdateContent(scenarioArray, content.id, content);

      clearTimeout(self.saveTimer);
      self.saveTimer = setTimeout(function(){
        saveScenarioAsSubcollection(self.content);
      }, 800);

    }
});

riot.tag2('item-pop-after-drag', '<div class="wrap-item pop-list"> <p class="px12 pt8 pb7" onclick="{addSimple}">Message</p> <p class="px12 pt8 pb7" onclick="{showQuestionSelection}">Question</p> <p class="px12 pt8 pb7" onclick="{goToInCurrentProject}">Go To</p> </div> <div class="wrap-item pop-question-list"> <p class="px12 pt8 pb7" onclick="{addSelection}">Selection</p> <p class="px12 pt8 pb7" onclick="{addOpenQuestion}">Open Question</p> </div> <div class="wrap-item pop-goto-list"> <p class="px12 pt8 pb7" onclick="{goToInCurrentProject}">In This Project</p> <p class="px12 pt8 pb7" onclick="{goToAnotherProject}">Another Project</p> </div>', 'item-pop-after-drag,[data-is="item-pop-after-drag"]{display:none;position:absolute;left:100px;top:100px;background:#fff;border-radius:3px;border:solid .6px rgba(0,0,0,0.2);overflow:hidden;filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.5))} item-pop-after-drag.show-pop,[data-is="item-pop-after-drag"].show-pop{display:block !important} item-pop-after-drag .wrap-item p,[data-is="item-pop-after-drag"] .wrap-item p{min-width:140px;cursor:pointer;color:#2196F3;text-align:center;font-size:14px;font-weight:300;letter-spacing:.6px;white-space:nowrap;border-bottom:solid .6px rgba(0,0,0,0.2)} item-pop-after-drag .wrap-item p:last-child,[data-is="item-pop-after-drag"] .wrap-item p:last-child{border-bottom:none} item-pop-after-drag .pop-question-list,[data-is="item-pop-after-drag"] .pop-question-list{display:none} item-pop-after-drag .pop-goto-list,[data-is="item-pop-after-drag"] .pop-goto-list{display:none}', '', function(opts) {
    var self = this;

    this.initSelection = [
      {label: 'Simple Message', func: this.addSimple},
      {label: 'Ask a Question', func: this.addQuestion},
      {label: 'Go To', func: this.goTo},
    ];

    this.addSimple = function(){

      mixpanel.track('simple message node was added');

      var content = {
        author: session.user.uid,
        id: `simpleTmp${riot.currentProject.nodeNum}`,
        num: riot.currentProject.nodeNum,
        type: 'normal',
        nodeType: 'single',
        text: 'Message',
        gui: {
          position: {},
        },
      };
      riot.currentProject.nodeNum++;

      addNode(arrowTo.x, arrowTo.y, content, 'item-message-node');

      saveScenarioAsSubcollection(content);

      focusNode(content);

      var pop = document.querySelector('wrap-pop-after-drag');
      pop.classList.remove('show-pop');

    }

    this.addSelection = function(){

      mixpanel.track('selection node was added');

      var content = {
        author: session.user.uid,
        id: `selectionTmp${riot.currentProject.nodeNum}`,
        num: riot.currentProject.nodeNum,
        type: 'selection',
        nodeType: 'group',
        text: 'What is your choice?',
        addedSelectionsCounter : 0,
        selections: [
          {label: 'Selection', id: `selectionTmp${riot.currentProject.nodeNum}-selection0`},
        ],
        gui: {
          position: {},
        },
      };
      riot.currentProject.nodeNum++;

      addNode(arrowTo.x, arrowTo.y, content, 'item-selection-node');

      var pop = document.querySelector('wrap-pop-after-drag');
      pop.classList.remove('show-pop');

      saveScenarioAsSubcollection(content);
      focusNode(content);

    }

    this.addOpenQuestion = function(){

      mixpanel.track('open question node was added');

      var content = {
        author: session.user.uid,
        id: `openquestionTmp${riot.currentProject.nodeNum}`,
        num: riot.currentProject.nodeNum,
        type: 'openquestion',
        nodeType: 'single',
        text: 'What is question?',
        expectedAnswer: 'type your answer...',
        gui: {
          position: {},
        },
      };
      riot.currentProject.nodeNum++;

      addNode(arrowTo.x, arrowTo.y, content, 'item-open-question-node');

      var pop = document.querySelector('wrap-pop-after-drag');
      pop.classList.remove('show-pop');

      saveScenarioAsSubcollection(content);
      focusNode(content);

    }

    this.goToInCurrentProject = function(){

      $('#canvasOverlay').fadeIn(400);
      var canvasNodes = document.getElementById('canvasNodes');
      canvasNodes.classList.add('add-node-z');

      var fromEvent = targetEvent;
      goToFrom = fromEvent;

      if(fromEvent.nodeType == 'single') goToFromId = targetEvent.id;
      if(fromEvent.nodeType == 'group') goToFromId = targetSelectionEventId;

      underChoiceOfGoTo = true;

    }

    this.goToAnotherProject = function(){

      $('util-modal').fadeIn(400);
      riot.mount('modal-window-content', 'module-modal-select-project');
      riot.update();
    }

    this.showQuestionSelection = function(){
      var pop = document.querySelector('wrap-pop-after-drag');
      var preHeight = pop.offsetHeight;

      $('.pop-list').hide();
      $('.pop-question-list').show();

      var nowHeight = pop.offsetHeight;

      var gap = (preHeight-nowHeight)/2;

      var y = parseInt(pop.style.top) + gap;

      pop.style.top = `${y}px`;
    }

    this.showGoToSelection = function(){
      var pop = document.querySelector('wrap-pop-after-drag');
      var preHeight = pop.offsetHeight;

      $('.pop-list').hide();
      $('.pop-goto-list').show();

      var nowHeight = pop.offsetHeight;

      var gap = (preHeight-nowHeight)/2;

      var y = parseInt(pop.style.top) + gap;

      pop.style.top = `${y}px`;
    }
});

riot.tag2('item-selection-node', '<div class="wrap-node"> <div class="wrap-node-content"> <div class="wrap-question-text px8 pt10 pb6"> <textarea class="question-textarea" onkeyup="{updateQuestionText.bind(e, this)}">{questionText}</textarea> <p class="hidden-text">{questionText}</p> </div> <div class="wrap-selections"> <atom-selection each="{item in selections}" selection="{item}"></atom-selection> <atom-add-selection content="{content}"></atom-add-selection> </div> </div> </div> <div class="wrap-num"> <p>{num}</p> </div> <div class="wrap-icon f fh"> <atom-delete-node id="{id}"></atom-delete-node> </div>', 'item-selection-node,[data-is="item-selection-node"]{position:absolute;display:inline-block;width:200px;cursor:grab;transition:transform .2s;transform:scale(1)} item-selection-node .wrap-node,[data-is="item-selection-node"] .wrap-node{overflow:visible;border-radius:3px;background:#fff;border:solid .6px rgba(0,0,0,0.2)} item-selection-node .wrap-node .wrap-node-content,[data-is="item-selection-node"] .wrap-node .wrap-node-content{overflow:visible} item-selection-node .wrap-node .wrap-node-content .wrap-question-text,[data-is="item-selection-node"] .wrap-node .wrap-node-content .wrap-question-text{border-bottom:solid .6px rgba(0,0,0,0.2)} item-selection-node .wrap-node .wrap-node-content .wrap-question-text .hidden-text,[data-is="item-selection-node"] .wrap-node .wrap-node-content .wrap-question-text .hidden-text{display:inline-block;color:#2a2a2a;letter-spacing:.6px;font-size:14px;font-weight:400;max-width:180px;position:absolute;left:0;top:0;word-break:break-all;visibility:hidden;pointer-events:none} item-selection-node .wrap-node .wrap-node-content .wrap-question-text .question-textarea,[data-is="item-selection-node"] .wrap-node .wrap-node-content .wrap-question-text .question-textarea{display:inline-block;color:#2a2a2a;letter-spacing:.6px;font-size:14px;font-weight:400;max-width:180px;outline:none;resize:none;height:34px} item-selection-node .wrap-node .wrap-node-content .wrap-selections,[data-is="item-selection-node"] .wrap-node .wrap-node-content .wrap-selections{display:inline-block;width:100%} item-selection-node.drag,[data-is="item-selection-node"].drag{cursor:grabbing !important} item-selection-node.active-over,[data-is="item-selection-node"].active-over{transform:scale(1.05) !important} item-selection-node.focused-node .wrap-node,[data-is="item-selection-node"].focused-node .wrap-node{border:solid #2196F3 .8px !important;box-shadow:1px 1px 4px rgba(0,0,0,0.4)} item-selection-node .wrap-num,[data-is="item-selection-node"] .wrap-num{position:absolute;left:2px;top:-18px} item-selection-node .wrap-num p,[data-is="item-selection-node"] .wrap-num p{font-size:12px;font-weight:300;text-align:center;color:#999} item-selection-node .wrap-icon,[data-is="item-selection-node"] .wrap-icon{position:absolute;right:0;top:-20px;cursor:pointer;display:none} item-selection-node.focused-node .wrap-icon,[data-is="item-selection-node"].focused-node .wrap-icon{display:block}', 'class="node" onclick="{click}" onmouseover="{over}" onmouseout="{out}" data-id="{id}"', function(opts) {
    var self = this;

    this.content = this.opts.content;
    this.id = this.opts.content.id;
    this.questionText = this.opts.content.text;
    this.selections = this.opts.content.selections;
    this.num = this.opts.content.num;

    this.down = mdownOnLineStart;

    this.click = clickOnNode;
    this.over = moverTemplate;
    this.out = moutTemplate;

    this.on('mount', function(){

      var node = document.getElementById(self.id);
      var nodeText = node.getElementsByClassName('hidden-text')[0];
      if(self.questionText=='') self.questionText = 'Question Message';
      nodeText.innerText = self.questionText;

      var hiddenText = self.root.getElementsByClassName('hidden-text')[0];
      var textarea = self.root.getElementsByClassName('question-textarea')[0];

      hiddenText.innerHTML = self.questionText;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      textarea.style.width = `${w+20}px`;
      textarea.style.height = `${h}px`;

    });

    this.updateQuestionText = function(self, e){

      if(e.keyCode==13){
        var textarea = self.root.getElementsByClassName('question-textarea')[0];
        var text = textarea.value;
        text = text.replace(/\r?\n/g, '');
        textarea.value = text;
      }

      var node = document.getElementById(self.id);

      var node = self.root;

      var preWidth = node.offsetWidth;
      var preHeight = node.offsetHeight;

      var hiddenText = node.getElementsByClassName('hidden-text')[0];
      hiddenText.innerHTML = e.target.value;

      var w = hiddenText.offsetWidth;
      var h = hiddenText.offsetHeight;

      e.target.style.width = `${w+20}px`;
      e.target.style.height = `${h}px`;

      var gapX = node.offsetWidth - preWidth;
      var gapY = node.offsetHeight - preHeight;

      var content = getEventFromScenarioById(self.id);
      var preNodePosY = content.gui.position.y;
      scenarioUpdatePosition(scenarioArray, content.id, {
        x: content.gui.position.x,
        y: preNodePosY - gapY/2,
      });
      node.style.top = content.gui.position.y + 'px';

      var selections = content.selections;
      for(var i=0; i<selections.length; i++){
        var id = selections[i].topLineId;
        var topLine = document.getElementById(id);

        if(topLine){
          var preY = parseInt(topLine.getAttribute('y1'));
          var y = preY + gapY/2;
          topLine.setAttribute('y1', y);
        }
      }

      content.text = e.target.value;

      scenarioUpdateContent(scenarioArray, content.id, content);

      clearTimeout(self.saveTimer);
      self.saveTimer = setTimeout(function(){
        saveScenarioAsSubcollection(self.content);
      }, 800);

    }

});

riot.tag2('item-start-point', '<div class="wrap-drag-button f fm" onmousedown="{down}"> <div class="drag-button"></div> </div>', 'item-start-point,[data-is="item-start-point"]{position:absolute;display:block;width:20px;height:20px;top:50000px;left:100px} item-start-point .wrap-drag-button,[data-is="item-start-point"] .wrap-drag-button{z-index:10;cursor:pointer} item-start-point .wrap-drag-button .drag-button,[data-is="item-start-point"] .wrap-drag-button .drag-button{background:#2196F3;width:14px;height:14px;border-radius:50%}', 'class="node" id="{id}" data-id="{id}"', function(opts) {
    this.down = mdownOnLineStart;

    var projectId = location.hash.split('/')[1];
    this.id = `start-point-${projectId}`;
});

riot.tag2('module-canvas', '<svg id="canvasSvg"> <line id="lineForPreview"></line> </svg> <div id="canvasNodes"> <item-start-point></item-start-point> </div> <wrap-pop-after-drag> <item-pop-after-drag></item-pop-after-drag> </wrap-pop-after-drag> <div id="canvasOverlay"></div>', 'module-canvas,[data-is="module-canvas"]{background:#f8f8f8;flex-grow:1;position:relative;display:block;overflow:scroll;width:100%;height:100%} module-canvas #canvasSvg,[data-is="module-canvas"] #canvasSvg{pointer-events:none;position:relative;width:100000px;height:100000px;left:0;top:0;z-index:11;max-width:initial} module-canvas #canvasSvg line,[data-is="module-canvas"] #canvasSvg line{position:relative;z-index:11;pointer-events:auto} module-canvas #canvasSvg #lineForPreview,[data-is="module-canvas"] #canvasSvg #lineForPreview{display:none} module-canvas #canvasSvg #lineForGoToPreview,[data-is="module-canvas"] #canvasSvg #lineForGoToPreview{display:none} module-canvas #canvasSvg .show,[data-is="module-canvas"] #canvasSvg .show{display:block !important} module-canvas #canvasNodes,[data-is="module-canvas"] #canvasNodes{position:absolute;width:100000px;height:100000px;top:0;left:0} module-canvas .add-node-z,[data-is="module-canvas"] .add-node-z{z-index:13} module-canvas .add-node-z item-message,[data-is="module-canvas"] .add-node-z item-message{cursor:pointer !important} module-canvas .add-node-z item-selection,[data-is="module-canvas"] .add-node-z item-selection{cursor:pointer !important} module-canvas #canvasOverlay,[data-is="module-canvas"] #canvasOverlay{display:none;position:absolute;width:100000px;height:100000px;top:0;left:0;background:rgba(0,0,0,0.5);z-index:12}', 'id="canvas"', function(opts) {
    var self = this;

    this.on('mount', function(){

    });

    riot.currentProjectId = opts.id;

    this.loadScenario = async ()=>{

      self.project = await service.db.collection("projects")
        .doc(opts.id)
        .get()
        .then(function(doc) {
          var data = doc.data()
          data.id = doc.id;
          return data;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });

      var firstEventName = `start-point-${self.project.id}`;

      riot.currentProject = self.project;

      var scenario = await service.db.collection("projects")
        .doc(opts.id)
        .collection('scenario')
        .get()
        .then(function(doc) {
          var resultScenario = [];
          for(var i=0; i<doc.docs.length; i++){

            resultScenario.push(doc.docs[i].data());
          }
          return resultScenario;
        });

      scenarioArray = scenario;
      var currentScenarioArray = scenario;
      currentScenarioArrayForConversation = currentScenarioArray;

      scenarioHistoriesAddHistory(scenarioHistories, scenarioArray);

      loadCanvas(firstEventName, true);

      $('#loading').fadeOut(400);

    }

    $('#loading').fadeIn(400);
    riot.loadScenarioTimer = setInterval(function(){
      if(session.user){
        clearInterval(riot.loadScenarioTimer);
        self.loadScenario();

        if(session.user.isFirstUser==undefined){
          $('util-modal').fadeIn(400);
          riot.mount('modal-window-content', 'module-modal-canvas-tutorial');
          riot.update();
        }
      }
    }, 800);

    service.db.collection("projects").doc(opts.id)
      .onSnapshot(function(doc) {

      });
});

riot.tag2('module-conversation', '<div class="wrap-module" id="conversationModule"> <div class="wrap-messages px12" id="wrapMessages"></div> <div class="wrap-input" id="wrapConversationInput"> <item-conversation-input-message></item-conversation-input-message> <conversation-input-selection> </conversation-input-selection> </div> </div>', 'module-conversation .wrap-module,[data-is="module-conversation"] .wrap-module{position:relative;height:calc(100vh - 84px)} module-conversation .wrap-module .wrap-messages,[data-is="module-conversation"] .wrap-module .wrap-messages{overflow:scroll;width:100%;height:100%;scroll-behavior:smooth;transition:all 400ms ease} module-conversation .wrap-module .wrap-input,[data-is="module-conversation"] .wrap-module .wrap-input{position:absolute;left:0;bottom:0;z-index:15;width:100%;background:#fff} module-conversation .project-view,[data-is="module-conversation"] .project-view{height:calc(100% - 24px)} module-conversation .mini-view,[data-is="module-conversation"] .mini-view{height:calc(100vh - 180px) !important}', 'id="moduleConversation"', function(opts) {
    var self = this;

    this.id = opts.id;
    riot.currentScenarioId = this.opts.__proto__.id;

    riot.waitForScenarioLoadedTimer = setInterval(function(){
      if(scenarioArray){

        var firstEventName = getEventFromScenarioById(`start-point-${riot.currentScenarioId}`).next;
        initConversation(firstEventName);
        clearInterval(riot.waitForScenarioLoadedTimer);
      }
    }, 800);

    this.on('mount', function(){

      var hash = window.location.hash;
      if(hash.lastIndexOf('#project') != -1){
        $('#conversationModule').addClass('project-view');
      }

      if(platform.name == 'Safari' && (platform.product=='iPhone' ||  platform.product=='iPad')){
        $('#conversationModule').addClass('mini-view');
      }

    });
});

riot.tag2('module-modal-canvas-tutorial', '<div class="wrap-module px14 py16"> <p class="title mb12">{title}</p> <p class="explanation mb16">{explanation}</p> <div class="wrap-img mb12 f fc"><img riot-src="{img}"></div> <div class="wrap-button f flex-right"> <p class="px12 py8" onclick="{func}">{label}</p> </div> </div>', 'module-modal-canvas-tutorial,[data-is="module-modal-canvas-tutorial"]{display:block;background:#FFF} module-modal-canvas-tutorial .wrap-module .title,[data-is="module-modal-canvas-tutorial"] .wrap-module .title{font-size:18px;font-weight:500;text-align:center} module-modal-canvas-tutorial .wrap-module .explanation,[data-is="module-modal-canvas-tutorial"] .wrap-module .explanation{font-size:14px;text-align:center} module-modal-canvas-tutorial .wrap-module .wrap-img,[data-is="module-modal-canvas-tutorial"] .wrap-module .wrap-img{min-width:628px;height:300px} module-modal-canvas-tutorial .wrap-module .wrap-img img,[data-is="module-modal-canvas-tutorial"] .wrap-module .wrap-img img{height:100%} module-modal-canvas-tutorial .wrap-module .wrap-button p,[data-is="module-modal-canvas-tutorial"] .wrap-module .wrap-button p{cursor:pointer;color:#fff;background:#2196F3;border-radius:3px;text-align:center;display:inline-block;letter-spacing:1px}', '', function(opts) {
    var self = this;

    this.on('mount', function(){
      $('modal-window-content').addClass('show');

      $(document).on("custom:closeModal", function() {
        $('module-modal-create-project').removeClass('show');
        self.unmount(true);
        $('util-modal').fadeOut(400);
      });
    });

    this.toFirst = function(){
      this.title = 'Create a Next Message (1/5)';
      this.explanation = 'Drag and drop this blue circle to create a new message.';
      this.img = './img/tutorial/1.gif';
      this.label = 'Next';
      this.func = this.toSecond;
    }

    this.toSecond = function(){
      this.title = 'Edit a Message (2/5)';
      this.explanation = 'Click a node and you can edit message.';
      this.img = './img/tutorial/2.png';
      this.label = 'Next';
      this.func = this.toThird;
      this.update();
    }

    this.toThird = function(){
      this.title = 'Preview your Bot (3/5)';
      this.explanation = 'Click this preview button';
      this.img = './img/tutorial/3.png';
      this.label = 'Next';
      this.func = this.toForth;
      this.update();
    }

    this.toForth = function(){
      this.title = 'Preview your Bot (4/5)';
      this.explanation = 'and you can preview what story your bot talk.';
      this.img = './img/tutorial/4.png';
      this.label = 'Next';
      this.func = this.toFifth;
      this.update();
    }

    this.toFifth = function(){
      this.title = 'Publish your Bot (5/5)';
      this.explanation = 'Finally you can get a url to publish your bot from share button.';
      this.img = './img/tutorial/5.png';
      this.label = 'Finish';
      this.func = this.toFinish;
      this.update();
    }

    this.toFinish = async function(){
      $(document).trigger('custom:closeModal');
      await service.db.collection('users').doc(session.user.uid)
        .update({isFirstUser: false});
    }

    this.toFirst();
});

riot.tag2('module-modal-create-project', '<div class="wrap-module px14 py16"> <p class="title mb12">Create a New Project</p> <div class="f"> <textarea class="pt3 pb4 px4 mr6" placeholder="Project Name" id="projectTitleInput"></textarea> <p class="wrap-button px10 py8" onclick="{createProject}">Create</p> </div> </div>', 'module-modal-create-project,[data-is="module-modal-create-project"]{display:block;background:#FFF} module-modal-create-project .wrap-module .title,[data-is="module-modal-create-project"] .wrap-module .title{font-size:16px;font-weight:400} module-modal-create-project .wrap-module textarea,[data-is="module-modal-create-project"] .wrap-module textarea{border:solid rgba(0,0,0,0.4) .5px;border-radius:3px;width:100%;height:28px;outline:none;resize:none;letter-spacing:.6px} module-modal-create-project .wrap-module .wrap-button,[data-is="module-modal-create-project"] .wrap-module .wrap-button{cursor:pointer;text-align:center;background:#2196F3;color:#fff;letter-spacing:.6px;font-size:12px;font-weight:400;border-radius:3px}', '', function(opts) {
    var self = this;

    this.on('mount', function(){
      $('modal-window-content').addClass('show');

      $(document).on("custom:closeModal", function() {
        $('module-modal-create-project').removeClass('show');
        self.unmount(true);
      });
    });

    this.createProject = async ()=>{

      mixpanel.track('new project was created');

      var input = document.querySelector('#projectTitleInput');
      var projectTitle = input.value;
      if(input.value == '') return;

      var projectObj = {
        author: session.user.uid,
        userName: session.user.name,
        userIcon: session.user.photoUrl,
        title: projectTitle,
        createdAt: new Date(),
        editedAt: new Date(),
        nodeNum: 2,
      };

      var id = await service.db.collection("projects")
        .add(projectObj)
        .then(function(data) {
          var id = data.id
          return id;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });

      await service.db.collection("projects").doc(id)
        .collection('scenario')
        .doc(`start-point-${id}`)
        .set({
          author: session.user.uid,
          id: `start-point-${id}`,
          type: 'start-point',
          nodeType: 'point',
          next: `first-${id}`,
          text: 'Start Point',
          num: 0,
          gui: {
            position: {x: 100, y: 100000/2},
            topLineId: `line-start-point-${id}`
          }
        });

      await service.db.collection("projects").doc(id)
        .collection('scenario')
        .doc(`first-${id}`)
        .set({
          author: session.user.uid,
          id: `first-${id}`,
          type: 'normal',
          nodeType: 'single',
          text: 'Hello',
          num: 1,
          gui: {
            position: {x: 200, y: 100000/2-10}
          }
        });

      window.location.href = `./#projects/${id}`;

      session.isNewProject = true;
      $('util-modal').fadeOut(400);
      $('modal-window-content').removeClass('show');
      $(document).trigger("custom:closeModal");

    }
});

riot.tag2('module-modal-select-project', '<div class="wrap-module px14 py16"> <p class="title pb12">Select project you want to connect to the node</p> <div class="wrap-projects"> <div class="project f fm flex-between" each="{item in projects}" onclick="{addGoToNode.bind(this, item.id, item.title)}" data-id="{item.id}"> <p>{item.title}</p> <div class="wrap-img f fh"><img riot-src="{item.userIcon}"></div> </div> </div> </div>', 'module-modal-select-project,[data-is="module-modal-select-project"]{display:block;background:#FFF} module-modal-select-project .wrap-module .title,[data-is="module-modal-select-project"] .wrap-module .title{font-size:16px;font-weight:400;border-bottom:solid rgba(153,153,153,0.4) .5px} module-modal-select-project .wrap-module .project,[data-is="module-modal-select-project"] .wrap-module .project{border-bottom:solid rgba(153,153,153,0.4) .5px;height:44px;cursor:pointer} module-modal-select-project .wrap-module .project p,[data-is="module-modal-select-project"] .wrap-module .project p{color:#2196F3} module-modal-select-project .wrap-module .project .wrap-img,[data-is="module-modal-select-project"] .wrap-module .project .wrap-img{width:32px;height:32px;overflow:hidden;border-radius:50%} module-modal-select-project .wrap-module .project .wrap-img img,[data-is="module-modal-select-project"] .wrap-module .project .wrap-img img{height:100%;object-fit:cover}', '', function(opts) {
    var self = this;

    this.loadProjects = async ()=>{

      var projects = await service.db.collection("projects")
        .orderBy("editedAt", "desc")
        .where('author', '==', session.user.uid)
        .get().then(function(querySelectors){
          var projects = [];
          querySelectors.forEach(function(doc) {
            var data = doc.data();
            data.id = doc.id;
            projects.push(data);
          });
          return projects;
        });

      self.projects = projects;
      self.update();

      $('modal-window-content').addClass('show');
      $(document).on("custom:closeModal", function() {
        $('module-modal-create-project').removeClass('show');
        self.unmount(true);
        $('util-modal').fadeOut(400);
      });

    }

    this.loadProjects();

    this.on('mount', function(){

    });

    this.addGoToNode = async function(id, title, e) {

      var additionalScenario = await service.db.collection("projects")
        .doc(id)
        .collection('scenario')
        .get().then(function(querySelectors){
          var additionalScenario = [];
          querySelectors.forEach(function(doc) {
            var data = doc.data();
            data.id = doc.id;
            additionalScenario.push(data);
          });
          return additionalScenario;
        });

      var firstEvent;
      for(var value of additionalScenario){
        if(`first-${id}`==value.id) firstEvent = value;
      }

      var content = {
        author: session.user.uid,
        id: `goToAnotherProjectTmp${riot.currentProject.nodeNum}`,
        num: riot.currentProject.nodeNum,
        type: 'gotoAnotherProject',
        nodeType: 'single',
        text: `${title}`,
        scenarioId: id,
        firstEventOfScenario: firstEvent.id,
        gui: {
          position: {},
        },
      };
      riot.currentProject.nodeNum++;

      addGoToAnotherProjectNode(arrowTo.x, arrowTo.y, content, false);

      $(document).trigger("custom:closeModal");

      saveScenarioAsSubcollection(content);
      focusNode(content);

      var pop = document.querySelector('wrap-pop-after-drag');
      pop.classList.remove('show-pop');
    }
});

riot.tag2('module-project', '<div class="wrap-module f fh"> <div> <p class="title mb8">{title}</p> <p class="time">{editedAt}</p> </div> </div>', 'module-project,[data-is="module-project"]{cursor:pointer;width:32%;height:200px;filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.5));border-radius:3px;background:#FFF} module-project .wrap-module,[data-is="module-project"] .wrap-module{height:100%} module-project .wrap-module p,[data-is="module-project"] .wrap-module p{text-align:center} module-project .wrap-module .title,[data-is="module-project"] .wrap-module .title{color:#2a2a2a} module-project .wrap-module .time,[data-is="module-project"] .wrap-module .time{color:#999;font-size:12px}', 'class="mb20" onclick="{toCanvas}"', function(opts) {
    var self = this;

    this.on('mount', function(){

    });

    this.title = opts.content.title;
    this.editedAt = moment(opts.content.editedAt).format('ddd DD, YYYY, HH:mm');

    this.toCanvas = function() {
      mixpanel.track('existing project was opened');

      session.isNewProject = false;
      window.location.href = `./#projects/${opts.content.id}`;
    }
});

riot.tag2('page-canvas', '<div class="wrap-page f"> <module-canvas id="{scenarioId}"></module-canvas> </div> <div class="wrap-preview"> <div class="wrap-conversation-preview"><a class="js-copytext" style="opacity: 0; position: fixed; z-index: -1;">{urlToCopy}</a> <div class="preview-header f fm flex-right"> <div class="icon f fm mr6" onclick="{copy.bind(this, urlToCopy)}"><img src="./img/icon/share.svg"></div> <div class="icon f fm mr6" onclick="{reloadPreview}"><img src="./img/icon/reload.svg"></div> <div class="icon f fm mr6" onclick="{togglePreview}"><img src="./img/icon/close.svg"></div> </div> <wrapper-module-conversation></wrapper-module-conversation> </div> <atom-float-action-preview id="{scenarioId}"></atom-float-action-preview> </div>', 'page-canvas .wrap-page,[data-is="page-canvas"] .wrap-page{width:1000%;height:100%;background:#fff;position:relative} page-canvas .wrap-page inspector,[data-is="page-canvas"] .wrap-page inspector{width:100%;max-width:280px;height:100%;background:#fff;overflow:scroll;filter:drop-shadow(2px 1px 1px rgba(0,0,0,0.2))} page-canvas .wrap-preview .wrap-conversation-preview,[data-is="page-canvas"] .wrap-preview .wrap-conversation-preview{display:none;position:fixed;z-index:12;right:16px;bottom:16px;width:300px;height:440px;background:#FFF;border-radius:3px;overflow:hidden;filter:drop-shadow(2px 1px 1px rgba(0,0,0,0.2))} page-canvas .wrap-preview .wrap-conversation-preview .preview-header,[data-is="page-canvas"] .wrap-preview .wrap-conversation-preview .preview-header{width:100%;height:26px;background:#2196F3} page-canvas .wrap-preview .wrap-conversation-preview .preview-header .icon,[data-is="page-canvas"] .wrap-preview .wrap-conversation-preview .preview-header .icon{cursor:pointer;width:18px}', '', function(opts) {
    var self = this;
    this.scenarioId = opts.__proto__.id;

    this.togglePreview = function(){
      $('atom-float-action-preview').fadeIn(200);
      $('.wrap-conversation-preview').fadeOut(200);
    }

    this.reloadPreview = function(){
      var firstEventName = scenarioGetContent(scenarioArray, `start-point-${riot.currentScenarioId}`).next;
      initConversation(firstEventName);
    }

    this.urlToCopy = `${location.host}/#conversation/${this.scenarioId}`;

    this.copy = function(url){
      console.log('copy this:', url);
      mixpanel.track('bot url was copied from preview header');
      var element = document.querySelector('.js-copytext');
      var range = document.createRange();
      range.selectNode(element);

      var selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy');

      selection.removeAllRanges();

      alert('botのリンクをコピーしました。');
    }

    riot.urlToCopy = this.urlToCopy;

    this.on('mount', function(){

    });
});

riot.tag2('page-conversation', '<div class="wrap-page"> <wrapper-module-conversation></wrapper-module-conversation> </div>', 'page-conversation .wrap-page,[data-is="page-conversation"] .wrap-page{width:100%;height:100%;background:#fff;position:relative}', '', function(opts) {
    riot.currentProjectId = opts.__proto__.id;

    this.loadScenario = async ()=>{

      self.project = await service.db.collection("projects")
        .doc(opts.id)
        .get()
        .then(function(doc) {
          var data = doc.data()
          data.id = doc.id;
          return data;
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });

      riot.currentProject = self.project;

      var hash = window.location.hash;
      if(hash.indexOf('#conversation')>=0){
        riot.mount('header', 'util-header', {status: 'conversation'});
        riot.update();
      }

      var firstEventName = `first-${self.project.id}`;

      var scenario = await service.db.collection("projects")
        .doc(opts.id)
        .collection('scenario')
        .get()
        .then(function(doc) {
          var resultScenario = [];
          for(var i=0; i<doc.docs.length; i++){

            resultScenario.push(doc.docs[i].data());
          }
          return resultScenario;
        });

      scenarioArray = scenario;

      $('#loading').fadeOut(400);
    }

    var tryLoad = function(loadScenario){

        clearInterval(riot.loadScenarioTimer);
        loadScenario();

    }

    $('#loading').fadeIn(400);
    riot.loadScenarioTimer = setInterval(tryLoad.bind(undefined, this.loadScenario), 800);

    this.on('mount', function(){

      riot.mount('wrapper-module-conversation', 'module-conversation', {
        id: riot.currentProjectId
      });
      riot.update();
      self.isFirstOpen = false;
    });
});

riot.tag2('page-login', '<div class="wrap-page f fh"> <div class="wrap-box"> <p class="logo mb40">Bot Editor</p> <p class="sign_in_up mb24">Sign up / in With</p> <div class="f fc"> <div class="wrap-fb-button f fm px10 py6"><img src="./img/icon/fb.svg"> <p onclick="{login}">Facebook</p> </div> </div> </div> </div>', 'page-login .wrap-page,[data-is="page-login"] .wrap-page{width:100%;height:100%;background:#2196F3} page-login .wrap-page .logo,[data-is="page-login"] .wrap-page .logo{color:#fff;text-align:center;letter-spacing:1.4px;font-weight:100;font-size:36px} page-login .wrap-page .sign_in_up,[data-is="page-login"] .wrap-page .sign_in_up{color:#fff;text-align:center;font-weight:300} page-login .wrap-page .wrap-fb-button,[data-is="page-login"] .wrap-page .wrap-fb-button{cursor:pointer;width:140px;background:#3b5998;border-radius:3px} page-login .wrap-page .wrap-fb-button img,[data-is="page-login"] .wrap-page .wrap-fb-button img{width:24px} page-login .wrap-page .wrap-fb-button p,[data-is="page-login"] .wrap-page .wrap-fb-button p{color:#FFF;width:100%;text-align:center;letter-spacing:1.4px;font-weight:300}', '', function(opts) {
    var self = this;

    this.on('mount', function(){

    });

    this.login = loginWithFacebook;

    $('header').hide();

    $('.wrap-content').addClass('full-height');
});

riot.tag2('page-top', '<div class="wrap-page py40"> <p class="label mb20">Recent Projects</p> <div class="wrap-projects f flex-between flex-wrap"> <div class="wrap-add-project f fh" onclick="{addProject}"> <div><img src="./img/icon/add.svg"> <p>Add Project</p> </div> </div> <module-project each="{item in projects}" content="{item}"></module-project> <div id="projectDummy"></div> </div> </div>', 'page-top,[data-is="page-top"]{width:100%;min-height:100vh;background:#f8f8f8 !important} page-top .wrap-page,[data-is="page-top"] .wrap-page{margin:0 auto;display:block;width:90%;max-width:1024px} page-top .wrap-page .label,[data-is="page-top"] .wrap-page .label{font-size:16px;font-weight:400;text-align:.6px} page-top .wrap-page .wrap-projects .wrap-add-project,[data-is="page-top"] .wrap-page .wrap-projects .wrap-add-project{cursor:pointer;width:32%;height:200px;filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.5));border-radius:3px;background:#FFF} page-top .wrap-page .wrap-projects .wrap-add-project p,[data-is="page-top"] .wrap-page .wrap-projects .wrap-add-project p{text-align:center} page-top .wrap-page #projectDummy,[data-is="page-top"] .wrap-page #projectDummy{width:31%;display:none}', '', function(opts) {
    var self = this;

    this.addProject = function(){
      $('util-modal').fadeIn(400);
      riot.mount('modal-window-content', 'module-modal-create-project');
      riot.update();
    }

    this.on('mount', function(){

    });

    this.loadProjects = async ()=>{

      var projects = await service.db.collection("projects")
        .orderBy("editedAt", "desc")
        .where('author', '==', session.user.uid)
        .get().then(function(querySelectors){
          var projects = [];
          querySelectors.forEach(function(doc) {
            var data = doc.data();
            data.id = doc.id;
            projects.push(data);
          });
          return projects;
        });

      self.projects = projects;
      self.update();

      $('#loading').fadeOut(400);
      $('#loadingForModal').fadeOut(400);

      if((projects.length+1)%3 == 2) $('#projectDummy').show();
    }

    $('#loading').fadeIn(400);
    riot.loadProjectsTimer = setInterval(function(){
      if(session.user){
        clearInterval(riot.loadProjectsTimer);
        self.loadProjects();
      }
    }, 800);
});

riot.tag2('temp', '', '', '', function(opts) {
    this.on('mount', function(){

    });
});

riot.tag2('util-header', '<div class="wrap-util f fm flex-between" if="{status == \'canvas\'}"> <div></div> <div class="icon f fh"><img onclick="{copy.bind(this, riot.urlToCopy)}" src="./img/icon/share2.svg"><a class="js-copytext-header" style="opacity: 0; position: fixed; z-index: -1;">{urlToCopy}</a></div> <div class="wrap-label f fh"> <p>{label}</p><a style="display: none;" href="#" id="downloader"></a> </div> </div> <div class="wrap-util f fm flex-between" if="{status == \'conversation\'}"> <div></div> <div></div> <div class="wrap-label f fh"> <p>{label}</p> </div> </div>', 'util-header,[data-is="util-header"]{position:fixed;z-index:101;top:0;left:0;display:block;width:100%;height:48px;border-bottom:solid .6px rgba(0,0,0,0.2);background:#f8f8f8} util-header .wrap-util,[data-is="util-header"] .wrap-util{position:relative;width:100%;height:100%} util-header .wrap-util .icon-export,[data-is="util-header"] .wrap-util .icon-export{width:48px} util-header .wrap-util .icon-export img,[data-is="util-header"] .wrap-util .icon-export img{width:24px;cursor:pointer} util-header .wrap-util .icon,[data-is="util-header"] .wrap-util .icon{width:48px} util-header .wrap-util .icon img,[data-is="util-header"] .wrap-util .icon img{width:24px;cursor:pointer} util-header .wrap-util .wrap-label,[data-is="util-header"] .wrap-util .wrap-label{position:absolute;width:100%;height:100%}', '', function(opts) {
    var self = this;

    this.status = opts.__proto__.status;

    this.on('mount', function(){

    });

    this.export = exportCsv;

    if(this.status=='conversation'){
      if(riot.currentProject) this.label = riot.currentProject.userName;
    }
    if(this.status=='canvas'){
      if(riot.currentProject) this.label = riot.currentProject.title;
    }

    this.waitCurrentProjectLoading = function(){
      if(riot.currentProject && self.status){
        if(self.status=='conversation'){
          self.label = riot.currentProject.userName;
        }
        if(self.status=='canvas'){
          self.label = riot.currentProject.title;
        }
        riot.update();
        clearInterval(self.timer);
      }
    }

    this.timer = setInterval(this.waitCurrentProjectLoading, 1600);

    this.copy = function(url){
      console.log('copy this:', url);
      mixpanel.track('bot url was copied from header');

      var element = document.querySelector('.js-copytext-header');
      element.innerText = url;
      var range = document.createRange();
      range.selectNode(element);

      var selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy');

      selection.removeAllRanges();

      alert('botのリンクをコピーしました。');
    }
});

riot.tag2('util-modal', '<div class="wrap-util f fh"> <modal-window-content></modal-window-content> <div class="wrap-overlay f fh" onclick="{closeModal}"></div> </div>', 'util-modal,[data-is="util-modal"]{display:none;position:fixed;z-index:101;width:100%;height:100%;top:0;background:rgba(0,0,0,0.4)} util-modal .wrap-util,[data-is="util-modal"] .wrap-util{height:100%} util-modal .wrap-util modal-window-content,[data-is="util-modal"] .wrap-util modal-window-content{z-index:103;position:relative;border-radius:3px;transform:scale(0);transition:all .4s} util-modal .wrap-util modal-window-content.show,[data-is="util-modal"] .wrap-util modal-window-content.show{transform:scale(1) !important} util-modal .wrap-util .wrap-overlay,[data-is="util-modal"] .wrap-util .wrap-overlay{z-index:102;display:block;position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);cursor:pointer}', '', function(opts) {
    var self = this;

    this.closeModal = function(){
      $('util-modal').fadeOut(400);
      $('modal-window-content').removeClass('show');
      $(document).trigger("custom:closeModal");
    }
});

riot.tag2('util-now-loading', '<div class="wrap-loading f fh"> <atom-now-loading-icon></atom-now-loading-icon> </div>', 'util-now-loading,[data-is="util-now-loading"]{display:block;position:fixed;z-index:3;width:100%;height:100%;top:0;background:#FFF} util-now-loading#loadingForModal,[data-is="util-now-loading"]#loadingForModal{z-index:6 !important} util-now-loading .wrap-loading,[data-is="util-now-loading"] .wrap-loading{width:100%;height:100%}', '', function(opts) {
});