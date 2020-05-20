const fs = require('fs-extra');
const childProcess = require('child_process');

try {

    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/public/stylesheets', './dist/public/stylesheets');
    fs.copySync('./src/public/images', './dist/public/images');
    fs.copySync('./src/public/scripts/emibo.js', './dist/public/scripts/emibo.js');
    fs.copySync('./src/views', './dist/views');
    fs.copySync('./src/data', './dist/data');

    // Transpile the typescript files
    childProcess.execSync('tsc --build tsconfig.prod.json');
    console.log('TypeScript build complete.')
    childProcess.execSync('webpack --config ./webpack.config.prod.js');
    console.log('Webpack build complete.')
    childProcess.execSync('javascript-obfuscator ./dist/public/scripts --output ./ --compact true --self-defending true --control-flow-flattening true')
    console.log('Obfuscate javascript files complete.')
    require('fs').writeFileSync('buildtime.txt', Date.now().toString());

} catch (err) {
    console.log(err);
}
