__require=function e(t,i,r){function n(c,a){if(!i[c]){if(!t[c]){var o=c.split("/");if(o=o[o.length-1],!t[o]){var u="function"==typeof __require&&__require;if(!a&&u)return u(o,!0);if(s)return s(o,!0);throw new Error("Cannot find module '"+c+"'")}}var l=i[c]={exports:{}};t[c][0].call(l.exports,function(e){return n(t[c][1][e]||e)},l,l.exports,e,t,i,r)}return i[c].exports}for(var s="function"==typeof __require&&__require,c=0;c<r.length;c++)n(r[c]);return n}({CubeModule:[function(e,t,i){"use strict";cc._RF.push(t,"e6f2aK7W5NBTJwt+kIazVtF","CubeModule"),t.exports={Msg:{CubeClickMsg:"CubeModule.CubeClickMsg",CubeEqualMsg:"CubeModule.CubeEqualMsg",CubeResetMsg:"CubeModule.CubeResetMsg",CubeDiffMsg:"CubeModule.CubeDiffMsg"},checkedNum:12,targetArr:[],totalTime:100,level:0},cc._RF.pop()},{}],Cube:[function(e,t,i){"use strict";cc._RF.push(t,"2caebIcErRMD52OvNdOuAmR","Cube");var r=e("Observer"),n=e("ObserverMgr"),s=e("CubeModule");cc.Class({extends:r,properties:{spCube:{displayName:"spCube",default:null,type:cc.Sprite},lblValue:{displayName:"lblValue",default:null,type:cc.Label},toggle:{displayName:"toggle",default:null,type:cc.Toggle},fanpaiEffect:{displayName:"fanpaiEffect",default:null,type:cc.Node},spGou:{displayName:"spGou",default:null,type:cc.Sprite},_index:null,_value:null},_getMsgList:function(){return[s.Msg.CubeClickMsg,s.Msg.CubeResetMsg,s.Msg.CubeDiffMsg]},_onMsg:function(e,t){e===s.Msg.CubeResetMsg?t.includes(this._index)&&(this.toggle.isChecked=!1,this._playFanPai()):e===s.Msg.CubeDiffMsg&&t===this._index&&(this.toggle.isChecked=!1,this._playFanPai())},onLoad:function(){this._initMsg(),this.fanpaiEffect.active=!1},start:function(){},initCube:function(e,t){this._value=e,this._index=t,this.spGou.node.active=!1,this._changeCube()},onToggleClick:function(){if(this.toggle.isChecked&&(this.fanpaiEffect.active=!0,this.fanpaiEffect.getComponent(cc.Animation).play("fanpai")),this.toggle.isChecked)this._playFanPai(),s.targetArr.push({index:this._index,value:this._value}),n.dispatchMsg(s.Msg.CubeClickMsg,{index:this._index,value:this._value});else if(1===s.targetArr.length)this._playFanPai(),_.remove(s.targetArr,function(e){return e.index===this._index&&e.value===this._value}.bind(this));else if(2===s.targetArr.length){var e=[s.targetArr[0].index,s.targetArr[1].index],t=_.difference(e,[this._index]);_.remove(s.targetArr,function(e){return e.index===t[0]}.bind(this)),this.toggle.isChecked=!0,n.dispatchMsg(s.Msg.CubeDiffMsg,t[0])}},_changeCube:function(){var e="uiModule/main/cube/cube0";e=this.toggle.isChecked?"uiModule/main/cube/cube"+this._value:"uiModule/main/cube/cube0",cc.loader.loadRes(e,cc.SpriteFrame,function(e,t){this.spCube.spriteFrame=t}.bind(this))},_playFanPai:function(){var e=cc.scaleTo(.06,.04,1),t=cc.callFunc(this._changeCube,this),i=cc.scaleTo(.06,1.1,1),r=cc.scaleTo(.02,1,1);this.spCube.node.runAction(cc.sequence(e,t,i,r))},playDisappear:function(){this.spGou.node.active=!0,this.spCube.getComponent(cc.Animation).play("disappear"),this.toggle.interactable=!1}}),cc._RF.pop()},{CubeModule:"CubeModule",Observer:"Observer",ObserverMgr:"ObserverMgr"}],LoginScene:[function(e,t,i){"use strict";cc._RF.push(t,"f0fc3MKj11GwpHc6wxTCQnK","LoginScene");var r=e("Observer");cc.Class({extends:r,properties:{},_getMsgList:function(){return[]},_onMsg:function(e,t){},onLoad:function(){this._initMsg()},start:function(){},onBtnClickToStart:function(){cc.director.loadScene("MainScene")}}),cc._RF.pop()},{Observer:"Observer"}],MainScene:[function(e,t,i){"use strict";cc._RF.push(t,"b53a7UDCEhPy5msuwliGjAq","MainScene");var r=e("Observer"),n=e("ObserverMgr"),s=e("CubeModule");cc.Class({extends:r,properties:{cubePre:{displayName:"cubePre",default:null,type:cc.Prefab},frameNode:{displayName:"frameNode",default:null,type:cc.Node},cubeBaseArr:{displayName:"cubeBaseArr",default:[],type:[cc.Node]},progressBar:{displayName:"progressBar",default:null,type:cc.ProgressBar},lblReady:{displayName:"lblReady",default:null,type:cc.Label},lblGo:{displayName:"lblGo",default:null,type:cc.Label},lblLevel:{displayName:"lblLevel",default:null,type:cc.Label},tutorLayer:{displayName:"tutorLayer",default:null,type:cc.Node},spTimeBar:{displayName:"spTimeBar",default:null,type:cc.Sprite}},_getMsgList:function(){return[s.Msg.CubeClickMsg,s.Msg.CubeEqualMsg]},_onMsg:function(e,t){if(e===s.Msg.CubeClickMsg)this._checkEqual(t);else if(e===s.Msg.CubeEqualMsg){var i=t[0],r=t[1],n=this._getTargetNode(i),c=this._getTargetNode(r);n.getComponent("Cube").playDisappear(),c.getComponent("Cube").playDisappear(),s.targetArr=[],s.checkedNum--,this._checkOver()}},_onError:function(e,t,i){},onLoad:function(){this._initMsg(),this.refreshCube(),this._initTutor()},start:function(){},_initTutor:function(){var e=cc.delayTime(1),t=cc.callFunc(this._startCount,this);this.tutorLayer.runAction(cc.sequence(e,t))},refreshCube:function(){this.lblLevel.string=s.level,s.checkedNum=12;var e=_.shuffle([1,1,2,2,3,3,4,4,5,5,6,6,1,1,2,2,3,3,4,4,5,5,6,6]);console.log(e);var t=e.length;this.frameNode.destroyAllChildren();for(var i=0;i<t;i++){var r=cc.instantiate(this.cubePre);this.cubeBaseArr[i].addChild(r),r.getComponent("Cube").initCube(e[i],i)}},_checkEqual:function(e){var t=s.targetArr.length;if(2===t)s.targetArr[0].value===s.targetArr[1].value&&s.targetArr[0].index!==s.targetArr[1].index&&n.dispatchMsg(s.Msg.CubeEqualMsg,[s.targetArr[0].index,s.targetArr[1].index]);else if(t>2){var i=[s.targetArr[0].index,s.targetArr[1].index];n.dispatchMsg(s.Msg.CubeResetMsg,i),s.targetArr=[],s.targetArr.push(e)}},_checkOver:function(){s.checkedNum<=0&&cc.director.loadScene("OverScene")},_startCount:function(){this.schedule(this._countDown,1)},_countDown:function(){s.totalTime<=0&&(this.unschedule(this._countDown),cc.director.loadScene("OverScene")),s.totalTime--;var e=this.spTimeBar.fillStart;(e=parseFloat(1-s.totalTime/100))>=1&&(e=1),this.spTimeBar.fillStart=e,this.progressBar.progress=parseFloat(s.totalTime/100)},onBtnClickToBack:function(){s.targetArr=[],s.totalTime=100,s.checkedNum=12,cc.director.loadScene("LoginScene")},_getTargetNode:function(e){var t=this.cubeBaseArr[e];if(1===t.children.length)return t.children[0]}}),cc._RF.pop()},{CubeModule:"CubeModule",Observer:"Observer",ObserverMgr:"ObserverMgr"}],ObserverMgr:[function(e,t,i){"use strict";cc._RF.push(t,"3d0cbfJj9VNA6ih+7v7ClXQ","ObserverMgr"),t.exports={obsArray:{},addEventListener:function(e,t,i){void 0===i&&console.log("[ObserverMgr] \u6ce8\u518c\u6d88\u606f [%s]:%s \u7684\u4f5c\u7528\u4e8e\u672a\u5b9a\u4e49",e,t.name),void 0===this.obsArray[e]&&(this.obsArray[e]=[]);for(var r=0;r<this.obsArray[e].length;r++){var n=this.obsArray[e][r];if(n.func===t&&n.ob===i)return}this.obsArray[e].push({func:t,ob:i})},removeEventListener:function(e,t,i){var r=!1,n=this.obsArray[e];if(n)for(var s=0;s<n.length;){var c=n[s],a=c.func,o=c.ob;t===a&&i===o?(n.splice(s,1),r=!0):s++}return r},removeEventListenerWithObject:function(e){for(var t in this.obsArray)for(var i=this.obsArray[t],r=0;r<i.length;){i[r].ob===e?i.splice(r,1):r++}},cleanAllEventListener:function(){this.obsArray={}},dispatchMsg:function(e,t){var i=this.obsArray[e];if(void 0!==i)for(var r=0;r<i.length;r++){var n=i[r],s=n.func,c=n.ob;s&&c&&s.apply(c,[e,t])}else console.log("\u6d88\u606f\u5217\u8868\u4e2d\u4e0d\u5b58\u5728: "+e)}},cc._RF.pop()},{}],Observer:[function(e,t,i){"use strict";cc._RF.push(t,"8aa3fygHvNHarAOH5JkiqBi","Observer");var r=e("ObserverMgr");cc.Class({extends:cc.Component,_initMsg:function(){for(var e=this._getMsgList(),t=0;t<e.length;t++){var i=e[t];r.addEventListener(i,this._onMsg,this)}},onLoad:function(){},_getMsgList:function(){return[]},_onMsg:function(e,t){},_onError:function(e,t,i){},_onNetOpen:function(){},_onErrorDeal:function(e,t){var i=t[0],r=t[1],n=t[2];this._onError(i,r,n)},onDisable:function(){r.removeEventListenerWithObject(this)},onEnable:function(){},onDestroy:function(){r.removeEventListenerWithObject(this)}}),cc._RF.pop()},{ObserverMgr:"ObserverMgr"}],OverScene:[function(e,t,i){"use strict";cc._RF.push(t,"a4f7anSJZ1IJaCij7vk/1Gf","OverScene");var r=e("Observer"),n=e("CubeModule");cc.Class({extends:r,properties:{btnRestart:{displayName:"btnRestart",default:null,type:cc.Button},lblLoseTime:{displayName:"lblLoseTime",default:null,type:cc.Label},lblWinTime:{displayName:"lblWinTime",default:null,type:cc.Label},starArr:{displayName:"starArr",default:[],type:[cc.Sprite]},spLose:{displayName:"spLose",default:null,type:cc.Sprite},spWin:{displayName:"spWin",default:null,type:cc.Sprite}},_getMsgList:function(){return[]},_onMsg:function(e,t){},onLoad:function(){this._initMsg(),this._refresh()},start:function(){},onBtnClickToBack:function(){cc.director.loadScene("LoginScene")},onBtnClickToRestart:function(){n.totalTime=100,n.level=0,cc.director.loadScene("MainScene")},onBtnClickToNext:function(){n.level++,n.totalTime=n.totalTime+5,n.totalTime>=100&&(n.totalTime=100),n.totalTime<=0?(n.totalTime=100,cc.director.loadScene("LoginScene")):cc.director.loadScene("MainScene")},_refresh:function(){if(n.checkedNum<=0){this.spLose.node.active=!1,this.spWin.node.active=!this.spLose.node.active,this.btnRestart.node.active=!0;var e=100-n.totalTime;this.lblWinTime.string="\u7528\u65f6\uff1a"+e+"s",e>70?this._showStars(3):e>40&&e<=70?this._showStars(2):e>10&&e<=40&&this._showStars(1)}else this.btnRestart.node.active=!0,this.lblLoseTime.string="\u7528\u65f6\uff1a100s",this.spLose.node.active=!0,this.spWin.node.active=!this.spLose.node.active},_showStars:function(e){var t=this;if(e>0)for(var i=function(e){cc.loader.loadRes("uiModule/over/star",cc.SpriteFrame,function(t,i){this.starArr[e].spriteFrame=i}.bind(t))},r=0;r<e;++r)i(r)}}),cc._RF.pop()},{CubeModule:"CubeModule",Observer:"Observer"}]},{},["Observer","ObserverMgr","LoginScene","MainScene","Cube","CubeModule","OverScene"]);