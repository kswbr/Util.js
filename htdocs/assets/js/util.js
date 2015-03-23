;(function($, global, document, undefined){

  "use strict";

  var _private = {
    baseImagePath : {default:""},
    images:{default:{}}
  };

  var Public = function(){

    if (typeof global.console === 'undefined') {
      global.console = {
        info: function (){},
        log: function  (){},
        debug: function (){},
        warn: function (){},
        error: function (){},
        memory: function (){},
        table: function (){}
      };
    }

    if (typeof _ === 'undefined'){
      console.error("lo-dash.jsが読み込まれていません");
      return false;
    }

    if (typeof $ === 'undefined'){
      console.error("jQueryが読み込まれていません");
      return false;
    }

    if (!_.isUndefined(global.Util)){
      console.error("Util cannot be instantiated");
      return false;
    }

    return this;
  };

  /*
   *
   * Utilメソッド一覧
   *
   * */
  Public.prototype = {

    setBaseImagePath:function(path,group){

      if (_.isUndefined(group))
        group = "default";

      if (_.last(path) !== "/")
        path += "/";

      _private.baseImagePath[group] = path;
    },

    getBaseImagePath:function(){

      if (_.isUndefined(group))
        group = "default";

      return _private.baseImagePath[group];
    },

    getImagePath:function(image,group){

      if (_.isUndefined(group))
        group = "default";

      return _private.baseImagePath[group] + image;
    },
    cacheImage:function(image,name,group){
      if (_.isUndefined(group))
        group = "default";

      if (_.isUndefined(_private.images[group]))
        _private.images[group] = {};

      _private.images[group][name] = image;
    },
    getPreloadedImage:function(name,group){
      if (_.isUndefined(group))
        group = "default";

      if (_.isUndefined(_private.images[group]))
        _private.images[group] = {};

      return _private.images[group][name];
    },
    preloadImages: function(images,options){
      var d = $.Deferred();
      var self = this;

      var params = _.extend({
        event:"EndPreloadImages",
        group:"default"
      },options);

      var promises = _.map(images,function(v,k){
        var d = $.Deferred();
        var image = new Image();
        try{

          image.src = self.getImagePath(v,params.group);
          self.cacheImage(image,v,params.group);

          image.onload = function(){
            d.resolve();
          };

          image.onerror = function(e){
            d.reject("== imageLoadError!! == ");
          };

        }catch(e){
          d.reject(e);
        }

        return d.promise();
      });

      $.when.apply(this,promises).then(function(){

        if (params.event !== false){
          $(self).triggerHandler(params.event);
        }

        d.resolve();

      },function(e){

        console.error(e);
        if (params.event !== false){
          $(self).triggerHandler(params.event + "Error");
        }

        d.reject();
      });

      return d.promise();
    },

    //
    // http://www.ipentec.com/document/document.aspx?page=javascript-get-parameter
    //
    getQueryString : function() {
      var result = {};

      if ( 1 < window.location.search.length )
      {
        // 最初の1文字 (?記号) を除いた文字列を取得する
        var query = window.location.search.substring( 1 );

        // クエリの区切り記号 (&) で文字列を配列に分割する
        var parameters = query.split( '&' );

        for( var i = 0; i < parameters.length; i++ )
        {
          // パラメータ名とパラメータ値に分割する
          var element = parameters[ i ].split( '=' );

          var paramName = decodeURIComponent( element[ 0 ] );
          var paramValue = decodeURIComponent( element[ 1 ] );

          // パラメータ名をキーとして連想配列に追加する
          result[ paramName ] = paramValue;
        }
      }
      return result;
    },
    searchObjectValue:function(data,keyword){
      var ret = false;

      function search (data,keyword){
        if (ret){
          return false;
        }

        if (!_.isObject(data)){
          return false;
        }

        _.each(data,function(v,k){
          if (k == keyword){
            ret = v;
            return true;
          } else {
            search(v,keyword);
          }
        });
      }

      return (function() {
        search(data,keyword);
        return ret;
      })();

    },
    browser:function(){
      return inazumatv.Browser;
    },
    extend:function(obj,obj2){

      if (!_.isObject(obj) || !_.isObject(obj2))
        return false;

      if (!_.isUndefined(obj.__proto__)){
        _.merge(obj.__proto__ , obj2);
      } else {
        _.merge(obj , obj2);
      }
    },

    getAngle:function(pos1,pos2){

      var x = pos1.x - pos2.x;
      var y = pos1.y - pos2.y;

      var radian= Math.atan2(y,x);
      var angle = radian * 180 / Math.PI;

      if (angle < 0)
        angle = angle + 360;

      return angle;
    },
    getDistance:function(pos1,pos2){

      var dx = Math.abs(pos2.x - pos1.x);
      var dy = Math.abs(pos2.y - pos1.y);
      return Math.sqrt(dx * dx + dy * dy);

    },
    getGeolocation:function(){

      var d = $.Deferred();

      if(navigator.geolocation){

      	//現在位置を取得できる場合の処理
        navigator.geolocation.getCurrentPosition(function(position){
          return d.resolve(position);
        },
        function(error){
          return d.reject({error:2,message:"Geolocation Api Error", info:error});
        },{enableHighAccuracy:true,maximumAge:5000});

      //Geolocation APIに対応していない
      }else{
        return d.reject({error:1,message:"Geolocation Api Not Supported"});
      }

      return d.promise();
    }
  };

  if (!_.isUndefined(global.Util)){
    console.log("Utilオブジェクトがすでに定義されています");
    return false;
  }

  global.Util = new Public();

})(jQuery, this, this.document);

var inazumatv = {};

/**
 * license inazumatv.com
 * author (at)taikiken / http://inazumatv.com
 * date 2013/12/12 - 17:25
 *
 * Copyright (c) 2011-2013 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
( function ( window, inazumatv ){
    "use strict";
    var navigator = window.navigator,
        _ua = navigator.userAgent,

        _ie6 = !!_ua.match(/msie [6]/i),
        _ie7 = !!_ua.match(/msie [7]/i),
        _ie8 = !!_ua.match(/msie [8]/i),
        _ie9 = !!_ua.match(/msie [9]/i),
        _ie10 = !!_ua.match(/msie [10]/i),
        _ie11 = !!_ua.match(/trident\/[7]/i) && !!_ua.match(/rv:[11]/i),
        _ie = !!_ua.match(/msie/i) || _ie11,
        _legacy = _ie6 || _ie7|| _ie8,

        _ipad = !!_ua.match(/ipad/i),
        _ipod = !!_ua.match(/ipod/i),
        _iphone = !!_ua.match(/iphone/i) && !_ipad && !_ipod,
        _ios = _ipad || _ipod || _iphone,

        _android = !!_ua.match(/android/i),
        _mobile = _ios || _android,

        _chrome = !!_ua.match(/chrome/i),
        _firefox = !!_ua.match(/firefox/i),
        _safari = !!_ua.match(/safari/i),
        _android_standard = _android && _safari && !!_ua.match(/version/i),

        _windows = !!_ua.match(/windows/i),
        _mac = !!_ua.match(/mac os x/i),

        _touch = typeof window.ontouchstart !== "undefined",

        _fullScreen = typeof navigator.standalone !== "undefined" ? navigator.standalone : false,

        _android_phone = false,
        _android_tablet = false,
        _ios_version = -1,
        _safari_version = -1,

        _safari_versions = [ -1, 0, 0 ],
        _ios_versions,

        _android_version = -1,
        _android_versions,

        _chrome_version = -1,

        _canvas = !!window.CanvasRenderingContext2D,

        _transition;

    if ( _android ) {
        _android_phone = !!_ua.match(/mobile/i);

        if ( !_android_phone ) {
            _android_tablet = true;
        }
    }

    if ( _android_standard ) {
        _chrome = false;
        _safari = false;
    }

    if ( _chrome ) {
        _safari = false;
    }
    // private
    // iOS version
    // http://stackoverflow.com/questions/8348139/detect-_ios-version-less-than-5-with-javascript
    /**
     * iOS version detection
     * @for Browser
     * @method _iosVersion
     * @return {Array} iOS version 配列 3桁
     * @private
     */
    function _iosVersion () {
        var v, versions = [ -1, 0, 0 ];
        if ( _ios ) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            _ios_version = parseFloat( versions[ 0 ] + "." + versions[ 1 ] + versions[ 2 ] );
        }

        return versions;
    }
    _ios_versions = _iosVersion();

    /**
     * Android version detection
     * @for Browser
     * @method _androidVersion
     * @return {Array} Android version 配列 3桁
     * @private
     */
    function _androidVersion () {
        var v, versions = [ -1, 0, 0 ];
        if ( _android ) {
            v = (navigator.appVersion).match(/Android (\d+)\.(\d+)\.?(\d+)?/);
            versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            _android_version = parseFloat( versions[ 0 ] + "." + versions[ 1 ] + versions[ 2 ] );
        }

        return versions;
    }
    _android_versions = _androidVersion();

    // Safari version
    /**
     * Safari version detection
     * @return {Array} Safari version 配列 2桁~3桁
     * @private
     */
    function _safariVersion () {
        var v, versions;

        v = (navigator.appVersion).match(/Version\/(\d+)\.(\d+)\.?(\d+)?/);
        versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        _safari_version = parseFloat( versions[ 0 ] + "." + versions[ 1 ] + versions[ 2 ] );
        return versions;
    }

    if ( _safari && !_mobile ) {
        // not _mobile and _safari
        _safari_versions = _safariVersion();
    }

    function _chromeVersion () {
        var v, versions;

        v = (navigator.appVersion).match(/Chrome\/(\d+)\.(\d+)\.(\d+)\.?(\d+)?/);
        versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3], 10), parseInt(v[4], 10)];
        return versions.join( "." );
    }

    if (_chrome ) {
        _chrome_version = _chromeVersion();
    }

    // transition support
    // http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
    _transition = ( function (){
        var p = document.createElement( "p" ).style;

        return "transition" in p || "WebkitTransition" in p || "MozTransition" in p || "msTransition" in p || "OTransition" in p;

    }() );

    /**
     * Browser 情報を管理します
     * @class Browser
     * @constructor
     */
    var Browser = function () {
        throw "Browser cannot be instantiated";
    };

    /**
     *
     * @type {object}
     */
    Browser = {
        // new version
        /**
         * iOS に関する情報
         * @for Browser
         * @property iOS
         * @type Object
         * @static
         */
        iOS: {
            /**
             * @for Browser.iOS
             * @method is
             * @return {boolean} iOS か否かを返します
             * @static
             */
            is: function (){
                return _ios;
            },
            /**
             * @for Browser.iOS
             * @method number
             * @return {Array} iOS version number を返します [ major, minor, build ]
             * @static
             */
            number: function (){
                return _ios_versions;
            },
            /**
             * @for Browser.iOS
             * @method major
             * @return {Number} iOS major version number を返します
             * @static
             */
            major: function (){
                return _ios_versions[ 0 ];
            },
            /**
             * @for Browser.iOS
             * @method version
             * @return {Number} iOS version を返します 9.99
             * @static
             */
            version: function (){
                return _ios_version;
            },
            /**
             * @for Browser.iOS
             * @method iPhone
             * @return {Boolean} iPhone か否かを返します
             * @static
             */
            iPhone: function (){
                return _iphone;
            },
            /**
             * @for Browser.iOS
             * @method iPad
             * @return {Boolean} iPad か否かを返します
             * @static
             */
            iPad: function (){
                return _ipad;
            },
            /**
             * @for Browser.iOS
             * @method iPod
             * @return {Boolean} iPod か否かを返します
             * @static
             */
            iPod: function (){
                return _ipod;
            },
            /**
             * @for Browser.iOS
             * @method fullScreen
             * @return {boolean} standalone mode か否かを返します
             * @static
             */
            fullScreen: function (){
                return _fullScreen;
            }
        },
        /**
         * Android に関する情報
         * @for Browser
         * @property Android
         * @type Object
         * @static
         */
        Android: {
            /**
             * @for Browser.Android
             * @method is
             * @return {boolean} Android か否かを返します
             * @static
             */
            is: function (){
                return _android;
            },
            /**
             * @for Browser.Android
             * @method number
             * @return {Array} Android version number を返します [ major, minor, build ]
             * @static
             */
            number: function (){
                return _android_versions;
            },
            /**
             * @for Browser.Android
             * @method major
             * @return {Number} Android major version number を返します
             * @static
             */
            major: function (){
                return _android_versions[ 0 ];
            },
            /**
             * @for Browser.Android
             * @method version
             * @return {Number} Android version を返します 9.99
             * @static
             */
            version: function (){
                return _android_version;
            },
            /**
             * @for Browser.Android
             * @method phone
             * @return {boolean} Android Phone か否かを返します
             * @static
             */
            phone: function (){
                return _android_phone;
            },
            /**
             * @for Browser.Android
             * @method tablet
             * @return {boolean} Android Tablet か否かを返します
             * @static
             */
            tablet: function (){
                return _android_tablet;
            },
            /**
             * @for Browser.Android
             * @method standard
             * @return {boolean} Android standard Browser か否かを返します
             * @static
             */
            standard: function () {
                return _android_standard;
            }
        },
        /**
         * IE に関する情報
         * @for Browser
         * @property IE
         * @type Object
         * @static
         */
        IE: {
            /**
             * @for Browser.IE
             * @method is
             * @return {boolean} IE か否かを返します
             * @static
             */
            is: function (){
                return _ie;
            },
            /**
             * @for Browser.IE
             * @method is6
             * @return {boolean} IE 6 か否かを返します
             */
            is6: function (){
                return _ie6;
            },
            /**
             * @for Browser.IE
             * @method is7
             * @return {boolean} IE 7 か否かを返します
             */
            is7: function (){
                return _ie7;
            },
            /**
             * @for Browser.IE
             * @method is8
             * @return {boolean} IE 8 か否かを返します
             */
            is8: function (){
                return _ie8;
            },
            /**
             * @for Browser.IE
             * @method is9
             * @return {boolean} IE 9 か否かを返します
             */
            is9: function (){
                return _ie9;
            },
            /**
             * @for Browser.IE
             * @method is10
             * @return {boolean} IE 10 か否かを返します
             */
            is10: function (){
                return _ie10;
            },
            /**
             * @for Browser.IE
             * @method is11
             * @return {boolean} IE 11 か否かを返します
             */
            is11: function (){
                return _ie11;
            },
            /**
             * @for Browser.IE
             * @method _legacy
             * @return {boolean} IE 6 or 7 or 8 か否かを返します
             */
            legacy: function (){
                return _legacy;
            },
            /**
             * @for Browser.IE
             * @method version
             * @return {Number} IE version を返します int 6 ~ 11, IE 6 ~ IE 11 でない場合は -1 を返します
             * @static
             */
            version: function (){
                var v = -1;
                if ( _ie11 ) {
                    v = 11;
                } else if ( _ie10 ) {
                    v = 10;
                } else if ( _ie9 ) {
                    v = 9;
                } else if ( _ie8 ) {
                    v = 8;
                } else if ( _ie7 ) {
                    v = 7;
                } else if ( _ie6 ) {
                    v = 6;
                }
                return v;
            }
        },
        /**
         * Chrome に関する情報
         * @for Browser
         * @property Chrome
         * @type Object
         * @static
         */
        Chrome: {
            /**
             * @for Browser.Chrome
             * @method is
             * @return {boolean} Chrome か否かを返します
             * @static
             */
            is: function (){
                return _chrome;
            },
            /**
             * @for Browser.Chrome
             * @method version
             * @return {string|number}
             */
            version: function () {
                return _chrome_version;
            }
        },
        /**
         * Safari に関する情報
         * @for Browser
         * @property Safari
         * @type Object
         * @static
         */
        Safari: {
            /**
             * @for Browser.Safari
             * @method is
             * @return {boolean} Safari か否かを返します
             * @static
             */
            is: function (){
                return _safari;
            },
            /**
             * @for Browser.Safari
             * @method number
             * @return {Array} Safari version number を返します [ major, minor, build ]
             * @static
             */
            number: function (){
                return _safari_versions;
            },
            /**
             * @for Browser.Safari
             * @method major
             * @return {Number} Safari major version number を返します
             * @static
             */
            major: function (){
                return _safari_versions[ 0 ];
            },
            /**
             * @for Browser.Safari
             * @method version
             * @return {Number} Safari version を返します 9.99
             * @static
             */
            version: function (){
                return _safari_version;
            }
        },
        /**
         * Firefox に関する情報
         * @for Browser
         * @property Firefox
         * @type Object
         * @static
         */
        Firefox: {
            /**
             * @for Browser.Firefox
             * @method is
             * @return {boolean} Firefox か否かを返します
             * @static
             */
            is: function (){
                return _firefox;
            }
        },
        /**
         * Touch action に関する情報
         * @for Browser
         * @property Touch
         * @type Object
         * @static
         */
        Touch: {
            /**
             * @for Browser.Touch
             * @method is
             * @return {boolean} Touch 可能か否かを返します
             * @static
             */
            is: function (){
                return _touch;
            }
        },
        /**
         * Mobile action に関する情報
         * @for Browser
         * @property Mobile
         * @type Object
         * @static
         */
        Mobile: {
            /**
             * @for Browser.Mobile
             * @method is
             * @return {boolean} mobile(smart phone) か否かを返します
             * @static
             */
            is: function (){
                return _mobile;
            },
            /**
             * iPhone, Android phone. URL bar 下へスクロールさせます。<br>
             * window.onload 後に実行します。<br>
             * iOS 7 mobile Safari, Android Chrome and iOS Chrome では動作しません。
             *
             *     function onLoad () {
             *          window.removeEventListener( "load", onLoad );
             *          Browser.Mobile.hideURLBar();
             *     }
             *     window.addEventListener( "load", onLoad, false );
             *
             * @for Browser.Mobile
             * @method hideURLBar
             * @static
             */
            hideURLBar : function (){
                setTimeout( function (){ scrollBy( 0, 1 ); }, 0);
            },
            /**
             * @for Browser.Mobile
             * @method phone
             * @return {boolean} Smart Phone(include iPod)か否かを返します
             * @static
             */
            phone: function (){
                return _ipod || _iphone || _android_phone;
            },
            /**
             * @for Browser.Mobile
             * @method tablet
             * @return {boolean} tablet か否かを返します
             * @static
             */
            tablet: function (){
                return _ipad || _android_tablet;
            }
        },
        /**
         * Canvas に関する情報
         * @for Browser
         * @property Canvas
         * @type Object
         * @static
         */
        Canvas: {
            /**
             * @for Browser.Canvas
             * @method is
             * @return {boolean} canvas 2D が使用可能か否かを返します
             * @static
             */
            is: function (){
                return _canvas;
            },
            /**
             * @for Browser.Canvas
             * @method webgl
             * @return {boolean} canvas webgl 使用可能か否かを返します
             * @static
             */
            webgl: function (){
                if ( !_canvas ) {
                    return false;
                }

                try {
                    return !!window.WebGLRenderingContext && !!document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
                } catch( e ) {
                    return false;
                }
            }
        },
        Mac: {
            /**
             * @for Browser.Mac
             * @method is
             * @return {boolean} Mac OS X or not
             * @static
             */
            is: function () {
                return _mac;
            }
        },
        Windows: {
            /**
             * @for Browser.Windows
             * @method is
             * @return {boolean} Windows or not
             */
            is: function () {
                return _windows;
            }
        },
        Transition: {
            /**
             * @for Browser.Transition
             * @method is
             * @return {boolean} CSS3 transition support or not
             */
            is: function () {

                return _transition;
            }
        }
    };

    inazumatv.Browser = Browser;

    // below for compatibility to older version of inazumatv.util
    inazumatv.browser = Browser;

}( window, this.inazumatv || {} ) );
