

// SOCKETS=require('../configs/sockets')
const PORT_NUM=33335
const express = require('express')
const app=express()
const server = app.listen( PORT_NUM ,console.log("Socket.io Hello Wolrd server started!"))
const io = require('socket.io')(server)
const {gettimestr,LOGGER}=require('./utils'); const {getipsocket}=require('./utils-sockets')
// const HISTMAN=require('../history/manager')
const B_ENABLE_BCAST_TOTAL=true, B_USE_BET_TABLE_CUMUL=true,B_START_FROM_NO_HIST=false,B_DBG=false
io.on('connection', (socket) => {
  const address=getipsocket(socket) // socket.request.connection.remoteAddress // socket.handshake.address
	const port=socket.request.connection.remotePort //	console.log(socket.request.connection)
  const uidfromsocket=socket.request._query.userid // socket.request._query.userid
  LOGGER(socket.handshake.query);
  console.log(`Client connected! ${socket.id},${address},${port},${uidfromsocket},@${gettimestr()}` )
  socket.on('withdrawreq',msg=>{LOGGER('mavm8tDL81',msg)    
    setTimeout(_=>{socket.emit('procstatus','MUfgHe0gju')}, 0*1000)
    setTimeout(_=>{socket.emit('procstatus','kzFrJsVziW')}, 1*1000)
    setTimeout(_=>{socket.emit('procstatus','8tgIVbiRO0')}, 2*1000)
    setTimeout(_=>{socket.emit('procstatus','XU3FRyRaOM')}, 3*1000)
    setTimeout(_=>{socket.emit('procstatus','9nHE7MnEmK')}, 4*1000)
    setTimeout(_=>{socket.emit('procstatus','W9OgCiD8R9')}, 5*1000)
    setTimeout(_=>{socket.emit('procdone','FkjHHks4nC')}, 6*1000)
  })
	socket.on('disconnect',()=>{		console.log(`Client disconnected! ${socket.id} ,,,@${gettimestr()}` )	})
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
