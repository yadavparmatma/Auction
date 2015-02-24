var current_time = new Date();
var hour = current_time.getHours();
var minute = current_time.getMinutes();
if(hour<10){hour='0'+hour} if(minute<10){minute='0'+minute}
var my_time = hour+':'+minute;
console.log(my_time);


var hiii =  Date.parse('2014-12-15');
console.log("jooo",hiii);
var date  = new Date();
var st = Date.parse(date);
console.log("jooo",st);
console.log(Date.parse(hiii) > Date.parse(st));
