var app=getApp();
const baseUrl = app.$wepy.$options.globalData.baseUrl;
var token=app.$wepy.$options.globalData.token;
//var headers = app.$wepy.$options.globalData.header;
// loading配置，请求次数统计
function startLoading() {
  wx.showLoading({
    title: '加载中...',
    icon: 'none'
  })
}
function endLoading() {
  wx.hideLoading();
}
// 声明一个对象用于存储请求个数
var needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};

// get/post请求
function fun(url, method, data,showLoading=true) {
  data = data || {};
 // header = header || headers;  
  if(token){
    header.Authorization="Bearer " + token;
  }
  //wx.showNavigationBarLoading();
  let show = typeof showLoading != 'undefined' ? showLoading : true;  
  if(show){
    showFullScreenLoading();
  }
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
     // header: header,
      data: data,
      method: method,
      success: function (res) {       
        if (typeof res.data === "object") {                   
            if(res.statusCode==200){
                if(res.data.code==1){
                    resolve(res.data);
                }else{
                    reject(res.data);
                }
            }else{
                reject(res.data);
            }
        }        
        tryHideFullScreenLoading();
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
        tryHideFullScreenLoading();
      },
      complete: function () {
        //wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}

// 上传
function upload(url, name, filePath) {
  let header = {};
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: baseUrl + url,
      filePath: filePath,
      name: name,
      header: header,
      success: function (res) {
        resolve(res.data.result);
        tryHideFullScreenLoading();
      },
      fail: function() {
        reject({ error: '网络错误', code: 0 });
        tryHideFullScreenLoading();
      },
      complete: function () {
        //wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  });
  return promise;
}

module.exports = {
  "get": function (url, data,showLoading) {
    return fun(url, "GET", data,showLoading);
  },
  "post": function (url, data,showLoading) {
    return fun(url, "POST", data,showLoading);
  },
  upload: function (url, name, filePath) {
    return upload(url, name, filePath);
  }
};