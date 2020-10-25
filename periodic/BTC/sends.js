
const axios=require('axios')
const db=require('../../models');
const { convethtowei,incdecbalance_reflfee ,convweitoeth} = require('../../utils');
const { netkind, nettype } = require('../../configs/BTC/configbtc');
const { TIMESTRFORMAT } = require('../../configs/configs');
const URL_BTCD='http://182.162.21.240:36087/users'
const API_CREATE_TX=`${URL_BTCD}/createrawtransaction`
const API_GENERIC=`${URL_BTCD}/genericcall`;const CURRENCYLOCAL='BTC',DECIMALS=8
const sends=async (jdata,tabletouse , modecollectorgeneral)=>{const {amt2sendfloat,rxaddr,privatekey,username,sitename}=jdata; let amtreqd=amt2sendfloat,amount=amt2sendfloat; let fee,address
  try{  let respfee=await db.operations.findOne({raw:true,where:{key_:'SENDFEE',subkey_:'BTC'}});console.log(respfee)
  if(respfee){} else {console.log('sendfee not found');return null};  fee=parseFloat(respfee['value_'])
  let respacct=await db.balance.findOne({raw:true,where:{username:username,currency:CURRENCYLOCAL,nettype:nettype,sitename:sitename , active:1}})
  if(modecollectorgeneral && modecollectorgeneral=='collector'){}
  else if(respacct['canwithdraw']){}
  else {console.log('Withdraw BANNED');return null}
  if(respacct){address=respacct['address']} else {console.log('acct not found');return null}
  axios.get(`${URL_BTCD}/listunspent`,{params:{address:address}}).then(async resputxo=>{
    if(resputxo.data.status=='OK'){ //      console.log(resputxo.data.message)
      let atxs=JSON.parse(resputxo.data.message)['result'];console.log(atxs.length)
      atxs=atxs.sort((a,b)=>{return parseFloat(a.amount)-parseFloat(b.amount)});const balancebefore=sumuptxsintobalance(atxs)
      let sum=0; let i01=null
      for (let i=0;i<atxs.length;i++){    sum+=atxs[i].amount;console.log(sum,atxs[i].amount)
        if(sum>=amtreqd+fee){i01=i;break}
      }
      if(sum+fee>=amtreqd){} else {console.log('ERR-BALANCE_NOT-ENOUGH');return false}
      const txreqstr=await getrawtxreqstr({senderaddress:address,fee:fee,rxaddr:rxaddr,amtreqd:amtreqd,sumutxo:sum, autxo:[... atxs.slice(0,i01+1)]}); // +fee
      console.log(txreqstr)

      const respcr=await axios.post(API_GENERIC,{datastr:txreqstr}) //      console.log(respcr.data)
      let jrespcr=JSON.parse(respcr.data.message);if(jrespcr['error']){console.log(jrespcr['error']);return false}
      console.log('jrespcr',jrespcr)
      const rawtxreqstr=jrespcr['result']
      
      const respsign=await axios.post(API_GENERIC,{datastr:getsignreqstr({rawdatastr:rawtxreqstr,privatekey:privatekey})})
      let jrespsign=JSON.parse(respsign.data.message);if(jrespsign['error']){console.log(jrespsign['error']);return false}
      const signedstr=jrespsign['result']['hex']; console.log(signedstr)

      const respsend=await axios.post(API_GENERIC,{datastr:getsendreqstr({rawdatastr:signedstr})})
      let jrespsend=JSON.parse(respsend.data.message);if(jrespsend['error']){console.log(jrespsend['error']);return false}
      console.log(jrespsend['result'])
      let amt2sendwei=convethtowei(amt2sendfloat,DECIMALS)
      db[tabletouse].create({
        username:username
        , currency:CURRENCYLOCAL
        , fromamount:amt2sendwei
        , toamount:amt2sendwei
        , fromaddress:address
        , toaddress:rxaddr
        , direction:'OUT'
        , blocknumber:null
        , hash:NULL
        , amountbefore:balancebefore
        , amountafter:balancebefore-sum-fee
        , kind:tabletouse=='transactions'?'WITHDRAW':'SALESCOLLECT'
        , netkind:netkind,nettype:nettype
        , gaslimitbid:fee
        , gaslimitoffer:fee
        , gasprice:null
        , fee:fee
        , feestr:convweitoeth(fee,DECIMALS )
        , txtime:moment().format(TIMESTRFORMAT)
        , amountfloatstr:amount
        , sitename:jdata['sitename']
      })
      incdecbalance_reflfee({... jdata,currency:CURRENCYLOCAL,amountdelta:amt2sendwei},null,null)
      if(modecollectorgeneral=='collector'){
        setTimeout(_=>{ db.balance.findOne({where:{id:respacct['id']}}).then(resp=>{  resp.update({amountlocked:resp['amountlocked']-amt2sendwei})}),100})
      }
      return 1
    } 
    })
  }catch(err){
    db.txtaskstodo.create({
      username:username
      , currency:CURRENCYLOCAL
      , amount:amt2sendwei
      , fromaddress:address
      , toaddress:rxaddr
      , blocknumber:null
      , hash:null
      , netkind:netkind
      , failreason:err.toString()
    });return false
  }
}
module.exports={  sends
}
const jdatacommon={jsonrpc:1.0,id:'curltest'}
const getsendreqstr=jdatain=>{let {rawdatastr}=jdatain;  let jdata={... jdatacommon,method:'sendrawtransaction',params:[rawdatastr]}
  return JSON.stringify(jdata,null,0)
}
const getsignreqstr=jdatain=>{  let {rawdatastr,privatekey}=jdatain;  let jdata={... jdatacommon,method:'signrawtransactionwithkey',params:[rawdatastr,[privatekey]]}
  return JSON.stringify(jdata,null,0)
}
// '{"jsonrpc": "1.0", "id":"curltest", "method": "signrawtransactionwithkey", "params": ["myhex", "[\"key1\",\"key2\"]"] }' -H 'content-type: text/plain;' http://127.0.0.1:8332/
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
const sumuptxsintobalance=arr=>{  arr.map(el=>el['amount']).reduce((a,b)=>{return a+b},0)
}
const tst=_=>{
sends({address:'mkTddhC91V3FSePXS1L31BKTLbaMRstnpt',amount:0.001,rxaddr:'mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv',privatekey:'93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg'})
}
/*{
  status: 'OK',
  message: '{"result":"02000000027efc5d1e7761b04290df56a4dcbbb0e476666f83363d401660cc6a3e37c78d310000000000ffffffffa9b5531078dbb71224680374966825d51500c8dfc456b9906c0b4a02578b68d70100000000ffffffff02a0860100000000001976a914b1385285796de6d4d718bc3644f4146cc0cd387588ac409c0000000000001976a9143637cda4bff30631b420f1a091db3e515b25038988ac00000000","error":null,"id":"curltest"}\n',
  code: null
}
> curl --user myusername --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "signrawtransactionwithkey", "params": ["myhex", "[\"key1\",\"key2\"]"] }' -H 'content-type: text/plain;' http://127.0.0.1:8332/
{
  hex: '02000000027efc5d1e7761b04290df56a4dcbbb0e476666f83363d401660cc6a3e37c78d31000000008a4730440220287216eebfeb94514ddc88f55b92296753dc1b413cb86d72a47d223378ed6bdc0220422c1e1da01a91040ddcbb90f29025249b4503f007b26e107b98dd63d6ad94f90141044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4bffffffffa9b5531078dbb71224680374966825d51500c8dfc456b9906c0b4a02578b68d7010000008a47304402202a88424fcfc8dd4936856eb6290f004a4a472b6f35a87493ccf7e4bc9d9bd5b102207781650b952d85d18434c505666ee9071fb9178f4a4c8ef77621b063ef55c7c70141044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4bffffffff02a0860100000000001976a914b1385285796de6d4d718bc3644f4146cc0cd387588ac409c0000000000001976a9143637cda4bff30631b420f1a091db3e515b25038988ac00000000',
  complete: true
}
// http://182.162.21.240:36087/users/listunspent?address=mkTddhC91V3FSePXS1L31BKTLbaMRstnpt
*/
