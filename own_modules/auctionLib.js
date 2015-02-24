var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");


var _getTopicsNameAndDate = function(db,onComplete) {
	var get_topics_query = 'select id,name,date,status from items order by start_Time desc;';
	db.all(get_topics_query,onComplete);
}


var _getItemsAllDetail = function(itemId,db,onComplete){
	var query = "select * from items where id="+itemId;
	db.get(query,function(err,allDetails){
		err || onComplete(null,allDetails);
	});
}

var insertQueryMaker = function (tableName, data, fields) {
	var columns = fields && ' (' + fields.join(', ') + ')' || '';
	var values = '"' + data.join('", "') + '"';
	var query = 'insert into ' + tableName + columns + ' values(' + values + ');';
	return query;
};

var selectQueryMaker = function (tableName, retrivalData, where) {
	retrivalData = retrivalData || ['*'];
	var whatToGet = retrivalData.join(', ');
	var whereToGet = where && retrieveWhereToGet(where) || '';

	var query = 'select ' + whatToGet + ' from ' + tableName + whereToGet + ';';
	return query;
};

var insertInto = function (db, fields, data, tableName, onComplete) {
	var query = insertQueryMaker(tableName, data, fields);
	console.log(query);
	db.run(query, onComplete);
};


var select = function (db, onComplete, tableName, retriveMethod, retrivalData, where) {
	var query = selectQueryMaker(tableName, retrivalData, where);
	db[retriveMethod](query, onComplete);
};

var retrieveWhereToGet = function (resource) {
	var whereToGet = Object.keys(resource).map(function (key) {
		return key + ' = "' + resource[key] + '"';
	}).join(' and ');

	return ' where ' + whereToGet;
};

var _getSingleUser = function(user_name,db,onComplete){
	var whereToGet = {user_name: user_name};
	select(db, onComplete, 'admin', 'get', null, whereToGet);
};

var _getPassword = function (user_name, db, onComplete) {
	var whereToGet = {user_name: user_name};
	select(db, onComplete, 'admin', 'get', ['user_name','password'], whereToGet);
};

var _getUserPassword = function (email_id, db, onComplete) {
	var whereToGet = {email_Id: email_id};
	select(db, onComplete, 'users', 'get', ['password', 'id', 'name'], whereToGet);
};

var _insertItem = function(newItem,db,onComplete){
	var insertQry = "insert into items (name,description,date,base_price,status,start_Time)values('"+newItem.name+"','"+
		newItem.desc+"','"+newItem.date+"','"+newItem.basePrice+"','"+newItem.status+"','"+newItem.start_Time+"');";
	db.run(insertQry,onComplete);

}

var _insertUsers = function (userData, db, onComplete) {
	var fields = ['name', 'email_id', 'password'];
	var data = [userData.name, userData.email_id, userData.password];

	insertInto(db, fields, data, 'users', onComplete);
};

var compareTime = function(oldDate){
	var newDate = new Date();
	return Date.parse(oldDate) > Date.parse(newDate);
}

var _getUpcomingAuction = function(db,onComplete){
	db.all('select * from items',function(err,itemsList){
		var newItemList = itemsList.filter(function(itemList){
			compareTime(itemList.date)
				return itemList;
		})
		onComplete(null,newItemList);
	})
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
		getTopicsNameAndDate : operate(_getTopicsNameAndDate),
		getItemsAllDetail : operate(_getItemsAllDetail),
		insertItem : operate(_insertItem),
		getPassword:operate(_getPassword),
		getSingleUser:operate(_getSingleUser),
		insertUsers:operate(_insertUsers),
		getUserPassword:operate(_getUserPassword),
		getUpcomingAuction : operate(_getUpcomingAuction)
	};
	return records;
};

exports.init = init;

exports.queryParser = {
	selectQueryMaker: selectQueryMaker,
	insertQueryMaker: insertQueryMaker
};


exports.queryHandler = {
	select: select,
	insertInto: insertInto
};
