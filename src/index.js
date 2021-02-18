const Fs = require("fs");
const Https = require("https");
const Url = require("url");
const Chalk = require("chalk");
const Figures = require("figures");
const Ora = require("ora");
const SchemaUtils = require("schema-utils");
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
		SchemaUtils(Schema, this.opts, { name: PLUGIN_NAME });
		enabled && compiler.hooks.emit.tapPromise(PLUGIN_NAME, compilation => {
			const imgs = Object.keys(compilation.assets).filter(v => IMG_REGEXP.test(v));
			if (!imgs.length) return Promise.resolve();
			const promises = imgs.map(v => this.compressImg(compilation.assets, v));
			const spinner = Ora("Images is compressing......").start();
			return new Promise(resolve => {
        Promise.all(promises).then(res => {
					spinner.stopAndPersist({text: 'Images compression done', symbol: '✅'});
					// 输出错误，如果有的话
					res.filter(info => logged || info.status === 'fail').forEach(v => console.log(v.msg));
          resolve()
        })
      })
		});
	}
	async compressImg(assets, path) {
		try {
			const file = assets[path].source();
			const obj = await this.uploadImg(file);

			if (obj.isError) {
				return Promise.resolve({msg: `${Figures.cross} [${Chalk.yellowBright(path)}] compression failed. ${obj.msg}`, status: 'fail'});
			}		

			const data = await this.downloadImg(obj.output.url);
			// 写回到原来资源中
			assets[path] = new RawSource(Buffer.alloc(data.length, data, 'binary'))
			const oldSize = Chalk.redBright(ByteSize(obj.input.size));
			const newSize = Chalk.greenBright(ByteSize(obj.output.size));
			const ratio = Chalk.blueBright(RoundNum(1 - obj.output.ratio, 2, true));
			const msg = `${Figures.tick} Compressed [${Chalk.yellowBright(path)}] completed: Old Size ${oldSize}, New Size ${newSize}, Optimization Ratio ${ratio}`;
			return Promise.resolve({msg, status: 'success'});
		} catch (err) {
			const msg = `${Figures.cross} Compressed [${Chalk.yellowBright(path)}] failed: ${Chalk.redBright(err)}`;
			return Promise.resolve({msg, status: 'fail'});
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
				try {
					const obj = JSON.parse(data.toString());
					obj.error ? reject({isError: true, msg: obj.message}) : resolve(obj);
				} catch (error) {
					reject({isError: true, msg: error.message || '图片解析失败'})
				}
			}));
			req.write(file, "binary");
			req.on("error", e => reject(e));
			req.end();
		});
	}
};