__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AudioMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1c5e5Nl/BRJTb0A4uTojjJF", "AudioMgr");
    "use strict";
    module.exports = {
      _bgMusic: null,
      _guideMusic: null,
      playButtonSound: function playButtonSound() {
        cc.loader.loadRes("sound/btn", cc.AudioClip, function(err, clip) {
          cc.audioEngine.play(clip);
        });
      },
      playHitSound: function playHitSound() {
        cc.loader.loadRes("sound/hit", cc.AudioClip, function(err, clip) {
          cc.audioEngine.play(clip);
        });
      },
      playWinSound: function playWinSound() {
        cc.loader.loadRes("sound/win", cc.AudioClip, function(err, clip) {
          cc.audioEngine.play(clip);
        });
      },
      playFailSound: function playFailSound() {
        cc.loader.loadRes("sound/fail", cc.AudioClip, function(err, clip) {
          cc.audioEngine.play(clip);
        });
      },
      playMainMusic: function playMainMusic() {
        cc.loader.loadRes("sound/bg", cc.AudioClip, function(err, clip) {
          this._bgMusic = cc.audioEngine.play(clip, true);
        }.bind(this));
      },
      stopCurrentBackgroundMusic: function stopCurrentBackgroundMusic() {
        if (null !== this._bgMusic) {
          cc.audioEngine.stop(this._bgMusic);
          this._bgMusic = null;
        }
      },
      playEffectMusic: function playEffectMusic(path, isLoop) {
        "undefined" === typeof isLoop && (isLoop = false);
        cc.loader.loadRes(path, cc.AudioClip, function(err, clip) {
          cc.audioEngine.playEffect(clip, isLoop);
        });
      }
    };
    cc._RF.pop();
  }, {} ],
  BallItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "247feXhDf1H77s0exrnK+q/", "BallItem");
    "use strict";
    var UIMgr = require("UIMgr");
    var GameCfg = require("GameCfg");
    var ObserverMgr = require("ObserverMgr");
    var ShopModule = require("ShopModule");
    var Observer = require("Observer");
    cc.Class({
      extends: Observer,
      properties: {
        spBall: {
          displayName: "spBall",
          default: null,
          type: cc.Sprite
        },
        lblName: {
          displayName: "lblName",
          default: null,
          type: cc.Label
        },
        lblPrice: {
          displayName: "lblPrice",
          default: null,
          type: cc.Label
        },
        btnBuy: {
          displayName: "btnBuy",
          default: null,
          type: cc.Sprite
        },
        btnUsed: {
          displayName: "btnUsed",
          default: null,
          type: cc.Sprite
        },
        spUsedBg: {
          displayName: "spUsedBg",
          default: null,
          type: cc.Sprite
        },
        _data: null,
        _shopScript: null
      },
      _getMsgList: function _getMsgList() {
        return [ GameLocalMsg.Msg.BuyBall ];
      },
      _onMsg: function _onMsg(msg, data) {
        msg === GameLocalMsg.Msg.BuyBall && (data.index === this._data.index ? this.initView(data) : this.initView(this._data));
      },
      onLoad: function onLoad() {
        this._initMsg();
      },
      start: function start() {},
      initView: function initView(data) {
        this._data = data;
        var path = "";
        path = "default" !== data.type ? "shop/ball/ball_img_" + data.type + data.size + "_0_1" : "shop/ball/ball_img_circle18_1_1";
        UIMgr.changeSpImg(path, this.spBall);
        this.lblName.string = data.size + "mm";
        this.node.setLocalZOrder(data.index);
        this.btnUsed.node.active = data.isUsed;
        this.btnBuy.node.active = !this.btnUsed.node.active;
        this.spUsedBg.node.active = data.isUsed;
        data.hasOwned ? this.lblPrice.string = "\u5df2\u8d2d\u4e70" : this.lblPrice.string = data.price;
      },
      onBtnClickToBuy: function onBtnClickToBuy() {
        if (parseInt(GameCfg.totalRuby) < parseInt(this._data.price)) {
          ObserverMgr.dispatchMsg(GameLocalMsg.Msg.InsufficientRuby, null);
          return;
        }
        this._data.isUsed = true;
        this._data.hasOwned = true;
        ShopModule.ball[GameCfg.ballIndex].isUsed = false;
        GameCfg.ballIndex = this._data.index;
        ShopModule.ball[this._data.index].isUsed = true;
        ShopModule.ball[this._data.index].hasOwned = true;
        GameCfg.totalRuby = parseInt(GameCfg.totalRuby) - parseInt(this._data.price);
        GameCfg.saveTotalRuby(GameCfg.totalRuby);
        GameCfg.saveShopData();
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BuyBall, this._data);
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    Observer: "Observer",
    ObserverMgr: "ObserverMgr",
    ShopModule: "ShopModule",
    UIMgr: "UIMgr"
  } ],
  Ball: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "90bf7tRwAFHb5QH50wXpR5/", "Ball");
    "use strict";
    var ObserverMgr = require("ObserverMgr");
    var AudioMgr = require("AudioMgr");
    var ShopModule = require("ShopModule");
    var GameCfg = require("GameCfg");
    var UIMgr = require("UIMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        spBall: {
          displayName: "spBall",
          default: null,
          type: cc.Sprite
        },
        _pool: null,
        _hitGround: 0
      },
      onLoad: function onLoad() {
        this._hitGround = 0;
      },
      start: function start() {},
      initView: function initView(V, pool) {
        this._pool = pool;
        var _phyBody = this.node.getComponent(cc.RigidBody);
        var _vel = _phyBody.linearVelocity;
        _vel = V;
        _phyBody.linearVelocity = _vel;
        var _ballData = ShopModule.ball[GameCfg.ballIndex];
        var _path = "shop/ball/ball_img_" + _ballData.type + _ballData.size + "_0_1";
        "default" === _ballData.type && (_path = "shop/ball/ball_img_circle18_1_1");
        UIMgr.changeSpImg(_path, this.spBall);
        this.spBall.node.width = this.spBall.node.height = _ballData.size;
      },
      onBeginContact: function onBeginContact(contact, self, other) {
        switch (other.tag) {
         case 1:
          AudioMgr.playHitSound();
          other.node.getComponent("Block").hit();
          if (24 === other.node.getComponent("Block")._type) {
            var _v = self.node.getComponent(cc.RigidBody).linearVelocity;
            var _radianArr = [ 0, -Math.PI / 6, Math.PI / 6 ];
            var _randIndex = Math.floor(cc.rand() % 3);
            _v.rotateSelf(_radianArr[_randIndex]);
            self.node.getComponent(cc.RigidBody).linearVelocity = _v;
          }
          break;

         case 2:
          this._hitGround++;
          if (this._hitGround >= 2) {
            AudioMgr.playHitSound();
            var pos = this.node.position;
            this._pool.put(this.node);
            this._hitGround = 0;
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BallEndPos, pos);
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    AudioMgr: "AudioMgr",
    GameCfg: "GameCfg",
    ObserverMgr: "ObserverMgr",
    ShopModule: "ShopModule",
    UIMgr: "UIMgr"
  } ],
  Block: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6f6fawe/ydPpZGObdXxAe5r", "Block");
    "use strict";
    var UIMgr = require("UIMgr");
    var GameData = require("GameData");
    var GameCfg = require("GameCfg");
    var ObserverMgr = require("ObserverMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        spBlock: {
          displayName: "spBlock",
          default: null,
          type: cc.Sprite
        },
        lblScore: {
          displayName: "lblScore",
          default: null,
          type: cc.Label
        },
        _type: null,
        _index: null,
        _data1: null,
        _data2: null,
        _hp: null,
        _pool: null,
        isUsed: false,
        xmarkLayout: {
          displayName: "xmarkLayout",
          default: null,
          type: cc.Node
        },
        spLeft: {
          displayName: "spLeft",
          default: null,
          type: cc.Sprite
        },
        spRight: {
          displayName: "spRight",
          default: null,
          type: cc.Sprite
        },
        _isOpen: true
      },
      onLoad: function onLoad() {
        var stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
        this._hp = 0;
        this.isUsed = false;
        this._isOpen = true;
      },
      start: function start() {},
      initView: function initView(type, index, parentNode, pool, leftRow) {
        var isPreview = arguments.length > 5 && void 0 !== arguments[5] && arguments[5];
        this._pool = pool;
        this._type = type;
        this._index = index;
        this.node.setLocalZOrder(index.x);
        var path = "game/game_img_block" + type + "_1";
        -1 !== [ 11, 12, 13, 16, 17 ].indexOf(type) && (path = "game/game_img_block1_1");
        if (11 === type || 12 === type || 13 === type || 20 === type || 16 === type || 17 === type) {
          this.xmarkLayout.active = true;
          var _parent = this.spLeft.node.parent;
          var _w = .5 * _parent.width;
          this.spLeft.node.width = this.spRight.node.width = _w;
          this.spLeft.node.active = this.spRight.node.active = false;
          if (12 === type || 16 === type) {
            this.spLeft.node.x = .1 * _w;
            this.spRight.node.x = -.1 * _w;
            this.spLeft.node.active = this.spRight.node.active = true;
            this._isOpen = false;
          } else if (13 === type || 17 === type) {
            this.spLeft.node.x = .8 * -_w;
            this.spRight.node.x = .8 * _w;
            this.spLeft.node.active = this.spRight.node.active = true;
          }
        } else {
          this.xmarkLayout.active = false;
          this.spLeft.node.active = this.spRight.node.active = false;
        }
        UIMgr.changeSpImg(path, this.spBlock);
        var x = index.x;
        var y = index.y;
        var vWidth = parentNode.width;
        this.node.height = this.node.width = vWidth / GameCfg.defaultCol;
        this.node.y = -(this.node.height + .5 * this.node.height + this.node.height * x) + leftRow * this.node.height;
        this.node.x = (y - Math.floor(.5 * GameCfg.defaultCol)) * this.node.width;
        if (false !== isPreview) {
          this.lblScore.node.active = false;
          return;
        }
        this._initHp(type, index);
        this._initPhysics(type, index);
      },
      _initHp: function _initHp(type, index) {
        var baseScore = this._data2[index.x][index.y];
        var _arr = [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ];
        if (-1 !== _arr.indexOf(type)) {
          this._hp = 9 === type || 3 === type || 4 === type || 5 === type || 6 === type || 12 === type || 13 === type || 16 === type || 17 === type ? parseInt(1 * baseScore) : 11 === type ? parseInt(2 * baseScore) : parseInt(type * baseScore);
          this.refreshHp();
        } else this.lblScore.node.active = false;
        this._resetLabelPos(this._type);
      },
      _initPhysics: function _initPhysics(type) {
        var _points = [];
        var w = .5 * this.node.width;
        var _p0 = cc.v2(-w, -w);
        var _p1 = cc.v2(w, -w);
        var _p2 = cc.v2(w, w);
        var _p3 = cc.v2(-w, w);
        _points = 3 === type ? [ _p0, _p1, _p3 ] : 4 === type ? [ _p0, _p1, _p2 ] : 5 === type ? [ _p1, _p2, _p3 ] : 6 === type ? [ _p0, _p2, _p3 ] : [ _p0, _p1, _p2, _p3 ];
        var _phyCollider = null;
        if (21 === type || 22 === type || 23 === type || 24 === type || 7 === type || 8 === type) {
          _phyCollider = this.node.addComponent(cc.PhysicsCircleCollider);
          _phyCollider.sensor = true;
          this.node.width = this.node.height = w;
          _phyCollider.radius = .5 * w;
        } else {
          _phyCollider = this.node.addComponent(cc.PhysicsPolygonCollider);
          _phyCollider.points = _points;
        }
        _phyCollider.tag = 1;
        _phyCollider.apply();
      },
      hit: function hit() {
        var _this = this;
        var _tempArr = [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ];
        if (-1 !== _tempArr.indexOf(this._type)) {
          if (false === this._isOpen) return;
          this._hp--;
          this.spBlock.node.runAction(cc.sequence(cc.scaleTo(.05, .8), cc.scaleTo(.05, 1)));
          this._hp <= 0 && 9 === this._type && this.node.parent.children.forEach(function(_block) {
            var _script = _block.getComponent("Block");
            _script._index.x === _this._index.x && _script._index.y !== _this._index.y && _block.destroy();
          });
          this.refreshHp();
          return;
        }
        if (-1 !== [ 21, 22, 23 ].indexOf(this._type)) {
          this.node.removeComponent(cc.PhysicsCircleCollider);
          var _tarPos = cc.v2(this.node.x, -this.node.parent.height + .5 * this.node.height);
          var _moveAct = cc.moveTo(.5, _tarPos);
          var _scaleAct = cc.scaleTo(.5, 0);
          this.node.runAction(cc.sequence(_moveAct, _scaleAct, cc.removeSelf()));
          GameData.ballCount += parseInt(this._type) - 20;
          return;
        }
        if (7 === this._type) {
          this.isUsed = true;
          var _tempArr2 = this.node.parent.children;
          _tempArr2.forEach(function(_block) {
            var _script = _block.getComponent("Block");
            if (_script._index.x === _this._index.x && -1 !== [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ].indexOf(_script._type)) {
              _script._hp--;
              _script.refreshHp();
            }
          });
          return;
        }
        if (8 === this._type) {
          this.isUsed = true;
          var _tempArr3 = this.node.parent.children;
          _tempArr3.forEach(function(_block) {
            var _script = _block.getComponent("Block");
            if (_script._index.y === _this._index.y && -1 !== [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ].indexOf(_script._type)) {
              _script._hp--;
              _script.refreshHp();
            }
          });
          return;
        }
        24 === this._type && (this.isUsed = true);
      },
      refreshHp: function refreshHp() {
        if (this._hp <= 0) {
          this.node.destroy();
          ObserverMgr.dispatchMsg(GameLocalMsg.Msg.UpdateScore, null);
          return;
        }
        this.lblScore.string = this._hp;
      },
      _resetLabelPos: function _resetLabelPos(type) {
        var _w = .5 * this.node.width;
        var _h = .5 * this.node.height;
        var pos = null;
        pos = 3 === type ? cc.v2(_w, _h).scaleSelf(cc.v2(-.3, -.3)) : 4 === type ? cc.v2(_w, _h).scaleSelf(cc.v2(.3, -.3)) : 5 === type ? cc.v2(_w, _h).scaleSelf(cc.v2(.3, .3)) : 6 === type ? cc.v2(_w, _h).scaleSelf(cc.v2(-.3, .3)) : cc.v2(_w, _h).scaleSelf(cc.v2(0, 0));
        this.lblScore.node.position = pos;
      },
      playAct: function playAct() {
        var _parent = this.spLeft.node.parent;
        var _w = .5 * _parent.width;
        if (this._isOpen) {
          var _leftOpenAct = cc.moveBy(.2, cc.v2(-.9 * _w, 0));
          var _rightOpenAct = cc.moveBy(.2, cc.v2(.9 * _w, 0));
          this.spLeft.node.runAction(_leftOpenAct);
          this.spRight.node.runAction(_rightOpenAct);
        } else {
          var _leftCloseAct = cc.moveBy(.2, cc.v2(.9 * _w, 0));
          var _rightCloseAct = cc.moveBy(.2, cc.v2(-.9 * _w, 0));
          this.spLeft.node.runAction(_leftCloseAct);
          this.spRight.node.runAction(_rightCloseAct);
        }
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    GameData: "GameData",
    ObserverMgr: "ObserverMgr",
    UIMgr: "UIMgr"
  } ],
  ButtonClickSound: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "00fa0GbWrpGC7tfqeDi2y/I", "ButtonClickSound");
    "use strict";
    var AudioMgr = require("AudioMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        clickSound: {
          displayName: "clickSound",
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        this.node.on("touchstart", function() {
          this.clickSound ? cc.audioEngine.playEffect(this.clickSound, false) : AudioMgr.playButtonSound();
        });
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    AudioMgr: "AudioMgr"
  } ],
  ComUIBg: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e80c9ywMZNMy5gb24TRN/f6", "ComUIBg");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bgNode: {
          displayName: "bgNode",
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        var w = cc.view.getVisibleSize().width;
        var h = cc.view.getVisibleSize().height;
        this.bgNode.width = w;
        this.bgNode.height = h;
      },
      start: function start() {},
      addUI: function addUI(ui) {
        var node = cc.instantiate(ui);
        node.x = node.y = 0;
        this.node.addChild(node);
        return node;
      }
    });
    cc._RF.pop();
  }, {} ],
  End: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c9b86w05HBAULLWVj33t3Xl", "End");
    "use strict";
    var ObserverMgr = require("ObserverMgr");
    var UIMgr = require("UIMgr");
    var GameCfg = require("GameCfg");
    var GameData = require("GameData");
    var AudioMgr = require("AudioMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblStage: {
          displayName: "lblStage",
          default: null,
          type: cc.Label
        },
        lblStatus: {
          displayName: "lblStatus",
          default: null,
          type: cc.Label
        },
        spStarArr: [ cc.Sprite ],
        btnRetry: {
          displayName: "btnRetry",
          default: null,
          type: cc.Button
        },
        btnNext: {
          displayName: "btnNext",
          default: null,
          type: cc.Button
        },
        _data: null
      },
      start: function start() {},
      initView: function initView(data) {
        this.spStarArr.forEach(function(_spStar) {
          _spStar.node.active = false;
        });
        this._data = data;
        this.lblStage.string = "\u5173\u5361 " + data.stage;
        this.lblStatus.string = data.status ? "\u901a\u8fc7" : "\u5931\u8d25";
        this.btnNext.node.active = data.status;
        this.btnRetry.node.active = !this.btnNext.node.active;
        for (var i = 0; i < data.starNum; ++i) this.spStarArr[i].node.active = true;
        data.status ? AudioMgr.playWinSound() : AudioMgr.playFailSound();
      },
      onBtnClickToRetry: function onBtnClickToRetry() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
        UIMgr.destroyUI(this);
      },
      onBtnClickToNext: function onBtnClickToNext() {
        var _stage = this._data.stage;
        var _nextStage = parseInt(_stage) + 1;
        GameCfg.saveCurStage(_nextStage);
        var _curStar = GameData.getStarNum(_stage);
        if (_curStar < this._data.starNum) {
          GameData.setStarNum(_stage, this._data.starNum);
          GameCfg.saveStageCfg(GameData.gamedata_savelv);
        }
        GameData.initStageData(_nextStage);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
        UIMgr.destroyUI(this);
      },
      onBtnClickToHome: function onBtnClickToHome() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoMenu, null);
        UIMgr.destroyUI(this);
      }
    });
    cc._RF.pop();
  }, {
    AudioMgr: "AudioMgr",
    GameCfg: "GameCfg",
    GameData: "GameData",
    ObserverMgr: "ObserverMgr",
    UIMgr: "UIMgr"
  } ],
  GameCfg: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b174brNShIHY6GiYN278LY", "GameCfg");
    "use strict";
    var ShopModule = require("ShopModule");
    var GameModule = require("GameModule");
    module.exports = {
      width: null,
      heigth: null,
      curStage: 1,
      stageCfg: null,
      defaultCol: 11,
      ballSpeed: 2e3,
      baseScore: 10,
      lineLength: 1500,
      dotCount: 20,
      ballPlusCount: 30,
      totalStar: 0,
      totalRuby: 1500,
      ballIndex: 8,
      ballData: null,
      init: function init() {
        this.width = cc.view.getVisibleSize().width;
        this.heigth = cc.view.getVisibleSize().height;
        var _curStage = cc.sys.localStorage.getItem("CurStage");
        if (void 0 === _curStage || null === _curStage) {
          _curStage = 1;
          this.saveCurStage(_curStage);
        }
        this.getTotalStar();
        this.getTotalRuby();
        this.initShopData();
        this.initPropertyData();
      },
      saveCurStage: function saveCurStage(value) {
        cc.sys.localStorage.setItem("CurStage", value);
      },
      getCurStage: function getCurStage() {
        return cc.sys.localStorage.getItem("CurStage");
      },
      getStageCfg: function getStageCfg() {
        return JSON.parse(cc.sys.localStorage.getItem("StageCfg"));
      },
      saveStageCfg: function saveStageCfg(obj) {
        cc.sys.localStorage.setItem("StageCfg", JSON.stringify(obj));
      },
      getTotalStar: function getTotalStar() {
        var _star = 0;
        var _stageData = this.getStageCfg();
        for (var _key in _stageData) if (_stageData.hasOwnProperty(_key)) {
          var _elem = _stageData[_key];
          _star += _elem[1];
        }
        this.totalStar = _star;
        return _star;
      },
      getTotalRuby: function getTotalRuby() {
        var _ruby = cc.sys.localStorage.getItem("TotalRuby");
        null !== _ruby && void 0 !== _ruby || (_ruby = 1e3);
        this.totalRuby = _ruby;
        this.saveTotalRuby(this.totalRuby);
        return this.totalRuby;
      },
      saveTotalRuby: function saveTotalRuby(value) {
        cc.sys.localStorage.setItem("TotalRuby", value);
      },
      initShopData: function initShopData() {
        var _shopData = JSON.parse(cc.sys.localStorage.getItem("ShopData"));
        null === _shopData && void 0 === _shopData || (ShopModule = _shopData);
        var _ballIndex = cc.sys.localStorage.getItem("BallIndex");
        null !== _ballIndex && void 0 !== _ballIndex || (_ballIndex = 8);
        this.ballIndex = _ballIndex;
        this.saveShopData();
      },
      saveShopData: function saveShopData() {
        cc.sys.localStorage.setItem("ShopData", JSON.stringify(ShopModule));
        cc.sys.localStorage.setItem("BallIndex", this.ballIndex);
      },
      initPropertyData: function initPropertyData() {
        var _propertyData = JSON.parse(cc.sys.localStorage.getItem("PropertyData"));
        null === _propertyData && void 0 === _propertyData || (GameModule = _propertyData);
        this.savePropertyData();
      },
      savePropertyData: function savePropertyData() {
        cc.sys.localStorage.setItem("PropertyData", JSON.stringify(GameModule));
      }
    };
    cc._RF.pop();
  }, {
    GameModule: "GameModule",
    ShopModule: "ShopModule"
  } ],
  GameData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "414c3IBkbhDco5nAS//o9Sg", "GameData");
    "use strict";
    module.exports = {
      gamedata_savelv: null,
      mapdata: null,
      stageData: null,
      ballCount: null,
      init: function init() {
        this.gamedata_savelv = null;
        this.mapdata = null;
        this.stageData = null;
      },
      initStageData: function initStageData(index) {
        var key = parseInt(index - 1);
        this.stageData = this.mapdata[key].json;
        this.ballCount = this.gamedata_savelv["stageinfo" + index][0];
      },
      getStarNum: function getStarNum(index) {
        return this.gamedata_savelv["stageinfo" + index][1];
      },
      setStarNum: function setStarNum(index, value) {
        this.gamedata_savelv["stageinfo" + index][1] = value;
      }
    };
    cc._RF.pop();
  }, {} ],
  GameLocalMsg: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dfb76QE4xpGtYe+3nEp4w0k", "GameLocalMsg");
    "use strict";
    window.GameLocalMsg = {
      Msg: {
        GoMenu: "GameLocalMsg.Msg.GoMenu",
        GoGame: "GameLocalMsg.Msg.GoGame",
        BallEndPos: "GameLocalMsg.Msg.BallEndPos",
        CanTouch: "GameLocalMsg.Msg.CanTouch",
        End: "GameLocalMsg.Msg.End",
        UpdateScore: "GameLocalMsg.Msg.UpdateScore",
        Pause: "GameLocalMsg.Msg.Pause",
        PauseRetry: "GameLocalMsg.Msg.PauseRetry",
        PauseGoMenu: "GameLocalMsg.Msg.PauseGoMenu",
        InsufficientRuby: "GameLocalMsg.Msg.InsufficientRuby",
        BuyBall: "GameLocalMsg.Msg.BuyBall",
        RefreshRuby: "GameLocalMsg.Msg.RefreshRuby"
      }
    };
    cc._RF.pop();
  }, {} ],
  GameModule: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4dcdfrWaMZD/qiJT4LvmpxH", "GameModule");
    "use strict";
    module.exports = {
      property: [ {
        index: 0,
        price: 100,
        num: 1
      }, {
        index: 0,
        price: 100,
        num: 1
      }, {
        index: 0,
        price: 100,
        num: 2
      }, {
        index: 0,
        price: 100,
        num: 1
      }, {
        index: 0,
        price: 100,
        num: 1
      } ]
    };
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "510fcdf11NMhauiDYuVJDa+", "Game");
    "use strict";
    var GameCfg = require("GameCfg");
    var GameData = require("GameData");
    var UIMgr = require("UIMgr");
    var Observer = require("Observer");
    var ObserverMgr = require("ObserverMgr");
    var ShopModule = require("ShopModule");
    var GameModule = require("GameModule");
    cc.Class({
      extends: Observer,
      properties: {
        addNode: {
          displayName: "addNode",
          default: null,
          type: cc.Node
        },
        _blockPool: null,
        blockPre: {
          displayName: "blockPre",
          default: null,
          type: cc.Prefab
        },
        blockLayer: {
          displayName: "blockLayer",
          default: null,
          type: cc.Node
        },
        _data1: null,
        _data2: null,
        _leftRow: null,
        previewPre: {
          displayName: "previewPre",
          default: null,
          type: cc.Prefab
        },
        _ballPool: null,
        ballPre: {
          displayName: "ballPre",
          default: null,
          type: cc.Prefab
        },
        _ballCount: null,
        ballLayer: {
          displayName: "ballLayer",
          default: null,
          type: cc.Node
        },
        spBall: {
          displayName: "spBall",
          default: null,
          type: cc.Sprite
        },
        lblBallCount: {
          displayName: "lblBallCount",
          default: null,
          type: cc.Label
        },
        spBallTemp: {
          displayName: "spBallTemp",
          default: null,
          type: cc.Sprite
        },
        lblBallCountTemp: {
          displayName: "lblBallCountTemp",
          default: null,
          type: cc.Label
        },
        ballUILayer: {
          displayName: "ballUILayer",
          default: null,
          type: cc.Node
        },
        _ballData: null,
        _canTouch: false,
        _ballPos: null,
        _touchP: null,
        _shootBallCount: null,
        _ballEndPos: null,
        backBallLayer: {
          displayName: "backBallLayer",
          default: null,
          type: cc.Node
        },
        _backBallCount: null,
        bottomLayout: {
          displayName: "bottomLayout",
          default: null,
          type: cc.Node
        },
        btnBack: {
          displayName: "btnBack",
          default: null,
          type: cc.Button
        },
        spWarning: {
          displayName: "spWarning",
          default: null,
          type: cc.Sprite
        },
        _killCount: null,
        _sumScore: null,
        _maxScore: null,
        lblTotalScore: {
          displayName: "lblTotalScore",
          default: null,
          type: cc.Label
        },
        progressBar: {
          displayName: "progressBar",
          default: null,
          type: cc.ProgressBar
        },
        _starNum: 0,
        spStarArr: [ cc.Sprite ],
        hintLayer: {
          displayName: "hintLayer",
          default: null,
          type: cc.Node
        },
        spHintDot: {
          displayName: "spHintDot",
          default: null,
          type: cc.Sprite
        },
        spDot: {
          displayName: "spDot",
          default: null,
          type: cc.Sprite
        },
        dotLayout: {
          displayName: "dotLayout",
          default: null,
          type: cc.Node
        },
        ballPlusFlag: false,
        blockPlusFlag: false,
        propertyLayout: {
          displayName: "propertyLayout",
          default: null,
          type: cc.Node
        },
        shopPre: {
          displayName: "shopPre",
          default: null,
          type: cc.Prefab
        }
      },
      _getMsgList: function _getMsgList() {
        return [ GameLocalMsg.Msg.BallEndPos, GameLocalMsg.Msg.CanTouch, GameLocalMsg.Msg.End, GameLocalMsg.Msg.UpdateScore, GameLocalMsg.Msg.PauseRetry, GameLocalMsg.Msg.PauseGoMenu, GameLocalMsg.Msg.BuyBall ];
      },
      _onMsg: function _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.BallEndPos) {
          if (null === this._ballEndPos) {
            this._ballEndPos = cc.v2(data.x, this.spBall.node.y);
            this.spBallTemp.node.active = true;
            this.spBallTemp.node.position = this._ballEndPos;
          }
          this._showBackBall(data);
        } else if (msg === GameLocalMsg.Msg.CanTouch) {
          this._canTouch = true;
          this._starNum = 1;
          this._updateStar();
        } else if (msg === GameLocalMsg.Msg.End) this._close(); else if (msg === GameLocalMsg.Msg.UpdateScore) {
          this._killCount++;
          this._refreshScore();
        } else if (msg === GameLocalMsg.Msg.PauseRetry) {
          ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
          this._close();
        } else if (msg === GameLocalMsg.Msg.PauseGoMenu) {
          ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoMenu, null);
          this._close();
        } else msg === GameLocalMsg.Msg.BuyBall && this._showUIBall();
      },
      onLoad: function onLoad() {
        this._initMsg();
        this._initPhysics();
        this._blockPool = new cc.NodePool("Block");
        for (var i = 0; i < 121; ++i) {
          var _tempBlockNode = cc.instantiate(this.blockPre);
          this._blockPool.put(_tempBlockNode);
        }
        this.blockLayer.destroyAllChildren();
        this._ballPool = new cc.NodePool("Ball");
        for (var _i2 = 0; _i2 < 80; ++_i2) {
          var _tempBallNode = cc.instantiate(this.ballPre);
          this._ballPool.put(_tempBallNode);
        }
      },
      start: function start() {},
      _initPhysics: function _initPhysics() {
        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;
      },
      initView: function initView() {
        var stageData = GameData.stageData;
        this._data1 = stageData.type.layer1.data;
        this._data2 = stageData.type.layer2.data;
        var len = this._data1.length;
        this._leftRow = len - parseInt(GameCfg.defaultCol);
        this.hintLayer.children.forEach(function(_elem) {
          _elem.active = false;
        });
        for (var i = 0; i < GameCfg.dotCount; ++i) {
          var _dotNode = cc.instantiate(this.spDot.node);
          this.dotLayout.addChild(_dotNode);
        }
        this._sumScore = 0;
        this.lblTotalScore.string = this._sumScore;
        this._calMaxScore();
        this.spStarArr.forEach(function(_spStar) {
          _spStar.node.active = false;
        });
        this._reset();
        this.blockLayer.destroyAllChildren();
        for (var _i3 = len - parseInt(GameCfg.defaultCol); _i3 < len; ++_i3) for (var j = 0; j < GameCfg.defaultCol; ++j) {
          var _type = this._data1[_i3][j];
          var _index = cc.v2(_i3, j);
          this._showBlock(_type, _index, this.blockLayer, this._leftRow);
        }
        this._showPreview(this._data1);
        this._initTouch();
      },
      _synBallCount: function _synBallCount() {
        this._ballCount = GameData.ballCount;
      },
      _showBlock: function _showBlock(type, index, parentNode, leftRow) {
        if (0 === type) return;
        var _blockNode = this._blockPool.get();
        _blockNode || (_blockNode = cc.instantiate(this.blockPre));
        parentNode.addChild(_blockNode);
        _blockNode.getComponent("Block").initView(type, index, parentNode, this._blockPool, leftRow);
      },
      _showPreview: function _showPreview(data) {
        UIMgr.createPrefab(this.previewPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Preview").initView(data, this._blockPool);
        }.bind(this));
      },
      _refreshBallCount: function _refreshBallCount() {
        this.lblBallCount.node.active = true;
        this.lblBallCount.string = "x" + this._ballCount;
      },
      _initTouch: function _initTouch() {
        this._canTouch = false;
        this.ballLayer.on("touchstart", function(event) {
          if (this._canTouch) {
            this._hidePhysics(false);
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this._drawLine(this.spBall.node.position, this._touchP);
          }
        }.bind(this));
        this.ballLayer.on("touchmove", function(event) {
          if (this._canTouch) {
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this._hidePhysics(false);
            this._drawLine(this.spBall.node.position, this._touchP);
          }
        }.bind(this));
        this.ballLayer.on("touchend", function(event) {
          if (this._canTouch) {
            this.hintLayer.children.forEach(function(_elem) {
              _elem.active = false;
            });
            this._hidePhysics(true);
            this.spHintDot.node.active = false;
            this._canTouch = false;
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this.schedule(this._shootBall, .2, this._ballCount - 1, 0);
            this._showBtnBack();
          }
        }.bind(this));
        this.ballLayer.on("touchcancel", function(event) {}.bind(this));
      },
      _hidePhysics: function _hidePhysics(flag) {
        this.blockLayer.children.forEach(function(_elem) {
          if (null !== _elem.getComponent(cc.PhysicsCircleCollider)) {
            _elem.getComponent(cc.PhysicsCircleCollider).enabled = flag;
            return;
          }
          if (null !== _elem.getComponent(cc.PhysicsPolygonCollider)) {
            _elem.getComponent(cc.PhysicsPolygonCollider).enabled = flag;
            return;
          }
        });
      },
      _shootBall: function _shootBall() {
        this._hideWaring();
        var _touchV = this._touchP.sub(this._ballPos).normalizeSelf().mul(GameCfg.ballSpeed);
        var _ballNode = this._ballPool.get();
        _ballNode || (_ballNode = cc.instantiate(this.ballPre));
        this.ballLayer.addChild(_ballNode);
        _ballNode.position = this.spBall.node.position;
        _ballNode.getComponent("Ball").initView(_touchV, this._ballPool);
        this._refreshCurBallCount();
      },
      _drawLine: function _drawLine(p0, p1) {
        var _touchV = p1.sub(p0).normalize();
        var _radian = _touchV.angle(cc.v2(1, 0));
        if (_radian < .14 || _radian > 3) return;
        var _V = _touchV.mul(GameCfg.lineLength);
        var _p0 = p0;
        var _p1 = p0.add(_V);
        var _result = this.physicsManager.rayCast(this.ballLayer.convertToWorldSpaceAR(_p0), this.ballLayer.convertToWorldSpaceAR(_p1))[0];
        var _point = _result.point;
        var _normal = _result.normal;
        var _localPoint = this.ballLayer.convertToNodeSpaceAR(_point);
        this._showHint(_localPoint, _normal, p0);
      },
      _showHint: function _showHint(point, normal, basePos) {
        this.dotLayout.active = true;
        this.spHintDot.node.active = true;
        this.spHintDot.node.position = point;
        var _dirV = point.sub(basePos);
        var _perV = _dirV.div(.7 * GameCfg.dotCount);
        var _midKey = .7 * GameCfg.dotCount;
        for (var key in this.dotLayout.children) if (this.dotLayout.children.hasOwnProperty(key)) {
          var _dotNode = this.dotLayout.children[key];
          _dotNode.position = basePos.add(_perV.mul(key));
          key > _midKey && (0 === normal.y ? _dotNode.x = this.dotLayout.children[_midKey - (key - _midKey)].x : 0 === normal.x && (_dotNode.y = this.dotLayout.children[_midKey - (key - _midKey)].y));
        }
      },
      _showBackBall: function _showBackBall(pos) {
        var _backBall = cc.instantiate(this.spBall.node);
        this.backBallLayer.addChild(_backBall);
        _backBall.getChildByName("lblBallCount").active = false;
        _backBall.y = this.spBall.node.y;
        _backBall.x = pos.x;
        if (pos.x === this._ballEndPos.x && pos.y === this._ballEndPos.y) {
          this._refreshBackBallCount();
          return;
        }
        _backBall.runAction(cc.sequence(cc.moveTo(.1, this._ballEndPos), cc.removeSelf(), cc.callFunc(this._refreshBackBallCount, this)));
      },
      _refreshCurBallCount: function _refreshCurBallCount() {
        this._shootBallCount++;
        this.lblBallCount.string = "x" + parseInt(this._ballCount - this._shootBallCount);
        if (this._shootBallCount === this._ballCount) {
          this.spBall.node.position = this._ballEndPos;
          this.lblBallCount.node.active = false;
        }
      },
      _refreshBackBallCount: function _refreshBackBallCount() {
        this._backBallCount++;
        this.lblBallCountTemp.string = "x" + this._backBallCount;
        if (this._backBallCount === this._ballCount) {
          this._reset();
          this._moveBlocks();
        }
      },
      _reset: function _reset() {
        this._refreshProperty();
        if (this.ballPlusFlag) {
          this.ballPlusFlag = false;
          GameData.ballCount = GameData.ballCount - GameCfg.ballPlusCount;
        } else this.ballPlusCount = false;
        if (this.blockPlusFlag) {
          this.blockPlusFlag = false;
          this.blockLayer.children.forEach(function(_block) {
            "plusBlock" === _block.name && _block.destroy();
          });
        }
        this._killCount = 0;
        this._hideWaring();
        this._synBallCount();
        this._canTouch = true;
        this._showUIBall();
        this._showBtnBack();
        this._ballEndPos = null;
        this._shootBallCount = 0;
        this._backBallCount = 0;
      },
      _showBall: function _showBall() {
        if (null !== this._ballEndPos) this.spBall.node.position = this._ballEndPos; else {
          this.spBall.node.y = -this.ballLayer.height + .5 * this.spBall.node.height;
          this.spBall.node.x = 0;
        }
        this._ballPos = this.spBall.node.position;
        this._refreshBallCount();
      },
      _showUIBall: function _showUIBall() {
        this._ballData = ShopModule.ball[GameCfg.ballIndex];
        var _path = "shop/ball/ball_img_" + this._ballData.type + this._ballData.size + "_0_1";
        "default" === this._ballData.type && (_path = "shop/ball/ball_img_circle18_1_1");
        UIMgr.changeSpImg(_path, this.spBall);
        UIMgr.changeSpImg(_path, this.spBallTemp);
        this.spBall.node.width = this.spBall.node.height = this._ballData.size;
        this.spBallTemp.node.width = this.spBallTemp.node.height = this._ballData.size;
        this.spBall.node.active = !!this._canTouch;
        this.spBallTemp.node.active = !this.spBall.node.active;
        this._showBall();
      },
      _moveBlocks: function _moveBlocks() {
        var _h = this.blockLayer.width / GameCfg.defaultCol;
        var _moveAct = cc.moveBy(.2, cc.p(0, -_h));
        var _blockArr = this.blockLayer.children;
        var _indexMap = [];
        _blockArr.forEach(function(_elem) {
          if (true === _elem.getComponent("Block").isUsed) {
            _elem.getComponent("Block").isUsed = false;
            _elem.destroy();
          } else {
            var _tempIndex = _elem.getComponent("Block")._index;
            _indexMap.push(_tempIndex);
          }
        });
        var _len = this.blockLayer.childrenCount;
        for (var i = _len - 1; i >= 0; --i) {
          var _lastBlock = this.blockLayer.children[i];
          var _script = _lastBlock.getComponent("Block");
          var _type = _script._type;
          var _index = _script._index;
          var _newIndex = _index.add(cc.v2(1, 0));
          if (-1 === [ 11, 12, 13, 16, 17, 20 ].indexOf(_type)) {
            if (!this._canInclude(_newIndex, _indexMap)) {
              _script._index.x++;
              _lastBlock.runAction(_moveAct.clone());
            }
          } else if (12 === _type || 13 === _type || 16 === _type || 17 === _type) {
            var _isOpen = _script._isOpen;
            _script._isOpen = !_isOpen;
            _script.playAct();
          }
        }
        if (this._leftRow > 0) {
          this._leftRow--;
          var _data1 = this._data1[this._leftRow];
          for (var j = 0; j < GameCfg.defaultCol; ++j) {
            var _type2 = _data1[j];
            var _index2 = cc.v2(this._leftRow, j);
            this._showBlock(_type2, _index2, this.blockLayer, this._leftRow);
          }
        }
        this.scheduleOnce(this._refreshEnd, .5);
      },
      _canInclude: function _canInclude(item, arr) {
        return arr.some(function(value) {
          return value.x === item.x && value.y === item.y;
        });
      },
      _showBtnBack: function _showBtnBack() {
        this.bottomLayout.active = !!this._canTouch;
        this.btnBack.node.active = !this.bottomLayout.active;
      },
      onBtnClickToBallBack: function onBtnClickToBallBack() {
        var _this = this;
        this._canTouch = true;
        this._showBtnBack();
        this.unschedule(this._shootBall, this);
        null === this._ballEndPos && (this._ballEndPos = this.spBall.node.position);
        this.ballLayer.children.forEach(function(_elem) {
          _elem.removeComponent(cc.PhysicsCircleCollider);
          _elem.removeComponent(cc.RigidBody);
          _elem.runAction(cc.sequence(cc.moveTo(.1, _this._ballEndPos), cc.callFunc(function() {
            _elem.destroy();
          })));
        });
        this.scheduleOnce(function() {
          _this._reset();
          _this._moveBlocks();
        }, .5);
      },
      _refreshEnd: function _refreshEnd() {
        var _count = this.blockLayer.childrenCount;
        var _leftCount = 0;
        var _arr = [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ];
        for (var i = _count - 1; i >= 0; --i) {
          var _block = this.blockLayer.children[i];
          var _script = _block.getComponent("Block");
          var _type = _script._type;
          if (-1 !== _arr.indexOf(_type)) {
            _leftCount++;
            if (this._checkWaring(_block)) break;
          }
        }
        (0 === _count || _leftCount <= 0) && this._showEnd(true);
      },
      _checkWaring: function _checkWaring(block) {
        var _blockH = this.blockLayer.width / GameCfg.defaultCol;
        var _layerH = this.blockLayer.height;
        var _distance = Math.abs(_layerH + block.y);
        if (_distance <= .5 * _blockH) {
          this._showEnd(false);
          return true;
        }
        if (_distance > .5 * _blockH && _distance < 1.5 * _blockH) {
          this._showWarning();
          return true;
        }
      },
      _showWarning: function _showWarning() {
        var fadeInAct = cc.fadeIn(1);
        var fadeOutAct = cc.fadeOut(1);
        this.spWarning.node.active = true;
        this.spWarning.node.runAction(cc.repeatForever(cc.sequence(fadeInAct, fadeOutAct)));
      },
      _hideWaring: function _hideWaring() {
        this.spWarning.node.stopAllActions();
        this.spWarning.node.active = false;
      },
      _showEnd: function _showEnd(flag) {
        var _data = {
          status: flag,
          stage: GameCfg.getCurStage(),
          starNum: this._starNum
        };
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.End, _data);
      },
      _close: function _close() {
        this._ballPool.clear();
        this._blockPool.clear();
        UIMgr.destroyUI(this);
      },
      _calMaxScore: function _calMaxScore() {
        var _arr = [ 1, 2, 3, 4, 5, 6, 9 ];
        var _len = 0;
        var _len1 = this._data1.length;
        var _len2 = this._data2.length;
        for (var i = 0; i < _len1; ++i) for (var j = 0; j < _len2; ++j) -1 !== _arr.indexOf(this._data1[i][j]) && _len++;
        for (var k = 0; k < _len; ++k) this._maxScore += (k + 1) * GameCfg.baseScore;
      },
      _refreshScore: function _refreshScore() {
        this._sumScore += this._killCount * GameCfg.baseScore;
        this.lblTotalScore.string = this._sumScore;
        this._updateProgressBar();
      },
      _updateProgressBar: function _updateProgressBar() {
        this.progressBar.progress = parseFloat(this._sumScore / this._maxScore).toFixed(1);
        this.progressBar.progress >= .7 && this.progressBar.progress < 1 ? this._starNum = 2 : this.progressBar.progress >= 1 && (this._starNum = 3);
        this._updateStar();
      },
      _updateStar: function _updateStar() {
        var len = this.spStarArr.length;
        for (var i = 0; i < len; ++i) i === this._starNum - 1 && (this.spStarArr[i].node.active = true);
      },
      onBtnClickToPause: function onBtnClickToPause() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.Pause, null);
      },
      onBtnClickToItem: function onBtnClickToItem(e) {
        this._useProperty(parseInt(e.target.name.split("btnItem")[1]));
        switch (e.target.name) {
         case "btnItem0":
          this.blockLayer.children.forEach(function(_elem) {
            var _type = _elem.getComponent("Block")._type;
            var _hp = _elem.getComponent("Block")._hp;
            if (-1 !== [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ].indexOf(_type)) {
              _elem.getComponent("Block")._hp = Math.floor(.5 * _hp);
              _elem.getComponent("Block").refreshHp();
            }
          });
          this.scheduleOnce(this._refreshEnd, .5);
          break;

         case "btnItem1":
          this.ballPlusFlag = true;
          GameData.ballCount = GameData.ballCount + GameCfg.ballPlusCount;
          this._synBallCount();
          this._refreshBallCount();
          break;

         case "btnItem2":
          var _arr = [];
          this.blockLayer.children.forEach(function(_block) {
            var _type = _block.getComponent("Block")._type;
            -1 !== [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ].indexOf(_type) && _arr.push(_block.getLocalZOrder());
          });
          var _max = Math.max.apply(Math, _arr);
          this.blockLayer.children.forEach(function(_block) {
            var _type = _block.getComponent("Block")._type;
            _block.getLocalZOrder() === _max && -1 !== [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ].indexOf(_type) && _block.destroy();
          });
          this.scheduleOnce(this._refreshEnd, .5);
          break;

         case "btnItem3":
          var _xArr = [];
          var _indexMap = [];
          this.blockLayer.children.forEach(function(_block) {
            var _type = _block.getComponent("Block")._type;
            var _index = _block.getComponent("Block")._index;
            if (-1 !== [ 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 16, 17 ].indexOf(_type)) {
              _xArr.push(_index.x);
              _indexMap.push(_index);
            }
          });
          var _xMax = Math.max.apply(Math, _xArr);
          var _xMin = Math.min.apply(Math, _xArr);
          for (var i = 0; i < 4; ++i) {
            var _type = 0;
            _type = i < 2 ? 8 : 7;
            this._showUniqueBlock(_xMin, _xMax, _indexMap, _type);
          }
          break;

         case "btnItem4":
          this.blockPlusFlag = true;
          for (var j = 6; j < 11; ++j) {
            var _type3 = 20;
            var _blockNode = this._blockPool.get();
            _blockNode || (_blockNode = cc.instantiate(this.blockPre));
            this.blockLayer.addChild(_blockNode);
            _blockNode.getComponent("Block").initView(_type3, cc.v2(0, j), this.blockLayer, this._blockPool, 0);
            _blockNode.y = -this.blockLayer.height + .5 * _blockNode.height;
            _blockNode.name = "plusBlock";
          }
        }
      },
      _showUniqueBlock: function _showUniqueBlock(min, max, arr, type) {
        var _r = Math.floor(cc.random0To1() * max) + min;
        var _c = Math.floor(cc.random0To1() * GameCfg.defaultCol);
        var _index = cc.v2(_r, _c);
        this._canInclude(_index, arr) ? this._showUniqueBlock(min, max, arr, type) : this._showBlock(type, _index, this.blockLayer, 0);
      },
      onBtnClickToShop: function onBtnClickToShop() {
        var _i = 1;
        UIMgr.createPrefab(this.shopPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Shop").initView(_i);
        }.bind(this));
      },
      _refreshProperty: function _refreshProperty() {
        var _btnArr = this.propertyLayout.getComponentsInChildren(cc.Button);
        for (var _key in _btnArr) if (_btnArr.hasOwnProperty(_key)) {
          var _elem = GameModule.property[_key];
          _btnArr[_key].node.getChildByName("layout").getComponentInChildren(cc.Label).string = _elem.price;
          _btnArr[_key].node.getChildByName("layout").active = _elem.num <= 0;
          _btnArr[_key].node.getChildByName("lblProperty").active = !_btnArr[_key].node.getChildByName("layout").active;
          _btnArr[_key].node.getChildByName("lblProperty").getComponent(cc.Label).string = "x" + _elem.num;
          _btnArr[_key].interactable = GameModule.property[_key].num > 0 || GameModule.property[_key].price <= GameCfg.totalRuby;
        }
      },
      _useProperty: function _useProperty(i) {
        if (GameModule.property[i].num > 0) {
          GameModule.property[i].num--;
          GameCfg.savePropertyData();
        } else if (GameCfg.totalRuby > GameModule.property[i].price) {
          GameCfg.totalRuby -= GameModule.property[i].price;
          GameCfg.saveTotalRuby(GameCfg.totalRuby);
          ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        }
        this._refreshProperty();
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    GameData: "GameData",
    GameModule: "GameModule",
    Observer: "Observer",
    ObserverMgr: "ObserverMgr",
    ShopModule: "ShopModule",
    UIMgr: "UIMgr"
  } ],
  GiftItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c8de8lM7SxDkKLX1u1I6j29", "GiftItem");
    "use strict";
    var UIMgr = require("UIMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        spType: {
          displayName: "spType",
          default: null,
          type: cc.Sprite
        },
        lblRuby: {
          displayName: "lblRuby",
          default: null,
          type: cc.Label
        },
        lblItem0: {
          displayName: "lblItem0",
          default: null,
          type: cc.Label
        },
        lblItem1: {
          displayName: "lblItem1",
          default: null,
          type: cc.Label
        }
      },
      start: function start() {},
      initView: function initView(data) {
        var _path = "shop/ruby/game_img_" + data.type;
        UIMgr.changeSpImg(_path, this.spType);
        this.lblRuby.string = "x " + data.num;
        this.lblItem0.string = "x " + data.item0;
        this.lblItem1.string = "x " + data.item1;
      }
    });
    cc._RF.pop();
  }, {
    UIMgr: "UIMgr"
  } ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b661+0QiNJiLiiU4qcPA1f", "Loading");
    "use strict";
    var GameData = require("GameData");
    var GameCfg = require("GameCfg");
    var Observer = require("Observer");
    var ObserverMgr = require("ObserverMgr");
    var UIMgr = require("UIMgr");
    cc.Class({
      extends: Observer,
      properties: {},
      _getMsgList: function _getMsgList() {
        return [];
      },
      _onMsg: function _onMsg(msg, data) {},
      start: function start() {
        cc.loader.loadResDir("map", cc.JsonAsset, function(err, asset) {
          if (err) {
            console.log("\u52a0\u8f7d\u5730\u56fejson\u51fa\u9519: ", err);
            return;
          }
          var _savelv = asset.shift();
          var _stageCfg = GameCfg.getStageCfg();
          GameData.gamedata_savelv = void 0 === _stageCfg || null === _stageCfg ? _savelv.json : _stageCfg;
          GameData.mapdata = asset;
          ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoMenu, null);
          this.scheduleOnce(this._close, 1);
        }.bind(this));
      },
      _close: function _close() {
        UIMgr.destroyUI(this);
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    GameData: "GameData",
    Observer: "Observer",
    ObserverMgr: "ObserverMgr",
    UIMgr: "UIMgr"
  } ],
  MainScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9fec2kdV4JJvLAo0c3smCYk", "MainScene");
    "use strict";
    var Observer = require("Observer");
    var UIMgr = require("UIMgr");
    var GameData = require("GameData");
    var GameCfg = require("GameCfg");
    cc.Class({
      extends: Observer,
      properties: {
        addNode: {
          displayName: "addNode",
          default: null,
          type: cc.Node
        },
        loadingPre: {
          displayName: "loadingPre",
          default: null,
          type: cc.Prefab
        },
        menuPre: {
          displayName: "menuPre",
          default: null,
          type: cc.Prefab
        },
        gamePre: {
          displayName: "gamePre",
          default: null,
          type: cc.Prefab
        },
        endPre: {
          displayName: "endPre",
          default: null,
          type: cc.Prefab
        },
        pausePre: {
          displayName: "pausePre",
          default: null,
          type: cc.Prefab
        }
      },
      _getMsgList: function _getMsgList() {
        return [ GameLocalMsg.Msg.GoMenu, GameLocalMsg.Msg.GoGame, GameLocalMsg.Msg.End, GameLocalMsg.Msg.Pause ];
      },
      _onMsg: function _onMsg(msg, data) {
        msg === GameLocalMsg.Msg.GoMenu ? this._initMenu() : msg === GameLocalMsg.Msg.GoGame ? this._initGame() : msg === GameLocalMsg.Msg.End ? this._initEnd(data) : msg === GameLocalMsg.Msg.Pause && this._initPause();
      },
      onLoad: function onLoad() {
        this._initMsg();
        GameData.init();
        GameCfg.init();
        function showAd55918() {
          window.myAd55918 && window.myAd55918.show();
        }
        window.Vijs && (window.myAd55918 = Vijs.setAD({
          unitid: 55918,
          loadedCallback: function loadedCallback() {
            console.log("load success");
            showAd55918();
          },
          rewardedCallback: function rewardedCallback(reward_name, reward_amount) {
            console.log(reward_amount);
          }
        }));
      },
      start: function start() {
        this._initLoading();
      },
      _initLoading: function _initLoading() {
        UIMgr.createPrefab(this.loadingPre, function(root, ui) {
          this.addNode.addChild(root);
        }.bind(this));
      },
      _initMenu: function _initMenu() {
        UIMgr.createPrefab(this.menuPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Menu").initView();
        }.bind(this));
      },
      _initGame: function _initGame() {
        UIMgr.createPrefab(this.gamePre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Game").initView();
        }.bind(this));
      },
      _initEnd: function _initEnd(data) {
        UIMgr.createPrefab(this.endPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("End").initView(data);
        }.bind(this));
      },
      _initPause: function _initPause() {
        UIMgr.createPrefab(this.pausePre, function(root, ui) {
          this.addNode.addChild(root);
        }.bind(this));
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    GameData: "GameData",
    Observer: "Observer",
    UIMgr: "UIMgr"
  } ],
  Menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "80f9eR/jklLmq/GgchEd05w", "Menu");
    "use strict";
    var GameData = require("GameData");
    var Observer = require("Observer");
    var UIMgr = require("UIMgr");
    var GameCfg = require("GameCfg");
    var SignModule = require("SignModule");
    cc.Class({
      extends: Observer,
      properties: {
        _stageNodePool: null,
        stagePre: {
          displayName: "stagePre",
          default: null,
          type: cc.Prefab
        },
        scrollView: {
          displayName: "scrollView",
          default: null,
          type: cc.ScrollView
        },
        lblRuby: {
          displayName: "lblRuby",
          default: null,
          type: cc.Label
        },
        lblTime: {
          displayName: "lblTime",
          default: null,
          type: cc.Label
        },
        lblStar: {
          displayName: "lblStar",
          default: null,
          type: cc.Label
        },
        _preloadedInterstitial: null,
        addNode: {
          displayName: "addNode",
          default: null,
          type: cc.Node
        },
        shopPre: {
          displayName: "shopPre",
          default: null,
          type: cc.Prefab
        },
        signPre: {
          displayName: "signPre",
          default: null,
          type: cc.Prefab
        },
        loginTime: null
      },
      _getMsgList: function _getMsgList() {
        return [ GameLocalMsg.Msg.GoGame, GameLocalMsg.Msg.RefreshRuby ];
      },
      _onMsg: function _onMsg(msg, data) {
        msg === GameLocalMsg.Msg.GoGame ? this._close() : msg === GameLocalMsg.Msg.RefreshRuby && (this.lblRuby.string = GameCfg.totalRuby);
      },
      onLoad: function onLoad() {
        this._initMsg();
        var len = 30;
        this._stageNodePool = new cc.NodePool("Stage");
        for (var i = 0; i < len; ++i) {
          var _tempNode = cc.instantiate(this.stagePre);
          this._stageNodePool.put(_tempNode);
        }
      },
      start: function start() {},
      initView: function initView() {
        this._showSign();
        this.scrollView.content.destroyAllChildren();
        var len = GameData.mapdata.length;
        for (var i = 0; i < len; ++i) {
          var _stageNode = this._stageNodePool.get();
          _stageNode || (_stageNode = cc.instantiate(this.stagePre));
          this.scrollView.content.addChild(_stageNode);
          _stageNode.getComponent("Stage").initView(i + 1);
        }
        this.lblStar.string = GameCfg.totalStar;
        this.lblRuby.string = GameCfg.totalRuby;
      },
      _close: function _close() {
        UIMgr.destroyUI(this);
      },
      onBtnClickToShareGame: function onBtnClickToShareGame() {
        console.log("share>>>: ");
        console.log('cc.find("canvas"): ', cc.find("canvas"));
        if ("undefined" === typeof FBInstant) return;
        FBInstant.shareAsync({
          intent: "SHARE",
          image: this.getImgBase64(),
          text: "X is asking for your help!",
          data: {
            myReplayData: "..."
          }
        }).then(function() {
          console.log("well done: ");
        });
      },
      getImgBase64: function getImgBase64() {
        var target = cc.find("Canvas");
        var width = 1080;
        var height = 1920;
        var renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
          var texture = renderTexture.getSprite().getTexture();
          var image = texture.getHtmlElementObj();
          ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
          var buffer = gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
          var _texture = renderTexture.getSprite().getTexture()._glID;
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _texture, 0);
          var data = new Uint8Array(width * height * 4);
          gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          var rowBytes = 4 * width;
          for (var row = 0; row < height; row++) {
            var srow = height - 1 - row;
            var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
            var imageData = new ImageData(data2, width, 1);
            ctx.putImageData(imageData, 0, row);
          }
        }
        return canvas.toDataURL("image/png");
      },
      onBtnClickToShowAd: function onBtnClickToShowAd() {
        console.log("showAd: ");
        this._preloadedInterstitial.showAsync().then(function() {
          console.log("Interstitial ad finished successfully");
        }).catch(function(e) {
          console.error(e.message);
        });
      },
      captureScreenshot: function captureScreenshot() {
        function callback() {
          var _this = this;
          var canvas = document.getElementById("GameCanvas");
          var base64 = canvas.toDataURL("image/png");
          cc.director.off(cc.Director.EVENT_AFTER_DRAW);
          var frame = this.base64ToSpriteFrame(base64, function(frame) {
            _this.sprite.spriteFrame = frame;
          });
        }
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, callback.bind(this));
      },
      base64ToSpriteFrame: function base64ToSpriteFrame(base64, callback) {
        var img = new Image();
        img.src = base64;
        img.onload = function() {
          var texture = new cc.Texture2D();
          texture.initWithElement(img);
          texture.handleLoadedTexture();
          var newframe = new cc.SpriteFrame(texture);
          callback && callback(newframe);
        };
      },
      onBtnClickToShop: function onBtnClickToShop(e) {
        var i = 0;
        "mainmenu_btn_shop" === e.target.name ? i = 0 : "mainmenu_btn_ball" === e.target.name && (i = 1);
        UIMgr.createPrefab(this.shopPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Shop").initView(i);
        }.bind(this));
      },
      onBtnClickToSign: function onBtnClickToSign() {
        UIMgr.createPrefab(this.signPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Sign").initView();
        }.bind(this));
      },
      _showSign: function _showSign() {
        SignModule.initSignData();
        if (SignModule.signData.isSigned) return;
        UIMgr.createPrefab(this.signPre, function(root, ui) {
          this.addNode.addChild(root);
          ui.getComponent("Sign").initView();
        }.bind(this));
      },
      showAd55918: function showAd55918() {
        window.myAd55918 && window.myAd55918.show();
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    GameData: "GameData",
    Observer: "Observer",
    SignModule: "SignModule",
    UIMgr: "UIMgr"
  } ],
  ObserverMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1854fcKNs5AqIfuYH778O5P", "ObserverMgr");
    "use strict";
    module.exports = {
      obsArray: {},
      addEventListener: function addEventListener(msg, func, ob) {
        "undefined" === typeof ob && console.log("[ObserverMgr] \u6ce8\u518c\u6d88\u606f [%s]:%s \u7684\u4f5c\u7528\u4e8e\u672a\u5b9a\u4e49", msg, func.name);
        var obs = this.obsArray[msg];
        "undefined" === typeof obs && (this.obsArray[msg] = []);
        for (var k = 0; k < this.obsArray[msg].length; k++) {
          var item = this.obsArray[msg][k];
          if (item["func"] === func && item["ob"] === ob) return;
        }
        this.obsArray[msg].push({
          func: func,
          ob: ob
        });
      },
      removeEventListener: function removeEventListener(msg, func, ob) {
        var b = false;
        var msgCBArray = this.obsArray[msg];
        if (msgCBArray) for (var i = 0; i < msgCBArray.length; ) {
          var msgCBItem = msgCBArray[i];
          var itemFunc = msgCBItem["func"];
          var itemOb = msgCBItem["ob"];
          if (func === itemFunc && ob === itemOb) {
            msgCBArray.splice(i, 1);
            b = true;
          } else i++;
        }
        return b;
      },
      removeEventListenerWithObject: function removeEventListenerWithObject(ob) {
        for (var k in this.obsArray) {
          var msgCBArray = this.obsArray[k];
          for (var i = 0; i < msgCBArray.length; ) {
            var msgCBItem = msgCBArray[i];
            msgCBItem["ob"] === ob ? msgCBArray.splice(i, 1) : i++;
          }
        }
      },
      cleanAllEventListener: function cleanAllEventListener() {
        this.obsArray = {};
      },
      dispatchMsg: function dispatchMsg(msg, data) {
        var obs = this.obsArray[msg];
        if ("undefined" !== typeof obs) for (var k = 0; k < obs.length; k++) {
          var item = obs[k];
          var func = item["func"];
          var ob = item["ob"];
          func && ob && func.apply(ob, [ msg, data ]);
        } else console.log("\u6d88\u606f\u5217\u8868\u4e2d\u4e0d\u5b58\u5728: " + msg);
      }
    };
    cc._RF.pop();
  }, {} ],
  Observer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1b995iNs3hBaYFkdjCujf8W", "Observer");
    "use strict";
    var ObserverMgr = require("ObserverMgr");
    cc.Class({
      extends: cc.Component,
      _initMsg: function _initMsg() {
        var list = this._getMsgList();
        for (var k = 0; k < list.length; k++) {
          var msg = list[k];
          ObserverMgr.addEventListener(msg, this._onMsg, this);
        }
      },
      onLoad: function onLoad() {},
      _getMsgList: function _getMsgList() {
        return [];
      },
      _onMsg: function _onMsg(msg, data) {},
      _onError: function _onError(msg, code, data) {},
      _onNetOpen: function _onNetOpen() {},
      _onErrorDeal: function _onErrorDeal(errorMsgString, data) {
        var msgString = data[0];
        var errorCode = data[1];
        var errorData = data[2];
        this._onError(msgString, errorCode, errorData);
      },
      onDisable: function onDisable() {
        ObserverMgr.removeEventListenerWithObject(this);
      },
      onEnable: function onEnable() {},
      onDestroy: function onDestroy() {
        ObserverMgr.removeEventListenerWithObject(this);
      }
    });
    cc._RF.pop();
  }, {
    ObserverMgr: "ObserverMgr"
  } ],
  Pause: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee964sQPjFG5ZPj4wpAB943", "Pause");
    "use strict";
    var UIMgr = require("UIMgr");
    var ObserverMgr = require("ObserverMgr");
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onBtnClickToMenu: function onBtnClickToMenu() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.PauseGoMenu, null);
        UIMgr.destroyUI(this);
      },
      onBtnClickToRetry: function onBtnClickToRetry() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.PauseRetry, null);
        UIMgr.destroyUI(this);
      },
      onBtnClickToContinue: function onBtnClickToContinue() {
        UIMgr.destroyUI(this);
      }
    });
    cc._RF.pop();
  }, {
    ObserverMgr: "ObserverMgr",
    UIMgr: "UIMgr"
  } ],
  Preview: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ba501FJe8BLaLHzMn1chAqK", "Preview");
    "use strict";
    var UIMgr = require("UIMgr");
    var GameCfg = require("GameCfg");
    var ObserverMgr = require("ObserverMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        blockLayer: {
          displayName: "blockLayer",
          default: null,
          type: cc.Node
        },
        blockPre: {
          displayName: "blockPre",
          default: null,
          type: cc.Prefab
        },
        spBg: {
          displayName: "spBg",
          default: null,
          type: cc.Sprite
        },
        _blockPool: null
      },
      start: function start() {},
      initView: function initView(data, pool) {
        this._blockPool = pool;
        var row = data.length;
        var col = GameCfg.defaultCol;
        var w = this.spBg.node.width / GameCfg.defaultCol;
        this.spBg.node.height = w * row * 1.5;
        for (var i = 0; i < row; ++i) for (var j = 0; j < col; ++j) {
          var _type = data[i][j];
          var _index = cc.v2(i, j);
          this._showBlock(_type, _index, this.blockLayer, this._blockPool);
        }
        this.scheduleOnce(this._close, 3);
      },
      _close: function _close() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.CanTouch, null);
        UIMgr.destroyUI(this);
      },
      _showBlock: function _showBlock(type, index, parentNode, pool) {
        if (0 === type) return;
        var _blockNode = this._blockPool.get();
        _blockNode || (_blockNode = cc.instantiate(this.blockPre));
        parentNode.addChild(_blockNode);
        _blockNode.getComponent("Block").initView(type, index, parentNode, pool, 0, true);
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    ObserverMgr: "ObserverMgr",
    UIMgr: "UIMgr"
  } ],
  RubyItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "81797ZOxeJNYbDNsReKjzyU", "RubyItem");
    "use strict";
    var UIMgr = require("UIMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblType: {
          displayName: "lblType",
          default: null,
          type: cc.Label
        },
        spHot: {
          displayName: "spHot",
          default: null,
          type: cc.Sprite
        },
        spType: {
          displayName: "spType",
          default: null,
          type: cc.Sprite
        },
        lblName: {
          displayName: "lblName",
          default: null,
          type: cc.Label
        },
        btnBuy: {
          displayName: "btnBuy",
          default: null,
          type: cc.Button
        },
        btnVideo: {
          displayName: "btnVideo",
          default: null,
          type: cc.Button
        }
      },
      start: function start() {},
      initView: function initView(data) {
        this.lblType.string = data.type;
        null !== data.typePath ? UIMgr.changeSpImg(data.typePath, this.spHot) : this.spHot.node.active = false;
        var _path = "shop/ruby/game_img_" + data.path;
        UIMgr.changeSpImg(_path, this.spType);
        this.lblName.string = data.name;
        this.btnVideo.node.active = "\u514d\u8d39" === data.type;
        this.btnBuy.node.active = "\u514d\u8d39" !== data.type;
      }
    });
    cc._RF.pop();
  }, {
    UIMgr: "UIMgr"
  } ],
  ShopModule: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19070jFMvFHvalWIlIlQGYN", "ShopModule");
    "use strict";
    module.exports = {
      ruby: [ {
        typePath: "shop/ruby/shop_btn_hot",
        type: "\u70ed\u5356",
        path: "mzq",
        name: "\u9ec4\u91d1\u63cf\u51c6"
      }, {
        typePath: "shop/ruby/shop_btn_hot",
        type: "\u70ed\u5356",
        path: "ads_1",
        name: "\u79fb\u9664\u5e7f\u544a"
      }, {
        typePath: "shop/ruby/shop_btn_free",
        type: "\u514d\u8d39",
        path: "ruby1",
        name: "20"
      }, {
        typePath: null,
        type: "",
        path: "ruby2",
        name: "100"
      }, {
        typePath: null,
        type: "",
        path: "ruby3",
        name: "200"
      }, {
        typePath: null,
        type: "",
        path: "ruby4",
        name: "300"
      }, {
        typePath: "shop/ruby/shop_btn_bq",
        type: "+10%",
        path: "ruby5",
        name: "550"
      }, {
        typePath: "shop/ruby/shop_btn_bq",
        type: "+15",
        path: "ruby6",
        name: "1150"
      }, {
        typePath: "shop/ruby/shop_btn_bq",
        type: "+20%",
        path: "ruby7",
        name: "3600"
      }, {
        typePath: "shop/ruby/shop_btn_bq",
        type: "+25%",
        path: "ruby8",
        name: "6250"
      }, {
        typePath: "shop/ruby/shop_btn_bq",
        type: "+50%",
        path: "ruby9",
        name: "15000"
      } ],
      ball: [ {
        index: 0,
        type: "circle",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 1,
        type: "triangle",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 2,
        type: "diamond",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 3,
        type: "javelin",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 4,
        type: "pentagon",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 5,
        type: "star",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 6,
        type: "flower",
        size: 14,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 7,
        type: "circle",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 8,
        type: "default",
        size: 18,
        isUsed: true,
        price: 1e3,
        hasOwned: true
      }, {
        index: 9,
        type: "triangle",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 10,
        type: "diamond",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 11,
        type: "javelin",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 12,
        type: "pentagon",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 13,
        type: "star",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 14,
        type: "flower",
        size: 18,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 15,
        type: "circle",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 16,
        type: "triangle",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 17,
        type: "diamond",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 18,
        type: "javelin",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 19,
        type: "pentagon",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 20,
        type: "star",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 21,
        type: "flower",
        size: 22,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 22,
        type: "circle",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 23,
        type: "triangle",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 24,
        type: "diamond",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 25,
        type: "javelin",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 26,
        type: "pentagon",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 27,
        type: "star",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 28,
        type: "flower",
        size: 26,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 29,
        type: "circle",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 30,
        type: "triangle",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 31,
        type: "diamond",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 32,
        type: "javelin",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 33,
        type: "pentagon",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 34,
        type: "star",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      }, {
        index: 35,
        type: "flower",
        size: 30,
        isUsed: false,
        price: 1e3,
        hasOwned: false
      } ],
      gift: [ {
        type: "ruby5",
        num: 5e3,
        item0: 15,
        item1: 15
      }, {
        type: "ruby7",
        num: 12e3,
        item0: 33,
        item1: 33
      } ]
    };
    cc._RF.pop();
  }, {} ],
  Shop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd85cSwzaFEz7ud5ENhIr4W", "Shop");
    "use strict";
    var UIMgr = require("UIMgr");
    var ShopModule = require("ShopModule");
    var Observer = require("Observer");
    var GameCfg = require("GameCfg");
    cc.Class({
      extends: Observer,
      properties: {
        scrollView: {
          displayName: "scrollView",
          default: null,
          type: cc.ScrollView
        },
        ballItemPre: {
          displayName: "ballItemPre",
          default: null,
          type: cc.Prefab
        },
        rubyItemPre: {
          displayName: "rubyItemPre",
          default: null,
          type: cc.Prefab
        },
        giftItemPre: {
          displayName: "giftItemPre",
          default: null,
          type: cc.Prefab
        },
        btnRuby: {
          displayName: "btnRuby",
          default: null,
          type: cc.Button
        },
        btnBall: {
          displayName: "btnBall",
          default: null,
          type: cc.Button
        },
        btnGift: {
          displayName: "btnGift",
          default: null,
          type: cc.Button
        },
        lblTotalRuby: {
          displayName: "lblTotalRuby",
          default: null,
          type: cc.Label
        }
      },
      _getMsgList: function _getMsgList() {
        return [ GameLocalMsg.Msg.InsufficientRuby, GameLocalMsg.Msg.RefreshRuby ];
      },
      _onMsg: function _onMsg(msg, data) {
        msg === GameLocalMsg.Msg.InsufficientRuby ? this.initView(0) : msg === GameLocalMsg.Msg.RefreshRuby && this._refreshTotalRuby();
      },
      onLoad: function onLoad() {
        this._initMsg();
      },
      start: function start() {},
      onBtnClickToClose: function onBtnClickToClose() {
        UIMgr.destroyUI(this);
      },
      initView: function initView(i) {
        this._showShadow(i);
        0 === i ? this._showRuby() : 1 === i ? this._showBall() : 2 === i && this._showGift();
        this._refreshTotalRuby();
      },
      _showBall: function _showBall() {
        this.scrollView.content.destroyAllChildren();
        var _ballData = ShopModule.ball;
        for (var _key in _ballData) if (_ballData.hasOwnProperty(_key)) {
          var _elem = _ballData[_key];
          var _ballItem = cc.instantiate(this.ballItemPre);
          this.scrollView.content.addChild(_ballItem);
          _ballItem.getComponent("BallItem").initView(_elem);
        }
      },
      _showRuby: function _showRuby() {
        this.scrollView.content.destroyAllChildren();
        var _rubyData = ShopModule.ruby;
        for (var _key in _rubyData) if (_rubyData.hasOwnProperty(_key)) {
          var _elem = _rubyData[_key];
          var _rubyItem = cc.instantiate(this.rubyItemPre);
          this.scrollView.content.addChild(_rubyItem);
          _rubyItem.getComponent("RubyItem").initView(_elem);
        }
      },
      _showShadow: function _showShadow(i) {
        this.btnRuby.node.getChildByName("spShadow").active = 0 !== i;
        this.btnBall.node.getChildByName("spShadow").active = 1 !== i;
        this.btnGift.node.getChildByName("spShadow").active = 2 !== i;
      },
      _showGift: function _showGift() {
        this.scrollView.content.destroyAllChildren();
        var _giftData = ShopModule.gift;
        for (var _key in _giftData) if (_giftData.hasOwnProperty(_key)) {
          var _elem = _giftData[_key];
          var _giftItem = cc.instantiate(this.giftItemPre);
          this.scrollView.content.addChild(_giftItem);
          _giftItem.getComponent("GiftItem").initView(_elem);
        }
      },
      onBtnClickToSubItem: function onBtnClickToSubItem(e) {
        if (!e.target.getChildByName("spShadow").active) return;
        var i = 0;
        "btnRuby" === e.target.name ? i = 0 : "btnBall" === e.target.name ? i = 1 : "btnGift" === e.target.name && (i = 2);
        this.initView(i);
      },
      _refreshTotalRuby: function _refreshTotalRuby() {
        this.lblTotalRuby.string = GameCfg.totalRuby;
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    Observer: "Observer",
    ShopModule: "ShopModule",
    UIMgr: "UIMgr"
  } ],
  SignModule: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "03b6eMPSb1MkKNqWGgd1iTq", "SignModule");
    "use strict";
    module.exports = {
      signData: null,
      reward: {
        day0: {
          isChecked: false
        },
        day1: {
          isChecked: false
        },
        day2: {
          isChecked: false
        },
        day3: {
          isChecked: false
        },
        day4: {
          isChecked: false
        },
        day5: {
          isChecked: false
        },
        day6: {
          isChecked: false
        }
      },
      initSignData: function initSignData() {
        this.signData = JSON.parse(cc.sys.localStorage.getItem("Sign"));
        null !== this.signData && void 0 !== this.signData || (this.signData = {
          isSigned: false,
          videoSigned: false,
          time: new Date(),
          reward: this.reward
        });
        var _curTime = new Date();
        var _lastTime = new Date(this.signData.time);
        _lastTime.setHours(23, 59, 59);
        if (_curTime.getTime() > _lastTime.getTime()) {
          this.signData.time = _curTime;
          this.signData.isSigned = false;
          this.saveSignData(this.signData);
        }
        return this.signData;
      },
      saveSignData: function saveSignData(data) {
        cc.sys.localStorage.setItem("Sign", JSON.stringify(data));
      }
    };
    cc._RF.pop();
  }, {} ],
  Sign: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d2b2kePsJIG5DM6BCV1xHw", "Sign");
    "use strict";
    var UIMgr = require("UIMgr");
    var SignModule = require("SignModule");
    var GameCfg = require("GameCfg");
    var ObserverMgr = require("ObserverMgr");
    cc.Class({
      extends: cc.Component,
      properties: {
        spDayArr: [ cc.Sprite ],
        _rewardArr: [],
        btnGot: {
          displayName: "btnGot",
          default: null,
          type: cc.Button
        },
        btnDoubleGot: {
          displayName: "btnDoubleGot",
          default: null,
          type: cc.Button
        },
        lblTime: {
          displayName: "lblTime",
          default: null,
          type: cc.Label
        },
        lblVideo: {
          displayName: "lblVideo",
          default: null,
          type: cc.Label
        }
      },
      onLoad: function onLoad() {},
      start: function start() {},
      initView: function initView() {
        this.unschedule(this._showLeftTime);
        this._rewardArr = [];
        for (var _key in SignModule.signData.reward) if (SignModule.signData.reward.hasOwnProperty(_key)) {
          var _elem = SignModule.signData.reward[_key];
          this._rewardArr.push(_elem);
        }
        for (var _key2 in this._rewardArr) if (this._rewardArr.hasOwnProperty(_key2)) {
          var _elem2 = this._rewardArr[_key2];
          this.spDayArr[_key2].node.getChildByName("check").active = this.spDayArr[_key2].node.getChildByName("spCheckBg").active = _elem2.isChecked;
        }
        this.btnGot.interactable = !SignModule.signData.isSigned;
        this.btnDoubleGot.interactable = !SignModule.signData.videoSigined;
        this.lblVideo.string = SignModule.signData.videoSigined ? "\u5df2\u9886\u53d6" : "\u52a0\u500d";
        if (SignModule.signData.isSigned) {
          this._showLeftTime();
          this.schedule(this._showLeftTime, 1);
        } else this.lblTime.string = "\u9886\u53d6";
      },
      onBtnClickToClose: function onBtnClickToClose() {
        this.unschedule(this._showLeftTime);
        UIMgr.destroyUI(this);
      },
      onBtnClickToGot: function onBtnClickToGot() {
        var _plusRuby = 0;
        var _now = new Date();
        var _curWeekday = _now.getDay();
        0 === _curWeekday && (_curWeekday = 7);
        3 === _curWeekday ? _plusRuby = 50 : 5 === _curWeekday ? _plusRuby = 100 : 7 === _curWeekday && (_plusRuby = 150);
        GameCfg.totalRuby += _plusRuby;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        var _key = parseInt(_curWeekday - 1);
        SignModule.signData.reward["day" + _key].isChecked = true;
        SignModule.signData.isSigned = true;
        SignModule.saveSignData(SignModule.signData);
        SignModule.reward = SignModule.signData.reward;
        this.initView();
      },
      _showLeftTime: function _showLeftTime() {
        var _curTime = new Date();
        var _now = _curTime.getTime();
        _curTime.setHours(23, 59, 59);
        var _end = _curTime.getTime();
        var _leftSeconds = (_end - _now) / 1e3;
        var _h = Math.floor(_leftSeconds / 3600 % 24);
        var _m = Math.floor(_leftSeconds / 60 % 60);
        var _s = Math.floor(_leftSeconds % 60);
        this.lblTime.string = _h + ":" + _m + ":" + _s;
      },
      onBtnClickToVideo: function onBtnClickToVideo() {
        var _plusRuby = 0;
        var _now = new Date();
        var _curWeekday = _now.getDay();
        0 === _curWeekday && (_curWeekday = 7);
        _plusRuby = 3 === _curWeekday ? 100 : 5 === _curWeekday ? 200 : 7 === _curWeekday ? 300 : 50;
        GameCfg.totalRuby += _plusRuby;
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.RefreshRuby, null);
        SignModule.signData.videoSigined = true;
        SignModule.saveSignData(SignModule.signData);
        this.initView();
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    ObserverMgr: "ObserverMgr",
    SignModule: "SignModule",
    UIMgr: "UIMgr"
  } ],
  Stage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1bd57as/OdGGqNjyCMrgJlW", "Stage");
    "use strict";
    var GameCfg = require("GameCfg");
    var UIMgr = require("UIMgr");
    var ObserverMgr = require("ObserverMgr");
    var GameData = require("GameData");
    cc.Class({
      extends: cc.Component,
      properties: {
        spStage: {
          displayName: "spStage",
          default: null,
          type: cc.Sprite
        },
        lblStage: {
          displayName: "lblStage",
          default: null,
          type: cc.Label
        },
        _index: null,
        _canChoose: false,
        starArr: [ cc.Sprite ]
      },
      onLoad: function onLoad() {
        this._canChoose = false;
        this.lblStage.node.active = false;
        this.starArr.forEach(function(spStar) {
          spStar.node.active = false;
        });
      },
      start: function start() {},
      initView: function initView(index) {
        this._index = index;
        if (GameCfg.getCurStage() >= index) {
          this._canChoose = true;
          this.lblStage.node.active = true;
          this.lblStage.string = index;
          var path = "menu/mainmenu_img_stageunlockbg";
          UIMgr.changeSpImg(path, this.spStage);
          var _starNum = GameData.getStarNum(index);
          if (void 0 === _starNum) return;
          this._showStageStar(_starNum);
        }
      },
      _showStageStar: function _showStageStar(starNum) {
        for (var i = 0; i < starNum; ++i) this.starArr[i].node.active = true;
      },
      onBtnClickToStage: function onBtnClickToStage() {
        if (!this._canChoose) return;
        GameData.initStageData(this._index);
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.GoGame, null);
      }
    });
    cc._RF.pop();
  }, {
    GameCfg: "GameCfg",
    GameData: "GameData",
    ObserverMgr: "ObserverMgr",
    UIMgr: "UIMgr"
  } ],
  UIMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73f81Ikm3NJvIaB1fgU1TS5", "UIMgr");
    "use strict";
    module.exports = {
      _uiMap: {},
      createPrefabAddToRunningScene: function createPrefabAddToRunningScene(UIPrefab, createCallBack) {
        var _this = this;
        if (!UIPrefab) {
          cc.log("[UIMgr] \u65e0\u6cd5\u521b\u5efaPrefab\uff1a" + UIPrefab);
          return;
        }
        cc.loader.loadRes("common/prefab/ComUIBg", function(err, prefab) {
          var nodeBg = cc.instantiate(prefab);
          var scriptBg = nodeBg.getComponent("ComUIBg");
          if (scriptBg) {
            var uiNode = scriptBg.addUI(UIPrefab);
            var uuid = uiNode.uuid.toString();
            cc.log("add uuid: " + uuid);
            _this._uiMap[uuid] = nodeBg;
            var scene = cc.director.getScene();
            if (scene) {
              var w = cc.view.getVisibleSize().width;
              var h = cc.view.getVisibleSize().height;
              nodeBg.x = w / 2;
              nodeBg.y = h / 2;
              scene.addChild(nodeBg);
              createCallBack && createCallBack(uiNode);
              return;
            }
            cc.log("[UIMgr] \u6ca1\u6709\u8fd0\u884cScene,\u65e0\u6cd5\u6dfb\u52a0ui\u754c\u9762\uff01");
          }
        });
      },
      destroyUI: function destroyUI(script) {
        if (script) {
          if (script.node) {
            var uuid = script.node.uuid.toString();
            var rootNode = this._uiMap[uuid];
            if (rootNode) {
              rootNode.destroy();
              this._uiMap[script.node.uuid.toString()] = null;
              return;
            }
            cc.log("[UIMgr] " + script.name + " \u6ca1\u6709node\u5c5e\u6027");
            return;
          }
          cc.log("[UIMgr] " + script.name + " \u6ca1\u6709node\u5c5e\u6027");
          return;
        }
        cc.log("[UIMgr] \u7f3a\u5c11\u53c2\u6570");
      },
      createPrefab: function createPrefab(UIPrefab, createCallBack) {
        var _this2 = this;
        if (!UIPrefab) {
          cc.log("[UIMgr] \u65e0\u6cd5\u521b\u5efaPrefab\uff1a" + UIPrefab);
          return;
        }
        cc.loader.loadRes("common/prefab/ComUIBg", function(err, prefab) {
          if (err) {
            cc.log(err.errorMessage);
            return;
          }
          var nodeBg = cc.instantiate(prefab);
          var scriptBg = nodeBg.getComponent("ComUIBg");
          if (scriptBg) {
            var uiNode = scriptBg.addUI(UIPrefab);
            var uuid = uiNode.uuid.toString();
            _this2._uiMap[uuid] = nodeBg;
            createCallBack && createCallBack(nodeBg, uiNode);
          }
        });
      },
      changeSpImg: function changeSpImg(path, sprite) {
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame) {
          if (err) {
            console.log("\u66f4\u6362\u56fe\u7247\u9519\u8bef: ", err);
            return;
          }
          sprite.spriteFrame = spriteFrame;
        });
      }
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "Observer", "ObserverMgr", "ComUIBg", "UIMgr", "MainScene", "AudioMgr", "ButtonClickSound", "End", "Ball", "Block", "Game", "GameModule", "Preview", "GameCfg", "GameData", "Loading", "Menu", "Sign", "SignModule", "Stage", "GameLocalMsg", "Pause", "BallItem", "GiftItem", "RubyItem", "Shop", "ShopModule" ]);
//# sourceMappingURL=project.dev.js.map