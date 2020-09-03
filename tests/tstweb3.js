
fee==in-out
> jhashtx['e0d16fb9fea351330760d175e108a56a576c7e459e8593df87d63cb8cbe08a12'].inputs[0].prev_out.value
> jhashtx['e0d16fb9fea351330760d175e108a56a576c7e459e8593df87d63cb8cbe08a12'].out[0].value

const sumupinvalues=txdata=>{let sum=0
  txdata.inputs.forEach(e=>{    sum+=e.prev_out.value  })
  return sum
}
const sumupoutvalues=txdata=>{let sum=0
  txdata.out.forEach(e=>{    sum+=e.value  })
  return sum
}
txdata.inputs.reduce((a,b)=>{return a.prev_out.value+b.prev_out.value},0)

address='1AJbsFZ64EpEfS5UAjAfcUG8pH8Jn3rn1F'
address='1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw'
url=`https://blockchain.info/rawaddr/${address}`
axios.get(url).then(resp0=>{resp=resp0;console.log(resp.data)})
resp.data.txs.length
jhashtx={}
resp.data.txs.forEach(tx=>{
  const key=tx['hash'];console.log(key);  jhashtx[ key]=tx
})
Object.keys(jhashtx).length
jhashtx['7445b79c8293dcacb1af66163cdb70fcfe7aca4858ad7653e6fae8f4f139db4b'] // outgoing
jhashtx['92b155a730680b0fb8df2fd14e27d9db3f29ca64648f6a1c80ec0b5770f3a88f'] // incoming

> jhashtx['96ab155fd23cfde5695ca8a7003d9a8f4649050c24042f86f4e8bd3621050d9e'].inputs[0].prev_out.addr // sender's address


url=`https://api.blockcypher.com/v1/btc/main/addrs/${address}?after=630711&before=630713`
axios.get(url).then(resp0=>{resp=resp0;console.log(resp.data)})

let jhashtx={}
resp.data.txrefs.forEach(tx => {  
  const key=tx['tx_hash'];console.log(key);  jhashtx[ key]=tx
})


$.post('https://api.blockcypher.com/v1/bcy/test/txs/new', JSON.stringify(newtx)).then(function(d) {console.log(d)})

var utxo = {
  "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
  "outputIndex" : 0,
  "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
  "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
  "satoshis" : 50000
};

const newtx = {
  inputs: [{addresses: ['mkTddhC91V3FSePXS1L31BKTLbaMRstnpt']}],
  outputs: [{addresses: ['mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg'], value: 100000}]
};
axios.post('https://api.blockcypher.com/v1/bcy/test/txs/new', { ... newtx} ).then(function(d) {console.log(d)})

[]btc testnet
 [2]public: mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg
 private: 9293qUfovVd76dLjBQqHqkim5GGgz1fbRFZqWJoHHXGMWpzvrUq

[1]public mkTddhC91V3FSePXS1L31BKTLbaMRstnpt
private : 93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg

[]
import * as bitcoin from 'bitcoinjs-lib'
let bitcoin=require( 'bitcoinjs-lib')
 TESTNET = bitcoin.networks.testnet

 keyPair = bitcoin.ECPair.makeRandom({ network: TESTNET })
keyPair.publicKey.toString('base64') => A0oEI4Go3f02vxvlFNHctruL3QPoC4IHe9mm5uKLGhB0'
XXX 'AzM8KLXPiOfwTnpi4nmNzyIHss1U1m43tqs5H/aHf/8g'
keyPair.privateKey.toString('base64')
keyPair.privateKey.base64Slice() => 'T/GVwAV7LfdTYBrBGU0vkE2kOaBZ7JvB5E0fDxeLFSI='

[]var CoinKey = require('coinkey')
var ci = require('coininfo') 
var ck = CoinKey.fromWif('Kx7c9qKwYkdgpPdD7rZk6tNJuEuRDBey3p8TMVFefLrpQS6WcSpN')
ck.versions = ci('BTC-TEST')
console.log(ck.publicAddress) 

1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw

[]
axios.get('https://api.blockcypher.com/v1/btc/test3/addrs/mkTddhC91V3FSePXS1L31BKTLbaMRstnpt').then(resp=>{console.log(resp.data)})
[]
axios.get('https://api.blockcypher.com/v1/btc/main/addrs/1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw?after=607749').then(resp=>{console.log(resp.data)})
=>romise { <pending> }
> {
  address: '1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw',
  total_received: 40199426,
  total_sent: 0,
  balance: 40199426,
  unconfirmed_balance: 0,
  final_balance: 40199426,
  n_tx: 3,
  unconfirmed_n_tx: 0,
  final_n_tx: 3,
  txrefs: [
    {
      tx_hash: '7aa69d001385a83f1ae1b32e788175ccfb36f0c2eb98c206e82620db39ab8bfd',
      block_height: 607894,
      tx_input_n: -1,
      tx_output_n: 0,
      value: 1845200,
      ref_balance: 40199426,
      spent: false,
      confirmations: 38560,
      confirmed: '2019-12-13T06:42:13Z',
      double_spend: false
    },
    {
      tx_hash: '96ab155fd23cfde5695ca8a7003d9a8f4649050c24042f86f4e8bd3621050d9e',
      block_height: 607748,
      tx_input_n: -1,
      tx_output_n: 16,
      value: 21838000,
      ref_balance: 38354226,
      spent: false,
      confirmations: 38706,
      confirmed: '2019-12-12T04:21:42Z',
      double_spend: false
    },
    {
      tx_hash: 'e0d16fb9fea351330760d175e108a56a576c7e459e8593df87d63cb8cbe08a12',
      block_height: 607746,
      tx_input_n: -1,
      tx_output_n: 0,
      value: 16516226,
      ref_balance: 16516226,
      spent: false,
      confirmations: 38708,
      confirmed: '2019-12-12T04:11:11Z',
      double_spend: false
    }
  ],
  tx_url: 'https://api.blockcypher.com/v1/btc/main/txs/'
}

[]balance
axios.get('https://api.blockcypher.com/v1/btc/main/addrs/1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw/balance').then(resp=>{console.log(resp.data)})
->
{
  address: '1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw',
  total_received: 40199426,
  total_sent: 0,
  balance: 40199426,
  unconfirmed_balance: 0,
  final_balance: 40199426,
  n_tx: 3,
  unconfirmed_n_tx: 0,
  final_n_tx: 3
}

axios.get('https://api.blockcypher.com/v1/btc/main/addrs/126ccS2semhunmsgjAUCBnQNZpDuzr6Vt1/balance').then(resp=>{console.log(resp.data)})

axios.get('https://api.blockcypher.com/v1/btc/main/addrs/3HFsRycncECTVQ9gX5AwYWmkmJwLrnds4J/balance').then(resp=>{console.log(resp.data)})

balance : axios.get('https://api.blockcypher.com/v1/btc/main/addrs/1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD/balance').then(resp=>{console.log(resp.data)})


var CoinKey = require('coinkey') 

var ck = new CoinKey.createRandom()

console.log("Private Key (Wallet Import Format): " + ck.privateWif)
console.log("Private Key (Hex): " + ck.privateKey.toString('hex'))
console.log("Address: " + ck.publicAddress)


https://free.currconv.com/api/v7/convert?q=USD_KRW&compact=ultra&apiKey=b8782941ea6e6ddc5676

axios=require('axios')
axios.defaults.headers.post='tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW'

curl -H "X-BH-APIKEY: tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW" 
-X POST 'https://api.gex.live/openapi/v1/order?symbol=GAIAUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000&signature=5f2750ad7589d1d40757a55342e621a44037dad23b5128cc70e18ec1d1c3f4c6'

https://openapi.digifinex.vip/v2/ticker?apiKey=98334b4bae50d4&symbol=

  for (let i in web3.eth.accounts.wallet.length){    const address=web3.eth.accounts.wallet[i].address;console.log(address)
    db.balance.findOne({raw:true,where:{address:address.toLowerCase()}}).then(resp=>{      if(resp){} else {return false}
      jaddresses[address]=resp['username']
    })
  }

const Web3=require('web3')
const infuraurlmain=		'https://mainnet.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0'
const infuraurlropsten=		'https://ropsten.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0'
const infuraurl=infuraurlmain // infuraurlropsten // 
const web3 = new Web3(new Web3.providers.HttpProvider(infuraurl))

var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
  if (!error) {      console.log(result);      return;  }
  console.error(error);
})
.on("connected", function(subscriptionId){  console.log(subscriptionId);})
.on("data", function(blockHeader){  console.log(blockHeader);})
.on("error", console.error);

if(false){var filter = web3.eth.filter('latest')
filter.watch(function(error, result){
  var block = web3.eth.getBlock(result, true);
  console.log('current block #' + block.number);
})
}
