/**
 * Created by Administrator on 2015/11/8.
 */

var personalPage = (function(w,$,undefined){

    var config = {
        main_html:[
            '<div id = "{infoId}" class = "personalInfo {classSex}">',
            '<div class = "headBg">',
            '<div class = "headImg" psrc = "{headsrc}"></div>',
            '<div class =  "headInfo">',
            '<span class = "tableNum">{tableNum}</span>',
            '<span class = "dot">&nbsp·&nbsp</span>',
            '<span class = "nickname">{nickname}</span>',
            '<span class = "dot">&nbsp·&nbsp</span>',
            '<span class = "xingZuo">{xingZuo}</span>',
            '</div>',
            '</div>',
            '<div class = "below">',
            '<div class = "photos">',

            '</div>',
            '<div class = "originInfo">',
            '<div class = "infoTitle">个人基本信息</div>',
            '<div class = "age simpleInfo">',
            '<span class = "infoName">年龄</span>',
            '<span class = "infoContent">{age}</span>',
            '</div>',
            '<div class = "location simpleInfo">',
            '<span class = "infoName">城市</span>',
            '<span class = "infoContent">{city}</span>',
            '</div>',
            '</div>',
            '<div class = "selfIntro intro">',
            '<div class = "infoTitle">自我描述</div>',
            '<span class = "selfContent text">',
            '{selfContent}',
            '</span>',
            '</div>',
            '<div class = "reqIntro intro">',
            '<div class = "infoTitle">需求描述</div>',
            '<span class = "reqContent text">',
            '{reqContent}',
            '</span>',
            '</div>',
            '</div>',
            '</div>'
        ].join(""),

        personalInfoBg:[
            '<div id = "personalInfoBg" class = "personalInfoBg"></div>'
        ].join(""),

        upAndDown:[
            '<div id = "upAndDown" class = "upAndDown {classSex}">',
            '<button class = "up"></button>',
            '<button class = "down"></button>',
            '<div class = "middle"></div>',
            '</div>'
        ].join(""),
        upAndDownClass : ["middle","after1","after2","before2","before1"],
        upAndDownClassAfter : []
    },init,createDom,bindEvent;

    init = function ($container, data){
        var sendData = {
            "actId":data.actId,
            "actToken":data.actToken,
            "num":data.num,
            "sex":data.sex,
            "allPeople":data.allPeople || {}
        }

        config.$container = $container;
        config.sex = sendData.sex;
        config.nowNum = sendData.num;//当前的嘉宾号
        config.nowIdSex = config.sex == 0 ? "female" : "male";
        config.nowTableSex = config.sex == 0 ? "女" : "男";
        config.nowPersonId = config.nowIdSex + config.nowNum;
        config.allData = data.allPeople[config.nowIdSex] ;
        config.guestData = {};


        for(var i = 0; i<config.allData.length;i++){
            var thisPersonData = config.allData[i];
            var thisSexId = thisPersonData.sex == 0? "female" : "male";
            var thisNumId = thisPersonData.num
            var thisTableSex =  thisPersonData.sex == 0 ? "女" : "男"
            var thisId = thisSexId + thisNumId;
            var thisAge = getAgeFromDate(thisPersonData.birthday)
            var thisXingZuo = getXingZuoFromDate(thisPersonData.birthday)



            var thisPerson = {
                "infoId": thisSexId + thisNumId,
                "classSex":thisSexId,
                "tableNum": thisTableSex + thisNumId + "号",
                "nickname":thisPersonData.nickname||"",
                "xingZuo":thisXingZuo||"",
                "headSrc": thisPersonData.headImg||"",
                "headImage":thisPersonData.headImage ||"",
                "city": thisPersonData.province + thisPersonData.city||"",
                "age": thisAge || "",
                "selfContent": thisPersonData.selfIntro||"",
                "reqContent": thisPersonData.expectation||"",
                "photos":thisPersonData.photos||"",
                "num":thisPersonData.num || 0

            }
            config.guestData[thisId] = thisPerson;
        }
        createDom();
        bindEvent();

    }
    createDom = function(){
        var $container = config.$container;
        var data = config.guestData;
        var upAndDownTemp = format(config.upAndDown,{"classSex":config.nowIdSex});
        var time = 20;
        var domGroup = [];
        config.tmp = {};

        for(var i in data){

            config.tmp[data[i]] = format(config.main_html,data[i])

            if(!document.getElementById("personalInfoBg")){//添加背景
                console.log("会计核算发达国防建设大方asdhakjasdfkj")
                $container.html($(config.personalInfoBg))
                setTimeout(function(){
                    $("#personalInfoBg").addClass("onMove");
                },time)
            }
            if(!document.getElementById("upAndDown")){//添加底部按钮
                $container.append($(upAndDownTemp));
                setTimeout(function(){
                    $("#upAndDown").addClass("onMove");
                },time)
            }


            $container.append($(config.tmp[data[i]]));

            config.upAndDownClass = ["middle","after1","after2","before2","before1"];//初始化
            var thisNum = data[i].num;
            var nowNum = config.nowNum;
            var classNum = thisNum - nowNum >= 0 ? thisNum - nowNum : 5 + (thisNum - nowNum);

            $("#" + i).addClass(config.upAndDownClass[classNum])
            config.upAndDownClassAfter[thisNum - 1] = config.upAndDownClass[classNum]

            if (i != config.nowPersonId) {//不是当前的头像则直接输出，反正也看不见
                $("#" + i).addClass("onMove")
            }
            setTimeout(function () {
                $("#" + config.nowPersonId).addClass("onMove");
            }, time)
            //补全图像
            var headImage = data[i].headImage;//因为是在for中使用，可能会出问题
            _loadImg(headImage, $("#" + i + " .headBg .headImg"));
            var photos = data[i].photos;
            config.photos = photos;
            for (var r = 0; r < photos.length; r++) {//因为是在for中使用，可能会出问题
                var $dom = $('<div class = "img" psrc = ' +  photos[r]  + ' osrc = ' + photos[r] + ' ></div>');
                lazyLoadImg(photos[r], $dom);
                $("#" + i + " .photos").append($dom);
            }

        }



    };
    bindEvent = function(){
        $("#personalInfo").on('click',".personalInfo .below .photos .img",function(){//点击放大事件
            var osrc = $(this).attr('osrc');
            wxPreviewImg(osrc,config.photos);
        }).find('.img').each(function(){
            var psrc = $(this).attr('psrc');
            if(!psrc){return;}
            lazyLoadImg(psrc,this);
        });

        $("#personalInfoBg").on("click",function(){//进入与退出
            $("#personalInfo").children("div").each(function(){
                $(this).removeClass("onMove");
            })
            setTimeout(function(){
                $("#personalInfo").html("");
            },300)
        })


        //内容滑动问题==========================================================================================
        $("#" + config.personId + " .below").on("touchstart",function(event){
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
            console.log($(this).height())

        })
        $("#" + config.personId + " .below").on("touchmove",function(event){
            //event.preventDefault();
            var moveX = event.touches[0].pageX;
            var moveY = event.touches[0].pageY;
            var dY = moveY - startY;

        })
        $("#" + config.personId + " .below").on("touchend",function(event){
            endX = event.changedTouches[0].pageX;
            endY = event.changedTouches[0].pageY;

        })
        //内容滑动问题==========================================================================================

        //点击上下键
        var oldClassGroup = [];
        $("#upAndDown .down").on("click",function(){
            _cloneGroup(oldClassGroup,config.upAndDownClassAfter);
            config.upAndDownClassAfter.unshift(config.upAndDownClassAfter.pop());

            config.$container.children(".personalInfo").each(function(index,item){
                console.log("index",index)
                $(this).removeClass(oldClassGroup[index])
                console.log(oldClassGroup[index])
                $(this).addClass(config.upAndDownClassAfter[index])
                console.log(config.upAndDownClassAfter[index]);

            })
        })
        $("#upAndDown .up").on("click",function(){
            _cloneGroup(oldClassGroup,config.upAndDownClassAfter);
            config.upAndDownClassAfter.push(config.upAndDownClassAfter.shift());
            config.$container.children(".personalInfo").each(function(index,item){
                console.log("index",index)
                $(this).removeClass(oldClassGroup[index])
                console.log(oldClassGroup[index])
                $(this).addClass(config.upAndDownClassAfter[index])
                console.log(config.upAndDownClassAfter[index]);
            })
        })
    };


    _loadImg = function(img,container){
        container.html(img);

        var imgWidth = img.width;
        var imgHeight = img.height;
        var boxWidth = container.width();
        var boxHeight = container.height();
        var headImage = container.find("img");
        var theWidth,theHeight;

        if(imgWidth>imgHeight){
            theWidth = imgWidth*boxHeight/imgHeight
            headImage.css({"width":theWidth,"height":boxHeight})
        }else{
            theHeight = imgHeight*boxWidth/imgWidth
            headImage.css({"width":boxWidth,"height":theHeight})

        }
    };
    _cloneGroup = function(cloneGroup,old){
        for(var i=0;i<old.length;i++){
            cloneGroup[i] = old[i]
        }
        return cloneGroup;
    }

    return {init:init};


})(window,$)
