const path = require('path');
const nodemon = require('nodemon-webpack-plugin');
const config = require('./webpack.config');
module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    entry: config.entry,
    resolve: {
        extensions: ['.ts']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist', 'public', 'scripts')
    }
}
