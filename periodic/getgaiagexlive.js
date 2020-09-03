
const axios=require('axios')
const {KEYNAME_MARKETPRICES}=require('../configs/configs')
const API_TICKER='https://api.gex.live/openapi/quote/v1/ticker/price?symbol=GAIAUSDT'
const db=require('../models')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const symbol='GAIA'
let PERIOD_POLL_TICKER=60*20*1000
const getTicker=()=>{
  axios.get(API_TICKER).then(resp=>{    if(resp && resp.data){} else {return false}
    const price=resp.data.price;console.log(symbol,price)
    cliredisa.hset(KEYNAME_MARKETPRICES,symbol,price)
    db.tickers.create ({
      name:symbol
      , price:price
      , pricestr:price
      , units:'USD'
      , kind:'TOKEN'
    })
  })
}
db.operations.findOne({raw:true,where:{key_:'PERIOD_POLL_TICKER_GEX'}}).then(resp=>{
	if(resp && resp['value_']){PERIOD_POLL_TICKER=parseInt(resp['value_'])
		setTimeout(()=>{console.log(`Polling GEX-${symbol}`); if(true){getTicker()}
			setInterval(()=>{		getTicker()			}, PERIOD_POLL_TICKER )
		},7.5*1000)
	}
})
module.exports={getTicker}

