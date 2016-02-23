var fs = require('fs');
var srcFolder = 'src';
var outputFolder = 'dist';
var version = '0.0.2';
// var baseJs = fs.readFileSync('src/js/base.js','utf8');
// var firstLine = baseJs.substring(0,baseJs.indexOf(';'));
// version = firstLine.split('=')[1].replace(/'/g,'').replace(/\s/g,'');
var zipName = 'yueHuiTiaoZhanWeChat';
module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
      dev: {
        options:{
          sourceMap:true
        },
        files:[{
          expand: true,
          cwd:srcFolder+'/js',
          src:'*.js',
          dest:outputFolder+'/js'
        }]
      },
      dist: {
        options:{
          sourceMap:false
        },
        files:[{
          expand: true,
          cwd:srcFolder+'/js',
          src:'*.js',
          dest:outputFolder+'/js'
        }]
      },
      mock: {
        options:{
          sourceMap:true
        },
        files:{
          'dist/js/base.js':[
            srcFolder+'/js/mock/mock.js',
            srcFolder+'/js/base.js'
          ]
        }
      },
      lib: {
        options:{
          sourceMap:false
        },
        files:[{
          expand: true,
          cwd:srcFolder+'/js/lib',
          src:'*.js',
          dest:outputFolder+'/js/lib'
        }]
      },
    },
    sass: {
      all: {
        options:{       
          style:'compressed',
          sourcemap:'none'
        },
        files:[{
            expand:true,
            cwd:srcFolder+'/scss',
            src:'*.scss',
            dest:outputFolder+'/css',
            ext:'.css'
        }]
      }
    },
    htmlmin: {
      all: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files:[{
            expand:true,
            cwd:srcFolder+'/html',
            src:'*.html',
            dest:outputFolder+'/html'
        }]
      }
    },
    watch:{
      js:{
        files:[srcFolder+'/js/*.js','!'+srcFolder+'/js/base.js'],
        tasks:['newer:uglify:dev']
      },
      lib:{
        files:[srcFolder+'/js/lib/*.js'],
        tasks:['newer:uglify:lib']
      },
      mock:{
        files:[srcFolder+'/js/mock/mock.js',srcFolder+'/js/base.js'],
        tasks:['uglify:mock']
      },
      css:{
        files:[srcFolder+'/scss/*.scss'],
        tasks:['newer:sass:all']
      },
      html:{
        files:[srcFolder+'/html/*.html'],
        tasks:['newer:htmlmin:all']
      }
    },
    clean: {
      script:{
        files: [
          {expand: true, src: [outputFolder+'/css/*.css',outputFolder+'/js/*.js']}
        ]
      },
      map: {
        files: [
          {expand: true, src: [outputFolder+'/css/*.map',outputFolder+'/js/*.map']}
        ]
      }
    },
    command: {
      zip:{
        cmd:'zip -r builds/'+zipName+version+'.zip '+outputFolder
      },
      cdn:{
        cmd:'node cdn.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-commands');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('default', ['newer:uglify:dev','newer:uglify:lib','uglify:mock','newer:sass:all','newer:htmlmin:all','watch']);
  grunt.registerTask('build', ['clean:script','uglify:dist','sass:all','htmlmin:all','clean:map','command:cdn']);
}