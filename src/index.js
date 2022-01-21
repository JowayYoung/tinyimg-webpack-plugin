import { request } from "https";
import { URL } from "url";
import Chalk from "chalk";
import Figures from "figures";
import Ora from "ora";
import { validate } from "schema-utils";
import { ByteSize, RoundNum } from "trample/dist/node.js";
import Webpack from "webpack";
import WebpackSources from "webpack-sources";

import { IMG_REGEXP, OPTS_SCHEMA, PLUGIN_NAME } from "./getting.js";
import { RandomHeader } from "./setting.js";

const { blueBright, greenBright, redBright, yellowBright } = Chalk;
const { cross, tick } = Figures;
const { Compilation } = Webpack;
const { RawSource } = WebpackSources;

export default class TinyimgWebpackPlugin {
	constructor(opts = {}) {
		this.opts = opts;
		validate(OPTS_SCHEMA, opts, { name: PLUGIN_NAME });
	}
	apply(compiler) {
		const { enabled, logged } = this.opts;
		compiler.hooks.emit.tapPromise(PLUGIN_NAME, compilation => {
			// [DEP_WEBPACK_COMPILATION_ASSETS]
			// https://juejin.cn/post/6953259412651769869
			compilation.hooks.processAssets.tap({
				name: PLUGIN_NAME,
				stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
			}, assets => {
				const imgs = Object.entries(assets).filter(v => IMG_REGEXP.test(v[0]));
				console.log(imgs);
				// if (!imgs.length) return Promise.resolve();
				// const spinner = Ora("🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛").start();
				// const promises = imgs.map(v => this.compressImg(assets, v));
				// return Promise.all(promises).then(res => {
				// 	spinner.stop();
				// 	logged && res.forEach(v => console.log(v));
				// });
			});
			return Promise.resolve();
		});
	}
	async compressImg(assets, path) {
		try {
			const file = assets[path].source();
			const obj = await this.uploadImg(file);
			const data = await this.downloadImg(obj.output.url);
			assets[path] = new RawSource(Buffer.alloc(data.length, data, "binary"));
			const oldSize = redBright(ByteSize(obj.input.size));
			const newSize = greenBright(ByteSize(obj.output.size));
			const ratio = blueBright(RoundNum(1 - obj.output.ratio, 2, true));
			const msg = `${tick} Compressed [${yellowBright(path)}] succeeded: Old Size ${oldSize}, New Size ${newSize}, Optimization Ratio ${ratio}`;
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