
const amqp = require('amqplib/callback_api')
let channel=null
const queuename = 'REQQUEUE';
const enqueuedata=(data)=>{
	channel.sendToQueue(queuename, Buffer.from(data ))
}
amqp.connect('amqp://localhost', function(error0, connection) {    if (error0) { throw error0;    }
	connection.createChannel(function(error1, channel0) {        if (error1) { throw error1;        }
		channel=channel0
		try{channel.assertQueue(queuename, {  durable: false        })}
		catch(err){console.log(err)}
		const msg = JSON.stringify({flag:'TEST',message:'Checking connection'})
		if(true){channel.sendToQueue(queuename, Buffer.from(msg))}
		console.log("[x] sent %s", msg);
	})
//	setTimeout(function() {		connection.close();		process.exit(0);	}, 500);
})
module.exports={enqueuedata}
