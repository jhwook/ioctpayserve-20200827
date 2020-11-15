
const db=require('./models')
const {findonej}=require('./utilsdb')
const CURRENCY_ETH='ETH'
const NETTYPE='mainnet'
const isethbalance0orstakeslocked=jdata=>{console.log('ISBALANCE0')
  return new Promise((resolve,reject)=>{
    const {username,sitename}=jdata
    findonej('balance',{username:username,sitename:sitename,currency:CURRENCY_ETH , nettype:NETTYPE}).then(resp=>{
      if(resp){} else {resolve(1)}
    })  
  })
}
