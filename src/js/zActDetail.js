/**
 * Created by Administrator on 2015/11/3.
 */
Z(function(){
    var $ = Z;
    var actId = getValueFromSearch("actId");
    var actToken = getValueFromSearch("actToken");

    var $leftButtonClicked = Z("#footer .left");
    var $rightButton = Z("#footer .left");
    var leftButtonClicked;
    var leftBUttonClicked;

    var theTemp = {
        guest:[
            '<div class = "guestCard {direction}" guestNum = "{guestNum}" sex = "{sex}">',
            '<div class = "head" psrc = "{head}"></div>',
            '<div class = "guestInfo">',
            '<div class = "guestNum">{sexName}{num}</div>',
            '<div class = "guestName">{name}</div>',
            '</div>',
            '</div>'
        ].join(""),

        line:['<div class = "cardLine"></div>'].join("")
    }

    Z.ajax({
        url:window.actionUrl.getActDetail.url,
        type:window.actionUrl.getActDetail.type,
        data: $.extend({actId:actId,actToken:actToken},getCommonReqData()),
        success:function(reply){
            reply = checkReply(reply)
            if(!reply){return};
            console.log(reply)
            renderDetails(reply);
            renderGuestList(reply.males,reply.females);

        },
        error:function(err){
            noNetwork();
        }
    })
    function renderDetails(reply){
        var $head = $(".actInfo .personalInfo .head");
        var $actBg = $(".actInfo");
        var $danmuNum = $(".num.danmu")
        var $qianxianNum = $(".num.qianxian")
        var $weiguanNum = $(".num.weiguan")


        $("#actName").html(reply.title);
        $("#actDate").html(reply.createTime);
        $("#actCreator").html("由" + reply.creatorName + "创建");
        lazyLoadImg(reply.creatorHead,$head)
        var coverWidth = $actBg.width();
        var coverHeight = $actBg.height();
        var coverParams = '?' + qnImg.base() + qnImg.and + qnImg.min(coverWidth,coverHeight) + qnImg.and + qnImg.blur(15,5);
        lazyLoadImg(reply.cover + coverParams,$actBg);
        $danmuNum.html(reply.danmuNum);
        $qianxianNum.html(reply.qianXianNum);
        $weiguanNum.html(reply.visitorNum)


    }

    function renderGuestList(males,females){
        var theGuest = theTemp.guest;
        var $theTable = $(".theTable")
        var theMaleObj = {};
        var theFemaleObj = {};
        var Men = [];
        var Women = [];
        var headSize = 2*window.fontSize;
        var headParam = "?" + qnImg.base() + qnImg.and + qnImg.min(headSize*window.dpi,headSize*window.dpi);
        for(var i=0;i<males.length;i++){//排序
            var thisMen = males[i];
            Men[thisMen.guestNumber - 1] = thisMen;
        }
        for(var i=0 ;i<females.length;i++){
            var thisWomen = females[i];
            Women[thisWomen.guestNumber - 1] = thisWomen;
        }

        for(var i=0;i<Women.length;i++){//生产dom

            var $theLine = $(theTemp.line);

            theFemaleObj = {
                head:Women[i].headImg + headParam,
                sexName:"女",
                sex:0,
                num:Women[i].guestNumber,
                name:Women[i].nickname,
                guestNum:Women[i].guestNumber,
                direction:"left"

            }
            $theLine.append(format(theGuest,theFemaleObj));

            theMaleObj = {
                head:Men[i].headImg + headParam,
                sexName:"男",
                sex:1,
                num:Men[i].guestNumber,
                name:Men[i].nickname,
                guestNum:Men[i].guestNumber,
                direction:"right"

            }
            $theLine.append(format(theGuest,theMaleObj));
            $theTable.append($theLine)
        }


        $(".theTable .guestCard .head").each(function(){//加载头像
            lazyLoadImg($(this).attr("psrc"),$(this))
        })
        $(".theTable .guestCard").on("click",function(){
            window.location.href = "guestInfo.html" + getCommonParams()
            + "&actId=" + encodeURIComponent(actId) + "&actToken=" + actToken
            + "&sex=" + encodeURIComponent($(this).attr("sex")) + "&num=" + encodeURIComponent($(this).attr("guestNum"));
        });

    }



})