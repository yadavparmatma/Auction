var auction = require("../own_modules/auctionLib.js").init("data/auction.db");


var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });


router.get('/adminDashboard', function(req, res) {
  res.render('adminDashboard');
});

module.exports = router;
