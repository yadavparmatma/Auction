var getItemId = function(){
	var location = window.location.href.split('/');
	var id = location[location.length-1];
	return id.split('?')[0];
}
var showMessage = function(data){
	alert(data);
	$("#message").html(data);
}

var onPageLoad  = function(){
	$("#register").click(function(){
		var itemId = getItemId();
		var email= $("#email").val();
		var password = $("#password").val();
		$.ajax({url:"/addToAuction/:"+itemId,type:"POST", dataType: "json",data:{email:email,password:password,itemId:itemId}})
	});
};

$(onPageLoad)