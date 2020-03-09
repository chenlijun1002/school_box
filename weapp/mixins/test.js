"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require('../utils/util.js'));

var _request = _interopRequireDefault(require('../utils/request.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  data: {
    mixin: 'MixinText'
  },
  methods: {
    navigateTo: function navigateTo(url) {
      wx.navigateTo({
        url: url
      });
    },
    switchTab: function switchTab(url) {
      wx.switchTab({
        url: url
      });
    },
    reLaunch: function reLaunch(url) {
      wx.reLaunch({
        url: url
      });
    },
    date: function date(time, format) {
      return _util["default"].formatTime(time, format);
    },
    addDays: function addDays(date, days, seperator) {
      return _util["default"].addDays(date, days, seperator);
    },
    DateMinus: function DateMinus(date1, date2) {
      return _util["default"].DateMinus(date1, date2);
    },
    getMyDay: function getMyDay(date) {
      return _util["default"].getMyDay(date);
    },
    redirectTo: function redirectTo(url) {
      wx.redirectTo({
        url: url
      });
    },
    serialize: function serialize(obj) {
      return _util["default"].serialize(obj);
    },
    checkUserState: function checkUserState(cb) {
      var openid = wx.getStorageSync('openid');

      _request["default"].get("api/schoolbox/checkUserState", {
        openid: openid
      }, false).then(function (res) {
        if (cb && typeof cb === 'function') cb(res);
      })["catch"](function (res) {
        Toast({
          message: res.data.msg || '接口异常',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    userInfoUpdate: function userInfoUpdate(params) {
      var openid = wx.getStorageSync('openid');

      _request["default"].get("api/schoolbox/userInfoUpdate", _objectSpread({
        openid: openid
      }, params), false).then(function (res) {})["catch"](function (res) {
        Toast({
          message: res.data.msg || '接口异常',
          forbidClick: true,
          duration: 1000
        });
      });
    },
    mixintap: function mixintap() {
      this.mixin = 'MixinText' + (Math.random() + '').substring(3, 7);
      console.log('mixin method tap');
    },
    tap: function tap() {
      console.log('tap in mixin');
    }
  },
  created: function created() {
    console.log('created in mixin');
  }
};
exports["default"] = _default;