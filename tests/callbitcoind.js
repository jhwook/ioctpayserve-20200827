
const request=require('request')
// var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${10000  }"]}`
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"listunspent","params":[1, 1000000, ["mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"],true,{"minimalamount":0.00001}]}`
const headers = {  "content-type": "text/plain;", 'charset':'iso-8859-1'}
// const headers = {  "content-type": "text/plain;", 'charset':'utf-8'}
// const headers = {  "content-type": "text/plain;", 'charset':'utf-8'}
const USER='root',PASSWORD='b8P9hiHAAD'
  var options = {
    url: `http://${USER}:${PASSWORD}@182.162.21.240:18332/`,    
    method: "POST",
    headers: headers,
    body: dataString
  };
callback = (error, response, body) => { console.log(error)
console.log(response)
//console.log(response.body)
console.log(body)
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
  console.log(data)
    }
  };
request(options, callback);
//     url: `http://${USER}:${PASSWORD}@127.0.0.1:18332/`,
// data={"result":[{"txid":"126e86cc0ae10a280a62350c448dde3ad35441b860f68f763b102e1e97d5312a","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00800000,"confirmations":3017,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"c311a9bf8bfdd2d1afd3c85fa5ba1358b392309322cb4e11eb5042686bd0f43e","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01000000,"confirmations":2400,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"a72b7ed4e73ab4d3fb240d37987cde4345d1f48132b902d1292a9b152b1fce6c","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01000000,"confirmations":1599,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"318dc7373e6acc6016403d36836f6676e4b0bbdca456df9042b061771e5dfc7e","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00100000,"confirmations":3255,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"504cfa6585c938b5137c1e269fa26ff92c17fbd989824fbf5a15694f5774cb89","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01000000,"confirmations":1422,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"3ea08344e15c0c6c84760ffcbb0bb98f28d12b1cd9bc7ac504dba31e6e9c869e","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01231674,"confirmations":3154,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"9f0f220ae4d78071d03c54d53227fadc6c43553537ca68c78ec64332c912889e","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01000000,"confirmations":2789,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"86e1e966266e0bb208bc8c2553a8cecdd7b971cc3051129ac89c7b518fd8b4a5","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00150000,"confirmations":1542,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"d7688b57024a0b6c90b956c4dfc80015d52568967403682412b7db781053b5a9","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00100000,"confirmations":3017,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"7dae58e890a29c780c33785079f93e278c5e5d27a8287f30e9f9c040aef47faa","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01000000,"confirmations":2333,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"8cb3422eec21dc108b91130f7bdf632f3391b755b7696968909d0613a079b1b4","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01140077,"confirmations":2398,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"234c8a2948df5d9db44b2bf6c3d05efc5d7174e4d3ccf8edd6eb448a52a326b5","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01000000,"confirmations":2179,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"d610bf952bb450632270664807dba755f02487baaf11307999ad864374e83cbd","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00100000,"confirmations":2689,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"a8cdfea16703bfed93a0476a3469e77ed98956ba842aa740001aeb732167b7d3","vout":0,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00100000,"confirmations":2678,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"b373387d4f5e59bfbd34f7bc473699d10ba692ba385777b83cf6c0b123b98dea","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.00100000,"confirmations":2641,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true},{"txid":"51a1b99e67a174be5b088752dc44e59953d61fc91e607708f6c3e9cd562392ed","vout":1,"address":"mkTddhC91V3FSePXS1L31BKTLbaMRstnpt","label":"","scriptPubKey":"76a9143637cda4bff30631b420f1a091db3e515b25038988ac","amount":0.01712741,"confirmations":3256,"spendable":true,"solvable":true,"desc":"pkh([3637cda4]044b29387ecf71f5e5061ed830a4b8c0a89f859c264bbe0feff122e5b78d5c7f26b5151246d61b31b95654e136dcf2bcea1c4fbbcddbbbbf2151a241d50ff64b4b)#y55xlk8l","safe":true}],"error":null,"id":"curltext"}

