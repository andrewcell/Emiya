const path = require('path');
const nodemon = require('nodemon-webpack-plugin');
const config = require('./webpack.config');
module.exports = {
    mode: 'production',
    module: config.module,
    entry: config.entry,
    resolve: config.resolve,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'public', 'scripts')
    }
}
