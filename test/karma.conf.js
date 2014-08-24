module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'client/bower_components/angular-http-auth/src/http-auth-interceptor.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/scripts/directives.js',
      'client/modules/common/auth/services.js',
      'test/unit/client/directives.js',
      'test/unit/client/helpers/browserTrigger.js',
      'test/unit/client/modules/common/auth/services.js'    
    ],

    // web server port
    port: 8080,

    autoWatch : false,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    // plugins : [
    //         'karma-chrome-launcher',
    //         'karma-firefox-launcher',
    //         'karma-jasmine',
    //         'karma-junit-reporter',
    //         'karma-html-reporter'
    //         ],
    
    // reporters: ['progress', 'junit', 'html'],
    reporters: ['progress'],

    // junitReporter : {
    //   outputFile: 'test/test_report/client/unit.xml',
    //   suite: 'unit'
    // },

    // // the default configuration
    // htmlReporter: {
    //   outputDir: 'test/test_report/client',
    //   templatePath: __dirname+'/jasmine_template.html'
    // },

    singleRun: true

  });
};
