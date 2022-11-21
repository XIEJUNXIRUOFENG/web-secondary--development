import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryWarningType = (params) =>
  request.get(`/ext/StatisticsPage/queryWarningType?flag=${params.flag}&time1=${params.time1}&time2=${params.time2}&companyId=${params.companyId}`);
export const queryCountByOfficeId = (params) => request.get(`/system/office/queryCountByOfficeId?OfficeId=${params}`);
export const user = (params) => request.get(`/system/authority/user`);
export const queryConfigJumpUrl = (params) => request.get(`/ext/StatisticsPage/queryConfigJumpUrl?flag=${params.flag}&id=${params.id}`);
