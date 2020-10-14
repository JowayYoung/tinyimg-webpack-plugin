const Path = require("path");
const BarPlugin = require("webpackbar");
const CleanPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Fibers = require("fibers");
const Sass = require("sass");

const TinyimgPlugin = require("../src");

const PATH = {
	entryHtml: Path.join(__dirname, "src/index.html"),
	entryIco: Path.join(__dirname, "src/IMG/favicon.ico"),
	entryJs: Path.join(__dirname, "src/index.js"),
	output: Path.join(__dirname, "dist")
};

const LOADER_OPTS = {
	babel: {
		babelrc: false,
		cacheDirectory: true,
		presets: [
			"@babel/preset-env"
		]
	},
	css: { importLoaders: 2 },
	imgurl: {
		esModule: false,
		limit: 10240,
		name: "[name].[ext]",
		outputPath: "img"
	},
	minicss: { publicPath: "../" },
	sass: {
		implementation: Sass,
		sassOptions: { fiber: Fibers }
	}
};

module.exports = {
	devtool: false,
	entry: PATH.entryJs,
	mode: "production",
	module: {
		rules: [{
			exclude: /node_modules/,
			test: /\.css$/,
			use: [
				{ loader: MiniCssExtractPlugin.loader, options: LOADER_OPTS.minicss },
				{ loader: "css-loader", options: LOADER_OPTS.css }
			]
		}, {
			exclude: /node_modules/,
			test: /\.(sass|scss)$/,
			use: [
				{ loader: MiniCssExtractPlugin.loader, options: LOADER_OPTS.minicss },
				{ loader: "css-loader", options: LOADER_OPTS.css },
				{ loader: "sass-loader", options: LOADER_OPTS.sass }
			]
		}, {
			exclude: /node_modules/,
			test: /\.js$/,
			use: [{ loader: "babel-loader", options: LOADER_OPTS.babel }]
		}, {
			exclude: /node_modules/,
			test: /\.(jpe?g|png)$/,
			use: [{ loader: "url-loader", options: LOADER_OPTS.imgurl }]
		}]
	},
	output: {
		filename: "js/[name].bundle.js",
		path: PATH.output,
		publicPath: ""
	},
	plugins: [
		new BarPlugin({ name: "Webpack Build" }),
		new CleanPlugin({
			cleanOnceBeforeBuildPatterns: [PATH.output],
			dry: true
		}),
		new HtmlPlugin({
			favicon: PATH.entryIco,
			filename: "index.html",
			minify: { collapseWhitespace: true, removeComments: true },
			template: PATH.entryHtml
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].bundle.css"
		}),
		new TinyimgPlugin({
			enabled: true,
			logged: true
		})
	],
	stats: "errors-only"
};