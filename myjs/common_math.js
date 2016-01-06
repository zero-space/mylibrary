/*
产生一个指定数值的随机数(min-max)  
列入(4~6)
 */
function randomBetween(min,max){
	return min+Math.floor(Math.random()*(max-min+1));
}