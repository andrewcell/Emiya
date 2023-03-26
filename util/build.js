const fsx = require('fs-extra');
const fs = require('fs');
const childProcess = require('child_process');
const dotenv = require('dotenv');
const encFile = 'src/public/scripts/encryption/AES.ts';
try {

    // Remove current build
    fsx.removeSync('./dist/');
    // Copy front-end files
    fsx.copySync('./src/public/stylesheets', './dist/public/stylesheets');
    fsx.copySync('./src/public/images', './dist/public/images');
    fsx.copySync('./src/public/manifests', './dist/public/manifests');
    fsx.copySync('./src/public/apple-touch-icon.png', './dist/public/apple-touch-icon.png');
    fsx.copySync('./src/views', './dist/views');
    fsx.copySync('./src/data', './dist/data');
    // Set Encryption key to front-end
    const conf = dotenv.config({
        path: './env/production.env',
    });
    let file = fs.readFileSync(encFile, 'utf8');
    const fileOriginal = file + '';
    file = file.replace(/Put_your_own_key_here/g, process.env.AESKEY);
    file = file.replace(/EmiyaJ_AES_Key_goes_here/g, process.env.EMIYAJAESKEY);
    file = file.replace(/EmiyaJ_AES_Iv_goes_here/g, process.env.EMIYAJAESIV);
    fs.writeFileSync(encFile, file, 'utf8');
    // Transpile the typescript files
    childProcess.execSync('tsc --build tsconfig.prod.json');
    console.log('TypeScript build complete.')
    childProcess.execSync('webpack --config ./webpack.config.prod.js');
    console.log('Webpack build complete.')
    childProcess.execSync('javascript-obfuscator ./dist/public/scripts --output ./ --compact true --string-array true --self-defending false --control-flow-flattening false --debug-protection false  --disable-console-output true --split-strings true --target browser-no-eval')
    console.log('Obfuscate javascript files complete.')
    fs.writeFileSync('buildtime.txt', Date.now().toString());
    fs.writeFileSync(encFile, fileOriginal, 'utf8');
} catch (err) {
    console.log(err);
}
