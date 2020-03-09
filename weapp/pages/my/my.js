"use strict";

var _core = _interopRequireDefault(require('../../vendor.js')(0));

var _eventHub = _interopRequireDefault(require('../../common/eventHub.js'));

var _x = require('../../vendor.js')(4);

var _store = _interopRequireDefault(require('../../store/index.js'));

var _test = _interopRequireDefault(require('../../mixins/test.js'));

var _request = _interopRequireDefault(require('../../utils/request.js'));

var _toast = _interopRequireDefault(require('../../components/vant/toast/toast.js'));

var _dialog = _interopRequireDefault(require('../../components/vant/dialog/dialog.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = getApp();

_core["default"].page({
  store: _store["default"],
  config: {
    navigationBarTitleText: 'test'
  },
  hooks: {
    // Page 级别 hook, 只对当前 Page 的 setData 生效。
    'before-setData': function beforeSetData(dirty) {}
  },
  mixins: [_test["default"]],
  data: {
    baseUrl: app.$wepy.$options.globalData.baseUrl,
    info: {},
    userInfo: {},
    isRegister: false,
    loaded: false
  },
  methods: {
    scanCode: function scanCode() {
      wx.scanCode({
        success: function success(res) {
          console.log(res);

          if (res.path) {
            wx.reLaunch({
              url: res.path
            });
          }
        }
      });
    },
    getOpenid: function getOpenid(code, data) {
      var _this = this;

      _request["default"].get('api/schoolbox/GetUid', {
        code: code
      }).then(function (res) {
        wx.setStorageSync('openid', res.data.openid);

        _this.userInfoUpdate({
          nickname: data.$wx.detail.userInfo.nickName,
          avatar: data.$wx.detail.userInfo.avatarUrl
        });
      });
    },
    onGotUserInfo: function onGotUserInfo(res) {
      console.log(res);
      var that = this;

      if (res.$wx.detail.errMsg === 'getUserInfo:ok') {
        wx.login({
          success: function success(data) {
            console.log(data);
            wx.setStorageSync('userInfo', JSON.stringify({
              nickname: res.$wx.detail.userInfo.nickName,
              avatar: res.$wx.detail.userInfo.avatarUrl
            }));
            var userInfo = wx.getStorageSync('userInfo');

            if (userInfo) {
              that.userInfo = JSON.parse(userInfo);
            }

            var openid = wx.getStorageSync('openid');
            if (openid) return;
            that.getOpenid(data.code, res);
          }
        });
      }
    },
    linkTo: function linkTo(url) {
      this.navigateTo(url); // this.getUserStatus(() => {
      //   this.navigateTo(url)
      // })
    },
    getUserStatus: function getUserStatus(cb) {
      var _this2 = this;

      this.checkUserState(function (res) {
        if (res.msg !== "已经注册") {
          _this2.isRegister = true;

          _dialog["default"].alert({
            message: '尚未注册，请您注册',
            confirmButtonText: '好的',
            closeOnClickOverlay: true
          }).then(function () {
            wx.navigateTo({
              url: '/pages/register/register'
            });
          });
        } else {
          if (cb && typeof cb === 'function') cb();
        }
      });
    }
  },
  onLoad: function onLoad() {
    var userInfo = wx.getStorageSync('userInfo');
    var openid = wx.getStorageSync('openid');

    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }

    if (openid) {
      this.getUserStatus();
    } // wx.setStorageSync('userInfo',JSON.stringify({
    //           nickname:res.$wx.detail.userInfo.nickName,
    //           avatar:res.$wx.detail.userInfo.avatarUrl
    //         }));

  },
  created: function created() {}
}, {info: {"components":{"van-button":{"path":"..\\..\\components\\vant\\button\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-divider":{"path":"..\\..\\components\\vant\\divider\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"}},"on":{"10-1":["tap"],"10-2":["tap"],"10-3":["tap"]}}, handlers: {'10-0': {"getuserinfo": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onGotUserInfo($event)
      })();
    
  }},'10-1': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.linkTo('/pages/order/order')
      })();
    
  }},'10-2': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.linkTo('/pages/cart/cart')
      })();
    
  }},'10-3': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.linkTo('/pages/apply/apply')
      })();
    
  }},'10-4': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.redirectTo('/pages/index/index')
      })();
    
  }},'10-5': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.redirectTo('/pages/my/my')
      })();
    
  }},'10-6': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.scanCode($event)
      })();
    
  }}}, models: {} });