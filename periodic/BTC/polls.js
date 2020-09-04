const axios=require('axios'),moment=require('moment')
let configbtc=require('../../configs/BTC/configbtc'); const {netkind,nettype}=configbtc
const API_TXS=`https://testnet.blockchain.info/rawaddr` // /${address}`
const db=require('../../models')
const {getRandomInt,isequalinlowercases,convweitoeth,gettimestr}=require('../../utils')
const {TIMESTRFORMAT}=require('../../configs/configs')
const ENDBLOCKDUMMY4QUERY=5000000
const PERIOD_DIST_POLLS=60*10*1000, CURRENCYLOCAL='BTC',CURRENCYDECIMALS=8 // ,NETKIND=netkind // 'testnet'
let jaddresses={}
const init=()=>{
  db.balance.findAll({raw:true,where:{currency:CURRENCYLOCAL,netkind:netkind}}).then(aresps=>{
    aresps.forEach(acct=>{
      const address=acct['address']
      jaddresses['address']=acct['username'];const deltat=getRandomInt(9.5*1000, PERIOD_DIST_POLLS);console.log('\u0394',moment(deltat).format('mm:ss'), 'BTC',gettimestr())
      setTimeout(()=>{
        setInterval(()=>{pollblocks({address:address})
        }, PERIOD_DIST_POLLS)
      }, deltat)
    })
  })
}
const pollblocks=jdata=>{const {address,}=jdata
  db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currency:CURRENCYLOCAL,netkind:netkind}}).then(respbb=>{let startblock=0
    if(respbb){startblock=respbb['blocknumber']+1} else {}
    console.log(startblock,ENDBLOCKDUMMY4QUERY,address)
//    const query={after:startblock    }
    try{console.log('blockchain.info/')
    axios.get(`${API_TXS}/${address}`,{params:{}}).then(resp=>{
      if(resp){} else {return false}
      if(resp.data.txs && resp.data.txs.length<1){return false} else {}
      let maxblocknumber=-1,txdataatmax=null,amountcumul=0; const username=jaddresses[address]
      for (let i in resp.data.txs){const txdata=resp.data.txs[i]
        if(txdata.result>0){} else {return false}
        if(startblock<txdata['block_height']){} else {return false}
        if(maxblocknumber<curbn){maxblocknumber=curbn, txdataatmax=txdata}; amountcumul+=parseInt(txdata.result )
        const amtraw=txdata.result
        db.transactions.create({
          username:username
          , currency:CURRENCYLOCAL
          , fromamount:amtraw
          , toamount:amtraw
          , amountfloatstr:convweitoeth(amtraw,CURRENCYDECIMALS)
          , fromaddress:getmaxsenderaddress(txdata)
          , toaddress:address
          , direction:'IN'          
          , blocknumber:txdata['block_height']
          , hash:txdata['hash']
          , amountbefore:null
          , amountafter:null
          , kind:'DEPOSIT'
          , netkind:netkind
          , gaslimit:null
          , gasprice:null
          , fee:getfee(txdata)
          , txtime:moment.unix(txdata['time']).format(TIMESTRFORMAT)
        })
      }
      console.log('txdataatmax',txdataatmax)
      if(respbb){ db.blockbalance.update({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['result'],amountcumul:db.sequelize.literal(`amountcumul+${amountcumul}`)      },{where:{address:address,currency:CURRENCYLOCAL,direction:'IN',netkind:netkind}})      }  // txdataatmax['blockNumber']
      else      { db.blockbalance.create({blocknumber:maxblocknumber      , hash:txdataatmax.hash,amount:txdataatmax['result'],amountcumul:amountcumul      ,address:address,currency:CURRENCYLOCAL,direction:'IN',netkind:netkind      })      }
      db.balance.update({amount:db.sequelize.literal(`amount+${amountcumul}`)},{where:{username:username,currency:CURRENCYLOCAL,netkind:netkind}})
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
  