/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 11:41:18
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-08-31 20:47:31
 * @FilePath: /dataSource-secondary/src/common/RSA/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import JSEncrypt from 'jsencrypt';
const PUBLIC_KEY =
	'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ ==';
// 加密
export const Encrypt = text => {
	if (!text) {
		return;
	}
	// console.log(text)
	// 使用公钥加密
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');

	var encrypted = encrypt.encrypt(text);
	// console.log(encrypted);

	return encrypted.toString();
};
