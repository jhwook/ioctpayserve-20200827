
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
  , amount bigint unsigned
  , amountlocked bigint unsigned
  , address varchar(80)
  , privatekey varchar(100)
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
insert into users (username,withdrawpw) values ('user01','123456');
 insert into balance (username,currency,amount,address) values('user01','BTC',100000000, '3HFsRycncECTVQ9gX5AwYWmkmJwLrnds4J');
 insert into balance (username,currency,amount,address) values('user01','ETH',1000000,'0xea674fdde714fd979de3edf0f56aa9716b898ec8' );
