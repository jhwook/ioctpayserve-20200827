

insert into operations (key_,value_) values ('GAS_PRICE_ETH',300000000000);
insert into operations (key_,value_) values ('GAS_LIMIT_ETH',21000);

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
