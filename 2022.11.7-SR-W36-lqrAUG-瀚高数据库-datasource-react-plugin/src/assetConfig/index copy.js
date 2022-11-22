/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-31 16:40:50
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-08-31 20:26:45
 * @FilePath: /dataSource-secondary/src/assetConfig/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 资产配置 （创建/编辑 两种场景）
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Radio, Row, Col, Input, Select, message, InputNumber, Button } from 'antd';
import './index.less';
import { dataSourceDbschemas, sourceMetaById } from '../api';

const { TextArea } = Input;
const { Option } = Select;

const AssetConfig = props => {
	const { editId = 1, config = { sourceId: '54a13eaa-3164-6f05-7063-f811759c3a89' } } = props;
	const { sourceId, source_name, asset_owner = 'self', storage_detail = {} } = config;
	const [inEditing, setInEditing] = useState(false);
	const [dataBaseMode, setDataBaseMode] = useState('默认模式');
	const [dbschemasData, setDbschemasData] = useState([]);
	const [dataSourceTable, setDataSourceTable] = useState([]);
	const [dataBaseTable, setDataBaseTable] = useState();
	const [assetDesc, setAssetDesc] = useState();
	const [partitionRecords, setPartitionRecords] = useState();

	useEffect(() => {
		queryDataSourceDbschemas();
	}, []);

	// eslint-disable-line
	const queryDataSourceDbschemas = async () => {
		try {
			const { data } = await dataSourceDbschemas(sourceId);
			setDbschemasData(data);
			if (editId) {
				querySourceMetaById(
					storage_detail.schema
						? storage_detail.schema
						: data.length > 0
						? data[0].schema
						: 'DEFAULT_SCHEMA'
				);
			} else {
				querySourceMetaById(data.length > 0 ? data[0].schema : 'DEFAULT_SCHEMA');
			}
		} catch (err) {
			message.error('查询数据库模式失败！');
		}
	};

	const dataBaseModeChange = value => {
		setDataBaseMode(value);
		querySourceMetaById(value);
	};

	const querySourceMetaById = async value => {
		try {
			const { data } = await sourceMetaById(sourceId, value);
			setDataSourceTable(data);
		} catch (err) {
			message.error('查询数据库表列表失败！');
		}
	};

	// 模型采集
	const renderModelCatch = () => {
		return (
			<>
				<Row className="row sourcename">
					<Col span={2} className="right">
						数据源名称
					</Col>
					<Col span={22}>
						<Input value={source_name} style={{ width: '254px' }} disabled={true} />
					</Col>
				</Row>
				<Row className="row">
					<Col span={2} className="right">
						数据库模式
					</Col>
					<Col span={22}>
						<Select
							onChange={dataBaseModeChange}
							style={{ width: '254px' }}
							value={dataBaseMode}
							disabled={editId}
						>
							{dbschemasData.map((result, index) => {
								return (
									<Option value={result.schema} key={index}>
										{result.schema === 'DEFAULT_SCHEMA'
											? '默认模式'
											: result.schema === 'null'
											? '无'
											: result.schema}
									</Option>
								);
							})}
						</Select>
					</Col>
				</Row>
				<Row className="row">
					<Col span={2} className="right">
						数据库表
					</Col>
					<Col span={22}>
						<Select
							showSearch
							value={dataBaseTable}
							onChange={value => setDataBaseTable(value)}
							style={{ width: '254px' }}
							placeholder={'请选择数据库表'}
							disabled={editId && !inEditing}
						>
							{dataSourceTable.map((result, index) => {
								return (
									<Option value={result.tablename} key={index}>
										{result.tablename}
									</Option>
								);
							})}
						</Select>
					</Col>
				</Row>
				<Row className="row">
					<Col span={2} className="right">
						详细描述
					</Col>
					<Col span={22}>
						<TextArea
							value={assetDesc}
							onChange={e => setAssetDesc(e.target.value)}
							rows={4}
							style={{ width: '348px' }}
							disabled={editId && !inEditing}
						/>
					</Col>
				</Row>
				<Row className="row">
					<Col span={2} className="right">
						分区条数
					</Col>
					<Col span={22}>
						<InputNumber
							value={partitionRecords}
							disabled={editId && !inEditing}
							min={50000}
							onChange={value => setPartitionRecords(value)}
							style={{ width: '254px' }}
						/>
					</Col>
				</Row>
			</>
		);
	};

	return (
		<div className="jdbc-setting">
			{/* 标题 */}
			<div className="title">
				<span>资产配置</span>
				{editId && (
					<div className="right">
						{inEditing ? (
							<>
								<span
									className="sdata-btn-primary"
									onClick={() => {
										setInEditing(false);
									}}
								>
									保存
								</span>
								<span
									className="sdata-btn"
									// onClick={() => this.queryAssetConf(true)}
									onClick={() => setInEditing(false)}
								>
									取消
								</span>
							</>
						) : (
							(asset_owner === 'self' || asset_owner === 'team') && (
								<span
									className="sdata-btn-primary"
									onClick={() => {
										setInEditing(true);
									}}
								>
									编辑
								</span>
							)
						)}
					</div>
				)}
			</div>

			{/* 内容区域 */}
			<Radio.Group value={1} disabled={true} className="radiogroup">
				<Radio.Button value={1}>模型采集</Radio.Button>
				<Radio.Button value={2}>物理建模</Radio.Button>
				<Radio.Button value={3}>高级SQL</Radio.Button>
			</Radio.Group>

			<div className="container">{renderModelCatch()}</div>

			{!editId && (
				<Button type="primary" onClick={() => {}} className="view-data-btn">
					预览数据
				</Button>
			)}
		</div>
	);
};

AssetConfig.propTypes = {
	editId: PropTypes.string,
	sourceId: PropTypes.string,
	config: PropTypes.object,
};

export default AssetConfig;
