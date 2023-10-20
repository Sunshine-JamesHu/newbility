const { series, src, dest } = require('gulp');
const del = require('del');
const child_process = require('child_process');
const destDir = 'build';

function clean(cb) {
  del([destDir]);
  cb();
}

function build(cb) {
  child_process.exec('tsc', (error) => {
    cb(error);
  });
}

function copyFile(cb) {
  src('app.config.json').pipe(dest(destDir));
  src('package.json').pipe(dest(destDir));
  cb();
}

exports.default = series(clean, build, copyFile);
