var location = process.argv[2];
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(location);
var runAllQueries = function(){	
	var runQuery = function(q){
		console.log(q);
		db.run(q,function(err){
			if(err){
				console.log(err);
				process.exit(1);
			}
		});
	};

	[	"create table admin(user_name text, password text)",
		"create table users(id integer primary key autoincrement, name text,email_id text, password text, items_id number,foreign key(items_id) references items(id));",
		"create table items(id integer primary key autoincrement, name text,description text, date Date ,base_price number,status text,sold_price number);",
		"create table running_auction(items_id number , bidder_id number ,bid_price number, foreign key(items_id)references items(id) ,foreign key(bidder_id) references users(id));"
	].forEach(runQuery)	;
};
db.serialize(runAllQueries);
