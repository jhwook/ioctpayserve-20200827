
create table balance (
  id int unsigned primary key auto_increment
  , username varchar(20)
  , assetname varchar(20)
  , amount bigint unsigned
  , amountlocked bigint unsigned
  , createdat datetime default current_timestamp
  , updatedat datetime default current_timestamp
);
