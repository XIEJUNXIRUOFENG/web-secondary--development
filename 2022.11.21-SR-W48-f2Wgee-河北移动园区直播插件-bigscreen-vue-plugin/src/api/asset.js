import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

//视频流查询接口
export const queryStartVideo = id =>
  request.get(`/gardenVideo/getVideoPlayAddress?channelId=${id}`);

export const queryUserVideo = id =>
  request.get(`gardenVideo/queryUserVideo`);


