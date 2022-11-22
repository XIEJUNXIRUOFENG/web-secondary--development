/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 20:12:19
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-09-02 11:16:34
 * @FilePath: /dataSource-secondary/.prettierrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    printWidth: 100,
    tabWidth: 4, // 超过最大值换行
    semi: true, // 结尾用分号
    singleQuote: true, // 使用单引号
    disableLanguages: ['html', 'css'], // 不格式化vue文件，vue文件的格式化单独设置
    htmlWhitespaceSensitivity: 'ignore',
    useTabs: true, // 缩进使用tab，不使用空格
    proseWrap: 'preserve', // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
    arrowParens: 'avoid', //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
    bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    eslintIntegration: false, //不让prettier使用eslint的代码格式进行校验
    jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
    requireConfig: false, // Require a 'prettierconfig' to format prettier
    stylelintIntegration: false, //不让prettier使用stylelint的代码格式进行校验
    trailingComma: 'es5', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    tslintIntegration: false, // 不让pret
};
