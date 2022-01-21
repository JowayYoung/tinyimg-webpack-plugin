# Tinyimg Webpack Plugin <img src="https://img.shields.io/badge/img--master-压缩图像的Webpack扩展器-66f.svg">

[![author](https://img.shields.io/badge/author-JowayYoung-f66.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![version](https://img.shields.io/badge/version-1.0.0-f66.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![node](https://img.shields.io/badge/node-%3E%3D16.0.0-3c9.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![npm](https://img.shields.io/badge/npm-%3E%3D7.10.0-3c9.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![test](https://img.shields.io/badge/test-passing-f90.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![build](https://img.shields.io/badge/build-passing-f90.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![coverage](https://img.shields.io/badge/coverage-100%25-09f.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![license](https://img.shields.io/badge/license-MIT-09f.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)

> `tinyimg-webpack-plugin`是一个压缩图像的Webpack扩展器，提供**JPG**和**PNG**的压缩功能

### 安装

`npm i tinyimg-webpack-plugin`

> 安装准备

- 提前安装`webpack`和`webpack-cli`：`npm i webpack webpack-cli`
- 必须依赖`webpack 5.0.0`以上和`webpack-cli 4.0.0`以上

> 安装失败

- 切换**NPM镜像**为淘宝镜像：`npm config set registry https://registry.npm.taobao.org/`
- 重新执行安装命令：`npm i tinyimg-webpack-plugin`

### 使用

配置|功能|取值|默认|描述
:-:|:-:|:-:|:-:|-
`enabled`|启用插件|`Boolean`|`false`|建议只在生产环境下启用
`logged`|打印日志|`Boolean`|`false`|打印压缩图像相关信息

```js
import TinyimgPlugin from "tinyimg-webpack-plugin";

export default {
	// 其他Webpack配置
	plugins: [
		new TinyimgPlugin({
			enabled: process.env.NODE_ENV === "production",
			logged: true
		})
	]
};
```

### 版权

MIT © [JowayYoung](https://github.com/JowayYoung)

### 后记

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

![IQ前端](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/131dd0053e87483d89518a15a5fe211f~tplv-k3u1fbpfcp-zoom-1.image)