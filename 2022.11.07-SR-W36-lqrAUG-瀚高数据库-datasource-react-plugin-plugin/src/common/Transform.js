/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 11:41:18
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-08-31 20:27:31
 * @FilePath: /dataSource-secondary/src/common/Transform.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const S4 = () => {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

export const guid = () => {
	return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
