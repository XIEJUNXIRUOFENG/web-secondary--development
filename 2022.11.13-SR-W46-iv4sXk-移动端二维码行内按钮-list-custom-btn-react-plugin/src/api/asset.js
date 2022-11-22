import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id, params) =>
  request.post(`asset/getAssetData?asset_id=${id}&count=99999&pageNum=1&pageSize=10`, params);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
export const queryAssetByIds = id =>
  request.post(`/form/getAssetData?asset_id=${id}`, []);

export const bindPatrolPoint = params =>
  request.get(`/ext/ProductionData/bindPatrolPoint?task_id=${params.task_id}&patrol_spot_nfc=${params.patrol_spot_nfc}&route_id=${params.route_id}`);
