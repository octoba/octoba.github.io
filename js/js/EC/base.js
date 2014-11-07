$(document).ready(function(){
    
    var idAry = new Array(1,2);
    
    $('.trigger').click(function() {
    	var id_str = $(this).attr("id");
    	var id = id_str.slice(14,id_str.length);
    	
    	for(var i in idAry){
    		if(idAry[i] == id){
    			var display = $(".accordion_body"+id).css("display");
    			
    			if(display == "block"){
    				$(".accordion_body"+id).animate({height:'hide'},"slow");
					$("#accordion_head"+id+" img").attr("src","/images/EC/btn_open.png");
    			}else{
    				$(".accordion_body"+id).animate({height:'show'},"slow");
					$("#accordion_head"+id+" img").attr("src","/images/EC/btn_close.png");
    			}
    			
//    			$("#accordion_head"+id+" img").attr("src","./images/btn_close.png");
    		}else{
    			$(".accordion_body"+idAry[i]).animate({height:'hide'},"slow");
    			$("#accordion_head"+idAry[i]+" img").attr("src","/images/EC/btn_open.png");
    		}
    	}
    });
    
});