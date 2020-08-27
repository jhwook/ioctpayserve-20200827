const axios=require('axios'),moment=require('moment')
const API_COINMARKET_TICKER='https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=3&convert=USD'
const axiosConfig={  headers: {	'X-CMC_PRO_API_KEY': '1ad8870a-a601-4aec-8476-61612dd0d44c' }}
const db=require('../models')
const getTicker=()=>{
	axios.get( API_COINMARKET_TICKER,axiosConfig )
		.then(resp=>{ console.log(resp.data)
			btcUsdTicker=resp.data.data[ 0 ].quote.USD.price
			ethUsdTicker=resp.data.data[1].quote.USD.price
			xrpUsdTicker=resp.data.data[ 2 ].quote.USD.price
			ethUsdTickerTime=moment().format('YYYYMMDD-HH:mm:ss.SSS')
			console.log(btcUsdTicker,ethUsdTicker,xrpUsdTicker)
db.marketprices.create({})
			return false

			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_BTC_TICKER,btcUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_ETH_TICKER,ethUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_XRP_TICKER,xrpUsdTicker )
			client.hset ( NAMESPACE_REDIS,configjs.KEYNAME_ETH_TICKER_DATETIME, ethUsdTickerTime )
				} // resp.data.data[1]
		)
		.catch(err=>{console.log(err) } ) // ; logger4.debug(err)
} // END
getTicker()