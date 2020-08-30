
const minAbi4tx = [
	{	   "name" : "transfer",
	   "type" : "function",
	   "inputs" : [
				{	"name" : "_to",
				"type" : "address"
				},
				{	"type" : "uint256",
				"name" : "_tokens"
				}
	   ] ,
	   "constant" : false,
	   "outputs" : [],
	   "payable" : false
	},
	{	// balanceOf
		"constant":true,
		"inputs":[{"name":"_owner","type":"address"}],
		"name":"balanceOf",
		"outputs":[{"name":"balance","type":"uint256"}],
		"type":"function"
	}
 ];
const minABI = [
	{	// balanceOf
	  "constant":true,
	  "inputs":[{"name":"_owner","type":"address"}],
	  "name":"balanceOf",
	  "outputs":[{"name":"balance","type":"uint256"}],
	  "type":"function"
	},
	{	// decimals
	  "constant":true,
	  "inputs":[],
	  "name":"decimals",
	  "outputs":[{"name":"","type":"uint8"}],
	  "type":"function"
	}
];		//
module.exports={
	minAbi4tx
}