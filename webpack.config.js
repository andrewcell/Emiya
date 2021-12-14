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
                exclude: /(node_modules)/,
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
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                indentedSyntax: true // optional
                            },
                          },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.pug$/,
                use: ['pug-plain-loader']
            }
        ],

    },
    devtool: 'eval',
    // devtool: 'inline-source-map',
    entry: {
        layout: './src/public/scripts/layout.tsx',
        villagers: './src/public/scripts/villagers.tsx',
        points: './src/public/scripts/points.tsx',
        campsite: './src/public/scripts/campsite.ts',
        about: './src/public/scripts/about.ts',
        translation: './src/public/scripts/translation.ts',
        cp: './src/public/scripts/cp.ts'
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
