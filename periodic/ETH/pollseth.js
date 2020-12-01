
const axios=require('axios'),moment=require('moment')
let {web3,netkind,nettype,getapikey}=require('../../configs/ETH/configweb3') // const API_TXS=netkind=='mainnet'? 'https://api.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B 37ZU6B8WRVZUZ2ZUPW'  : 'https://api-ropsten.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KR A2B37ZU6B8WRVZUZ2ZUPW'
const API_TXS=`https://${netkind=='ropsten'?'api-ropsten':'api'}.etherscan.io/api`
const db=require('../../models')
const {getRandomInt,isequalinlowercases,convweitoeth,gettimestr,callhook}=require('../../utils')
const {TIMESTRFORMAT,TIMESTRFORMATMILI}=require('../../configs/configs')
const configs=require('../../configs/configs') // ;const { delete } = require('request')
 const {queuenamesj}=configs
const ENDBLOCKDUMMY4QUERY=50000000;const B_VERB=false
const PERIOD_DIST_POLLS=60*10*1000, CURRENCYLOCAL='ETH',CURRENCYDECIMALS=18, DELTA_T_SHORT=60*1.0*1000
const DELTA_T=process.env.NODE_ENV && process.env.NODE_ENV=='development'? DELTA_T_SHORT:PERIOD_DIST_POLLS;const MAP_URLSHORT={'https://api.etherscan.io/api':'etherscan'}
let jaddresses={},jhandlers={}
const setpoller=jdata=>{const {username,address}=jdata
  const deltat=getRandomInt(5*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'),'ETH',gettimestr())
  setTimeout(()=>{    if(false){pollblocks({address:address,username:username})}
    jhandlers[address.toLowerCase()]=    setInterval(()=>{ pollblocks({address:address,username:username})
    }, PERIOD_DIST_POLLS)
  } ,deltat )
}
const runmode=process.env.NODE_ENV,devactive=runmode && runmode=='development'?1:0
const init=_=>{ // .toLower,Case()
  for (let i=0;i<web3.eth.accounts.wallet.length;i++){    const address=web3.eth.accounts.wallet[i].address // ;console.log(address,'ETH')
    db.balance.findOne({raw:true,where:{address:address,nettype:nettype,currency:CURRENCYLOCAL,active:1,devactive:devactive }}).then(resp=>{      if(resp){} else {return false} ; const username=resp['username']// console.log(resp);
      jaddresses[address.toLowerCase()]=username;const deltat=getRandomInt(5*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'),'ETH',address.substr(0,10),resp['username']) // ,gettimestr()
      setTimeout(()=>{    if(false){pollblocks({address:address,username:username})}
        setInterval(()=>{ pollblocks({address:address,username:username})
        }, PERIOD_DIST_POLLS)
      } ,deltat )
    })
  }
} ; setTimeout(_=>{console.log('ETHs',jaddresses,Object.keys(jaddresses).length)},13*1000)

//const reinit=()=>{  db.balance.findOne({raw:true,where:{address:address,netkind:netkind,currency:CURRENCYLOCAL }}).then(resp=>{      if(resp){} else {return false} ;    jaddre sses[address]=resp['username']  })}
const pollblocks=async jdata=>{  const {address,}=jdata
  db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currencykind:CURRENCYLOCAL,currencytype:CURRENCYLOCAL}}).then(async respbb=>{let startblock=1;if(B_VERB){console.log('respbb',respbb)}
    if(respbb){startblock=respbb['blocknumber']+1} else {}; let username=jaddresses[address.toLowerCase()] || '' // let username=respbb && respbb['username']?respbb['username']:null
    B_VERB && console.log(startblock,ENDBLOCKDUMMY4QUERY,address.substr(0,8),'\u2699',username,'\u2699', '\u2618','@polleth',moment().format('HH:mm:ss.SSS'))
    const query={startblock:startblock,endblock:ENDBLOCKDUMMY4QUERY,address:address
      ,module:'account'
      ,action:'txlist'
      ,sort:'asc'
      , apikey:getapikey()
    }
    try{B_VERB && console.log(MAP_URLSHORT[API_TXS]? MAP_URLSHORT[API_TXS]:API_TXS)
    axios.get(API_TXS,{params:{... query}}).then(async resp=>{ // console.log(resp)
      if(resp){} else {return false}
      if(resp.data.result && resp.data.result.length>0){} else {return false}
      let maxblocknumber=-1,txdataatmax=null,amountcumul=0; const username=jaddresses[address.toLowerCase()]
//      resp.data.result.forEach(txdata=>{
      for (let i in resp.data.result) {const txdata=resp.data.result[i]; if(txdata.to && txdata.to.length>40){} else {continue}
        if(isequalinlowercases(txdata.to, address)){} else {continue} console.log(txdata) // return false
        if (txdata.isError=='1'){continue} else {} // return false
        const curbn=parseInt(txdata.blockNumber)
        if(maxblocknumber<curbn){maxblocknumber=curbn, txdataatmax=txdata}
        
        const resptx=await db.transactions.findOne({raw:true,where:{currency:CURRENCYLOCAL,hash:txdata['hash'],direction:'IN'}});      if(resptx){continue} else {}
        amountcumul+=parseInt(txdata.value )

        const amtraw=txdata.value , fee=parseInt(txdata.gas)*parseInt(txdata.gasPrice)
        db.balance.findOne({where:{username:username,currency:CURRENCYLOCAL,nettype:nettype}}).then(respbal=>{         let baldata 
					if(respbal){baldata=respbal.dataValues}
          db.transactions.create({
            username:username
            , currency:CURRENCYLOCAL
            , fromamount:amtraw
            , toamount:amtraw
            , amountfloatstr:convweitoeth(amtraw)
            , fromaddress:txdata.from
            , toaddress:address
            , direction:'IN'
            , blocknumber:txdata['blockNumber']
            , hash:txdata['hash']
            , amountbefore:	baldata? baldata['amount']:0
            , amountafter:	baldata? baldata['amount']+amtraw:amtraw
            , kind:'DEPOSIT'
            , netkind:netkind
            , nettype:nettype
            , gaslimitbid:txdata.gas, gaslimitoffer:txdata.gasUsed
            , gasprice:txdata.gasPrice
            , fee:fee
            , feestr:convweitoeth(fee,CURRENCYDECIMALS)
            , txtime:moment.unix(txdata['timeStamp']).format(TIMESTRFORMAT)
            , sitename:baldata['sitename']?baldata['sitename']:''
          })  
        })
        try{callhook({name:username,currency:CURRENCYLOCAL,amount:convweitoeth(amtraw)})}catch(err){console.log(err)}
      }
//      })
console.log('txdataatmax',txdataatmax)
  if(txdataatmax ) {} else {return false} // Object.keys(txdataatmax).length>0
      if(respbb){ db.blockbalance.update({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['value'],amountcumul:db.sequelize.literal(`amountcumul+${amountcumul}`)      },{where:{address:address,currencykind:CURRENCYLOCAL ,currencytype:CURRENCYLOCAL,direction:'IN',netkind:netkind}})      }  // txdataatmax['blockNumber']
      else      { db.blockbalance.create({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['value'],amountcumul:amountcumul,      currencykind:CURRENCYLOCAL,address:address,currencytype:CURRENCYLOCAL,direction:'IN',netkind:netkind,username:username      })      }
      console.log(maxblocknumber,amountcumul)
      db.balance.update({blocknumberrx:maxblocknumber
        , amount:db.sequelize.literal(`amount+${amountcumul}`)
        , amountfloat:db.sequelize.literal(`amountfloat+${convweitoeth(amountcumul,CURRENCYDECIMALS)}`)
    },{where:{username:username,currency:CURRENCYLOCAL,nettype:nettype}}) // netkind:netkind
    })
  } catch(err){console.log(err)}
  })
}
setTimeout(()=>{init()}, 1.5*1000) 
module.exports={pollblocks}

setTimeout(()=>{
  const qname=queuenamesj['ADDR-ETH']
const channel=require('../../reqqueue/dequeuer')(qname) //  ch.co nsume( 'ADDR-TOKEN' , function(msg) {			const str=msg.content.toString();			console.log(" [x] Rece ived %s",str)})
channel.then(ch=>{
  ch.consume( qname , (msg)=> {
    const str=msg.content.toString(); ch.ack(msg)
    console.log(` [x] Received %s@${qname}@${moment().format(TIMESTRFORMATMILI)}`,str)
    const packet=JSON.parse(str) ; const addresslower=packet['address'].toLowerCase()
    if(packet['flag']=='ADD'){
      jaddresses[addresslower]=packet['username'] // jaddresses[packet['username']]=packet['address']
      setpoller({username:packet['username'], address:packet['address']})  
    }
    else if (packet['flag']=='DELETE'){
      delete jaddresses[addresslower]
      clearInterval(jhandlers[addresslower])
    }
    else {return false} //console.log('INCAMT')
  },{noAck:false})
})  
} , 2700)

/* {
"status": "0",
"message": "No transactions found",
"result":[]
}*/
/*
axios.get(API_TXS,{params:{startblock:}})
&startblock=0
&endblock=99999999
&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a
*/
