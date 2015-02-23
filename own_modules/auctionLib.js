var sqlite3 = require("sqlite3").verbose();

var _insertItem = function(newItem,db,onComplete){
	var insertQry = "insert into items (name,description,date,base_price,status)values('"+newItem.name+"','"+
		newItem.desc+"','"+newItem.date+"',"+newItem.basePrice+",'"+newItem.status+"');";
	db.run(insertQry,onComplete);

}


var init = function(location){	
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2)?arguments[1]:arguments[0];
			var arg = (arguments.length == 2) && arguments[0];

			var onDBOpen = function(err){
				if(err){onComplete(err);return;}
				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};
			var db = new sqlite3.Database(location,onDBOpen);
		};	
	};

	var records = {
		insertItem : operate(_insertItem)
	};
	return records;
};

exports.init = init;