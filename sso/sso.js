
const axios=require('axios')
const messages=require('../configs/messages');let PROTOCOL_SSOS='https',PROTOCOL_SSO='http'
const db=require('../models')
const IPS_BASE={
  IOTC:   `${PROTOCOL_SSOS}://www.iotcpay.com`,   SDC:    `${PROTOCOL_SSOS}://www.sdcpay.co.kr`
, SDCPAY: `${PROTOCOL_SSOS}://www.sdcpay.co.kr`,  CARRYON:`${PROTOCOL_SSOS}://www.carryonpay.com`
, KWIFI:  `${PROTOCOL_SSOS}://www.kwifi.co.kr`,    WWIFI:  `${PROTOCOL_SSOS}://www.w-wifi.kr`
}
let URLS_SSO_SERVE={
  IOTC:   `${PROTOCOL_SSOS}://www.iotcpay.com/sso_api.php`  , SDC:    `${PROTOCOL_SSOS}://www.sdcpay.co.kr/sso_api.php`
, SDCPAY: `${PROTOCOL_SSOS}://www.sdcpay.co.kr/sso_api.php` , CARRYON:`${PROTOCOL_SSOS}://www.carryonpay.com/sso_api.php`
, KWIFI:  `${PROTOCOL_SSOS}://www.kwifi.co.kr/sso_api.php` , WWIFI:  `${PROTOCOL_SSOS}://www.w-wifi.kr/sso_api.php`
}
const URLS_SENDPOINTS={
  IOTC:   `${IPS_BASE['IOTC']}/wallet_api.php`   , SDC:    `${IPS_BASE['SDC']}/wallet_api.php`
, SDCPAY: `${IPS_BASE['SDCPAY']}/wallet_api.php` , CARRYON:`${IPS_BASE['CARRYON']}/wallet_api.php`
, KWIFI:  `${IPS_BASE['KWIFI']}/wallet_api.php`   , WWIFI:  `${IPS_BASE['WWIFI']}/wallet_api.php`
}
const {MAP_SITENAME}=require('../configs/configs')
const verifypw=jdata=>{
  return new Promise ((resolve,reject)=>{let {sitename,hashcode,pw }=jdata // username,
    axios.get(URLS_SENDPOINTS[sitename],{params:{
      sitecode:sitename.toLowerCase()
      , target:'exwallet'
      , hashcode:hashcode
      , passcode:pw
      , ptype:'C'
      , pamt:0
    }}).then(resp=>{
      if(resp && resp.data['result']){resolve(resp.data)}
      else {reject(resp.data)}
    }).catch(reject)
  })
//  https://www.iotcpay.com/wallet_api.php?  //sitecode=iotc&  target=exwallet&  hashcode=3a1a2d5f3fea5b062366aad93b7461e1&  passcode=111111&  ptype=C&  pamt=100
}
const commitsendlog=jdata=>  db.sendpoints.create(jdata)
// http://www.iotcpay.com/wallet_api.php?   sitecode=iotc &hashcode=3a1a2d5f3fea5b062366aad93b7461e1 &passcode=111111 &ptype=C&pamt=100
const sendpoints=jdata=>{console.log('_SP0',jdata)
  return new Promise((resolve,reject)=>{  let {username,sitename,hashcode,pointkind }=jdata
    db.balance.findOne({where:{username:username,sitename:sitename,currency:pointkind}}).then(respbal=>{let respbaldata=respbal.dataValues
      if(respbaldata['amount']>0){
        db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{console.log('_SP1',URLS_SENDPOINTS[sitename])
          axios.get(URLS_SENDPOINTS[sitename], {params:{
						sitecode:sitename.toLowerCase()
						,target:'payapp'
						,hashcode:hashcode // ,passcode:respuser['withdrawpw']
            ,ptype:pointkind
						,pamt:respbaldata['amount'] }}).then(respsend=>{console.log('respsend',respsend.data)
            if(respsend && respsend.data['result']){
              respbal.update({amount:0,amountfloat:0,amountstr:'0'}).then(resp=>{commitsendlog({
                sitename:sitename
                , username:username
                , currency:pointkind
                , amount:respbaldata['amount']
                , hashcode:hashcode
                , result:1
              }); resolve(respsend.data)}).catch(reject)
            }
          }).catch(reject)
        }).catch(reject)
      }
    }).catch(reject)
  })
}
const XXXsendpoints=jdata=>{
  return new Promise((resolve,reject)=>{  let {username,sitename,hashcode,pointkind }=jdata
    db.balance.findOne({where:{}}).then(respbal=>{let respbaldata=respbal.dataValues
      if(respbaldata['amount']>0){
        db.users.findOne({raw:true,where:{username:username}}).then(respuser=>{
          axios.get(URLS_SENDPOINTS[sitename], {params:{sitecode:sitename.toLowerCase(),hashcode:hashcode,passcode:respuser['withdrawpw']
            ,ptype:pointkind,pamt:respbaldata['amount'] }}).then(respsend=>{
            if(respsend && respsend['result']){
              respbal.update({amount:0}).then(resolve).catch(reject)
            }
          }).catch(reject)
        }).catch(reject)
      }
    }).catch(reject)
  })
}
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}
const validatekey=(sitename,token)=>{sitename=MAP_SITENAME[sitename]
  return new Promise((resolve,reject)=>{
    if (sitename){} else {console.log('invalid sitename',sitename);reject(null);return false}
    if(URLS_SSO_SERVE[sitename]){} else {console.log('invalid sitename',sitename);reject(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?s ite_code=${sitename.toLowerCase()}&has h_code=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLS_SSO_SERVE[sitename] , {params:{sitecode:sitename.toLowerCase(),hashcode:token}}).then(resp=>{console.log(resp.data.user_code,resp.data.site_code,resp.data.result)
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {reject(null); return false}
    })
  })
}
const DUMMYHASH='4e41d505d9cda48e0e503ff1d3c59fd5'
const validateurlsso=async (sitename,urladdress)=>{urladdress=`${urladdress}/sso_api.php`
  try{
    const respsso=await axios.get(urladdress,{params:{sitecode:sitename.toLowerCase(),hashcode:DUMMYHASH}})
    if(respsso && respsso.data['result']){return 1}
    else {return 0}
  } catch(err){    return 0  }
} //
const validatekeyorterminate_param=async(req,res)=>{let {sitename,hashcode}=req.query; sitename=sitename.toUpperCase()// res,req token
//  if(process.env.NODE_ENV=='development'){return new Promise((resolve,reject)=>{resolve('user01') })} else {}
  return new Promise(async (resolve,reject)=>{    if(sitename && hashcode){} else {    resolve(null);return false} // respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);
	  console.log(sitename,hashcode) //    sitename=MAP_SITENAME[sitename]
    if (sitename){} else {console.log('invalid sitename',sitename); resolve(null);return false} //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73202); 
    let respsite=await db.sitenameholder.findOne({raw:true,where:{sitename:sitename}})
    if(respsite && respsite['urladdress']){} else {resolve(null);return false};    let urladdress=respsite['urladdress']
    urladdress=`${urladdress}/sso_api.php`
    try{  axios.get( urladdress , {params:{sitecode:sitename.toLowerCase(),hashcode:hashcode}}).then(resp=>{console.log(JSON.stringify(resp.data,null,0)) // token
      if(resp.data.result){      resolve({username:resp.data.user_code,sitename:resp.data.site_code.toUpperCase()});return false
      } else {        resolve(null); return false} //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73204);
    })
  } catch(err){console.log(err);resolve(null);return false}  
  })
}
const validatekeyorterminate=async(req,res)=>{let {sitename,hashcode}=req.headers; sitename=sitename.toUpperCase()// res,req token //  if(process.env.NODE_ENV=='development'){return new Promise((resolve,reject)=>{resolve('user01') })} else {}
  return new Promise(async (resolve,reject)=>{    if(sitename && hashcode){} else {    resolve(null);return false} // respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);
	  console.log(sitename,hashcode) //    sitename=MAP_SITENAME[sitename]
    if (sitename){} else {console.log('invalid sitename',sitename); resolve(null);return false} //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73202); 
    let respsite=await db.sitenameholder.findOne({raw:true,where:{sitename:sitename}})
    if(respsite && respsite['urladdress']){} else {resolve(null);return false};    let urladdress=respsite['urladdress']
    urladdress=`${urladdress}/sso_api.php`
    try{  axios.get( urladdress , {params:{sitecode:sitename.toLowerCase(),hashcode:hashcode}}).then(resp=>{console.log(JSON.stringify(resp.data,null,0) ) // token
      if(resp.data.result){      resolve({username:resp.data.user_code,sitename:resp.data.site_code.toUpperCase() , hashcode:hashcode });return false
      } else {        resolve(null); return false} //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73204);
    })
  } catch(err){console.log(err);resolve(null);return false}  
  })
}
const validatekeyintouserorterminate=async(req,res)=>{let {sitename,hashcode}=req.headers; sitename=sitename.toUpperCase()// res,req token//  if(process.env.NODE_ENV=='development'){return new Promise((resolve,reject)=>{resolve('user01') })} else {}
  return new Promise(async (resolve,reject)=>{    if(sitename && hashcode){} else {    resolve(null);return false} // respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);
	  console.log(sitename,hashcode) //    sitename=MAP_SITENAME[sitename]
    if (sitename){} else {console.log('invalid sitename',sitename); resolve(null);return false} //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73202); 
    let respsite=await db.sitenameholder.findOne({raw:true,where:{sitename:sitename}})
    if(respsite && respsite['urladdress']){} else {resolve(null);return false};    let urladdress=respsite['urladdress']
    urladdress=`${urladdress}/sso_api.php`
    try{  axios.get( urladdress , {params:{sitecode:sitename.toLowerCase(),hashcode:hashcode}}).then(resp=>{console.log(resp.data) // token
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {        resolve(null); return false} //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73204);
    })
  } catch(err){console.log(err);resolve(null);return false}  
  })
}
const validatekeyorterminate_usesfixedurl=async(req,res)=>{let {sitename,hashcode}=req.headers; sitename=sitename.toUpperCase()// res,req token
//  if(process.env.NODE_ENV=='development'){return new Promise((resolve,reject)=>{resolve('user01') })} else {}
  return new Promise(async (resolve,reject)=>{    if(sitename && hashcode){} else {//respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);
    resolve(null);return false} // token
	console.log(sitename,hashcode) //    sitename=MAP_SITENAME[sitename]
    if (sitename){} else {console.log('invalid sitename',sitename); //respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73202); 
      resolve(null);return false}

    let URLSSO=URLS_SSO_SERVE[sitename];console.log(`${URLSSO}?sitecode=${sitename.toLowerCase()}&hashcode=${hashcode}`)
    if(URLSSO){} else {console.log('invalid sitename',sitename) //;respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73203);
      resolve(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?sitecode=${sitename.toLowerCase()}&has h_code=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLSSO , {params:{sitecode:sitename.toLowerCase(),hashcode:hashcode}}).then(resp=>{console.log(resp.data) // token
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {//respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73204);
        resolve(null); return false}
    })  
  })
}
const validatekeyorterminatewithargs=(res,sitename,token)=>{sitename=MAP_SITENAME[sitename]
  return new Promise((resolve,reject)=>{
    if (sitename){} else {console.log('invalid sitename',sitename); respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201); reject(null);return false}
    if(URLS_SSO_SERVE[sitename]){} else {console.log('invalid sitename',sitename);respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);reject(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?sitecode=${sitename.toLowerCase()}&hash_c ode=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLS_SSO_SERVE[sitename] , {params:{sitecode:sitename.toLowerCase(),hashcode:token}}).then(resp=>{console.log(resp.data)
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);reject(null); return false}
    })  
  })
}
module.exports={validatekey,validatekeyorterminate,validateurlsso,validatekeyorterminate_param,sendpoints,verifypw}
const PERIOD_POLL_SITENAMEHOLDER=65*1000
// setInterval(()=>{  db.site},PERIOD_POLL_SITENAMEHOLDER)
  // ?sitecode=iotc&hashcode=3a1a2d5f3fea5b062366aad93b7461e1'
/*
  http://www.iotcpay.com/sso_api.php?site_ code=iotc&hash_ code=3a1a2d5f3fea5b062366aad93b7461e1
  http://www.carryonpay.com/sso_api.php?sit e_code=sdcpay&h ash_code=3a1a2d5f3fea5b062366aad93b7461e1
  http://www.sdcpay.co.kr/sso_api.php?site_c ode=carryon&has h_code=3a1a2d5f3fea5b062366aad93b7461e1
  */
