const webpack = require("webpack");
const { join, resolve } = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [resolve("app", "src", "index.js")],
     plugins: [
      new HtmlWebpackPlugin({
        template: join("app", "index.html"),
        inject: "body",
        filename: "index.html"
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new CleanWebpackPlugin(["dist"])
    ],
    output: {
        path: join(__dirname, "dist"),
        filename: "[hash].bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: join(__dirname, "app", "src"),
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            presets: [["es2015", { modules: false }], "stage-0"]
                        }
                    }
                ]
            }
        ]
    }
};