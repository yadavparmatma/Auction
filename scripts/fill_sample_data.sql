pragma foreign_keys = 'ON';
insert into admin(user_name, password)
	values ("admin", "admin");
insert into items(id , name ,description , date ,base_price ,status ) values(1,"bat","it is viratkholi's bat ","2015-02-23 ",25000,"open");
insert into items(id , name ,description , date ,base_price ,status ) values(2,"book","apj abul kalam's book ","2015-02-30 ",2500,"open");
insert into users(id , name,email_id , password , items_id)values(1,"vijay","vijay@email.com","1234","[]"); 
insert into users(id , name,email_id , password , items_id)values(2,"parmatma","param@email.com","1234","[1,2]");
insert into running_auction(items_id , bidder_id ,bid_price ) values(1,2,25500);



