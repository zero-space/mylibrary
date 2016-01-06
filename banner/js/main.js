;(function($){

var Carousel =function(poster){

	//保存单个旋转木马对象
	this.poster=poster;
	this.posterItemMain=poster.find("ul.poster_main");
	this.nextBtn=poster.find("div.next_btn");
	this.pervBtn=poster.find("div.prev_btn");
	this.poseterItems=poster.find("li");
	this.poseterFirstItem=this.poseterItems.eq(0);

	//默认配置参数
	this.setting={
			"width":1000,	//幻灯片宽度
			"height":270,	//幻灯片高度
			"posterWidth":640,	//幻灯片第一针宽度
			"posterHeight":270,	//幻灯片第一针高度
			"scale":0.9,		//记录显示比例关系
			"speed":500,		//
			"verticalAlign":"middle"	
	};
	$.extend(this.setting,this.getSetting());
	console.log(this.setting);

	//设置配置参数
	this.setSettingValue();
	//
	this.setPosterPos()
};

Carousel.prototype={
	//设置剩余的针的位置关系
	setPosterPos:function(){
		var self=this;
		var sliceItems	=this.poseterItems.slice(1),
			sliceSize	=sliceItems.length/2,
			rightSlice	=sliceItems.slice(0,sliceSize),
			level		=Math.floor(this.poseterItems.length/2);

			//设置右边帧的位置关系和宽度高度top
				var rw=this.setting.posterWidth,
					rh=this.setting.posterHeight,
					gap=((this.setting.width-this.setting.posterWidth)/2)/level;
					
				var firstLeft=(this.setting.width-this.setting.posterWidth)/2;
				var fixOffsetLeft=firstLeft+rw;

			rightSlice.each(function(i){
				level--;
				rw=rw*self.setting.scale;
				rh=rh*self.setting.scale;
				alert(rh);

				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++i),
					left:fixOffsetLeft+(++i)*gap-rw,
					top:0
				});
			});
	},

	//设置配置参数去控制基本的宽度高度
	setSettingValue:function(){
		this.poster.css({
			width:this.setting.width,
			height:this.setting.height
		});	
		this.posterItemMain.css({
			width:this.setting.width,
			height:this.setting.height
		});
		//计算上下切换按钮的宽度
		var w=(this.setting.width-this.setting.posterWidth)/2;
		this.nextBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:99
		});
		this.pervBtn.css({
			width:w,
			height:this.setting.height,
			zIndex:99
		});

		this.poseterFirstItem.css({
			width:this.setting.posterWidth,
			height:this.setting.posterHeight,
			left:w,
			zIndex:this.poseterItems.length
		});
	},

	//获取人工配置参数
	getSetting:function(){
		var setting=this.poster.attr("data-setting");
		if(setting&&setting!=""){
			return $.parseJSON(setting)
		}else{
			return {};
		}
	}
};

Carousel.init=function(posters){
	var _this=this;
	posters.each(function(){
		new _this($(this))
	});
};

window["Carousel"]=Carousel;

})(jQuery);


