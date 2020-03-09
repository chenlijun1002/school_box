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
    showMsgModal: false,
    list: [],
    index: 0,
    params: {
      page: 1
    },
    total: 0,
    loaded: false,
    loading: false,
    nodata: false
  },
  methods: _defineProperty({
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
            that.getOpenid(data.code, res);
          }
        });
      }
    },
    getAllOrder: function getAllOrder(cb) {
      var _this2 = this;

      var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var openid = wx.getStorageSync('openid');
      if (!openid) return;

      _request["default"].get('api/schoolbox/getAllOrder', _objectSpread({}, this.params, {
        openid: openid
      }), flag).then(function (res) {
        //this.list=res.data.data;
        res.data.data.forEach(function (item) {
          item.createtime = _this2.date(item.createtime);
        });
        _this2.total = res.data.total;
        if (cb && typeof cb === 'function') cb(res.data.data);
      })["catch"](function (res) {
        _this2.list = [];

        if (res.code != 0) {
          (0, _toast["default"])({
            message: res.msg,
            forbidClick: true
          });
        }
      });
    },
    getNoPayOrder: function getNoPayOrder(cb) {
      var _this3 = this;

      var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var openid = wx.getStorageSync('openid');
      if (!openid) return;

      _request["default"].get('api/schoolbox/getNoPayOrder', _objectSpread({}, this.params, {
        openid: openid
      }), flag).then(function (res) {
        //this.list=res.data.data;
        res.data.data.forEach(function (item) {
          item.createtime = _this3.date(item.createtime);
        });
        _this3.total = res.data.total;
        if (cb && typeof cb === 'function') cb(res.data.data);
      })["catch"](function (res) {
        _this3.list = [];

        if (res.code != 0) {
          (0, _toast["default"])({
            message: res.msg,
            forbidClick: true
          });
        }
      });
    },
    getPayedOrder: function getPayedOrder(cb) {
      var _this4 = this;

      var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var openid = wx.getStorageSync('openid');
      if (!openid) return;

      _request["default"].get('api/schoolbox/getPayedOrder', _objectSpread({}, this.params, {
        openid: openid
      }), flag).then(function (res) {
        //this.list=res.data.data;
        res.data.data.forEach(function (item) {
          item.createtime = _this4.date(item.createtime);
        });
        _this4.total = res.data.total;
        if (cb && typeof cb === 'function') cb(res.data.data);
      })["catch"](function (res) {
        console.log(res);
        _this4.list = [];

        if (res.code != 0) {
          (0, _toast["default"])({
            message: res.msg,
            forbidClick: true
          });
        }
      });
    },
    deleteMyOrder: function deleteMyOrder(ordersn) {
      var _this5 = this;

      _request["default"].get('api/schoolbox/deleteMyOrder', {
        ordersn: ordersn
      }).then(function (res) {
        (0, _toast["default"])({
          message: '删除成功',
          forbidClick: true
        });
        setTimeout(function () {
          _this5.params.page = 1;

          if (_this5.index == 0) {
            _this5.getAllOrder(function (res) {
              _this5.list = res;
            });
          } else if (_this5.index == 1) {
            _this5.getNoPayOrder(function (res) {
              _this5.list = res;
            });
          } else {
            _this5.getPayedOrder(function (res) {
              _this5.list = res;
            });
          }
        }, 1500);
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg,
          forbidClick: true
        });
      });
    },
    onChangeTab: function onChangeTab(e) {
      var _this6 = this;

      console.log(e);
      this.index = e.$wx.detail.index;
      this.params.page = 1;

      if (this.index == 0) {
        this.getAllOrder(function (res) {
          _this6.list = res;
        });
      } else if (this.index == 1) {
        this.getNoPayOrder(function (res) {
          _this6.list = res;
        });
      } else {
        this.getPayedOrder(function (res) {
          _this6.list = res;
        });
      }
    },
    remove: function remove(id) {
      var _this7 = this;

      _dialog["default"].alert({
        message: '确认删除此订单？',
        confirmButtonText: '确定',
        showCancelButton: true
      }).then(function () {
        _this7.deleteMyOrder(id);
      });
    },
    plus: function plus(obj) {
      var openid = wx.getStorageSync('openid');
      var shopbox_id = wx.getStorageSync('shopbox_id');

      if (!openid) {
        return this.showMsgModal = true;
      }

      obj.orderdesc.forEach(function (item) {
        var params = {
          openid: openid,
          shopbox_id: shopbox_id,
          price: item.price,
          goods_id: item.goods_id,
          specval: item.specval
        };

        _request["default"].get("api/schoolbox/addCart", _objectSpread({}, params)).then(function (res) {
          (0, _toast["default"])({
            message: '添加成功',
            forbidClick: true,
            duration: 1000
          });
        })["catch"](function (res) {
          (0, _toast["default"])({
            message: res.msg || '添加失败',
            forbidClick: true,
            duration: 1000
          });
        });
      });
    }
  }, "onGotUserInfo", function onGotUserInfo(res) {
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
  }),
  onLoad: function onLoad() {
    var _this8 = this;

    this.getAllOrder(function (res) {
      _this8.list = res;
    });
  },
  created: function created() {},
  //上拉加载更多数据
  onReachBottom: function onReachBottom(e) {
    var _this9 = this;

    this.loading = true;
    this.nodata = false; // 在这里加载新的数据

    this.params.page++;

    if (this.index == 0) {
      this.getAllOrder(function (data) {
        setTimeout(function () {
          if (data && data.length) {
            _this9.list = _this9.list.concat(data);
            _this9.loading = false;
          } else {
            _this9.loading = false;
            _this9.nodata = true;
          }
        }, 1000);
      }, false);
    } else if (this.index == 1) {
      this.getNoPayOrder(function (data) {
        setTimeout(function () {
          if (data && data.length) {
            _this9.list = _this9.list.concat(data);
            _this9.loading = false;
          } else {
            _this9.loading = false;
            _this9.nodata = true;
          }
        }, 1000);
      }, false);
    } else {
      this.getPayedOrder(function (data) {
        setTimeout(function () {
          if (data && data.length) {
            _this9.list = _this9.list.concat(data);
            _this9.loading = false;
          } else {
            _this9.loading = false;
            _this9.nodata = true;
          }
        }, 1000);
      }, false);
    }
  }
}, {info: {"components":{"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-tab":{"path":"..\\..\\components\\vant\\tab\\index"},"van-tabs":{"path":"..\\..\\components\\vant\\tabs\\index"},"van-sticky":{"path":"..\\..\\components\\vant\\sticky\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-tabbar":{"path":"..\\..\\components\\vant\\tabbar\\index"},"van-tabbar-item":{"path":"..\\..\\components\\vant\\tabbar-item\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"},"van-loading":{"path":"..\\..\\components\\vant\\loading\\index"}},"on":{"9-0":["change"],"9-4":["close","getuserinfo"]}}, handlers: {'9-0': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeTab($event)
      })();
    
  }},'9-1': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.remove(item.ordersn)
      })();
    
  }},'9-2': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.plus(item)
      })();
    
  }},'9-3': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.navigateTo(("/pages/orderDetail/orderDetail?ordersn=" + (item.ordersn)))
      })();
    
  }},'9-4': {"close": function proxy () {
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