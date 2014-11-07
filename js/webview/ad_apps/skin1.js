//--------------------------------------------------------
// jQuery skin1 用
//--------------------------------------------------------
$(function(){
	$.setAdColHtml = function(platform, ad, ad_count, append_array){
		var html            = "";
		var onclick_method  = $.getAdOnClickMethod(platform, ad);
		var href_method     = $.getAdHrefMethod(platform, ad);
		var mark_image      = "";

		// New!
		if(ad['new_flag'] == '1'){
			mark_image = '  <img src="/images/webview/ad_apps/new.png" class="new_mark" />';
		}
		// osusume!
		else if(ad['disp_rec_flag'] == '1'){
			mark_image = '  <img src="/images/webview/ad_apps/itioshi.png" class="new_mark" />';
		}

		// html
		html = html + '\
					<div class="l_app_w cf">\
						<a href="' + href_method + '" onClick="' + onclick_method + '" class="cf">\
							<div class="left_area">\
								<img src="/images/webview/ad_apps/1x1.png" data-original="' + ad['icon_url'] + '" class="app_icon" />\
							</div>\
							<div class="right_area">\
								<div class="app_name">' + ad['title'] + '</div>\
								<div class="app_text">' + ad['description'] + '</div>\
								<img src="/images/webview/ad_apps/vectol.png" class="bg_vectol"/>\
							</div>\
							' + mark_image + '\
						</a>\
					</div>\
		';
		append_array[0].html = append_array[0].html + html;
	};
});
