const fs = require('fs-extra');
const childProcess = require('child_process');

try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/public', './dist/public');
    fs.copySync('./src/views', './dist/views');
    fs.copySync('./src/data', './dist/data');
    // Transpile the typescript files
    childProcess.exec('tsc --build tsconfig.prod.json');
    childProcess.exec('javascript-obfuscator ./dist/public/scripts --output ./ --compact true --self-defending true')
} catch (err) {
    console.log(err);
}
