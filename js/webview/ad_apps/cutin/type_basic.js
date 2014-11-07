//--------------------------------------------------------
// カットイン広告表示 ( BASIC )
//--------------------------------------------------------
$(function(){
	$.setCutinHtml = function(platform, ad)
	{
		if(ad.length <= 0){
			// 広告無いっす
		}
		else{
			var onclick_method  = $.getAdOnClickMethod(platform, ad);
			var href_method     = $.getAdHrefMethod(platform, ad);

			$("#ad_area #basic a").attr("href", href_method);
			$("#ad_area #basic a").attr("onclick", onclick_method);
			$("#ad_area #basic img").attr("src", ad['icon_url']);
			$("#ad_area #basic .app_name").html(ad['title']);
			$("#ad_area #basic .app_text").html(ad['description']);
		}
	};
});
