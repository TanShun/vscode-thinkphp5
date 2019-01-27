const watch = require('glob-watcher');
const path = require('path');
const fse = require('fs-extra');

const src = path.resolve(__dirname, '..', 'src', 'php');
const dist = path.resolve(__dirname, '..', 'out', 'php');

fse.copy(src, dist);

var watcher = watch(src);

watcher.on('change', function (file) {
    fileInfo = path.parse(file);
    distFile = path.resolve(dist, path.relative(fileInfo.dir, src), fileInfo.base);
    fse.copy(file, distFile);
    console.warn(`Copy "${file}" to "${distFile}"`);
});
