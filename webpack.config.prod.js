const path = require('path');
const nodemon = require('nodemon-webpack-plugin');
const config = require('./webpack.config');
const terserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    module: config.module,
    entry: config.entry,
    resolve: config.resolve,
    optimization: {
        minimize: true,
        minimizer: [new terserPlugin()]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'public', 'scripts')
    }
}
