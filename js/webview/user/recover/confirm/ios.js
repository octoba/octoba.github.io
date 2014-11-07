

/*
 *  ネイティブメソッド呼出し
 * 【getter】
 *  appcsdk://get?ad_list:{広告一覧のJSON} → 未インストールの広告一覧
 *
 * 【other】
 *  appcsdk://close → WebViewクローズ
 *  appcsdk://optin?uid={UID} → オプトイン
 *  appcsdk://optout → オプトアウト
 *
 *  パラメータ
 *  type : other or get or set (require)
 *  key  : get、set時は保存、取得するキー (require)
 *  value: setterとotherのみ使用
 */
function calliOSNativeMehtod(type, key, value)
{
	//第３引数省略化
	value = (typeof value === "undefined") ? null : value;
	var param;
	if(type == "other"){
		if(key == "recovery"){
            param = key + "?" + value;
        }
		else{
			param = key;
		}
	}else{
		//getter/setter
		param = type + "?" + key;
		//setterのみ値有り
		param = (type == "set" || (type == "get" && key == "ad_list")) ? param + ":" + value : param;
	}

	url = "appcsdk://"+param;

	iFrame = document.createElement("IFRAME");
	iFrame.setAttribute("src", url);
	document.body.appendChild(iFrame);
	iFrame.parentNode.removeChild(iFrame);
	iFrame = null;
}

function setNativeData(json)
{
	// インストールされていないアプリ一覧
	if(typeof(json.ad_list) != 'undefined'){
		for(var i = 0; i < json.ad_list.length; i++){
			//$("#debug").append(json.ad_list[i] + "<br>");
			//console.log(json.ad_list[i]);
		}
		getNotInstallAppsCallBack(json.ad_list);
	}
}