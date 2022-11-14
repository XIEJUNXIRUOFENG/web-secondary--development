import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
    request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

export const alarmInfo = (params) =>
    request.post(`/ext/HanYuanLargeScreen/alarmInfo`, params);

export const queryDropDownBox = () =>
    request.get(`/ext/HanYuanLargeScreen/queryDropDownBox`);
