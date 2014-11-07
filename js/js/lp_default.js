/* beowser check */
var uaName = 'unknown';
var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();
 
if (userAgent.indexOf('msie') != -1) {
	uaName = 'ie';
	if (appVersion.indexOf('msie 6.') != -1) {
		uaName = 'ie6';
	} else if (appVersion.indexOf('msie 7.') != -1) {
		uaName = 'ie7';
	} else if (appVersion.indexOf('msie 8.') != -1) {
		uaName = 'ie8';
	} else if (appVersion.indexOf('msie 9.') != -1) {
		uaName = 'ie9';
	} else if (appVersion.indexOf('msie 10.') != -1) {
		uaName = 'ie10';
	}
} else if (userAgent.indexOf('chrome') != -1) {
	uaName = 'chrome';
} else if (userAgent.indexOf('ipad') != -1) {
	uaName = 'ipad';
} else if (userAgent.indexOf('ipod') != -1) {
	uaName = 'ipad';
} else if (userAgent.indexOf('iphone') != -1) {
	uaName = 'iphone';
var ios = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	uaName = [parseInt(ios[1], 10), parseInt(ios[2], 10), parseInt(ios[3] || 0, 10)];
} else if (userAgent.indexOf('safari') != -1) {
	uaName = 'safari';
} else if (userAgent.indexOf('gecko') != -1) {
	uaName = 'gecko';
} else if (userAgent.indexOf('opera') != -1) {
	uaName = 'opera';
} else if (userAgent.indexOf('android') != -1) {
	uaName = 'android';
} else if (userAgent.indexOf('mobile') != -1) {
	uaName = 'mobile';
};

/*
 Page Top
*/
$(function() {
	var showFlag = false;
	var topBtn = $('#page-top');
	topBtn.css('bottom', '-68px');
	var showFlag = false;
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 76) {
			if (showFlag == false) {
				showFlag = true;
				topBtn.stop().animate({'bottom' : '0'}, 200);
			}
		} else {
			if (showFlag) {
				showFlag = false;
				topBtn.stop().animate({'bottom' : '-68px'}, 200);
			}
		}
	});
	//スクロールしてトップ
	topBtn.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 200);
		return false;
	});
});

/*
 FAQ Accordion
 http://coder.blog.uhuru.co.jp/js/easy_accordion html
 <dl class="accordion">
 <dt class="accordion-head highlight">Q</dt>
 <dd>A<dd>
 </dl>

 CSS
 .accordion-head {cursor: pointer;}
*/
$(function(){
	$('.accordion-head').click(function() {
		if($(this).hasClass("selected")) {
			$('.accordion-head').removeClass("selected highlight").next().slideUp();
		}else {
			$('.accordion-head').removeClass("selected highlight").next().slideUp();
			$(this).toggleClass("selected").next().slideToggle();
		}
	}).next().hide();
	/*$('.accordion-head:first').addClass("selected");
	$('.accordion-head:first').next().show();*/
});

/*
	form validation
*/
/*チェック項目が1つのとき*/
$(function() {
	$(".consent-check :checkbox").click(function() {
		if($(".consent-check :checked").length > 0) {
			//ボタン有効
			$(".button-container :button").removeAttr("disabled");
			//ボタンをアクティブにする
			$("span.enter-btn-inactive").removeClass("enter-btn-inactive").addClass("enter-btn");
		} else {
			//ボタン無効
			$(".button-container :button").attr("disabled", "disabled");
			//ボタンをインアクティブにする
			$("span.enter-btn").removeClass("enter-btn").addClass("enter-btn-inactive");
		}
	});
});


/* for simulation */
$(function() {
	$('.sdk-wrapper li:nth-child(even)').addClass('even-edge');
});

/* placeholder for IE (6-9)*/
$(function(){
	if((uaName == "ie9") || (uaName == "ie8") || (uaName == "ie7") || (uaName == "ie6")) {
		if($("input[type=text]").size()) {
			$('input[type=text]').each(function(){
				setPlaceholder($(this));
			});
		}
		if($("input.txt-telno").size()) {
			$('input.txt-telno').each(function(){
				setPlaceholder($(this));
			});
		}
		if($("input.txt-mail").size()) {
			$('input.txt-mail').each(function(){
				setPlaceholder($(this));
			});
		}
		if($("input.txt-app-url").size()) {
			$('input.txt-app-url').each(function(){
				setPlaceholder($(this));
			});
		}
		if($("input.txt-url-scheme").size()) {
			$('input.txt-url-scheme').each(function(){
				setPlaceholder($(this));
			});
		}
	}
	function setPlaceholder(target) {
		var $this = target;
		var thisTitle = $this.attr('placeholder');
		if((!(thisTitle === ''))&&(thisTitle != undefined)){
			$this.wrapAll('<span style="text-align:left;display:inline-block;position:relative;"></span>');
			$this.parent('span').append('<span class="placeholder">' + thisTitle + '</span>');
			$('.placeholder').css({
				top:'8px',
				left:'8px',
				fontSize:'139%',
				lineHeight:'120%',
				textAlign:'left',
				color:'#a9a9a9',
				overflow:'hidden',
				position:'absolute',
				zIndex:'99'
			}).click(function(){
				$(this).prev().focus();
			});

			$this.focus(function(){
				$this.next('span').css({display:'none'});
			});

			$this.blur(function(){
				var thisVal = $this.val();
				if(thisVal === ''){
					$this.next('span').css({display:'inline-block'});
				} else {
					$this.next('span').css({display:'none'});
				}
			});

			var thisVal = $this.val();
			if(thisVal === ''){
				$this.next('span').css({display:'inline-block'});
			} else {
				$this.next('span').css({display:'none'});
			}
		}
	}
});


// ロールオーバー
$(function() {
	$("img.rollover").mouseover(function() {
		$(this).attr("src",$(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1_on$2"))
	}).mouseout(function() {
		$(this).attr("src",$(this).attr("src").replace(/^(.+)_on(\.[a-z]+)$/, "$1$2"));
	}).each(function() {
		$("<img>").attr("src",$(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1_on$2"));
	});
})

