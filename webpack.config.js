const path = require('path');
const nodemon = require('nodemon-webpack-plugin');
const shell = require('webpack-shell-plugin');
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts|\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ],

    },
    devtool: 'inline-source-map',
    entry: {
        layout: './src/public/scripts/layout.ts',
        villagers: './src/public/scripts/villagers.tsx',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'src', 'public', 'scripts')
    },
    plugins: [

    ]
}
