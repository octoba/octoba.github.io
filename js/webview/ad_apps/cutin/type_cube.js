//--------------------------------------------------------
// カットイン広告表示 ( CUBE )
//--------------------------------------------------------
$(function(){
	$.setCutinHtml = function(platform, ad)
	{
		if(ad.length <= 0){
			// 広告無いっす
		}
		else{
			var count = 0;
			for(i=0; i<ad.length; i++){
				if(i >= 9){
					break;
				}
				var onclick_method  = $.getAdOnClickMethod(platform, ad[i]);
				var href_method     = $.getAdHrefMethod(platform, ad[i]);

				$("#ad_area #cube .ad" + (i + 1)).attr("href", href_method);
				$("#ad_area #cube .ad" + (i + 1)).attr("onclick", onclick_method);
				$("#ad_area #cube .ad" + (i + 1) + " img").attr("src", ad[i]['icon_url']);
			}
		}
	};
});
