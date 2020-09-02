
const axios=require('axios'),moment=require('moment')
let {web3,netkind}=require('../../configs/ETH/configweb3') // const API_TXS=netkind=='mainnet'? 'https://api.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'  : 'https://api-ropsten.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'
const API_TXS='https://api-ropsten.etherscan.io/api'
const db=require('../../models')
const {getRandomInt,isequalinlowercases}=require('../../utils')
const {TIMESTRFORMAT}=require('../../configs/configs')
const ENDBLOCKDUMMY4QUERY=50000000
const PERIOD_DIST_POLLS=60*10*1000, CURRENCYLOCAL='ETH'
let jaddresses={}
const init=()=>{
  for (let i=0;i<web3.eth.accounts.wallet.length;i++){    const address=web3.eth.accounts.wallet[i].address
    db.balance.findOne({raw:true,where:{address:address.toLowerCase(),netkind:netkind }}).then(resp=>{      if(resp){} else {return false}
      jaddresses[address]=resp['username']
      setTimeout(()=>{
        setInterval(()=>{pollblocks({address:address})
        }, PERIOD_DIST_POLLS)
      } , getRandomInt(5*1000, PERIOD_DIST_POLLS))
    })
  }
}
const pollblocks=jdata=>{  const {address,}=jdata
  db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currency:CURRENCYLOCAL,netkind:netkind}}).then(respbb=>{let startblock=1
    if(respbb){startblock=respbb['blocknumber']+1} else {}
    console.log(startblock,ENDBLOCKDUMMY4QUERY,address)
    const query={startblock:startblock,endblock:ENDBLOCKDUMMY4QUERY,address:address
      ,module:'account'
      ,action:'txlist'
      ,sort:'asc'
      , apikey:'GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'
    }
    axios.get(API_TXS,{params:{... query}}).then(resp=>{ // console.log(resp)
      if(resp){} else {return false}
      if(resp.data.result && resp.data.result.length<1){return false} else {}
      let maxblocknumber=-1,txdataatmax=null,amountcumul=0; const username=jaddresses[address]
//      resp.data.result.forEach(txdata=>{        
      for (let i in resp.data.result) {const txdata=resp.data.result[i]
        if(isequalinlowercases(txdata.to, address)){} else {continue} console.log(txdata) // return false
        if (txdata.isError=='1'){continue} else {} // return false
        const curbn=parseInt(txdata.blockNumber)
        if(maxblocknumber<curbn){maxblocknumber=curbn, txdataatmax=txdata}; amountcumul+=parseInt(txdata.value )
        db.transactions.create({
          username:username
          , currency:'ETH'
          , fromamount:txdata.value
          , toamount:txdata.value
          , amountfloatstr:convweitoeth(txdata['value'])
          , fromaddress:txdata.from
          , toaddress:address
          , direction:'IN'
          , blocknumber:txdata['blockNumber']
          , hash:txdata['hash']
          , amountbefore:null
          , amountafter:null
          , kind:'DEPOSIT'
          , netkind:netkind
          , gaslimit:txdata.gas
          , gasprice:txdata.gasPrice
          , fee:parseInt(txdata.gas)*parseInt(txdata.gasPrice)
          , txtime:moment.unix(txdata['timeStamp']).format(TIMESTRFORMAT)
        })
      }
//      })
console.log('txdataatmax',txdataatmax)
      if(respbb){ db.blockbalance.update({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['value'],amountcumul:db.sequelize.literal(`amountcumul+${amountcumul}`)      },{where:{address:address,currency:CURRENCYLOCAL,direction:'IN',netkind:netkind}})      }  // txdataatmax['blockNumber']
      else      { db.blockbalance.create({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['value'],amountcumul:amountcumul      ,address:address,currency:CURRENCYLOCAL,direction:'IN',netkind:netkind      })      }
      db.balance.update({amount:db.sequelize.literal(`amount+${amountcumul}`)},{where:{username:username,currency:currency,netkind:netkind}})
    })
  })
}
init()
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
