import request from "./request";

export const getAssetJSONForProduct = (id) => request.get(`iot/product/getAssetJSONForProduct?productId=${id}`);

export const downloadAssetJSONForProduct = (id) => request.get(`iot/product/downloadAssetJSONForProduct?productId=${id}`);

// 下载接口
export const downloadExcel = (path) => request.post(`/ruanXunImportData/exportTemplate?path=${path}`, [], { responseType: "blob" });
