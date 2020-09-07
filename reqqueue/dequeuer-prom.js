
var amqp = require('amqplib/callback_api')
const queuename = 'REQQUEUE'
const db=require('../models')

const getqueue=qname=>{
	return new Promise((resolve,reject)=>{
		amqp.connect('amqp://localhost', function(error0, connection) {    if (error0) { throw error0;console.log(error0)    }
		connection.createChannel(function(error1, channel_) {channel=channel_
			if (error1) {            throw error1;		}
			channel.assertQueue(queuename, {            durable: false		})
			resolve(channel)
		})
	})
	})
}
doprocess=str=>{console.log(str)}
module.exports={getqueue}

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
