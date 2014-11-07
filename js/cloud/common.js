$(function(){
   // #で始まるアンカーをクリックした場合に処理
   $('a[href^=#]').click(function() {
      // スクロールの速度
      var speed = 400;// ミリ秒
      // アンカーの値取得
      var href= $(this).attr("href");
      // 移動先を取得
      var target = $(href == "#" || href == "" ? 'html' : href);
      // 移動先を数値で取得
      var position = target.offset().top;
      // スムーススクロール
      $('body,html').animate({scrollTop:position - 85}, speed, 'swing');
      return false;
   });
});

$(function(){
	$("#obi_close").click(function(){
		$("#obi").css("display","none");
	})
})

	$(document).ready(function(){
		$("a[rel^='prettyPhoto']").prettyPhoto();
	});/*
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