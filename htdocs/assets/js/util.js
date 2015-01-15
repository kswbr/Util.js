(function($, global, document, undefined){

  //文法の厳密化だけでなく、モダンブラウザのjs処理最適化も行う場合がある
  "use strict";

  var Private = function(){}

  Private.prototype = {
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

    this.extend({_private:new Private()});

    //コンストラクタ
    console.log("Utilオブジェクト生成");

    if (typeof _ === 'undefined'){
      console.log("lo-dash(Underscore.js)が読み込まれていません");
      return false;
    }

    if (typeof $ === 'undefined'){
      console.log("Jqueryが読み込まれていません");
      return false;
    }

  }

  Public.prototype = {

    log : function(data,enable){
      if (this._private.consoleTest(enable, console.log) !== false){
        console.log(data);
      }
    },

    time: function(name,enable){
      if (this._private.consoleTest(enable, console.time) !== false){
        console.time(name);
      }
    },

    timeEnd: function(name,enable){
      if (this._private.consoleTest(enable, console.timeEnd) !== false){
        console.timeEnd(name);
      }
    },

    setBaseImagePath:function(path){
      this._private.baseImagePath = path;
    },

    getBaseImagePath:function(){
      return this._private.baseImagePath;
    },

    preloadImages: function(images,event_name){
      var path = this._private.baseImagePath;
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
    extend:function(obj){
      if (!_.isUndefined(this.__proto__)){
       _.extend(this.__proto__,obj);
      } else {
       _.extend(this,obj);
      }
    }
  }

  global.Util = Public;
})(jQuery, this, this.document);
