//--------------------------------------------------------
// ad_apps js
//--------------------------------------------------------
var move_count              = 0;
var g_ad_pos                = 0;
var g_ad_col_count          = 0;
var g_not_install_apps      = {};
var g_sdk_flag              = 0;
var g_pager_num             = 15;
var g_stop_bottom           = 0;

//--------------------------------------------------------
// InstallCheck CallBack
//--------------------------------------------------------
function getNotInstallAppsCallBack(ad_list)
{
	for(var i = 0; i < ad_list.length; i++){
		g_not_install_apps[ad_list[i]] = 1;
	}
	g_sdk_flag    = true;
	$.load_ad();
}

//--------------------------------------------------------
// jQuery
//--------------------------------------------------------
$(function(){

	//--------------------------------------------------------
	// 向きが変わるごとに強制リロード
	//--------------------------------------------------------
	$(window).on("orientationchange",function(){
		location.reload();
	});

	//--------------------------------------------------------
	// インストールされていないアプリのパッケージを取得
	//--------------------------------------------------------
	$.getNotInstallApps = function(g_platform, json_data, result_apps)
	{
		var view_app    = "";
		try{
			if(g_platform == 0){
				view_app    = SDK.editNotInstallApps(json_data);
			}
			else{
				calliOSNativeMehtod('get', 'ad_list', json_data);
				return true;
			}
		}
		catch(e){
			return false;
		}
		if(view_app){
			if(view_app == "[]"){
				return true;
			}
			var appJSON = $.parseJSON(view_app);
			$.each(appJSON, function(){
				result_apps[this.pkg_name] = 1;
			});
			return true;
		}
		else{
			return false;
		}
		return false;
	};
	
	//--------------------------------------------------------
	// 広告読み込み
	//--------------------------------------------------------
	$.load_ad = function()
	{
		// append するオブジェクトリスト
		var append_array = [
			{object : $("#bottomLoad"), html:""},
			{object : $("#bottomLoad2"), html:""}
		];
		var ad_count = 0;
		for(var i=g_ad_pos; i<g_ad_buff.length; i++){
			if(ad_count >= g_pager_num){
				ad_count = 0;
				break;
			}
			g_ad_pos++;

			var package = g_ad_buff[i]['package'];
			if(g_platform == 1){
				package = g_ad_buff[i]['bid'];
			}
			if((!g_sdk_flag) || (g_sdk_flag && g_not_install_apps[package])){
				g_ad_col_count++;
				ad_count++;
				$.setAdColHtml(g_platform, g_ad_buff[i], g_ad_col_count, append_array);
			} 
		}
		
		// 全て表示でスクロールイベントを停止
		if(g_ad_pos >= g_ad_buff.length){
			$(window).unbind('scroll');
			$(window).unbind('bottom');
			$(window).off('bottom');
			g_stop_bottom = 1;
			//alert("Stop Scroll Event");
		}

		// append
		$.each(append_array, function(key, val){
			if(typeof val.object[0] !== "undefined"){
				$(val.object).append(val.html);
			}
		});
		
		$("img.app_icon").lazyload({effect:"fadeIn",effectspeed:150});

		if(move_count == 0){
			move_count = 1;
		}
		$('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 'fast');
	}

	//--------------------------------------------------------
	// onclick 用のメソッド html を取得
	//--------------------------------------------------------
	$.getAdOnClickMethod = function(g_platform, ad)
	{
		var result = "";
		if(ad['package'] && !ad['site_url']){
			// android
			if(g_platform == "0"){
				// package, redirect_url を渡す
                // 下記パッケージ名の場合、独自パラメータを付与してリダイレクト
                if(ad['package'] == "com.king.candycrushsaga"){
                    result  = "$.addParamRedirect('"+ad['package']+"', '"+ad['redirect_url']+"');";
                }else{
				    result  = "SDK.clickAd('"+ad['package']+"', '"+ad['redirect_url']+"');";
                }
            }
			// ios
			else{
				result  = ""; 
			}
		}
		return result;
	};


    //--------------------------------------------------------
    // 広告によって独自パラメータを付与
    // edit ogawa 2013/11/15
    //--------------------------------------------------------
    $.addParamRedirect = function(package,redirect_url)
    {
        random_str = randobet(20);
        redirect_url = redirect_url + "&st6="+random_str;
        SDK.clickAd(package, redirect_url);
    }

    //--------------------------------------------------------
    // ランダム文字列生成
    // edit ogawa 2013/11/15
    //--------------------------------------------------------
    var randobet = function(n) {
        var a = 'abcdefghijklmnopqrstuvwxyz0123456789';
        a = a.split('');
        var s = '';
        for (var i = 0; i < n; i++) {
            s += a[Math.floor(Math.random() * a.length)];
        }
        return s;
    };

	//--------------------------------------------------------
	// href 用のメソッド html を取得
	//--------------------------------------------------------
	$.getAdHrefMethod = function(platform, ad)
	{
		var href = "javascript:void(0)";
		if(typeof ad["site_url"] !== "undefined" && ad["site_url"]){
			href = ad['site_url'];
		}
		// ios
		else if(platform == "1"){
			href = "http://click?";
			if(ad["redirect_url"] != ""){
				href = href + "redirect=" + ad["redirect_url"] + "&";
			}
			href = href + "ad_apps_id=" + ad["ad_apps_id"] + "&";
			href = href + "app_id=" + ad["package"] + "&";
			href = href + "url_scheme=" + ad["url_scheme"];
		}
		return href;
	}

	//--------------------------------------------------------
	// 初期表示
	//--------------------------------------------------------
	// インストールチェック
	// android
	if(g_platform == 0){
		g_sdk_flag    = $.getNotInstallApps(g_platform, g_ad_json, g_not_install_apps);
		$.load_ad();
	}
	// ios
	else{
		$.getNotInstallApps(g_platform, g_ad_json, g_not_install_apps);
	}

	$(window).bottom({proximity: 0.05});
	$(window).on('bottom', function() {
		if(g_stop_bottom == 1){
			return;
		}
		var obj = $(window);
		if (!obj.data('loading')) {
			obj.data('loading', true);
			$('#bottomLoading').css({"display":"block"});
			setTimeout(function() {
				$('#bottomLoading').css({"display":"none"});
				$.load_ad();
				obj.data('loading', false);
			}, 500);
		}
	});
});