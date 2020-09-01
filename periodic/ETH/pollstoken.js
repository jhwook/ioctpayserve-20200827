const axios=require('axios'),moment=require('moment')
let {web3,netkind}=require('../../configs/ETH/configweb3') // const API_TXS=netkind=='mainnet'? 'https://api.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'  : 'https://api-ropsten.etherscan.io/api?module=account&action=txlist&sort=asc&apikey=GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'
const API_TXS='https://api-ropsten.etherscan.io/api'
const db=require('../../models')
const {getRandomInt,isequalinlowercases, convweitoeth}=require('../../utils')
const { max } = require('moment')
const ENDBLOCKDUMMY4QUERY=70000000
const PERIOD_DIST_POLLS=60*10*1000
let jaddresses={},jaddresstokens={},jsymboltokens={}
const init=()=>{
  for (let i=0;i<web3.eth.accounts.wallet.length;i++){    const address=web3.eth.accounts.wallet[i].address
    db.balance.findOne({raw:true,where:{address:address.toLowerCase(),netkind:netkind}}).then(resp=>{      if(resp){} else {return false}
      jaddresses[address]=resp['username']
      setTimeout(()=>{
        setInterval(()=>{pollblocks({address:address})
        }, PERIOD_DIST_POLLS)
      } , getRandomInt(7*1000, PERIOD_DIST_POLLS))
    })
  }
}
const pollblocks=jdata=>{  const {address,}=jdata
db.blockbalance.findOne({where:{address:address,direction:'IN',currencykind:'TOKEN'}}).then(alrespbb=>{let startblock=1
  if(respbb){startblock=respbb['blocknumber']+1} else {}
  console.log(startblock,ENDBLOCKDUMMY4QUERY,address)
  const query={startblock:startblock    ,endblock:ENDBLOCKDUMMY4QUERY    ,address:address
    ,module:'account'
    ,action:'tokentx' // txlist
    ,sort:'asc'
    , apikey:'GWF185A95F1KRA2B37ZU6B8WRVZUZ2ZUPW'
  }
  axios.get(API_TXS,{params:{...query}}).then(resp=>{
    if(resp){} else {return false}
    if(resp.data.result && resp.data.result.length<1){return false} else {}
    let maxblocknumber=-1,txdataatmax=null,amountcumul=0,jtokenamountcumul={},jtokenupddata={};const username=jaddresses[address]
    for (let i in resp.data.result){const txdata=resp.data.result[i]
      if(isequalinlowercases(txdata.to,address)){} else {continue} console.log(txdata)
      if(txdata.isError=='1'){continue} else {}
      let tokendata=null
      if(tokendata=jaddresstokens[txdata['contractAddress'].toLowerCase()]){} else {return false}; let symbol=tokendata['symbol']
      const curbn=parseInt(txdata.blockNumber)
      if(maxblocknumber<curbn){maxblocknumber=curbn,txdataatmax=txdata}; 
      jtokenamountcumul[symbol]=jtokenamountcumul[symbol]? jtokenamountcumul[symbol]+parseInt(txdata.value):parseInt(txdata.value)
      jtokenupddata[symbol] = jtokenupddata[symbol]? (jtokenupddata[symbol]>curbn?jtokenupddata[symbol]:curbn) :curbn
      db.transactions.create({
        username:username
        , currency:tokendata['symbol']
        , fromamount:txdata['value']
        , toamount:txdata['value']
        , amountfloatstr:convweitoeth(txdata['value'])
        , fromaddress:txdata['from']
        , toaddress:address
        , direction:'IN'
        , blocknumber:txdata['blockNumber']
        , hash:txdata['hash']
        , amountbefore:null
        , amountafter:null
        , kind:'DEPOSIT'
        , netkind:netkind
        , gaslimit:txdata['gas']
        , gasprice:txdata['gasPrice']
        , fee:parseInt(txdata.gas)*parseInt(txdata.gasPrice)
        , txtime:moment.unix(txdata['timeStamp']).format(TIMESTRFORMAT)
      })
      if(respbb){db.blockbalance.update({blocknumber:maxblocknumber,hash:txdataatmax.hash,amount:txdataatmax['value']},{where:{address:address,currencykind:'TOKEN',direction:'IN',netkind:netkind}})}
      else      {db.blockbalance.create({blocknumber:maxblocknumber,hash:txdataatmax.hash,amount:txdataatmax['value'],address:address,currency:'TOKEN',direction:'IN',netkind:netkind})}
      db.balance.update({blocknumber:jtokenupddata[symbol], amount:db.sequelize.literal(`amount+${jtokenamountcumul[symbol]}`)},{where:{username:username,currency:symbol,netkind:netkind}})
    }
  })
})
}
const inittoken=()=>{
  db.tokens.findAll({raw:true ,}).then(aresps=>{
    aresps.forEach(tokendata=>{      if(tokendata['netkind']==netkind){} else {return false}
      jaddresstokens[tokendata['address'].toLowerCase()]=tokendata;      jsymboltokens [tokendata['symbol'].toUpperCase()]=tokendata
    })
  })
}
init()
inittoken()
module.exports={pollblocks}
