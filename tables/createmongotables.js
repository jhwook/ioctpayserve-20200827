const db = require("../models");

db.balance.find().stream() .on('data', function(doc){  console.log(doc)})

})

> db.balance.insert({username:'user01',address:'0x839B6158e9A0342D4B9b86E8a4774A63e93b7D30',currency:'ETH',nettype:'testnet'})


[]create: db.balance.insert({username:'user01',address:'0x839B6158e9A0342D4B9b86E8a4774A63e93b7D30',currency:'ETH',nettype:'testnet'})

> db.balance.find({username:'user01'})
db.balance.deleteOne({username:'user01'})