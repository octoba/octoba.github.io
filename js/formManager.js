$(function(){
	$.fn.formManager = function(){}

	// チェック項目
	$.fn.formManager.check_type = {
		// __special_flag   予約属性
		
		"_required"         :"",
		"_length"           :"",
		"_minlength"        :"",
		"maxlength"         :"",
		"_num_range"        :"",
		"_str_range"        :"",
		"_alphanumeric"     :"",
		"_mail"             :"",
		"_url"              :"",
		"_gp_url"           :"",
		"_as_url"           :"",
		"_tel"              :"",
		"_date"             :"",
		"_pass"             :"",
		"_img_size_range"   :"",
		"_img_format"       :"",
		"_file_size_range"  :"",
		"_file_format"      :"",
		"_nohtml"           :"",
		"_android_package"  :"",
		"_ios_bundle_id"    :"",
        "_numeric"          :"",
        "_version"          :""
	};

	// 指定オブジェクト内のフォームデータを取得
	$.fn.formManager.getFormData = function(id, __special_flag)
	{
		var form_obj = {};
		$(id + " *").each(function(key, val){
			var result = (function(obj, key, val)
			{
				var form_value;
				var tag_name = $(obj).get(0).tagName.toUpperCase();

				// input タグ
				if(tag_name == "INPUT"){
					// radio タイプ
					if($(obj).attr("type") == "radio"){
						// _required 対応
						if(typeof $(obj).attr("_required") !== "undefined"){
							if(typeof $(id).find("input:radio[name='" + $(obj).attr("name") + "']:checked").val() === "undefined"){
								return $(obj).attr("_label_ja") + "は" + "必須です。";
							}
						}
						if(typeof $(id).find("input:radio[name='" + $(obj).attr("name") + "']:checked").val() === "undefined"){
							form_value = "";
						}
						else if($(obj).is(":checked")){
							form_value = $(obj).val();
						}
					}
					// checkbox タイプ
					else if($(obj).attr("type") == "checkbox"){
						var val = "";
						if($(obj).is(":checked")){
							val = $(obj).val();
						}
						form_value = val;
					}
					// image タイプ
					else if($(obj).attr("type") == "image"){
						form_value = $(obj).attr("src");
					}
					// それ以外のタイプ ( name="submit" は除く )
					else if($(obj).attr("name") != "submit"){
						form_value = $(obj).val();
					}
				}
				// select タグ
				else if(tag_name == "SELECT"){
					form_value = $(obj).val();
				}
				// textarea タグ
				else if(tag_name == "TEXTAREA"){
					form_value = $(obj).val();
				}

				// フォームデータがあれば追加
				if(typeof form_value !== "undefined"){
					var check_type = $.extend(true, {}, $.fn.formManager.check_type);
					
					// 特殊フラグ指定が存在した場合、そのフラグが無ければチェックしない
					if(typeof $(obj).attr("__special_flag") === "undefined" || typeof __special_flag === "undefined" || $(obj).attr("__special_flag") == __special_flag){
						res = $.fn.formManager.setCheckAttr(obj, check_type, form_value);
						if(typeof res === "string"){
							return res;
						}
					}
					else{
						return;
					}
					
					form_obj[$(obj).attr("name")] ={
						"name"       : $(obj).attr("name"),
						"label_ja"   : $(obj).attr("_label_ja"),
						"value"      : form_value,
						"check_type" : check_type
					};
					return;
				}
			})(this, key, val);

			// string であればエラーメッセージが返ってきている
			if(typeof result === "string"){
				form_obj = result;
				return false;
			}
		});
		// エラーメッセージでなければオブジェクトを返す
		if(typeof form_obj !== "string"){
			return {
				"area"  : $(id).attr("_area"),
				"tag"   : form_obj
			};
		}
		return form_obj;
	}

	// 属性があればオブジェクトに追加
	$.fn.formManager.setCheckAttr = function(object, attr_obj, value)
	{
		var result;
		$.each(attr_obj, function(key, val)
		{
			var res = (function(object, key, attr_obj, value)
			{
				if(typeof $(object).attr(key) === "undefined"){
					delete attr_obj[key];
					return;
				}
				switch(key){
					// 必須項目
					case "_required":
						if(value.length == 0 && $(object).attr("type") != "radio"){
							return $(object).attr("_label_ja") + "は" + "必須です。";
						}
						break;

					// 指定文字数
					case "_length":
						if(value.length != Number($(object).attr(key))){
							return $(object).attr("_label_ja") + "は" + $(object).attr(key) + "文字で入力してください。";
						}
						break;

					// 指定文字以下
					case "_minlength":
						if(value.length < Number($(object).attr(key))){
							return $(object).attr("_label_ja") + "は" + $(object).attr(key) + "文字以上で入力してください。";
						}
						break;

					// 指定文字数以上
					case "maxlength":
						if(value.length > Number($(object).attr(key))){
							return $(object).attr("_label_ja") + "は" + $(object).attr(key) + "文字以内で入力してください。";
						}
						break;

					// 数値（指定数）
					case "_num_range":
						if(value != "" && $(object).attr(key).match(/^([0-9]+)-([0-9]+)$/)){
                            num=$(object).attr(key).split("-");
							if(!$.fn.formManager.isNumRange(value, num[0], num[1])){
                                return $(object).attr("_label_ja") + "は" + num[1] + "以内" + num[0] + "以上で入力してください。";
							}
						}
						break;

					// 文字数（指定数）
					case "_str_range":
                        str=$(object).attr(key).split("-");
						if(!$.fn.formManager.isStrRange(value, str[0], str[1])){
							return $(object).attr("_label_ja") + "は" + str[1] + "文字以内" + str[0]+ "文字以上で入力してください。";
						}
						break;

					// 半角英数字カナ
					case "_alphanumeric":
						if(value != ""){
							if($(object).attr(key) == 1){
								if(value != "" && !value.match(/^[a-zA-Z0-9]+$/)){
									return $(object).attr("_label_ja") + "は半角英数字で入力してください。";
								}
							}
							else if($(object).attr(key) == 2){
								if(value != "" && !value.match(/^[0-9]+$/)){
									return $(object).attr("_label_ja") + "は半角数字で入力してください。";
								}
							}
							else if($(object).attr(key) == 3){
								if(value != "" && !value.match(/^[a-zA-Z]+$/)){
									return $(object).attr("_label_ja") + "は半角英字で入力してください。";
								}
							}
							else if($(object).attr(key) == 4){
								if(value != "" && !value.match(/^[ｦ-ﾟ()0-9]+$/)){
									return $(object).attr("_label_ja") + "はカタカナで入力してください。";
								}
							}
							else if($(object).attr(key) == 5){
								if(value != "" && !value.match(/^[0-9a-zA-Z!-~]+$/)){
									return $(object).attr("_label_ja") + "は半角英数字記号で入力してください。";
								}
							}
							else{
								if(value != "" && !value.match(/^[0-9a-zA-Z_.]+$/)){
									return $(object).attr("_label_ja") + "は半角英数字記号で入力してください。";
								}
							}
						}
						break;

					// メール
					case "_mail":
                        //if(value != "" && !value.match(/^[-+.\\w]+@[-a-z0-9]+(\\.[-a-z0-9]+)*\\.[a-z]{2,6}$/i)){
                        if(value != "" && !value.match(/^[A-Za-z0-9]+[A-Za-z0-9\.\-\_]+@[\w\.\-]+\.\w{2,}$/)){
							return $(object).attr("_label_ja") + "はメール形式で入力してください。";
						}
						break;

					// URL
					case "_url":
						if(value != "" && !value.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+[^.])$/)){
							return $(object).attr("_label_ja") + "URL形式で入力してください。";
						}
						break;

					// 電話番号
					case "_tel":
						if(value != "" && !value.match(/^[0-9]{10,15}$/)){
							return $(object).attr("_label_ja") + "を正しく入力してください。";
						}
						break;

					// 日付
					case "_date":
						if(value != "" && !value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)){
							return $(object).attr("_label_ja") + "は（YYYY-mm-dd）形式で入力してください。";
						}
						break;

					// BASE64
					case "_base64":
						if(value != "" && !value.match(/^[a-zA-Z0-9\/\+=]+$/)){
							return $(object).attr("_label_ja") + "はBASE64形式で入力してください。";
						}
						break;
					
					// android package
					case "_android_package":
						if(value != "" && !value.match(/^([a-zA-Z0-9\.\_])+$/)){
							return $(object).attr("_label_ja") + "を正しく入力してください。";
						}
						break;

					// iOS Bundle ID
					case "_ios_bundle_id":
						if(value != "" && !value.match(/^[a-zA-Z0-9\.\-]+$/)){
							return $(object).attr("_label_ja") + "を正しく入力してください。";
						}
						break;
                    //numeric
                    case "_numeric":
                        if(value != "" && !value.match(/^[0-9]+$/)){
                            return $(object).attr("_label_ja") + "は半角数字で入力してください。";
                        }
                        break;
                    case "_version":
                        if(value != "" && !value.match(/^[0-9]+([.]+[0-9]+)*$/)){
                            return $(object).attr("_label_ja") + "を正しく入力してください。";
                        }
                        break;
                    case "_file_format":
                        var name= $(object).attr("name");
                        var upFiles = document.getElementById(name).value;
                        var pattern=$(object).attr(key)+"$";
                        if(value != "" && !upFiles.match(new RegExp(pattern))){
                            return $(object).attr("_label_ja") + "は" + $(object).attr(key) + "形式でアップロードしてください。";
                        }
                        break;
				}
				attr_obj[key] = $(object).attr(key);
			})(object, key, attr_obj, value);
			// string であればエラーメッセージが返ってきている
			if(typeof res === "string"){
				result = res;
				return false;
			}
			attr_obj[name] = $(object).attr(name);
		});
		return result;
	}

	// 数値が指定数の範囲内か
	$.fn.formManager.isNumRange = function(val, min, max)
	{
		if(Number(min) <= Number(val) && Number(val) <= Number(max)){
			return true;
		}
		return false;
	}
	
	// 文字数が指定数の範囲内か
	$.fn.formManager.isStrRange = function(val, min, max)
	{
		if(Number(min) <= val.length && val.length <= Number(max)){
			return true;
		}
		return false;
	}

	// パスワードチェック用特別対応
	$.fn.formManager.passwordCheck = function(obj, current, confirm, confirm2)
	{
		if(current == confirm){
			return "以前のパスワードは使用できません。";
		}else if(confirm != confirm2){
			return "同じパスワードをもう一度入力してください。";
		}
		return "";
	}
});
