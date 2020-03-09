"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var app = getApp();
var baseUrl = app.$wepy.$options.globalData.baseUrl;
var token = app.$wepy.$options.globalData.token; //var headers = app.$wepy.$options.globalData.header;
// loading配置，请求次数统计

function startLoading() {
  wx.showLoading({
    title: '加载中...',
    icon: 'none'
  });
}

function endLoading() {
  wx.hideLoading();
} // 声明一个对象用于存储请求个数


var needLoadingRequestCount = 0;

function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }

  needLoadingRequestCount++;
}

;

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;

  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

; // get/post请求

function fun(url, method, data) {
  var showLoading = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  data = data || {}; // header = header || headers;  

  if (token) {
    header.Authorization = "Bearer " + token;
  } //wx.showNavigationBarLoading();


  var show = typeof showLoading != 'undefined' ? showLoading : true;

  if (show) {
    showFullScreenLoading();
  }

  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
      // header: header,
      data: data,
      method: method,
      success: function success(res) {
        if (_typeof(res.data) === "object") {
          if (res.statusCode == 200) {
            if (res.data.code == 1) {
              resolve(res.data);
            } else {
              reject(res.data);
            }
          } else {
            reject(res.data);
          }
        }

        tryHideFullScreenLoading();
      },
      fail: function fail(res) {
        // fail调用接口失败
        reject({
          error: '网络错误',
          code: 0
        });
        tryHideFullScreenLoading();
      },
      complete: function complete() {//wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
} // 上传


function _upload(url, name, filePath) {
  var header = {};
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  var promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: baseUrl + url,
      filePath: filePath,
      name: name,
      header: header,
      success: function success(res) {
        resolve(res.data.result);
        tryHideFullScreenLoading();
      },
      fail: function fail() {
        reject({
          error: '网络错误',
          code: 0
        });
        tryHideFullScreenLoading();
      },
      complete: function complete() {
        //wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  });
  return promise;
}

module.exports = {
  "get": function get(url, data, showLoading) {
    return fun(url, "GET", data, showLoading);
  },
  "post": function post(url, data, showLoading) {
    return fun(url, "POST", data, showLoading);
  },
  upload: function upload(url, name, filePath) {
    return _upload(url, name, filePath);
  }
};