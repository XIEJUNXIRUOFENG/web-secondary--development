import request from "./request";

// 查询资产
export const getAssets = (cata, type, params2) => request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

// 查询动态参数数据
export const queryDynamicParams = (id) => request.get(`ext/dataRePorting/getStructure?dataIds=${id}`);
