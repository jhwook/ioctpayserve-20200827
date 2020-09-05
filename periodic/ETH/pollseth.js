
const axios=require('axios'),moment=require('moment')
let {web3,netkind,nettype}=require('../../configs/ETH/configweb3') // const API_TXS=netkind=='mainnet'? 'https://api.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'  : 'https://api-ropsten.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'
const API_TXS=`https://${netkind=='ropsten'?'api-ropsten':'api'}.etherscan.io/api`
const db=require('../../models')
const {getRandomInt,isequalinlowercases,convweitoeth,gettimestr}=require('../../utils')
const {TIMESTRFORMAT}=require('../../configs/configs')
const users = require('../../models/users')
const ENDBLOCKDUMMY4QUERY=50000000
const PERIOD_DIST_POLLS=60*10*1000, CURRENCYLOCAL='ETH',CURRENCYDECIMALS=18, DELTA_T_SHORT=60*1.5*1000
const DELTA_T=process.env.NODE_ENV && process.env.NODE_ENV=='development'? DELTA_T_SHORT:PERIOD_DIST_POLLS
let jaddresses={}
const init=()=>{ // .toLower,Case()
  for (let i=0;i<web3.eth.accounts.wallet.length;i++){    const address=web3.eth.accounts.wallet[i].address // ;console.log(address,'ETH')
    db.balance.findOne({raw:true,where:{address:address,netkind:netkind,currency:CURRENCYLOCAL }}).then(resp=>{      if(resp){} else {return false} ; const username=resp['username']// console.log(resp);
      jaddresses[address]=username;const deltat=getRandomInt(5*1000, DELTA_T);console.log('\u0394',moment(deltat).format('mm:ss'),'ETH',gettimestr())
      setTimeout(()=>{    pollblocks({address:address,username:username})
        setInterval(()=>{ pollblocks({address:address,username:username})
        }, PERIOD_DIST_POLLS)
      } ,deltat )
    })
  }
}
const reinit=()=>{  db.balance.findOne({raw:true,where:{address:address,netkind:netkind,currency:CURRENCYLOCAL }}).then(resp=>{      if(resp){} else {return false} // console.log(resp);
    jaddresses[address]=resp['username']
  })
}
const pollblocks=jdata=>{  const {address,}=jdata
  db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currencytype:CURRENCYLOCAL,netkind:netkind}}).then(respbb=>{let startblock=1
    if(respbb){startblock=respbb['blocknumber']+1} else {}
    console.log(startblock,ENDBLOCKDUMMY4QUERY,address, '@polleth')
    const query={startblock:startblock,endblock:ENDBLOCKDUMMY4QUERY,address:address
      ,module:'account'
      ,action:'txlist'
      ,sort:'asc'
      , apikey:'GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'
    }
    try{console.log(API_TXS)
    axios.get(API_TXS,{params:{... query}}).then(resp=>{ // console.log(resp)
      if(resp){} else {return false}
      if(resp.data.result && resp.data.result.length>0){} else {return false}
      let maxblocknumber=-1,txdataatmax=null,amountcumul=0; const username=jaddresses[address]
//      resp.data.result.forEach(txdata=>{
      for (let i in resp.data.result) {const txdata=resp.data.result[i]
        if(isequalinlowercases(txdata.to, address)){} else {continue} console.log(txdata) // return false
        if (txdata.isError=='1'){continue} else {} // return false
        const curbn=parseInt(txdata.blockNumber)
        if(maxblocknumber<curbn){maxblocknumber=curbn, txdataatmax=txdata}; amountcumul+=parseInt(txdata.value )
        const amtraw=txdata.value
        db.balance.findOne({where:{username:username,currency:CURRENCYLOCAL,netkind:netkind}}).then(respbal=>{          const baldata=respbal.dataValues
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
            , amountbefore:baldata['amount']
            , amountafter:baldata['amount']+amtraw
            , kind:'DEPOSIT'
            , netkind:netkind
            , nettype:nettype
            , gaslimitbid:txdata.gas, gaslimitoffer:txdata.gasUsed
            , gasprice:txdata.gasPrice
            , fee:parseInt(txdata.gas)*parseInt(txdata.gasPrice)
            , txtime:moment.unix(txdata['timeStamp']).format(TIMESTRFORMAT)
          })  
        })
      }
//      })
console.log('txdataatmax',txdataatmax)
  if(txdataatmax ) {} else {return false} // Object.keys(txdataatmax).length>0
      if(respbb){ db.blockbalance.update({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['value'],amountcumul:db.sequelize.literal(`amountcumul+${amountcumul}`)      },{where:{address:address,currencykind:CURRENCYLOCAL ,currencytype:CURRENCYLOCAL,direction:'IN',netkind:netkind}})      }  // txdataatmax['blockNumber']
      else      { db.blockbalance.create({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['value'],amountcumul:amountcumul,      currencykind:CURRENCYLOCAL,address:address,currencytype:CURRENCYLOCAL,direction:'IN',netkind:netkind,username:username      })      }
      db.balance.update({blocknumberrx:maxblocknumber
        , amount:db.sequelize.literal(`amount+${amountcumul}`)
        , amountfloat:db.sequelize.literal(`amountfloat+${convweitoeth(amountcumul,CURRENCYDECIMALS)}`)
    },{where:{username:username,currency:CURRENCYLOCAL,netkind:netkind}})
    })
  } catch(err){console.log(err)}
  })
}
setTimeout(()=>{init()}, 1.5*1000) 
module.exports={pollblocks}
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
