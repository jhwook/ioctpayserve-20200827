const configEthers=require('../../configs/ETH/configEthers') // ,configtokens=require('../config/configtokens')
const ethers=require('ethers');		const { Contract, Wallet, providers } = ethers; const moment=require('moment')
const {ethersProvider,etherScanProvider,defProvider,ethNetKind}=configEthers
const db=require('../../models')
const {web3}=require('../../configs/ETH/conf_igweb3')
const B_VERB=true,DT_STR_FORMAT_DEF='YYYY-MM-DD HH:mm:ss.SSS'
const doreceiveethtkn=async tx=>{	if(tx && tx.to && tx.from){}	else {return false}
	const addressrcv=tx.to ; const addressrcvNorm=ethers.utils.getAddress(addressrcv),addresslowewr=addressrcv.toLocaleLowerCase(), addressupper=addressrcv.toUpperCase()
	db.balance.findOne({raw:true,where:{address:addresslowewr}}).then(async respmember=>{
		if(respmember){} else {return false}

  })
}
const setlistener=()=>{
  ethersProvider.on('block', blockNumCur=> {console.log(blockNumCur,moment().format(DT_STR_FORMAT_DEF))
    ethersProvider.getBlock(blockNumCur).then(block=>{ 		db.ethblocks.create({blocknumber:blockNumCur,numberoftxs:block.transactions.length})
      block.transactions.forEach(txNum=>{
        web3.eth.getTransaction(txNum).then(resp=>{
          console.log(resp)
        })
//        ethersProvider.getTransaction(txNum ).then(tx => { if(B_VERB){console.log(`${tx.from},${tx.to},${tx.value}`)}          doreceiveethtkn(tx)        })
      })
    })
  })
}
setlistener()
/*{
  blockHash: '0x03c3c5a9762aac3aa6efaf74913274233fc5e10cddf21394c7f17b72c2e93cb6',
  blockNumber: 10744955,
  from: '0xFDeda15e2922C5ed41fc1fdF36DA2FB2623666b3',
  gas: 21000,
  gasPrice: '52000000000',
  hash: '0xada66bb25d2957a0d4352884a72032785935d7431f8c21a12d3c6293a43ebc1f',
  input: '0x',
  nonce: 226932,
  r: '0x315ab9c4d1d85115bac677c15c4e003f93596c093610c45a0f8d771701bea2ac',
  s: '0x79536175df7e457d1bf1d5ce9f703ba6f3a114b667359babb2aa5c650cfc55e3',
  to: '0xF1D40172c30333E60e830C0BA7e97667d3069468',
  transactionIndex: 132,
  v: '0x26',
  value: '2080000000000000'
}*/
