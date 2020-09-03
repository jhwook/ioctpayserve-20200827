const CoinKey = require('coinkey') 
const btc=CoinKey
const netkind='testnet',nettype='testnet'
btc.createaccount=()=>{const acct=CoinKey.createRandom()
  return {address:acct.publicAddress, privateKey: acct.privateWif}
}
module.exports={btc,netkind,nettype}
>>>>>>>
bitcore = require("bitcore")
privateKey = new bitcore.PrivateKey()
privateKey.toString() // '35abd1218b24818063f0aae6a15696caa4e083c7aae5a7beb595b60fd17704ac'
 address = privateKey.toAddress();
 address.toString() // '1LjrHrqRcdE8KVSnR69sjwZNVdJtVMnacf'
 

privateKey = new bitcore.PrivateKey('testnet') // cbb94c16c4d61414114c666bf6a928a2e591d48a86cda4467362f56d2e112682
 publicKey = privateKey.toPublicKey('testnet')
 address = publicKey.toAddress('testnet')

address = privateKey.toAddress('testnet') // mufempSPjbzKkvcLwi7NtxuAbzFaWBP23N

var address = publicKey.toAddress(Networks.livenet);

var privateKey = new bitcore.PrivateKey()


let bitcoin = require("bitcoinjs-lib")
const createaccount=()=>{
  const keyPair = bitcoin.ECPair.makeRandom() // L2bKjnKWnmJUv6kGdFn8mvk69KEafdyLscWe4bizfY5c1M9SHtrU
  const privateKey=keyPair.toWIF()

}
var keyPair = bitcoin.ECPair.makeRandom();
