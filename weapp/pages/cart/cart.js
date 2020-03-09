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
    navigationBarTitleText: 'test'
  },
  hooks: {
    // Page 级别 hook, 只对当前 Page 的 setData 生效。
    'before-setData': function beforeSetData(dirty) {}
  },
  mixins: [_test["default"]],
  data: {
    baseUrl: app.$wepy.$options.globalData.baseUrl,
    isEdit: false,
    selectNum: 0,
    cart_check_all: false,
    cart_list: [],
    selectList: [],
    totalPrice: 0
  },
  methods: {
    onUnload: function onUnload() {
      var pages = getCurrentPages(); //页面栈

      var beforePage = pages[pages.length - 2];
      wx.redirectTo({
        url: '/' + beforePage.route,
        success: function success() {
          if (beforePage.route == 'pages/Shouye/shouye') {
            beforePage.onLoad(beforePage.options);
          }
        }
      });
    },
    onChangeStepper: function onChangeStepper(e) {
      var num = e.$wx.detail;
      var index = e.$wx.currentTarget.dataset.index;
      var item = this.cart_list[index];

      if (item.num > num) {
        this.reduce(item);
      } else if (item.num < num) {
        this.plus(item);
      }
    },
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
    getCartProduct: function getCartProduct() {
      var _this2 = this;

      var openid = wx.getStorageSync('openid');
      if (!openid) return;
      var shopbox_id = wx.getStorageSync('shopbox_id');

      _request["default"].get("api/schoolbox/getCartGoodsList", {
        openid: openid,
        shopbox_id: shopbox_id
      }, false).then(function (res) {
        _this2.totalPrice = 0;

        if (res.data) {
          res.data.forEach(function (item) {
            _this2.totalPrice += item.price * item.num;
            item.active = true;
          });
          _this2.cart_list = res.data;

          _this2.calcSelectNum();
        }

        _this2.totalPrice = _this2.totalPrice.toFixed(2);
      })["catch"](function (res) {
        if (res.code != 0) {
          (0, _toast["default"])({
            message: res.msg || '获取购物车商品失败',
            forbidClick: true,
            duration: 1000
          });
        } else {
          _this2.cart_list = [];

          _this2.calcSelectNum();
        }
      });
    },
    calcSelectNum: function calcSelectNum() {
      var count = 0,
          list = [];
      this.cart_list.forEach(function (item) {
        if (item.active) {
          count++;
          list.push(item);
        }
      });
      this.selectList = list;
      this.selectNum = count;
      this.cart_check_all = this.cart_list.length === count;
    },
    calcTotalPrice: function calcTotalPrice() {
      var _this3 = this;

      this.totalPrice = 0;

      if (this.cart_list && this.cart_list.length) {
        this.cart_list.forEach(function (item) {
          if (item.active) {
            _this3.totalPrice += item.price * item.num;
          }
        });
      }

      this.totalPrice = this.totalPrice.toFixed(2);
    },
    selectProduct: function selectProduct(index, id) {
      this.cart_list[index].active = !this.cart_list[index].active;
      this.calcSelectNum();
      this.calcTotalPrice();
    },
    selectAll: function selectAll() {
      var len = this.cart_list.filter(function (v) {
        return v.active;
      }).length;

      if (len == this.cart_list.length) {
        this.cart_list.forEach(function (item) {
          item.active = false;
        });
      } else {
        this.cart_list.forEach(function (item) {
          item.active = true;
        });
      }

      this.calcSelectNum();
      this.calcTotalPrice();
    },
    plus: function plus(item) {
      var _this4 = this;

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
        _this4.getCartProduct();
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.data.msg || '添加失败',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    reduce: function reduce(item) {
      var _this5 = this;

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
        _this5.getCartProduct();
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.data.msg || '失败',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    getProductId: function getProductId(list) {
      var arr = [];
      list.forEach(function (item) {
        arr.push(item.id);
      });
      return arr.join(',');
    },
    delProduct: function delProduct() {
      var _this6 = this;

      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      if (!openid) {
        return this.showMsgModal = true;
      }

      var params = {
        openid: openid,
        shopbox_id: shopbox_id,
        cart_id_array: this.getProductId(this.selectList)
      };

      _request["default"].get("api/schoolbox/deleteCartGoods", _objectSpread({}, params)).then(function (res) {
        //Toast({ message: '添加成功', forbidClick:true,duration:1000});
        _this6.getCartProduct();
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.data.msg || '失败',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    remove: function remove() {
      var _this7 = this;

      _dialog["default"].alert({
        message: '确认删除此订单？',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(function () {
        _this7.delProduct();
      });
    },
    submit: function submit() {
      var _this8 = this;

      // let params ={
      //   //num:this.num,
      //   // goods:JSON.stringify([{goods_id:this.info.goods_id,num:this.info.num,price:this.info.price,specval:this.info.specval}]),
      //    goods:this.selectList,
      //   je:this.totalPrice
      // };        
      if (!this.selectList.length) {
        (0, _toast["default"])({
          message: '请选择要结算的商品',
          forbidClick: true,
          duration: 1000
        });
        return;
      }

      var arr = [],
          num = 0;
      this.selectList.forEach(function (item) {
        arr.push({
          goods_id: item.goods_id,
          num: item.num,
          price: item.price,
          specval: item.specval
        });
        num += item.num - 0;
      });
      var shopbox_id = wx.getStorageSync('shopbox_id');
      var params = {
        shopbox_id: shopbox_id,
        num: num,
        goods: arr,
        je: this.totalPrice
      };
      var openid = wx.getStorageSync('openid');

      if (!openid) {
        return this.showMsgModal = true;
      }

      _request["default"].get('api/schoolbox/ordersubmit', _objectSpread({}, params, {
        openid: openid
      })).then(function (res) {
        _this8.navigateTo('/pages/settlement/settlement?ordersn=' + res.data.ordersn + '&je=' + _this8.totalPrice);
      });
    }
  },
  created: function created() {
    this.getCartProduct();
  }
}, {info: {"components":{"van-button":{"path":"..\\..\\components\\vant\\button\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-divider":{"path":"..\\..\\components\\vant\\divider\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-stepper":{"path":"..\\..\\components\\vant\\stepper\\index"},"van-checkbox":{"path":"..\\..\\components\\vant\\checkbox\\index"},"van-submit-bar":{"path":"..\\..\\components\\vant\\submit-bar\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"}},"on":{"14-3":["change"]}}, handlers: {'14-0': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.isEdit=false;
      })();
    
  }},'14-1': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.isEdit=true;
      })();
    
  }},'14-2': {"tap": function proxy (index, item) {
    
    var _vm=this;
      return (function () {
        _vm.selectProduct(index,item.id)
      })();
    
  }},'14-3': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeStepper($event)
      })();
    
  }},'14-4': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.selectAll($event)
      })();
    
  }},'14-5': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.submit($event)
      })();
    
  }},'14-6': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.remove($event)
      })();
    
  }}}, models: {} });