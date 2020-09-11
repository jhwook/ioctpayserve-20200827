
const configs=require('./configs/configs')
const {KEYNAME_MARKETPRICES  , KEYNAME_UNITS  , KEYNAME_KRWUSD}=configs
const redis=require('redis')
const cliredis=redis.createClient();const cliredisa=require('async-redis').createClient(); const _=require('lodash')
cliredisa.hset(KEYNAME_MARKETPRICES, KEYNAME_KRWUSD, '1191.730076')
cliredisa.hset(KEYNAME_UNITS, 'BTC', 'USD')
cliredisa.hset(KEYNAME_UNITS, 'ETH', 'USD')
cliredisa.hset(KEYNAME_UNITS, 'GAIA', 'USD')
cliredisa.hset(KEYNAME_UNITS, 'IOTC', 'KRW')
cliredisa.hset(KEYNAME_UNITS, 'USDT', 'USD')

// mysql :MariaDB [iotcpay]> update exchangerates set priceisfixed=1,fixedprice=120 where currency0='IOTC' ;      
