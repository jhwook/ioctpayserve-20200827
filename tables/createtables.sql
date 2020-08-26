

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
  , assetname varchar(20)
  , amount bigint unsigned
  , amountlocked bigint unsigned
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);

 insert into balance (username,assetname,amount) values('user01','BTC',100000000);

