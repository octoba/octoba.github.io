//--------------------------------------------------------
// 上部バナー (最大5件)
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

		var banner_url      = 'http://android.giveapp.jp/images/banner/web_view/';
		if(platform == 1){
			banner_url = banner_url + "ios/";
		}
	
		// 1件以上あればランダム取得
		if(bnr_ary.length > 0){
			var bnr_shuffle = bnr_ary.shuffle();
			var bnr_max     = bnr_shuffle.length;
			for(var i=0; i<bnr_max; i++){
				if(i >= 5){
					break;
				}
				var ad = ad_buff[bnr_shuffle[i]];
				var onclick_method  = $.getAdOnClickMethod(platform, ad);
				var href_method     = $.getAdHrefMethod(platform, ad);
				var view_buff = '<li><a href="' + href_method + '" onclick="' + onclick_method + '"><img src="' + banner_url + ad["package"] + '.gif"></a></li>';
				$("ul.slides").append(view_buff);
			}
		}
		// なければデフォルトバナー
		else{
			var view_buff = '<li><a href="javascript:void(0)"><img src="' + banner_url + def_bnr["package"] + '.gif"></a></li>';
			$("ul.slides").append(view_buff);
		}
	};
});
