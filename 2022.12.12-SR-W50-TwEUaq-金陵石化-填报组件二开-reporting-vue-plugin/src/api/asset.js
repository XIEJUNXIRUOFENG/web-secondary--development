import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });
//全局查询
export const queryAllMuBan = (params) =>
  request.post(`ext/plan/apply/queryData?name=${params.name}&mode_type=${params.mode_type}`);
//查询工程量单位
export const queryUnit = () =>
  request.get(`ext/plan/apply/queryUnit`);
//查询关联设备
export const queryDevices = () =>
  request.get(`ext/plan/apply/queryDevices`);
//查询功能区域 
export const queryFunArea = () =>
  request.get(`ext/plan/apply/queryFunArea`);  //查询功能区域  

export const queryMaterials = () =>
  request.get(`ext/plan/apply/queryMaterials`);  //查询物料  

export const queryOfficeUser = (value) =>
  request.post(`/system/office/queryOfficeUser`, {
    "type": "office",
    "value": value,
    "varibleType": "values"
  });  //查询子组织 

export const uploadFile = (params) =>
  request.post(`image/upload`, params, { 'Content-Type': 'multipart/form-data' });


export const puginImport = params =>
  request.post(`plugin/import`, params, { 'Content-Type': 'multipart/form-data' });


/*
*  name 数据字典类型  plan_type_dictId 计划类型 quality_record_number_dictId 质量编号
*/
export const getDictId = params =>
  request.get(`system/config/queryConfig?type=plan_apply&name=${params}`);

/*
*  dictId 数据字典类型
*/
export const queryDict = params =>
  request.get(`ext/plan/apply/queryDict?dictId=${params}`);

/*
*  year 年份
*/
export const queryPlanNumber = params =>
  request.get(`ext/plan/apply/queryPlanNumber?year=${params}`);

/*
*  子单位查询
*/
export const queryzidanwei = params =>
  request.post(`system/office/queryOfficeUser`, {type: "office",value: "9d2035cd-e639-4b1b-8e99-2c3e556a8198",varibleType:'values'});

/*
*  excel查询回填数据
*/
export const previewData = params =>
  request.post(`ext/plan/apply/previewData?template_id=LYC1`, params);

/*
*  excel模版编辑
*/
export const templateSave = params =>
  request.post(`ext/spreadjs/template/save`, params);

/*
*  excel获取模版
*/
export const templateQuery = templateNo =>
  request.get(`ext/spreadjs/template/query?templateNo=${templateNo}`);
