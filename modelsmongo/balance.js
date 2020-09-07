
var mongoose = require('mongoose')

//Define a schema
var Schema = mongoose.Schema;

var balance = new Schema({
  username: String,
  address: String,
  currency: String,
  nettype: String
})
var balance = mongoose.model('balance', balance )
module.exports={balance}
// > db.balance.insert({username:'user01',address:'0x839B6158e9A0342D4B9b86E8a4774A63e93b7D30',currency:'ETH',nettype:'testnet'})
