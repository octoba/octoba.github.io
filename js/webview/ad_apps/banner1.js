//--------------------------------------------------------
// 上部バナー (1件)
//--------------------------------------------------------
$(function(){
	$.setBannerData = function(platform, def_bnr, ad_buff, sdk_flag, not_install_apps)
	{
		var bnr_ary = new Array();
		// バナーフラグのデータを取得
		for(var i=0; i<ad_buff.length; i++){
			var package = ad_buff[i]['package'];
			if(platform == 1){
				package = ad_buff[i]['bid'];
			}
			if((!sdk_flag) || (sdk_flag && not_install_apps[package])){
				if(ad_buff[i]["web_bn_flg"] == "1"){
					bnr_ary.push(i);
				}
			}
		}
	
		var view_data;
		if(bnr_ary.length > 0){
			// 1件以上あればランダム取得
			view_data   = ad_buff[bnr_ary[Math.floor(Math.random() * bnr_ary.length)]];
		}
		else{
			// なければデフォルトバナー
			view_data   = def_bnr;
		}

		var onclick_method  = $.getAdOnClickMethod(platform, view_data);
		var href_method     = $.getAdHrefMethod(platform, view_data);
		var banner_url      = 'http://android.giveapp.jp/images/banner/web_view/';
		if(platform == 1){
			banner_url = banner_url + "ios/";
		}
	
		var view_buff = '\
		<div class="two_column">\
			<div id="slider1">\
				<a style="width:100%;" href="' + href_method + '" onClick="' + onclick_method + '">\
					<img src="' + banner_url + view_data['package']+'.gif" width="100%">\
				</a>\
				<div class="top_detail">\
					<a href="' + href_method + '" onclick="' + onclick_method + '">\
						<div class="top_left_area">\
							<img src="'+view_data['icon_url']+'" data-original="'+view_data['icon_url']+'" class="app_icon" style="display: inline-block;">\
						</div>\
						<div class="top_right_area">\
							<div class="top_app_name">'+view_data['title']+'</div>\
							<div class="top_app_text">'+view_data['description']+'</div>\
							<img src="/images/webview/ad_apps/top_dl_y.png" class="top_dl_btn" />\
						</div>\
						<div class="clear"></div>\
					</a>\
					<div class="clear"></div>\
				</div>\
			</div>\
			<div id="space_line"></div>\
		';
		$("#banner_area").html(view_buff);
		$("#banner_area_end").html("</div>");
	};
});
