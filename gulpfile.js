var gulp = require('gulp');
var gulpUglify = require('gulp-uglify');
var gulpConcat = require('gulp-concat');
var gulpUtil = require('gulp-util');
var gulpSass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var gulpCssnano = require('gulp-cssnano');
var gulpRename = require('gulp-rename');

/*
gulp.task('foundationJavascripts', function() {
  return gulp.src('node_modules/foundation-sites/js/*.js')
  .pipe(gulpConcat('foundation.min.js'))
  .pipe(gulpUglify()).on('error', function(e){
    console.log(e);
  })
  .pipe(gulp.dest('public/javascripts/foundation/'));
});*/


gulp.task('browserSync', function() {
  browserSync.init({
    port: 81,
    proxy: "http://localhost:80"
  });
});


gulp.task('sass', function() {
  return gulp.src(['node_modules/foundation-sites/assets/foundation.scss', 'scss/*.scss'])
    .pipe(gulpSass())
    .pipe(gulpCssnano({
      safe: true
    }))
    .pipe(gulpRename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/stylesheets/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch(['scss/*.scss'], ['sass']);
  // gulp.watch('public/javascripts/app.js', browserSync.reload); // does not work
})


/*
gulp.task('foundationScss', function() {
  return gulp.src('node_modules/foundation-sites/assets/foundation.scss')
  //.pipe(gulpConcat('foundation.min.js'))
  .pipe(gulpUglify()).on('error', function(e){
    console.log(e);
  })
  .pipe(gulp.dest('public/javascripts/foundation/'));
});*/


//gulp.task('default', ['foundationJavascripts', 'sassStyles']);

// gulp.task('watch', function() {
//   gulp.watch('source/javascript/**/*.js', ['jshint']);
//   gulp.watch('source/scss/**/*.scss', ['build-css']);
// });

// gulp.task('default', function() {
//     gulp.run('foundationJavascripts');

    // gulp.watch('app/src/**', function(event) {
    //     gulp.run('scripts');
    // })
    //
    // gulp.watch('app/css/**', function(event) {
    //     gulp.run('styles');
    // })
    //
    // gulp.watch('app/**/*.html', function(event) {
    //     gulp.run('html');
    // })
// })
