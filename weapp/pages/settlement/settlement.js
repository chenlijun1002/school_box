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
    list: [],
    params: {},
    totalPrice: 0,
    ordersn: 0,
    je: 0,
    loaded: false
  },
  methods: {
    pay: function pay() {
      var openid = wx.getStorageSync('openid');

      if (!openid) {
        return this.showMsgModal = true;
      }

      _request["default"].get('api/schoolbox/pay', {
        ordersn: this.ordersn,
        je: this.je,
        openid: openid
      }).then(function (res) {
        res.data = JSON.parse(res.data);
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          "package": res.data["package"],
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function success(res) {
            (0, _toast["default"])({
              message: '支付成功',
              forbidClick: true,
              duration: 1000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/order/order'
              });
            }, 1500);
          },
          fail: function fail(res) {
            (0, _toast["default"])({
              message: '支付失败',
              forbidClick: true,
              duration: 1000
            });
          }
        });
      });
    }
  },
  onLoad: function onLoad(options) {
    this.ordersn = options.ordersn;
    this.je = options.je;
  },
  created: function created() {}
}, {info: {"components":{"van-button":{"path":"..\\..\\components\\vant\\button\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-divider":{"path":"..\\..\\components\\vant\\divider\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"}},"on":{"13-1":["close","getuserinfo"]}}, handlers: {'13-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.pay($event)
      })();
    
  }},'13-1': {"close": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onClose($event)
      })();
    
  }, "getuserinfo": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onGotUserInfo($event)
      })();
    
  }}}, models: {} });