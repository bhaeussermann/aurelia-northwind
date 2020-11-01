const gulp = require('gulp');
const gulpLiveServer = require('gulp-live-server');
const browserSync = require('browser-sync');
const del = require('del');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

gulp.task('clean', () => del('dist'));

gulp.task('build', gulp.series(
  'clean',
  runBuild
));

function runBuild() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig(), (err, stats) => {
      if (err) reject(err);
      else if (stats.hasErrors()) reject(new Error(stats.compilation.errors.join('\n')));
      else resolve();
    });
  })
}

gulp.task('serve', gulp.series(
  'build',
  startServer,
  configureBrowserSync
));

function startServer(done) {
  gulpLiveServer.new('./server.js').start();
  done();
}

function configureBrowserSync() {
  return new Promise((resolve, reject) => {
    browserSync({
      online: false,
      open: false,
      port: 7000,
      logLevel: 'silent',
      proxy: 'localhost:9000'
    }, function (err, bs) {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }
      const urls = bs.options.get('urls').toJS();
      console.log(`Application Available At: ${urls.local}`);
      console.log(`BrowserSync Available At: ${urls.ui}`);
      resolve();
    });
  })
}

gulp.task('serve:watch', gulp.series(
  'serve',
  watchSourceFiles
));

function watchSourceFiles(done) {
  gulp.watch('src', refresh);
  done();
}

const refresh = gulp.series(
  'build',
  reload
);

function reload(done) {
  browserSync.reload();
  done();
}
