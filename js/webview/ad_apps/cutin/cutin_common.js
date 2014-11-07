//--------------------------------------------------------
// ad_apps(cutin) js
//--------------------------------------------------------
var g_not_install_apps      = {};
var g_sdk_flag              = 0;

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
// View Size
//--------------------------------------------------------
if(g_platform == 0){
	try{
		SDK.setSizeType(1);
	}
	catch(e){
	}
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
		var ad_apps = new Array();
		for(var i=0; i<g_ad_buff.length; i++){
			var package = g_ad_buff[i]['package'];
			if(g_platform == 1){
				package = g_ad_buff[i]['bid'];
			}
			if((!g_sdk_flag) || (g_sdk_flag && g_not_install_apps[package])){
				// インストールされていないアプリを追加
				ad_apps.push(g_ad_buff[i]);
			} 
		}
		
		if(g_cutin_type == "basic"){
			// インストールされていないアプリが一件もない場合はランダムで一件入れる
			if(g_ad_buff.length > 0 && ad_apps.length <= 0){
				ad_apps = g_ad_buff[Math.floor(Math.random() * g_ad_buff.length)];
			}
			else if(ad_apps.length > 0){
				ad_apps = ad_apps[Math.floor(Math.random() * ad_apps.length)];
			}
		}
		else if(g_cutin_type == "cube"){
			if(ad_apps.length > 0){
				ad_apps = ad_apps.shuffle();
			}
		}
		else if(g_cutin_type == "manga"){
		}
		
		$.setCutinHtml(g_platform, ad_apps);
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
		// ios
		if(platform == "1"){
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
	$(document).ready(function(){
		// android インストールチェック
		if(g_platform == 0){
			g_sdk_flag    = $.getNotInstallApps(g_platform, g_ad_json, g_not_install_apps);
			$.load_ad();
		}
		// ios インストールチェック
		else{
			$.getNotInstallApps(g_platform, g_ad_json, g_not_install_apps);
		}
	});
});