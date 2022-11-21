import request from "./request";

// 查询资产
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 获取用户信息
export const queryUserInfo = (id) => request.get(`system/authority/user`);
