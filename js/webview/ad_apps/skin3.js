//--------------------------------------------------------
// jQuery skin3 用
//--------------------------------------------------------
$(function(){
	$.setAdColHtml = function(platform, ad, ad_count, append_array){
		var html            = "";
		var onclick_method  = $.getAdOnClickMethod(platform, ad);
		var href_method     = $.getAdHrefMethod(platform, ad);
		var mark_image      = "";

		// ad
		if(ad['site_url']){
			href            = ad['site_url'];
		}

		// New!
		if(ad['new_flag'] == '1'){
			mark_image = 'new';
		}
		// osusume!
		else if(ad['disp_rec_flag'] == '1'){
			mark_image = 'rec';
		}

		var icon_url      = 'http://android.giveapp.jp/images/banner/web_view_icon_top/';
		if(platform == 1){
			icon_url = icon_url + "ios/";
		}

		// html
		html = html + '\
				<a href="' + href_method + '" onClick="' + onclick_method + '">\
					<section class="animated">\
						<span class="' + mark_image + '"></span>\
						<span class="app_icon" style="background:url(' + icon_url + ad['package'] + '.png) 0 0 no-repeat"></span>\
						<div class="box">\
							<h1 class="app_name">' + ad['title'] + '</h1>\
							<div class="app_info">' + ad['description'] + '</div>\
						</div>\
					</section>\
				</a>\
		';
		append_array[0].html = append_array[0].html + html;
	};
});
