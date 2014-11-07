$(function(){

	var debug = 0;
	
	// ロード時
	$(".slider").each(function(){
		sld = $(this);
		sld.attr("data-flag","0");
		frm = sld.children(".slider_frame");
		bar = frm.children(".slider_bar");
		nav = sld.children(".navigator");
		num = bar.children().length;
		get = bar.html();
		bar.prepend(get);
		w = frm.width();
		bar.css({left:-num * w});
		per1 = num * 200 + "%";
		bar.css({width:per1});
		per2 = 100 / (num * 2) + "%";
		bar.children().css({width:per2});
		nav.html("");
		for(i=0; i<num; i++) {
			nav.prepend("<span></span>");
		}
		nav.children("span").eq(0).addClass("active");
	});
	
	// ボタン操作
	$(".slider .btn_next").click(function(){
		sld1 = $(this).parent(".slider");
		flag = sld1.attr("data-flag");
		if(flag == 0) {
			sld1.attr("data-flag","2");
			frm1 = $(this).siblings(".slider_frame");
			bar1 = frm1.children(".slider_bar");
			nav1 = $(this).parent(".slider").children(".navigator");
			num1 = bar1.children().length / 2;
			l = eval( bar1.css("left").replace("px","") );
			w = frm1.width();
			m = l-w;
			bar1.animate({"left": m},500, function(){
					l = eval( bar1.css("left").replace("px","") );
					w = frm1.width();
					index1 = - l / w;
					if(index1==num1*2-1) {bar1.css({left:-1 * (num1-1)* w})};
					if (index1>num1-1) {index1-=num1;}
					nav1.children(".active").removeClass("active");
					nav1.children("span").eq(index1).addClass("active");
						if (debug == 1) {
							bar1.css("left",-num1*w);
							nav1.children(".active").removeClass("active");
							nav1.children("span").eq(0).addClass("active");
							debug = 0;
						}
					sld1.attr("data-flag","0");
				});
		}
	});
	$(".slider .btn_prev").click(function(){
		sld2 = $(this).parent(".slider");
		flag = sld2.attr("data-flag");
		if(flag == 0) {
			sld2.attr("data-flag","2");
			frm2 = $(this).siblings(".slider_frame");
			bar2 = frm2.children(".slider_bar");
			nav2 = $(this).parent(".slider").children(".navigator");
			num2 = bar2.children().length / 2;
			l = eval( bar2.css("left").replace("px","") );
			w = frm2.width();
			m = l+w;
			bar2.animate({"left": m},500, function(){
					l = eval( bar2.css("left").replace("px","") );
					w = frm2.width();
					index2 = - l / w;
					if(index2==1) {bar2.css({left:-1 * (num2+1)* w});}
					if (index2>num2-1) {index2-=num2;}
					nav2.children(".active").removeClass("active");
					nav2.children("span").eq(index2).addClass("active");
						if (debug == 1) {
							bar2.css("left",-num2*w);
							nav2.children(".active").removeClass("active");
							nav2.children("span").eq(0).addClass("active");							
							debug = 0;
						}
					sld2.attr("data-flag","0");
				});
		}
	});

	// フリック操作
	$('.slider_bar').bind({
	                 
	    'touchstart': function(e) {
			sld3 = $(this).parents(".slider");
			flag = sld3.attr("data-flag");
	    	if(flag==0) {
				sld3.attr("data-flag","1");
		        this.touchX = event.changedTouches[0].pageX;
		        this.slideX = $(this).position().left;
		    }
	    },
	    'touchmove': function(e) {
	        e.preventDefault();
			sld3 = $(this).parents(".slider");
			flag = sld3.attr("data-flag");
	    	if(flag==1) {
		        this.slideX = this.slideX - (this.touchX -  event.changedTouches[0].pageX );
		        $(this).css({left:this.slideX});
		        this.accel = (event.changedTouches[0].pageX - this.touchX) * 5;
		        this.touchX = event.changedTouches[0].pageX;
		    }
	    },
	    'touchend': function(e) {
			sld3 = $(this).parents(".slider");
			flag = sld3.attr("data-flag");
	    	if(flag==1) {
				sld3.attr("data-flag","2");
	    		bar3 = $(this);
	    		frm3 = bar3.parent(".slider_frame");
				nav3 = frm3.next(".navigator");
				num3 = bar3.children().length / 2;
	    		fw = frm3.width();
	    		sw = bar3.width();
				if (this.accel > fw * 0.4) {this.accel = fw * 0.4;}
				if (this.accel < -fw * 0.4) {this.accel = -fw * 0.4;}
				this.slideX += this.accel;
				this.accel = 0;
	    		   	edge = this.slideX % fw;
	    			if (edge > -fw * 0.5) {
	    				this.slideX -= edge;
	    				bar3.animate({left:this.slideX},300,"linear",function(){
							l = eval( bar3.css("left").replace("px","") );
							w = frm3.width();
							index3 = - l / w;
							if(index3==1) {bar3.css({left:-1 * (num3 + 1) * w});}
							else if(index3==num3*2-1) {bar3.css({left:-1 * (num3 - 1) * w});}
							if (index3>num3-1) {index3-=num3;}
							nav3.children(".active").removeClass("active");
							nav3.children("span").eq(index3).addClass("active");
							if (debug == 1) {
								bar3.css("left",-num3*w);
								nav3.children(".active").removeClass("active");
								nav3.children("span").eq(0).addClass("active");
								debug = 0;
							}
							sld3.attr("data-flag","0");
						});
	    			} else {
	    				this.slideX = this.slideX - edge - fw;
	    				bar3.animate({left:this.slideX},200,"linear",function(){
							l = eval( bar3.css("left").replace("px","") );
							w = frm3.width();
							index3 = - l / w;
							if(index3==1) {bar3.css({left:-(num3 + 1) * w});}
							else if(index3==num3*2-1) {bar3.css({left:-1 * (num3-1) * w});}
							if (index3>num3-1) {index3-=num3;}
							nav3.children(".active").removeClass("active");
							nav3.children("span").eq(index3).addClass("active");
							if (debug == 1) {
								bar3.css("left",-num3*w);
								nav3.children(".active").removeClass("active");
								nav3.children("span").eq(0).addClass("active");							
								debug = 0;
							}
							sld3.attr("data-flag","0");
						});
	    			}
			}
	    },
	}); 

	// 自動スライド
	first = $(".slider").eq(0);
	speed = first.attr("data-speed");
	if(speed < 1000) {speed = 1000;}
	setInterval(function(){
		flag = first.attr("data-flag");
		if(flag == 0 && speed > 0) {
			first.attr("data-flag","2");
			frm4 = first.children(".slider_frame");
			bar4 = frm4.children(".slider_bar");
			nav4 = first.children(".navigator");
			num4 = bar4.children().length / 2;
			l = eval( bar4.css("left").replace("px","") );
			w = frm4.width();
			m = l-w;
			bar4.animate({"left": m},500, function(){
					frm4 = first.children(".slider_frame");
					bar4 = frm4.children(".slider_bar");
					nav4 = first.children(".navigator");
					l = eval( bar4.css("left").replace("px","") );
					w = frm4.width();
					num4 = bar4.children().length / 2;
					index4 = - l / w;
					if(index4==num4*2-1) {bar4.css({left:-1 * (num4-1) * w});}
					if (index4>num4-1) {index4-=num4;}
					nav4.children(".active").removeClass("active");
					nav4.children("span").eq(index4).addClass("active");
					if (debug == 1) {
						w = frm4.width();
						num4 = bar4.children().length / 2;
						bar4.css("left",-num4*w);
						nav4.children(".active").removeClass("active");
						nav4.children("span").eq(0).addClass("active");
						debug = 0;
					}
					first.attr("data-flag","0");
				});
		}
	},speed);


	// リサイズ・オリエンテーション時には初期位置に戻す
	$(window).bind( "orientationchange resize" ,function(){
		$(".slider").each(function(){
			sld5 = $(this);
			flag = sld5.attr("data-flag");
			if (flag > 0) {
				debug=1;
			} else {
    			frm5 = sld5.children(".slider_frame");
    			bar5 = frm5.children(".slider_bar");
				nav5 = frm5.next(".navigator");
				num5 = bar5.children().length / 2;
				l = eval( bar5.css("left").replace("px","") );
				w = frm5.width();
				z = l % w;
				if (w>0) {
					bar5.css("left",-num5*w);
					nav5.children(".active").removeClass("active");
					nav5.children("span").eq(0).addClass("active");
				}
			}
		});
	})

});



