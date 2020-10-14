# Tinyimg Webpack Plugin <img src="https://img.shields.io/badge/img--master-压缩图像的Webpack扩展器-66f.svg">

[![author](https://img.shields.io/badge/author-JowayYoung-f66.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![version](https://img.shields.io/badge/version-0.0.6-f66.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![node](https://img.shields.io/badge/node-%3E%3D%2010.0.0-3c9.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![npm](https://img.shields.io/badge/npm-%3E%3D%205.6.0-3c9.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![test](https://img.shields.io/badge/test-passing-f90.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![build](https://img.shields.io/badge/build-passing-f90.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![coverage](https://img.shields.io/badge/coverage-100%25-09f.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)
[![license](https://img.shields.io/badge/license-MIT-09f.svg)](https://github.com/JowayYoung/tinyimg-webpack-plugin)

> `tinyimg-webpack-plugin`是一个压缩图像的Webpack扩展器，提供**JPG**和**PNG**的压缩功能

### 安装

`npm i tinyimg-webpack-plugin`

> 安装准备

- 提前安装`webpack`和`webpack-cli`：`npm i webpack webpack-cli`
- 必须依赖`webpack 4.0.0`以上和`webpack-cli 3.0.0`以上

> 安装失败

- 切换**NPM镜像**为淘宝镜像：`npm config set registry https://registry.npm.taobao.org/`
- 重新执行安装命令：`npm i tinyimg-webpack-plugin`

### 使用

配置|功能|格式|描述
-|-|-|-
`enabled`|是否启用插件|`true/false`|建议只在生产环境下开启
`logged`|是否打印日志|`true/false`|打印压缩图像相关信息

在`webpack.config.js`或`webpack配置`插入以下代码。

##### CommonJS

```js
const TinyimgPlugin = require("tinyimg-webpack-plugin");

module.exports = {
    plugins: [
        new TinyimgPlugin({
            enabled: process.env.NODE_ENV === "production",
            logged: true
        })
    ]
};
```

##### ESM

必须在`babel`加持下的Node环境中使用

```js
import TinyimgPlugin from "tinyimg-webpack-plugin";

export default {
    plugins: [
        new TinyimgPlugin({
            enabled: process.env.NODE_ENV === "production",
            logged: true
        })
    ]
};
```

### 版权

MIT © [Joway Young](https://github.com/JowayYoung)

### 后记

若觉得`tinyimg-webpack-plugin`对你有帮助，可在[Issue](https://github.com/JowayYoung/tinyimg-webpack-plugin/issues)上`提出你的宝贵建议`，笔者会认真阅读并整合你的建议。喜欢`tinyimg-webpack-plugin`的请给一个[Star](https://github.com/JowayYoung/tinyimg-webpack-plugin)，或[Fork](https://github.com/JowayYoung/tinyimg-webpack-plugin)本项目到自己的`Github`上，根据自身需求定制功能。

**关注公众号`IQ前端`，一个专注于CSS/JS开发技巧的前端公众号，更多前端小干货等着你喔**

![](https://static.yangzw.vip/frontend/account/IQ前端公众号.jpg)