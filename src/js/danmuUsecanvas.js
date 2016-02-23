/**
 * Created by Administrator on 2015/10/17.
 */


// -------------------------------------------------说明文档---------------------------------------------------------------
//使用前需要引入danmuUseCanvas.css样式文件
// 并在html中新建<div id = "danmu"></div>标签，
//在js文件中设定document.body.className = "noTab" ;并以在大闭包中以 danmuSwitch.init($("#danmu"))启动整个弹幕（已经在最底部写好）
//每一个小块都主要以init()初始化，creatDom()创建dom，bindEvent()绑定事件这三大部分组成
//------------------------------------------------------------------------------------------------------------------------




var $ = window.Z;

$(function(){
    var actId = getValueFromSearch("actId");
    //开关
    var danmuSwitch = (function(w,$,undefined){
        var config = {//装载这个模块的全局变量
            main_html:[

                '<div class = "switch">',
                '<div class = "danmuTitle">弹幕</div>',
                '<div class = "greenBg">',
                '<div class = "button"></div>',
                '</div>',
                '</div>',
                '<div class = "discussZone" ></div>',
                '<div class = "myComment"></div>',

            ].join(""),
            refreshListIng : false,//这是弹幕函数开关
            refreshComment : false,//这是评论函数开关
            controller:-1//这是弹幕开关

            },init,createDom,bindEvent;

        init = function($container){//初始化
            config.$container = $container;
            createDom();
            bindEvent();
        };

        createDom = function(){//建造dom
            var $container = config.$container;
            var template = config.main_html;
            $container.html(template);
        };

        bindEvent = function(){//绑定事件
            var jieliu = true;

            getTheDanmuData();//事先加载数据

            $("#danmu .switch").on("click",function(){
                if(jieliu == false){return};
                jieliu = false;
                config.controller *= -1//设置阀门
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
                        window.tt.stop();
                        break;

                    //打开弹幕
                    case 1:
                        $("#danmu .switch .greenBg").css({"backgroundColor":"#1ead66"});
                        $("#danmu .switch .button").css("left","0.735rem");
                        setTimeout(function(){
                            jieliu = true;
                        },500);

                        config.refreshListIng = false;//开开
                        //ajax获取留言信息；

                        renderDanmuList(config.data);
                        //window.tt.start();
                        openMyComment();//打开评论框

                        break;

                }
            })

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
            discussCanvas.init($container,list);
        }
        function getTheDanmuData(){
            if(config.refreshListIng){return;}
            $.ajax({
                url:window.actionUrl.getBarrage.url,
                type:window.actionUrl.getBarrage.type,
                data:getCommonReqData(),
                success:function(reply){
                    reply = checkReply(reply);
                    if(!reply){return;}
                    config.data = reply.list
                },
                error:function(err){
                    noNetwork();
                },
                complete:function(){
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

            ].join(""),
            refreshComment : false
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
            var jieliu = true;

            $send.on("click",function(){
                if(jieliu == false){return};
                //console.log($discussContainer)
                //设置新的评论条的属性
                var theCommentValue = $myComment.attr("value")
                if(theCommentValue.trim() == ""){return}
                var theDiscussData = {};
                var randY = Math.floor(Math.random()*(window.tt.canvas.height - window.tt.itemHeight));
                theDiscussData.uniId = config.data.uniId;
                theDiscussData.head = config.data.headImg;
                theDiscussData.num = 0;
                theDiscussData.text = theCommentValue;
                theDiscussData.parent = window.tt;
                theDiscussData.pos = {
                    x:window.tt.canvas.width + Math.floor(Math.random() * 40 + 40),//弹幕初始的x位置
                    y:randY
                }


                if(theDiscussData.uniId in window.tt.itemMap){
                    console.log(config.data.uniId + "这个元素已经存在")
                    return
                }else{
                    window.tt.itemMap[theDiscussData.uniId] = new discussCanvas.DanMuItem(theDiscussData);
                    //发送成功
                    //================================ajax===================================================
                    sendDanmu()
                    //================================ajax===================================================

                    $myComment.get(0).value = "";
                    $send.css("backgroundColor","#cccccc");
                    $send.html("10");
                    jieliu = false;
                }

                //记录新的信息，以便发送用
                 config.theNewCommonReqData = $.extend(getCommonReqData(),{actId:actId,
                     text:theCommentValue});




                //10秒内不能重新发送
                var sendTimer = setInterval(function(){
                    //console.log(count)
                    count--;
                    if(count <= 0){
                        $send.css("backgroundColor","#2b9f2c")
                        $send.html("发射");
                        count = 10;
                        jieliu = true;
                        clearInterval(sendTimer)


                    }else{
                        $send.html(count + "s");

                    }
                },1000);


            })

        }


        //定义发送弹幕数据的ajax
        function sendDanmu(){
            if(config.refreshComment){return;}
            config.refreshComment = true;

            $.ajax({
                url:window.actionUrl.sendBarrage.url,
                type:window.actionUrl.sendBarrage.type,
                data:config.theNewCommonReqData,
                success:function(reply){
                    if(reply.status != 0){
                        throw error("发送失败");
                    }
                    console.log("发送成功")
                },
                error:function(err){
                    noNetwork();
                },
                complete:function(){
                    config.refreshComment = false;
                }
            })

        }



        window.String.prototype.trim=function() {

            return this.replace(/(^\s*)|(\s*$)/g,'');
        }

        return {init:init};



    })(window,$);

    //canvas
    var discussCanvas = (function(window,$,undefined){
        var config = {
            main_html : [
                '<canvas id = "discussCanvas" ></canvas>'
            ].join(""),

            },init,creatDom,startDanmu,bindEvent,theFontSize;
        init = function($container,data){
            config.data = data;
            //console.log(data);

            config.$container = $container
            creatDom();
            startDanmu();
            bindEvent();

        };


        theFontSize = parseInt( $(document.body).css("font-size") );
        creatDom = function(){
            config.$container.html(config.main_html);

            //属性初始化
            config.canvas = document.getElementById("discussCanvas");
            config.theBodyWidth = $(document.body).width();
            config.theCanvasHeight = 20.1 * theFontSize;
            //初始化canvas属性
            config.canvas.style.width = config.theBodyWidth + "px";
            config.canvas.style.height = config.theCanvasHeight + "px";
            config.canvas.width = dpi * config.theBodyWidth;
            config.canvas.height = dpi * config.theCanvasHeight;

            //ctx
        };
        startDanmu = function(){//初始化
            window.tt = new DanMu({
                canvas:Z('#discussCanvas')[0],
                data:config.data,
                minSpeed:1,
                maxSpeed:3.1,
                minNum:4,
                itemHeight:30,
                boxHeight:300,
                itemBorderSize:2,
                itemBorderColor:'#fff',
                textColor:'#fff',
                textSize:14,
                maxText:30,
                zanEmptyImg:'../img/danmu/zanEmpty.png',
                zanFillImg:'../img/danmu/zanFill.png',
                zanWidth:18,
                bgColor:'rgba(0,0,0,0.5)'
            });
            window.tt.start();
        };
        bindEvent = function(){

            $("#discussCanvas").get(0).addEventListener("touchend",function(e){
                var clickX = e.changedTouches[0].clientX;
                var clickY = e.changedTouches[0].clientY - 4.8*theFontSize;
                var plusY =  tt.itemHeight;
                var tmpArr = {};


                //点击事件

                for(var i in tt.itemMap){
                    var thisDanmu = tt.itemMap [i]
                    if(clickX >= thisDanmu.pos.x/dpi && clickX <= (thisDanmu.pos.x + thisDanmu.canvas.width)/dpi){
                        if(clickY >= thisDanmu.pos.y/dpi && clickY <= (thisDanmu.pos.y + plusY)/dpi){
                            tmpArr = thisDanmu

                        }
                    }

                };

                if(tmpArr && !tmpArr.hasNiced){
                    // ---------------------------------------ajax-----------------------------------------------
                    sendNice(tmpArr.uniId);
                    // ---------------------------------------ajax-----------------------------------------------
                    tmpArr.hasNiced = true;
                    tmpArr.num++;
                }
            })
        };

        //点赞发送ajax
        function sendNice(uniId){
            if(config.refreshComment){return;}
            config.refreshComment = true;

            $.ajax({
                url:window.actionUrl.praise.url,
                type:window.actionUrl.praise.type,
                data: $.extend(getCommonReqData(),{uniId:uniId}),
                success:function(reply){
                    if(reply.status != 0){
                        throw error("发送失败");
                    }
                    //console.log("发送成功")
                },
                error:function(err){
                    noNetwork();
                },
                complete:function(){
                    config.refreshComment = false;
                }
            })
        }


        function DanMu(option){
            if(!option||!option.canvas){
                throw '弹幕的canvas未指定';
                return;
            }
            this.canvas = option.canvas;
            this.ctx = this.canvas.getContext('2d');

            var tmpWidth = Math.floor(option.boxWidth||document.body.offsetWidth);
            var tmpHeight = Math.floor(option.boxHeight||500);

            this.canvas.style.width = tmpWidth+'px';
            this.canvas.style.height = tmpHeight+'px';

            this.dpi = window.devicePixelRatio||2;//解决retina屏幕上不清晰的问题

            this.canvas.width = Math.floor(this.dpi*tmpWidth);
            this.canvas.height = Math.floor(this.dpi*tmpHeight);

            this.itemHeight = Math.floor(this.dpi*(option.itemHeight||30));//每一条弹幕的高度
            this.itemBorderColor = option.itemBorderColor||'#ffffff';//每一条弹幕的边框颜色

            this.itemBorderSize = Math.floor(this.dpi*(option.itemBorderSize||2));//每一条弹幕的边框厚度

            this.bgColor = option.bgColor||'rgba(0,0,0,0.5)';//弹幕背景色
            this.textColor = option.textColor||'#ffffff';//弹幕文字颜色
            this.textSize = Math.floor(this.dpi*(option.textSize||14));//弹幕文字大小
            this.maxText = option.maxText||30;//每一条弹幕最多显示字数

            this.zanEmptyImg = option.zanEmptyImg;//弹幕点赞图片(未赞)
            this.zanFillImg = option.zanFillImg;//弹幕点赞图片(已赞)
            this.zanWidth = Math.floor(this.dpi*(option.zanWidth||18));//弹幕点赞图片宽度

            this.minSpeed = Math.floor(this.dpi*(option.minSpeed||5));//弹幕最小移动速度
            this.maxSpeed = Math.floor(this.dpi*(option.maxSpeed||10));//弹幕最小移动速度，实际移动速度在区间中随机

            this.data = option.data||[];//记录所有需要显示的弹幕的数组
            this.minNum = option.minNum||10;//任意时刻真实存在的弹幕Item的个数

            this.uni = 0;
            this.zanOnload = false;

            //console.log(this.data);


            this.init();

        }
        DanMu.prototype.unikey = function(){//返回唯一Key
            return 'k'+(++this.uni);
        }
        DanMu.prototype.add = function(n){//添加N条弹幕
            if(!n){return;}
            var t = this;
            var i = 0;
            var tmpData;
            var randX,randY;
            var niceLength;
            for(i = 0; i < n; i++){


                t.dataIndex = t.dataIndex+1 >= t.data.length ? 0: t.dataIndex+1
                tmpData = t.data[t.dataIndex];

                randY = Math.floor(Math.random()*(t.canvas.height-t.itemHeight));

                t.itemMap[t.unikey()] = new DanMuItem({
                    parent:t,
                    uniId:tmpData.uniId||0,
                    head:tmpData.headImg||'',//依照mock中数据结构修改
                    text:tmpData.text||'',
                    num:tmpData.praised||0,
                    ts:tmpData.ts||0,
                    pos:{
                        x:t.canvas.width + Math.floor(Math.random() * 40 + 40),//弹幕初始的x位置
                        y:randY
                    },

                });
            }
        }
        DanMu.prototype.start = function(){//开始动画


            var t = this;
            t.loop = true;
            var raf = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function (callback){window.setTimeout(callback, 17);};

            function ani(){
                if(!t.loop){return;}

                var key;

                t.ctx.clearRect(0,0,t.canvas.width,t.canvas.height);
                var diedNum = 0;
                for(key in t.itemMap){
                    if(t.itemMap[key].draw().move().died){
                        delete t.itemMap[key];
                        diedNum++;
                    }
                }
                t.add(diedNum);
                raf(ani);
            }

            ani();
        }
        DanMu.prototype.stop = function(){//暂停动画
            this.loop = false;
        }
        DanMu.prototype.init = function(){//初始化，绘制可能复用的canvas
            var t = this;
            var borderSize = t.itemBorderSize;
            var iHeight = t.itemHeight;
            var borderColor = t.itemBorderColor;
            var ctx;

            t.headCanvas = document.createElement('canvas');// 绘制左侧头像的圆环
            t.headCanvas.width = t.headCanvas.height = iHeight;
            ctx = t.headCanvas.getContext('2d');
            ctx.fillStyle = borderColor;
            var r = iHeight/2;
            var rx = r;
            var ry = r;
            ctx.beginPath();
            ctx.arc(rx,ry,r,0,2*Math.PI);
            ctx.fill();

            t.leftCircle = document.createElement('canvas');// 绘制左侧矩形的圆角
            t.leftCircle.height = iHeight;
            t.leftCircle.width = Math.floor(iHeight/2);
            ctx = t.leftCircle.getContext('2d');
            ctx.fillStyle = t.bgColor;
            //console.log('leftCircle bgColor',ctx.fillStyle);
            ctx.beginPath();
            r = t.leftCircle.width - borderSize;
            rx = t.leftCircle.width;
            ry = t.leftCircle.height/2;
            ctx.arc(rx,ry,r,0.5*Math.PI,1.5*Math.PI);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = borderColor;
            ctx.beginPath();
            ctx.moveTo(t.leftCircle.width,0);
            ctx.lineTo(t.leftCircle.width,borderSize);
            ctx.arc(rx,ry,r,1.5*Math.PI,0.5*Math.PI,true);
            ctx.lineTo(t.leftCircle.width,t.leftCircle.height);
            r = t.leftCircle.width;
            ctx.arc(rx,ry,r,0.5*Math.PI,1.5*Math.PI);
            ctx.closePath();
            ctx.fill();

            t.rightCircle = document.createElement('canvas');// 绘制右侧矩形的圆角
            t.rightCircle.height = iHeight;
            t.rightCircle.width = Math.floor(iHeight/2);
            ctx = t.rightCircle.getContext('2d');
            ctx.fillStyle = t.bgColor;
            ctx.beginPath();
            r = t.rightCircle.width - borderSize;
            rx = 0;
            ry = t.rightCircle.height/2;
            ctx.arc(rx,ry,r,1.5*Math.PI,0.5*Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = borderColor;
            ctx.moveTo(0,0);
            ctx.lineTo(0,borderSize);
            ctx.arc(rx,ry,r,1.5*Math.PI,0.5*Math.PI);
            ctx.lineTo(0,t.rightCircle.height);
            r = t.rightCircle.width;
            ctx.arc(rx,ry,r,0.5*Math.PI,1.5*Math.PI,true);
            ctx.closePath();
            ctx.fill();

            t.centerBg = document.createElement('canvas');//绘制中间可以拉伸的矩形
            t.centerBg.height = iHeight;
            t.centerBg.width = t.centerBg.height;//可以拉伸
            var centerCtx = t.centerBg.getContext('2d');
            centerCtx.fillStyle = t.bgColor;
            centerCtx.fillRect(0,borderSize,t.centerBg.width,t.centerBg.height-2*borderSize);

            centerCtx.fillStyle = borderColor;
            centerCtx.fillRect(0,0,t.centerBg.width,borderSize);
            centerCtx.fillRect(0,t.centerBg.height-borderSize,t.centerBg.width,borderSize);


            //zanEmptyImg
            var zanEmpty = new Image();
            zanEmpty.src = t.zanEmptyImg;
            zanEmpty.onload = function(){
                t.drawZan(this,"emptyZan");
                delete this;
            }

            //zanfillImg
            var zanFill = new Image();
            zanFill.src = t.zanFillImg;
            zanFill.onload = function(){
                t.drawZan(this,"fillZan");
                delete this;
            }







            t.itemMap = {};//弹幕队列，注意清理移出屏幕的弹幕
            t.dataIndex = 0;//当前展示到的弹幕的位置
            t.add(t.minNum);
        }
        DanMu.prototype.drawZan = function(img,name){

            var t = this;
            t.zanOnload = true;

            t[name] = document.createElement("canvas");
            t[name].width = img.width;
            t[name].height = img.height;
            var zanWidth = img.width;
            var zanHeight = img.height;

            t[name].getContext("2d").drawImage(img,0,0,zanWidth,zanHeight);
        }


        function DanMuItem(option){
            this.parent = option.parent;
            this.head = option.head;
            this.text = option.text.substring(0,this.parent.maxText);
            this.num = option.num;
            this.pos = option.pos;
            this.uniId = option.uniId;
            this.ts = option.ts;
            this.hasNiced = false;
            this.colorList = ["rgb(112, 126, 172)",
                "rgb(164, 75, 194)","rgb(121, 165, 86)","rgb(176, 67, 101)","rgb(83, 58, 183)",
                "rgb(110, 178, 148)","#d73027","#b2182b","#4daf4a","#ff7f00","#984ea3"]
            this.niceColor = this.colorList[Math.floor(Math.random()*(this.colorList.length))];
            this.init();
            return this;
        }
        DanMuItem.prototype.init = function(){
            var t = this;
            var pa = t.parent;

            t.speed = Math.floor(pa.minSpeed+Math.random()*(pa.maxSpeed-pa.minSpeed));

            t.canvas = document.createElement('canvas');
            t.canvas.height = pa.itemHeight;

            t.rectWidth = (t.text.length+6)*pa.textSize;
            t.canvas.width = t.rectWidth+pa.itemHeight;

            var numWidth = (''+t.num).length;
            var buttonPercent = (t.num%10)/10;//宽度按点赞数字的尾数计算
            //var buttonPercent = 10/10;//宽度按点赞数字的尾数计算

            var buttonMinWidth = Math.floor(pa.zanWidth+pa.textSize*(numWidth));//数字长度决定的最小宽度

            var buttonPercentWidth = Math.floor((t.canvas.width - pa.itemHeight) * buttonPercent - pa.itemHeight);//按尾数决定的百分比宽度
            t.niceFullWidth = Math.floor((t.canvas.width - pa.itemHeight) * 1 - pa.itemHeight);
            t.buttonWidth = Math.max(buttonMinWidth,buttonPercentWidth) ;//取较大值(由于超过了一定长度，修正减40)
            t.numWidth = numWidth * pa.textSize / 1.5;
            t.niceWidth = 3 * pa.textSize / 2;
            //console.log(numWidth)



            t.died = false;

            t.drawNiceContent();//画中间点赞条
            t.drawNum("before");
            t.drawNum("after");


            t.drawBuff();//绘制自身到缓存画布中

            var imgNode = document.createElement('img');//画头像
            imgNode.onload = function(){
                t.drawHead(this);
                delete this;
            }
            imgNode.src = t.head;

            return t;
        }
        DanMuItem.prototype.drawHead = function(imgNode){//绘制用户头像
            var t = this;
            if(!imgNode||t.died){return;}
            var pa = t.parent;
            var tmpCanvas = document.createElement('canvas');
            var ctx = tmpCanvas.getContext('2d');
            var imgWidth = imgNode.width;
            var imgHeight = imgNode.height;
            var imgSize = pa.itemHeight - 2*pa.itemBorderSize;
            tmpCanvas.width = imgSize;
            tmpCanvas.height = imgSize;
            var headScale,longSize,headX,headY;//计算如何使头像居中填充
            if(imgWidth<imgHeight){
                headScale = imgSize/imgWidth;
                longSize = headScale*imgHeight;
                headX = 0;
                headY = (imgSize-longSize)/2;
                ctx.drawImage(imgNode,headX,headY,imgSize,longSize);
            }
            else{
                headScale = imgSize/imgHeight;
                longSize = headScale*imgWidth;
                headX = (imgSize-longSize)/2;
                headY = 0;
                ctx.drawImage(imgNode,headX,headY,longSize,imgSize);
            }
            var cx = imgSize/2;
            var cy = imgSize/2;
            var sr = imgSize/2;

            //清除头像的四角
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx,cy,sr,0,1*Math.PI);
            ctx.lineTo(0,imgSize);
            ctx.lineTo(imgSize,imgSize);
            ctx.closePath();
            ctx.clip();
            ctx.clearRect(0,0,imgSize,imgSize);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(cx,cy,sr,0,1*Math.PI,true);
            ctx.lineTo(0,0);
            ctx.lineTo(imgSize,0);
            ctx.closePath();
            ctx.clip();
            ctx.clearRect(0,0,imgSize,imgSize);

            var borderSize = pa.itemBorderSize;
            ctx = t.canvas.getContext('2d');
            ctx.drawImage(tmpCanvas,borderSize,borderSize);
        }
        DanMuItem.prototype.drawNiceContent = function(){
            var t = this;
            var pa = this.parent;
            var iHeight = pa.itemHeight;
            var borderSize = pa.itemBorderSize;
            var cHeight = t.canvas.height;
            var ctx;


            //画点赞区右边圆角
            t.rightNiceCircle = document.createElement('canvas');
            t.rightNiceCircle.height = iHeight;
            t.rightNiceCircle.width = Math.floor(iHeight/2);
            ctx = t.rightNiceCircle.getContext('2d');
            ctx.fillStyle = t.niceColor;
            ctx.beginPath();
            var r = t.rightNiceCircle.width - borderSize;
            var rx = 0;
            var ry = t.rightNiceCircle.height/2;
            ctx.arc(rx,ry,r,1.5*Math.PI,0.5*Math.PI);
            ctx.fill();


            //画点赞区左边圆角
            t.leftNiceCircle = document.createElement('canvas');
            t.leftNiceCircle.height = iHeight;
            t.leftNiceCircle.width = Math.floor(iHeight/2);
            ctx = t.leftNiceCircle.getContext('2d');
            ctx.fillStyle = t.niceColor;
            ctx.beginPath();
            var r = t.leftNiceCircle.width - borderSize;
            var rx = t.leftNiceCircle.width;
            var ry = t.leftNiceCircle.height/2;
            ctx.arc(rx,ry,r,0.5*Math.PI,1.5*Math.PI);
            ctx.closePath();
            ctx.fill();


            //画点赞区中间长条

            t.niceCenterBg = document.createElement('canvas');//绘制中间可以拉伸的矩形
            t.niceCenterBg.height = iHeight;
            t.niceCenterBg.width = t.niceCenterBg.height;//可以拉伸
            var centerCtx = t.niceCenterBg.getContext('2d');
            centerCtx.fillStyle = t.niceColor;
            centerCtx.fillRect(0,borderSize,t.niceCenterBg.width,t.niceCenterBg.height-2*borderSize);

            //画文字
            t.content = document.createElement("canvas");
            t.content.height = iHeight;
            t.content.width = t.canvas.width;
            var contentCtx = t.content.getContext("2d");

            contentCtx.fillStyle = pa.textColor;

            contentCtx.font = pa.textSize+'px Microsoft YaHei';
            var toTop = Math.floor((cHeight)*0.5);
            //console.log('fontSize',ctx.font,pa.textSize,cHeight,toTop);
            contentCtx.textBaseline= "middle";

            contentCtx.fillText(t.text,Math.floor(cHeight*1.5),toTop);




        }
        DanMuItem.prototype.drawBuff = function(){//绘制自身到缓存画布中
            var t = this;


            if(t.died){return t;}
            var pa = t.parent;
            var ctx = t.canvas.getContext('2d');
            var cWidth = t.canvas.width;
            var cHeight = t.canvas.height;
            var borderRadius = Math.floor(cHeight/2);
            var borderSize = pa.itemBorderSize;
            var x,y,r;



            ctx.drawImage(pa.headCanvas,0,0);
            ctx.drawImage(pa.leftCircle,cHeight,0);
            ctx.drawImage(pa.rightCircle,Math.floor(cWidth-0.5*cHeight),0);
            ctx.drawImage(pa.centerBg,Math.floor(cHeight*1.5),0,Math.floor(cWidth-2*cHeight),cHeight);

            return t;
        }
        DanMuItem.prototype.drawNum = function(type){
            var t = this;
            var pa = this.parent;
            var iHeight = pa.itemHeight;
            var cHeight = t.canvas.height;
            var toTop = Math.floor((cHeight)*0.5);
            var num = type == "before"? t.num: (t.num+1);
            var cWidth = t.canvas.width;


            t[type + "Num"] = document.createElement("canvas");
            t[type + "Num"].height = iHeight;
            t[type + "Num"].width = t.canvas.width;
            t[type + "Num"].ctx = t[type + "Num"].getContext("2d");

            t[type + "Num"].ctx.fillStyle = pa.textColor;
            t[type + "Num"].ctx.font = pa.textSize+'px Microsoft YaHei';
            t[type + "Num"].ctx.textBaseline= "middle";


            t[type + "Num"].ctx.fillText(num,  Math.floor(cWidth - 0.5*cHeight - pa.zanWidth),  toTop);



        }
        DanMuItem.prototype.move = function(){//移动
            var t = this;
            t.pos.x -= t.speed;
            if(t.pos.x < -t.canvas.width){
                t.die();
            }
            return t;//返回自身就可以链式调用了
        }
        DanMuItem.prototype.die = function(){//移出屏幕边缘之后消亡自身
            var t = this;
            if(t.died){return t;}
            t.died = true;
            delete t.canvas;
            t.canvas = null;
            return t;
        }
        DanMuItem.prototype.draw = function(){//绘制自身到真实画布中
            var t = this;
            var pa = t.parent;

            //var ctx = t.canvas.getContext('2d');
            var cWidth = t.canvas.width;
            var cHeight = t.canvas.height;
            var toTop = Math.floor((cHeight-pa.textSize)*0.4);

            var zanX = t.pos.x + Math.floor(cWidth - 0.5*cHeight - pa.zanWidth - t.niceWidth);
            var zanY = t.pos.y + toTop;
            var zanWidth = pa.zanWidth ;




            if(!t.died&&t.pos.x<pa.canvas.width){
                //画固定部分
                pa.ctx.drawImage(t.canvas,t.pos.x,t.pos.y);

                if(t.hasNiced && t.buttonWidth <= t.niceFullWidth){
                    t.buttonWidth = Math.ceil(t.buttonWidth + (t.niceFullWidth - t.buttonWidth)/5);
                }

                //画点赞增长
                pa.ctx.drawImage(t.rightNiceCircle,t.pos.x + Math.floor(cWidth - 0.5*cHeight), t.pos.y);
                pa.ctx.drawImage(t.niceCenterBg, t.pos.x + Math.floor(cWidth - 0.5*cHeight - t.buttonWidth), t.pos.y,t.buttonWidth,cHeight);
                pa.ctx.drawImage(t.leftNiceCircle, t.pos.x + Math.floor(cWidth - 0.5*cHeight - t.buttonWidth - 0.5*cHeight), t.pos.y);



                //画内容
                pa.ctx.drawImage(t.content, t.pos.x, t.pos.y);

                //点赞变
                if(!t.hasNiced){
                    pa.ctx.drawImage(pa.emptyZan,zanX,zanY,zanWidth,zanWidth);
                    pa.ctx.drawImage(t["beforeNum"], t.pos.x, t.pos.y);
                }else{
                    pa.ctx.drawImage(pa.fillZan,zanX,zanY,zanWidth,zanWidth);
                    pa.ctx.drawImage(t["afterNum"], t.pos.x, t.pos.y);
                }
            }
            return t;
        }






        return {init:init,DanMuItem:DanMuItem};




    })(window,$)


    document.body.className = "noTab";
    danmuSwitch.init($("#danmu"));

})