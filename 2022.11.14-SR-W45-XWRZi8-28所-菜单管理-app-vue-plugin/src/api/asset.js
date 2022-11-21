import request from "./request";

// 查询资产
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 获取地区信息
export const queryAreaData = (assetId) => request.get(`system/office`);

// 查询树组件数据
export const queryTreeData = (assetId) => request.get(`appMenuMange/queryAllApp?assetId=${assetId}`);
// 查询树组件懒加载数据
export const queryLazyTreeData = (dataForm) => request.post(`appMenuMange/queryAppMenuById`, dataForm);

// 查询菜单表格数据
export const queryUserTableData = (datappId) => request.get(`datapp/menu/queryMenuRolesByDatappId?datappId=${datappId}`);

// 应用角色多选数据
export const queryAppUserCheckData = (groupId) => request.get(`system/role/queryRolesByGroupId?groupId=${groupId}`);
// 应用角色表格数据
export const queryAppUserTableData = (dataForm) => request.post(`system/user/queryUsersByRoles`, dataForm);

// 系统角色多选数据
export const querySystemUserCheckData = () => request.get(`system/role/queryAllRole`);

// 保存赋权数据
export const saveCheckData = (dataForm) => request.post(`datapp/menu/empower`, dataForm);

// 保存新增按钮数据
export const saveAddButtonData = (dataForm) => request.post(`appMenuMange/addTag`, dataForm);
// 删除新增按钮数据
export const deleteAddButtonData = (dataForm) => request.post(`appMenuMange/delTag`, dataForm);
// 查询新增按钮表格数据
export const queryAddButtonTableData = (dataForm) => request.post(`appMenuMange/queryTag`, dataForm);
// 保存新增按钮赋权
export const saveAddButtonEmpowerData = (dataForm) => request.post(`appMenuMange/addRoleTag`, dataForm);
// 删除角色关联按钮
export const deleteUserButtonData = (dataForm) => request.post(`appMenuMange/delRoleTag`, dataForm);
