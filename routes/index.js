var auction = require("../own_modules/auctionLib.js").init("data/auction.db");
var bcrypt = require("bcryptjs");
var _ = require('lodash');

var express = require('express');
var router = express.Router();


var loadUserFromSession = function(req,res,next){
	req.session.user_name && auction.getSingleUser(req.session.user_name, function(err, user){
		if(user){
			var userInfo = {
				user_name: user.user_name
			};
			req.user = userInfo;
			res.locals.user = userInfo;
		}else{
			delete req.session.user_name;
		}
	});
	next();		
};

var requireLogin = function(req,res,next){
	req.session.user_name? next(): res.redirect('/adminLogin');
};

var requireLoginForUser = function(req,res,next){
	req.session.userEmail? next(): res.redirect('/userLogin');
};

router.use(loadUserFromSession);

router.get('/', function(req, res) {
	auction.getTopicsNameAndDate(function(err, topics){
  		res.render('index', {
  		  topics: topics
  		}); 
  	});
});

router.get('/adminLogin',function(req,res){
	res.render('adminLogin');
});

router.get('/userLogin',function(req,res){
	res.render('userLogin');
});

router.get('/userLogout',function(req,res){
	req.session.destroy();
	res.redirect('/userLogin');
});

router.post('/userLogin',function(req,res){
	var userInfo = req.body;
	var callback = function(error,data){
		if(((data===undefined) || error || 
			(!bcrypt.compareSync(userInfo.password,data.password)))){
		 	res.render('userLogin', {error:"Invalid Username or Password.."});
		};
		if(!error && (data!==undefined) && 
			bcrypt.compareSync(userInfo.password,data.password)){
			req.session.userEmail = userInfo.email_id;
			req.session.user_id = data.id;
			req.session.name = data.name;
  			res.redirect('/userDashboard');
		};
	};

	auction.getUserPassword(userInfo.email_id,callback);
});

router.get('/userRegistration',function(req,res){
	res.render('userRegistration');
});


router.post('/userRegistration',function(req,res){
	var userInfo = req.body;
	userInfo.password = bcrypt.hashSync(userInfo.password);
	var callback = function(error){
		error && res.render('/', {error:"User already present.."});
		!error && res.redirect('/userLogin');
	};
	auction.insertUsers(userInfo,callback);
});

router.get('/adminDashboard',requireLogin,function(req,res){
	auction.getUpcomingAuction(function(err,upcomingAuction){
		res.render('adminDashboard',{
			upcomingAuction : upcomingAuction
		});
	})
});

router.get('/auction/:itemId',requireLoginForUser,function(req,res){
	res.render('auction');
});

router.get('/adminLogout',function(req,res){
	req.session.destroy();
	res.redirect('/adminLogin');
});

router.post('/adminLogin',function(req,res){
	var userInfo = req.body;
	var callback = function(error,data){
		if(((data===undefined) || error || (userInfo.password!=data.password))){
		 		res.render('adminLogin', {error:"Invalid Username or Password.."});
		};
		if(!error && (data!==undefined) && (userInfo.password==data.password)){
			req.session.user_name = data.user_name;
  			res.redirect('adminDashboard');
		};
	};

	auction.getPassword(userInfo.user_name,callback);
});

router.get('/itemDescription/:id', function(req, res) {
	auction.getItemsAllDetail(req.params.id,function(err, allDetail){
  		res.render('itemDescription', {allDetail: allDetail}); 
  	});
});

router.get('/addItems',function(req,res){
	res.render("addItems");
});

router.post("/addItems",function(req,res){
	var newItem  = req.body;
	auction.insertItem(newItem,function(err){
		if(!err){
			res.redirect("/adminDashboard");
		}
	});
});

router.get("/registerAuction/:itemId",function(req,res){
	res.render("registerAuction");
});


router.get("/addToAuction/:itemId",function(req,res){
	res.render("addToAuction");
})

router.post("/addToAuction/:itemId",function(req,res){
	var detail = req.body;		
	auction.getUserPassword(detail.email,function(err,status){
		if(((status==undefined) || err || (!bcrypt.compareSync(detail.password,status.password)))){
		 	res.json({message:"Invalid User Id or Password"});
		}
		else{ 
			auction.addAuctionId(detail,function(er){
				if(!er)
					res.json({message:"You are Reegistered SuccessFully"});
			})
		}
	});
});


router.get('/userDashboard',requireLoginForUser,function(req,res){
	var items = {};
	var id = req.session.user_id;
	items.userName = req.session.name;
	auction.getTopicsNameAndDate(function(err, topics){
  		items.topics = topics;
  	});

	auction.getJoinedAuctions(id,function(err,joinedAuctionsDetails){
		items.itemsDetails = joinedAuctionsDetails;
		res.render('userDashboard',items);
	})	
})


router.get("/startAuction/:itemId",function(req,res){
	auction.updateStatus(req.params.itemId,function(error){
		auction.getItemsAllDetail(req.params.itemId,function(err, itemDetail){
  			res.render('startAuction', {itemDetail: itemDetail}); 
		})
  	});
});

module.exports = router;
