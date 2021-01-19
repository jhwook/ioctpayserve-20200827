var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors'); const LOGGER=console.log
var indexRouter = require('./routes/index');
var usersrouter = require('./routes/users')
const adminrouter=require('./routes/admin')
const walletsrouter=require('./routes/wallets')
const apirouter=require('./routes/api')
var app = express()
app.io=require('socket.io')() // SOCKET
const {requestIp}=require('request-ip')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
logger.token('IP',req=>requestIp.getClientIp(req))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(cors({credentials: true, origin: 'http://localhost:3000' }))
// app.use(cors({credentials: true, origin: '*'}))
app.set('socketio',app.io)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter)
app.use('/wallets',walletsrouter)
app.use('/users', usersrouter)
app.use('/admin', adminrouter)
app.use('/api',apirouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
})
module.exports =app
const {clearsockets,deletesocketid}=require('./utils-sockets');clearsockets()
// const periodic=require('./periodic/calloutpolls')
const cron=require('node-cron'),moment=require('moment')
LOGGER(`Launching ${moment().format('HH:mm:ss, YYYY-MM-DD')}`)
cron.schedule('*/1 * * * *',()=>{  LOGGER(moment().format('HH:mm:ss.SSS, YYYY-MM-DD')) 
})
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
