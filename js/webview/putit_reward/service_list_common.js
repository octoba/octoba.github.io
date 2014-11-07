//--------------------------------------------------------
// ad_apps js　adの要素あり
//--------------------------------------------------------
var move_count              = 0;
var g_ad_pos                = 0;
var g_ad_col_count          = 0;
var g_not_install_apps      = {};
var g_sdk_flag              = 0;
var g_pager_num             = 15;
var g_stop_bottom           = 0;
// default banner
var g_def_bnr               = new Array();

var buff = new Array();
buff["package"]        = "jp.co.cayto.giveapp.android";
buff["redirect_url"]   = "";
buff["title"]          = "giveApp";
buff["description"]    = "giveAppにアプリとの出会いをお手伝いさせてください！giveAppは無料で使えるアプリ探しのための高機能アプリケーションです。さまざまな方法でAndroidをより便利に使うためのお手伝いをします。";
buff["icon_url"]       = "http://img.giveapp.jp/app_images/jp.co.cayto.giveapp.android_thumb_0k1Q.png";
g_def_bnr["android"]   = buff;

var buff = new Array();
buff["package"]        = "401625987";
buff["redirect_url"]   = "";
buff["title"]          = "giveApp";
buff["description"]    = "giveAppにアプリとの出会いをお手伝いさせてください！giveAppは無料で使えるアプリ探しのための高機能アプリケーションです。さまざまな方法でiPhone, iPadをより便利に使うためのお手伝いをします。";
buff["icon_url"]       = "http://img.giveapp.jp/app_images/iphone/401625987_thumb_KOYx.jpg";
g_def_bnr["ios"]       = buff;

//--------------------------------------------------------
// InstallCheck CallBack
//--------------------------------------------------------
function getNotInstallAppsCallBack(ad_list)
{
    for(var i = 0; i < ad_list.length; i++){
        g_not_install_apps[ad_list[i]] = 1;
    }
    g_sdk_flag    = true;
//    $.setBanner();
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
    // Slider 初期化
    //--------------------------------------------------------
    $.initFlexslider = function(){
        $('.flexslider').flexslider({
            animation: "slide", //"fade" or "slide"
            slideDirection: "horizontal", //縦or横（ "horizontal" or "vertical" ）
            slideshow: true, //オートスライド
            slideshowSpeed: 2000, //スライドのスピード
            animationDuration: 300, //アニメーションのスピード
            directionNav: false, //PREV・NEXTナビ
            controlNav: true, //●○○ナビ
            keyboardNav: false, //キーボードによる操作可否
            animationLoop: true, //ループ可否
            slideToStart: 0, //最初に見せる画像を指定
            mousewheel: false, //マウスホイールによる操作可否
            randomize: true //最初の画像をランダム表示
        });
    };

    //--------------------------------------------------------
    // インストールされていないアプリのパッケージを取得
    //--------------------------------------------------------
    $.getInstallApps = function(g_platform, json_data, result_apps)
    {
        var view_app    = "";
        try{
            if(g_platform == 0){
                view_app    = SDK.editInstallApps(json_data);
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

            //---------  test1 ----------------------------------
            $.each(appJSON,function(key, val){
                val['flag'] = 0
            });
            //---------  /test1 ---------------------------------

            $.each(appJSON,function(key, val){
                if(val['flag'] == 0){
                    result_apps[val['pkg_name']] = 1;
//                    view_apps.push(val['pkg_name']);
                }else if(val['flag'] == 2){
                    result_apps[val['pkg_name']] = 2;
                }
            });

//            $.each(appJSON, function(){
//                result_apps[this.pkg_name] = 1;
//            });
            return true;
        }
        else{
            return false;
        }
        return false;
    };

    //--------------------------------------------------------
    // 上部バナーの設定
    //--------------------------------------------------------
    $.setBanner = function()
    {
        var def_banner_data = new Array();
        if(g_platform == "0"){
            def_banner_data = g_def_bnr["android"];
        }
        else if(g_platform == "1"){
            def_banner_data = g_def_bnr["ios"];
        }
        $.setBannerData(g_platform, def_banner_data, g_ad_buff, g_sdk_flag, g_not_install_apps);
        if(g_template_no != 1){
            $.initFlexslider();
        }
    };

    //--------------------------------------------------------
    // 広告読み込み
    //--------------------------------------------------------
    $.load_ad = function()
    {
        // append するオブジェクトリスト
        var append_array = [
            {object : $("#bottomLoad"), html:""}
//            {object : $("#bottomLoad2"), html:""}
        ];
        var ad_count = 0;
        for(var i=g_ad_pos; i<g_ad_buff.length; i++){
            if(ad_count >= g_pager_num && g_preview != 1){
                ad_count = 0;
                break;
            }
            g_ad_pos++;

            var package = g_ad_buff[i]['package'];
            if(g_platform == 1){
                package = g_ad_buff[i]['bid'];
            }
            if((!g_sdk_flag) ||(g_sdk_flag && g_not_install_apps[package]==2)){
                g_ad_col_count++;
                ad_count++;
                $.setInstalledAdColHtml(g_platform, g_ad_buff[i], g_ad_col_count, append_array);
            }
        }
        var ad_count = 0;
        for(var i=g_ad_pos; i<g_ad_buff.length; i++){
            if(ad_count >= g_pager_num && g_preview != 1){
                ad_count = 0;
                break;
            }
            g_ad_pos++;

            var package = g_ad_buff[i]['package'];
            if(g_platform == 1){
                package = g_ad_buff[i]['bid'];
            }
            if((!g_sdk_flag) || (g_sdk_flag && g_not_install_apps[package] == 1)){
                g_ad_col_count++;
                ad_count++;
                $.setAdColHtml(g_platform, g_ad_buff[i], g_ad_col_count, append_array);
            }
        }
//        //ダミー代入用
//        $.setAdEndColHtmlSkin(g_template_no, g_ad_col_count, append_array);

        // 全て表示でスクロールイベントを停止
        if(g_ad_pos >= g_ad_buff.length || g_preview == 1){
            $(window).unbind('scroll');
            $(window).unbind('bottom');
            $(window).off('bottom');
            g_stop_bottom = 1;
        }

        // append
        $.each(append_array, function(key, val){
            if(typeof val.object[0] !== "undefined"){
                $(val.object).append(val.html);
            }
        });

        // skin1 と skin2 は lazyload 対応　lazyload表示領域にきたらダミーをリロードされる
//        if(g_template_no == 1 || g_template_no == 2){
        $("img.app_icon").lazyload({effect:"fadeIn",effectspeed:150});
//        }
//        else if(g_template_no == 3){
//            $.initAppIcon();
//        }
//        else if(g_template_no == 4 || g_template_no == 5){
//            $.window_load();
//            $("img.app_icon").lazyload({effect:"fadeIn",effectspeed:150});
//        }

//        if(move_count == 0){
//            //$('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 'fast');
//            //$("img.app_icon").lazyload.update();
//            move_count = 1;
//        }
        // リロードをしないならいらない
        $('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 'fast');
        //$("#loading").remove();
    }

    //--------------------------------------------------------
    // 広告読み込み
    //--------------------------------------------------------
    $.load_complete_ad = function()
    {
        // append するオブジェクトリスト
        var append_array = [
            {object : $("#bottomLoad"), html:""}
//            {object : $("#bottomLoad2"), html:""}
        ];
        var ad_count = 0;
        for(var i=g_ad_pos; i<g_ad_buff.length; i++){
            if(ad_count >= g_pager_num && g_preview != 1){
                ad_count = 0;
                break;
            }
            g_ad_pos++;

            var package = g_ad_buff[i]['package'];
            if(g_platform == 1){
                package = g_ad_buff[i]['bid'];
            }
            if((!g_sdk_flag) ||(g_sdk_flag && g_not_install_apps[package]==2)){
                g_ad_col_count++;
                ad_count++;
                $.setInstalledAdColHtml(g_platform, g_ad_buff[i], g_ad_col_count, append_array);
            }
        }
        $.setItemGainButton(g_template_no,g_item_data);

        // 全て表示でスクロールイベントを停止
        if(g_ad_pos >= g_ad_buff.length || g_preview == 1){
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

        // skin1 と skin2 は lazyload 対応　lazyload表示領域にきたらダミーをリロードされる
//        if(g_template_no == 1 || g_template_no == 2){
        $("img.app_icon").lazyload({effect:"fadeIn",effectspeed:150});
//        }
//        else if(g_template_no == 3){
//            $.initAppIcon();
//        }
//        else if(g_template_no == 4 || g_template_no == 5){
//            $.window_load();
//            $("img.app_icon").lazyload({effect:"fadeIn",effectspeed:150});
//        }

//        if(move_count == 0){
//            //$('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 'fast');
//            //$("img.app_icon").lazyload.update();
//            move_count = 1;
//        }
        // リロードをしないならいらない
        $('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 'fast');
        //$("#loading").remove();
    }

    //--------------------------------------------------------
    // SDKからの結果通知処理
    //--------------------------------------------------------
    $.update = function(json_data)
    {
        var post_data   = {
            "mode"      : "update",
            "json_data"   : json_data
        };
//        $.nowloading();
        $.callWebAPI(post_data, $.update_ad, $._failAPI, $._alwaysAPI);
    };

    $.update_ad = function()
    {
        $.reload();
    }

    $.complete = function(json_data)
    {
        var post_data   = {
            "mode"      : "update",
            "json_data"   : json_data
        };
        $.nowloading();
        $.callWebAPI(post_data, $.complete_ad, $._failAPI, $._alwaysAPI);
    };

    $.complete_ad = function()
    {
        if(g_platform == 0){
//            g_sdk_flag    = $.getInstallApps(g_platform, g_ad_json, g_not_install_apps);
//            $.setBanner();
            $.load_complete_ad();
        }
        // ios
        else{
            $.load_complete_ad();
//          $.getInstallApps(g_platform, g_ad_json, g_not_install_apps);
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
                    $.load_complete_ad();
                    obj.data('loading', false);
                }, 500);
            }
        });


    }

    function ajaxPostFunc(param1, param2){
        $.post("post.php", {input1:param1, input2:param2}, function(json){alert("パラメータを2つPOSTしました");});
    }

    //--------------------------------------------------------
    // すべてをリロードする
    //--------------------------------------------------------
    $.reload = function()
    {
        $("#bottomLoad").remove();
//        $("#bottomLoad2").remove();
//        $.setBanner();
        $.load_ad();
    }

    //--------------------------------------------------------
    //
    //--------------------------------------------------------
    //--------------------------------------------------------
    // 広告表示 ( 一回の表示の最後 )
    //--------------------------------------------------------
//    $.setAdEndColHtmlSkin = function(g_template_no, ad_count, append_array){
//        if(g_template_no == 4){
//            return $.setAdEndColHtml(ad_count, append_array);
//        }
//        else if(g_template_no == 5){
//            return $.setAdEndColHtml(ad_count, append_array);
//        }
//        return "";
//    };

    //--------------------------------------------------------
    // onclick 用のメソッド html を取得
    //--------------------------------------------------------
    $.getAdOnClickMethod = function(g_platform, ad)
    {
        var result = "";
        if(g_preview == 1){
            return result;
        }
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
        if(g_preview == 1){
            return "";
        }
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
    // ItemGainButtonHtml を　表示
    //--------------------------------------------------------
    $.setItemGainButton = function(platform,g_item_data){
        var onclick_method  = $.getItemOnClickMethod(platform, g_item_data);
        var html = '';
        html = '\
            <a href="' + href_method + '" onClick="' + onclick_method + '">\
                <div class="l_app_w cf">\
                    <div class="left_area">\
                        <input type="button" value="アイテム取得" onClick="location.href='/webview/ad_apps/agreement/'" class="kiyaku_btn">\
                    </div>\
                </div>\
            </a>\
			';
    }

    //--------------------------------------------------------
    // onclick 用のメソッド html を取得
    //--------------------------------------------------------
    $.getItemOnClickMethod = function(g_platform, g_item_data)
    {
        var result = "";
        if(g_preview == 1){
            return result;
        }
        if(g_item_data['product_id'] && !g_item_data['id']){
            // android
            if(g_platform == "0"){
                // package, redirect_url を渡す
                // 下記パッケージ名の場合、独自パラメータを付与してリダイレクト
//                if(ad['package'] == "com.king.candycrushsaga"){
                    result  = "$.addParamRedirect('"+ad['package']+"', '"+ad['redirect_url']+"');";
//                }else{
                result  = "SDK.clickItemGet('"+g_item_data['product_id']+"', '"+g_item_data['id']+"');";
//                }
            }
            // ios
            else{
                result  = "";
            }
        }
        return result;
    };
    //--------------------------------------------------------
    // 初期表示
    //--------------------------------------------------------
    // プレビュー
    if(g_preview == 1){
//        $.setBanner();
        $.load_ad();

        // リンク削除
        $("a").attr("href", "javascript:void(0)");
        $("input[type='button']").attr("onclick", "javascript:void(0)");
    }
    // 通常
    else{
        // インストールチェック
        // android
        if(g_platform == 0){
            g_sdk_flag    = $.getInstallApps(g_platform, g_ad_json, g_not_install_apps);
//            $.setBanner();
            $.load_ad();
        }
        // ios
        else{
            $.getInstallApps(g_platform, g_ad_json, g_not_install_apps);
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
    }
});