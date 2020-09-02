
const axios=require('axios')
const {KEYNAME_MARKETPRICES}=require('../configs/configs')
const API_TICKER='https://free.currconv.com/api/v7/convert?q=USD_KRW&compact=ultra&apiKey=b8782941ea6e6ddc5676'
const db=require('../models')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const symbol='KRWUSD'
let PERIOD_POLL_TICKER=60*20*1000
const getTicker=()=>{
  axios.get(API_TICKER).then(resp=>{    if(resp && resp.data){} else {return false}
    const {USD_KRW:price}=resp.data;console.log('usdkrw',price)
    cliredisa.hset(KEYNAME_MARKETPRICES,'KRWUSD',price)
    db.tickers.create ({
      name:symbol
      , price:price
      , pricestr:price
      , units:'KRW'
      , kind:'FOREX'
    })
  })
}
db.operations.findOne({raw:true,where:{key_:'PERIOD_POLL_TICKER'}}).then(resp=>{
	if(resp && resp['value_']){PERIOD_POLL_TICKER=parseInt(resp['value_'])
		setTimeout(()=>{console.log(`Polling price tickers-${symbol}`); if(true){getTicker()}
			setInterval(()=>{		getTicker()			}, PERIOD_POLL_TICKER )
		},13.5*1000)
	}
})
module.exports={getTicker}

