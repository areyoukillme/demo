const  sum = function(value){
	value = value.substring(7);
	return value;
}
// 过滤前7位;

const time = function(value){
	var time = new Date(value);
	var times = time.getFullYear() + '-' 
	+ (time.getMonth() + 1) + '-' 
	+ time.getDate() + ' ' 
	+ time.getHours() + ':' 
	+ time.getMinutes() + ':' 
	+ time.getSeconds();
	return times
}
// 过滤时间

const hash = function(value){
	value = "0010000" + value;
	return value;
}
// 添加编号 0010000


export default {
	sum,
	time,
	hash,
}