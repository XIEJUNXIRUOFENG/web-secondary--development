import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryLeftData = (params) => request.get(`/ext/PandectPage/queryLeftData?stationId=${params.stationId}`);
export const queryPowerData = (params) => request.get(`/ext/PandectPage/queryPowerData?stationId=${params.stationId}&time=${params.time}`);
export const queryGeneratingCapacity = (params) => request.get(`/ext/PandectPage/queryGeneratingCapacity?stationId=${params.stationId}&time=${params.time}`);
export const queryApplyTable = (data) => request.post(`/form/queryApplyTable?view_id=${data.view_id}&show_value=false`, data.data);
export const queryViewTableInfo = (params) => request.get(`/formView/queryViewTableInfo?view_id=${params.view_id}`);
export const longitudeAndLatitude = (params) => request.get(`/ext/PandectPage/longitudeAndLatitude?stationId=${params.stationId}`);
export const getWeather = (data) => request.post(`/url/getWeather`,data);
export const buttonUpdateDataList = (data) => request.post(`/form/buttonUpdateDataList?form_id=${data.params.form_id}`, data.data);
