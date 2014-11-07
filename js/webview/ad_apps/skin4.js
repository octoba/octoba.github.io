//--------------------------------------------------------
// jQuery skin4 用
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
									<div class="app_img"><img class="app_icon" src="/images/webview/ad_apps/1x1.png" data-original="' + ad['icon_url'] + '"></div>\
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
	};
	// skin4 用 ( 一回の表示の最後 )
	$.setAdEndColHtml = function(ad_count, append_array){
		var html = '';
		// 余りがあればダミーで埋める
		if(ad_count % 3 != 0){
			var dummy_count = (3 - (ad_count % 3));
			for(var i=0; i<dummy_count; i++){
				html = html + '\
							<section>\
								<a href="javascript:void(0)" onClick="javascript:void(0)">\
									<h1 class="app_name">　</h1>\
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
	};
});
