
$(function(){


  $(".record_screen_btn").on("click", function(){
    $('.record').removeClass("stopped"); 
    $('.record').toggleClass("clicked");  
  });
  $(".record_stop_btn").on("click", function(){
    $('.record').removeClass("clicked");  
    $('.record').toggleClass("stopped");  
  });
	
  // チェックボタンは一つだけ押せる仕様に
	$(".checkbox").on("click", function(){
    $('.checkbox').prop('checked', false);  //  全部のチェックを外す
    $(this).prop('checked', true);  //  押したやつだけチェックつける
  });

	// ページ内タブ切り替え
	let tabs_sp = $(".tab");
	$(".tab").on("click", function() {
		$(".active").removeClass("active");
		$(this).addClass("active");
		const index = tabs_sp.index(this);
		$(".tab_item").removeClass("show").eq(index).addClass("show");
	});

	// ページ内タブ（PC版）
	let tabs = $(".tab_pc");
	$(".tab_pc").on("click", function() {
		$(".active").removeClass("active");
		$(this).addClass("active");
		const index = tabs.index(this);
		$(".tab_item").removeClass("show").eq(index).addClass("show");
	});

	// ヘッダー固定の分padding調整
	$(window).on('load resize',function(){
		let height = $("#header").height();
		$("main").css("padding-top", height);
	});


// TOPでは非表示だけどscrollしたらフェードインするページトップボタン
$(function() {
	var topBtn = $('#page_top');    
	topBtn.hide();
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
	});
	//スクロールしてトップ
	topBtn.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});
});

// TOPでは非表示だけどscrollしたらフェードインするアクション
$(function() {
	var topBtn = $('#scroll-appear');    
	topBtn.hide();
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
	});
});

//ページ内リンクがぬるっと動く動作
$(function() {
  var headerHeight = $('header').height();//固定ヘッダーの高さを入れる
  $('[href^="#"]').click(function(){
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top-headerHeight; 
    $("html, body").animate({scrollTop:position}, 200, "swing");//200はスクロールの移動スピードです
    return false;
  });
});

  // ハンバーガーメニュー（メニュー内をクリックしたらページ内遷移する仕様）
  $(function () {
    $(".sp-menu a").on("click", function () {
      if (window.innerWidth <= 970) {
        $(".openMenu").click(); 
      }
    });
  });


// プルダウンメニュー
$(function(){
  $('.slide').hide();
  $('.slide_trigger').on('click',function(){
    $(this).next().slideToggle(300);
    $(this).toggleClass('is_openSlide');
    $('.slide_trigger').not($(this)).next().slideUp();
  });
});

// プルダウンメニューhover時
	$(function(){
		$(".slide-trigger-hover").hover(function() {
			$(this).children("ul").stop().slideToggle(300);//.STOP関数で、アコーディオンメニューが勝手に開閉するのを防ぐ
			// $('nav ul li ul').not($(this).next()).slideUp();
			// $('.qa-box dl dd').not($(this).next()).slideUp();
			$(this).toggleClass('open-slide');
		});
	});

	// ハンバーガーメニュー
	$(function(){
		$('.openMenu').on('click',function(){
			$('body').toggleClass('is_menuOpen');
			$('.hamMenu').fadeToggle(500);//.nav-wrapperが0.5秒でフェードイン(メニューのフェードイン)
			$('body').toggleClass('noscroll');//bodyにnoscrollクラスを付与(スクロールを固定)
		});

	});
	
	$(function() {
		$('[name="trigger"]:radio').change( function() {
			if($('[id=like]').prop('checked')){
			$('.trigger-contents').fadeIn(300);
			// $('.In').fadeIn();
			} else if ($('[id=dislike]').prop('checked')) {
			$('.trigger-contents').fadeOut(300);
			} 
		});
	});

});
