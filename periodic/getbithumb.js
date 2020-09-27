const axios=require('axios'),moment=require('moment')
const {KEYNAME_MARKETPRICES,KEYNAME_UNITS}=require('../configs/configs')
const API_TICKER='https://api.bithumb.com/public/ticker'
const BASE_CURRENCY='KRW'
const db=require('../models')
const redis=require('redis');const cliredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const getTicker=currency=>{currency=currency.toUpperCase()
  axios.get( `${API_TICKER}/${currency}_${BASE_CURRENCY}` )
  .then(resp=>{ // console.log(resp.data.status)
    if(resp.data.status=='0000'){} else {return false} ; let price=resp.data.data.closing_price // ;console.log(currency,price)
    cliredisa.hset(KEYNAME_MARKETPRICES,currency,price)
    cliredisa.hset(KEYNAME_UNITS, currency,BASE_CURRENCY)
  })
}
const OFFSET_POLLER=7,INTERLEAVER_POLLERS=30,PERIOD_POLL=60*1000
const CURRENCIES2POLL=['BTC','ETH']
setTimeout(()=>{
  setInterval(()=>{getTicker(CURRENCIES2POLL[0])}    ,PERIOD_POLL  )
},OFFSET_POLLER*1000)

setTimeout(()=>{
  setInterval(()=>{getTicker(CURRENCIES2POLL[1])  }, PERIOD_POLL)
}, (OFFSET_POLLER+INTERLEAVER_POLLERS)*1000 )
