
const axios=require('axios')
const {KEYNAME_MARKETPRICES}=require('../configs/configs')
const API_TICKER_GAIA='https://api.gex.live/openapi/quote/v1/ticker/price?symbol=GAIAUSDT'
const db=require('../models')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
let PERIOD_POLL_TICKER=60*10*1000
const getTicker=()=>{
  axios.get(API_TICKER_GAIA).then(resp=>{    if(resp && resp.data){} else {return false}
    const price=resp.data.price;console.log('gaia',price)
    cliredisa.hset(KEYNAME_MARKETPRICES,'GAIA',price)
  })
}
db.operations.findOne({raw:true,where:{key_:'PERIOD_POLL_TICKER_GEX'}}).then(resp=>{
	if(resp && resp['value_']){PERIOD_POLL_TICKER=parseInt(resp['value_'])
		setTimeout(()=>{console.log('Polling price tickers-gaia'); if(true){getTicker()}
			setInterval(()=>{		getTicker()			}, PERIOD_POLL_TICKER )
		},7.5*1000)
	}
})
module.exports={getTicker}

