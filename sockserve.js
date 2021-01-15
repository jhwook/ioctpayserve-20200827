// SOCKETS=require('../configs/sockets')
const PORT_NUM=33335
const express = require('express')
const { sendseth_track } = require('./periodic/ETH/sendseth') ; const { sendstoken_track } = require('./periodic/ETH/sendstoken')
const app=express()
const server = app.listen( PORT_NUM ,console.log("Socket.io Hello Wolrd server started!"))
const io = require('socket.io')(server)
const {gettimestr,LOGGER,PARSER, STRINGER}=require('./utils'); const {getipsocket}=require('./utils-sockets')
const {validatesend_token}=require('./utils-txs'); const CURRENCY_ETH='ETH'
// const HISTMAN=require('../history/manager')
const B_ENABLE_BCAST_TOTAL=true, B_USE_BET_TABLE_CUMUL=true,B_START_FROM_NO_HIST=false,B_DBG=false
let jusernamesitename_socket={}
io.on('connection', async(socket) => {
  const address=getipsocket(socket) // socket.request.connection.remoteAddress // socket.handshake.address
	const port=socket.request.connection.remotePort //	console.log(socket.request.connection)
  const uidfromsocket=socket.request._query.userid ; const sitename=socket.request._query.sitename // socket.request._query.userid
	LOGGER(socket.handshake.query);   LOGGER(`Client connected! ${socket.id},${address},${port},${uidfromsocket},@${gettimestr()}` )
	jusernamesitename_socket[`${uidfromsocket}-${sitename}`]=socket
  socket.on('withdrawreq',async msg=>{LOGGER('mavm8tDL81',msg);  let {amount,address,pw,username,currency}=PARSER(msg) // amount:this.state.inputamount      , address:inputaddress,pw:inputpw,username:username,currency:currency
    let respvalidate;
		if(currency==CURRENCY_ETH){      respvalidate=await validatesend_eth   (username,currency,amount); if(respvalidate.status){} else {socket.emit('procdone',STRINGER({status:'ERR',username:username,message:respvalidate.message}) );return false}
      sendseth_track({username:username , rxaddress:address , currency:CURRENCY_ETH, amount:amount,sitename:sitename }).then(resptx=>{
        if(resptx){LOGGER('YGh3uHjWO4');return false} else {LOGGER('QAeWmNb24y');return false}
      }) // let {username,rxaddr,amount,sitename}=jdata; LOGGER(jdata,'@15621')
    }
		else {                   respvalidate=await validatesend_token (username,currency,amount); if(respvalidate.status){} else {socket.emit('procdone',STRINGER({status:'ERR',username:username,message:respvalidate.message}) );return false}
			sendstoken_track({username:username,rxaddress:address,currency:currency,amount:amount,sitename:sitename} , 'transactions' , socket).then(resptx=>{
				if(resptx){LOGGER('XgTqwTPwuz');return false} else {LOGGER('dkGiHw9bCo');return false}
			}) //
    }    
  })
	socket.on('disconnect',()=>{		LOGGER(`Client disconnected! ${socket.id} ,,,@${gettimestr()}` ) ; delete jusernamesitename_socket[`${uidfromsocket}-${sitename}`]
	})
}) //
const test=()=>{
	const CB=require('circular-buffer')
	const redis=require('redis')
	const cliredis=redis.createClient()
	const cliredisa=require('async-redis').createClient()	
}
//   socket.on('message-from-client-to-server', (msg) => {	console.log(`${msg},${socket.id} ,,,@${gettimestr()}`)	})
//	socket.emit('message-from-server-to-client', `Hello World! ,,,@${gettimestr()}`)
/*
const {clearsockets,deletesocketid}=require('./utils-sockets');clearsockets()
app.io.on('connection',socket=>{
  const address=utils.getipsocket(socket) // socket.request.connection.remoteAddress // socket.handshake.address
	const port=socket.request.connection.remotePort //	console.log(socket.request.connection)
  const uidfromsocket=socket.request._query.userid // socket.request._query.userid
  if (uidfromsocket){utils.binduseridsocketid(uidfromsocket,socket.id ) } else {}
  LOGGER(socket.handshake.query);	LOGGER(`${socket.id},, ${address},,${port},,${uidfromsocket},${socket.handshake.query.userid} socket connected`)
	socket.on('message',msg=>LOGGER(msg,socket.id))
  socket.on('disconnect',()=>{	const address=socket.request.connection.remoteAddress
    LOGGER(`${socket.id},, ${address},,${port},,${uidfromsock} socket DISconnected`)
    deletesocketid(socket.id)
	})
})
*/
/*    setTimeout(_=>{socket.emit('procstatus','MUfgHe0gju')}, 0*1000)
    setTimeout(_=>{socket.emit('procstatus','kzFrJsVziW')}, 1*1000)
    setTimeout(_=>{socket.emit('procstatus','8tgIVbiRO0')}, 2*1000)
    setTimeout(_=>{socket.emit('procstatus','XU3FRyRaOM')}, 3*1000)
    setTimeout(_=>{socket.emit('procstatus','9nHE7MnEmK')}, 4*1000)
    setTimeout(_=>{socket.emit('procstatus','W9OgCiD8R9')}, 5*1000)
    setTimeout(_=>{socket.emit('procdone','FkjHHks4nC')}, 6*1000) */
