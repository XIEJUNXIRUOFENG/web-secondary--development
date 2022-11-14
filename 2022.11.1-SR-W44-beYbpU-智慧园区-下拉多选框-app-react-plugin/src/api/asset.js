import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 查询树结构
export const queryCustomData = (params) => request.post(`WisdomPark/queryMenuByAssetIdInfo`, params);
