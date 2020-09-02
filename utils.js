const db=require('./models')
const moment=require('moment');const {netkind}=require('./configs/ETH/configweb3')
const redis=require('redis');const clientredis=redis.createClient();const cliredisa=require('async-redis').createClient()
const {KEYNAME_MARKETPRICES,POINTSKINDS}=require('./configs/configs')
const gettimestr=()=>{return moment().format('YYYY-MM-DD HH:mm:ss.SSS')}
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}, resperr=respreqinvalid
const respwithdata=(res,data)=>{res.status(200).send({status:'OK',... data});return false}
const respok=(res,msg,code,jdata)=>{res.status(200).send({status:'OK',message:msg,code:code,... jdata});return false}
const getpricesstr=async ()=>{return await cliredisa.hget(KEYNAME_MARKETPRICES,'ALL')}
const getethfloatfromweistr=(str)=>{return parseInt(str)/10**18}
const convethtowei=(numfloat,decimals)=>{const exp=decimals?decimals:18; return parseFloat(numfloat)*10**exp}
const convweitoeth=(numint,decimals)=>  {const exp=decimals?decimals:18; return parseInt(numint)/10**exp}
const convtohex=(intdec)=>{return `0x${intdec.toString(16)}`}
const isequalinlowercases=(str0,str1)=>{return str0.toLowerCase()==str1.toLowerCase()}
const delsession=(req)=>{const token=req.headers.token
  db.sessionkeys.findOne({where:{token:token}}).then(resp=>{
    if(resp){resp.update({active:0})} else {return false}
  })
}
const incdecbalance=(jdata,txdata)=>{const {username,currency,amountdelta}=jdata
  if(txdata){amountdelta+=txdata['gas']*txdata['gasPrice']}
  db.balance.update({amount:db.sequelize.literal(`amount-${amountdelta}`)},{where:{username:username,currency:currency}})
} // incdecbalance({username:'',curency:'',amountdelta:''})
const getbalance=(jdata,bfloatwei)=>{return new Promise((resolve,reject)=>{
  db.balance.findOne({raw:true,where:{ ... jdata }}).then(resp=>{
    if(resp){    const amtwei=resp['amount']-resp['amountlocked']      
      resolve(bfloatwei && bfloatwei=='float'? amtwei/10**resp['denominatorexp']: amtwei )
    } else {reject('NOT-FOUND')}
  }).catch(err=>{reject(err.toString())})
})}
const getRandomInt=(min,max)=> {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
} //
function generateRandomStr (length) {
	var result           = '';	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {		 result += characters.charAt(Math.floor(Math.random() * charactersLength))	}
	return result;
}
const getip=(req)=>{	return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['x-real-ip']}
const doexchange=(username,jdata,respbal,resprates)=>{
  return new Promise ((resolve,reject)=>{let {currency0,amount0}=jdata; amount0=parseFloat(amount0);console.log('jdata',jdata)
    const amount0wei=convethtowei(amount0)
    cliredisa.hget(KEYNAME_MARKETPRICES,currency0).then(price=>{  price=parseFloat(price)
      const respbaldata=respbal.dataValues
      const amtlockedtoupd=parseInt(respbaldata['amountlocked'])+parseInt(amount0wei)
      const amtbefore=respbaldata['amount']-respbaldata['amountlocked'],amountafter=amtbefore-parseInt(amount0wei)
      respbal.update({amountlocked:amtlockedtoupd})
      let extodata={};
      Object.keys(POINTSKINDS).forEach(pointkind=>{const amttoinc=parseInt(amount0 *price * resprates[pointkind]/100)
        extodata[pointkind]=amttoinc
        db.balance.findOne({where:{username:username,currency:pointkind,netkind:netkind }}).then(resp=>{const respdata=resp.dataValues          
          resp.update({amount:respdata['amount']+amttoinc })
        })
      })
      db.transactions.create({
        username:username
        , currency:currency0
        , fromamount:amount0wei
        , amountfloatstr:convweitoeth(amount0wei)
        , amountbefore:null
        , amountafter:null
        , kind:'EXCHANGE'
        , netkind:netkind
        , description:JSON.stringify(extodata)
      })
    }).catch(err=>{reject(err.toString())})
    resolve(jdata)
  })
}
const getfixedtokenprices=rettype=>{
  return new Promise ((resolve,reject)=>{let jdata={}
    db.fixedprices.findAll({raw:true}).then(aresps=>{
      aresps.forEach(tknd=>{        jdata[tknd['tokenname']]=tknd['price']      })
      if(rettype && rettype=='str'){resolve( JSON.stringify(jdata))}
      else {resolve( jdata)}
    }).catch(err=>{reject(err.toString())})
  })
}
const doexchangeXX=(username,jdata)=>{
  return new Promise((resolve,reject)=>{    const {currency0,currency1, amount0,amount1,username}=jdata
    let _respbal0=db.balance.find_One({where:{currency:currency0,username:username}})
    let _respbal1=db.balance.find_One({where:{currency:currency1,username:username}})
    try{Promise.all([_respbal0,_respbal1]).then(aresps=>{
      const [respbal0,respbal1]=aresps
      respbal0.update({amountlocked:db.sequelize.literal(`amountlocked + ${amount0}`)})
      respbal1.update({amount:db.sequelize.literal(`amount + ${amount1}`)})
      resolve(1)
    })    
    } catch(err){reject(err)}
  })
}
module.exports={respok, respreqinvalid,getpricesstr,getethfloatfromweistr,convethtowei,convweitoeth,doexchange
  ,respwithdata,resperr,getbalance,gettimestr,convtohex
  ,incdecbalance,getRandomInt,getip,generateRandomStr, isequalinlowercases,getfixedtokenprices,delsession
}
