
const axios=require('axios'),moment=require('moment')
let {web3,netkind,nettype,getapikey}=require('../../configs/ETH/configweb3') // 
const API_TXS=`https://${netkind=='ropsten'?'api-ropsten':'api'}.etherscan.io/api`
const db=require('../../models')
const {getRandomInt,isequalinlowercases, convweitoeth,gettimestr,callhook}=require('../../utils')
const ENDBLOCKDUMMY4QUERY=70000000;const B_VERB=false
const {TIMESTRFORMAT,TIMESTRFORMATMILI}=require('../../configs/configs')
const configs=require('../../configs/configs'); const {queuenamesj}=configs
const PERIOD_DIST_POLLS=60*10*1000,CURRENCYKIND='TOKEN',CURRENCYTYPE='ETH', DECIMALS_DEF=18, DELTA_T_SHORT=60*1.5*1000
const DELTA_T=process.env.NODE_ENV && process.env.NODE_ENV=='development'? DELTA_T_SHORT:PERIOD_DIST_POLLS;const MAP_URLSHORT={'https://api.etherscan.io/api':'etherscan'}
let jaddresses={},jaddresstokens={},jsymboltokens={},jhandlers={}
const setpoller=jdata=>{const {username,address}=jdata
  const deltat=getRandomInt(5*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'),'ETH',gettimestr())
  setTimeout(()=>{    if(false){pollblocks({address:address,username:username})}
    jhandlers[address.toLowerCase()]= setInterval(()=>{ pollblocks({address:address,username:username})
    }, PERIOD_DIST_POLLS)
  } ,deltat)
}
const init=()=>{ // .toLower,Case()
  for (let i=0;i<web3.eth.accounts.wallet.length;i++){    const address=web3.eth.accounts.wallet[i].address
    db.balance.findOne({raw:true,where:{address:address,netkind:netkind,active:1}}).then(resp=>{      if(resp){} else {return false}
      jaddresses[address.toLowerCase()]=resp['username'];const deltat=getRandomInt(7*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'),'Token',address.substr(0,10),resp['username']) // ,gettimestr()
      setTimeout(()=>{    if(false){pollblocks({address:address})}
        setInterval(()=>{ pollblocks({address:address})
        }, PERIOD_DIST_POLLS)
      } , deltat)
    })
  }
}; setTimeout(_=>{console.log('tokens:',jaddresses,Object.keys(jaddresses).length)},10*1000)
const pollblocks=async jdata=>{  const {address,}=jdata
db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currencykind:CURRENCYKIND,currencytype:CURRENCYTYPE}}).then(async respbb=>{let startblock=1
	if(respbb){startblock=respbb['blocknumber']+1} else {};	let username=jaddresses[address.toLowerCase()] || '' // let username=respbb && respbb['username']?respbb['username']:null
  B_VERB && console.log(startblock,ENDBLOCKDUMMY4QUERY,address.substr(0,8),'\u2699',username,'\u2699', '\u26BD','@polltoken',moment().format('HH:mm:ss.SSS')) // TIMESTRFORMATMILI
  const query={startblock:startblock    ,endblock:ENDBLOCKDUMMY4QUERY    ,address:address
    ,module:'account'
    ,action:'tokentx' // txlist
    ,sort:'asc'
    , apikey:getapikey()
  }
  try{  B_VERB && console.log(MAP_URLSHORT[API_TXS]?MAP_URLSHORT[API_TXS]:API_TXS) // .toLower,Case()
  axios.get(API_TXS,{params:{...query}}).then(async resp=>{
    if(resp){} else {return false}
    if(resp.data.result && resp.data.result.length>0){} else {return false}
    let maxblocknumber=-1,txdataatmax=null,amountcumul=0,jtokenamountcumul={},jtokenupddata={};const username=jaddresses[address.toLowerCase()]
    for (let i in resp.data.result){const txdata=resp.data.result[i]; if(txdata.to && txdata.to.length>=40){} else {continue}
      if(isequalinlowercases(txdata.to,address)){} else {continue} console.log(txdata)
      if(txdata.isError && txdata.isError=='1'){continue} else {}
      let tokendata=null
      if(tokendata=jaddresstokens[txdata['contractAddress'].toLowerCase()]){} else {continue}; let symbol=tokendata['name']
      const curbn=parseInt(txdata.blockNumber) ;console.log( `start:${startblock} ,curbn:${curbn}`)
      if(startblock<curbn){ } else {continue}
      if(maxblocknumber<curbn){maxblocknumber=curbn,txdataatmax=txdata}
      const resptx=await db.transactions.findOne({raw:true,where:{hash:txdata['hash'],currency:symbol,direction:'IN'}});      if(resptx){continue} else {}

      jtokenamountcumul[symbol]=jtokenamountcumul[symbol]? jtokenamountcumul[symbol]+parseInt(txdata.value):parseInt(txdata.value)
      jtokenupddata[symbol] = jtokenupddata[symbol]? (jtokenupddata[symbol]>curbn?jtokenupddata[symbol]:curbn) :curbn
      const amtraw=txdata['value'] , fee=parseInt(txdata.gas)*parseInt(txdata.gasPrice)
const addresslower=address.toLowerCase()
      db.balance.findOne({where:{username:username,currency:symbol,netkind:netkind}}).then(respbal=>{      const baldata=respbal.dataValues
        db.transactions.create({
          username:username
          , currency:symbol // tokendata['symbol']
          , fromamount:amtraw
//          , toamount:amtraw
          , amountfloatstr:convweitoeth(amtraw,jaddresstokens && jaddresstokens[addresslower] && jaddresstokens[addresslower].denominatorexp?jaddresstokens[addresslower].denominatorexp:DECIMALS_DEF )
          , fromaddress:txdata['from']
          , toaddress:address
          , direction:'IN'
          , blocknumber:txdata['blockNumber']
          , hash:txdata['hash']
          , amountbefore:baldata['amount']
          , amountafter:baldata['amount']+parseInt(amtraw)
          , kind:'DEPOSIT'
          , netkind:netkind
          , nettype:nettype
          , gaslimitbid:txdata.gas, gaslimitoffer:txdata.gasUsed
          , gasprice:txdata['gasPrice']
          , fee:fee
          , feestr:convweitoeth(fee , tokendata['denominatorexp'])
          , txtime:moment.unix(txdata['timeStamp']).format(TIMESTRFORMAT)
          , sitename:baldata['sitename']
        })
    })
      callhook({name:username,currency:tokendata['name'],amount:convweitoeth(amtraw)})
    }
    if(Object.keys(jtokenamountcumul).length>0){} else {return false}
    Object.keys(jtokenamountcumul).forEach(symbol=>{      const amt2inc=jtokenamountcumul[symbol]; console.log(amt2inc,symbol,jsymboltokens[symbol].denominatorexp) // ,jsymboltokens[symbol]
      db.balance.update({blocknumberrx:jtokenupddata[symbol] // block_number
        , amount:db.sequelize.literal(`amount+${amt2inc}`)
        , amountfloat:db.sequelize.literal(`amountfloat+${convweitoeth(amt2inc,jsymboltokens[symbol].denominatorexp)}`)
      },{where:{username:username,currency:symbol,netkind:netkind}})
    })
    if(respbb){db.blockbalance.update({blocknumber:maxblocknumber,hash:txdataatmax.hash,amount:txdataatmax['value']},{where:{address:address,currencykind:CURRENCYKIND,currencytype:CURRENCYTYPE, direction:'IN',netkind:netkind}})}
    else      {db.blockbalance.create({blocknumber:maxblocknumber,hash:txdataatmax.hash,amount:txdataatmax['value'],address:address,currencykind:CURRENCYKIND,currencytype:CURRENCYTYPE, direction:'IN',netkind:netkind,username:username})}    
  }) } catch(err){console.log(err)}
})
}
const inittoken=()=>{ // .toLower,Case()
  db.tokens.findAll({raw:true}).then(aresps=>{
    aresps.forEach(tokendata=>{      if(tokendata['netkind']==netkind){} else {return false}
      if(tokendata['address']){} else {return false}
      jaddresstokens[tokendata['address'].toLowerCase()]=tokendata;      jsymboltokens [tokendata['name'].toUpperCase()]=tokendata
    })
  })
}
setTimeout(()=>{init()}, 1.5*1000) // init()
inittoken()
module.exports={pollblocks}
setTimeout(()=>{
const qname=queuenamesj['ADDR-TOKEN']
const channel=require('../../reqqueue/dequeuer')(qname)
channel.then(ch=>{
  ch.consume( qname , (msg)=> {
    const str=msg.content.toString(); ch.ack(msg)
    console.log(` [x] Received %s@${qname}@${moment().format(TIMESTRFORMATMILI)}`,str)
    const packet=JSON.parse(str) ; const addresslower=packet['address'].toLowerCase()
    if(packet['flag']=='ADD'){
      jaddresses[addresslower]=packet['username'] // jaddr esses[packet['username']]=packet['address']
      setpoller({username:packet['username'], address:packet['address']})  
    }  
    else if(packet['flag']=='DELETE'){
      delete jaddresses[addresslower]
      clearInterval(jhandlers[addresslower])
    }
    else {return false} //cons ole.log('INCAMT')
  },{noAck:false})
})  
} , 3700)
