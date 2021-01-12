
const cliredisa=require('async-redis').createClient()
const {KEYNAME_USERID2SOCKETID , KEYNAME_SOCKETID2USERID}=require('./configs/configs-sockets')
const clearsockets=()=>{ //	cliredisa.del(config.KEYNAME_IP_2_SOCKETID);	cliredisa.del(config.KEYNAME_SOCKETID_2_IP)
	cliredisa.del(KEYNAME_SOCKETID2USERID);	cliredisa.del(KEYNAME_USERID2SOCKETID)
}
const getipsocket=(socket)=>{return socket.request.connection.remoteAddress || socket.handshake.address.address || socket.handshake.headers ['X-FORWARDED-FOR']}
const binduseridsocketid=(userid,socketid)=>{
	cliredisa.hset(config.KEYNAME_SOCKETID_2_USERID,socketid,userid)
	cliredisa.hset(config.KEYNAME_USERID_2_SOCKETID,userid,socketid)
} //
const deletesocketid=(socketid)=>{
  cliredisa.hdel(config.KEYNAME_SOCKETID_2_USERID,socketid) //  cliredisa.hdel(config.KEYNAME_SOCKETID_2_IP,socketid)
}//

module.exports={clearsockets,binduseridsocketid, getipsocket,deletesocketid}

