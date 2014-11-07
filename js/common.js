// 選択しているプラットフォーム
var select_platform = "";
// 共通プラットフォームか
var common_page = "";
// 専用プラットフォーム
var common_page_platform = "";
// メディア詳細設定画面か
var media_setting = "";
// メニューから飛ぶ場合のURL
var menu_jump = "";

//--------------------------------------------------------
// File API が使用可能か
//--------------------------------------------------------
function isFileAPI(){
	if(window.File && window.FileReader && window.FileList && window.Blob){
		return true;
	}
	else{
		return false;
	}
}

//--------------------------------------------------------
// htmlspecialchars
//--------------------------------------------------------
function htmlspecialchars(str)
{
	if(typeof str === "string"){
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#039;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		return str;
	}
	if(typeof str === "number"){
		return str;
	}
	return "";
}

//--------------------------------------------------------
// jQuery Init
//--------------------------------------------------------
$(function(){
	// モーダルの初期情報
	var modal_info = new Array();
	// 開いているモーダルリスト
	var modal_active = new Array();
	
	if(!isFileAPI()){
		alert("お使いのブラウザは対応されていません。\n最新バージョンにアップデートしてください。");
	}

	//--------------------------------------------------------
	// モーダル初期化
	//  ※初期化を行った場合、必ず html に以下のタグが必要
	//  <div id="lean_overlay{z-index}"></div>
	//  <a rel="leanModal{z-index}" href="#modal_area{z-index}"></a>
	//  <div id="modal_area{z-index}"></div>
	//
	//  index   モーダルの z-index (数値で指定)
	//  option  各オプションは以下
	//          top             縦位置 (デフォルトは 0)
	//          overlay         透明度を 0.0～1.0 で指定 1=100% (デフォルトは 1)
	//          closeButton     閉じるボタン用のクラス名 (デフォルトは ".modal_close{z-index}")
	//          resize          1=表示時にリサイズ (デフォルトは 1)
	//          closeCallback   閉じるを行った後に実行する関数
	//--------------------------------------------------------
	$.init_modal = function(index, option){
		if($("a[rel='leanModal" + index + "']").length == 0){
			alert("modal[" + index + "] が存在しません");
			return;
		}
		// デフォルトオプション
		var resize      = 1;    // 自動リサイズ
		var def_option  = {
			"index"         : index,
			"top"           : 0,
			"overlay"       : 1, //opacity
			"closeButton"   : ".modal_close" + index
		};
		
		// オプションのマージ
		if(typeof option !== "undefined"){
			if(typeof option["top"] !== "undefined"){           def_option["top"] = option["top"]; }
			if(typeof option["overlay"] !== "undefined"){       def_option["overlay"] = option["overlay"]; }
			if(typeof option["closeButton"] !== "undefined"){   def_option["closeButton"] = option["closeButton"]; }
			if(typeof option["resize"] !== "undefined"){        resize = option["resize"]; }
		}

		$("a[rel='leanModal" + index + "']").leanModal(def_option);
		$("a[rel='leanModal" + index + "']").attr("resize", resize);
		$(def_option["closeButton"]).click(function(){
			$.modal_close();
			if(typeof option !== "undefined" && typeof option["closeCallback"] === "function"){
				option["closeCallback"]();
			}
		});

		// 自動リサイズ設定
		if(resize == 1){
			$.init_modal_resize(index);
		}
	};

	//--------------------------------------------------------
	// イベントによるモーダルオープン
	//--------------------------------------------------------
	$.click_modal = function(index){
		// 既に開いている場合は何もしない
		for(i=0; i<modal_active.length; i++){
			if(modal_active[i] == index){
				return;
			}
		}
		$("a[rel='leanModal" + index + "']").click();
		$.modal_open(index);
	};

	//--------------------------------------------------------
	// モーダルウィンドウの自動リサイズ設定
	//--------------------------------------------------------
	$.init_modal_resize = function(index)
	{
		var id = "#modal_area" + index;
		modal_info[id]                      = new Array();
		modal_info[id]["start_height"]      = parseFloat($(id).css("height")) + 8;
		modal_info[id]["start_margin_top"]  = parseFloat($(id).css("margin-top"));

		if(modal_info[id]["start_height"] && modal_info[id]["start_margin_top"]){
			// リサイズイベント
			$(window).resize(function(){
				// 非表示されているウィンドウは除外
				if($(id).css("display") == "none"){
					return;
				}
				// アクティブでないウィンドウは除外
				if(modal_active.length > 0 && modal_active[modal_active.length - 1] != index){
					return;
				}
				$.call_modal_resize(index);
			});
		}
	};

	//--------------------------------------------------------
	// モーダルをリサイズ
	//--------------------------------------------------------
	$.call_modal_resize = function(index)
	{
		var id  = "#modal_area" + index;
		var wh  = Number($(window).height());
		var nmt = parseFloat($(id).css("margin-top"));
		var nh  = parseFloat($(id).css("height"));
		var smt = Number(modal_info[id]["start_margin_top"]);
		var sh  = Number(modal_info[id]["start_height"]);
		// マージンが 0 であり、ウィンドウ高さがモーダル初期高さ以上だった場合
		if(nmt == 0 && (sh + smt) < wh){
			$(id).css({"height":sh + "px"});
			// 通常以上の場合は戻す
			if(((sh + smt) + smt) < wh){
				$(id).css({"margin-top":smt + "px"});
			}
		}
		// ウィンドウがモーダル内に侵入
		else if(((sh + smt) + smt) > wh){
			$(id).css({"margin-top":"0px"});
			// ウィンドウ高さがモーダル初期高さ以下だった場合
			if((sh + smt) > wh){
				$(id).css({"height":"100%"});
				var ch = parseFloat($(id).css("height"));
				$(id).css({"height":Number(ch - smt) + "px"});
			}
		}
		// それ以外は初期状態に戻す
		else{
			$(id).css({"height":sh + "px"});
			$(id).css({"margin-top":smt + "px"});
		}
	};

	//--------------------------------------------------------
	// モーダルを開く
	//--------------------------------------------------------
	$.modal_open = function(index)
	{
		if($("a[rel='leanModal" + index + "']").attr("resize") == 1){
			$.call_modal_resize(index);
		}
		modal_active.push(index);
	};

	//--------------------------------------------------------
	// モーダルを閉じる
	//--------------------------------------------------------
	$.modal_close = function()
	{
		for(i=0; i<modal_active.length; i++){
			if($("a[rel='leanModal" + modal_active[i] + "']").attr("resize") == 1){
				$.call_modal_resize(modal_active[i]);
			}
		}
		modal_active.pop();
	};

	//--------------------------------------------------------
	// メディア切り替え
	//--------------------------------------------------------
	$("#media_select select").change(function(){
		if($(this).val() != ""){
			select_jump = 1;
			$.changeMedia($(this).val());
		}
	});

	//--------------------------------------------------------
	// プラットフォーム切り替え
	//--------------------------------------------------------
	$("#carrier li").click(function(){
		var platform = "";
		if($(this).hasClass("android") && common_page != 1){
			select_platform = 0;
			$.changePlatform(0);
		}
		else if($(this).hasClass("ios") && common_page != 1){
			select_platform = 1;
			$.changePlatform(1);
		}
	});

	$.changePlatformFinishFunc = function(){
	};

	//--------------------------------------------------------
	// プラットフォーム切り替え完了処理
	//--------------------------------------------------------
	$.changePlatformFinish = function(platform){
		select_platform = platform;
		
		if(common_page == "1"){
			if(common_page_platform == "0"){
				$("#carrier .android span").attr("class", "on");
				$("#carrier .ios span").attr("class", "off");
			}
			else if(common_page_platform == "1"){
				$("#carrier .android span").attr("class", "off");
				$("#carrier .ios span").attr("class", "on");
			}
			else{
				$("#carrier .android span").attr("class", "on");
				$("#carrier .ios span").attr("class", "on");
			}
		}
		else{
			if(platform == "0"){
				$("#carrier .android span").attr("class", "on");
				$("#carrier .ios span").attr("class", "pointer");
				$("#android_area").css({"display":"inline"});
				$("#ios_area").css({"display":"none"});
			}
			else if(platform == "1"){
				$("#carrier .android span").attr("class", "pointer");
				$("#carrier .ios span").attr("class", "on");
				$("#android_area").css({"display":"none"});
				$("#ios_area").css({"display":"inline"});
			}
		}
		
		// メニューの無効化、有効化
		if((platform == "0" && use_android == "1") || (platform == "1" && use_ios == "1")){
			$("a.use_menu").unbind("click");
			$("a.use_menu").parent().css({"display":"block"});
		}
		else{
			$("a.use_menu").bind("click", function(){return false;});
			$("a.use_menu").parent().css({"display":"none"});
		}

		$.changePlatformFinishFunc();
	};

	//--------------------------------------------------------
	// 現在選択しているプラットフォーム id を取得
	//--------------------------------------------------------
	$.getSelectPlatformArea = function(){
		if(select_platform == "0"){
			return "#android_area";
		}
		else if(select_platform == "1"){
			return "#ios_area";
		}
	};

	//--------------------------------------------------------
	// drag start callback
	//--------------------------------------------------------
	$.callbackDragstart = function(callback_func){
		return function(e){
			e.preventDefault();
			if(typeof callback_func == "function"){
				callback_func();
			}
		};
	};

	//--------------------------------------------------------
	// drag end callback
	//--------------------------------------------------------
	$.callbackDragend = function(callback_func){
		return function(e){
			e.preventDefault();
			if(typeof callback_func == "function"){
				callback_func();
			}
		};
	};

	//--------------------------------------------------------
	// drag leave callback
	//--------------------------------------------------------
	$.callbackDragleave = function(callback_func){
		return function(e){
			e.preventDefault();
			if(typeof callback_func == "function"){
				callback_func();
			}
		};
	};

	//--------------------------------------------------------
	// drag enter callback
	//--------------------------------------------------------
	$.callbackDragenter = function(callback_func){
		return function(e){
			e.preventDefault();
			if(typeof callback_func == "function"){
				callback_func();
			}
		};
	};

	//--------------------------------------------------------
	// drag over callback
	//--------------------------------------------------------
	$.callbackDragover = function(callback_func){
		return function(e){
			e.preventDefault();
			if(typeof callback_func == "function"){
				callback_func();
			}
		};
	};

	//--------------------------------------------------------
	// drop callback
	//--------------------------------------------------------
	$.callbackDrop = function(target, callback_func, option){
		return function(e){
			e.preventDefault();
			if(typeof callback_func == "function"){
				callback_func();
			}

			// 一つ目のファイルのみ対象
			var file = e.originalEvent.dataTransfer.files[0];

			// 画像のみ ( png jpeg bmp )
			if(file.type.match(/^image\/(png|jpeg|bmp|gif)$/)){
				var reader = new FileReader();
				// エラー処理
				reader.onerror = function(e){
					$.fileReaderOnErrorCallback(target, file, e, option);
				};
				// 読み込み
				reader.onload = function(e){
					$.fileReaderOnLoadCallback(target, file, e, option);
				};
				reader.readAsDataURL(file);
			}
		}
	}
	$.fileReaderOnErrorCallback = function(target, file, e, option){};
	$.fileReaderOnLoadCallback = function(target, file, e, option){};

	//--------------------------------------------------------
	// ヒント
	//--------------------------------------------------------
	$(".hint_area").mouseover(function(){
		$("#hint .hint_window").hide();
		$("#hint").find("." + $(this).attr("hint")).css({
			"top": $(this).offset().top - 24,
			"left": $(this).offset().left + 24
		}).show(0);
	});
	$(".hint_area").mouseout(function() {
		$("#hint").find("." + $(this).attr("hint")).hide();
	});

	//--------------------------------------------------------
	// TOOL TIP
	//--------------------------------------------------------
	// .submit 初期化
	$.init_submit = function(){
		$('.submit').removeAttr('disabled');
		$('.submit').css('cursor', 'pointer');
		$('.submit').on("mouseenter");
		$('.submit').on("mouseleave");
	};
	// close tip
	$('.tip').click(function(){
		if($(this).css('display', 'block')){
			$(this).fadeOut(100);
			$.init_submit();
		}
	});

	// tip function
	$.tip_js = function(tip, msg){
		if(typeof tip === "object"){
			tip.fadeIn(100);
			tip.text(msg);
			$.init_submit();
		}
	};
	$.tip_success = function(tip, msg){
		if(typeof tip === "object"){
			setTimeout (function(){
				tip.fadeOut(100);
			}, 5000);
			tip.text(msg);
		}
	};
	$.tip_error = function(tip, msg){
		if(typeof tip === "object"){
			tip.text(msg);
		}
	};
	$.tip_fail_request = function(tip){
		if(typeof tip === "object"){
			tip.text('リクエストに失敗しました。\nもう一度送信してください。');
		}
	};
	$.tip_fail_connect = function(tip){
		if(typeof tip === "object"){
			tip.text('通信に失敗しました。\nもう一度送信してください。');
		}
	};
	$.tip_always = function(tip){
		if(typeof tip === "object" && tip.text() != "" ){
			tip.fadeIn(100);
		}
		$.init_submit();
	};

	//--------------------------------------------------------
	// ローディング
	//--------------------------------------------------------
	$('body').append('<div id="lean_overlay1000" class="lean_overlay"><span class="modal_close1000"></span><span class="nowloading_img"><img src="/images/loading.gif" alt=""></span></div><a rel="leanModal1000" href="#modal_area1000"></a>');
	$.init_modal(1000, {"resize":0});
	$.nowloading = function(){
		$.click_modal(1000);
	}
	$.endloading = function(){
		$(".modal_close1000").trigger("click");
	};

	//--------------------------------------------------------
	// API 通信成功
	//--------------------------------------------------------
	$._doneAPI = function(tip, callbackSuccessFunc, callbackFailureFunc){
		return function(json_result, status, xhr){
			// json で返ってこなかった
			if(typeof json_result !== "object"){
				alert("データの解析に失敗しました");
				return;
			}

			// リクエスト成功
			if(json_result.result == "success"){
				// tip 制御
				if(typeof tip !== "undefined"){
					$.tip_success(tip, json_result.success_msg);
				}
				// callback
				if(typeof callbackSuccessFunc === "function"){
					callbackSuccessFunc(json_result);
				}
				return;
			}
			// リクエスト失敗
			else if(json_result.result == "failure"){
				// tip 制御
				if(typeof tip !== "undefined"){
					$.tip_error(tip, json_result.error_msg);
				}
				// callback
				if(typeof callbackFailureFunc === "function"){
					callbackFailureFunc(json_result);
				}
				return;
			}
			// リクエスト失敗 ( result が正常に返ってこなかった )
			else{
				// tip 制御
				if(typeof tip !== "undefined"){
					$.tip_fail_request(tip);
				}
				// callback
				if(typeof callbackFailureFunc === "function"){
					callbackFailureFunc(json_result);
				}
				return;
			};
		};
	};
	//--------------------------------------------------------
	// API 通信失敗
	//--------------------------------------------------------
	$._failAPI = function(tip, callbackFailureFunc){
		return function(xhr, status, error){
			// tip 制御
			if(typeof tip !== "undefined"){
				$.tip_fail_connect(tip);
			}
			// callback
			if(typeof callbackFailureFunc === "function"){
				callbackFailureFunc();
			}
		};
	};
	//--------------------------------------------------------
	// API 通信完了
	//--------------------------------------------------------
	$._alwaysAPI = function(tip, callbackAlwaysFunc){
		return function(arg1, status, arg2){
			$.endloading();
			
			// tip 制御
			if(typeof tip !== "undefined"){
				$.tip_always(tip);
			}
			// callback
			if(typeof callbackAlwaysFunc === "function"){
				callbackAlwaysFunc();
			}
		};
	};

	//--------------------------------------------------------
	// リンク踏みイベント
	//--------------------------------------------------------
	$.actionMenuJump = function(object){
		var href = $(object).find("a").attr("href");
		//alert("select_platform=" + select_platform + " href=" + href);
		$(object).append('<form method="post" action="' + href + '"></form>');
		if(select_platform == "0"){
			$(object).find("form").append('<input type="hidden" name="g_k_a" value="' + g_k_a + '">');
		}
		else if(select_platform == "1"){
			$(object).find("form").append('<input type="hidden" name="g_k_i" value="' + g_k_i + '">');
		}
		$(object).find("form").submit();
		return false;
	};
	$("ul.dashboard_menu li a").attr("onclick", "return false;");
	$("ul.dashboard_menu li").click(function(){
		$.actionMenuJump($(this));
	});
	$("ul.sublink li a").attr("onclick", "return false;");
	$("ul.sublink li").click(function(){
		$.actionMenuJump($(this));
	});

	//--------------------------------------------------------
	// 連想配列ソート
	//
	//  sort_data ソート対象の連想配列 ( 結果が書き換えられる )
	//  key       ソートするキー名
	//  order     "ASC"=昇順 "DESC"=降順
	//--------------------------------------------------------
	$.key_sort = function(sort_data, key, order){
		sort_data.sort(function(a, b){
			if(order == "ASC"){
				if(a[key] < b[key]){
					return -1;
				}
				if(a[key] > b[key]){
					return 1;
				}
			}
			else if(order == "DESC"){
				if(a[key] > b[key]){
					return -1;
				}
				if(a[key] < b[key]){
					return 1;
				}
			}
			return 0;
		});
	};
});

