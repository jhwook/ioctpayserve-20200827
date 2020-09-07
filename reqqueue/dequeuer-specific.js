
var amqp = require('amqplib/callback_api')
const {queuenames}=require('../configs/configs')// const queuenames=['ADDR-TOKEN','ADDR-ETH','ADDR-BTC','AMOUNT']
const db=require('../models')

const getqueue=qname=>{
	return new Promise((resolve,reject)=>{
	amqp.connect('amqp://localhost', function(error0, connection) {    if (error0) { throw error0;console.log(error0)    }
		connection.createChannel(function(error1, channel_) {channel=channel_
			if (error1) {            throw error1;		}
			channel.assertQueue(qname, {            durable: false		})
			console.log(" [*] awaiting in %s", qname);
			dequeuedata=channel.consume
			channel.consume(queuename, function(msg) {			const str=msg.content.toString();			console.log(" [x] Received %s",str)
				const packet=JSON.parse(str) // ;console.log(typeof packet,packet,packet.flag,packet.userid,packet['flag'],packet['userid'])
				if(packet['flag']=='BALANCE'){} //console.log('INCAMT')
				else {return false} // console.log('XX INCAMT');
				doprocess(str);return false
			}    , {				noAck: true		}
			)
		});
	})
	})	
}
ch.consume('ADD-TOKEN',msg=>{str=msg.content.toString();console.log(str)})
doprocess=str=>{console.log(str)}
module.exports={dequeuedata,channel}

// {flag:'INCAMT',userid:userid,winamt:winamt,gametype:gametype,chnum:chnum,tidx:createtimebasedindex(),ib_idx:ib_idx  }
/*const doprocess=(msg)=>{
	const packet=JSON.parse(msg)
	if(locks[packet['userid']]){setTimeout(()=>{doprocess(msg)},getRandomInt(MINBACKOFF,MAXBACKOFF));return false}
	const {userid		,winamt		,gametype		,chnum		, tidx		, ib_idx}=packet
	locks[userid]=1
	db.sequelize.transaction().then(tx=>{
		db.info_users.findOne({where:{iu_idx:userid}},{transaction:tx}).then(respuser=>{console.log(respuser.dataValues['iu_cash'])
			db.log_cash.create({... filluplogcash(respuser.dataValues,winamt,gametype,chnum,tidx,ib_idx)}).then(respcash=>{
				respuser.update({iu_cash: parseInt(respuser.dataValues['iu_cash'])+parseInt(winamt)}	,{transaction:tx}).then(respupdate=>{
					tx.commit()
					delete locks[userid]
				})
			})				
		})
	}).catch(err=>{console.log(err)})
}
*/
