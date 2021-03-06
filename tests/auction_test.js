var lib = require('../own_modules/auctionLib');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/auction.db.backup');

var auction;
describe('auction', function() {
	beforeEach(function() {
		fs.writeFileSync('tests/data/auction.db', dbFileData);
		auction = lib.init('tests/data/auction.db');
	});

	describe('#getTopicsNameAndDate', function() {
		it('retrieves itemName and date of all items', function(done) {
			auction.getTopicsNameAndDate(function(err, itemName) {
				assert.notOk(err);
				assert.deepEqual(itemName, [{
					id: 2,
					name: 'ball',
					date: '2015-03-14',
					status: 'open'
				}, {
					id: 1,
					name: 'bat',
					date: '2015-02-23',
					status: 'open'
				}])
				done();
			});
		});
	});
	describe('#getItemsAllDetail', function() {
		it('retrieves all detail of the given id is 1', function(done) {
			var expected = {
					id : 1,
					name: 'bat',
					description:"it is viratkholi bat ",
					date: '2015-02-23',
					base_price:25000,
					start_Time :"Tue Feb 24 2015 11:03:31",
					status:'open',
					sold_price:null
				}
			auction.getItemsAllDetail(1,function(err, itemName) {
				assert.notOk(err);
				assert.deepEqual(itemName,expected )
				done();
			});
		});
	});
	describe('#insertItems', function() {
		it('insert all detail of insertItem', function(done) {
			var itemDetail = {
					name: 'bat',
					description:"it is viratkholi bat",
					date: '2015-02-23',
					base_price:25000,
					start_Time :"Tue Feb 24 2015 11:03:31",
					status:'open',
					sold_price:null
				}
			auction.insertItem(itemDetail,function(err){
				assert.notOk(err);
			auction.getItemsAllDetail(1,function(err, itemName) {
				assert.deepEqual(itemName.name,"bat")
				assert.deepEqual(itemName.status,"open")
				assert.deepEqual(itemName.description,"it is viratkholi bat ")
				done();
			});
			});
		});
	});
	describe('#getUpcomingAuction', function() {
		xit('retrieves all UpcomingAuction for upcoming date', function(done) {
			var expected = [{
					id : 2,
					name: 'ball',
					description:"very hard",
					date: '2015-03-14',
					base_price:600,
					start_Time :"Tue Feb 24 2015 11:08:31",
					status:'open',
					sold_price:null
				}]
			auction.getUpcomingAuction(function(err, itemsList) {
				assert.notOk(err);
				assert.deepEqual(itemsList,expected )
				done();
			});
		});
	});

});
