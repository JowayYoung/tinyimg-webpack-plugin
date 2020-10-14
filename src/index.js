const Https = require("https");
const Url = require("url");
const Chalk = require("chalk");
const Figures = require("figures");
const Ora = require("ora");
const { validate } = require("schema-utils");
const { ByteSize, RoundNum } = require("trample/node");
const { RawSource } = require("webpack-sources");

const { IMG_REGEXP, PLUGIN_NAME } = require("../util/getting");
const { RandomHeader } = require("../util/setting");
const Schema = require("./schema");

module.exports = class TinyimgWebpackPlugin {
	constructor(opts) {
		this.opts = opts;
	}
	apply(compiler) {
		const { enabled, logged } = this.opts;
		validate(Schema, this.opts, { name: PLUGIN_NAME });
		enabled && compiler.hooks.emit.tapPromise(PLUGIN_NAME, compilation => {
			const imgs = Object.keys(compilation.assets).filter(v => IMG_REGEXP.test(v));
			if (!imgs.length) return Promise.resolve();
			const promises = imgs.map(v => this.compressImg(compilation.assets, v));
			const spinner = Ora("Image is compressing......").start();
			return Promise.all(promises).then(res => {
				spinner.stop();
				logged && res.forEach(v => console.log(v));
			});
		});
	}
	async compressImg(assets, path) {
		try {
			const file = assets[path].source();
			const obj = await this.uploadImg(file);
			const data = await this.downloadImg(obj.output.url);
			assets[path] = new RawSource(Buffer.alloc(data.length, data, "binary"));
			const oldSize = Chalk.redBright(ByteSize(obj.input.size));
			const newSize = Chalk.greenBright(ByteSize(obj.output.size));
			const ratio = Chalk.blueBright(RoundNum(1 - obj.output.ratio, 2, true));
			const msg = `${Figures.tick} Compressed [${Chalk.yellowBright(path)}] completed: Old Size ${oldSize}, New Size ${newSize}, Optimization Ratio ${ratio}`;
			return Promise.resolve(msg);
		} catch (err) {
			const msg = `${Figures.cross} Compressed [${Chalk.yellowBright(path)}] failed: ${Chalk.redBright(err)}`;
			return Promise.resolve(msg);
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