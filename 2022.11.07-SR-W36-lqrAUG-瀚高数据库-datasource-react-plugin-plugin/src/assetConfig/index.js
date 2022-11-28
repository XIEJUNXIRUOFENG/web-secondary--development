import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Radio, Row, Col, Select, message, Button, InputNumber, Spin } from 'antd';
import DataPreview from '../components/data-preview-modal';
import * as JdbcAsset from '../api/jdbc-asset';

import './index.less';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

const modelTypes = {
	modelCollection: 0,
	datasourceCollection: 0,
	physicalModel: 2,
	sqlStatement: 1,
};

class JdbcSetting extends Component {
	static propTypes = {
		query: PropTypes.object,
		id: PropTypes.string,
		asset_owner: PropTypes.string,
		save: PropTypes.func,
		datasourceDetail: PropTypes.object,
	};

	state = {
		modeType: 0,
		dataBaseMode: '默认模式',
		dataBaseTable: undefined,
		asset_desc: undefined,
		sqlStatement: undefined,
		dbschemasData: [],
		dataSourceTable: [],
		dataViewVisible: false,
		dataView: [],
		editAuth: true,
		sourceId: undefined,
		asset_type: undefined,
		source_name: undefined,
		modelTableName: undefined,
		modelTableCols: [],
		selectedIndex: undefined,
		loading: false,
		sqlIsChange: false,
		isDatasourceCollection: false,
		tableNameEditing: false,
	};

	componentDidMount() {
		this.props.pluginRef.current = { getSaveParams: this.getSaveParams };
		if (this.props.id) {
			this.queryAssetConf();
		} else {
			const { query } = this.props.datasourceDetail || {};
			this.setState(
				{
					sourceId: query.dataSourceId,
					asset_type: query.asset_type,
					source_name: query.dataSourceName,
				},
				() => {
					this.queryDataSourceDbschemas();
				}
			);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.tableNameEditing) {
			return false;
		}
		return true;
	}

	queryAssetConf = async flag => {
		try {
			const { data } = await JdbcAsset.assetConfById(this.props.id);
			const storage_detail = JSON.parse(data.storage_detail || '{}');
			this.setState(
				{
					editAuth: false,
					modeType: data.model_type
						? modelTypes[data.model_type]
						: storage_detail.sqlStatement
						? 1
						: 0,
					dataBaseMode: storage_detail.schema ? storage_detail.schema : '默认模式',
					dataBaseTable: storage_detail.tablename,
					sqlStatement: storage_detail.sqlStatement,
					sourceId: data.source_id,
					asset_type: data.asset_type,
					asset_desc: data.asset_desc,
					source_name: data.source_name,
					modelTableName: storage_detail.tablename,
					partitionRecords: storage_detail.partitionRecords,
					isDatasourceCollection: data.model_type === 'datasourceCollection',
				},
				() => {
					if (!storage_detail.sqlStatement) {
						this.queryDataSourceDbschemas(storage_detail);
					}
				}
			);
			if (flag) {
				this.closeEdit();
			}
		} catch (err) {
			message.error('查询资产配置信息失败！');
		}
	};

	queryDataSourceDbschemas = async storage_detail => {
		try {
			const { data } = await JdbcAsset.dataSourceDbschemas(this.state.sourceId);
			this.setState({
				dbschemasData: data,
				dataBaseMode:
					storage_detail && storage_detail.schema
						? storage_detail.schema
						: data.length > 0
						? data[0].schema
						: '默认模式',
			});
			if (this.props.id) {
				this.querySourceMetaById(
					storage_detail.schema
						? storage_detail.schema
						: data.length > 0
						? data[0].schema
						: 'DEFAULT_SCHEMA'
				);
			} else {
				this.querySourceMetaById(data.length > 0 ? data[0].schema : 'DEFAULT_SCHEMA');
			}
		} catch (err) {
			message.error('查询数据库模式失败！');
		}
	};

	edit = () => {
		this.setState({ editAuth: true });
	};

	closeEdit = () => {
		this.setState({ editAuth: false });
	};

	handleModeChange = e => {
		this.setState({ modeType: e.target.value });
	};

	dataBaseModeChange = value => {
		this.setState({ dataBaseMode: value }, () => {
			this.querySourceMetaById(value);
		});
	};

	querySourceMetaById = async value => {
		try {
			const { data } = await JdbcAsset.sourceMetaById(this.state.sourceId, value);
			this.setState({ dataSourceTable: data });
		} catch (err) {
			message.error('查询数据库表列表失败！');
		}
	};

	dataBaseTableChange = value => {
		this.setState({ dataBaseTable: value });
	};

	setAssetDesc = e => {
		this.setState({ asset_desc: e.target.value });
	};

	editorDidMount = editor => {
		editor.focus();

		this.editor = editor;
		// this.editor.getValue()
	};

	onViewData = async () => {
		let item = await this.getSaveParams();
		delete item.asset_id;
		try {
			if (item.storage_detail) {
				const { data } = await JdbcAsset.assetPreview({
					source_id: this.state.sourceId,
					asset_type: this.state.asset_type,
					...item,
				});
				this.setState({ dataViewVisible: true, dataView: data });
			}
		} catch (err) {
			message.error('查询预览数据失败');
		}
	};

	handleCancel = () => {
		this.setState({ dataViewVisible: false });
	};

	onRecordsChange = val => {
		this.setState({ partitionRecords: val });
	};

	renderSetting = () => {
		const {
			modeType,
			dataSourceTable,
			dbschemasData,
			asset_desc,
			dataBaseMode,
			dataBaseTable,
			editAuth,
			partitionRecords,
		} = this.state;

		if (modeType === 0) {
			return (
				<>
					{!this.props.id && (
						<Row className="row sourcename">
							<Col span={2} className="right">
								数据源名称
							</Col>
							<Col span={22}>
								<Input
									value={this.state.source_name}
									style={{ width: '254px' }}
									disabled={true}
								/>
							</Col>
						</Row>
					)}
					<Row className="row">
						<Col span={2} className="right">
							数据库模式
						</Col>
						<Col span={22}>
							<Select
								onChange={this.dataBaseModeChange}
								style={{ width: '254px' }}
								value={dataBaseMode}
								disabled={this.props.id}
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
								onChange={this.dataBaseTableChange}
								style={{ width: '254px' }}
								placeholder={'请选择数据库表'}
								disabled={!this.state.editAuth}
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
								value={asset_desc}
								onChange={this.setAssetDesc}
								rows={4}
								style={{ width: '348px' }}
								disabled={!editAuth}
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
								disabled={!editAuth}
								min={50000}
								onChange={this.onRecordsChange}
								style={{ width: '254px' }}
							/>
						</Col>
					</Row>
				</>
			);
		}
	};

	getSaveParams = async () => {
		const {
			modeType,
			dataBaseMode,
			dataBaseTable,
			sqlStatement,
			asset_desc,
			modelTableName,
			modelTableCols,
			partitionRecords,
			isDatasourceCollection,
			editAuth,
		} = this.state;
		if (modeType === 0 && !dataBaseTable) {
			message.error('请选择数据库表！');
			return false;
		}

		return modeType === 0
			? {
					storage_detail: JSON.stringify({
						schema: dataBaseMode === '默认模式' ? undefined : dataBaseMode,
						tablename: dataBaseTable,
						partitionRecords,
					}),
					model_type: isDatasourceCollection ? 'datasourceCollection' : 'modelCollection',
					asset_desc,
			  }
			: {
					model_type: 'sqlStatement',
					storage_detail: JSON.stringify({ sqlStatement }),
			  };
	};

	save = async () => {
		try {
			const item = await this.getSaveParams();
			if (item.storage_detail) {
				await JdbcAsset.updateAssetConf({
					...item,
					asset_id: this.props.id,
					asset_type: this.state.asset_type,
				});
				this.closeEdit();
				message.success('更新资产配置成功！', 2);
			}
		} catch (err) {
			if (err?.data?.code === 10010005) {
				message.error('该资产对应的数据源访问账号无数据库操作权限！');
				return;
			}
			message.error(err?.data?.message || '更新资产配置失败！', 2);
		}
	};

	render() {
		const { dataViewVisible, dataView, editAuth, loading } = this.state;
		const { asset_owner } = this.props;
		return (
			<Spin spinning={loading} tip="loading..." ref={this.props.pluginRef}>
				<div
					className="jdbc-setting"
					onClick={() => {
						this.setState({
							selectedIndex: undefined,
						});
					}}
				>
					<div className="title">
						<span>{'资产配置'}</span>
						{this.props.id && (
							<div className="right">
								{editAuth ? (
									<>
										<span className="sdata-btn-primary" onClick={this.save}>
											保存
										</span>
										<span
											className="sdata-btn"
											onClick={() => this.queryAssetConf(true)}
										>
											取消
										</span>
									</>
								) : asset_owner === 'self' || asset_owner === 'team' ? (
									<span className="sdata-btn-primary" onClick={this.edit}>
										编辑
									</span>
								) : (
									<></>
								)}
							</div>
						)}
					</div>
					<RadioGroup
						onChange={this.handleModeChange}
						value={this.state.modeType}
						className="radiogroup"
						disabled={true}
					>
						<Radio.Button value={0}>模型采集</Radio.Button>
						<Radio.Button value={2}>物理建模</Radio.Button>
						<Radio.Button value={1}>高级SQL</Radio.Button>
					</RadioGroup>
					{this.props.id && (
						<Row className="row sourcename">
							<Col span={2} className="right">
								数据源名称
							</Col>
							<Col span={22}>
								<Input
									value={this.state.source_name}
									style={{ width: '254px' }}
									disabled={true}
								/>
							</Col>
						</Row>
					)}
					{this.renderSetting()}
					{!this.props.id && this.state.modeType !== 2 && (
						<Button type="primary" onClick={this.onViewData} className="view-data-btn">
							预览数据
						</Button>
					)}
					{dataViewVisible && (
						<DataPreview handleCancel={this.handleCancel} data={dataView} />
					)}
				</div>
			</Spin>
		);
	}
}

export default JdbcSetting;
