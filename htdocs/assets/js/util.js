(function($, global, document, undefined){

  "use strict";

  var _private = {
    baseImagePath : "",

    isSupportConsole : function(method){
      return !_.isUndefined(console) && !_.isUndefined(method);
    },

    consoleTest : function(enable,method){
      if (!this.isSupportConsole(method)){
        return false;
      }

      if (_.isUndefined(enable)){
        enable = true;
      }

      return enable;
    }

  };


  var Public = function(){

    //コンストラクタ
    console.log("Utilオブジェクト生成");

    if (typeof _ === 'undefined'){
      console.log("lo-dash.js)が読み込まれていません");
      return false;
    }

    if (typeof $ === 'undefined'){
      console.log("Jqueryが読み込まれていません");
      return false;
    }

  }

  Public.prototype = {

    log : function(data,enable){
      if (_private.consoleTest(enable, console.log) !== false){
        console.log(data);
      }
    },

    time: function(name,enable){
      if (_private.consoleTest(enable, console.time) !== false){
        console.time(name);
      }
    },

    timeEnd: function(name,enable){
      if (_private.consoleTest(enable, console.timeEnd) !== false){
        console.timeEnd(name);
      }
    },

    setBaseImagePath:function(path){
      _private.baseImagePath = path;
    },

    getBaseImagePath:function(){
      return _private.baseImagePath;
    },

    preloadImages: function(images,event_name){
      var path = _private.baseImagePath;
      var d = $.Deferred();
      var self = this;
      var event = event_name;

      var promises = _.map(images,function(v,k){
        var d = $.Deferred();
        var image = new Image();

        image.src = path + v;
        image.onload = function(){
          d.resolve();
        };
        return d.promise();
      });

      $.when.apply(this,promises).then(function(){

        if (_.isUndefined(event)) {
          event = "EndPreloadImages";
        }

        if (event !== false){
          $(self).triggerHandler(event);
        }

        d.resolve();

      });

      return d.promise();
    },
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
    extend:function(obj,obj2){

      if (!_.isObject(obj) || !_.isObject(obj2))
        return false;

      if (!_.isUndefined(obj.__proto__)){
        _.extend(obj.__proto__ , obj2);
      } else {
        _.extend(obj , obj2);
      }
    }
  }

  if (!_.isUndefined(global.Util)){
    console.log("Utilオブジェクトがすでに定義されています");
    return false;
  }

  global.Util = Public;

})(jQuery, this, this.document);
