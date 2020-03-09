/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/  
function formatTime(number,format) {  
  
    var formateArr  = ['Y','M','D','h','m','s'];  
    var returnArr   = [];  
    
    var date = new Date(number * 1000);  
    returnArr.push(date.getFullYear());  
    returnArr.push(formatNumber(date.getMonth() + 1));  
    returnArr.push(formatNumber(date.getDate()));  
    
    returnArr.push(formatNumber(date.getHours()));  
    returnArr.push(formatNumber(date.getMinutes()));  
    returnArr.push(formatNumber(date.getSeconds()));  
    
    for (var i in returnArr)  
    {  
      format = format.replace(formateArr[i], returnArr[i]);  
    }  
    return format;  
  } 
  
  //数据转化  
  function formatNumber(n) {  
    n = n.toString()  
    return n[1] ? n : '0' + n  
  }  

  //获取指定日期n天之后的日期
  function addDays(date, days) {     
    let oDate = new Date(date).getTime()/1000;
    let nDate = oDate + days * 24 * 3600;
    // nDate = new Date(nDate);
    // let y = nDate.getFullYear().toString().padStart(2, 0);
    // let m = (nDate.getMonth() + 1).toString().padStart(2, 0);
    // let d = nDate.getDate().toString().padStart(2, 0);
    // return `${y}${seperator}${m}${seperator}${d}`
    return formatTime(nDate+'',"Y-M-D h:m:s");
  }

  // 获取两个日期之间的天数
  function DateMinus(date1,date2){
      　　var sdate = new Date(date1); 
      　　var now = new Date(date2); 
      　　var days = now.getTime() - sdate.getTime(); 
      　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
       　return day; 
  }

    // 获取某个日期是周几
    function getMyDay(date){
        var week;
        if(date.getDay()==0) week="周日";
        if(date.getDay()==1) week="周一";
        if(date.getDay()==2) week="周二";
        if(date.getDay()==3) week="周三";
        if(date.getDay()==4) week="周四";
        if(date.getDay()==5) week="周五";
        if(date.getDay()==6) week="周六";
        return week;
    }

    function serialize(obj) {
      var ary = [];
      for (var p in obj)
          if (obj.hasOwnProperty(p) && obj[p]) {
              ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
      return ary.join('&');
    }

module.exports = {
    "formatTime": function (timestamp,format) {
        return formatTime(timestamp,format||"Y-M-D h:m:s");
    },
    "addDays": function (date,days) {
        return addDays(date,days);
    },
    "DateMinus": function (date1,date2) {
        return DateMinus(date1,date2);
    },
    "getMyDay": function (date) {
        return getMyDay(date);
    },
    "serialize":function(obj){
      return serialize(obj);
    }
};