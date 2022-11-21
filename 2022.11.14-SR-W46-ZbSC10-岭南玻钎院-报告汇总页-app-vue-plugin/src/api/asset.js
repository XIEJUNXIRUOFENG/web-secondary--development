import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
export const SummaryResult = params =>
    request.post(`lingnan/bxy/analysisReportSummaryResult`, params);

export const createExcel = params =>
    request.post(`lingnan/bxy/analysisReportSummaryResult/createExcel`, params);
