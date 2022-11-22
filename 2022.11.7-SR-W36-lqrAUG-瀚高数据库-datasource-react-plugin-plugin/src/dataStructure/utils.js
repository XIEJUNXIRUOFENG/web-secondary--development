/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-09-02 10:52:10
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-09-02 10:52:13
 * @FilePath: /dataSource-secondary/src/dataStructure/utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const objDeepCopy = function (source) {
	let sourceCopy = source instanceof Array ? [] : {};
	for (let item in source) {
		sourceCopy[item] =
			typeof source[item] === 'object' && source[item] !== null
				? objDeepCopy(source[item])
				: source[item];
	}
	return sourceCopy;
};
