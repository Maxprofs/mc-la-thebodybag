// Generated on 2014-11-18 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}{,*/}{,*/}*.*'],
        tasks: ['requirejs:dev'],
        options: {
          livereload: true
        }
      },
      json: {
        files: ['<%= config.app %>/resources/{,*/}{,*/}{,*/}*.*'],
        tasks: ['requirejs:dev'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      compass: {
        files: ['<%= config.app %>/styles/{,*/}{,*/}{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      videos: {
        files: [{
          src: [
            '<%= config.dist %>/videos/*'
          ]
        }]
      }
    },

    // Deployment
    secret: grunt.file.readJSON('secret.json'),
    sftp: {
      staging: {
        options: {
          host: '<%= secret.staging.host %>',
          path: '<%= secret.staging.path %>',
          username: '<%= secret.staging.username %>',
          password: '<%= secret.staging.password %>',
          srcBasePath: '<%= config.dist %>',
          createDirectories: true,
          showProgress: true
        },
        files: {
          "./": "<%= config.dist %>/**"
        }
      }
    },

    open : {
      staging : {
        path: '<%= secret.staging.publicUrl %>',
        app: 'Google Chrome'
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/*.{ico,png}',
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '<%= config.dist %>/images/{,*/}*.*',
            '<%= config.dist %>/styles/fonts/{,*/}*.*'
          ]
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= config.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= config.app %>/images',
        javascriptsDir: '<%= config.app %>/scripts',
        fontsDir: '<%= config.app %>/fonts',
        importPath: 'bower_components',
        httpImagesPath: '../images',
        httpGeneratedImagesPath: '../images/generated',
        httpFontsPath: '../fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= config.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ],
        patterns: {
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css'],
      json: ['<%= config.dist %>/resources/{,*/}*.json'],
      js: ['<%= config.dist %>/scripts/{,*/}*.js']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: [
            '{,*/}*.{gif,jpeg,jpg,png}',
            '!inline/*'
          ],
          dest: '<%= config.dist %>/images',
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    requirejs: {
      dev: {
        options: {
          baseUrl: '<%= config.app %>/scripts',
          mainConfigFile: '<%= config.app %>/scripts/main.js',
          almond: true,
          include: ['main'],
          name: '../../bower_components/almond/almond',
          out: '.tmp/scripts/application.js',
          wrap: true,
          useStrict: true,
          removeCombined: true,
          generateSourceMaps: true,
          findNestedDependencies: true,
          preserveLicenseComments: false,
          optimize: 'none'
        }
      },
      dist: {
        options: {
          baseUrl: '<%= config.app %>/scripts',
          mainConfigFile: '<%= config.app %>/scripts/main.js',
          almond: true,
          include: ['main'],
          name: '../../bower_components/almond/almond',
          out: '<%= config.dist %>/scripts/application.js',
          wrap: true,
          useStrict: true,
          keepBuildDir: false,
          removeCombined: true,
          generateSourceMaps: false,
          findNestedDependencies: true,
          preserveLicenseComments: false
        }
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    
    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beaufify: {
            indent_start: 0,
            indent_level: 4,
            beaufity: true
          },
          preserveComments: true
        },
        files: {          
          '.tmp/scripts/header.js': [
            '<%= config.app %>/scripts/helper.js'
          ]
        }
      },
      dist: {
        options: {
          mangle: true,
          compress: true,
          beaufify: false,
          preserveComments: false
        },
        files: {          
          '<%= config.dist %>/scripts/header.js': [
            '<%= config.app %>/scripts/helper.js'
          ]
        }
      }
    },

    concat: {
      copyright: {
        files: {
          '<%= config.dist %>/scripts/application.js': [
            '<%= config.app %>/scripts/copyright.js',
            '<%= config.dist %>/scripts/application.js'
          ],
          '<%= config.dist %>/scripts/header.js': [
            '<%= config.app %>/scripts/copyright.js',
            '<%= config.dist %>/scripts/header.js'
          ],
          '<%= config.dist %>/styles/application.css': [
            '<%= config.app %>/scripts/copyright.js',
            '.tmp/styles/application.css'
          ]
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*',
            'videos/{,*/}*.*',
            'resources/{,*/}*.*',
            '!images/svg'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'uglify:dev',
      'requirejs:dev',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'uglify:dist',
    'requirejs:dist',
    'concat:copyright',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);

  // Deploying through SFTP
  grunt.registerTask('deploy:staging', [
    'build',
    'clean:videos',
    'sftp:staging',
    'open:staging'
  ]);
};
