var getItemId = function(){
	var location = window.location.href.split('/');
	var id = location[location.length-1];
	return id.split('?')[0];
}
var showMessage = function(data){
	alert(data);
	$("#message").html(data);
}


var afterClicking = function(text){
	window.location.reload();
}

var updateItemStatus = function(){
	var itemId = $("#itemId").val();
	$.ajax({url:"/changeStatus/"+itemId,type:"POST"}).done(afterClicking);
}

var insertPrice = function(){
	var socket = io.connect(window.location.hostname);

	socket.on('new_bidPrice',function(bidPrice){
	 	$("#price").html("<b>Cureent Price:  "+bidPrice.bidPrice+"    Rs.");
	 	$("#bidPrice").val(""); 		
	});

	var itemId = getItemId();
	var user_id = $("#user_id").val();
	var price = $("#bidPrice").val();
	$.ajax({url:"/auction/:"+itemId,type:"POST", dataType: "json",
		data:{itemId:itemId,user_id:user_id,price:price}
	});
}

var onPageLoad  = function(){
	$("#register").click(function(){
		var itemId = getItemId();
		var email= $("#email").val();
		var password = $("#password").val();
		var request = $.ajax({url:"/addToAuction/:"+itemId,type:"POST", dataType: "json",
			data:{email:email,password:password,itemId:itemId}
		});
		request.success(function(message){
			alert(message.message);
			return false;
		})
		request.error(function(message){
			alert(message.message);
			return false;
		})
	});
	$("#running").click(updateItemStatus);
	$("#putPrice").click(insertPrice);
};

$(onPageLoad)