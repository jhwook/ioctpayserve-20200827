
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const {KEYNAME_MARKETPRICES}=require('./configs/configs');
const { gettimestr } = require('./utils');
const PERIOD_POLL_TICKER=5*60*1000
let usdkrwstr=null,usdkrw=null
const convpriceinusd2krw=prinusd=>{  return parseFloat(prinusd)*usdkrw
}
module.exports={convpriceinusd2krw}
const getticker=()=>{return new Promise((resolve,reject)=>{
  cliredisa.hget(KEYNAME_MARKETPRICES,'KRWUSD').then(resp=>{
    if(resp){} else {return false}
    usdkrw=parseFloat(resp);usdkrwstr=resp
  })
})
}
setTimeout(()=>{getticker()
  setInterval(()=>{getticker()
  },PERIOD_POLL_TICKER)
}, 0.1*1000)
