
const gulp = require('gulp');
const gutil = require('gulp-util');
const child = require('child_process');
const browserSync = require('browser-sync').create();

const siteRoot = '_site';
const mainCSS = '_sass/main.scss'; /* Main stylesheet (pre-build) */

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll'; /* Fix Windows compatibility issue */

/**
 * Build Jekyll Site
 */
gulp.task('jekyll-build', ['css'], function () {
  browserSync.notify('Running: $ jekyll build');
  return child.spawn(jekyll, ['build'], { stdio: 'inherit' });
});

/**
 * Compile styles
 */
gulp.task('css', function () {
  const autoprefix = require('gulp-autoprefixer');
  const minify = require('gulp-clean-css');
  const sass = require('gulp-sass');

  return gulp.src(mainCSS)
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(autoprefix({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minify())
    .pipe(gulp.dest('assets/css/'))
});

/**
 * Serve site with BrowserSync
 */
gulp.task('serve', ['jekyll-build'], () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    open: "local",
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(['**/*.scss', '**/**/*.scss', '**/*.html', '**/*.md', '**/*.yml', '!_site/**/*'], ['jekyll-build']);
});

gulp.task('default', ['serve']);