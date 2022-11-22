import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id, params) =>
  request.post(`/asset/getAssetData?asset_id=${id}`, params);

/* 
* 直播流
* @param id 设备ID
*/
export const queryLiveing = id =>
  request.get(`iot/video/queryLiveStreaming?deviceId=${id}`);
