/*
 * gulpfile.js
 */

var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var server = require('gulp-express');
var sort = require('gulp-sort');

var target = ['./src/tags/*.jade', './src/tags/**/*.jade'];
var output = './public/scripts';

var pkg = require('./package.json');
var ip = require('ip');

gulp.task('riot', function() {
  gulp
    .src(target)
    .pipe(riot({template: 'pug'}))
    .pipe(sort())
    .pipe(concat('tags.js'))
    .pipe(gulp.dest(output))
    ;
});

gulp.task('watch', function(){
  gulp.watch(target, ['riot']);
});

gulp.task('server', function() {
  server.run(['src/index.js']);
});

gulp.task('default', ['riot', 'watch', 'server']);
