/// <reference path="./lib/jquery/jquery-1.9.1.js" />
/**
 * jQuery pugin : This plugin provides follwing featurs.
 *   - Browser detection.
 *   - Platform detection.
 *   - Resolution of browser dependency problem.
 */
/**
 * @license  Copyright (c) 2013 akinari tsugo
 * This script released under the MIT license (MIT-LICENSE.txt).
 */
;(function (window, document, $, undefined) {
  let Version, BrowserInfo, PlatformInfo

  // ----------------------------------------------------
  // Version class.
  // ----------------------------------------------------
  /**
   * @class
   *
   * Initialize a new instance of the Version class.
   * @public
   * @constructor
   * @param    {string}    version     Version string like "1.2.3.4".
   */
  Version = function (version) {
    // Initialize properties.
    this.original = null
    this.major = null
    this.minor = null
    this.build = null
    this.revision = null

    // Initialize this instance.
    this.initialize(version)
  }

  /**
   * Initialize this instance according to the version string.
   * @private
   * @param    {string}    String indicating version.
   */
  Version.prototype.initialize = function (version) {
    const arr = version.split('.')

    this.original = version
    this.major = arr && arr[0] ? parseInt(arr[0], 10) : null
    this.minor = arr && arr[1] ? parseInt(arr[1], 10) : null
    this.build = arr && arr[2] ? parseInt(arr[2], 10) : null
    this.revision = arr && arr[3] ? parseInt(arr[3], 10) : null
  }

  /**
   * Whether the version is equal or not.
   * @public
   * @param    {number}    major       Major version number.
   * @param    {number}    [minor]     Minor version number.
   * @param    {number}    [build]     Build version number.
   * @param    {number}    [revision]  Revision version number.
   * @return   {boolean}   Whether the version is equal to the specified version.
   */
  Version.prototype.isEqual = function (major, minor, build, revision) {
    if (typeof major !== 'number') {
      return false
    }
    if (typeof minor !== 'number') {
      return this.major === major
    }
    if (typeof build !== 'number') {
      return this.major === major && this.minor === minor
    }
    if (typeof revision !== 'number') {
      return (
        this.major === major && this.minor === minor && this.build === build
      )
    }
    return (
      this.major === major &&
      this.minor === minor &&
      this.build === build &&
      this.revision === revision
    )
  }

  /**
   * Whether the version is or less than the specified versions.
   * @public
   * @param    {number}    major       Major version number.
   * @param    {number}    [minor]     Minor version number.
   * @param    {number}    [build]     Build version number.
   * @param    {number}    [revision]  Revision version number.
   * @return   {boolean}   Whether the version is or less than the specified version.
   */
  Version.prototype.isOrLess = function (major, minor, build, revision) {
    if (typeof major !== 'number') {
      return false
    }
    if (this.major !== major) {
      return this.major < major
    }

    if (typeof minor !== 'number') {
      return true
    }
    if (this.minor !== minor) {
      return this.minor < minor
    }

    if (typeof build !== 'number') {
      return true
    }
    if (this.build !== build) {
      return this.build < build
    }

    if (typeof revision !== 'number') {
      return true
    }
    if (this.revision !== revision) {
      return this.revision < revision
    }

    return true
  }

  /**
   * Whether the version is less than the specfied version.
   * @public
   * @param    {number}    major       Major version number.
   * @param    {number}    [minor]     Minor version number.
   * @param    {number}    [build]     Build version number.
   * @param    {number}    [revision]  Revision version number.
   * @return   {boolean}   Whether the version is less than the specified version.
   */
  Version.prototype.isLessThan = function (major, minor, build, revision) {
    if (typeof major !== 'number') {
      return false
    }
    if (this.major !== major) {
      return this.major < major
    }

    if (typeof minor !== 'number') {
      return false
    }
    if (this.minor !== minor) {
      return this.minor < minor
    }

    if (typeof build !== 'number') {
      return false
    }
    if (this.build !== build) {
      return this.build < build
    }

    if (typeof revision !== 'number') {
      return false
    }
    if (this.revision !== revision) {
      return this.revision < revision
    }

    return false
  }

  /**
   * Whether the version is or more than the specfied version.
   * @public
   * @param    {number}    major       Major version number.
   * @param    {number}    [minor]     Minor version number.
   * @param    {number}    [build]     Build version number.
   * @param    {number}    [revision]  Revision version number.
   * @return   {boolean}   Whether the version is or more than the specified version.
   */
  Version.prototype.isOrMore = function (major, minor, build, revision) {
    if (typeof major !== 'number') {
      return false
    }
    if (this.major !== major) {
      return this.major > major
    }

    if (typeof minor !== 'number') {
      return true
    }
    if (this.minor !== minor) {
      return this.minor > minor
    }

    if (typeof build !== 'number') {
      return true
    }
    if (this.build !== build) {
      return this.build > build
    }

    if (typeof revision !== 'number') {
      return true
    }
    if (this.revision !== revision) {
      return this.revision > revision
    }

    return true
  }

  /**
   * Whether the version is more than the specfied version.
   * @public
   * @param    {number}    major       Major version number.
   * @param    {number}    [minor]     Minor version number.
   * @param    {number}    [build]     Build version number.
   * @param    {number}    [revision]  Revision version number.
   * @return   {boolean}   Whether the version is more than the specified version.
   */
  Version.prototype.isMoreThan = function (major, minor, build, revision) {
    if (typeof major !== 'number') {
      return false
    }
    if (this.major !== major) {
      return this.major > major
    }

    if (typeof minor !== 'number') {
      return false
    }
    if (this.minor !== minor) {
      return this.minor > minor
    }

    if (typeof build !== 'number') {
      return false
    }
    if (this.build !== build) {
      return this.build > build
    }

    if (typeof revision !== 'number') {
      return false
    }
    if (this.revision !== revision) {
      return this.revision > revision
    }

    return false
  }

  /**
   * Get the version string.
   * @public
   * @return   {string}    Version string.
   */
  Version.prototype.toString = function () {
    return this.original
  }

  // ----------------------------------------------------
  // BrowserInfo class.
  // ----------------------------------------------------
  /**
   * @class
   *
   * Initialize a new instance of the BrowserInfo class.
   * @public
   * @constructor
   */
  BrowserInfo = function () {
    // Initialize properties.
    this.original = ''
    this.version = null

    // Initialize this instance.
    this.initialize(window.navigator.userAgent)
  }

  /**
   * Initalize this instance according to the specified user agent string.
   * @private
   * @param    {string}    userAgent       UserAgent string.
   */
  BrowserInfo.prototype.initialize = function (userAgent) {
    let array
    let browser = ''
    let engine = ''
    let architecture = ''
    let version = null

    // Normalize useragent string to lowercase.
    userAgent = userAgent.toLowerCase()

    // Detect browser and browser version.
    if (userAgent.includes('opera') || userAgent.lastIndexOf('opr') >= 0) {
      if (userAgent.includes('opera mini')) {
        // Opera Mini
        browser = 'operamini'

        // Opera Mini/7.0.5
        array = /opera mini\/([\d\.]+)/.exec(userAgent)
        version = array ? array[1] : ''
      } else if (userAgent.includes('opera mobi')) {
        // Opera Mobile
        browser = 'operamobile'

        // Version/12.02
        array = /version\/([\d\.]+)/.exec(userAgent)
        version = array ? array[1] : ''
      } else {
        // Opera
        browser = 'opera'

        // Opera 9.00, Opera/9.0, Version/11.50
        array = /version\/([\d\.]+)/.exec(userAgent)
        if (array) {
          version = array[1]
        } else {
          array = /(?:opera|opr)[\s\/]+([\d\.]+)/.exec(userAgent)
          version = array ? array[1] : ''
        }
      }
    } else if (userAgent.includes('edge')) {
      // Micrrosoft Edge, Windows Phone
      browser = 'edge'

      // Edge/12.0
      array = /edge\/([\d\.]+)/.exec(userAgent)
      version = array ? array[1] : ''
    } else if (
      userAgent.includes('msie') ||
      userAgent.includes('trident')
    ) {
      // Internet Explorer, Windows Phone, Sleipnir, Adobe Bridge
      browser = 'msie'

      // MSIE 9.0, rv 11.0
      array = /(msie|rv:?)\s?([\d\.]+)/.exec(userAgent)
      version = array ? array[2] : ''
    } else if (userAgent.includes('firefox')) {
      // Firefox(not include Mozilla)
      browser = 'firefox'

      // Firefox/0.9.3
      array = /firefox\/([\d\.]+)/.exec(userAgent)
      version = array ? array[1] : ''
    } else if (
      userAgent.includes('chrome') ||
      userAgent.includes('crios')
    ) {
      // Chrome, Android default this
      browser = 'chrome'

      // Chrome/6.0.472.55
      array = /[chrome|crios]\/([\d\.]+)/.exec(userAgent)
      version = array ? array[1] : ''
    } else if (userAgent.includes('android')) {
      // Android default browser
      browser = 'browser'

      // Version/4.0
      array = /version\/([\d\.]+)/.exec(userAgent)
      version = array ? array[1] : ''
    } else if (userAgent.includes('silk')) {
      // Silk
      browser = 'silk'

      // Silk/2.4
      array = /silk\/([\d\.]*)/.exec(userAgent)
      version = array ? array[1] : ''
    } else if (userAgent.includes('mercury')) {
      // Safari
      browser = 'mercury'

      // Mercury/7.4.2
      array = /mercury\/([\d\.]+)/.exec(userAgent)
      version = array ? array[1] : ''
    } else if (userAgent.includes('safari')) {
      // Safari
      browser = 'safari'

      // Version/3.0.3
      array = /version\/([\d\.]+)/.exec(userAgent)
      version = array ? array[1] : ''
    } else {
      // Other case
      browser = 'unknown'
      version = ''
    }

    // Rendering engine
    if (userAgent.includes('edge')) {
      engine = 'edge'
    } else if (userAgent.includes('webkit')) {
      engine = 'webkit'
    } else if (userAgent.includes('trident')) {
      engine = 'trident'
    } else if (userAgent.includes('presto')) {
      engine = 'presto'
    } else if (userAgent.includes('khtml')) {
      engine = 'khtml'
    } else if (userAgent.includes('gecko')) {
      engine = 'gecko'
    } else {
      engine = 'unknown'
    }

    // Architecture.
    if (userAgent.includes('arm')) {
      architecture = 'arm'
    } else if (userAgent.includes('win64')) {
      if (userAgent.includes('ia64')) {
        architecture = 'ia64'
      } else {
        architecture = 'x64'
      }
    } else {
      architecture = 'x86'
    }

    // Set properties.
    this.original = browser
    this[browser] = true
    this[engine] = true
    this[architecture] = true
    this.version = !window.__BACKWARD_COMPATIBILITY_ENABLED
      ? new Version(version)
      : version
  }

  /**
   * Whether the current browser is equal to the specified browser.
   * @public
   * @param    {string}    type    Browser type string.
   * @return   {boolean}   Whether the current browser is equal to the specified browser.
   */
  BrowserInfo.prototype.is = function (type) {
    return typeof type === 'string' && type.toLowerCase() === this.original
  }

  // ----------------------------------------------------
  // PlatformInfo class.
  // ----------------------------------------------------
  /**
   * @class
   *
   * Initialize a new instance of the PlatformInfo class.
   * @public
   * @constructor
   */
  PlatformInfo = function () {
    // Initialize properties.
    this.original = ''

    // Initialize this instance.
    this.initialize(window.navigator.userAgent)
  }

  /**
   * Initialize this instance according to the specified user agent string.
   * @private
   * @param    {string}    userAgent       UserAgent string.
   */
  PlatformInfo.prototype.initialize = function (userAgent) {
    let type = ''
    let platform = ''
    let architecture = ''
    let version = ''
    let result = null
    const mobile =
      /iphone|ipod|ipad|android|windows phone|silk|blackberry|symbian|mobile/
    const pc = /windows|mac|linux/
    let array

    // Normalize useragent string to lowercase.
    userAgent = userAgent.toLowerCase()

    // Detect platform type.
    result = mobile.exec(userAgent)
    if (result) {
      if (userAgent.includes('silk')) {
        // Silk
        type = 'tablet'
        platform = 'android'
      } else {
        if (
          (userAgent.includes('android') &&
            !userAgent.includes('mobile')) ||
          userAgent.includes('ipad')
        ) {
          // Android tablet, iPad
          type = 'tablet'
        } else {
          // Android phone, iPhone, iPod, Windows Phone, BlackBerry, Symbian
          type = 'mobile'
        }
        platform = result[0].replace(' ', '')
      }
    } else if (userAgent.includes('windows')) {
        type = 'pc'
        platform = 'windows'

        // Windows NT x.x
        array = /windows nt ([\d\.]+)/.exec(userAgent)
        version = array ? array[1] : ''

        // Architecture.
        if (userAgent.includes('arm')) {
          architecture = 'arm'
        } else if (userAgent.includes('win64')) {
          if (userAgent.includes('ia64')) {
            architecture = 'ia64'
          } else {
            architecture = 'x64'
          }
        } else if (userAgent.includes('wow64')) {
          architecture = 'x64'
        } else {
          architecture = 'x86'
        }
      } else if (userAgent.includes('mac')) {
        type = 'pc'
        platform = 'mac'
        architecture = 'unknown'
      } else if (userAgent.includes('linux')) {
        type = 'pc'
        platform = 'linux'
        architecture = 'unknown'
      } else {
        // Unknown platform.
        type = 'unknown'
        platform = 'unknown'
        architecture = 'unknown'
      }

    // Set properties.
    this.type = type
    this.original = platform
    this[type] = true
    this[platform] = true
    this[architecture] = true
    this.version = new Version(version)
  }

  /**
   * Whether the current platform is equal to the specified platform.
   * @public
   * @param    {string}    type    Platform type string.
   * @return   {boolean}   Whether the current platform is equal to the specified platform.
   */
  PlatformInfo.prototype.is = function (name) {
    if (typeof name === 'string') {
      name = name.toLowerCase()
      return name === this.original || name === this.type
    } else {
      return false
    }
  }

  // ----------------------------------------------------
  // Output "jquery.depend" function to the jQuery object.
  // ----------------------------------------------------
  /**
   * Provides browser infromation.
   * @public
   * @static
   * @type     BrowserInfo
   */
  $.browser = new BrowserInfo()

  /**
   * Provides platform information.
   * @public
   * @static
   * @type     PlatformInfo
   */
  $.platform = new PlatformInfo()

  /**
   * Resolve the problem of browser dependency or platform dependency.
   * @public
   * @static
   * @param    {object}    condition   Objects that includes condition of browser or platform dependency pattern.
   */
  $.depend = function () {
    let i, length, conditions, condition

    conditions = arguments

    for (i = 0, length = conditions.length; i < length; i++) {
      condition = conditions[i]
      if (
        (condition.on === true || condition.on === undefined) &&
        typeof condition.exe === 'function'
      ) {
        return condition.exe()
      }
    }

    if (window.console && window.console.log) {
      window.console.log(
        'Not implemented default process in "$.depend" function.'
      )
    }

    return undefined
  }
})(window, document, jQuery)
