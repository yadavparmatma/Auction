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
					id: 1,
					name: 'bat',
					date: '2015-02-23'
				}])
				done();
			});
		});
	});

});