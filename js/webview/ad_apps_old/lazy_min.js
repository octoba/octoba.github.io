function ImageLazy(e){
	var count=0;
	var bottom=(window.scrollY||document.documentElement.scrollTop)+(window.innerHeight||document.documentElement.clientHeight);
	var elements=document.getElementsByTagName('img');
	for(var i=0;i<elements.length;i++){
		if(elements[i].getAttribute('data-lazy')){
			var offset=0;
			var test=elements[i];
			while(test.offsetParent){
				offset+=test.offsetTop;
				test=test.offsetParent;
			}
			offset+=test.offsetTop;
			if(offset<bottom){
				elements[i].src=elements[i].getAttribute('data-lazy');
				elements[i].removeAttribute('data-lazy');
			}else{
				count++;
			}
		}
	}
	if(!count && e && e.type=='scroll'){
		if(window.addEventListener){
			window.removeEventListener('scroll',ImageLazy,false);
		}else{
			window.detachEvent('onscroll',ImageLazy);
		}
	}
	if(count && (!e||e.type=='load')){
		if(window.addEventListener){
			window.addEventListener('scroll',ImageLazy,false);
		}else{
			window.attachEvent('onscroll',ImageLazy);
		}
	}
}