/**
 * Created by Administrator on 2015/10/27.
 */
var $ = window.Z;

window.String.prototype.trim = function() {

    return this.replace(/(^\s*)|(\s*$)/g,'');
}
$(function(){

    $(".sendButton").on("click",function(){

        if( $(".adviseInput").get(0).value.trim() == "" ){return;}

        var suggestion = $(".adviseInput").get(0).value;
        var email = $(".emailInput").get(0).value || ""

        var data = $.extend(getCommonReqData(),{suggestion:suggestion,email:email})

        submitTuCao(data);

    })

    var refreshListImg = false;

    function submitTuCao(data){
        if(refreshListImg){return;}
        refreshListImg = true;
        $.ajax({
            url:window.actionUrl.submitSuggestion.url,
            type:window.actionUrl.submitSuggestion.type,
            data:data,
            success:function(reply){
                reply = checkReply(reply);
                if(!reply){return;}
                if(reply.status == 0){
                    console.log('提交成功' + data);
                }
            },
            error:function(err){
                noNetwork();
            },
            complete:function(){
                refreshListImg = false;
            }
        })
    }


})