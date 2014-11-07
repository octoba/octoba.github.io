//--------------------------------------------------------
// jQuery skin2 用
//--------------------------------------------------------
$(function(){
	$.setAdColHtml = function(platform, ad, ad_count, append_array){
		var html            = "";
		var onclick_method  = $.getAdOnClickMethod(platform, ad);
		var href_method     = $.getAdHrefMethod(platform, ad);
		var mark_image      = "";

		// New!
		if(ad['new_flag'] == '1'){
			mark_image = 'new';
		}
		// osusume!
		else if(ad['disp_rec_flag'] == '1'){
			mark_image = 'rec';
		}

		// html
		html = html + '\
			<a href="' + href_method + '" onClick="' + onclick_method + '">\
				<section class="' + mark_image + '">\
					<div class="rate"><div class="rate_in r' + ad['custom_rating'] + '"><img src="/images/webview/ad_apps/rate_bg.png"></div></div>\
					<div class="box">\
						<div class="wrap clearfix">\
							<div class="left_col">\
								<div class="app_info">\
									<h1>' + ad['title'] + '</h1>\
									<p>' + ad['description'] + '</p>\
								</div><!-- /app_info -->\
							</div><!-- /left_col -->\
							<div class="right_col animated bounceInRight">\
								<img src="/images/webview/ad_apps/1x1.png" data-original="' + ad['icon_url'] + '" class="app_icon animated">\
								<span class="price"><img src="/images/webview/ad_apps/price_free.png"></span>\
							</div><!-- /right_col -->\
						</div><!-- /wrap -->\
						<div class="meta meta category_' + ad['category'] + ' attr_' + ad['attr'] + '"><img src="/images/webview/ad_apps/meta_bg.png"></div><!-- /meta -->\
					</div><!-- /box -->\
					<span class="sticky">\
						<img src="/images/webview/ad_apps/bg_sticky_btm.png">\
					</span><!-- /sticky -->\
				</section>\
			</a>\
		';
		append_array[0].html = append_array[0].html + html;
	};
});
