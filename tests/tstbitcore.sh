
let data = new FormData()
data.append("jsonrpc", "1.0")
data.append("id", "curltest")
data.append("method", "listunspent")
data.append("params", JSON.stringify([1,1000000,['mkTddhC91V3FSePXS1L31BKTLbaMRstnpt'],true,{'minimalamount':0.00001}]))

axios({
  method: 'post',
  url: 'http://root:b8P9hiHAAD@182.162.21.240:18332',
  data: data,
  config: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
}).then(resp=>{console.log(resp.data)}).catch(console.log)

http://182.162.21.240/tmp/tst.php

OOO$ curl --user root --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "dumpwallet", "params": ["test"]}' -H 'content-type: text/plain;' http://localhost:8332/

OOO $ curl --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listunspent", "params": [1, 1000000, [],true,{"minimalamount":0.00001}] }' -H 'content-type: text/plain;' http://root:b8P9hiHAAD@localhost:18332/

OOO $ curl --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listunspent", "params": [1, 1000000, ["mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"],true,{"minimalamount":0.00001}] }' -H 'content-type: text/plain;' http://root:b8P9hiHAAD@localhost:18332/

OOO strbody='{"jsonrpc": "1.0", "id":"curltest", "method": "listunspent", "params": [1, 1000000, ["mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"],true,{"minimalamount":0.00001}] }'
axios.post('http://root:b8P9hiHAAD@localhost:18332/', strbody).then(resp=>{console.log(resp.data)}).catch(console.log)

axios.get('http://182.162.21.240/tmp/curls.php').then(console.log).catch(console.log)
axios.get('http://182.162.21.240/tmp/curls.php').then(resp=>{console.log(JSON.parse(resp.data))}).catch(console.log)

curl --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "createrawtransaction", "params": ["[{\"txid\":\"myid\",\"vout\":0}]", "[{\"address\":0.01}]"] }' -H 'content-type: text/plain;' http://127.0.0.1:8332/

>>{
  result: [
    {
      txid: '126e86cc0ae10a280a62350c448dde3ad35441b860f68f763b102e1e97d5312a',
      vout: 1,
      address: 'mkTddhC91V3FSePXS1L31BKTLbaMRstnpt',
      label: '',
      scriptPubKey: '76a9143637cda4bff30631b420f1a091db3e515b25038988ac',
      amount: 0.008,
      confirmations: 2098,
      spendable: true,
      solvable: true,
      desc: 'pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l',
      safe: true
    },
  ],
  error: null,
  id: 'curltest'
}

XXX curl --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listunspent", "params": [1, 1000000, [],true,{"minimalamount":0.00001}] }' -H 'content-type: text/plain;' http://root:b8P9hiHAAD@182.162.21.240:18332/

curl --user root --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listunspent", "params": ["mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"] }' -H 'content-type: text/plain;' http://182.162.21.240:8332/

curl --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listunspent", "params": ["mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"] }' -H 'content-type: text/plain;' http://root:b8P9hiHAAD@localhost:18332/


[1] bitcoin-cli -chain=test listunspent 1 99999999 '''["mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg"]'''
[
  {
    "txid": "4a8e99e613c887ac92a0c6cfb2bcfbc5e7ca6dc8ef26f54e1267ea5d477dc611",
    "vout": 0,
    "address": "mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg",
    "label": "",
    "scriptPubKey": "76a91449cc627c72440505b575090de42e76190b7e228c88ac",
    "amount": 0.01135154,
    "confirmations": 1464,
    "spendable": true,
    "solvable": true,
    "desc": "pkh([49cc627c]047e5481400e769c39c31a423553c7f83451fce5467ce689c3043b51c8e0f070e73a91e5ca593c47e43af34206dd4c41ef289dbd541009515bb9a5d5a8c794fcc2)#zeugyg35",
    "safe": true
  }
]
[2] bitcoin-cli -chain=test createrawtransaction '[{ "txid":"4a8e99e613c887ac92a0c6cfb2bcfbc5e7ca6dc8ef26f54e1267ea5d477dc611","vout":0}]' '{"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt": 0.0015, "mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg": 0.001}'
=>
020000000111c67d475dea67124ef526efc86dcae7c5fbbcb2cfc6a092ac87c813e6998e4a0000000000ffffffff02f0490200000000001976a9143637cda4bff30631b420f1a091db3e515b25038988aca0860100000000001976a91449cc627c72440505b575090de42e76190b7e228c88ac00000000

[3] OOO
./bitcoin-cli -chain=test signrawtransactionwithkey "020000000111c67d475dea67124ef526efc86dcae7c5fbbcb2cfc6a092ac87c813e6998e4a0000000000ffffffff02f0490200000000001976a9143637cda4bff30631b420f1a091db3e515b25038988aca0860100000000001976a91449cc627c72440505b575090de42e76190b7e228c88ac00000000" '["9293qUfovVd76dLjBQqHqkim5GGgz1fbRFZqWJoHHXGMWpzvrUq"]'
{
  "hex": "020000000111c67d475dea67124ef526efc86dcae7c5fbbcb2cfc6a092ac87c813e6998e4a000000008a47304402207ffb0d8047917d25f54da2ba1a2210157d37cf1138e8887bdce59a1402296a4702203addaf91c146bcf83782fcc77f4282b1e452218aac1242da7c48bdfcca6810cf0141047e5481400e769c39c31a423553c7f83451fce5467ce689c3043b51c8e0f070e73a91e5ca593c47e43af34206dd4c41ef289dbd541009515bb9a5d5a8c794fcc2ffffffff02f0490200000000001976a9143637cda4bff30631b420f1a091db3e515b25038988aca0860100000000001976a91449cc627c72440505b575090de42e76190b7e228c88ac00000000",
  "complete": true
}
=> 514 chars

[4]
./bitcoin-cli -chain=test sendrawtransaction "020000000111c67d475dea67124ef526efc86dcae7c5fbbcb2cfc6a092ac87c813e6998e4a000000008a47304402207ffb0d8047917d25f54da2ba1a2210157d37cf1138e8887bdce59a1402296a4702203addaf91c146bcf83782fcc77f4282b1e452218aac1242da7c48bdfcca6810cf0141047e5481400e769c39c31a423553c7f83451fce5467ce689c3043b51c8e0f070e73a91e5ca593c47e43af34206dd4c41ef289dbd541009515bb9a5d5a8c794fcc2ffffffff02f0490200000000001976a9143637cda4bff30631b420f1a091db3e515b25038988aca0860100000000001976a91449cc627c72440505b575090de42e76190b7e228c88ac00000000"
=> 86e1e966266e0bb208bc8c2553a8cecdd7b971cc3051129ac89c7b518fd8b4a5
:64 chars

[]
curl --user root --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "signrawtransactionwithkey", "params": ["020000000111c67d475dea67124ef526efc86dcae7c5fbbcb2cfc6a092ac87c813e6998e4a0000000000ffffffff02f0490200000000001976a9143637cda4bff30631b420f1a091db3e515b25038988aca0860100000000001976a91449cc627c72440505b575090de42e76190b7e228c88ac00000000","5uon7f2JX7Swk2mwHhLygtYDj1jszCYjCGkE8gR6Lodd"] }' -H 'content-type: text/plain;' http://127.0.0.1:18332/

[]
XXX ./bitcoin-cli -chain=test signrawtransactionwithkey 020000000111c67d475dea67124ef526efc86dcae7c5fbbcb2cfc6a092ac87c813e6998e4a0000000000ffffffff02f0490200000000001976a9143637cda4bff30631b420f1a091db3e515b25038988aca0860100000000001976a91449cc627c72440505b575090de42e76190b7e228c88ac00000000 ["5uon7f2JX7Swk2mwHhLygtYDj1jszCYjCGkE8gR6Lodd"]

 [2]public: mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg
 private: 9293qUfovVd76dLjBQqHqkim5GGgz1fbRFZqWJoHHXGMWpzvrUq

 

explorers =require('bitcore-explorers')
insight = new explorers.Insight()
insight.getUnspentUtxos('mkTddhC91V3FSePXS1L31BKTLbaMRstnpt', function(error, utxos) {  console.log(utxos)})

[]address: mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg
 privateKey = new bitcore.PrivateKey('9293qUfovVd76dLjBQqHqkim5GGgz1fbRFZqWJoHHXGMWpzvrUq')
 cNoe7mVGEVFwUwQXuCJadosEVPYU5rcCVxzTr46gYWbWMD8gXR7b
 privateKey.toString()
>> '48f5d77663a590a86ff2b4f412652c2387e44ac8d0c559c3ec6fea2877141a4c'
 bs58 = require('bs58')
 bytes = Buffer.from('48f5d77663a590a86ff2b4f412652c2387e44ac8d0c559c3ec6fea2877141a4c', 'hex')
 prvkbs58 = bs58.encode(bytes)
 >> '5uon7f2JX7Swk2mwHhLygtYDj1jszCYjCGkE8gR6Lodd'
 
console.log(address) 

: Error parsing JSON:[48f5d77663a590a86ff2b4f412652c2387e44ac8d0c559c3ec6fea2877141a4c]
error: Error parsing JSON:[9293qUfovVd76dLjBQqHqkim5GGgz1fbRFZqWJoHHXGMWpzvrUq]
