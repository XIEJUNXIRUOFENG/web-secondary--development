/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 11:41:18
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-08-31 20:26:59
 * @FilePath: /dataSource-secondary/src/api/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from './request';

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
	request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询资产
 */
export const queryAssetById = id => request.get('asset', { params: { asset_id: id } });

/**
 * 测试数据源
 */
export const testDatasource = params => request.post('dataSource/test', params);

/**
 * 提交数据源
 */
export const addDatasource = params => request.post('dataSource', params);

/**
 *更新数据源信息
 */
export const updateDatasource = params => request.post('dataSource/update', params);

/**
 * 重名判断
 */
export const duplicateCheck = name =>
	request.get(`/dataSource/duplicateCheck?dataSource_name=` + name);

/**
 * 数据库模式
 */
export const dataSourceDbschemas = id => request.get(`/dataSource/dbschemas?id=${id}`);

/**
 * 数据库表
 */
export const sourceMetaById = (id, schema) =>
	request.get(`/dataSource/dbmeta?id=${id}&schema=${schema}`);
