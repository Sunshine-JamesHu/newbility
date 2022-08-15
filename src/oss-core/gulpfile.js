const { series, src, dest, parallel } = require('gulp');
const del = require('del');
const child_process = require('child_process');

function clean(cb) {
  del(['build']);
  cb();
}

function build(cb) {
  child_process.exec('tsc', (error) => {
    if (!error) cb();
  });
}

function cpSwaggerStaticFile(cb) {
  const files = ['src/swagger/koa2-swagger-ui/index.hbs', 'src/swagger/koa2-swagger-ui/favicon.png', 'src/swagger/koa2-swagger-ui/swagger-ui/**/*'];
  return src(files, { base: '.' }).pipe(dest('build'));
}

function cpIndex(cb) {
  const files = ['public/index.html'];
  return src(files, { base: '.' }).pipe(dest('build'));
}

exports.default = series(clean, build, parallel(cpSwaggerStaticFile, cpIndex));
