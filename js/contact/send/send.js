$(function(){
    $("#send_confirm .btn_orange").click(function(){
        //var name = $("form[name='confirm'] input[name='name']:checked").val();
        //var tip     = $(this).parent().find(".tip");
        alert("OK")

        var result  = $.fn.formManager.getFormData("#send_confirm");
        alert(result);
        if(typeof result === "string"){
            //$.tip_js(tip, result);
            alert(result);
            return;
        }
    });
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green',
        increaseArea: '10%', // optional
        cursor: true // optional
    });

});
