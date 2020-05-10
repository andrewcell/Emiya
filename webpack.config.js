const path = require('path');
const nodemon = require('nodemon-webpack-plugin');
const shell = require('webpack-shell-plugin');
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    devtool: 'inline-source-map',
    entry: {
        layout: './src/public/scripts/layout.ts',
        login: './src/public/scripts/login.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'src', 'public', 'scripts')
    },
    plugins: [

    ]
}
