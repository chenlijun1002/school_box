"use strict";

var _core = _interopRequireDefault(require('../../vendor.js')(0));

var _eventHub = _interopRequireDefault(require('../../common/eventHub.js'));

var _x = require('../../vendor.js')(4);

var _store = _interopRequireDefault(require('../../store/index.js'));

var _test = _interopRequireDefault(require('../../mixins/test.js'));

var _request = _interopRequireDefault(require('../../utils/request.js'));

var _toast = _interopRequireDefault(require('../../components/vant/toast/toast.js'));

var _richText = _interopRequireDefault(require('../../utils/richText.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    id: 0,
    info: {},
    num: 1,
    cartNum: 0,
    totalPrice: 0,
    showMsgModal: false,
    loaded: false
  },
  methods: {
    getData: function getData(cb) {
      var _this = this;

      var shopbox_id = wx.getStorageSync('shopbox_id');

      _request["default"].get("api/schoolbox/getGoodsDesc", {
        goods_id: this.id,
        shopbox_id: shopbox_id
      }).then(function (res) {
        var data = res.data.goodsdesc.replace(/\<br\>/g, '<br />');
        res.data.goodsdesc = data ? _richText["default"].go(data) : '';
        _this.info = res.data;
        _this.totalPrice = (_this.num * (_this.info.price || 0)).toFixed(2);
        _this.loaded = true;
        if (cb && typeof cb === 'function') cb();
      });
    },
    onChangeStepper: function onChangeStepper(e) {
      this.num = e.$wx.detail;
      this.totalPrice = (this.num * (this.info.price || 0)).toFixed(2);
    },
    getOpenid: function getOpenid(code, data) {
      var _this2 = this;

      _request["default"].get('api/schoolbox/GetUid', {
        code: code
      }).then(function (res) {
        wx.setStorageSync('openid', res.data.openid);

        _this2.userInfoUpdate({
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
            that.getOpenid(data.code, res);
          }
        });
      }
    },
    getCartProduct: function getCartProduct() {
      var _this3 = this;

      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      _request["default"].get("api/schoolbox/getCartGoodsList", {
        openid: openid,
        shopbox_id: shopbox_id
      }, false).then(function (res) {
        _this3.cartNum = res.data.length;
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.data.msg || '获取购物车商品失败',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    addCart: function addCart() {
      var _this4 = this;

      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      if (!openid) {
        return this.showMsgModal = true;
      }

      var params = {
        openid: openid,
        shopbox_id: shopbox_id,
        price: this.info.price,
        goods_id: this.info.goods_id,
        specval: this.info.specval
      };

      _request["default"].get("api/schoolbox/addCart", _objectSpread({}, params)).then(function (res) {
        (0, _toast["default"])({
          message: '添加成功',
          forbidClick: true,
          duration: 1000
        });

        _this4.getCartProduct();
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.data.msg || '添加失败',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    submit: function submit() {
      this.ordersubmit();
    },
    ordersubmit: function ordersubmit() {
      var _this5 = this;

      var shopbox_id = wx.getStorageSync('shopbox_id');
      var params = {
        shopbox_id: shopbox_id,
        num: this.num,
        goods: [{
          goods_id: this.info.goods_id,
          num: this.info.num,
          price: this.info.price,
          specval: this.info.specval
        }],
        je: this.totalPrice
      };
      var openid = wx.getStorageSync('openid');

      if (!openid) {
        return this.showMsgModal = true;
      }

      _request["default"].get('api/schoolbox/ordersubmit', _objectSpread({}, params, {
        openid: openid
      })).then(function (res) {
        _this5.navigateTo('/pages/settlement/settlement?ordersn=' + res.data.ordersn + '&je=' + _this5.totalPrice);
      });
    }
  },
  onLoad: function onLoad(options) {
    this.id = options.id;
    this.getData();
    this.getCartProduct();
  },
  created: function created() {}
}, {info: {"components":{"van-button":{"path":"..\\..\\components\\vant\\button\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-stepper":{"path":"..\\..\\components\\vant\\stepper\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-tabbar":{"path":"..\\..\\components\\vant\\tabbar\\index"},"van-tabbar-item":{"path":"..\\..\\components\\vant\\tabbar-item\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"}},"on":{"16-0":["change"],"16-4":["close","getuserinfo"]}}, handlers: {'16-0': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeStepper($event)
      })();
    
  }},'16-1': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.navigateTo('/pages/cart/cart')
      })();
    
  }},'16-2': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.addCart($event)
      })();
    
  }},'16-3': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.submit($event)
      })();
    
  }},'16-4': {"close": function proxy () {
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