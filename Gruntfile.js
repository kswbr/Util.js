
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // grunt-contrib-connectの設定(Webサーバの設定)
    connect: {
      site: { // オプション未設定の為、空オブジェクト
        options: {
          base: 'htdocs/'
        }
      }
    },

    // grunt-contrib-watchの設定(ウォッチ対象の設定)
    watch: {
      static_files: {
        files: ['**/*.html', '**/*.css']
      },
      js_files: {
        files: '**/*.js'
      },
      options: {
        livereload: true, // watch対象すべてに対してlivereloadオプションを付与
      }
    }
  });

  // Load tasks(grunt実行時に読み込むプラグイン)
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default tasks(grunt実行時に実行するタスク)
  grunt.registerTask('default', ['connect', 'watch']);
};
