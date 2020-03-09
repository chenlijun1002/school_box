
import utils from '../utils/util';
import http from '../utils/request';
export default {
  data: {
    mixin: 'MixinText'
  },
  methods: {
    navigateTo(url){     
      wx.navigateTo({
        url
      })      
    },
    switchTab(url){
      wx.switchTab({
        url
      })
    },
    reLaunch(url){
      wx.reLaunch({
        url
      })
    },
    date(time,format){
      return utils.formatTime(time,format)
    },
    addDays(date,days,seperator){
      return utils.addDays(date,days,seperator)
    },
    DateMinus(date1,date2){
      return utils.DateMinus(date1,date2)
    },
    getMyDay(date){
      return utils.getMyDay(date)
    },
    redirectTo(url){
      wx.redirectTo({
        url
      })
    },
    serialize(obj){
      return utils.serialize(obj)
    },
    checkUserState(cb){
      let openid=wx.getStorageSync('openid');
      http.get(`api/schoolbox/checkUserState`,{openid},false).then(res=>{
        if(cb && typeof cb === 'function') cb(res);            
      }).catch(res => {
        Toast({ message: res.data.msg||'接口异常', forbidClick:true,duration:1000}); 
      })
    },
    userInfoUpdate(params){
      let openid=wx.getStorageSync('openid');
      http.get(`api/schoolbox/userInfoUpdate`,{openid,...params},false).then(res=>{
                    
      }).catch(res => {
        Toast({ message: res.data.msg||'接口异常', forbidClick:true,duration:1000}); 
      })
    },
    mixintap () {
      this.mixin = 'MixinText' + (Math.random() + '').substring(3, 7);
      console.log('mixin method tap');
    },
    tap () {
      console.log('tap in mixin');
    }
  },
  created () {
    console.log('created in mixin');
  }
}
