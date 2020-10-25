
var mongoose = require('mongoose')

//Define a schema
const Schema = mongoose.Schema;

var balance = new Schema({
  username: String,
  address: String,
  currency: String,
  nettype: String
})
var balance = mongoose.model('balance', balance )
module.exports={balance}
