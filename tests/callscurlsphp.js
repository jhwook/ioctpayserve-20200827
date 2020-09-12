
axios=require('axios')
const db=require('../models')
let amtreqd=0.0025
let rxaddr='mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg'
let fee=0.0006
const URLBTCREQ='http://182.162.21.240/tmp/curls.php'
const send=async ()=>{
  axios.get(URLBTCREQ, {params:{mode:'listunspent'}}).then(async resp=>{const jdata=JSON.parse(resp.data);jtmp=jdata;  console.log(jdata)
    if(jdata['error']){console.log('ERR-listunspent');return false} else {}
    let atxs=jdata.result
    atxs=atxs.sort((a,b)=>{return parseFloat(a.amount)-parseFloat(b.amount)}) // > ares.map(e=>e['amount'])
    let sum=0; let i01=null
    for (let i=0;i<atxs.length;i++){    sum+=atxs[i].amount; 
      if(sum+fee>=amtreqd){i01=i;break}
    }
    if(sum+fee>=amtreqd){} else {console.log('ERR-BALANCE_NOT-ENOUGH');return false}
    const txreqstr=await getrawtxreqstr({autxo:[... atxs.slice(0,i01+1)]}); console.log(txreqstr)
    const respcreatetx=await axios.get(URLBTCREQ,{params:{mode:'rawch',datastr:txreqstr}});    console.log(respcreatetx)
  }).catch(console.log)
}

const getrawtxreqstr=async jdatain=>{  const {autxo,rxaddress,amtreqd,sumutxo,senderwallet}=jdatain;const sumutxosave=sumutxo
//  let jdata={jsonrpc:1.0,id:'curltest',method:'createtransaction',params:[[{txid:1,vout:0}],[{address:0.01}]]}
  let jdata={jsonrpc:1.0,id:'curltest',method:'createtransaction',params:[[],[]]}
  autxo.forEach(utxo=>{    jdata.params[0].push ({txid:utxo.txid,vout:utxo.vout})
  })
  let fee=await db.operations.findOne({raw:true,where:{key_:'SENDFEE',subkey_:'BTC'}});if(fee){} else {console.log('sendfee not found');return null};  fee=parseFloat(fee)
  let arxs=[]
  arxs[0]={};arxs[0][rxaddr]=amtreqd.toString()
  sumutxo-=fee;sumutxo-=amtreqd
  arxs[1]={};arxs[1][senderwallet['address']]=sumutxo.toString()
  return JSON.stringify(jdata,null,0)
}
send()

// '{"jsonrpc": "1.0", "id":"curltest", "method": "createrawtransaction", "params": ["[{\"txid\":\"myid\",\"vout\":0}]", "[{\"address\":0.01}]"] }' -H 'content-type: text/plain;' http://127.0.0.1:8332/
/*[2] bitcoin-cli -chain=test createrawtransaction '[{ "txid":"4a8e99e613c887ac92a0c6cfb2bcfbc5e7ca6dc8ef26f54e1267ea5d477dc611","vout":0}]' '{"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt": 0.0015, "mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg": 0.001}'
curl --user myusername --data-binary 
`{\"jsonrpc\": \"1.0\", \"id\":\"curltest\", \"method\": \"createrawtransaction\", \"params\": [\"[{\"txid\":\"${}\",\"vout\":0}]", "[{\"address\":0.01}]"] }' -H 'content-type: text/plain;' http://127.0.0.1:8332/
'{"jsonrpc": "1.0", "id":"curltest", "method": "createrawtransaction", "params": ["[{\"txid\":\"myid\",\"vout\":0}]", "[{\"address\":0.01}]"] }' -H 'content-type: text/plain;' http://127.0.0.1:8332/
*/