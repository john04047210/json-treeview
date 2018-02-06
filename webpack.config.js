const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ['./src/treeview.jsx','./src/treeview.css'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jsontreeview.js',
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        },{
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }]
    },
    plugins: [
      new ExtractTextPlugin("jsontreeview.css"),
    ],
    devServer: {
        contentBase: path.resolve(__dirname),
        port: 8002,
        inline: true,
        historyApiFallback: true
    }
};
