
const STR_MAINNET='mainnet'
const STR_TESTNET='ropsten'
const ENV_MAINNET='productionmainnet'
const ENV_TESTNET='productionropsten'
const ETH_SELECT=ENV_MAINNET // ( process.env.NODE_ENV && process.env.NODE_ENV=='productionmainnet')? ENV_MAINNET : ENV_TESTNET
const configEthersLocal={ //	'productionmainnet':{
	productionmainnet:{	
		'ethNetSvcAddr' : "https://mainnet.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0"
		, 'ethNetKind' : "mainnet"
	}
	, productionropsten:{
		'ethNetSvcAddr' : 'https://ropsten.infura.io/v3/cd35bc8ac4c14bc5b464e267e88ee9d0' // "https://ropsten.infura.io/v3/5799d55e1e66488786f26d987bfcfd05"
		, 'ethNetKind' : "ropsten"
	}
}
const ethNetSvcAddr=configEthersLocal[ETH_SELECT].ethNetSvcAddr // ['ethNetSvcAddr']
const ethNetKind=configEthersLocal[ETH_SELECT].ethNetKind // ['ethNetKind']
const ethers=require('ethers')
const ethersProvider=new ethers.providers.JsonRpcProvider( ethNetSvcAddr , ethNetKind ) // let   etherscanProvider = new ethers.providers.EtherscanProvider();
const etherScanProvider = new ethers.providers.EtherscanProvider( ethNetKind ) 
const defProvider = ethers.getDefaultProvider( ethNetKind) // moment=require('moment')// providers.networks.ropsten
module.exports={ethersProvider,ethNetSvcAddr, ethNetKind, etherScanProvider,defProvider }
