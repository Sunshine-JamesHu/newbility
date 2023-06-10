const { series } = require('gulp');
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

exports.default = series(clean, build);
