
const {web3,netkind,nettype}=require('../../configs/ETH/configweb3')
const db=require('../../models') ; const {findonej}=require('../../utilsdb')
const utils=require('../../utils'); const {gettimestr,convtohex,incdecbalance,incdecbalance_reflfee, getbalance,convweitoeth , getethfloatfromweistr}=utils
const {TIMESTRFORMAT,MAP_TABLESTOUSE_DEFINED}=require('../../configs/configs')
const log4js = require('log4js'); log4js.configure({  appenders: { everything: { type: 'file', filename: 'log-eth.log' }  },	categories: { default: { appenders: [ 'everything' ], level: 'debug' }  }} )
const logger4 = log4js.getLogger(); logger4.level = 'debug'; const moment=require('moment')
let GAS_LIMIT_ETH,GAS_PRICE_ETH,GAS_LIMIT_TOKEN,GAS_PRICE_TOKEN; const CURRENCYLOCAL='ETH'
const {minAbi4tx}=require('../../configs/ETH/tokens/abis');
const { LOGGER, STRINGER } = require('../../utils'); const {getuseraddress , queryethfeetosendeth_arr}=require('../../utils-txs')
let jcontracts={}
// const MIN_TOKEN_AMOUNT_TO_WITHDRAW=1,DECIMALS=18 //const MAP_TABLESTOUSE_DEFINED={transactions:1,txsinternal:1}
const getgasfee=(limit,price,floatwei)=>{ return floatwei && floatwei=='wei'? limit*price: limit*price/10**18 }
const SHORTWEIPLACES=8 ; const ETHPLACES=18
const convamountshortwei2weistr=amountshortwei=>{return ''+amountshortwei+ '0'.repeat(ETHPLACES-SHORTWEIPLACES) }
const sendseth_track=async(jdata , tabletouse , socket)=>{return new Promise(async(resolve,reject)=>{			if(MAP_TABLESTOUSE_DEFINED[tabletouse]){} else {tabletouse='transactions'} // reject({status:'ERR',message:'TABLE INVALID'});return false}
  socket.emit('procstatus','MSG_SENDING_REQ')
  let {username,rxaddress,amountshortwei,sitename}=jdata; LOGGER(jdata,'@15621');let amountweistr=convamountshortwei2weistr(amountshortwei)
	let addressfrom=await getuseraddress(username,sitename,CURRENCYLOCAL)
	let {GAS_PRICE , GAS_LIMIT }=await queryethfeetosendeth_arr( 1 ); GAS_PRICE_ETH=GAS_PRICE , GAS_LIMIT_ETH=GAS_LIMIT
	const txData = {from:addressfrom, to:rxaddress			, value:amountweistr , gasLimit:convtohex(GAS_LIMIT_ETH) , gasPrice:convtohex(GAS_PRICE_ETH), data:'0x1'} // parseInt(tx.value.toString())- // tx.value.sub() // parseEther(amttoinc.toFixed(6)) //  parseEther( (rcvdamthexwei-).toString() )
  if(0 ){LOGGER(txData); socket.emit('procdone',STRINGER({status:'OK',message:'MSG_DONE'}) );resolve(1);return false} // STRINGER({status:'OK',message:'OK'})
  if(0 ){ LOGGER(txData);socket.emit('procdone',STRINGER({status:'ERR',message:'MSG_TX_FAIL'}) );resolve(1);return false}
  LOGGER('KMzYH23ecH',txData); let m0=moment()
  web3.eth.sendTransaction(txData).on('receipt',async resptx=>{LOGGER('NeVebYkkCB',resptx); let deltat=moment()-m0; LOGGER('deltat',deltat)
    if(resptx && resptx['blockNumber']){socket.emit('procdone',STRINGER({status:'OK',message:'MSG_DONE'}))} else {socket.emit('procdone',STRINGER({status:'ERR',message:'MSG_TX_FAIL'}));resolve(0); return false}
    const gaslimitbid=resptx['gas']?resptx['gas']:GAS_LIMIT_ETH, gaslimitoffer=resptx['gasUsed']?resptx['gasUsed']:GAS_LIMIT_ETH,gasprice=resptx['gasPrice']?resptx['gasPrice']:GAS_PRICE_ETH
    const respbal=await findonej('balance',{username:username,sitename:sitename,currency:CURRENCYLOCAL,nettype:nettype}); LOGGER('fxOAXhG3em',respbal)
    const fee=gaslimitoffer*gasprice; let amtbefore=respbal['amount'] // await getbalance({username:username , currency:CURRENCYLOCAL , sitename:sitename},'wei')
    LOGGER('FWryL',jdata['username'] ,amountweistr,addressfrom,rxaddress,resptx['blockNumber'],resptx['transactionHash'],amtbefore,fee,netkind,nettype,gaslimitbid,gaslimitoffer,gasprice)
    LOGGER('42HRJ',convweitoeth(fee,respbal['denominatorexp']),resptx['timeStamp'],getethfloatfromweistr(resptx['value']) ,jdata['sitename'] ,deltat)
    db[tabletouse].create({
      username:jdata['username']
      , currency:CURRENCYLOCAL
      , fromamount:amountweistr // amt2sendwei
      , toamount:amountweistr // amt2sendwei
      , fromaddress:addressfrom // address
      , toaddress:rxaddress
      , direction:'OUT'
      , blocknumber: resptx['blockNumber']
      , hash:resptx['transactionHash']
      , amountbefore: amtbefore
      , amountafter: amtbefore- +amountweistr - fee
      , kind:tabletouse=='transactions'?'WITHDRAW':'SALESCOLLECT'
      , netkind:netkind,nettype:nettype
      , gaslimitbid:gaslimitbid      , gaslimitoffer:gaslimitoffer
      , gasprice:gasprice
      , fee:fee
      , feestr:convweitoeth(fee,respbal['denominatorexp'])
      , txtime:resptx['timeStamp']? moment.unix(resptx['timeStamp']).format(TIMESTRFORMAT):moment().format(TIMESTRFORMAT)
      , amountfloatstr: convweitoeth(amountweistr) // getethfloatfromweistr(resptx['value'] ) // _ethamt
      , sitename:jdata['sitename']
      , proctime:deltat
    })
    incdecbalance_reflfee({... jdata , currency:CURRENCYLOCAL , amountdelta:amountweistr}
      , resptx
      ,{GAS_PRICE:gasprice ,GAS_LIMIT:gaslimitoffer}) // resptx['value'] GAS_PRICE_ETH GAS_LIMIT_ETH
    0 && socket.emit('procdone' ,STRINGER({status:'OK',message:'MSG_DONE'}))
    resolve(1);return false
	}).catch(err=>{LOGGER('P00UGlUMyv',err);return false})
})
}
const sendseth=(jdata,tabletouse , modecollectorgeneral)=>{return new Promise((resolve,reject)=>{if(MAP_TABLESTOUSE_DEFINED[tabletouse]){} else {tabletouse='transactions'} // reject({status:'ERR',message:'TABLE INVALID'});return false}
  let {username,rxaddr,amt2sendfloat,amt2sendwei,sitename}= jdata;console.log(jdata, '@15620')
  db.balance.findOne({raw:true,where:{username:username,currency:CURRENCYLOCAL,nettype:nettype,sitename:sitename}}).then(respacct=>{
    if(respacct){} else {console.log('acct not found');reject({status:'ERR',message:'Acct not found'});return false}
    if(modecollectorgeneral && modecollectorgeneral=='collector'){}
    else if(respacct['canwithdraw']){} 
    else {console.log('Withdraw BANNED'); reject({status:'ERR',message:'Withdraw BANNED'});return false}
    let address=respacct['address']; if(address){} else {console.log('Address not found'); reject({status:'ERR',message:'Address not found'});return false}
//    resolve('OK') ;return false
    web3.eth.getBalance(address).then(async balance=>{		if(balance){} 	else {reject({status:'ERR',message:'Network not avail.'});return false}
      const amteth=utils.getethfloatfromweistr(balance); console.log(address,balance,balance/10**18, gettimestr())

      if(amt2sendfloat>=amteth){console.log('Balance not enough'); reject({status:'ERR',message:'Balance not enough'});return false}
      const gasfee=getgasfee(GAS_LIMIT_ETH,GAS_PRICE_ETH,'float')
      console.log(amt2sendfloat,gasfee,amteth)
      if(amt2sendfloat+gasfee<=amteth){} else {console.log('Balance not enough(77906)');reject({status:'ERR',message:'Balance not enough(77096)'});return false}
      getbalance({username:username,currency:CURRENCYLOCAL,sitename:sitename},'float').then(balancecustom=>{
        console.log('balancecustom' ,balancecustom)
        if(amt2sendfloat+gasfee<=balancecustom){} else {console.log('Balance not enough(48286)'); reject({status:'ERR',message:'Balance not enough(48286)'});return false}
      const txData = {from:respacct['address']
        , to:rxaddr			, value:amt2sendwei // parseInt(tx.value.toString())- // tx.value.sub() // parseEther(amttoinc.toFixed(6)) //  parseEther( (rcvdamthexwei-).toString() )
        , gasLimit:convtohex(GAS_LIMIT_ETH)			, gasPrice:convtohex(GAS_PRICE_ETH), data:'0x1'
      }
      let resptxo={blockNumber:null,transactionHash:null} ;   console.log('sendinout',balance,txData)
      try{
      web3.eth.sendTransaction(txData).on('receipt',async resptx=>{console.log(resptx); resptxo=resptx // resptx0=resptx; // logger4.debug(`sending ${amt2sendfloat.toFixed(6)} ETH from ${address}`)
        if (resptx && resptx['blockNumber']){} else {console.log('TX-FAIL');reject({status:'ERR',message:'Tx fail'}) } //			cliredisa.hdel(KEYNAME_TX_IN_QUEUE,senderrowdata['wallet_address'].toUpperCase() )
        const _ethamt=convweitoeth(amt2sendwei); console.log(amt2sendwei,parseInt(resptx['blockNumber'])
        ,resptx['gasUsed'],resptx['gas'],resptx['gasPrice'],_ethamt)
        const gaslimitbid=resptx['gas']?resptx['gas']:GAS_LIMIT_ETH, gaslimitoffer=resptx['gasUsed']?resptx['gasUsed']:GAS_LIMIT_ETH,gasprice=resptx['gasPrice']?resptx['gasPrice']:GAS_PRICE_ETH
        const fee=gaslimitoffer*gasprice // resptx.gasUsed *GAS_PRICE_ETH // parseInt(resptx.gas)*parseInt(resptx.gasPrice)
        db[tabletouse].create({ // db.transactions.create({
          username:username
          , currency:CURRENCYLOCAL
          , fromamount:amt2sendwei
          , toamount:amt2sendwei
          , fromaddress:address
          , toaddress:rxaddr
          , direction:'OUT'
          , blocknumber:parseInt(resptx['blockNumber'])
          , hash:resptx['transactionHash']
          , amountbefore:  balance
          , amountafter:  parseInt(balance)-amt2sendwei-fee
          , kind:tabletouse=='transactions'?'WITHDRAW':'SALESCOLLECT'
          , netkind:netkind,nettype:nettype
          , gaslimitbid:gaslimitbid
          , gaslimitoffer:gaslimitoffer
          , gasprice:gasprice
          , fee:fee
          , feestr:convweitoeth(fee,respacct['denominatorexp'] )
          , txtime:resptx['timeStamp']? moment.unix(resptx['timeStamp']).format(TIMESTRFORMAT):moment().format(TIMESTRFORMAT)
          , amountfloatstr:_ethamt
          , sitename:jdata['sitename']
        })
        incdecbalance_reflfee({... jdata,currency:CURRENCYLOCAL, amountdelta:amt2sendwei},resptx,{GAS_PRICE:GAS_PRICE_ETH,GAS_LIMIT:GAS_LIMIT_ETH})
        if(modecollectorgeneral=='collector'){
          setTimeout(_=>{ db.balance.findOne({where:{id:respacct['id']}}).then(resp=>{resp.update({amountlocked:resp['amountlocked'] - amt2sendwei})}) },100)
        }
        resolve(resptx)
      })
    }  catch(err){
      db.txtaskstodo.create({
        username:username
        , currency:CURRENCYLOCAL
        , amount:amt2sendwei
        , fromaddress:address
        , toaddress:rxaddr
        , blocknumber:resptxo['blockNumber']
        , hash:resptxo['transactionHash']
        , netkind:netkind
        , failreason:err.toString()
      }); reject(err.toString());return false
      }
    })
    })
  })
})
}
const init=_=>{
  db.operations.findOne({raw:true,where:{key_:'GAS_PRICE_ETH',subkey_:netkind}}).then(resp=>{   if(resp && resp['value_']){GAS_PRICE_ETH=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_LIMIT_ETH',subkey_:netkind}}).then(resp=>{   if(resp && resp['value_']){GAS_LIMIT_ETH=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_PRICE_TOKEN',subkey_:netkind}}).then(resp=>{ if(resp && resp['value_']){GAS_PRICE_TOKEN=parseInt(resp['value_'])}  })
  db.operations.findOne({raw:true,where:{key_:'GAS_LIMIT_TOKEN',subkey_:netkind}}).then(resp=>{ if(resp && resp['value_']){GAS_LIMIT_TOKEN=parseInt(resp['value_'])}  })
/*  db.tokens.fin dAll({raw:true,netk ind:netkind}).then(aresps=>{
    aresps.forEach(e=>{
      contract=new web3.eth.Contract(minAbi4tx,e['address'])
      jcontracts[e['name']]=contract
    })
  }) */
}
module.exports={sendseth , sendseth_track}
init()
const tst=_=>{
let jdata={
    blockNumber: '11548998',
    timeStamp: '1609245904',
    hash: '0xed94f42f2f3c58a3de9384ad23e6f135dd4df30405939e3fff97cb076c9fb005',
    nonce: '5981',
    blockHash: '0xa4909eadfbed965c9b328e4fb9a38b6fc8939e26d435b05fadbe193c186a3908',
    from: '0x90906975a2c53c1fd23fbd5644fefd920cd823ae',
    contractAddress: '0xe202873079913858f9ba8795ba957a4ad561ca24',
    to: '0x63ffde6ed682d4eda40ba1a69e9d4f5755b95ec7',
    value: '30000000000000000000',
    tokenName: 'Wifi Coin',
    tokenSymbol: 'WIFI',
    tokenDecimal: '18',
    transactionIndex: '108',
    gas: '400000',
    gasPrice: '72863349333',
    gasUsed: '91638',
    cumulativeGasUsed: '7420080',
    input: 'deprecated',
    confirmations: '120851'
  }    
}
