
var CoinKey = require('coinkey')
var ci = require('coininfo') 
var ck = CoinKey.fromWif('Kx7c9qKwYkdgpPdD7rZk6tNJuEuRDBey3p8TMVFefLrpQS6WcSpN')
ck.versions = ci('BTC-TEST')
console.log(ck.publicAddress) 

1GGsZ2bxtPaCNF98X9EExeDEfeUaGU5HMw

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
