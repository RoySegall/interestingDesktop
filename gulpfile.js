var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
  injectPartials  = require('gulp-inject-partials');

// Compiles, prefixes and minifies style.scss & fruits.scss
gulp.task('sass', function () {
  return gulp.src('./src/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('partials', function () {
  return gulp.src('./src/html/index.html')
    .pipe(injectPartials({
      removeTags: true
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('js', function() {
  return gulp.src('./src/js/main.js')
    .pipe(gulp.dest('./app/js'));
});

gulp.task('build', ['sass', 'partials', 'js']);

gulp.task('serve', ['build'], function() {

  browserSync.init({
    server : './app',
    open: true
  });

  gulp.watch('src/sass/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch('src/sass/*/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch('src/js/*', ['js']).on('change', browserSync.reload);
  gulp.watch('src/html/index.html', ['partials']).on('change', browserSync.reload);
  gulp.watch('src/html/*/*.html', ['partials']).on('change', browserSync.reload);
  gulp.watch('src/speakers/*').on('change', browserSync.reload);
  gulp.watch('src/images/*').on('change', browserSync.reload);
});
