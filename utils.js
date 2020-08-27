
const respreqinvalid=(res,msg,code)=>{res.status(200).send({status:'ERR',message:msg,code:code});return false}
module.exports={respreqinvalid}