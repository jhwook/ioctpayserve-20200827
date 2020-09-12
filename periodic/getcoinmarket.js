const axios=require('axios'),moment=require('moment')
// const {netkind}=require('../configs/ETH/config_web3')
const {KEYNAME_MARKETPRICES}=require('../configs/configs')
const API_COINMARKET_TICKER='https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=3&convert=USD'
const axiosConfig={  headers: {	'X-CMC_PRO_API_KEY': '1ad8870a-a601-4aec-8476-61612dd0d44c' }}
const db=require('../models')
const redis=require('redis');const cliredis=redis.createClient();const clientredisa=require('async-redis').createClient()
const getTicker=()=>{
	axios.get( API_COINMARKET_TICKER,axiosConfig )
	.then(resp=>{ let jprices={} // console.log(resp.data)			
		resp.data.data.forEach(ticker=>{ const price=ticker.quote.USD.price;				jprices[ticker['symbol']]=price
			cliredis.hset(KEYNAME_MARKETPRICES , ticker['symbol'] , price )
		});			console.log( jprices ,moment())
		db.marketprices.create({ ... jprices, units:'USD'})
		if(jprices['USDT']){} else {jprices['USDT']=1}
		cliredis.hset(KEYNAME_MARKETPRICES,'ALL',JSON.stringify( jprices ))
		return false
	}) // resp.data.data[1]	
	.catch(err=>{console.log(err) } ) // ; logger4.debug(err)
} // END
let PERIOD_POLL_MARKETPRICES=60*60*1000
db.operations.findOne({raw:true,where:{key_:'PERIOD_POLL_MARKETPRICES'}}).then(resp=>{
	if(resp && resp['value_']){PERIOD_POLL_MARKETPRICES=parseInt(resp['value_'])
		setTimeout(()=>{console.log('Polling-CM'); if(false){getTicker()}
			setInterval(()=>{		getTicker()			}, PERIOD_POLL_MARKETPRICES )
		},2.5*1000)
	}
})
module.exports={getTicker}

/*
			const btcprice=resp.data.data[ 0 ].quote.USD.price
			const ethprice=resp.data.data[1].quote.USD.price
			const xrpprice=resp.data.data[ 2 ].quote.USD.price //			ethUsdTickerTime=moment().format('YYYYMMDD-HH:mm:ss.SSS')
			const jdata={BTC:btcprice,ETH:ethprice,XRP:xrpprice}
			console.log(btcprice,ethprice,xrpprice,moment())
db.marketprices.create({... jdata,units:'USD'})	 // if(false){db.marketprices.bulkCreate([	 {currency:'BTC',price:btcprice,units:'USD'},  {currency:'ETH',price:ethprice,units:'USD'},  {currency:'XRP',price:xrpprice,units:'USD'}]);		}
			cliredis.hset(KEYNAME_MARKETPRICES,'BTC',btcprice)
cliredis.hset(KEYNAME_MARKETPRICES,'ETH',ethprice)
cliredis.hset(KEYNAME_MARKETPRICES,'XRP',xrpprice)
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_BTC_TICKER,btcprice )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_ETH_TICKER,ethUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_XRP_TICKER,xrpUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_ETH_TICKER_DATETIME, ethUsdTickerTime )
*/