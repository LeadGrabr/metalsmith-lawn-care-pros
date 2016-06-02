var Metalsmith = require('metalsmith');
var reactTemplate = require('metalsmith-react-templates');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var assets = require('metalsmith-assets');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');

new Metalsmith(__dirname)
    .source('./src')
    .clean(true)
    .use(reactTemplate({
        babel: true,
        directory: 'templates',
        baseFile: 'base.html',
        isStatic: false
    }))
    .use(assets({
        source: './assets', // relative to the working directory
        destination: './' // relative to the build directory
    }))
    .use(serve())
    .use(
        watch({
          paths: {
            "${source}/**/*": true
          },
          livereload: true,
        })
    )
    .destination('./build')
    .build(function(err) {
        if (err) {
            throw err;
        }

        browserify({ debug: true })
            .transform(babelify)
            .require('./scripts/loader.js', { entry: true })
            .bundle()
            .on("error", function (err) {
                console.log("Error: " + err.message);
            })
            .pipe(fs.createWriteStream('./build/bundle.js'));
    });



