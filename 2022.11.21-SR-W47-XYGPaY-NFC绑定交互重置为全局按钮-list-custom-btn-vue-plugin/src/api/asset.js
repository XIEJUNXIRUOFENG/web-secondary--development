import request from "./request";

export const getAssetJSONForProduct = id =>
  request.get(`iot/product/getAssetJSONForProduct?productId=${id}`);

export const downloadAssetJSONForProduct = id =>
  request.get(`iot/product/downloadAssetJSONForProduct?productId=${id}`);

export const bindPatrolPoint = params =>
  request.get(`/ext/ProductionData/bindPatrolPoint?task_id=${params.task_id}&patrol_spot_nfc=${params.patrol_spot_nfc}&route_id=${params.route_id}`);