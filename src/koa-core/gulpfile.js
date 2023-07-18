const { series, src, dest, parallel } = require('gulp');
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

function cpIndex(cb) {
  const files = ['public/index.html'];
  return src(files, { base: '.' }).pipe(dest('build'));
}

exports.default = series(clean, build, cpIndex);
