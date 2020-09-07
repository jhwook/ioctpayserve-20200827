
const ethNetSvcAddr="https://mainnet.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0"
const DT_STR_FORMAT_DEF='HH:mm:ss.SSS - YYYY-MM-DD' // const config01=require('../config/config01')
// const config00=require('../config/config00.json'),{B_WRITE_TO_TX_TABLE_EARLY_OR_LATE,KEYNAME_TXHASHES2HASHES,KEYNAME_TXHASH_INTERNAL,KEYNAME_TXHASH_BATCHES,KEYNAME_TX_IN_QUEUE}=config00
// const utils=require('../utils'),{getweistr,getadmin,getethfloatfromweibn,gettmestr,getprvk}=utils
const db=require('../../models')
let MIN_ETH_AMOUNT_TO_INVOKE_TRANSFER=null,MIN_TOKEN_AMOUNT_TO_INVOKE_TRANSFER_WEI=null
// let GAS_PRICE_ETH=null, GAS_LIMIT_ETH=null
let GAS_PRICE_ETH=1, GAS_LIMIT_ETH=1
const moment=require('moment') // ; const bn=require('bignumber');const B_VERB=false
const cron=require('node-cron');
const log4js = require('log4js'); log4js.configure({  appenders: { everything: { type: 'file', filename: 'log-eth-polls.log' }  },	categories: { default: { appenders: [ 'everything' ], level: 'debug' }  }} )
const logger4 = log4js.getLogger(); logger4.level = 'debug'
const {netkind,nettype}=require('../../configs/ETH/configweb3') // const ethNetKind='mainnet',netkind=ethNetKind
const axios=require('axios');
const API_EST_GAS=`${ethNetSvcAddr}`
console.log('Polling-ETH gas')
const tkntxdatalong='f8a90a8504e3b29200827458948686b7d8a9c10f53819ed2a8e3aac0cedf6fa9cf80b844a9059cbb000000000000000000000000729e5ae8e1b3dcab5f0a1dc74eac22937172e5c90000000000000000000000000000000000000000000000000000000005f5e10026a0ab4018f894b59a296654947cf303bdb60a35b6b1764ab70a2feee9101871cf2ca03486b30e6276ce883cdffa00051b127a3ba83d654f19d57cc972915015045596'
const tkntxdata='0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'
cron.schedule(`*/15 * * * *`,()=>{
	let _respprice=axios.post(API_EST_GAS,{"jsonrpc":"2.0","method":"eth_gasPrice","params": [],"id":1})
	let _respest=axios.post(API_EST_GAS,{"jsonrpc":"2.0","method":"eth_estimateGas","params": [{"from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155"	,"to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567","gas": "0x76c0","gasPrice": "0x9184e72a000","value": "0x9184e72a","data": tkntxdata}],"id":1})
	Promise.all([_respprice,_respest]).then(aresps=>{ //		console.log(aresps);return false
		const estprice=aresps[0]['data']['result']?aresps[0]['data']['result']:null;		const estlimit=aresps[1]['data']['result']?aresps[1]['data']['result']:null
		console.log(estprice,estlimit) // ;return false
		db.ethgasestimates.create({
			gaspricehex:estprice
			, gaspriceweistr:parseInt(estprice)
			, gaspricefloat:parseInt(estprice)/10**18
			, gaslimithex:estlimit
			, gaslimitweistr:parseInt(estlimit)
			, gaslimitfloat:null
			, netkind:netkind
			, gaspricehexinuse: '0x'+GAS_PRICE_ETH.toString(16)
			, gaspriceweiinusestr: GAS_PRICE_ETH
			, gaslimithexinuse: '0x'+GAS_LIMIT_ETH.toString(16)
			, gaslimitweiinusestr: GAS_LIMIT_ETH
			, ratiopriceuseoverest: GAS_PRICE_ETH/estprice
			, ratiolimituseoverest: GAS_LIMIT_ETH/estlimit
			, currency:null
		})
		console.log(`${(GAS_PRICE_ETH/10**9).toFixed(2)} GWei: X${(GAS_PRICE_ETH/estprice).toFixed(3)},${GAS_LIMIT_ETH}: X${(GAS_LIMIT_ETH/estlimit).toFixed(3)}@${moment().format('HH:mm:ss.SSS')}`)
	})
})
module.exports={}
const initgasparams=()=>{
	db.operations.findOne({raw:true,where:{key_:'GAS_PRICE_ETH',subkey_:netkind}}).then(resp=>{GAS_PRICE_ETH=parseInt(resp['value_'])})
	db.operations.findOne({raw:true,where:{key_:'GAS_LIMIT_ETH',subkey_:netkind}}).then(resp=>{GAS_LIMIT_ETH=parseInt(resp['value_'])})
}
initgasparams()
