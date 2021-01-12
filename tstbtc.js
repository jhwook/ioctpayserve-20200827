
const AES=require("crypto-js/aes")
const CryptoJS=require("crypto-js"); const bitcoin=require('bitcoinjs-lib')
const  encryptmessage= (messageToencrypt = '', secretkey = '')=>{
  var encryptedMessage = AES.encrypt(messageToencrypt, secretkey);
  return encryptedMessage.toString();
}
const    decryptmessage=(encryptedMessage = '', secretkey = '')=>{
  var decryptedBytes = AES.decrypt(encryptedMessage, secretkey);
  var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage
}
const bs58 = require('bs58')
const convhexstr2bs58=hexstr=>{
  const bytes = Buffer.from(hexstr, 'hex')
  return bs58.encode(bytes)
}
const convkey2address=(str,type)=>{  let imported
  if(type=='wif'){ 
    imported=bitcoin.ECPair.fromWIF(str)}
  else if (type=='hex'){  
    imported=bitcoin.ECPair.fromPrivateKey(Buffer.from(str,'hex'))
  }
  addressimported= bitcoin.payments.p2pkh({ pubkey: imported.publicKey })
  return addressimported.address  
}
String.prototype.removecharat = function (i) {
  var tmp = this.split(''); // convert to an array
  tmp.splice(i - 1 , 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
  return tmp.join(''); // reconstruct the string
}
const LOGGER=console.log // const basestr='3cc16c3a215b17c0818e77e1f2fe8685ec33c3b4e355d5624c4733d934fec1cbb' // address.match(/^1GG/) && LOGGER(address)
const exhaustsearch_1=(basestr,BVERBOSE)=>{ 
  for (let i=0;i<basestr.length;i++){
      let tmpstr=basestr.removecharat(i)
      let address=convkey2address(tmpstr,'hex')
BVERBOSE && LOGGER(address , tmpstr,address.match(/^1GG/))   //
    }
}
const exhaustsearch_2=_=>{
  const basestr='03b4e355d5624c4733d934fec1cbb3cc16c3a215b17c0818e77e1f2fe8685ec33c'
  for (let i=0;i<basestr.length-1;i++){
    for (let j=i+1;j<basestr.length;j++){
      let tmpstr=basestr.removecharat(j).removecharat(i)
      let address=convkey2address(tmpstr,'hex')
      address.match(/^1GG/) && LOGGER(address,tmpstr, address.match(/^1GG/) )  
       // LOGGER(address)   //
    }
  }
}
module.exports={encryptmessage,decryptmessage,convhexstr2bs58,convkey2address, exhaustsearch_1,exhaustsearch_2}
// let {encryptmessage,decryptmessage}=require('./tstbtc')
const tst=_=>{
  const bs58 = require('bs58')
  key=''
  const bytes = Buffer.from(key, 'hex')
  const address = bs58.encode(bytes)
  console.log(address)
}
/* 
3cc16c3a215b17c0818e77e1f2fe8685ec33c03b4e355d5624c4733d934fec1cbb 
03b4e355d5624c4733d934fec1cbb3cc16c3a215b17c0818e77e1f2fe8685ec33c

3cc16c3a215b17c0818e77e1f2fe8685ec33c03b4e355d5624c4733d934fec1cbb 
03b4e355d5624c4733d934fec1cbb3cc16c3a215b17c0818e77e1f2fe8685ec33c
03b4e355d5624c4733d934fec1cbb 3cc16c3a215b17c0818e77e1f2fe8685ec33c <<<<

3b4e355d5624c4733d934fec1cbbcc16c3a215b17c0818e77e1f2fe8685ec33c

03b4e355d5624c4733d934fec1cb3cc16c3a215b17c0818e77e1f2fe8685ec33c

03b4e355d5624c4733d934fec1cbb3cc16c3a215b17c0818e77e1f2fe8685ec33c

03b4e355d5624c4733d934fec1cbb3cc16c3a215b17c0818e77e1f2fe8685ec33c
*/
