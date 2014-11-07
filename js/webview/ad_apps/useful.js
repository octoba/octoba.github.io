//--------------------------------------------------------
// shuffle array
//--------------------------------------------------------
Array.prototype.shuffle = function(){
	var buff    = this;
	var max_ary = buff.length;
	var tmp1, tmp2, rand;
	for (i=0 ; i<max_ary; i++){
		rand        = Math.floor(Math.random() * buff.length);
		tmp1        = buff[i];
		tmp2        = buff[rand];
		buff[i]     = tmp2;
		buff[rand]  = tmp1;
	}
	return buff;
}
