/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 16:42:14
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-09-02 10:43:34
 * @FilePath: /dataSource-secondary/src/dataStructure/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import DataModel from './data-model';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

function DataStructure(props) {
	const { id, assetType, asset_owner, model_type } = props;
	return (
		<DataModel
			id={id}
			asset_type={assetType}
			asset_owner={asset_owner}
			model_type={model_type}
		/>
	);
}

DataStructure.propTypes = {
	id: PropTypes.string,
	assetType: PropTypes.string,
	asset_owner: PropTypes.string,
	model_type: PropTypes.string,
};

export default DataStructure;
