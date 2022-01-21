const IMG_REGEXP = /\.(jpe?g|png)$/;

const OPTS_SCHEMA = {
	additionalProperties: false,
	properties: {
		enabled: {
			description: "Launch Plugin",
			type: "boolean"
		},
		logged: {
			description: "Print Log",
			type: "boolean"
		}
	},
	type: "object"
};

const PLUGIN_NAME = "tinyimg-webpack-plugin";

const TINYIMG_URL = [
	"tinyjpg.com",
	"tinypng.com"
];

export {
	IMG_REGEXP,
	OPTS_SCHEMA,
	PLUGIN_NAME,
	TINYIMG_URL
};