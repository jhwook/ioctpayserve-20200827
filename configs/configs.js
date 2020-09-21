
const queuenames=['ADDR-TOKEN','ADDR-ETH','ADDR-BTC','AMOUNT']
const queuenamesj={
   'ADDR-TOKEN':'ADDR-TOKEN'
  ,'ADDR-ETH':'ADDR-ETH'
  ,'ADDR-BTC':'ADDR-BTC'
  ,'AMOUNT':'AMOUNT'
}
const MAP_SITENAME={  IOTC:   'IOTC', SDC:    'SDC', SDCPAY: 'SDC', CARRYON:'CARRYON'
}
module.exports={
  KEYNAME_MARKETPRICES:'PRICES'
  , KEYNAME_UNITS:'UNITS'
  , KEYNAME_KRWUSD:'KRWUSD'
  , POINTSKINDS:{C:1,S:1,K:1}
  , A_POINTSKINDS:['C','S','K']
  , TIMESTRFORMAT:'YYYY-MM-DD HH:mm:ss'
  , TIMESTRFORMATMILI:'HH:mm:ss.SSS ,YYYY-MM-DD '
/*  , REQQUEUE:{
    TOKEN:'TOKEN'
    , ETH:'ETH'
    , BTC:'BTC'
  }*/
  , queuenames:queuenames
  , queuenamesj
  , MAP_SITENAME
}
// a={BTC:1,ETH:1,USDT:1,IOTC:1,MOKA:1,GAIA:1}