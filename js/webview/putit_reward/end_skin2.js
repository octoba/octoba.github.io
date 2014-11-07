//--------------------------------------------------------
// jQuery 外部連携ポイント 用 エンドタグ用
//--------------------------------------------------------
$(function(){
    $.setPointEndColHtml = function(append_array){
        var html = '';
            html = html + '\
						</div>\
						<div class="shelf_end"><img src="/images/webview/ad_apps/shelf.png"></div>\
					</div>\
					';
//        }
        append_array[0].html = append_array[0].html + html;
    };
});