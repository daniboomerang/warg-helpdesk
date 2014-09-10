// Generated on 2014-02-07 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    shell: {
      deployToBuild: {
        command: './build-tools/push-to-virtualama-build.sh'
      }
    },

    yeoman: {
      app: require('./bower.json').appPath || 'client',
      dist: 'www'
    },

    express: {
      options: {
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },

    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['copy:client', 'express:dev'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    'bower-install': {
      app: {
        html: '<%= yeoman.app %>/index.html',
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      client: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '**/{,*/}*.*'
          ]
        }]
      },
      domain: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.domain %>',
          dest: '<%= yeoman.appdomain %>',
          src: [
            '*.js'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'modules/**/{,*/}*.html',
            'bower_components/**/*',
            'modules/**/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            'fonts/*',
            'config.xml'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/styles/vendor/bootstrap',
          dest: '<%= yeoman.dist %>',
          src: ['fonts/*']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/bower_components/font-awesome',
          dest: '<%= yeoman.dist %>',
          src: ['fonts/*']
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/concat/styles/main.css'
    //       ],
    //       '<%= yeoman.dist %>/styles/vendor.css': [
    //         '.tmp/concat/styles/vendor.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    replace: {
      development: {
        options: {
          patterns: [{
            json: grunt.file.readJSON('./build-tools/development.json')
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['./build-tools/.gitignore'],
          dest: './'
        }]
      },

      staging: {
        options: {
          patterns: [{
            json: grunt.file.readJSON('./build-tools/heroku.json')
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['./build-tools/.gitignore'],
          dest: './'
        }]
      }
    }

  });


  grunt.registerTask('debug', function (target) {
    grunt.task.run([
      'clean:dist',
      'copy:client',
      'clean:server',
      'bower-install',
      'concurrent:server',
      'autoprefixer',
      'express:dev',
      'watch'
    ]);
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'build',
      'express:dev',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'copy:domain',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma',
    'jasmine'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'replace:staging',
    'bower-install',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);
  
  grunt.registerTask('qb', [
    'clean:dist',
    'bower-install',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);

  grunt.registerTask('clone-client', [
    'clean:dist',
    'copy:client'
  ]);

  grunt.registerTask('deploy-to-build', ['shell:deployToBuild']);

  grunt.loadNpmTasks('grunt-replace');

  grunt.loadNpmTasks('grunt-shell');

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.loadNpmTasks('grunt-express-server');
  
  grunt.registerTask('staging', [
  ]);
};
