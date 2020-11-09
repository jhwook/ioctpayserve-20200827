const { add } = require('lodash')

const sha256 = require('js-sha256').sha256
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
let ALPHABET_MAP = {}
for(var i = 0; i < ALPHABET.length; i++) {  ALPHABET_MAP[ALPHABET.charAt(i)] = i}
const BASE = 58

function hex2a(hex) {  var str = '';
  for (var i = 0; i < hex.length; i += 2)
  {      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  } return str;
}
function a2hex(str) {
  var aHex = "0123456789abcdef";
  var l = str.length;
  var nBuf;
  var strBuf;
  var strOut = "";
  for (var i = 0; i < l; i++) {
    nBuf = str.charCodeAt(i);
    strBuf = aHex[Math.floor(nBuf/16)];
    strBuf += aHex[nBuf % 16];
    strOut += strBuf;
  }
  return strOut;
}
function pow(big, exp) {  if (exp == 0) return int2bigInt(1, 1, 0);  var i;  var newbig = big;
  for (i = 1; i < exp; i++) {      newbig = mult(newbig, big);
  }
  return newbig;
}
function repeat(s, n){  var a = [];
  while(a.length < n){    a.push(s);
  }
  return a.join('');
}
function base58_decode(string) {
  if (string.length === 0) return []
  var i, j, bytes = [0]
  for (i = 0; i < string.length; i++) {
    var c = string[i]
    if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')
    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
    bytes[0] += ALPHABET_MAP[c]
    var carry = 0
    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry
      carry = bytes[j] >> 8
      bytes[j] &= 0xff
    }
    while (carry) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }  // deal with leading zeros
  for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0)
  bytes = bytes.reverse()
  output = '';
  for (i=0; i<bytes.length; i++) {      output += String.fromCharCode(bytes[i]);
  }
  return output;
}
const sha256_digest=sha256
const validatebtcaddress=str=>{
  var decoded = base58_decode(str)     
//  if (decoded.length != 25) return false;
  var cksum = decoded.substr(decoded.length - 4); 
  var rest = decoded.substr(0, decoded.length - 4);  
  var good_cksum = hex2a(sha256_digest(hex2a(sha256_digest(rest)))).substr(0, 4)
  if (cksum != good_cksum) return false;
  return true;
}
module.exports={validatebtcaddress}
const tst=_=>{
  var validate = require('bitcoin-address-validation')  
  addr='1BSYxhj2Uz8Y3BE7Se7oSLRjkpsygAzXrj'
  validate(addr)
  
  addr='0x1BSYxhj2Uz8Y3BE7Se7oSLRjkpsygAzXrj'

  utilstokens=require('./utilstokens')
  utilstokens.validatebtcaddress(addr)
}
