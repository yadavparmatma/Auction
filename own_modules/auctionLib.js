var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");


var _getTopicsNameAndDate = function(db,onComplete) {
	var get_topics_query = 'select id,name,date from items;';
	db.all(get_topics_query,onComplete);
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
		getTopicsNameAndDate : operate(_getTopicsNameAndDate)
	};
	return records;
};

exports.init = init;