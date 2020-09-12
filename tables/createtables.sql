
CREATE USER 'iotcpay'@'localhost' IDENTIFIED BY 'rY3f0qKSN6';

Update transactions set amountfloatstr = CAST(RAND() * 10000 AS UNSIGNED)

update `transactions` set txtime=(    FROM_UNIXTIME(        UNIX_TIMESTAMP('2020-08-01 01:23:45') + FLOOR(0 + (RAND() * 2592000))    ))
> use iotcpay;

db.createUser({ user: 'root', pwd: 'rY3f0qKSN6', roles: ['root']})
mongo admin -u root -p rY3f0qKSN6

ALTER USER 'root'@'localhost' IDENTIFIED BY 'rY3f0qKSN6';

XXX pw:PFmzI4WKqV

INSERT INTO `tokens` (id,name,address,decimals,supply,netkind,createdat,updatedat,MINAMOUNT_TOWITHDRAW,MAXAMOUNT_TOWITHDRAW,symbol,denominatorexp,group_,nettype) VALUES 
(1,'IOTC','0xa01977400427ab074d365814d1ed1ac514d57a26',NULL,NULL,'mainnet','2020-08-30 21:44:30','2020-08-30 21:44:30',NULL,NULL,'IOTC',18,'ETH','mainnet')
,(2,'GAIA','0xD944Dac1a03db027AcC5618095251d5E90C4A37b',NULL,NULL,'mainnet','2020-08-30 21:44:32','2020-08-30 21:44:32',NULL,NULL,'GAIA',18,'ETH','mainnet')
,(3,'AUDUS','0x5789e290020317ee07a21012db9ee1e3e43e56f1',5,NULL,'ropsten','2020-08-30 21:53:13','2020-08-30 21:53:13',NULL,NULL,'AUDUS',NULL,'ETH','testnet')
,(5,'USDT','0xdac17f958d2ee523a2206206994597c13d831ec7',6,NULL,'mainnet','2020-09-01 10:15:38','2020-09-01 10:15:38',NULL,NULL,'USDT',NULL,'ETH','mainnet')
,(6,'IOTC','0xe58a38a4598e93207be87077fd6ce1ff288cd4c4',18,NULL,'ropsten','2020-09-01 15:53:34','2020-09-01 15:53:34',NULL,NULL,'IOTC',18,'ETH','testnet')
,(7,'GAIA','0xe70ed70f9ffaa651ccd80790b48092f7b5589279',18,NULL,'ropsten','2020-09-01 15:57:02','2020-09-01 15:57:02',NULL,NULL,'GAIA',18,'ETH','testnet')
,(8,'ETH',NULL,18,NULL,'ropsten','2020-09-02 23:06:11','2020-09-02 23:06:11',NULL,NULL,NULL,18,'ETH','testnet')
,(9,'BTC',NULL,8,NULL,'testnet','2020-09-02 23:06:37','2020-09-02 23:06:37',NULL,NULL,NULL,8,'BTC','testnet')
,(10,'ETH',NULL,18,NULL,'mainnet','2020-09-02 23:07:09','2020-09-02 23:07:09',NULL,NULL,NULL,18,'ETH','mainnet')
,(11,'BTC',NULL,8,NULL,'mainnet','2020-09-02 23:07:19','2020-09-02 23:07:19',NULL,NULL,NULL,8,'BTC','mainnet');

create table variableprices (
	id int unsigned primary key auto_increment
  , currency varchar(20)
  , price float
  , pricestr varchar(20)
  , units varchar(15)
  , sitename varchar(20)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into exchangerates (sitename,currency0,C,S,K) values ('CARRYON','BTC',90,10,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('CARRYON','USDT',92,8,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('CARRYON','ETH',95,5,10);

insert into exchangerates (sitename,currency0,C,S,K) values ('SDC','BTC',50,50,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('SDC','USDT',92,8,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('SDC','ETH',95,5,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('SDC','MOKA',98,2,10);

insert into exchangerates (sitename,currency0,C,S,K) values ('IOTC','BTC',40,60,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('IOTC','ETH',90,10,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('IOTC','GAIA',98,2,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('IOTC','IOTC',100,0,10);
insert into exchangerates (sitename,currency0,C,S,K) values ('IOTC','USDT',92,8,10);

create table exchangerates (
	id int unsigned primary key auto_increment
	, currency0 varchar(20)
	, currency1 varchar(20)
	, amount0 int unsigned
	, amount1 int unsigned
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
  , partitionratios varchar(50)
  , address varchar(80)
  , netkind varchar(10)
  , nettype varchar(10)
  , sitename varchar(20) 
  , collectoraddress varchar(80)
  , priceisfixed tinyint
  , fixedprice float 
  , canwithdraw tinyint default 1
);
create table (
  id int unsigned not null primary key auto_increment
  , sitename varchar(20)
  , tokenname varchar(20)
  , address varchar(80)
  , exchangerate 
);
select * from balance;
select * from blockbalance;
select * from transactions;
select * from users;

delete from sessionkeys;

delete from balance;
 delete from blockbalance;
delete from transactions;
delete from users

insert into tokens(name,netkind,nettype,address) values ('USDT','ropsten','testnet','0xdac17f958d2ee523a2206206994597c13d831ec7');
mysqldump -u root  --databases iotcpay > iotcpaydump-20200912.sql

insert 126ccS2semhunmsgjAUCBnQNZpDuzr6Vt1
insert into tokens (name,decimals,netkind,denominatorexp) values ('ETH',18,'ropsten',18);
insert into tokens (name,decimals,netkind,denominatorexp) values ('ETH',18,'mainnet',18);
insert into tokens (name,decimals,netkind,denominatorexp) values ('BTC',8,'testnet',8);
insert into tokens (name,decimals,netkind,denominatorexp) values ('BTC',8,'mainnet',8);
insert into operations (key_,value_) values('CURRENCIES','{"BTC":"COIN","ETH":"COIN","USDT":"TOKEN","IOTC":"TOEKN","MOKA":"TOKEN","GAIA":"TOKEN"}');
create table sessionkeys (
  id int unsigned not null primary key auto_increment
  , username varchar(20)
  , token varchar(30)
  , loginip varchar(30)
  , useragent varchar(20)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into operations (key_,value_) values ('PERIOD_POLL_TICKER',60*20*1000);
create table tickers (
	id int unsigned not null primary key auto_increment
  , name varchar(15)
  , price float
  , pricestr varchar(20)
  , units varchar(10)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into operations (key_,value_) values('PERIOD_POLL_TICKER_GEX',10*60*1000);
insert into exchangerates (currency0,C,S,K,sitename) values ('USDT',92,8,10,'IOTC');
insert into exchangerates (currency0,C,S,K,sitename) values ('IOTC',100,0,10,'IOTC');
insert into exchangerates (currency0,C,S,K,sitename) values ('GAIA',98,2,20,'IOTC');

create table fixedprices (
	id int unsigned not null primary key auto_increment
  , name varchar(20)
  , address varchar(80) 
  , price float
  , units varchar(15)
  , netkind varchar(10)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into tokens (name,address,decimals,netkind,symbol) values ('IOTC','0xe58a38a4598e93207be87077fd6ce1ff288cd4c4',18,'ropsten','IOTC');
insert into tokens (name,address,decimals,netkind,symbol) values ('GAIA','0xe70ed70f9ffaa651ccd80790b48092f7b5589279',18,'ropsten','GAIA');
insert into balance
insert into blockbalance(address,username,blocknumber,amount,amountcumul,direction) values ('0xf9B239D480b74EC2bD513071b9E6fCB215CBb5E9','user01',8582162,1,1,'IN');

insert into fixedprices (tokenname,price,units) values ('USDT',1000,'KRW');
insert into fixedprices (tokenname,price,units) values ('IOTC',120,'KRW');
insert into fixedprices (tokenname,price,units) values ('GAIA',100,'KRW');
insert into fixedprices (tokenname,price,units) values ('MOKA',140,'KRW');

insert into operations (key_,value_,subkey_) values ('GAS_PRICE_TOKEN','300000000000','ropsten');
insert into operations (key_,value_,subkey_) values ('GAS_PRICE_ETH','300000000000','ropsten');
insert into operations (key_,value_,subkey_) values ('GAS_LIMIT_ETH','30000','ropsten');
insert into operations (key_,value_,subkey_) values ('GAS_LIMIT_TOKEN','30000','ropsten');
insert into operations (key_,value_,subkey_) values ('GAS_PRICE_TOKEN','30000','ropsten');

insert into operations (key_,value_,subkey_) values ('GAS_PRICE_TOKEN','300000000000','mainnet');
insert into operations (key_,value_,subkey_) values ('GAS_PRICE_ETH','300000000000','mainnet');
insert into operations (key_,value_,subkey_) values ('GAS_LIMIT_ETH','30000','mainnet');
insert into operations (key_,value_,subkey_) values ('GAS_LIMIT_TOKEN','30000','mainnet');
insert into operations (key_,value_,subkey_) values ('GAS_PRICE_TOKEN','30000','mainnet');

insert into operations (key_,value_) values ('GAS_PRICE_TOKEN','300000000000');
insert into operations (key_,value_) values ('GAS_LIMIT_TOKEN','30000');

insert into tokens(name,address,netkind,decimals) values ('USDT','0xdac17f958d2ee523a2206206994597c13d831ec7','mainnet',6);
insert into tokens(name,address,netkind) values ('IOTC','0xa01977400427ab074d365814d1ed1ac514d57a26','mainnet');
insert into tokens(name,address,netkind) values ('GAIA','0xD944Dac1a03db027AcC5618095251d5E90C4A37b','mainnet');
insert into tokens(name,address,netkind) values ('Audus00','0x5789e290020317ee07a21012db9ee1e3e43e56f1','ropsten');

create table blockbalance (
	id int unsigned not null primary key auto_increment
  , address varchar(80)
  , username varchar(20)
  , blocknumber int unsigned
  , hash varchar(80)
  , amount bigint unsigned
  , direction varchar(10)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
create table tokens (
	id int unsigned not null primary key auto_increment
  , name varchar(10)
  , address varchar(80)
  , decimals tinyint unsigned
  , supply int unsigned
  , netkind varchar(10)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into operations (key_,subkey_,value_) values ('CONTRACT_ADDRESS','GAIA','0x5789e290020317ee07a21012db9ee1e3e43e56f1');
insert into operations (key_,subkey_,value_) values ('CONTRACT_ADDRESS','MOKA','0x5789e290020317ee07a21012db9ee1e3e43e56f2');
insert into operations (key_,subkey_,value_) values ('CONTRACT_ADDRESS','IOTC','0x5789e290020317ee07a21012db9ee1e3e43e56f3');

insert into operations (key_,value_) values ('GAS_PRICE_ETH',300000000000);
insert into operations (key_,value_) values ('GAS_LIMIT_ETH',21000);
insert into operations (key_,value_) values ('PERIOD_POLL_MARKETPRICES',60*60*1000 );

insert into balance(username,currency,kind,address) values ('user01','USDT','token','0xf9B239D480b74EC2bD513071b9E6fCB215CBb5E9');

insert into balance(username,currency) values ('user01','AUDUS')
insert into balance(username,currency) values ('user01','GAIA');
insert into balance(username,currency) values ('user01','IOTC');

insert into balance(username,currency) values ('user01','C');
insert into balance(username,currency) values ('user01','S');
insert into balance(username,currency) values ('user01','K');

insert into exchangerates (currency0,currency1,amount0,amount1,C,S,K) values ('BTC','IOTC',1,1,40,60,10);
insert into exchangerates (currency0,currency1,amount0,amount1,C,S,K) values ('ETH','IOTC',1,1,90,10,10);
create table ethgasestimates (
	id int unsigned not null primary key auto_increment
,	gaspricehex varchar(20)
,	gaspriceweistr varchar(40)
,	gaspricefloat float
,	gaslimithex varchar(20)
,	gaslimitweistr float
,	gaslimitfloat float
,	createdat datetime default current_timestamp
,	updatedat datetime default current_timestamp
,	netkind varchar(15)
,	gaspricehexinuse varchar(20)
,	gaspriceweiinusestr varchar(40)
,	gaslimithexinuse varchar(20)
,	gaslimitweiinusestr varchar(40)
, ratiopriceuseoverest float
,	ratiolimituseoverest float
,	currency varchar(10)
);
CREATE TABLE IF NOT EXISTS `ethblocks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `blocknumber` int(10) unsigned DEFAULT NULL,
  `numberoftxs` int(10) unsigned DEFAULT NULL,
  `memo` varchar(50) DEFAULT NULL,
  `createdat` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedat` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
create table operations (
	id int unsigned primary key auto_increment
  , key_ varchar(50)
  , value_ varchar(50)
  , subkey_ varchar(100)
  , memo varchar(50)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
create table marketprices (
	id int unsigned primary key auto_increment
  , BTC float
  , ETH float 
  , XRP float
	, units varchar(15)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);

create table marketprices (
	id int unsigned primary key auto_increment
	, currency varchar(15)
	, price float
	, units varchar(15)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
create table users (
	id int unsigned primary key auto_increment
, username varchar(20)
, withdrawpw varchar(20)
, active tinyint default 1
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
create table exchangerates (
	id int unsigned primary key auto_increment
	, currency0 varchar(20)
	, currency1 varchar(20)
	, amount0 int unsigned
	, amount1 int unsigned
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
  , partitionratios varchar(50)
);
create table txtaskstodo (
	id int unsigned not null primary key auto_increment
, username varchar(15)
, currency varchar(20)
, amount bigint unsigned
, toaddress varchar(100)
, createdat datetime default current_timestamp
,  `updatedat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

create table transactions (
  id int unsigned primary key auto_increment
  , username varchar(15)
  , assetname varchar(20)
  , fromamount bigint unsigned
  , toamount bigint unsigned
  , fromaddress varchar(100)
  , toaddress varchar(100)
  , direction varchar(10)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
create table balance (
  id int unsigned primary key auto_increment
  , username varchar(15)
  , currency varchar(20)
  , amount bigint unsigned default 0
  , amountlocked bigint unsigned default 0
  , address varchar(80)
  , privatekey varchar(100)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into users (username,withdrawpw) values ('user01','123456');
 insert into balance (username,currency,amount,address) values('user01','BTC',100000000, '3HFsRycncECTVQ9gX5AwYWmkmJwLrnds4J');
 insert into balance (username,currency,amount,address) values('user01','ETH',1000000,'0xea674fdde714fd979de3edf0f56aa9716b898ec8' );
