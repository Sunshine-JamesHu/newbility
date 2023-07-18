const { series, src, dest } = require('gulp');
const del = require('del');
const child_process = require('child_process');

function clean(cb) {
  del(['build']);
  cb();
}

function build(cb) {
  child_process.exec('tsc', (error) => {
    cb(error);
  });
}

function cpSwaggerStaticFile(cb) {
  const files = ['src/koa2-swagger-ui/index.hbs', 'src/koa2-swagger-ui/favicon.png', 'src/koa2-swagger-ui/swagger-ui/**/*'];
  return src(files, { base: '.' }).pipe(dest('build'));
}

exports.default = series(clean, build, cpSwaggerStaticFile);
