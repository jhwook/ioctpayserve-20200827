
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