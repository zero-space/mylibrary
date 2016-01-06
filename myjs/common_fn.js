(function(win){
    /*下拉框*/
    var DropDown=function(select){
        this.select=select;
        this.select_valWrap=getClass(this.select,'select_val')[0];
        this.select_val=getClass(this.select_valWrap,'val')[0];
        this.select_icon=getClass(this.select_valWrap,'icon')[0];
        this.select_down=getClass(this.select,'select_down')[0];
        this.select_downVal=getClass(this.select_down,'ceil');
        this.select_ipt=getClass(this.select,'select_ipt')[0]
        this.mark=getClass(document,'nv_mark')[0];

        //默认配置参数
        this.setting={
            'width':'30%',
            'height':'2.2rem',
            'downWidth':'100%'
        };
        fnExtend(this.setting,this.getSetting());
        //设置配置参数
        this.setSettingValue();
        this.setClick();
    };
    //获取人工配置参数
    DropDown.prototype.getSetting=function(){
        var setting=this.select.getAttribute('data-setting');
        if(setting&&setting!=""){
            var re=/\t|\s/g;
            var re2=/'/g;
            var str=setting.replace(re,'');
            str=str.replace(re2,'"');
            return JSON.parse(str);
        }else{
            return {};
        }
    };
    //参数设置
    DropDown.prototype.setSettingValue=function(){
        this.select.style.width=this.setting.width;
        this.select.style.height=this.setting.height;
        this.select.style.position='relative';

        this.select_valWrap.style.height=this.setting.height;
        this.select_valWrap.style.lineHeight=this.setting.height;

        var pxWidth=this.select.offsetWidth;
        var pxHeight=this.select.offsetHeight;
        this.select_val.style.width=pxWidth-17+'px';
        this.select_val.style.height=this.setting.height;
        this.select_val.style.float='left';
        this.select_val.style.overflow='hidden';

        this.select_icon.style.width=15+'px';
        this.select_icon.style.float='right';
        this.select_icon.style.display='block';
        this.select_icon.style.height=this.setting.height;

        this.select_down.style.width='100%';
        this.select_down.style.maxHeight='160px';
        this.select_down.style.position='absolute';
        this.select_down.style.top=pxHeight-2+'px';
    };
    //绑定点击事件
    DropDown.prototype.setClick=function(){
        var _this=this;
        this.select.onclick=function(){
            _this.select_downVal=getClass(_this.select,'ceil');
            if(!hasCls(_this.select_down,'current')){
                adClass(_this.select_down,'current');
                _this.select.style.zIndex='999';
                _this.mark.style.display='block';
                rubAnimate(_this.mark,{
                    opacity:100
                });
                for(var i=0;i<_this.select_downVal.length;i++){
                    bindEvn(_this.select_downVal[i],'click',function() {
                        var thisVal=this.getAttribute('date-value');
                        var thisText=this.innerHTML;
                        var thisVale=this.getAttribute('date-value');
                        _this.select_val.innerHTML=thisText;
                        _this.select_val.setAttribute('data-val',thisVal);
                        if(_this.select_ipt.value != null && thisVale !=null ){
                            _this.select_ipt.value=thisVale;
                        }
                    })
                }
            }else{
                removeClass(_this.select_down,'current');
                rubAnimate(_this.mark,{
                    opacity:0
                },function(){
                    _this.mark.style.display='none';
                    _this.select.style.zIndex='99';
                })
            }
        }
    };
    DropDown.init=function(parameters){
        for(var i=0;i<parameters.length;i++){
            new this(parameters[i]);
        }
    };
    win.DropDown=DropDown;
})(window);
//选项卡
(function(win){
    var TabFn=function(tab){
        this.tab=tab;
        this.tabTitle=getClass(this.tab,'tb_tt')[0];
        this.tabTitleCeil=getClass(this.tabTitle,'ceil');
        this.tabBody=getClass(this.tab,'tab_bd');

        this.setting={
            'effect':'fade',
            'autoPlay':false,
            'trigger':'click',
            'delayTimer':500,
            'indexNumber':0
        };
        fnExtend(this.setting,this.getSetting());
        switch(this.setting.trigger){
            case 'click':
                this.TbClick();
                break;
        }
    };
    TabFn.prototype.TbClick=function(){
        var _this=this;
        for(var i=0;i<this.tabBody.length;i++){
            setTabd(i);
        }
        this.tabBody[this.setting.indexNumber].style.display='block';
        this.tabBody[this.setting.indexNumber].style.opacity=1;
        removeClass(_this.tabTitleCeil,'hover');
        adClass(_this.tabTitleCeil[this.setting.indexNumber],'hover');

        for(var i=0;i<this.tabTitleCeil.length;i++){
            this.tabTitleCeil[i].index=i;
            this.tabTitleCeil[i].onclick=function(){
                removeClass(_this.tabTitleCeil,'hover');
                adClass(_this.tabTitleCeil[this.index],'hover');
                for(var c=0;c<_this.tabBody.length;c++){
                    setTabd(c);
                }
                _this.tabBody[this.index].style.display='block';
                rubAnimate(_this.tabBody[this.index],{
                    opacity:100
                });
            };
        }
        function setTabd(num){
            _this.tabBody[num].style.display='none';
            _this.tabBody[num].style.opacity=0;
        }
    };
    //参数设置
    TabFn.prototype.getSetting=function(){
        getSettings(this.tab,'data-setting');
    };

    //初始化
    TabFn.init=function(tabs){
        var tabs=getClass(document,tabs);
        for(var i=0;i<tabs.length;i++){
            new this(tabs[i]);
        }
    };
    win.TabFn=TabFn;
})(window);
/*banner*/
(function(win){
    var BanerFn=function(){
        this.oTab=getId("tabPic");
        this.oList=getId("picList");
        this.oLi=this.oList.getElementsByTagName('li');
        this.aNav=this.oTab.getElementsByTagName('nav')[0].getElementsByTagName('a');
        this.iNow=0;
        this.iX=0;
        this.iW=view().w/20;
        this.iStartTouchX=0;
        this.iStartX=0;
        this.oTimer=null;
        this.init();
        this.auto();
        var _this=this;
        bindEvn(this.oTab,"touchstart",function(ev){
            ev=ev.changedTouches[0];
            _this.fnStart(ev);
        });
        bindEvn(this.oTab,"touchmove",function(ev){
            ev=ev.changedTouches[0];
            _this.fnMove(ev);
        });
        bindEvn(this.oTab,"touchend",function(ev){
            ev=ev.changedTouches[0];
            _this.fnEnd(ev);
        });
    };
    BanerFn.prototype.init=function(){
        var str='';
        for(var i=0;i<this.oLi.length;i++){
            this.oLi[i].style.width=view().w/20+'rem';
            str +='<a href="javascript:;"></a>';
        }
        this.oTab.getElementsByTagName('nav')[0].innerHTML=str;
        this.oList.style.width=(view().w/20)*this.oLi.length+'rem';

    };

    BanerFn.prototype.auto=function(){
        var _this=this;
        this.oTimer=setInterval(function(){
            _this.iNow++;
            _this.iNow=_this.iNow%_this.aNav.length;
            _this.tab();
        },2000);
    };

    BanerFn.prototype.fnStart=function(evt){
        bindEvn(document,"touchmove",function(){
            return false;
        });
        this.iStartTouchX=evt.pageX;
        this.oList.style.webkitTransition="none";
        this.oList.style.mozTransition="none";
        this.oList.style.oTransition="none";
        this.oList.style.transition="none";
        this.iStartX=this.iX;
        clearInterval(this.oTimer)
    };

    BanerFn.prototype.fnMove=function(evt){
        var iDis=evt.pageX-this.iStartTouchX;
        this.iX=this.iStartX+iDis/20;
        this.oList.style.webkitTransform="translateX("+this.iX+"rem)";
        this.oList.style.mozTransform="translateX("+this.iX+"rem)";
        this.oList.style.oTransform="translateX("+this.iX+"rem)";
        this.oList.style.msTransform="translateX("+this.iX+"rem)";
        this.oList.style.transform="translateX("+this.iX+"rem)";
        var banrScale=(1-Math.abs(iDis)/2000);
        this.oLi[this.iNow].style.webkitTransform="scale("+banrScale+")";
        this.oLi[this.iNow].style.mozTransform="scale("+banrScale+")";
        this.oLi[this.iNow].style.oTransform="scale("+banrScale+")";
        this.oLi[this.iNow].style.msTransform="scale("+banrScale+")";
        this.oLi[this.iNow].style.transform="scale("+banrScale+")";
    };

    BanerFn.prototype.fnEnd=function(){
        var _this=this;
        this.iNow=this.iX/this.iW;
        this.iNow=-Math.round(this.iNow);
        if(this.iNow<0){
            this.iNow=0;
        }else if(this.iNow>this.aNav.length-1){
            this.iNow=this.aNav.length-1
        }
        setTimeout(function(){
            for(var i=0;i<_this.oLi.length;i++){
                _this.oLi[i].style.webkitTransition=".3s all";
                _this.oLi[i].style.mozTransition=".3s all";
                _this.oLi[i].style.oTransition=".3s all";
                _this.oLi[i].style.transition=".3s all";
                _this.oLi[i].style.webkitTransform="scale(1)";
                _this.oLi[i].style.mozTransform="scale(1)";
                _this.oLi[i].style.oTransform="scale(1)";
                _this.oLi[i].style.msTransform="scale(1)";
                _this.oLi[i].style.transform="scale(1)";
            }
        },500);
        this.tab();
        this.auto();
    };
    BanerFn.prototype.tab=function(){
        this.iX=-this.iNow*this.iW;
        this.oList.style.webkitTransition="0.5s linear";
        this.oList.style.mozTransition="0.5s linear";
        this.oList.style.oTransition="0.5s linear";
        this.oList.style.transition="0.5s linear";

        this.oList.style.webkitTransform="translateX("+this.iX+"rem)";
        this.oList.style.mozTransform="translateX("+this.iX+"rem)";
        this.oList.style.oTransform="translateX("+this.iX+"rem)";
        this.oList.style.msTransform="translateX("+this.iX+"rem)";
        this.oList.style.transform="translateX("+this.iX+"rem)";

        removeClass(this.aNav,"active");
        adClass(this.aNav[this.iNow],"active")
    };
    win.BanerFn=BanerFn;
})(window);
/*拖拽*/
(function(win){
    var drawCeil=function(obj){
        this.oDraw=obj;
        this.iScroll=0;
        this.distenceX=0;
        this.distenceY=0;
        this.oDraw.style.left=view().w-this.oDraw.offsetWidth+'px';
        this.oDraw.style.top=view().h-this.oDraw.offsetHeight-60+'px';


        var _this=this;
        this.oDraw.ontouchstart=function(ev){
            ev= ev.changedTouches[0];
            _this.fnStart(ev);
            document.ontouchmove=function(ev){
                ev= ev.changedTouches[0];
                _this.fnMove(ev);
                return false;
            };
            document.ontouchend=function(){
                _this.fnEnd();
            };
        }
    };
    drawCeil.prototype.fnStart=function(evt){
        this.distenceX=evt.pageX-getPos(this.oDraw).left;
        this.distenceY=evt.pageY-getPos(this.oDraw).top;
        this.oDraw.style.zIndex=99999;
    };
    drawCeil.prototype.fnMove=function(evt){
        var x= evt.pageX - this.distenceX;
        var y= evt.pageY - this.distenceY;
        if(x>view().w-this.oDraw.offsetWidth){
            x=view().w-this.oDraw.offsetWidth;
        }else if(x<0){
            x=0;
        }
        if(y>view().h-this.oDraw.offsetHeight){
            y=view().h-this.oDraw.offsetHeight;
        }else if(y<0){
            y=0;
        }
        this.oDraw.style.left=x+'px';
        this.oDraw.style.top=y+'px';
    };
    drawCeil.prototype.fnEnd=function(){
        this.oDraw.style.zIndex=111;
        document.ontouchmove=document.ontouchend=null;
    };
    drawCeil.init=function(classStr){
        var adBtn=getClass(document,classStr);
        for(var i=0;i<adBtn.length;i++){
            new this(adBtn[i]);
        }
    };
    win.drawCeil=drawCeil;
})(window);