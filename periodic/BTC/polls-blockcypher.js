const axios=require('axios'),moment=require('moment')
let configbtc=require('../../configs/BTC/configbtc'); const {netkind,nettype}=configbtc
const API_TXS=`https://api.blockcypher.com/v1/btc/${netkind=='mainnet'?'main':'test'}/addrs`
const db=require('../../models')
const {getRandomInt,isequalinlowercases}=require('../../utils')
const {TIMESTRFORMAT}=require('../../configs/configs')
const ENDBLOCKDUMMY4QUERY=5000000
const PERIOD_DIST_POLLS=60*10*1000, CURRENCYLOCAL='BTC' // ,NETKIND=netkind // 'testnet'
let jaddresses={}
const init=()=>{
  db.balance.findAll({raw:true,where:{currency:CURRENCYLOCAL,netkind:netkind}}).then(aresps=>{
    aresps.forEach(acct=>{
      const address=acct['address']
      jaddresses['address']=acct['username']
      setTimeout(()=>{
        setInterval(()=>{pollblocks({address:address})
        }, PERIOD_DIST_POLLS)
      }, getRandomInt(8*1000,PERIOD_DIST_POLLS))
    })
  })
}
const pollblocks=jdata=>{const {address,}=jdata
  db.blockbalance.findOne({raw:true,where:{address:address,direction:'IN',currency:CURRENCYLOCAL,netkind:netkind}}).then(respbb=>{let startblock=0
    if(respbb){startblock=respbb['blocknumber']+1} else {}
    console.log(startblock,ENDBLOCKDUMMY4QUERY,address)
//    const query={after:startblock    }
    axios.get(API_TXS,{params:{... query}}).then(resp=>{
      if(resp){} else {return false}
      if(resp.data.txrefs && resp.data.txrefs.length<1){return false} else {}
      let maxblocknumber=-1,txdataatmax=null,amountcumul=0; const username=jaddresses[address]
      for (let i in resp.data.txrefs){const txdata=resp.data.txrefs[i]
        if(isequalinlowercases())

      }
    })
  })

}
> axios.get('https://api.blockcypher.com/v1/btc/main/addrs/1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw?after=607747').then(resp=>{console.log(resp.data)})
