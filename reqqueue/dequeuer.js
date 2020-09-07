
const { Connection } = require('amqplib-as-promised')
const connection = new Connection('amqp://localhost')
module.exports = async qname=> {
  await connection.init()
  const channel = await connection.createChannel() // or createConfirmChannel
  await channel.assertQueue(qname, {            durable: false		}) // await channel.sendToQueue(queueName, Buffer.from(testMessage))
  return channel
}
const test=()=>{
  channel=require('./reqqueue/dequeuer')('ADDR-TOKEN') //  ch.consume( 'ADDR-TOKEN' , function(msg) {			const str=msg.content.toString();			console.log(" [x] Received %s",str)})
  channel.then(ch=>{ch.consume( 'ADDR-TOKEN' , function(msg) {                  const str=msg.content.toString();                       console.log(" [x] Received %s",str)})})

}
// ;(async ()=>{
  // await channel.close()
  // await connection.close()
    
