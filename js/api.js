$(function(){
    // app-c.net/webview API をコール
    $.callWebAPI = function (post_data, done_callback, fail_callback, always_callback)
    {
        if(Number(select_platform) == 0){
            post_data.g_k_a = g_k_a;
        }
        else if(Number(select_platform) == 1){
            post_data.g_k_i = g_k_i;
        }
        else{
            post_data.g_k_a = g_k_a;
            post_data.g_k_i = g_k_i;
        }
        post_data.token = token;

        var match = window.location.toString().match(/\.app-c\.net\/webview\/([^\?]*)\/([^\?]*)/);
        if(typeof(match[2]) == "undefined"){
            fail_callback();
            return;
        }
        var ajax = $.ajax({
            'dataType'  : "json",
            'type'      : 'post',
            'url'       : '/api/webview/putit_reward/'+match[1]+'/'+match[2],
            'data'      : post_data
        });
        ajax.done(done_callback);
        ajax.fail(fail_callback);
        ajax.always(always_callback);
    };
});
