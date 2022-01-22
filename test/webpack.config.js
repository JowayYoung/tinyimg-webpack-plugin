import { dirname, join } from "path";
import { fileURLToPath } from "url";
import BarPlugin from "webpackbar";
import { CleanWebpackPlugin as CleanPlugin } from "clean-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import TinyimgPlugin from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PATH = {
	entryHtml: join(__dirname, "./src/index.html"),
	entryIco: join(__dirname, "./src/img/favicon.ico"),
	entryJs: join(__dirname, "./src/index.js"),
	output: join(__dirname, "./dist")
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
	minicss: { publicPath: "../" },
	scss: { sassOptions: { fiber: false } }
};

export default {
	devtool: false,
	entry: PATH.entryJs,
	mode: "production",
	module: {
		rules: [{
			exclude: /node_modules/,
			include: /src/,
			test: /\.css$/,
			use: [
				{ loader: MiniCssExtractPlugin.loader, options: LOADER_OPTS.minicss },
				{ loader: "css-loader", options: LOADER_OPTS.css }
			]
		}, {
			exclude: /node_modules/,
			include: /src/,
			test: /\.scss$/,
			use: [
				{ loader: MiniCssExtractPlugin.loader, options: LOADER_OPTS.minicss },
				{ loader: "css-loader", options: LOADER_OPTS.css },
				{ loader: "sass-loader", options: LOADER_OPTS.scss }
			]
		}, {
			exclude: /node_modules/,
			include: /src/,
			test: /\.js$/,
			use: [{ loader: "babel-loader", options: LOADER_OPTS.babel }]
		}, {
			exclude: /node_modules/,
			generator: { filename: "img/[name][ext]" },
			include: /src/,
			test: /\.(jpe?g|png)$/,
			type: "asset/resource"
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
			cleanOnceBeforeBuildPatterns: PATH.output,
			protectionWebpackAssets: false
		}),
		new HtmlPlugin({
			favicon: PATH.entryIco,
			filename: "index.html",
			inject: "body",
			template: PATH.entryHtml
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].bundle.css"
		}),
		new TinyimgPlugin({ logged: true })
	]
};