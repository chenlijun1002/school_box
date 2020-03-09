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
    baseUrl: app.$wepy.$options.globalData.baseUrl,
    info: {},
    //   shopbox_name:'',
    ordersn: 0,
    loaded: false
  },
  methods: {
    getOrderDesc: function getOrderDesc() {
      var _this = this;

      var openid = wx.getStorageSync('openid');

      _request["default"].get('api/schoolbox/getOrderDesc', {
        ordersn: this.ordersn,
        openid: openid
      }).then(function (res) {
        res.data.createtime && (res.data.createtime = _this.date(res.data.createtime));
        res.data.updatetime && (res.data.updatetime = _this.date(res.data.updatetime));
        _this.info = res.data;
        _this.loaded = true;
      });
    }
  },
  onLoad: function onLoad(options) {
    this.ordersn = options.ordersn; //   this.shopbox_name = wx.getStorageSync('shopbox_name');

    this.getOrderDesc();
  },
  created: function created() {}
}, {info: {"components":{"van-button":{"path":"..\\..\\components\\vant\\button\\index"},"van-icon":{"path":"..\\..\\components\\vant\\icon\\index"},"van-divider":{"path":"..\\..\\components\\vant\\divider\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-tabbar":{"path":"..\\..\\components\\vant\\tabbar\\index"},"van-tabbar-item":{"path":"..\\..\\components\\vant\\tabbar-item\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"}},"on":{}}, handlers: {}, models: {} });