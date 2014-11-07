// アプリがインストールされているか
// インストールされていれば true されていなければ false が返る
function isInstallApp(platform, package)
{
	var view_app    = "";
	var json_data   = '[{"pkg_name":"' + package + '"}]';
	try{
		if(platform == "0"){
			view_app    = SDK.editNotInstallApps(json_data);
		}
		else{
			return false;
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
		if(appJSON[0].pkg_name == package){
			return false;
		}
		return true;
	}
	return false;
}

// インストールされていないアプリのパッケージを取得
function getNotInstallApps(platform, json_data, result_apps)
{
	//document.getElementById("#debug_area").innerHTML("platform=" + platform + "\n" + json_data);
	var view_app    = "";
	try{
		if(platform == 0){
			view_app    = SDK.editNotInstallApps(json_data);
		}
		else{
			calliOSNativeMehtod('get', 'ad_list', json_data);
			return;
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
}
