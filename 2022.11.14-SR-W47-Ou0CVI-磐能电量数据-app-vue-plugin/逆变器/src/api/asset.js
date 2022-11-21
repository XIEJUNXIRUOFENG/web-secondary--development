import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
// export const queryAssetById = id =>
//   request.post(`/form/getAssetData?asset_id=${id}`, []);
//头部信息接口
export const queryInverterData = id =>
  request.get(`/ext/PandectPage/queryInverterData?equipmentId=${id}`,);
//卡片指标信息
export const queryIndexCard = id =>
  request.get(`/ext/PandectPage/queryIndexCard?equipmentId=${id}`,);
//图标发电量
export const queryPowerOutput = (param) =>
  request.get(`/ext/PandectPage/queryPowerOutput?equipmentId=${param.id}&time=${param.time}`,);
//历史数据

/**
 * 无鉴权查询资产
 * @param id 资产ID
 * {
"equipment_id": "1999116999232",
"date": "2022-09-21",
"pageNum": 1,
"pageSize": 10
}
 * 
 */
export const queryHistoryData = (param) =>
  request.post(`/dwdInverter/queryData`, param);
export const exportFn = (param) =>
  request.post(`/dwdInverter/export`, param, { responseType: 'blob' });

//实时数据
export const realTimeData = (id) =>
  request.get(`/ext/PandectPage/realTimeData?equipmentId=${id}`,);


//运行曲线接口查询
export const queryOperationCurve = (param) =>
  request.get(`/ext/PandectPage/queryOperationCurve?equipmentId=${param.id}&time=${param.time}&type=${param.type}`,);

