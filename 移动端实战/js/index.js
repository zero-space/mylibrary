function fnLoad(){

    var iTime=new Date().getTime();
    var oW=getId("welcome");
    var arr=[];
    var bImgLoad=true;
    var bTime=false;
    var i=0;
    bindEvn(oW,"transitionend",end);

    var oTimer=setInterval(function(){
        if(new Date().getTime()-iTime>=4000){
            bTime=true;
        }
        if(bImgLoad && bTime){
            clearInterval(oTimer);
            oW.style.opacity=0;
     }
     },1000);

    function end(){
        alert("过度完成")
    }
     /*
     for(var i=0;i<arr.length;i++){
     var oImg=new Image();
     oImg.onload=function(){

        }
    }
    */
}

function fnTab(){
    var oTab=getId("tabPic");
    var oList=getId("picList");
    var aNav=oTab.getElementsByTagName('nav')[0].getElementsByTagName('a');
    var iNow=0;
    var iX=0;
    var iW=view().w;
    var iStartTouchX=0;
    var iStartX=0;
    var oTimer;
    auto();
    function auto(){
        oTimer=setInterval(function(){
            iNow++;
            iNow=iNow%aNav.length;
            tab();
        },2000);
        bindEvn(oTab,"touchstart",fnStart);
        bindEvn(oTab,"touchmove",fnMove);
        bindEvn(oTab,"touchend",fnEnd);
        bindEvn(document,"touchmove",function(ev){
            ev.preventDefault();
        });
    }
    function fnStart(ev){
        oList.style.transition="none";
        ev=ev.changedTouches[0];
        iStartTouchX=ev.pageX;
        iStartX=iX;
        clearInterval(oTimer)
    }
    function fnMove(ev){
        ev=ev.changedTouches[0];
        var iDis=ev.pageX-iStartTouchX;
        iX=iStartX+iDis;
        oList.style.transform="translateX("+iX+"px)";
    }
    function fnEnd(){

        iNow=iX/iW;
        console.log(iNow);
        iNow=-Math.round(iNow);
        if(iNow<0){
            iNow=0;
        }else if(iNow>aNav.length-1){
            iNow=aNav.length-1
        }
        tab();
        auto();
    }
    function tab(){
        iX=-iNow*iW;
        oList.style.transition="0.5s linear";
        oList.style.transform="translateX("+iX+"px)";

        removeClass(aNav,"active");
        adClass(aNav[iNow],"active")
    }

}

function fnScore(){
    var oScore=getId("score");
    var aLi=oScore.getElementsByTagName('li');
    for(var i=0;i<aLi.length;i++){
        fn(aLi[i])
    }
    function fn(oLi){
        var aNav=oLi.getElementsByTagName("a");
        var oInput=oLi.getElementsByTagName("input")[0];
        for(var i=0;i<aNav.length;i++){
            aNav[i].index=i;
            bindEvn(aNav[i],"touchstart",function(){
                for(var i=0;i<aNav.length;i++){
                    if(i<=this.index){
                        adClass(aNav[i],"active")
                    }else{
                        removeClass(aNav[i],"active")
                    }
                }
                oInput.value=this.index+1;
            })
        }
    }
}