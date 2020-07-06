const Axios = require("axios");
const Chalk = require("chalk");
const Figures = require("figures");
const WebpackSources = require("webpack-sources");

const { IMG_REGEXP } = require("../util/getting");
const { RandomReqForDownload, RandomReqForUpload } = require("../util/setting");

module.exports = class TinyimgWebpackPlugin {
	constructor(opts) {
		this.opts = opts;
	}
	apply(compiler) {
		compiler.hooks.emit.tap("TinyimgWebpackPlugin", compilation => {
			const imgs = Object.keys(compilation.assets).filter(v => IMG_REGEXP.test(v));
			if (!imgs.length) return;
			// if (process.env.NODE_ENV !== "production") {
			// 	const msg = `${Figures.warning} 为了保证开发环境性能，${Chalk.blueBright("tinyimg-webpack-plugin")}压缩图像只在生产环境下开启`;
			// 	return console.warn(Chalk.yellowBright(msg));
			// }
			// console.log("生产环境", process.env.NODE_ENV);
			console.log(imgs);
			const promises = imgs.map(v => this.compressImg(v, compilation.assets));
			const successedMsg = `${Figures.tick} 压缩图像成功`;
			const errorMsg = `${Figures.cross} 压缩图像失败`;
			Promise.all(promises)
				.then(res => console.log(Chalk.green(successedMsg)))
				.catch(err => console.error(Chalk.redBright(errorMsg)));
		});
	}
	async compressImg(path, assets) {
		try {
			const file = assets[path].source();
			const url = await this.uploadImg(file);
			const img = await this.downloadImg(url);
			assets[path] = new WebpackSources.RawSource(img);
			const msg = `${Figures.tick} 压缩${Chalk.blueBright(path)}成功}`;
			console.log(msg);
			return Promise.resolve();
		} catch (err) {
			const msg = `${Figures.cross} 压缩${Chalk.blueBright(path)}失败：${Chalk.redBright(err)}`;
			console.error(msg);
			return Promise.resolve();
		}
	}
	downloadImg(url) {
		const opts = RandomReqForDownload(url);
		return Promise((resolve, reject) => Axios(opts).then(
			res => resolve(res.data),
			err => reject(err)
		));
	}
	uploadImg(data) {
		const opts = RandomReqForUpload(data);
		return new Promise((resolve, reject) => Axios(opts).then(
			res => resolve(res.data.output.url),
			err => reject(err)
		));
	}
};