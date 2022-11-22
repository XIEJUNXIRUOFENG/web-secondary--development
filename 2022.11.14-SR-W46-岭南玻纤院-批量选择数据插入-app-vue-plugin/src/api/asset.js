import request from "./request";

export const queryAll = (data) => request.post(`/system/account/queryAll`, data);
export const user = (data) => request.get(`/system/authority/user`, []);
export const updateInspectionItems = (data) => request.post(`/lingnan/bxy/updateInspectionItems`, data);
export const delRow = (data) => request.post(`/lingnan/bxy/inspectionItems/del`, data);
/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (params, data) =>
  request.post(`/asset/getAssetData?asset_id=${params.asset_id}&count=99999&pageNum=${params.pageNum}&pageSize=${params.pageSize}`, data);
