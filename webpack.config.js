/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const path = require('path');


module.exports = {
    target: 'node',
    entry: slsw.lib.entries,
    externals: [nodeExternals()],
    mode: 'production',
    optimization: {
        concatenateModules: false,
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'ts-loader',
                options: { transpileOnly: true },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts'],
    },
};