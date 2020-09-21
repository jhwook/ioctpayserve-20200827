
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
    if(URLS_SSO_SERVE[sitename]){} else {console.log('invalid sitename',sitename);reject(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?site_code=${sitename.toLowerCase()}&hash_code=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLS_SSO_SERVE[sitename] , {params:{site_code:sitename.toLowerCase(),hash_code:token}}).then(resp=>{console.log(resp.data)
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
    if(URLS_SSO_SERVE[sitename]){} else {console.log('invalid sitename',sitename) //;respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73203);
      resolve(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?site_code=${sitename.toLowerCase()}&hash_code=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLS_SSO_SERVE[sitename] , {params:{site_code:sitename.toLowerCase(),hash_code:hashcode}}).then(resp=>{console.log(resp.data) // token
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {//respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73204);
        resolve(null); return false}
    })  
  })
}
const validatekeyorterminatewithargs=(res,sitename,token)=>{sitename=MAP_SITENAME[sitename]
  return new Promise((resolve,reject)=>{
    if (sitename){} else {console.log('invalid sitename',sitename); respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201); reject(null);return false}
    if(URLS_SSO_SERVE[sitename]){} else {console.log('invalid sitename',sitename);respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);reject(null);return false} //   axios.get(`${URLS_SSO_SERVE[sitename]}?site_code=${sitename.toLowerCase()}&hash_code=${token}`).then(resp=>{console.log(resp.data)
    axios.get( URLS_SSO_SERVE[sitename] , {params:{site_code:sitename.toLowerCase(),hash_code:token}}).then(resp=>{console.log(resp.data)
      if(resp.data.result){      resolve(resp.data.user_code);return false
      } else {respreqinvalid(res,messages.MSG_PLEASE_LOGIN,73201);reject(null); return false}
    })  
  })
}
module.exports={validatekey,validatekeyorterminate}
  // ?site_code=iotc&hash_code=3a1a2d5f3fea5b062366aad93b7461e1'
/*
  http://www.iotcpay.com/sso_api.php?site_code=iotc&hash_code=3a1a2d5f3fea5b062366aad93b7461e1
  http://www.carryonpay.com/sso_api.php?site_code=sdcpay&hash_code=3a1a2d5f3fea5b062366aad93b7461e1
  http://www.sdcpay.co.kr/sso_api.php?site_code=carryon&hash_code=3a1a2d5f3fea5b062366aad93b7461e1
  */
