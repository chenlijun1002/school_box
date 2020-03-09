"use strict";

var _core = _interopRequireDefault(require('../../vendor.js')(0));

var _eventHub = _interopRequireDefault(require('../../common/eventHub.js'));

var _x = require('../../vendor.js')(4);

var _store = _interopRequireDefault(require('../../store/index.js'));

var _test = _interopRequireDefault(require('../../mixins/test.js'));

var _request = _interopRequireDefault(require('../../utils/request.js'));

var _toast = _interopRequireDefault(require('../../components/vant/toast/toast.js'));

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
    info: {},
    score: 0,
    loaded: false
  },
  methods: {
    onChangeTabbar: function onChangeTabbar(e) {
      if (e.$wx.detail == 0) {
        wx.redirectTo({
          url: '/pages/index/index'
        });
      } else if (e.$wx.detail == 1) {
        wx.redirectTo({
          url: '/pages/find/find'
        });
      } else {
        wx.redirectTo({
          url: '/pages/my/my'
        });
      }
    },
    getData: function getData(cb) {
      var _this = this;

      _request["default"].post('user/get', {
        id: this.id
      }).then(function (res) {
        _this.info = res.data;
        _this.loaded = true;
        if (cb && typeof cb === 'function') cb();
      });
    },
    getScore: function getScore() {
      var _this2 = this;

      _request["default"].post('score/get', {
        id: this.id
      }, '', false).then(function (res) {
        _this2.score = res.data;
      });
    },
    linkTo: function linkTo() {
      this.navigateTo('/pages/webView/webView?url=' + encodeURIComponent('https://www.chengxuyuanbuluo.com?baozhiqi'));
    }
  },
  onShow: function onShow() {},
  onHide: function onHide() {
    this.loaded = false;
  },
  created: function created() {},
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: "爱的保质期",
      imageUrl: "/images/share.png",
      path: "/pages/index/index"
    };
  }
}, {info: {"components":{"van-button":{"path":"..\\..\\components\\vant\\button\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-divider":{"path":"..\\..\\components\\vant\\divider\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-tabbar":{"path":"..\\..\\components\\vant\\tabbar\\index"},"van-tabbar-item":{"path":"..\\..\\components\\vant\\tabbar-item\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"}},"on":{}}, handlers: {}, models: {} });