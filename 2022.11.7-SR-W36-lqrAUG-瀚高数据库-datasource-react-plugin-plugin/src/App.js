/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 11:41:18
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-09-05 13:59:44
 * @FilePath: /datasource-secondary/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import PropTypes from 'prop-types';
import './app.less';
import AddDataSource from './addDatasource';
import AssetConfig from './assetConfig';
import AssetData from './assetData';
import DataStructure from './dataStructure';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

const Scene = {
	dataSourceAdd: 'add', // 数据源添加 （一个页面不同形态1）
	dataSourceEdit: 'edit', // 数据源编辑 （一个页面不同形态2）
	assetAdd: 'assetAdd', // 资产创建  （一个页面不同形态3）

	assetData: 'assetData', // 资产数据
	assetConfigAdd: 'assetConfigAdd', // 资产配置 创建 （两种场景）
	assetConfigEdit: 'assetConfigEdit', // 资产配置 编辑 （两种场景）
	dataStructure: 'dataStructure', // 数据结构
};

function Container(props) {
	console.log('==========================');
	console.log('second props', props);
	console.log('==========================');

	if (
		props.scene === Scene.dataSourceAdd ||
		props.scene === Scene.dataSourceEdit ||
		props.scene === Scene.assetAdd
	) {
		return <AddDataSource {...props} />;
	} else if (props.scene === Scene.assetData) {
		return <AssetData {...props} />;
	} else if (props.scene === Scene.assetConfigAdd || props.scene === Scene.assetConfigEdit) {
		return <AssetConfig {...props} datasourceDetail={props.datasourceDetail} />;
	} else if (props.scene === Scene.dataStructure) {
		return <DataStructure {...props} />;
	} else {
		return null;
	}
}

const App = props => {
	return <ConfigProvider locale={zhCN}>{Container(props)}</ConfigProvider>;
};
App.propTypes = { scene: PropTypes.string };
export default App;
