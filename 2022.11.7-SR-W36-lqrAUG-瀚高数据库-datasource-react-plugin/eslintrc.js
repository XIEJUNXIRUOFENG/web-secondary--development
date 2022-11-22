/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 19:56:09
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-09-02 16:28:33
 * @FilePath: /dataSource-secondary/.eslintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
	root: true, // 默认是底层文件，不再向上（父文件）搜索
	env: {
		// 运行环境
		browser: true,
		commonjs: true,
		es6: true,
	},
	extends: ['plugin:react/recommended', 'eslint:recommended'],
	plugins: ['react'], // 插件【属性值可以省略包名的前缀eslint-plugin-】 eslint-plugin-vue帮助检测.vue里面的template和script代码
	parser: '@typescript-eslint/parser',
	parserOptions: {
		parser: 'babel-eslint', // 解析器
		sourceType: 'module', // 解析器配置文件，指定js代码来源，比如script标签引入
		ecmaVersion: 2020,
	},
	globals: {},
	rules: {},
};
