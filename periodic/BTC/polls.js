
const axios=require('axios'),moment=require('moment')
let configbtc=require('../../configs/BTC/configbtc'); const {netkind,nettype}=configbtc
const API_TXS=nettype=='testnet'? `https://testnet.blockchain.info/rawaddr` : 'https://blockchain.info/rawaddr' // /${address}`
const db=require('../../models')
const {getRandomInt,isequalinlowercases,convweitoeth,gettimestr}=require('../../utils')
const {TIMESTRFORMAT,TIMESTRFORMATMILI}=require('../../configs/configs')
const configs=require('../../configs/configs');const { delete } = require('request');
 const {queuenamesj}=configs
const ENDBLOCKDUMMY4QUERY=5000000
const PERIOD_DIST_POLLS=60*10*1000, CURRENCYLOCAL='BTC',CURRENCYKIND='BTC',CURRENCYTYPE='BTC',CURRENCYDECIMALS=8, DELTA_T_SHORT=60*1.5*1000 // ,NETKIND=netkind // 'testnet'
const DELTA_T=process.env.NODE_ENV && process.env.NODE_ENV=='development'? DELTA_T_SHORT:PERIOD_DIST_POLLS
let jaddresses={},jhandlers={}
const setpoller=jdata=>{const {username,address}=jdata
  const deltat=getRandomInt(5*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'),'ETH',gettimestr())
  setTimeout(()=>{    if(false){pollblocks({address:address,username:username})}
    jhandlers[address]= setInterval(()=>{ pollblocks({address:address,username:username})
    }, PERIOD_DIST_POLLS)
  } ,deltat )
}
const init=()=>{
  db.balance.findAll({raw:true,where:{currency:CURRENCYLOCAL,netkind:netkind}}).then(aresps=>{
    aresps.forEach(acct=>{
      const address=acct['address']
      jaddresses[address]=acct['username'];const deltat=getRandomInt(9.5*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'), 'BTC',gettimestr())
      setTimeout(()=>{    pollblocks({address:address})
        setInterval(()=>{ pollblocks({address:address})
        }, PERIOD_DIST_POLLS)
      }, deltat)
    })
    console.log(jaddresses)
  })
}
const pollblocks=async jdata=>{const {address,}=jdata
  db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currencytype:CURRENCYTYPE,netkind:netkind}}).then(async respbb=>{let startblock=0
    if(respbb){ startblock=respbb['blocknumber']+1} else {}
    console.log(startblock,ENDBLOCKDUMMY4QUERY,address, '\u26F5','','@pollbtc',moment().format(TIMESTRFORMATMILI))
//    const query={after:startblock    }
    try{console.log('blockchain.info/')
    axios.get(`${API_TXS}/${address}`,{params:{}}).then(async resp=>{ // console.log(resp.data)
      if(resp){} else {return false}
      if(resp.data.txs && resp.data.txs.length>0){} else {return false}
      let maxblocknumber=-1,txdataatmax=null,amountcumul=0; const username=jaddresses[address]
      for (let i in resp.data.txs){const txdata=resp.data.txs[i]   ;console.log(txdata.result)
        if(txdata.result>0){} else {continue}
        const curbn=parseInt(txdata['block_height']);        console.log(startblock,curbn)
        if(startblock<=curbn){} else {continue}
        if(maxblocknumber<curbn){maxblocknumber=curbn, txdataatmax=txdata} // ; amountcumul+=parseInt(txdata.result )

        const resptx=await db.transactions.findOne({raw:true,where:{currency:CURRENCYLOCAL,hash:txdata['hash']}});      if(resptx){continue} else {}
        amountcumul+=parseInt(txdata.result )

        const amtraw=txdata.result , fee=getfee(txdata)
        callhook({name:username,currency:CURRENCYLOCAL,amount:convweitoeth(amtraw,CURRENCYDECIMALS)})
        db.balance.findOne({where:{username:username,currency:CURRENCYLOCAL,nettype:nettype}}).then(respbal=>{  const baldata=respbal.dataValues
          db.transactions.create({
            username:username
            , currency:CURRENCYLOCAL
            , fromamount:amtraw
            , toamount:amtraw
            , amountfloatstr:convweitoeth(amtraw,CURRENCYDECIMALS)
            , fromaddress:getmaxsenderaddress(txdata)
            , toaddress:address
            , direction:'IN'          
            , blocknumber:curbn // txdata['block_height']
            , hash:txdata['hash']
            , amountbefore:baldata['amount']
            , amountafter:baldata['amount']+amtraw
            , kind:'DEPOSIT'
            , netkind:netkind
            , nettype:nettype
            , gaslimitbid:null,gaslimitoffer:null
            , gasprice:null
            , fee:fee
            , feestr:convweitoeth(fee,CURRENCYDECIMALS)
            , txtime:moment.unix(txdata['time']).format(TIMESTRFORMAT)
          })  
        })
      }
      console.log('txdataatmax',txdataatmax)
      if(txdataatmax) {} else {return false}
      if(respbb){ db.blockbalance.update({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['result'],amountcumul:db.sequelize.literal(`amountcumul+${amountcumul}`)      },{where:{address:address,currencytype:CURRENCYTYPE,currencykind:CURRENCYKIND, direction:'IN',netkind:netkind,username:username}})      }  // txdataatmax['blockNumber']
      else      { db.blockbalance.create({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['result'],amountcumul:amountcumul      ,address:address,currencytype:CURRENCYTYPE,currencykind:CURRENCYKIND, direction:'IN',netkind:netkind,username:username      })      }
      db.balance.update({blocknumberrx:maxblocknumber
        ,  amount:db.sequelize.literal(`amount+${amountcumul}`)
        , amountfloat:db.sequelize.literal(`amountfloat+${convweitoeth(amountcumul,CURRENCYDECIMALS)}`      )},{where:{username:username,currency:CURRENCYLOCAL,netkind:netkind}})
    })
  } catch(err){console.log(err)}
  })
}
const getmaxsenderaddress=txdata=>{let maxval=-1000,addressatmax=null
  txdata.inputs.forEach(input=>{        const inputdata=input.prev_out
    if(maxval<inputdata.value){maxval=inputdata.value;addressatmax=inputdata.addr}
  })
  return addressatmax  
}
const getfee=txdata=>{return sumupinvalues(txdata)-sumupoutvalues(txdata)}
const sumupinvalues=txdata=>{let sum=0;  txdata.inputs.forEach(e=>{    sum+=e.prev_out.value  })
  return sum}
const sumupoutvalues=txdata=>{let sum=0;  txdata.out.forEach(e=>{    sum+=e.value  })
  return sum}
setTimeout(()=>{init()}, 1.5*1000)  // init()
module.exports={pollblocks}
  
setTimeout(()=>{
const qname=queuenamesj['ADDR-BTC']
const channel=require('../../reqqueue/dequeuer')(qname) 
channel.then(ch=>{
  ch.consume( qname , (msg)=> {
    const str=msg.content.toString();                       
    console.log(` [x] Received %s@${qname}@${moment().format(TIMESTRFORMATMILI)}`,str)
    const packet=JSON.parse(str) ; const address=packet['address']
    if(packet['flag']=='ADD'){
      jaddresses[address]=packet['username'] // jaddresses[packet['username']]=packet['address']
      setpoller({username:packet['username'], address:packet['address']})
    }  
    else if (packet['flag']=='DELETE'){
      delete jaddresses[address]
      clearInterval(jhandlers[address])
    }
    else {return false} 
  })
})
  
}, 1700)
