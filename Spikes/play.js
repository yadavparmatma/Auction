var current_time = new Date();
var hour = current_time.getHours();
var minute = current_time.getMinutes();
if(hour<10){hour='0'+hour} if(minute<10){minute='0'+minute}
var my_time = hour+':'+minute;
console.log(my_time);


// Date.parse('25/09/2013 13:31') > Date.parse('25/09/2013 9:15')
var hiii =  Date.parse('25/09/2013 13:31');
console.log("jooo",hiii);