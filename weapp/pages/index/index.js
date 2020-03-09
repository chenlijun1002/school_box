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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();

_core["default"].page({
  store: _store["default"],
  config: {
    navigationBarTitleText: '首页'
  },
  hooks: {
    // Page 级别 hook, 只对当前 Page 的 setData 生效。
    'before-setData': function beforeSetData(dirty) {}
  },
  mixins: [_test["default"]],
  data: {
    baseUrl: app.$wepy.$options.globalData.baseUrl,
    productList: [],
    adList: [],
    classList: [],
    show: false,
    showMsgModal: false,
    showMenu: false,
    cartNum: 0,
    name: '',
    info: {},
    classId: 0,
    loaded: false,
    loading: false,
    nodata: false
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
            that.getOpenid(data.code, res);
          }
        });
      }
    },
    onChangeSidebar: function onChangeSidebar(e) {
      console.log(e);
      var id = this.classList[e.$wx.detail].id;
      this.getGoodsListByClass(id, true);
    },
    onChangeStepper: function onChangeStepper(e) {
      var num = e.$wx.detail;
      var index = e.$wx.currentTarget.dataset.index;
      var item = this.productList[index];

      if ((item.cartnum || 0) > num) {
        this.reduce(item);
      } else if (item.cartnum < num) {
        this.plus(item);
      }
    },
    getCartProduct: function getCartProduct() {
      var _this2 = this;

      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      if (!openid) {
        return;
      }

      _request["default"].get("api/schoolbox/getCartGoodsList", {
        openid: openid,
        shopbox_id: shopbox_id
      }, false).then(function (res) {
        _this2.cartNum = res.data.length;
      })["catch"](function (res) {
        if (res.code != 0) {
          (0, _toast["default"])({
            message: res.msg || '获取购物车商品失败',
            forbidClick: true,
            duration: 1000
          });
        } else {
          _this2.cartNum = 0;
        }
      });
    },
    getindexadsimg: function getindexadsimg() {
      var _this3 = this;

      wx.showLoading({
        title: '加载中...',
        icon: 'none'
      });
      var shopbox_id = wx.getStorageSync('shopbox_id');

      _request["default"].get('api/schoolbox/getindexadsimg', {
        shopbox_id: shopbox_id
      }, '', false).then(function (res) {
        _this3.adList = res.data;
      });
    },
    getGoodsListByClass: function getGoodsListByClass(id) {
      var _this4 = this;

      var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.classId = id;
      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      _request["default"].get("api/schoolbox/getGoodsListByClass", {
        shopbox_id: shopbox_id,
        goods_class_id: id,
        openid: openid
      }, '', flag).then(function (res) {
        wx.hideLoading();
        _this4.productList = res.data;
        _this4.loaded = true;
        console.log(_this4.productList);
      });
    },
    getGoodsClassList: function getGoodsClassList(cb) {
      var _this5 = this;

      var shopbox_id = wx.getStorageSync('shopbox_id');

      _request["default"].get('api/schoolbox/getGoodsClassList', {
        shopbox_id: shopbox_id
      }, '', false).then(function (res) {
        _this5.classList = res.data;
        if (cb && typeof cb === 'function') cb(res.data);
      });
    },
    plus: function plus(item) {
      var _this6 = this;

      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      if (!openid) {
        return this.showMsgModal = true;
      }

      var params = {
        openid: openid,
        shopbox_id: shopbox_id,
        price: item.price,
        goods_id: item.goods_id,
        specval: item.specval
      };

      _request["default"].get("api/schoolbox/addCart", _objectSpread({}, params)).then(function (res) {
        _this6.getGoodsListByClass(_this6.classId);

        _this6.getCartProduct();
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg || '添加失败',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    reduce: function reduce(item) {
      var _this7 = this;

      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      if (!openid) {
        return this.showMsgModal = true;
      }

      var params = {
        openid: openid,
        shopbox_id: shopbox_id,
        goods_id: item.goods_id
      };

      _request["default"].get("api/schoolbox/reduceCartGoods", _objectSpread({}, params)).then(function (res) {
        _this7.getGoodsListByClass(_this7.classId);

        _this7.getCartProduct();
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg || '删除失败',
          forbidClick: true,
          duration: 1000
        });
      });
    }
  },
  onUnload: function onUnload() {
    this.loaded = false;
  },
  onShow: function onShow() {
    var pages = getCurrentPages(); //页面栈

    var beforePage = pages[pages.length - 1];
  },
  onLoad: function onLoad(options) {
    var _this8 = this;

    wx.setStorageSync('shopbox_id', options.shopbox_id || options.scene || 7);
    this.getindexadsimg();
    this.getCartProduct();
    this.getGoodsClassList(function (res) {
      _this8.classId = res[0].id;

      _this8.getGoodsListByClass(res[0].id);
    });
    this.checkUserState(function (res) {
      if (res.msg !== "已经注册") {
        _dialog["default"].alert({
          message: '尚未注册，注册后可扫码下单购买 前往个人中心注册',
          confirmButtonText: '好的',
          closeOnClickOverlay: true
        }).then(function () {
          wx.redirectTo({
            url: '/pages/register/register'
          });
        });
      }
    });
  },
  created: function created() {}
}, {info: {"components":{"van-stepper":{"path":"..\\..\\components\\vant\\stepper\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-sidebar":{"path":"..\\..\\components\\vant\\sidebar\\index"},"van-sidebar-item":{"path":"..\\..\\components\\vant\\sidebar-item\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-tabbar":{"path":"..\\..\\components\\vant\\tabbar\\index"},"van-tabbar-item":{"path":"..\\..\\components\\vant\\tabbar-item\\index"},"van-transition":{"path":"..\\..\\components\\vant\\transition\\index"},"van-overlay":{"path":"..\\..\\components\\vant\\overlay\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"},"van-loading":{"path":"..\\..\\components\\vant\\loading\\index"}},"on":{"7-0":["change"],"7-4":["change"],"7-9":["close","getuserinfo"]}}, handlers: {'7-0': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeSidebar($event)
      })();
    
  }},'7-1': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.navigateTo('/pages/productDetail/productDetail?id='+item.goods_id)
      })();
    
  }},'7-2': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.navigateTo('/pages/productDetail/productDetail?id='+item.goods_id)
      })();
    
  }},'7-3': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.navigateTo('/pages/productDetail/productDetail?id='+item.goods_id)
      })();
    
  }},'7-4': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeStepper($event)
      })();
    
  }},'7-5': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.navigateTo('/pages/cart/cart')
      })();
    
  }},'7-6': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.redirectTo('/pages/index/index')
      })();
    
  }},'7-7': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.redirectTo('/pages/my/my')
      })();
    
  }},'7-8': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.scanCode($event)
      })();
    
  }},'7-9': {"close": function proxy () {
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