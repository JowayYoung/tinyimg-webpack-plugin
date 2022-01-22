import { request } from "https";
import { URL } from "url";
import Chalk from "chalk";
import Figures from "figures";
import { validate } from "schema-utils";
import { ByteSize, RoundNum } from "trample/dist/node.js";
import Webpack from "webpack";

import { IMG_REGEXP, OPTS_SCHEMA, PLUGIN_NAME, RandomHeader } from "./util.js";

const { blueBright, greenBright, redBright, yellowBright } = Chalk;
const { cross, tick } = Figures;
const { Compilation, sources } = Webpack;

export default class TinyimgWebpackPlugin {
	constructor(opts = {}) {
		this.opts = opts;
		validate(OPTS_SCHEMA, opts, { name: PLUGIN_NAME });
	}
	apply(compiler) {
		const { logged } = this.opts;
		// DEP_WEBPACK_COMPILATION_ASSETS
		// https://juejin.cn/post/6953259412651769869
		// https://juejin.cn/post/7011025053013770270
		// https://juejin.cn/post/7013995927874568206
		compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
			const opts = {
				name: PLUGIN_NAME,
				stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
			};
			compilation.hooks.processAssets.tapPromise(opts, assets => {
				const imgs = Object.keys(assets).filter(v => IMG_REGEXP.test(v));
				if (!imgs.length) return Promise.resolve();
				const promises = imgs.map(v => this.compressImg(assets, v));
				return Promise.all(promises).then(res => logged && res.forEach((v, i) => console.log(i < res.length - 1 ? v : `${v}\n`)));
			});
		});
	}
	async compressImg(assets = null, path = "") {
		try {
			const file = assets[path].source();
			const obj = await this.uploadImg(file);
			const data = await this.downloadImg(obj.output.url);
			const oldSize = redBright(ByteSize(obj.input.size));
			const newSize = greenBright(ByteSize(obj.output.size));
			const ratio = blueBright(RoundNum(1 - obj.output.ratio, 2, true));
			const msg = `${tick} Compressed [${yellowBright(path)}] succeeded: Old Size ${oldSize}, New Size ${newSize}, Optimization Ratio ${ratio}`;
			assets[path] = new sources.RawSource(Buffer.alloc(data.length, data, "binary"));
			return Promise.resolve(msg);
		} catch (err) {
			const msg = `${cross} Compressed [${yellowBright(path)}] failed: ${redBright(err)}`;
			return Promise.resolve(msg);
		}
	}
	downloadImg(url) {
		const opts = new URL(url);
		return new Promise((resolve, reject) => {
			const req = request(opts, res => {
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
			const req = request(opts, res => res.on("data", data => {
				const obj = JSON.parse(data.toString());
				obj.error ? reject(obj.message) : resolve(obj);
			}));
			req.write(file, "binary");
			req.on("error", e => reject(e));
			req.end();
		});
	}
};