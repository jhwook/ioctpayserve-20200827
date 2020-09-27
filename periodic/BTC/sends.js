
const axios=require('axios')
const db=require('../../models')
const URL_BTCD='http://182.162.21.240:36087/users'
const sends=async jdata=>{const {address,amount,rxaddr}=jdata; let amtreqd=amount; let fee
  let respfee=await db.operations.findOne({raw:true,where:{key_:'SENDFEE',subkey_:'BTC'}});console.log(respfee)
  if(respfee){} else {console.log('sendfee not found');return null};  fee=parseFloat(respfee['value_']);
  axios.get(`${URL_BTCD}/listunspent`,{params:{address:address}}).then(async resputxo=>{
    if(resputxo.data.status=='OK'){ //      console.log(resputxo.data.message)
      let atxs=JSON.parse(resputxo.data.message)['result'];console.log(atxs.length)
      atxs=atxs.sort((a,b)=>{return parseFloat(a.amount)-parseFloat(b.amount)})
      let sum=0; let i01=null
      for (let i=0;i<atxs.length;i++){    sum+=atxs[i].amount;console.log(sum,atxs[i].amount)
        if(sum>=amtreqd+fee){i01=i;break}
      }
      if(sum+fee>=amtreqd){} else {console.log('ERR-BALANCE_NOT-ENOUGH');return false}
      const txreqstr=await getrawtxreqstr({senderaddress:address,fee:fee,rxaddr:rxaddr,amtreqd:amtreqd,sumutxo:sum, autxo:[... atxs.slice(0,i01+1)]}); // +fee
      console.log(txreqstr)
      
    }
  })
// http://182.162.21.240:36087/users/listunspent?address=mkTddhC91V3FSePXS1L31BKTLbaMRstnpt

}
module.exports={  sends
}
const getrawtxreqstr=async jdatain=>{  let {autxo,rxaddr,amtreqd,sumutxo,fee,senderaddress}=jdatain; console.log(jdatain)// const sumutxosave=sumutxo;
  let jdata={jsonrpc:1.0,id:'curltest',method:'createrawtransaction',params:[[],[]]} // createtransaction
  autxo.forEach(utxo=>{    jdata.params[0].push ({txid:utxo.txid,vout:utxo.vout})  }) //  let fee=await db.operations.findOne({raw:true,where:{key_:'SENDFEE',subkey_:'BTC'}});  if(fee){} else {console.log('sendfee not found');return null};  fee=parseFloat(fee)
  let arxs=[]
  arxs[0]={};arxs[0][rxaddr]=amtreqd.toString()
  sumutxo-=fee ;sumutxo-=amtreqd
  
  arxs[1]={};arxs[1][senderaddress]=parseFloat(sumutxo.toFixed(8)) // .toString() // arxs[1][senderwallet['address']]=sumutxo.toString()
  jdata['params'][1]=arxs
  return JSON.stringify(jdata,null,0)
}

const tst=_=>{
sends({address:'mkTddhC91V3FSePXS1L31BKTLbaMRstnpt',amount:0.001,rxaddr:'mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv'})
}
