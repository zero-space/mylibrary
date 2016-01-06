/**
 * Created by yxb on 2015/8/31.
 */
/*
*   data-role="lightbox" 表示这个元素要启用lightbox
*   data-source=""       原图显示的路径
*   data-group=""        图片组别
*   data-id=""           标示索引
*   data-caption         图片标题
*
* */
(function($){
    var LightBox=function(){
        var self=this;
        //创建遮罩和弹出框
        this.popupMask=$('<div id="G-lightbox-mask">');
        this.popupWin=$('<div id="G-lightbox-popup">');

        //保存body
        this.bodyNode=$(document.body);

        //渲染剩余的DOM并且插入到body下
        this.renderDOM();

        this.picViewArea=this.popupWin.find(".lightbox-pic-view");//图片预览区域
        this.popupPic=this.popupWin.find(".lightbox-images");//图片
        this.picCaptionArea=this.popupWin.find(".lightbox-pic-caption");//图片描述区域
        this.nextBtn=this.popupWin.find(".lightbox-next-btn");
        this.prevBtn=this.popupWin.find(".lightbox-prev-btn");

        this.captionText=this.popupWin.find(".lightbox-pic-desc");//图片描述
        this.currentIndex=this.popupWin.find(".lightbox-of-index");//图片当前索引
        this.closeBtn=this.popupWin.find(".lightbox-close-btn");//图片关闭按钮

        //准备开发时间委托,获取数组数据
        this.groupName=null;
        this.grupData=[];   //放置同一组数据
        this.bodyNode.delegate(".js-lightbox,[data-role=lightbox]","click",function(e){
            //阻止事件冒泡
            e.stopPropagation();

            var currentGroupName=$(this).attr("data-group");

            if(currentGroupName!=self.groupName){
                self.groupName=currentGroupName;
                //根据当前组名获取一组数据
                self.getGroup();
            };
            //初始化弹出
            self.initPopup($(this));
        });
        //关闭弹出
        this.popupMask.click(function(){
            $(this).fadeOut();
            self.popupWin.fadeOut();
        });
        this.closeBtn.click(function(){
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
        });

        this.nextBtn.hover(function(){
            if(!$(this).hasClass("disabled") && self.grupData.length>1){
                $(this).addClass("lightbox-next-btn-show");
            }
        },function(){
            if(!$(this).hasClass("disabled") && self.grupData.length>1){
                $(this).removeClass("lightbox-next-btn-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")){
                e.stopPropagation();
                self.goto("next");
            };
        });

        this.prevBtn.hover(function(){
            if(!$(this).hasClass("disabled") && self.grupData.length>1){
                $(this).addClass("lightbox-prev-btn-show");
            }
        },function(){
            $(this).removeClass("lightbox-prev-btn-show");
        }).click(function(e){
            if(!$(this).hasClass("disabled")) {
                e.stopPropagation();
                self.goto("prev");
            }
        });
    };

    LightBox.prototype={
        goto:function(dir){
            if(dir==="next"){
                //this.grupData
                //this.index
                this.index++;
                if(this.index>=this.grupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(this.index !=0){
                    this.prevBtn.removeClass("disabled");
                }
                var src=this.grupData[this.index].src;
                this.loadPicSize(src);
            }else if(dir==="prev"){

                this.index--;

                if(this.index<=0){
                    this.prevBtn.addClass("disabled").removeClass("lightbox-perv-btn-show");
                }
                if(this.index != this.grupData.length-1){
                    this.nextBtn.removeClass("disabled");
                }
                var src=this.grupData[this.index].src;
                this.loadPicSize(src);

            }
        },
        //图片加载方法
        loadPicSize:function(soureSrc){
            var self=this;
            self.popupPic.css({"width":"auto","height":"auto"}).hide();

            this.preLoadImg(soureSrc,function(){
                self.popupPic.attr("src",soureSrc);
                var picWidth=self.popupPic.width();
                var picHeight=self.popupPic.height();

                console.log(picWidth+":"+picHeight);
                self.changePic(picWidth,picHeight);

            });
        },
        changePic:function(w,h){
            var self=this,
                winWidth=$(window).width(),
                winHeight=$(window).height();

            //如果图片的宽高大于浏览器视口的宽高比例,
            var scale=Math.min(winWidth/(w+10),winHeight/(h+10),1);

            w=w*scale;
            h=h*scale;

            this.picViewArea.animate({
                width:w-10,
                height:h-10
            });
            this.popupWin.animate({
                width:w,
                height:h,
                marginLeft:-(w/2),
                top:(winHeight-h)/2
            },function(){
                self.popupPic.css({
                    width:w-10,
                    height:h-10
                }).fadeIn();
                self.picCaptionArea.fadeIn();
            });
            this.captionText.text(this.grupData[this.index].caption);
            this.currentIndex.text("当前索引："+(this.index+1)+" of "+this.grupData.length);
        },
        preLoadImg:function(src,callback){
            var img=new Image();
            if(!!window.ActiveXObject){
                img.onreadystatechange=function(){
                    if(this.readyState=="complete"){
                        callback();
                    }
                };
            }else{
                img.onload=function(){
                    callback();
                };
            }
            img.src=src;
        },
        showMaskAndPopup:function(soureSrc,currentId){
            var self=this;

            this.popupPic.hide();
            this.picCaptionArea.hide();

            this.popupMask.fadeIn();

            var winWidth=$(window).width(),
                windHeight=$(window).height();
            this.picViewArea.css({
                width:winWidth/2,
                height:windHeight/2
            });

            this.popupWin.fadeIn();

            var viewHeight=windHeight/2+10;

            this.popupWin.css({
                width:winWidth/2+10,
                height:viewHeight,
                marginLeft:-(winWidth/2+10)/2,
                top:-viewHeight
            }).animate({
                top:(windHeight-viewHeight)/2
                },function(){
                    //加载图片
                    self.loadPicSize(soureSrc)
            });
            //根据当前点击的元素ID获取在当前组别里面的索引
            this.index=this.getIndexOf(currentId);
            var groupDataLength=this.grupData.length;
            if(groupDataLength>1){
                if(this.index===0){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index===groupDataLength-1){
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{
                    this.nextBtn.removeClass("disabled");
                    this.prevBtn.removeClass("disabled");                }
            };
        },
        getIndexOf:function(currentId){
            var index=0;
            $(this.grupData).each(function(i){
                index=i;
                if(this.id==currentId){
                    return false;
                }
            });
            return index;
        },
        initPopup:function(currentObj){
            var self=this,
                soureSrc=currentObj.attr("data-source"),
                currentId=currentObj.attr("data-id");

            this.showMaskAndPopup(soureSrc,currentId);

        },
        getGroup:function(){
            var self=this;
            //根据当前的组别名称获取所有相同组别的对象

            var groupList=this.bodyNode.find("*[data-group="+this.groupName+"]");
            self.grupData.length=0;
            groupList.each(function(){
                self.grupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                    caption:$(this).attr("data-caption")
                })
            });
            //console.log(self.grupData[1])
        },
        renderDOM:function(){
            var strDom='<div class="lightbox-pic-view">'+
                            '<span class="lightbox-btn lightbox-prev-btn"></span>'+
                            '<img class="lightbox-images" src="images/2-2.jpg" alt=""/>'+
                            '<span class="lightbox-btn lightbox-next-btn"></span>'+
                            '</div>'+
                            '<div class="lightbox-pic-caption">'+
                            '<div class="lightbox-caption-area">'+
                            '<p class="lightbox-pic-desc"></p>'+
                            '<span class="lightbox-of-index">当前索引 0 of 0 </span>'+
                            '</div>'+
                            '<div class="lightbox-close-btn"></div>'+
                        '</div>';
            //插入到this.popupWin
            this.popupWin.html(strDom);
            //把遮罩和弹出框插入到body
            this.bodyNode.append(this.popupMask,this.popupWin)
        }
    };
    window["LightBox"]=LightBox;

})(jQuery);