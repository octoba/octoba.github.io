var g_point_inc_pos                = 0;
var g_pager_num               = 15;

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
    // onclick 用のメソッド html を取得
    //--------------------------------------------------------
    $.getPointOnClickMethod = function(point_inc)
    {
        var href = "/webview/putit_reward/point/app_list?";
        href = href + "incentive_id=" + point_inc["incentive_id"];

//        location.href = href;
        return href;
    };

    //--------------------------------------------------------
    // href 用のメソッド html を取得
    //--------------------------------------------------------
    $.getPointHrefMethod = function(platform, point_inc)
    {
        var href = "javascript:void(0)";
//        if(g_preview == 1){
//            return "";
//        }
//        if(typeof point_inc["site_url"] !== "undefined" && point_inc["site_url"]){
//            href = point_inc['site_url'];
//        }
//        // ios
//        else if(platform == "1"){
//            href = "http://click?";
//            if(point_inc["redirect_url"] != ""){
//                href = href + "redirect=" + point_inc["redirect_url"] + "&";
//            }
//            href = href + "incentive_id=" + point_inc["incentive_id"] + "&";
////            href = href + "app_id=" + point_inc["package"] + "&";
//            href = href + "url_scheme=" + point_inc["url_scheme"];
//        }
        return href;
    }
    //--------------------------------------------------------
    // 外部ポイント連携広告読み込み
    //--------------------------------------------------------
    $.load_point_list = function()
    {
        // append するオブジェクトリスト
        var append_array = [
            {object : $("#bottomLoad"), html:""}
//            {object : $("#bottomLoad2"), html:""}
        ];
        var point_inc_count = 0;
        for(var i=g_point_inc_pos; i<g_point_inc_buff.length; i++){
            if(point_inc_count >= g_pager_num){
                point_inc_count = 0;
                break;
            }
            g_point_inc_pos++;

            $.setPointIncColHtml(g_platform, g_point_inc_buff[i],append_array);
        }
//        $.setPointEndColHtml(append_array);

        // 全て表示でスクロールイベントを停止
        if(g_point_inc_pos >= g_point_inc_buff.length || g_preview == 1){
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

        // skin1 と skin2 は lazyload 対応
        $("img.app_icon").lazyload({effect:"fadeIn",effectspeed:150});

        $('html,body').animate({scrollTop: $(document).scrollTop() + 1}, 'fast');
        //$("#loading").remove();
    }

    //--------------------------------------------------------
    // インストールされていない課金広告のパッケージを取得
    //--------------------------------------------------------
    $.getInstallApps = function(g_platform, json_data, result_apps)
    {
        var view_app    = "";
        try{
            if(g_platform == 0){
                view_app    = SDK.editInstallApps(json_data);
            }
            else{
                calliOSNativeMehtod('get', 'post_list', json_data);
                return true;
            }
        }
        catch(e){
            return false;
        }
        if(view_app){
//            if(view_app == "[]"){
//                return true;
//            }
//            var appJSON = $.parseJSON(view_app);

//            $.each(appJSON,function(key, val){
//                if(val['flag'] == 0){
//                    result_apps[val['pkg_name']] = 1;
////                    view_apps.push(val['pkg_name']);
//                }else if(val['flag'] == 2){
//                    result_apps[val['pkg_name']] = 2;
//                }
//            });

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
    // 初期表示
    //--------------------------------------------------------
    // プレビュー
    if(g_preview == 1){
        $.load_point_list();

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
            $.load_point_list();
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
                    $.load_point_list();
                    obj.data('loading', false);
                }, 500);
            }
        });
    }
});