pragma foreign_keys = 'ON';
insert into admin(user_name, password)
	values ("admin", "admin");
insert into items(id , name ,description , date ,base_price ,status,start_Time) values(1,"bat","it is viratkholi bat ","2015-02-23",25000,"open","Tue Feb 24 2015 11:03:31");
insert into users(id , name,email_id , password , items_id)values(1,"vijay","vijay@email.com","1234",1); 
insert into users(id , name,email_id , password , items_id)values(2,"parmatma","param@email.com","1234",1);
insert into running_auction(items_id , bidder_id ,bid_price ) values(1,2,25500);

