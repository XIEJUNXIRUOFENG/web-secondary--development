import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });


export const queryUnit = () =>
  request.get(`ext/plan/apply/queryUnit`);  //查询工程量单位 

export const queryDevices = () =>
  request.get(`ext/plan/apply/queryDevices`);  //查询关联设备

export const queryFunArea = () =>
  request.get(`ext/plan/apply/queryFunArea`);  //查询功能区域  

export const queryMaterials = () =>
  request.get(`ext/plan/apply/queryMaterials`);  //查询物料  
