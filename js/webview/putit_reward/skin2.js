//--------------------------------------------------------
// jQuery skin 用　外部連携ポイント表示
//--------------------------------------------------------
$(function(){

    $.setPointIncColHtml = function(g_platform, point_inc, append_array){
        var html            = "";
        var onclick_method  = $.getPointOnClickMethod(point_inc);
        var href_method     = $.getPointHrefMethod(g_platform, point_inc);
//        var mark_image      = "";

        // html
        html = html + '\
					<div class="l_app_w cf">\
					    <a href="' + href_method + '" onClick="location.href='+onclick_method+'" class="cf">\
							<div class="left_area">\
								<img src="/images/webview/point_apps/"'+ point_inc['img_path']+' class="app_icon" />\
							</div>\
							<div class="right_area">\
								<div class="app_name">' + point_inc['title'] + '</div>\
								<div class="app_text">' + point_inc['description'] + '</div>\
								<img src="/images/webview/ad_apps/vectol.png" class="bg_vectol"/>\
							</div>\
						</a>\
					</div>\
		';
        append_array[0].html = append_array[0].html + html;
    };
});
