
 bitcoinTransaction = require('bitcoin-transaction')
 bitcore = require("bitcore")
 privateKey = new bitcore.PrivateKey('93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg')

 from = "mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"
 to = "mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv"
 privKeyWIF = "93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg"	
 bitcoinTransaction.getBalance(from, { network: "testnet" }).then((balanceInBTC) => {console.log(balanceInBTC)}).catch(console.log)

bitcoinTransaction.getBalance(from, { network: "testnet" }).then((balanceInBTC) => {
	return bitcoinTransaction.sendTransaction({
		from: from,
		to: to,
		privKeyWIF: privKeyWIF,
		btc: balanceInBTC,
		network: "testnet"
	});
});

axios.post('https://blockstream.info/testnet/api/tx',{tx:sig}).then(resp=>{console.log(resp.data)}).catch(console.log)

 privateKey = new bitcore.PrivateKey('93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg')
// txid=txid.match(/.{2}/g).reverse().join("")
 "9f0f220ae4d78071d03c54d53227fadc6c43553537ca68c78ec64332c912889e"
 '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986'
 '51a1b99e67a174be5b088752dc44e59953d61fc91e607708f6c3e9cd562392ed'
txid='9f0f220ae4d78071d03c54d53227fadc6c43553537ca68c78ec64332c912889e' 
 utxo = {
  "txId" : txid,
  "outputIndex" : 0,
  "address" : "mkTddhC91V3FSePXS1L31BKTLbaMRstnpt",
  "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
  "satoshis" : 10000
}

txstr=transaction.toString(16)
txstr = new bitcore.Transaction()  .from(utxo)  .to('mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv', 10000)  .sign(privateKey).toString('hex')
axios.post('https://api.blockcypher.com/v1/bcy/test/txs/push', {tx:txstr}).then(resp0=>{resp=resp0;console.log(resp.data)}).catch(err=>{console.log(err)})

error: 'Error validating transaction: Transaction 18e2c62d9e4eaa52107b30795b4afd24c053fe7e7d61c60b8cff44b9b4e4000f 
orphaned, missing reference 8290d3f9a39caa5ec1118c9f8dca8d9ae65713d149c1af80fe632ad7e1503570.'
// 8290d3f9a39caa5ec1118c9f8dca8d9ae65713d149c1af80fe632ad7e1503570
sig='3044022037666364663936383739343066383632343939663565663463666438356662390220623537313430386134643233656466653737656337343534656466373763373402'
sig='01000000019e8812c93243c68ec768ca373555436cdcfa2732d5543cd07180d7e40a220f9f0000000000ffffffff0110270000000000001976a914b1385285796de6d4d718bc3644f4146cc0cd387588ac00000000'

axios.post('https://api.blockcypher.com/v1/bcy/test/txs/push', {tx:sig}).then(resp=>{console.log(resp.data)}).catch(console.log)

var bitcoin = require("bitcoinjs-lib")
var tx = new bitcoin.TransactionBuilder()
 source = {
  private : 'd6f9875dd5e67eaa5bbdc28c3e4b2f4006725092ae6cc4de98630e6432a9ca61'
  , public: '044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b'
  , address : "mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"
}
 dest={}; dest.address='mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv'
 newtx = {    "inputs": [{"addresses": [source.address]}],    "outputs": [{"addresses": [dest.address], "value": 10000}]  }
 rootUrl = "https://api.blockcypher.com/v1/btc/test3"
 axios=require('axios')
axios.post(rootUrl+"/txs/new", newtx).then(resp0=>{resp=resp0;console.log(resp.data)})
hash='8290d3f9a39caa5ec1118c9f8dca8d9ae65713d149c1af80fe632ad7e1503570'
tx.addInput(hash, 0)
tx.addOutput("mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv", 10000)



TESTNET = bitcoin.networks.testnet
prvkhex='93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg'
key = new bitcoin.ECPair.fromPrivateKey(Buffer.from(prvkhex, 'hex'), { network: bitcoin.networks.testnet })

key = new bitcoin.ECPair.fromPrivateKey(Buffer.from(prvkhex, 'hex'), { network: bitcoin.networks.testnet })

key=new bitcoin.ECPair.fromPrivateKey('93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg', TESTNET)

key   = new bitcoin.ECPair.fromWIF( '93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg', TESTNET)
tx.sign(0, key)

// axios.post(rootUrl+"/txs/new", JSON.stringify(newtx)).then(resp0=>{resp=resp0;console.log(resp.data)})
{
  tx: {
    block_height: -1,
    block_index: -1,
    hash: '8290d3f9a39caa5ec1118c9f8dca8d9ae65713d149c1af80fe632ad7e1503570',
    addresses: [
      'mkTddhC91V3FSePXS1L31BKTLbaMRstnpt',
      'mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv'
    ],
    total: 1685441,
    fees: 27300,
    size: 119,
    preference: 'high',
    relayed_by: '27.35.29.72',
    received: '2020-09-07T09:02:17.338836707Z',
    ver: 1,
    double_spend: false,
    vin_sz: 1,
    vout_sz: 2,
    confirmations: 0,
    inputs: [ [Object] ],
    outputs: [ [Object], [Object] ]
  },
  tosign: [
    '7fcdf9687940f862499f5ef4cfd85fb9b571408a4d23edfe77ec7454edf77c74'
  ]
}


var bigi    = require("bigi");
var buffer  = require('buffer')
const bitcore = require("bitcore")
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
