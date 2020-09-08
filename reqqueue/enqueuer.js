
const amqp = require('amqplib/callback_api')
const {queuenames}=require('../configs/configs')// const queuenames=['ADDR-TOKEN','ADDR-ETH','ADDR-BTC','AMOUNT']
let jqnamechs={}
amqp.connect('amqp://localhost', function(error0, connection) {    if (error0) { throw error0;    }
	queuenames.forEach(qname=>{
		connection.createChannel(function(error1, channel) {        if (error1) { throw error1;        } //		channel=channel0
//		queuenames.forEach(qname=>{
		try{channel.assertQueue(qname, {  durable: false        })}
		catch(err){console.log(err)}
		jqnamechs[qname]=channel
		const msg = JSON.stringify({flag:'TEST',message:'Checking connection',qname:qname})
		if(true){channel.sendToQueue(qname, Buffer.from(msg))}
		console.log(`[x] sent %s-${qname}`, msg);
	})
	})
//	setTimeout(function() {		connection.close();		process.exit(0);	}, 500);
})
const enqueuedata=(qname,data)=>{	if(jqnamechs[qname]){} else {return false}
	jqnamechs[qname].sendToQueue(qname , Buffer.from(data));return true
}
const enqueuedataj=(qname,jdata)=>{if(jqnamechs[qname]){} else {return false}
	jqnamechs[qname].sendToQueue(qname , Buffer.from(JSON.stringify(jdata)));return true
}
module.exports={enqueuedata,enqueuedataj}
/*let channel=null
const queuename = 'REQQUEUE';
const enqueuedata=(data)=>{
	channel.sendToQueue(queuename, Buffer.from(data ))
}
let connection=null
const createchannel=async queuename=>{let channel
	connection.createChannel(async (error1, channel0)=> {        if (error1) { throw error1;        }
		channel=channel0
		try{channel.assertQueue(queuename, {  durable: false        })}
		catch(err){console.log(err)}
		const msg = JSON.stringify({flag:'TEST',message:'Checking connection'})
		if(true){channel.sendToQueue(queuename, Buffer.from(msg))}
		console.log("[x] sent %s", msg);
		return channel
	})
}
*/
