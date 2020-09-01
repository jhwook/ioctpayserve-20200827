const axios=require('axios'),moment=require('moment')
// const {netkind}=require('../configs/ETH/configweb3')
const {KEYNAME_MARKETPRICES}=require('../configs/configs')
const API_COINMARKET_TICKER='https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=3&convert=USD'
const axiosConfig={  headers: {	'X-CMC_PRO_API_KEY': '1ad8870a-a601-4aec-8476-61612dd0d44c' }}
const db=require('../models')
const redis=require('redis');const clientredis=redis.createClient();const clientredisa=require('async-redis').createClient()
const getTicker=()=>{
	axios.get( API_COINMARKET_TICKER,axiosConfig )
		.then(resp=>{ // console.log(resp.data)
			const btcprice=resp.data.data[ 0 ].quote.USD.price
			const ethprice=resp.data.data[1].quote.USD.price
			const xrpprice=resp.data.data[ 2 ].quote.USD.price //			ethUsdTickerTime=moment().format('YYYYMMDD-HH:mm:ss.SSS')
			const jdata={BTC:btcprice,ETH:ethprice,XRP:xrpprice}
			console.log(btcprice,ethprice,xrpprice,moment())
db.marketprices.create({... jdata,units:'USD'})	 // if(false){db.marketprices.bulkCreate([	 {currency:'BTC',price:btcprice,units:'USD'},  {currency:'ETH',price:ethprice,units:'USD'},  {currency:'XRP',price:xrpprice,units:'USD'}]);		}
clientredis.hset(KEYNAME_MARKETPRICES,'BTC',btcprice)
clientredis.hset(KEYNAME_MARKETPRICES,'ETH',ethprice)
clientredis.hset(KEYNAME_MARKETPRICES,'XRP',xrpprice)
clientredisa.hset(KEYNAME_MARKETPRICES,'ALL',JSON.stringify({BTC:btcprice,ETH:ethprice,XRP:xrpprice}))
return false
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_BTC_TICKER,btcprice )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_ETH_TICKER,ethUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_XRP_TICKER,xrpUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_ETH_TICKER_DATETIME, ethUsdTickerTime )
				} // resp.data.data[1]
		)
		.catch(err=>{console.log(err) } ) // ; logger4.debug(err)
} // END
let PERIOD_POLL_MARKETPRICES=60*60*1000
db.operations.findOne({raw:true,where:{key_:'PERIOD_POLL_MARKETPRICES'}}).then(resp=>{
	if(resp && resp['value_']){PERIOD_POLL_MARKETPRICES=parseInt(resp['value_'])
		setTimeout(()=>{console.log('Polling price tickers'); if(false){getTicker()}
			setInterval(()=>{		getTicker()			}, PERIOD_POLL_MARKETPRICES )
		},2.5*1000)
	}
})
module.exports={getTicker}