const { sign } = require('crypto');

newtx = {  inputs: [{addresses: ['mkTddhC91V3FSePXS1L31BKTLbaMRstnpt']}],  outputs: [{addresses: ['mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv'], value: 100000}] }
axios=require('axios')
rootUrl = "https://api.blockcypher.com/v1/btc/test3"
axios.post(rootUrl+"/txs/new", newtx).then(resp0=>{resp=resp0;console.log(resp.data)}).catch(console.log)
bitcore = require("bitcore")
prvk = new bitcore.PrivateKey('93DbQP89FDm983qFpVFyVrFh2X33KLyxQP7P5FmCrkBF8fpSPVg')
tmptx.pubkeys=[]
tmptx.pubkeys.push(prvk.publicKey.toString())
tmptx.signatures=[]
signed='3044022023f305f387b04c88beab7fe94fb74918abab35b417d8016e268d785420b3785a022058a5c43bba8d3332d5a54ce2af1f2774683d169353cd596a155479839427519b'
tmptx.signatures.push(signed)
axios.defaults.headers.common['Content-Type']='application/json'
axios.post( 'https://api.blockcypher.com/v1/btc/test3/txs/send', {tx:JSON.stringify(tmptx)}).then(finaltx0=> {finaltx=finaltx0}).catch(console.log)

//
utxo=resp.data.tx.inputs
[
  {
    prev_hash: '51a1b99e67a174be5b088752dc44e59953d61fc91e607708f6c3e9cd562392ed',
    output_index: 1,
    output_value: 1712741,
    sequence: 4294967295,
    addresses: [ 'mkTddhC91V3FSePXS1L31BKTLbaMRstnpt' ],
    script_type: 'pay-to-pubkey-hash',
    age: 1831064
  }
]
 Message = require('bitcore-message')
 tosign='7fcdf9687940f862499f5ef4cfd85fb9b571408a4d23edfe77ec7454edf77c74' // resp.data.tosign[0]
 signature = Message(tosign).sign(prvk) // mnFATxRQgTw6PzVYYCygJfJUgom1AvkuBg.log



tmptx={
  tx: {
    block_height: -1,
    block_index: -1,
    hash: '233075852ecc895b1efc0eb140bedb6870643aa4e88a3d970b7e5a9c3622ee67',
    addresses: [
      'mkTddhC91V3FSePXS1L31BKTLbaMRstnpt',
      'mwg1NMTC9TF9pj9wLLwk8gov3sZboPavGv'
    ],
    total: 1685441,
    fees: 27300,
    size: 119,
    preference: 'high',
    relayed_by: '27.35.29.72',
    received: '2020-09-09T10:46:40.708808448Z',
    ver: 1,
    double_spend: false,
    vin_sz: 1,
    vout_sz: 2,
    confirmations: 0,
    inputs: [ [Object] ],
    outputs: [ [Object], [Object] ]
  },
  tosign: [
    '712b569c9a27f03d48be72a32a3adb9ec16a2d9f4b3070071899e9e8a9aaf454'
  ]
}
// ./signer 7fcdf9687940f862499f5ef4cfd85fb9b571408a4d23edfe77ec7454edf77c74 d6f9875dd5e67eaa5bbdc28c3e4b2f4006725092ae6cc4de98630e6432a9ca61
// 3044022023f305f387b04c88beab7fe94fb74918abab35b417d8016e268d785420b3785a022058a5c43bba8d3332d5a54ce2af1f2774683d169353cd596a155479839427519b
