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

// import icon1 from '../../images/radio_false.png';
// import icon2 from '../../images/radio_true.png';
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
    school: '',
    louno: '',
    schoolList: [],
    louList: [],
    array: [],
    array2: [],
    params: {
      openid: '',
      name: '',
      phone: '',
      sex: 1,
      code: '',
      school_id: '',
      louno_id: '',
      dormitory: ''
    },
    showMsgModal: false,
    btnText: '获取验证码',
    timer: null,
    time: 60,
    loaded: false,
    loading: false,
    nodata: false
  },
  methods: {
    bindPickerChange: function bindPickerChange(e) {
      console.log(e);
      this.params.school_id = this.schoolList[e.$wx.detail.value].id;
      this.school = this.schoolList[e.$wx.detail.value].name;
      this.getLounoList(this.params.school_id);
    },
    bindPickerChange2: function bindPickerChange2(e) {
      console.log(e);
      this.params.louno_id = this.louList[e.$wx.detail.value].id;
      this.louno = this.louList[e.$wx.detail.value].name;
    },
    onChangeRadio: function onChangeRadio(e) {
      console.log(e);
      this.params.sex = e.$wx.detail;
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
    getSchoolList: function getSchoolList() {
      var _this2 = this;

      _request["default"].post('api/schoolbox/getSchoolList', {}, false).then(function (res) {
        _this2.schoolList = res.data;
        var list = [];
        res.data.forEach(function (item) {
          list.push(item.name);
        });
        _this2.array = list;
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg,
          forbidClick: true
        });
      });
    },
    getLounoList: function getLounoList(school_id) {
      var _this3 = this;

      _request["default"].post("api/schoolbox/getLounoList?".concat(this.serialize({
        school_id: school_id
      })), {
        school_id: school_id
      }, false).then(function (res) {
        _this3.louList = res.data;
        var list = [];
        res.data.forEach(function (item) {
          list.push(item.name);
        });
        _this3.array2 = list;
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg,
          forbidClick: true
        });
      });
    },
    onChange: function onChange(e) {
      console.log(e);
      var name = e.$wx.currentTarget.dataset.name;
      this.params[name] = e.$wx.detail;
    },
    remove: function remove(id) {
      var _this4 = this;

      _dialog["default"].confirm({
        message: '确认删除该条提示？'
      }).then(function () {
        _request["default"].post('/task/del', {
          id: id
        }).then(function (res) {
          (0, _toast["default"])({
            message: '删除成功',
            forbidClick: true,
            duration: 1000
          });
          _this4.params.page = 1;

          _this4.goTop();

          setTimeout(function () {
            _this4.getIndexData(function (data) {
              _this4.list = data;
            }, true);
          }, 1500);
        })["catch"](function (res) {
          (0, _toast["default"])({
            message: res.msg,
            forbidClick: true
          });
        });
      })["catch"](function () {// on cancel
      });
    },
    getYzmCode: function getYzmCode() {
      var _this5 = this;

      var openid = wx.getStorageSync('openid');

      if (!openid) {
        return this.showMsgModal = true;
      }

      if (!this.params.phone) {
        (0, _toast["default"])({
          message: '请输入手机号',
          forbidClick: true
        });
        return;
      }

      if (!/^1[3456789]\d{9}$/.test(this.params.phone)) {
        (0, _toast["default"])({
          message: '请输入正确的手机号',
          forbidClick: true
        });
        return;
      }

      if (this.btnText !== '获取验证码') {
        return;
      }

      _request["default"].get('api/schoolbox/getYzmCode', {
        openid: openid,
        phone: this.params.phone
      }).then(function (res) {
        _this5.time = 60;
        _this5.btnText = _this5.time + 's后重新获取';
        _this5.timer = setInterval(function () {
          if (_this5.time <= 1) {
            _this5.btnText = '获取验证码';
            clearInterval(_this5.timer);
            return;
          }

          _this5.time--;
          _this5.btnText = _this5.time + 's后重新获取';
        }, 1000);
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg,
          forbidClick: true
        });
      });
    },
    register: function register() {
      var _this6 = this;

      // Dialog.alert({        
      //   message: '申请已提交 可咨询在线客服了解进度',
      //   confirmButtonText:'好的',
      //   closeOnClickOverlay:true
      // }).then(() => {
      // });  
      if (!this.params.school_id) {
        (0, _toast["default"])({
          message: '请选择学校',
          forbidClick: true
        });
        return;
      }

      if (!this.params.louno_id) {
        (0, _toast["default"])({
          message: '请选择寝室',
          forbidClick: true
        });
        return;
      }

      if (!this.params.dormitory) {
        (0, _toast["default"])({
          message: '请输入寝室号',
          forbidClick: true
        });
        return;
      }

      if (!this.params.name) {
        (0, _toast["default"])({
          message: '请输入姓名',
          forbidClick: true
        });
        return;
      } // if(!this.params.sex){
      //   Toast({ message: '请选择性别', forbidClick:true});
      //   return;
      // }


      if (!/^1[3456789]\d{9}$/.test(this.params.phone)) {
        (0, _toast["default"])({
          message: '请输入正确的手机号',
          forbidClick: true
        });
        return;
      }

      if (!this.params.code) {
        (0, _toast["default"])({
          message: '请输入验证码',
          forbidClick: true
        });
        return;
      }

      var openid = wx.getStorageSync('openid');

      _request["default"].get('api/schoolbox/userreg', _objectSpread({}, this.params, {
        openid: openid
      })).then(function (res) {
        (0, _toast["default"])({
          message: '申请已提交 可咨询在线客服了解进度',
          forbidClick: true,
          duration: 1000
        });
        setTimeout(function () {
          _this6.redirectTo('/pages/success/success');
        }, 1500);
      })["catch"](function (res) {
        (0, _toast["default"])({
          message: res.msg,
          forbidClick: true
        });
      });
    }
  },
  onLoad: function onLoad() {
    this.getSchoolList();
  },
  created: function created() {}
}, {info: {"components":{"van-radio":{"path":"..\\..\\components\\vant\\radio\\index"},"van-cell":{"path":"..\\..\\components\\vant\\cell\\index"},"van-cell-group":{"path":"..\\..\\components\\vant\\cell-group\\index"},"van-field":{"path":"..\\..\\components\\vant\\field\\index"},"van-popup":{"path":"..\\..\\components\\vant\\popup\\index"},"van-toast":{"path":"..\\..\\components\\vant\\toast\\index"},"van-dialog":{"path":"..\\..\\components\\vant\\dialog\\index"},"van-loading":{"path":"..\\..\\components\\vant\\loading\\index"},"slide-view":{"path":"..\\..\\$vendor\\miniprogram-slide-view\\miniprogram_dist\\index"}},"on":{"8-2":["change"],"8-3":["change"],"8-4":["change"],"8-5":["change"],"8-6":["change"],"8-7":["change"],"8-10":["close","getuserinfo"]}}, handlers: {'8-0': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.bindPickerChange($event)
      })();
    
  }},'8-1': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.bindPickerChange2($event)
      })();
    
  }},'8-2': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChange($event)
      })();
    
  }},'8-3': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChange($event)
      })();
    
  }},'8-4': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeRadio($event)
      })();
    
  }},'8-5': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChangeRadio($event)
      })();
    
  }},'8-6': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChange($event)
      })();
    
  }},'8-7': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.onChange($event)
      })();
    
  }},'8-8': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.getYzmCode($event)
      })();
    
  }},'8-9': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.register($event)
      })();
    
  }},'8-10': {"close": function proxy () {
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