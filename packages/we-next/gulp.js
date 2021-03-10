const { src, dest } = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

exports.default = function () {
  return src('./src/assets/styles/*.less')
  .pipe(less())
  .pipe(autoprefixer())
  .pipe(cssmin())
  .pipe(concat('index.css'))
  .pipe(dest('./dist/styles'))
}
