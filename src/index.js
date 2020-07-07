const Https = require("https");
const Url = require("url");
const Chalk = require("chalk");
const Figures = require("figures");
const SchemaUtils = require("schema-utils");
const { ByteSize, RoundNum } = require("trample/node");
const WebpackSources = require("webpack-sources");

const { IMG_REGEXP } = require("../util/getting");
const { RandomHeader } = require("../util/setting");
const Schema = require("./schema");

module.exports = class TinyimgWebpackPlugin {
	constructor(opts) {
		this.opts = opts;
	}
	apply(compiler) {
		const { disabled, logged } = this.opts;
		SchemaUtils(Schema, this.opts, { name: "TinyimgWebpackPlugin" });
		!disabled && compiler.hooks.emit.tap("TinyimgWebpackPlugin", compilation => {
			const imgs = Object.keys(compilation.assets).filter(v => IMG_REGEXP.test(v));
			if (!imgs.length) return;
			const promises = imgs.map(v => this.compressImg(compilation.assets, v, logged));
			Promise.all(promises);
		});
	}
	async compressImg(assets, path, logged = false) {
		try {
			const file = assets[path].source();
			const obj = await this.uploadImg(file);
			const data = await this.downloadImg(obj.output.url);
			const oldSize = Chalk.redBright(ByteSize(obj.input.size));
			const newSize = Chalk.greenBright(ByteSize(obj.output.size));
			const ratio = Chalk.blueBright(RoundNum(1 - obj.output.ratio, 2, true));
			const msg = `${Figures.tick} 压缩[${Chalk.yellowBright(path)}]完成：原始大小${oldSize}，压缩大小${newSize}，优化比例${ratio}`;
			assets[path] = new WebpackSources.RawSource(data);
			logged && console.log(msg);
			return Promise.resolve();
		} catch (err) {
			const msg = `${Figures.cross} 压缩[${Chalk.yellowBright(path)}]失败：${Chalk.redBright(err)}`;
			logged && console.error(msg);
			return Promise.resolve();
		}
	}
	downloadImg(url) {
		const opts = new Url.URL(url);
		return new Promise((resolve, reject) => {
			const req = Https.request(opts, res => {
				let file = "";
				res.setEncoding("binary");
				res.on("data", chunk => file += chunk);
				res.on("end", () => resolve(file));
			});
			req.on("error", e => reject(e));
			req.end();
		});
	}
	uploadImg(file) {
		const opts = RandomHeader();
		return new Promise((resolve, reject) => {
			const req = Https.request(opts, res => res.on("data", data => {
				const obj = JSON.parse(data.toString());
				obj.error ? reject(obj.message) : resolve(obj);
			}));
			req.write(file, "binary");
			req.on("error", e => reject(e));
			req.end();
		});
	}
};