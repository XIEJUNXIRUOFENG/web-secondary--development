import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const queryDropDownBox = (params) =>
  request.get(`/ext/HanYuanLargeScreen/queryDropDownBox`, {params});
export const deviceFlawStatistics = (data) =>
  request.post(`/ext/HanYuanLargeScreen/deviceFlawStatistics`, data);
