
sig='3044022037666364663936383739343066383632343939663565663463666438356662390220623537313430386134643233656466653737656337343534656466373763373402'
axios.post('https://api.blockcypher.com/v1/bcy/test/txs/push', sig)

var bitcoin = require("bitcoinjs-lib")
var bigi    = require("bigi");
var buffer  = require('buffer')
var rootUrl = "https://api.blockcypher.com/v1/btc/test3"
const bitcore = require("bitcore")
var source = {
  private : 'd6f9875dd5e67eaa5bbdc28c3e4b2f4006725092ae6cc4de98630e6432a9ca61'
  , public: '044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b'
  , address : "mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"
}
TESTNET = bitcoin.networks.testnet
key   = new bitcoin.ECPair.fromWIF( '93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg', TESTNET)
var dest={}; dest.address='mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv'
axios=require('axios')
let newtx0 = {    "inputs": [{"addresses": [source.address]}],    "outputs": [{"addresses": [dest.address], "value": 10000}]  }
axios.post(rootUrl+"/txs/new",newtx0).then(resp0=>{resp=resp0})

newtx=resp.data
newtx.pubkeys     = []
newtx.pubkeys.push(source.public)

signAndSend()
signAndSend=(newt)=> {
  if (checkError(newtx)) return;
    tosign=newtx.tosign[0]
    buff0=new buffer.Buffer(64)

    buf.write(tosign) // [, offset][, length][, encoding])
    encodedSignature = bitcoin.script.signature.encode(buff0, bitcoin.Transaction.SIGHASH_NONE)
    newtx.signatures=[];newtx.signatures.push(encodedSignature.toString('hex'))

    >     buff0.write(tosign)
    buff0.set(tosign)
    axios.post(rootUrl+"/txs/send", newtx).then(respsignsend0=>{respsignsend=respsignsend0})

// encodedSignature = bitcoin.script.signature.encode(new buffer.Buffer(tosign, "hex"), bitcoin.Transaction.SIGHASH_NONE)

    
    return key.sign(buff0(tosign, "hex")).toDER.toString("hex");
  });
  axios.post(rootUrl+"/txs/send", newtx).then(respsignsend0=>{respsignsend=respsignsend0})
}

checkError=(msg)=> {  if (msg.errors && msg.errors.length) {    log("Errors occured!!/n" + msg.errors.join("/n"));    return true;  }
}

newTransaction().then(signAndSend).then(resp0=>{resp=resp0})

  return $.post(rootUrl+"/txs/send", JSON.stringify(newtx));


// 3. Open a websocket to wait for confirmation the transaction has been accepted in a block.
function waitForConfirmation(finaltx) {
  if (checkError(finaltx)) return;
  log("Transaction " + finaltx.tx.hash + " to " + dest.address + " of " +        finaltx.tx.outputs[0].value/100000000 + " BTC sent.");
  var ws = new WebSocket("wss://socket.blockcypher.com/v1/btc/test3");
  var ping = pinger(ws);
  ws.onmessage = function (event) {
    if (JSON.parse(event.data).confirmations > 0) {
      log("Transaction confirmed.");
      ping.stop();
      ws.close();
    }
  }
  ws.onopen = function(event) {    ws.send(JSON.stringify({filter: "event=new-block-tx&hash="+finaltx.tx.hash}));
  }
  log("Waiting for confirmation... (may take > 10 min)")
}


function pinger(ws) {
  var timer = setInterval(function() {
    if (ws.readyState == 1) {
      ws.send(JSON.stringify({event: "ping"}));
    }
  }, 5000);
  return {stop: function() { clearInterval(timer); }};
}

function log(msg) {
  $("div.log").append("<div>" + msg + "</div>")
}

// Chaining
newTransaction().then(signAndSend).then(resp=>{resp0=resp})
$.post(rootUrl+"/addrs")
  .then(logAddr)
  .then(newTransaction)
  .then(signAndSend)
  .then(waitForConfirmation);
  // > key.privateKey.hexSlice() -> d6f9875dd5e67eaa5bbdc28c3e4b2f4006725092ae6cc4de98630e6432a9ca61 // keys.publicKey.toString(),
// key.publicKey.hexSlice() -> 044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b
// var key   = new bitcoin.ECKey(bigi.fromHex( source.private), true)
// 2. Sign the hexadecimal strings returned with the fully built transaction and include
//    the source public address.
// 0. We get a newly generated address
function logAddr(addr) {
  dest = addr;
  log("Generated new address " + dest.address)
}
// 1. Post our simple transaction information to get back the fully built transaction,
//    includes fees when required.
$=require('ajax')

newTransaction=()=> {  
  var newtx = {    "inputs": [{"addresses": [source.address]}],    "outputs": [{"addresses": [dest.address], "value": 10000}]  }
  return $.post(rootUrl+"/txs/new", JSON.stringify(newtx));
}
