;(function (d, $) {
  let jQdm_slideMenu
  jQdm_slideMenu = function () {
    const prop = {
      deferredImage: 'img.deferred',
      subContainer: '#subContainer',
      mainNavigation_trigger: '.mainNavigation_trigger',
      mainNavigation_appear: '.appeared',
    }
    function init() {
      $(prop.deferredImage).lazyload({
        threshold: 10,
        effect: 'fadeIn',
        effectspeed: 1000,
      })
      $(prop.mainNavigation_trigger)
        .find('a')
        .on('click', function () {
          $(prop.subContainer).toggleClass(
            replaceString(prop.mainNavigation_appear)
          )
        })
    }
    function replaceString(_str, _bf, _af, _flg) {
      const _reg = new RegExp(_bf || '[\\.#]', _flg || '')
      return _str ? _str.replace(_reg, _af || '') : false
    }
    init()
  }
  jQdm_slideMenu()
})(document, jQuery)
