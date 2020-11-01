const gulp = require('gulp');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback/lib');
const nodemon = require('gulp-nodemon');
const gprint = require('gulp-print').default;
const del = require('del');
const vinylPaths = require('vinyl-paths');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

function runNode(cb) {
	let started = false;
	
	return nodemon({
		script: 'run.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true; 
		} 
	});
}

gulp.task('clean', done => {
  gulp.src('dist/*')
    .pipe(gprint())
    .pipe(vinylPaths(del));
  done();
});

gulp.task('build', () => new Promise((resolve, reject) => {
  webpack(webpackConfig(), (err, stats) => {
    if (err) reject(err);
    else if (stats.hasErrors()) reject(new Error(stats.compilation.errors.join('\n')));
    else resolve();
  });
}));

gulp.task('serve', gulp.series(
  'build',
  runNode,
  done => {
    browserSync({
      online: false,
      open: false,
      port: 7000,
      logLevel: 'silent',
      server: {
        baseDir: ['dist'],
        middleware: [historyApiFallback(), function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }]
      }
    }, function (err, bs) {
      if (err) {
        console.error(err.message);
        return;
      }
      const urls = bs.options.get('urls').toJS();
      console.log(`Application Available At: ${urls.local}`);
      console.log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
));

const refresh = gulp.series(
  'build',
  done => { browserSync.reload(); done(); }
);

gulp.task('serve:watch', gulp.series(
  'serve',
  () => gulp.watch('src', refresh)
));
