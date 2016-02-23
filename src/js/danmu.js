
/**
 * Created by Administrator on 2015/10/17.
 */
$(function(){
//开关
    var danmuSwitch = (function(w,$,undefined){
        var config = {
            main_html:[

                '<div class = "switch">',
                '<div class = "danmuTitle">弹幕</div>',
                '<div class = "greenBg">',
                '<div class = "button"></div>',
                '</div>',
                '</div>',
                '<div class = "discussZone" ></div>',
                '<div class = "myComment"></div>'
            ].join(""),
            refreshListIng : false,//这是弹幕函数开关
            refreshComment : false,//这是评论函数开关
            controller:1//这是弹幕开关

            },init,createDom,bindEvent;

        init = function($container){
            config.$container = $container;
            createDom();
            bindEvent();
        };

        createDom = function(){
            var $container = config.$container;
            var template = config.main_html;
            $container.html(template);
        };

        bindEvent = function(){
            var jieliu = true;

            openTheDanmu();
            openMyComment();


            $("#danmu .switch").on("click",function(){
                if(jieliu == false){return};
                jieliu = false;
                config.controller *= -1
                switch (config.controller){
                    //关闭弹幕
                    case -1:
                        $("#danmu .discussZone").html("");
                        $("#danmu .myComment").html("");
                        $("#danmu .switch .greenBg").css({"backgroundColor":"#a1a0a0"});
                        $("#danmu .switch .button").css("left","0.035rem");
                        setTimeout(function(){
                            jieliu = true;
                        },500)

                        config.refreshListIng = true;//闭上
                        console.log(config.refreshListIng)

                        //console.log(config.controller)
                        //refreshList(config.controller);
                        break;

                    //打开弹幕
                    case 1:
                        $("#danmu .switch .greenBg").css({"backgroundColor":"#1ead66"});
                        $("#danmu .switch .button").css("left","0.735rem");
                        setTimeout(function(){
                            jieliu = true;
                        },500);

                        config.refreshListIng = false;//开开
                        console.log(config.refreshListIng)

                        //ajax获取留言信息；
                        openTheDanmu();
                        openMyComment();

                        break;

                }
            })


            //17秒后每隔4s删除第一个dom

            var theYanshi = setTimeout(deleteDom,17000);

            function deleteDom(){
                setInterval(function(){
                    console.log($(".discussZone").length)
                    console.log($(".discussZone .allDiscuss").eq(0))
                    $(".discussZone .allDiscuss").eq(0).remove();

                },4000)
            }


            //控制所有动画的运动
            //function theInterval(){
            //
            //
            //    $("#danmu .discussZone .allDiscuss").each(function(){
            //        //console.log("每个都遍历1111")
            //        //var theFrom = $(document.body).width();
            //        var theTo = $(this).width() + 200;
            //        this.step = this.step || (Math.random()*3 + 1);
            //        console.log(this)
            //        console.log(this.step);
            //        var currentLeft = $(this).css("left") ;
            //        $(this).css("left", parseInt(currentLeft) - this.step + "px");
            //        if(parseInt(currentLeft) <= -theTo){
            //            $(this).remove();
            //        }
            //
            //    })
            //}
            //
            //var timer = setInterval(theInterval,30)
        };
        //打开弹幕的函数
        function renderDanmuList(list){

            var $container = $("#danmu .discussZone");
            var theListLength = list.length;
            if(theListLength<1){
                $container.html("");
                return;
            }
            //生产init弹幕条
            var theRandomInitNum = parseInt(Math.random()*theListLength);
            var thePastNum = 0;
            var fontSize = parseInt($(document.body).css("font-size"));
            var theDiscussHeight = 2.6;//这个地方不该写死
            var theBornTimer = setInterval(function(){
                //console.log("controller:"+controller)
                if(config.refreshListIng == true){
                    console.log("定时器中的阀门："+config.refreshListIng)
                    clearInterval(theBornTimer)
                    return;
                }
                var theRandomTop = parseInt(Math.random()*13);
                //console.log("过去的长度："+thePastNum);
                //console.log("改变之前现在的长度" + theRandomTop);

                //避免弹幕之间覆盖
                var theChengshu = ((theRandomTop - thePastNum)/Math.abs(theRandomTop - thePastNum)) ? ((theRandomTop - thePastNum)/Math.abs(theRandomTop - thePastNum)) : (Math.random()*2 + 1);
                theRandomTop = Math.abs(theRandomTop - thePastNum)>= theDiscussHeight ? theRandomTop : (theRandomTop + theDiscussHeight * theChengshu)
                //console.log("改变之后现在的长度" + theRandomTop);


                Discuss.init($container,list[theRandomInitNum],theRandomTop);
                theRandomInitNum = (theRandomInitNum+1)>(theListLength-1)?0:theRandomInitNum+1;

                thePastNum = theRandomTop;
            },4000)

        }
        function openTheDanmu(){
            console.log("---------------------")

            if(config.refreshListIng){return;}
            $.ajax({
                url:window.actionUrl.getBarrage.url,
                type:window.actionUrl.getBarrage.type,
                data:getCommonReqData(),
                success:function(reply){
                    reply = checkReply(reply);
                    if(!reply){return;}
                    renderDanmuList(reply.list);
                },
                error:function(err){
                    noNetwork();
                },
                complete:function(){
                    console.log("+++++++++++++++++++")
                    config.refreshListIng = false;
                }
            })
        }

        //打开我的评论的函数
        function renderMyComment(replyObj){
            var $container = $("#danmu .myComment");
            var theListLength = replyObj.length;
            if(theListLength<1){
                $container.html("");
                return;
            }
            MyComment.init($container,replyObj);

        }
        function openMyComment(){
            if(config.refreshComment){return;}
            config.refreshComment = true;

            $.ajax({
                url:window.actionUrl.getUserInfo.url,
                type:window.actionUrl.getUserInfo.type,
                data:getCommonReqData(),
                success:function(reply){
                    reply = checkReply(reply);
                    if(!reply){return;}
                    renderMyComment(reply);
                },
                error:function(err){
                    noNetwork();
                },
                complete:function(){
                    config.refreshComment = false;
                }
            })

        }





        return {init:init};

    })(window,$)

    //讨论区
    var Discuss = (function(w,$,undefined){

        var config = {
            main_html:[
                '<div class = "allDiscuss" id = "allDiscuss{userId}" >',
                '<div class = "headImg"></div>',
                '<div class="discuss">',
                '<div class = "nice">',
                '<div class="niceContent">',
                '<img src="../img/common/darkLogo.png" alt=""/>{niceNum}</div>',
                '</div>',
                '<div class = "content" id = "content{userId}">{comment}</div>',
                '</div>',
                '</div>'
            ].join(""),

            colorList:["rgb(112, 126, 172)",
                "rgb(164, 75, 194)","rgb(121, 165, 86)","rgb(176, 67, 101)","rgb(83, 58, 183)",
                "rgb(110, 178, 148)","#d73027","#b2182b","#4daf4a","#ff7f00","#984ea3"]
            },init,createDom,bindEvent;

        init = function($container,data,top,zIndex){

            //对于同一个id的discuss防止其重复初始化
            if(document.getElementById("allDiscuss"+data.userId)){
                console.log(data.userId + "这个元素已经存在")
                return
            }
            config.$container = $container;
            var personalDataId = data.userId;
            config[personalDataId] = data;
            config[personalDataId].top = top;
            config.bodyWidth = $(document.body).width();
            config[personalDataId].zIndex = zIndex;
            //计数器防止重复

            //config[personalDataId].count = config[personalDataId].count+1 || 1;
            //
            //if(config[personalDataId].count>1){
            //    console.log("重复初始化了呀")
            //    return;}

            createDom(personalDataId);
            bindEvent(personalDataId);
        }


        createDom = function(personalDataId){
            var $container = config.$container;
            var discussObj = {};

            discussObj.userId = config[personalDataId].userId;
            discussObj.niceNum = config[personalDataId].niceNum;
            discussObj.comment = config[personalDataId].content;
            var template = format(config.main_html,discussObj);
            $container.append($(template));

            var Id = config[personalDataId].userId

            //确定高度
            $("#danmu #allDiscuss" + Id).css("top",config[personalDataId].top + "rem");
            //确定内容宽度
            var fontSize = parseInt($(document.body).css("font-size"));
            var contentFontSize = parseInt($("#danmu .content").css("font-size"));
            var contentWidth = parseInt(config[personalDataId].content.length * contentFontSize);
            $("#danmu #allDiscuss"+Id+" .discuss").css("width",contentWidth/fontSize + 4.5 +"rem");
            //头像
            lazyLoadImg(config[personalDataId].headImg,$("#danmu #allDiscuss" + Id +" .headImg"))
            //点赞区颜色
            var theColorLength = config.colorList.length;
            config[personalDataId].colorNum = parseInt((Math.random()*theColorLength));
            //储存下不同ID的颜色值
            var colorNum = config[personalDataId].colorNum;
            var theRandomColor = config.colorList[colorNum]
            $("#danmu #allDiscuss" + Id + " .discuss .nice").css("background-color",theRandomColor)
            //点赞区长度
            var theNiceNum = config[personalDataId].niceNum;
            var theOriginLength = Math.random()*1 + 3;
            config[personalDataId].theNiceOriginLength = theOriginLength * fontSize;
            var theAllWidth =  $("#danmu #allDiscuss"+Id+" .discuss").width();
            var theOtheLength = theAllWidth/fontSize - theOriginLength;
            var yuShu = theNiceNum%10;
            var theNiceLength = theOriginLength + yuShu*theOtheLength/10;
            $("#danmu #allDiscuss" + Id + " .discuss .nice").css("width",theNiceLength + "rem");

            //储存discss长度
            config[personalDataId].theWidth =  $("#danmu #allDiscuss" + Id).width() + $("#danmu #allDiscuss" + Id +" .niceContent").width() + 100;
            //起始z-index
            $("#danmu #allDiscuss" + Id).css("z-index",config[personalDataId].zIndex)
            //起始位置
            $("#danmu #allDiscuss" + Id).css("left",config.bodyWidth + "px");


        };

        bindEvent = function(personalDataId){
            var Id = config[personalDataId].userId;
            var niceController = {};
            niceController[Id] = true;
            var fontSize = parseInt($(document.body).css("font-size"));



            $("#danmu #allDiscuss" + Id).on("click",function(){
                console.log("点中了点中了点中了点中了点中了点中了点中了点中了")
                //截流
                if(niceController[Id] == false){return;}
                niceController[Id] = false;

                //点赞数字增长
                console.log(config[personalDataId].niceNum)

                config[personalDataId].niceNum++;
                console.log(config[personalDataId].niceNum)
                var thePlusNum = config[personalDataId].niceNum;
                $("#danmu #allDiscuss" + Id + " .discuss .nice .niceContent").html('<img src="../img/common/darkLogo.png" alt=""/>' + thePlusNum + '</div>')

                //发送点赞数据
                //$.ajax();=============================此处应有ajax=========================================
                //$.ajax();=============================此处应有ajax=========================================
                //$.ajax();=============================此处应有ajax=========================================
                //$.ajax();=============================此处应有ajax=========================================
                //$.ajax();=============================此处应有ajax=========================================

                //到十变色
                var theNiceNum = config[personalDataId].niceNum;
                var theColorNum = config[personalDataId].colorNum;
                //if(theNiceNum%10 == 0 ){
                //    //console.log(1111111111111111)
                //    theColorNum = (theColorNum+1) > (config.colorList.length - 1) ? 0 : theColorNum + 1;
                //    //console.log(theColorNum)
                //    //console.log(config.colorList.length)
                //    config[personalDataId].colorNum = (config[personalDataId].colorNum + 1)>(config.colorList.length - 1) ? 0 : (config[personalDataId].colorNum + 1)
                //    //console.log(theColorNum)
                //    var theRandomColor = config.colorList[theColorNum]
                //    $("#danmu #allDiscuss" + Id + " .discuss .nice").css("background-color",theRandomColor)
                //
                //}
                ////不到十也变色
                theColorNum = (theColorNum+1) > (config.colorList.length - 1) ? 0 : theColorNum + 1;
                config[personalDataId].colorNum = (config[personalDataId].colorNum + 1)>(config.colorList.length - 1) ? 0 : (config[personalDataId].colorNum + 1);
                var theRandomColor = config.colorList[theColorNum];
                $("#danmu #allDiscuss" + Id + " .discuss .nice").css("background-color",theRandomColor)



                //点赞背景变长
                var theWidth = $("#danmu #allDiscuss" + Id + " .discuss").width()
                var theOriginLength = config[personalDataId].theNiceOriginLength
                var oneToTen = ( theWidth - theOriginLength)/10;
                //var yuShu = (config[personalDataId].niceNum % 10 == 0) ? 10 :(config[personalDataId].niceNum%10);
                var yuShu = 10;
                var theFinalLength = theOriginLength/fontSize;
                theFinalLength = theFinalLength + oneToTen*yuShu/fontSize

                $("#danmu #allDiscuss" + Id + " .discuss .nice").css("width", theFinalLength + "rem");
            })


            //运动 --- 这是用css去实现
                //终点距离
            var theTo = $("#danmu #allDiscuss" + Id).width() + 200;

            $("#danmu #allDiscuss" + Id).css("transition","all 16s linear 0s").css("left",-theTo + "px")
            //到点删除
            //config[personalDataId].timer = setTimeout(function(){
            //    $("#danmu #allDiscuss" + Id).remove();
            //},17000)




            ////运动 --- 这是控制个体的，现在我们要控制全体。
            //clearInterval(config[personalDataId].discussTimer)
            //var theLength = config[personalDataId].theWidth;//总路程
            ////console.log(theLength)
            //config.discussTimer = setInterval(function(){
            //
            //    //需要判断当开关闭合或打开时，是否关闭定时器
            //    if($("#danmu .switch .button").css("left") == "0.035rem"){//这是关闭，清空
            //        clearInterval(config[personalDataId].discussTimer);
            //        return;
            //    }
            //
            //
            //    var theCurrent = parseInt($("#danmu #allDiscuss" + Id).css("left"));
            //    var step = 4;
            //    $("#danmu #allDiscuss" + Id).css("left",theCurrent - step + "px");
            //    //console.log(theCurrent)
            //    if(theCurrent <= -theLength){
            //        $("#allDiscuss"+Id).remove()
            //        clearInterval(config[personalDataId].discussTimer);
            //    }
            //},30);


        }

        return {init:init}
    })(window,$);

    //我的评论
    var MyComment = (function(w,$,undefined){

        var config = {
            main_html:[
                '<div class = "userComment">',
                '<div class="commentZone">',
                '<div class="myHeadImg"></div>',
                '<input class = "theComment" type="text" placeholder = "请写下你的评论..."/>',
                '</div>',
                '<div class = "send">发射</div>',
                '</div>'

            ].join("")
            },init,createDom,bindEvent;

        init = function($container,data){
            config.$container = $container;
            config.data = data;
            createDom();
            bindEvent();
        };

        createDom = function(){
            var $container = config.$container;
            var data = config.data;
            $container.html(config.main_html);

            //附加头像
            lazyLoadImg(data.headImg,$("#danmu .myComment .userComment .myHeadImg"))

        };

        bindEvent = function(){
            //点击事件
            var $send = $("#danmu .userComment .send");
            var $myComment = $("#danmu .userComment .theComment");
            var count = 10;

            $send.on("click",function(){
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================
                //此处应有ajax发往数据库=================================================================

                //
                var theCommentValue = $myComment.attr("value")
                var theRandomTop = parseInt(Math.random()*13);
                var $discussContainer = $("#danmu .discussZone");


                //console.log($discussContainer)
                //设置新的评论条的属性
                if(theCommentValue.trim() == ""){return}
                var theDiscussData = {};
                theDiscussData.userId = config.data.uniId;
                theDiscussData.headImg = config.data.headImg;
                theDiscussData.niceNum = 0;
                theDiscussData.content = theCommentValue;
                //console.log(theDiscussData)
                //init新的评论条
                var zIndex = 9999;


                if(document.getElementById("allDiscuss"+config.data.uniId)){
                    console.log(config.data.uniId + "这个元素已经存在")
                    return
                }else{
                    Discuss.init($discussContainer,theDiscussData,theRandomTop,zIndex);
                    $myComment.get(0).value = "";
                    $send.css("backgroundColor","#cccccc");
                    $send.html("10");





                }




                //点击发送后的效果；

                //10秒内不能重新发送


                var sendTimer = setInterval(function(){
                    console.log(count)
                    count--;
                    if(count <= 0){
                        $send.css("backgroundColor","#2b9f2c")

                        $send.html("发射");
                        $send.disabled = false;
                        count = 10;
                        clearInterval(sendTimer)

                    }else{
                        $send.html(count + "s")  ;
                    }
                },1000);






            })

        }

        window.String.prototype.trim=function() {

            return this.replace(/(^\s*)|(\s*$)/g,'');
        }

        return {init:init};



    })(window,$);

    document.body.className = "noTab";
    danmuSwitch.init($("#danmu"));




})

