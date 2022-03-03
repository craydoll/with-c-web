$(function () {
  // チェックボタンは一つだけ押せる仕様に
  $('.checkbox').on('click', function () {
    $('.checkbox').prop('checked', false) //  全部のチェックを外す
    $(this).prop('checked', true) //  押したやつだけチェックつける
  })

  // ページ内タブ切り替え
  const tabs_sp = $('.tab')
  $('.tab').on('click', function () {
    $('.active').removeClass('active')
    $(this).addClass('active')
    const index = tabs_sp.index(this)
    $('.tab_item').removeClass('show').eq(index).addClass('show')
  })

  // ページ内タブ（PC版）
  const tabs = $('.tab_pc')
  $('.tab_pc').on('click', function () {
    $('.active').removeClass('active')
    $(this).addClass('active')
    const index = tabs.index(this)
    $('.tab_item').removeClass('show').eq(index).addClass('show')
  })

  // ヘッダー固定の分padding調整
  $(window).on('load resize', function () {
    const height = $('#header').height()
    $('main').css('padding-top', height)
  })

  // matchHeight（要素同士の高さを揃える）
  $(function () {
    $('.match_h1').matchHeight()
    $('.match_h2').matchHeight()
  })

  // TOPでは非表示だけどscrollしたらフェードインするページトップボタン
  $(function () {
    const topBtn = $('#page_top')
    topBtn.hide()
    // スクロールが100に達したらボタン表示
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        topBtn.fadeIn()
      } else {
        topBtn.fadeOut()
      }
    })
    // スクロールしてトップ
    topBtn.click(function () {
      $('body,html').animate(
        {
          scrollTop: 0,
        },
        500
      )
      return false
    })
  })

  // TOPでは非表示だけどscrollしたらフェードインするアクション
  $(function () {
    const topBtn = $('#scroll-appear')
    topBtn.hide()
    // スクロールが100に達したらボタン表示
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        topBtn.fadeIn()
      } else {
        topBtn.fadeOut()
      }
    })
  })

  // ページ内リンクへするっとスライドさせる挙動
  $(function () {
    $('a[href^="#"]').click(function () {
      const speed = 500
      const href = $(this).attr('href')
      const target = $(href == '#' || href == '' ? 'html' : href)
      const position = target.offset().top
      $('html, body').animate({ scrollTop: position }, speed, 'swing')
      return false
    })
  })

  // プルダウンメニュー
  $(function () {
    $('.slide').hide()
    $('.slide_trigger').on('click', function () {
      $(this).next().slideToggle(300)
      $(this).toggleClass('is_openSlide')
      $('.slide_trigger').not($(this)).next().slideUp()
    })
  })

  // プルダウンメニューhover時
  $(function () {
    $('.slide-trigger-hover').hover(function () {
      $(this).children('ul').stop().slideToggle(300) // .STOP関数で、アコーディオンメニューが勝手に開閉するのを防ぐ
      // $('nav ul li ul').not($(this).next()).slideUp();
      // $('.qa-box dl dd').not($(this).next()).slideUp();
      $(this).toggleClass('open-slide')
    })
  })

  // ハンバーガーメニュー
  $(function () {
    $('.openMenu').on('click', function () {
      $('body').toggleClass('is_menuOpen')
      $('.hamMenu').fadeToggle(500) // .nav-wrapperが0.5秒でフェードイン(メニューのフェードイン)
      $('body').toggleClass('noscroll') // bodyにnoscrollクラスを付与(スクロールを固定)
    })
  })

  $(function () {
    $('[name="trigger"]:radio').change(function () {
      if ($('[id=like]').prop('checked')) {
        $('.trigger-contents').fadeIn(300)
        // $('.In').fadeIn();
      } else if ($('[id=dislike]').prop('checked')) {
        $('.trigger-contents').fadeOut(300)
      }
    })
  })

  // サブ写真をメイン写真に表示させる処理
  $(function () {
    $('#subImg img').on('click', function () {
      // mainに切り替えるimgのsrc取得
      img = $(this).attr('src')
      // currentクラス付け替え
      $('#subImg li').removeClass('current')
      $(this).parent().addClass('current')
      // fadeOutできたらsrc変更してfadeIn
      $('#mainImg img').fadeOut(50, function () {
        $('#mainImg img')
          .attr('src', img)
          .on('load', function () {
            $(this).fadeIn()
          })
      })
    })
  })

  // 数量スピーナーボタンの処理
  $(function () {
    let arySpinnerCtrl = []
    const spin_speed = 20 // 変動スピード

    // 長押し押下時
    $('.btnspinner').on('touchstart mousedown click', function (e) {
      if (arySpinnerCtrl.interval) return false
      const target = $(this).data('target')
      arySpinnerCtrl.target = target
      arySpinnerCtrl.timestamp = e.timeStamp
      arySpinnerCtrl.cal = Number($(this).data('cal'))
      // クリックは単一の処理に留める
      if (e.type == 'click') {
        spinnerCal()
        arySpinnerCtrl = []
        return false
      }
      // 長押し時の処理
      setTimeout(function () {
        // インターバル未実行中 + 長押しのイベントタイプスタンプ一致時に計算処理
        if (
          !arySpinnerCtrl.interval &&
          arySpinnerCtrl.timestamp == e.timeStamp
        ) {
          arySpinnerCtrl.interval = setInterval(spinnerCal, spin_speed)
        }
      }, 500)
    })

    // 長押し解除時 画面スクロールも解除に含む
    $(document).on('touchend mouseup scroll', function (e) {
      if (arySpinnerCtrl.interval) {
        clearInterval(arySpinnerCtrl.interval)
        arySpinnerCtrl = []
      }
    })
    // 変動計算関数
    function spinnerCal() {
      const target = $(arySpinnerCtrl.target)
      let num = Number(target.val())
      num = num + arySpinnerCtrl.cal
      if (num > Number(target.data('max'))) {
        target.val(Number(target.data('max')))
      } else if (Number(target.data('min')) > num) {
        target.val(Number(target.data('min')))
      } else {
        target.val(num)
      }
    }
  })
})
