const request=require('request')
var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"listunspent","params":[1, 1000000, ["mkTddhC91V3FSePXS1L31BKTLbaMRstnpt"],true,{"minimalamount":0.00001}]}`;
const headers = {  "content-type": "text/plain;" };
const USER='root',PASSWORD='b8P9hiHAAD'
  var options = {
    url: `http://${USER}:${PASSWORD}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
callback = (error, response, body) => { console.log(error)
console.log(response)
console.log(response.body)
console.log(body)
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
  console.log(data)
    }
  };
request(options, callback);

// var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${10000  }"]}`
