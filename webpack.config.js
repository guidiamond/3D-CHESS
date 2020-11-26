const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    // entry files
    entry: './src/index.ts',
    // output bundles (location)
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        filename: 'main.js',
        port: 9000,
    },

    // generate source maps
    devtool: 'source-map',

    // bundling mode
    mode: 'development',

    // file resolutions
    resolve: {
        extensions: ['.ts', '.js', '.html', '.obj'],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.obj$/,
                loader: 'file-loader',
            },
            {
                test: /\.tsx?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    // plugins
    plugins: [
        new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
        new HtmlWebPackPlugin({
            template: './src/index.html',
        }),
    ],

    // set watch mode to `true`
    // watch: true,
};
