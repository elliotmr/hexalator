var webpack = require('webpack');
var path = require('path');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

// TODO: Add source maps
var options = {
    devtool: 'cheap-module-source-map',
    entry: path.resolve(__dirname, 'app/index.jsx'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'app'),
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    }
}

options.target = webpackTargetElectronRenderer(options);
module.exports = options;