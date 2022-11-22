import JSEncrypt from 'jsencrypt';

const PRIV_KEY = `MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMvoxORSVG7y6JhOKz+kWS6GXpoG0nlnDKChw+8j6w4YapkEKjzlrfWaDlmFIda/Ma4d9V8wAQ419oZEZOk24XL3LyGRqn6OD0hpHkDFhsGlN8SwY3wG1Xda/TIX6DWEAYkc8gsYKgZvFyD74AznPkKsd9Emh1BwYjStR5H1UxHZAgMBAAECgYBCI2DhkdazGfTZmdkrTlpi3dCHcxkHqaYN4ApWYbcXHlJNCW3NzM2s8Oggny8HoYIysKLq2f4tptEsYbi9cECVXj0jegAC0QaBOr9WnkcTR5cxVrdEBYx9ejst8Jy89k1GUtwr+1KuznyGmGgOGbw6SCuxKiaODjVu2lf4daBqxQJBAO7e+iKBkZOW3a6qf2F4cyGdbMFVOudoHc2zhDZRoIMiFLIRZF0CkVj27SwuWZZhiM3r/L5nsQxBcfijioW6XqsCQQDah/0+34yiGzlx6Of+Wwz0nA3xMSuj3vO08yjbEJJXZk5GgF5h29AqkipJOaYYVwwqwVVIIN9kFgFeV5HgSQGLAkEAg3Jwc0yZr331v4hTUG/X60eV8U3VfEHvJKMEvl9s1LyMZvDrKcOf+DTpjsZyxi4l+itCigTFiNj6vrhAIhbMwQJBANM3IxdU3EmGRLSLZ0eZ22DFQFiBrOtbP3QCndd2IeulrzxHMHInEgFDeumBdb8Ky3C7omDvnNrQxgvYWd9M0NcCQCpgZegSxa2nb4fDW00ftLkosnTnjU5QYacE46YHDZVV0HN0oe3AmQNSz9Z0arGLXG5LqoU6ICt1bict5O7GcYs=`;
// `
// -----BEGIN PRIVATE KEY-----
// 私钥内容
// -----END PRIVATE KEY-----`;

const PUB_KEY = `
-----BEGIN PUBLIC KEY-----
公钥内容
-----END PUBLIC KEY-----`;
// 公钥加密
// function encrypt(text) {
//   const encrypt = new JSEncrypt();
//   encrypt.setPublicKey(PUB_KEY);
//   const encrypted = encrypt.encrypt(text);
//   return encrypted;
// }
export const encrypt = (text) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUB_KEY);
  const encrypted = encrypt.encrypt(text);
  return encrypted;
}

// 私钥解密
// function decrypt(text) {
//   const decrypt = new JSEncrypt();
//   decrypt.setPrivateKey(PRIV_KEY);
//   const decrypted = decrypt.decrypt(text);
//   return decrypted;
// }
export const decrypt = (text) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(PRIV_KEY);
  const decrypted = decrypt.decrypt(text);
  return decrypted;
}