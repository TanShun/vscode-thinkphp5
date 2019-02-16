const watch = require('glob-watcher');
const path = require('path');
const fse = require('fs-extra');

const src = path.resolve(__dirname, '..', 'src', 'php');
const dist = path.resolve(__dirname, '..', 'out', 'php');

fse.remove(dist).then(() => {
    fse.copy(src, dist).then(() => {
        var watcher = watch(src);
        watcher.on('change', function (file) {
            fileInfo = path.parse(file);
            distFile = path.resolve(dist, path.relative(fileInfo.dir, src), fileInfo.base);
            fse.copy(file, distFile).catch((reason) => {
                console.error(reason);
            });
            console.warn(`Copy "${file}" to "${distFile}"`);
        });
    });
})





