
const axios=require('axios')
const messages=require('../configs/messages')
const URLS_SSO_SERVE={
  IOTC:   'http://www.iotcpay.com/sso_api.php'
, SDC:    'http://www.sdcpay.co.kr/sso_api.php'
, SDCPAY: 'http://www.sdcpay.co.kr/sso_api.php'
, CARRYON:'http://www.carryonpay.com/sso_api.php'
}
const {MAP_SITENAME}=require('../configs/configs')
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}
const validatekey=(sitename,token)=>{sitename=MAP_SITENAME[sitename]
  return new Promise((resolve,reject)=>{
    if (sitename){} else {console.log('invalid sitename',sitename);reject(null);return false}
    if(URLS_SSO_SERVE[sitename]){} else {console.log('invalid sitename',sitename);reject(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?s ite_code=${sitename.toLowerCase()}&has h_code=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLS_SSO_SERVE[sitename] , {params:{sitecode:sitename.toLowerCase(),hashcode:token}}).then(resp=>{console.log(resp.data)
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {reject(null); return false}
    })
  })
}
const validatekeyorterminate=(req,res)=>{let {sitename,hashcode}=req.headers; sitename=sitename.toUpperCase()// res,req token
//  if(process.env.NODE_ENV=='development'){return new Promise((resolve,reject)=>{resolve('user01') })} else {}
  return new Promise((resolve,reject)=>{    if(sitename && hashcode){} else {//respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);
    resolve(null);return false} // token
    sitename=MAP_SITENAME[sitename]
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
module.exports={validatekey,validatekeyorterminate}
  // ?sitecode=iotc&hashcode=3a1a2d5f3fea5b062366aad93b7461e1'
/*
  http://www.iotcpay.com/sso_api.php?site_ code=iotc&hash_ code=3a1a2d5f3fea5b062366aad93b7461e1
  http://www.carryonpay.com/sso_api.php?sit e_code=sdcpay&h ash_code=3a1a2d5f3fea5b062366aad93b7461e1
  http://www.sdcpay.co.kr/sso_api.php?site_c ode=carryon&has h_code=3a1a2d5f3fea5b062366aad93b7461e1
  */
