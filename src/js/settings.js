/**
 * Created by Administrator on 2015/10/16.
 */
"use strict";
$(function(){
    //console.log(11111111)

    function renderList(obj){
        var $headImg = $(".peopleInfo .headImg");
        var $nickName = $(".peopleInfo .allInfo .name");
        var $information = $(".peopleInfo .allInfo .info");
        var $myChallengeCount = $(".myChallenge .challengeCount");
        var $mySelectionCount = $(".mySelection .mySelectionCount");
        var $myfollowsCount = $(".myfollows .myfollowsCount");
        var $myAchievementCount = $(".myAchievement .myAchievementCount");

        $headImg.css("background-image","url(" + obj.headImg + ")");
        $nickName.html(obj.nickname);
        $information.html("<img class = 'sex' src='' alt=''/>"+"&nbsp; · " + obj.age + " · " + obj.xingzuo + " · " + obj.province + obj.city);

        var $sexImg = $(".peopleInfo .allInfo .info .sex");
        if(obj.sex == 0){
            $sexImg.css("background-color","pink");
        }else{
            $sexImg.css("background-color","skyblue");
        }

        $myChallengeCount.html(obj.myChallenge);
        $mySelectionCount.html(obj.mySelection);
        $myfollowsCount.html(obj.myfollows);
        $myAchievementCount.html(obj.myAchievement);



    }

    compliePage()

    function compliePage(){

        $.ajax({
            url:window.actionUrl.getUserInfo.url,
            type:window.actionUrl.getUserInfo.type,
            data:getCommonReqData(),
            success:function(reply){
                console.log(reply)
                reply = checkReply(reply);
                if(!reply){return;}
                renderList(reply)
            },
            error:function(err){
                noNetwork();
            },
            complete:function(){

            }

        })
    }

    var $people = $(".peopleInfo");
    var $myChallenge = $(".mychallenge");
    var $mySelection = $(".mySelection");
    var $myfollows = $(".myfollows");
    var $myAchievement = $(".myAchievement");
    var $setting = $(".setting");
    var $feedBack = $(".feedBack")

    var arr = [$people,$myChallenge,$mySelection,$myfollows,$myAchievement,$setting,$feedBack];
    for(var i = 0; i < arr.length ; i++){
        arr[i].on("click",function(){
            // window.location.href = 
        })
    }




})