
;(async ()=>{
const { Connection } = require('amqplib-as-promised')
const connection = new Connection('amqp://localhost')
await connection.init()
const channel = await connection.createChannel() // or createConfirmChannel
await channel.assertQueue('ADDR-TOKEN', {            durable: false		}) // await channel.sendToQueue(queueName, Buffer.from(testMessage))
channel.consume( 'ADDR-TOKEN' , function(msg) {			const str=msg.content.toString();			console.log(" [x] Recei ved %s",str)
// await channel.close()
// await connection.close()
  
})
})();

module.exports={}
/*dequeuedata(REQQUEUE.ETH , msg=>{const str=msg.content.toString();			console.log(" [x] Recei ved %s",str)
  const packet=JSON.parse(str) 
  if(packet['flag']=='ADD'){} 
  else {return false}  
  }
)
channel.consume(queuename, function(msg) {			const str=msg.content.toString();			console.log(" [x] Rec eived %s",str)
const packet=JSON.parse(str) // ;console.log(typeof packet,packet,packet.flag,packet.userid,packet['flag'],packet['userid'])
if(packet['flag']=='BALANCE'){} //console.log('INCAMT')
else {return false} // console.log('XX INCAMT');
doprocess(str);return false
}    , {				noAck: true		}
)
*/