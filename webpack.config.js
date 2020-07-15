const path = require('path');
const nodemon = require('nodemon-webpack-plugin');
const shell = require('webpack-shell-plugin');
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const { VuetifyLoaderPlugin } = require('vuetify-loader');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            {
                test: /\.ts|\.tsx?$/,
                loader: 'ts-loader',
                exclude: '/node_modules/',
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true // optional
                            },
                          },
                    },
                ],
            },
        ],

    },
    devtool: 'inline-source-map',
    entry: {
        layout: './src/public/scripts/layout.ts',
        villagers: './src/public/scripts/villagers.tsx',
        points: './src/public/scripts/points.tsx',
        accounthelp: './src/public/scripts/accounthelp.ts',
        resetpw: './src/public/scripts/resetpw.ts',
        campsite: './src/public/scripts/campsite.ts',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'src', 'public', 'scripts')
    },
    plugins: [
        new vueLoaderPlugin(),
        new VuetifyLoaderPlugin()
    ]
}
