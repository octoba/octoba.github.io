//--------------------------------------------------------
// カットイン広告表示 ( MANGA )
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

			$("#ad_area #manga a").attr("href", href_method);
			$("#ad_area #manga a").attr("onclick", onclick_method);
			$("#ad_area #manga img").attr("img", ad['icon_url']);
			$("#ad_area #manga .app_name").html(ad['title']);
			$("#ad_area #manga .app_text").html(ad['description']);
		}
	};
});
