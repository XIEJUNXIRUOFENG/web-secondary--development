import request from "./request";

/**
 * 登录
 */
export const fetchLogin = dataForm =>
    request.post(`sdata/rest/system/authority/loginAccount4Application`, dataForm)

/**
 * 注册
 */
export const fetchRegister = dataForm =>
    request.post(`sdata/rest/ext/user/add`, dataForm)