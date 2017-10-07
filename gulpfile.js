const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const child = require('child_process');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create()

const cssFiles = '_css/**/*.?(s)css';
const jsFiles = '_js/*.js';
const siteRoot = '_site';

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('assets'))
});

gulp.task('js', () => {
  gulp.src(jsFiles)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('assets'))
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
  
  gulp.watch(cssFiles, ['css']);
  gulp.watch(jsFiles, ['js']);
});

gulp.task('default', ['css', 'js', 'jekyll', 'serve']);