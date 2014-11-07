//--------------------------------------------------------
// jQuery skin5 用
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

		// shelf ( 1～6件目 )
		if(ad_count <= 6){
			
			if(ad_count % 3 == 1){
				html = html + '\
				<div class="shelf_row">\
					<div class="shelf_box clearfix">\
				';
			}

			// html
			html = html + '\
						<section>\
							<a href="' + href_method + '" onClick="' + onclick_method + '">\
								<h1 class="app_name">' + ad['title'] + '</h1>\
								<div class="app_img"><img  class="app_icon" src="/images/webview/ad_apps/1x1.png" data-original="' + ad['icon_url'] + '"></div>\
							</a>\
						</section>\
			';

			if(ad_count % 3 == 0){
				html = html + '\
					</div>\
					<div class="shelf_end"><img src="/images/webview/ad_apps/shelf.png"></div>\
				</div>\
				';
			}
			append_array[0].html = append_array[0].html + html;
		}
		// list ( 7件目～ )
		else{
			html = html + '\
			<section class="' + mark_image + '">\
				<a href="' + href_method + '" onClick="' + onclick_method + '">\
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
					<span class="sticky"><img src="/images/webview/ad_apps/bg_sticky_btm.png"></span>\
				</a>\
			</section>\
			';
			append_array[1].html = append_array[1].html + html;
		}
		
	};
	// skin5 用 ( 一回の表示の最後 )
	$.setAdEndColHtml = function(ad_count, append_array){
		var html = '';
		// 余りがあればダミーで埋める
		if(ad_count <= 6 && ad_count % 3 != 0){
			var dummy_count = (3 - (ad_count % 3));
			for(var i=0; i<dummy_count; i++){
				html = html + '\
							<section>\
								<a href="javascript:void(0)" onClick="javascript:void(0)">\
									<h1 class="app_name"></h1>\
									<div class="app_img"><img  class="app_icon" src="/images/webview/ad_apps/1x1.png"></div>\
								</a>\
							</section>\
						';
			}
			html = html + '\
						</div>\
						<div class="shelf_end"><img src="/images/webview/ad_apps/shelf.png"></div>\
					</div>\
					';
		}
		append_array[0].html = append_array[0].html + html;

		// 6個以下なら list 部分を消す
		if(ad_count <= 6){
			$("article.list").hide();
		}
	};
});
