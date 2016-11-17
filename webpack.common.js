var webpack = require("webpack");
var nsWebpack = require("nativescript-dev-webpack");
var path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");

module.exports = function(platform, destinationApp) {
    if (!destinationApp) {
        //Default destination inside platforms/<platform>/...
        destinationApp = nsWebpack.getAppPath(platform);
    }
    var entry = {};
    //Discover entry module from package.json
    entry.bundle = "./" + nsWebpack.getEntryModule();
    //Vendor entry with third party libraries.
    entry.vendor = "./vendor";

    return {
        context: path.resolve("./app"),
        entry: entry,
        output: {
            pathinfo: true,
            path: path.resolve(destinationApp),
            libraryTarget: "commonjs2",
            filename: "[name].js",
            jsonpFunction: "nativescriptJsonp"
        },
        resolve: {
            //Resolve platform-specific modules like module.android.js
            extensions: [
                ".ts",
                ".js",
                "." + platform + ".ts",
                "." + platform + ".js",
            ],
            //Resolve {N} system modules from tns-core-modules
            modules: [
                "node_modules/tns-core-modules",
                "node_modules"
            ]
        },
        node: {
            //Disable node shims that conflict with NativeScript
            "http": false,
            "timers": false,
            "setImmediate": false,
        },
        module: {
            loaders: [
                {
                    test: /\.html$/,
                    loader: "raw-loader"
                },
                {
                    test: /\.css$/,
                    loader: "raw-loader"
                },
                {
                    test: /\.ts$/,
                    loaders: [
                        "awesome-typescript-loader"
                    ]
                },
                {
                    test: /\.scss$/,
                    loaders: [
                        "raw-loader",
                        "resolve-url",
                        "sass-loader"
                    ]
                },
            ]
        },
        plugins: [
            //Vendor libs go to the vendor.js chunk
            new webpack.optimize.CommonsChunkPlugin({
                name: ["vendor"]
            }),
            //Define useful constants like TNS_WEBPACK
            new webpack.DefinePlugin({
                global: "global",
                __dirname: "__dirname",
                "global.TNS_WEBPACK": "true",
            }),
            //Copy assets to out dir. Add your own globs as needed.
            new CopyWebpackPlugin([
                {from: "app.css"},
                {from: "css/**"},
                {from: "**/*.jpg"},
                {from: "**/*.png"},
                {from: "**/*.css"},
                {from: "**/*.html"},
                {from: "**/*.xml"},
            ], {ignore: ["App_Resources/**"]}),
            //Generate a bundle starter script and activate it in package.json
            new nsWebpack.GenerateBundleStarterPlugin([
                "./vendor",
                "./bundle",
            ]),
            //Required for bundle chunks loading
            new nsWebpack.NativeScriptJsonpPlugin(),
        ]
    };
};
