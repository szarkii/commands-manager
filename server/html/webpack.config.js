const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
let fs = require('fs');
const sourceFilesDir = __dirname + '/src';

const groupsView = fs.readFileSync(sourceFilesDir + '/groups/groups.view.html');
const commandView = fs.readFileSync(sourceFilesDir + '/commands/views/command.view.html');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        main: sourceFilesDir + "/app.ts",
    },
    output: {
        path: path.resolve(__dirname),
        filename: "main-bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: sourceFilesDir + "/app.html",
            inject: true,
            chunks: [],
            filename: 'index.html',
            groupsView,
            commandView
        })
    ]
};
