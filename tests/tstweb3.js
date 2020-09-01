


axios=require('axios')
axios.defaults.headers.post='tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW'

curl -H "X-BH-APIKEY: tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW" 
-X POST 'https://api.gex.live/openapi/v1/order?symbol=GAIAUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000&signature=5f2750ad7589d1d40757a55342e621a44037dad23b5128cc70e18ec1d1c3f4c6'


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