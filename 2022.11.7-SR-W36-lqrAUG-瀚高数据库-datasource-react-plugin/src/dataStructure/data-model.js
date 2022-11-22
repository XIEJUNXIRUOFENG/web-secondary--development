/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Input, Table, message, Popconfirm, Select, InputNumber, Checkbox, Modal, Tag } from 'antd';
import { promisify } from 'es6-promisify';
import * as JdbcAsset from '../api/jdbc-asset';
import intl from 'react-intl-universal';
import uuid from 'uuid/v4';
import { objDeepCopy } from './utils';
import './data-model.less';

const FormItem = Form.Item;
const { Option } = Select;

const DataTypeDisplayNames = {
	0: intl.get('ANAL.TEXT').d('文本'),
	5: intl.get('ANAL.DATE').d('日期'),
	6: intl.get('APP.DATE_TIME').d('日期时间'),
	8: intl.get('ANAL.NUMERICAL_VALUE').d('数值'),
	11: intl.get('EX.BYTE_ARRAY').d('字节数组'),
};

const property = {
	user: intl.get('ANAL.USER').d('用户'),
	office: intl.get('ANAL.DEPARTMENT').d('部门'),
};

// id: 'b8e867dd-1070-9f6a-2105-c1d94c0e44f4'
// asset_type: 102
// model_type: 'modelCollection'
// asset_owner: 'self'
class DataModel extends Component {
	static propTypes = {
		form: PropTypes.object,
		id: PropTypes.string,
		asset_owner: PropTypes.string,
		asset_type: PropTypes.string,
		model_type: PropTypes.string,
		data: PropTypes.object, // {intl.get('ASS.IACD')}
	};

	state = {
		id: this.props.id,
		readOnly: true,
		editAuth: false,
		data: [],
		oldData: [],
		selectedIndex: undefined,
		asyncModalVisible: false,
		asyncDesc: 1,
		dataStandardModal: {
			visible: false,
			index: undefined,
			standardId: undefined,
			catalog: undefined,
		},
	};

	componentDidMount() {
		this.queryAssetModal();
	}

	queryAssetModal = async flag => {
		try {
			const { data } = await JdbcAsset.assetQueryModel(this.props.id);
			const asset_type = this.props.asset_type || this.props.data?.detail?.asset_type;
			if (this.props.model_type === 'physicalModel' || asset_type === 112) {
				data &&
					data.map(item => {
						item.id = uuid();
					});
			}
			this.setState({ data: data || [], oldData: objDeepCopy(data) }, () => {
				if (flag) {
					this.closeEdit();
				}
			});
		} catch (err) {
			message.error('查询资产模型失败！');
		}
	};
	componentDidUpdate(prevProps) {
		if (prevProps.id !== this.props.id) {
			this.setState({
				id: this.props.id,
			});
			this.queryAssetModal();
		}
	}
	validateFieldsAndScroll = promisify(this.props.form.validateFieldsAndScroll);

	onAliasChange = (event, index) => {
		const { data } = this.state;
		const {
			target: { value },
		} = event;
		data[index].col_alias = value;
		this.setState({ data });
	};

	typeChange = (value, index) => {
		const { data } = this.state;
		data[index].col_datatype = value;
		this.setState({ data });
	};

	propertyChange = (value, index) => {
		const { data } = this.state;
		data[index].col_property = value === 'normal' ? undefined : value;
		this.setState({ data });
	};

	onDescChange = (event, index) => {
		const { data } = this.state;
		const {
			target: { value },
		} = event;
		data[index].col_desc = value;
		this.setState({ data });
	};

	edit = () => {
		this.setState({ editAuth: true });
	};

	closeEdit = () => {
		this.setState({ editAuth: false });
	};

	// intl.get('ASS.DWTATSF')
	getSameCol = () => {
		const { data } = this.state;
		for (let i = 0; i < data.length - 1; i++) {
			for (let j = i + 1; j < data.length; j++) {
				if (data[i].col_name === data[j].col_name) {
					return data[i].col_name;
				}
			}
		}
		return false;
	};

	// intl.get('ASS.JWTDATATSF')
	getWrongOperation = () => {
		const { data, oldData } = this.state;
		let newData = data.filter(item => item.is_new) || [];
		if (newData.length > 0) {
			for (let i = 0; i < newData.length; i++) {
				if (oldData.find(od => od.col_name === newData[i].col_name)) {
					return newData[i].col_name;
				}
			}
		}
		return false;
	};

	save = async () => {
		const { data } = this.state;
		if (!data || data.length === 0) {
			message.warning('至少保留一个字段！');
			return;
		}
		if (this.props.model_type === 'physicalModel' || this.props.asset_type === 112) {
			this.props.form.validateFieldsAndScroll(async err => {
				if (!err) {
					let sameCol = this.getSameCol();
					let wrongCol = this.getWrongOperation();
					if (sameCol) {
						message.error(`表中不可以存在相同字段【${sameCol}】`);
						return;
					}
					if (wrongCol) {
						message.error(
							`${intl.get('ANAL.FIELD').d('字段')}【${wrongCol}】为原有${intl
								.get('ANAL.FIELD')
								.d('字段')}，不允许对原有${intl
								.get('ANAL.FIELD')
								.d('字段')}进行先删后增`
						);
						return;
					}

					data.map((item, index) => {
						item.col_index = index + 1;
					});

					try {
						await JdbcAsset.updateMode({
							asset_id: this.props.id,
							structures: this.state.data,
						});
						this.queryAssetModal(true);
						message.success('更新资产模型成功！');
					} catch (err) {
						if (err?.data?.code === 10010005) {
							message.error('该资产对应的数据源访问账号无数据库操作权限！');
							return;
						}
						message.error(err?.data?.message || '更新资产模型失败！');
					}
				}
			});
		} else {
			try {
				await JdbcAsset.updateMode({
					asset_id: this.props.id,
					structures: this.state.data,
				});
				this.closeEdit();
				message.success('更新资产模型成功！');
			} catch (err) {
				if (err?.data?.code === 10010005) {
					message.error('该资产对应的数据源访问账号无数据库操作权限！');
					return;
				}
				message.error(err?.data?.message || '更新资产模型失败！');
			}
		}
	};

	syncModel = async () => {
		try {
			await JdbcAsset.syncModel(this.props.id, this.state.asyncDesc);
			this.queryAssetModal(true);
			message.success(intl.get('COMM.ASS').d('同步资产成功！'));
			this.cancelModal();
		} catch (err) {
			if (err?.data?.code === 10010005) {
				message.error('该资产对应的数据源访问账号无数据库操作权限！');
				return;
			}
			message.error(err?.data?.message || intl.get('COMM.FTSA').d('同步资产失败！'));
		}
	};

	nameBlur = () => {
		let sameCol = this.getSameCol();
		let wrongCol = this.getWrongOperation();
		if (sameCol) {
			message.error(`表中不可以存在相同字段【${sameCol}】`);
		} else if (wrongCol) {
			message.error(
				`${intl.get('ANAL.FIELD').d('字段')}【${wrongCol}】为原有${intl
					.get('ANAL.FIELD')
					.d('字段')}，不允许对原有${intl.get('ANAL.FIELD').d('字段')}进行先删后增`
			);
		}
	};

	onModelColChange = (index, key, value) => {
		let { data } = this.state;
		data[index][key] = value;
		if (key === 'col_datatype') {
			switch (value) {
				case 0:
					data[index].length = 64;
					data[index].scale = undefined;
					break;
				case 8:
					data[index].length = undefined;
					data[index].scale = 0;
					break;
				default:
					break;
			}
		}
		if (key === 'primary_key_flag' && value === 1) {
			data[index].not_null_flag = 1;
		}
		this.setState({
			data,
		});
	};

	addModelCol = event => {
		event.stopPropagation();
		let { data, selectedIndex } = this.state;
		let newCol = { id: uuid(), is_new: true, asset_id: this.props.id };
		if (selectedIndex) {
			data.splice(selectedIndex, 0, newCol);
		} else {
			data.push(newCol);
		}
		this.setState({
			data,
		});
	};

	removeModelCol = index => {
		let { data, selectedIndex } = this.state;
		// if (data.length === 1) {
		//   message.warning('至少保留一个字段！');
		//   return;
		// }
		selectedIndex = selectedIndex === index + 1 ? undefined : selectedIndex;
		data.splice(index, 1);
		this.setState(
			{
				data: [],
			},
			() => {
				this.setState({
					data: data,
					selectedIndex,
				});
			}
		);
	};
	cancelModal() {
		this.setState({
			asyncModalVisible: false,
			asyncDesc: 1,
		});
	}
	/**
	 * 确定选泽的标准
	 * @param {*} value
	 * @param {*} index
	 */
	standardChange = () => {
		const { data, dataStandardModal } = this.state;
		if (dataStandardModal.visible && !dataStandardModal.standardId) {
			message.error(intl.get('COMM.PLEASE_SELECT!').d('请选择!'));
		}
		data[dataStandardModal.index].dataStandardId = dataStandardModal.standardId;
		data[dataStandardModal.index].standardName = dataStandardModal.standardName;
		data[dataStandardModal.index].dataStandardcatalogId =
			dataStandardModal.dataStandardcatalogId;
		this.setState({
			data,
			dataStandardModal: {
				visible: false,
				index: undefined,
				standardId: undefined,
				catalog: undefined,
			},
		});
	};
	/**
	 * 移除关联
	 */
	removeStandard = index => {
		const { data } = this.state;
		data[index].dataStandardId = '';
		data[index].standardName = '';
		data[index].dataStandardcatalogId = '';
		this.setState({
			data,
		});
	};
	renderContent() {
		const { data, editAuth, asyncModalVisible, asyncDesc } = this.state;
		const { getFieldDecorator } = this.props.form;
		const asset_type = this.props.asset_type || this.props.data?.detail?.asset_type;
		const asset_owner = this.props.asset_owner || this.props.data?.detail?.asset_owner;

		const dataSource = data?.map(
			(
				{
					col_name,
					col_datatype,
					col_alias,
					col_desc,
					col_property,
					is_new,
					id,
					length,
					scale,
					primary_key_flag,
					not_null_flag,
					dataStandardId,
					standardName,
					dataStandardcatalogId,
				},
				index
			) => {
				return {
					index: index + 1,
					name: col_name,
					type: DataTypeDisplayNames[col_datatype],
					col_datatype,
					alias: col_alias,
					desc: col_desc,
					col_property,
					id,
					is_new,
					length,
					scale,
					primary_key_flag,
					not_null_flag,
					dataStandardId,
					standardName,
					dataStandardcatalogId,
				};
			}
		);

		const tableColumns = [
			{
				title: intl.get('ASS.INDEXES').d('索引'),
				dataIndex: 'index',
				key: 'index',
				width: 100,
				align: 'center',
			},
			{
				title: intl.get('ANAL.NAME').d('名称'),
				dataIndex: 'name',
				key: 'name',
				width: 200,
			},
			{
				title: intl.get('APIT.TYPE').d('类型'),
				dataIndex: 'type',
				key: 'type',
				width: 100,
				render: (text, record, index) => {
					if (this.state.editAuth && asset_type === 300) {
						return (
							<Select
								defaultValue={data[index].col_datatype}
								style={{ width: 100 }}
								onChange={value => this.typeChange(value, index)}
							>
								<Select.Option value={0}>
									{intl.get('ANAL.TEXT').d('文本')}
								</Select.Option>
								<Select.Option value={5}>
									{intl.get('ANAL.DATE').d('日期')}
								</Select.Option>
								<Select.Option value={6}>
									{intl.get('APP.DATE_TIME').d('日期时间')}
								</Select.Option>
								<Select.Option value={8}>
									{intl.get('ANAL.NUMERICAL_VALUE').d('数值')}
								</Select.Option>
							</Select>
						);
					}
					return <span>{text}</span>;
				},
			},
			{
				title: intl.get('COMM.CATEGORY').d('类别'),
				dataIndex: 'col_property',
				key: 'col_property',
				width: 200,
				render: (text, record, index) => {
					if (data[index].col_datatype === 0) {
						if (this.state.editAuth) {
							return (
								<Select
									defaultValue={data[index].col_property || 'normal'}
									style={{ width: 160 }}
									onChange={value => this.propertyChange(value, index)}
								>
									<Option value="normal">
										{intl.get('asset.datatypetext').d('普通文本')}
									</Option>
									<Option value="user">
										{intl.get('common.user').d('用户')}
									</Option>
									<Option value="office">
										{intl.get('common.office_id').d('部门')}
									</Option>
								</Select>
							);
						}
						return (
							<span>
								{text
									? property[text]
									: intl.get('asset.datatypetext').d('普通文本')}
							</span>
						);
					}
				},
			},
			{
				title: intl.get('ANAL.ALIAS').d('别名'),
				dataIndex: 'alias',
				key: 'alias',
				width: 200,
				render: !this.state.editAuth
					? null
					: (text, record, index) => {
							return (
								<Form className="ant-alias">
									<FormItem>
										{this.props.form.getFieldDecorator(`alias${index}`, {
											initialValue: text,
											rules: [
												{
													max: 64,
													message: '请输入少于64位字符',
												},
											],
										})(
											<Input
												defaultValue={text}
												onChange={event => this.onAliasChange(event, index)}
												maxLength={64}
												onKeyDown={() => {
													if (
														this.state.data[index].col_alias.length ===
														64
													) {
														message.warning('别名最长64个字符', 0.5);
													}
												}}
											/>
										)}
									</FormItem>
								</Form>
							);
					  },
			},
			{
				title: intl.get('APP.DESCRIBE').d('描述'),
				dataIndex: 'desc',
				key: 'desc',
				className: 'class_desc',
				render: !this.state.editAuth
					? null
					: (text, record, index) => {
							return (
								<Input
									defaultValue={text}
									onChange={event => this.onDescChange(event, index)}
									maxLength={128}
									onKeyDown={() => {
										if (this.state.data[index].col_desc.length === 128) {
											message.warning('描述最长128个字符', 0.5);
										}
									}}
								/>
							);
					  },
			},
		];

		/**
		 * mysql,sqlServer,oracle类型显示主键及不为空信息，{intl.get('REPO.NON_EDITABLE')}
		 */
		if ([101, 102, 104].includes(asset_type)) {
			tableColumns.push({
				title: intl.get('ANAL.NOT_EMPTY').d('不为空'),
				dataIndex: 'not_null_flag',
				width: '6%',
				align: 'center',
				render: (text, record) => {
					return <Checkbox disabled checked={record.not_null_flag === 1} />;
				},
			});
			tableColumns.push({
				title: intl.get('APIT.PRIMARY_KEY').d('主键'),
				dataIndex: 'primary_key_flag',
				width: '6%',
				align: 'center',
				render: (text, record) => {
					return <Checkbox disabled checked={record.primary_key_flag === 1} />;
				},
			});
		}
		const modelTableColumns = [
			{
				title: intl.get('ASS.SERIAL_NUMBER').d('序号'),
				dataIndex: 'index',
				key: 'index',
				width: '6%',
				align: 'center',
				onHeaderCell: () => {
					return {
						style: {
							whiteSpace: 'nowrap',
						},
					};
				},
			},
			{
				title: intl.get('ANAL.NAME').d('名称'),
				dataIndex: 'name',
				key: 'name',
				width: '14%',
				render: (text, record, index) => {
					if (this.state.editAuth && record.is_new) {
						return (
							<Form.Item style={{ margin: 0 }}>
								{getFieldDecorator(`col_name${record.id}`, {
									rules: [
										{
											required: true,
											message: `${intl.get('ASS.REQUIRED').d('必填')}`,
										},
									],
									initialValue: record.name,
								})(
									<Input
										placeholder={intl.get('ANAL.PEAFN').d('请输入字段名称')}
										onBlur={this.nameBlur}
										onChange={e => {
											this.onModelColChange(
												index,
												'col_name',
												e.target.value
											);
										}}
									/>
								)}
							</Form.Item>
						);
					}
					return text;
				},
			},
			{
				title: intl.get('APIT.TYPE').d('类型'),
				dataIndex: 'type',
				key: 'type',
				width: '20%',
				render: (text, record, index) => {
					if (this.state.editAuth && record.is_new) {
						return (
							<div style={{ display: 'flex', width: '100%' }}>
								<Form.Item
									style={{
										margin: 0,
										width:
											record.col_datatype === 0 || record.col_datatype === 8
												? '49%'
												: '100%',
									}}
								>
									{getFieldDecorator(`col_datatype${record.id}`, {
										rules: [
											{
												required: true,
												message: `${intl.get('ASS.REQUIRED').d('必填')}`,
											},
										],
										initialValue: record.col_datatype,
									})(
										<Select
											placeholder={intl.get('ANAL.PSAFT').d('请选择字段类型')}
											onChange={value => {
												this.onModelColChange(index, 'col_datatype', value);
											}}
											style={{ width: '100%' }}
										>
											<Option value={0}>
												{intl.get('ANAL.TEXT').d('文本')}
											</Option>
											<Option value={8}>
												{intl.get('ANAL.NUMERICAL_VALUE').d('数值')}
											</Option>
											<Option value={5}>
												{intl.get('ANAL.DATE').d('日期')}
											</Option>
											<Option value={6}>
												{intl.get('APP.DATE_TIME').d('日期时间')}
											</Option>
										</Select>
									)}
								</Form.Item>
								{(record.col_datatype === 0 || record.col_datatype === 8) && (
									<Form.Item
										style={{ margin: 0, width: '49%', marginLeft: '2%' }}
									>
										{getFieldDecorator(`length${record.id}`, {
											rules: [
												{
													required: true,
													message: `${intl
														.get('ASS.REQUIRED')
														.d('必填')}`,
												},
											],
											initialValue:
												record.col_datatype === 0
													? record.length
													: record.scale,
										})(
											<InputNumber
												className="table-input-number"
												placeholder={`${intl
													.get('ASS.PEAF')
													.d('请输入字段')}${
													record.col_datatype === 0
														? intl.get('LIBR.LENGTH').d('长度')
														: intl.get('EX.ACCURACY').d('精确度')
												}`}
												onChange={value => {
													this.onModelColChange(
														index,
														record.col_datatype === 0
															? 'length'
															: 'scale',
														value
													);
												}}
												style={{ width: '100%' }}
											/>
										)}
									</Form.Item>
								)}
							</div>
						);
					}
					return <span>{text}</span>;
				},
			},
			{
				title: intl.get('COMM.CATEGORY').d('类别'),
				dataIndex: 'col_property',
				key: 'col_property',
				width: '10%',
				render: (text, record, index) => {
					if (record.col_datatype === 0) {
						if (this.state.editAuth) {
							return (
								<Select
									defaultValue={record.col_property || 'normal'}
									style={{ width: 120 }}
									onChange={value => this.propertyChange(value, index)}
								>
									<Option value="normal">
										{intl.get('asset.datatypetext').d('普通文本')}
									</Option>
									<Option value="user">
										{intl.get('common.user').d('用户')}
									</Option>
									<Option value="office">
										{intl.get('common.office_id').d('部门')}
									</Option>
								</Select>
							);
						}
						return (
							<span>
								{text
									? property[text]
									: intl.get('asset.datatypetext').d('普通文本')}
							</span>
						);
					}
				},
			},
			{
				title: intl.get('ANAL.ALIAS').d('别名'),
				dataIndex: 'alias',
				key: 'alias',
				width: '12%',
				render: (text, record, index) => {
					if (this.state.editAuth) {
						return (
							<Form.Item style={{ margin: 0 }}>
								{getFieldDecorator(`col_alias${record.id}`, {
									rules: [],
									initialValue: record.alias,
								})(
									<Input
										placeholder={intl.get('ASS.PEAFA').d('请输入字段别名')}
										onChange={e => {
											this.onModelColChange(
												index,
												'col_alias',
												e.target.value
											);
										}}
									/>
								)}
							</Form.Item>
						);
					}
					return record.alias;
				},
			},
			{
				title: intl.get('APP.DESCRIBE').d('描述'),
				dataIndex: 'desc',
				key: 'desc',
				width: '20%',
				render: !this.state.editAuth
					? null
					: (text, record, index) => {
							return (
								<Form.Item style={{ margin: 0 }}>
									{getFieldDecorator(`desc${record.id}`, {
										rules: [],
										initialValue: record.desc,
									})(
										<Input
											placeholder={intl.get('ASS.PEAFD').d('请输入字段描述')}
											onChange={e => {
												this.onModelColChange(
													index,
													'col_desc',
													e.target.value
												);
											}}
											maxLength={128}
											onKeyDown={() => {
												if (
													this.state.data[index].col_desc.length === 128
												) {
													message.warning('描述最长128个字符', 0.5);
												}
											}}
										/>
									)}
								</Form.Item>
							);
					  },
			},
		];
		if (asset_type !== 112) {
			modelTableColumns.push({
				title: intl.get('ANAL.NOT_EMPTY').d('不为空'),
				dataIndex: 'not_null_flag',
				width: '6%',
				align: 'center',
				render: (text, record, index) => {
					return (
						<Checkbox
							disabled={
								!record.is_new || !this.state.editAuth || record.primary_key_flag
							}
							checked={record.not_null_flag === 1}
							onChange={e => {
								this.onModelColChange(
									index,
									'not_null_flag',
									e.target.checked ? 1 : 0
								);
							}}
						/>
					);
				},
			});
			modelTableColumns.push({
				title: intl.get('APIT.PRIMARY_KEY').d('主键'),
				dataIndex: 'primary_key_flag',
				width: '6%',
				align: 'center',
				render: (text, record, index) => {
					return (
						<Checkbox
							disabled={!record.is_new || !this.state.editAuth}
							checked={record.primary_key_flag === 1}
							onChange={e => {
								this.onModelColChange(
									index,
									'primary_key_flag',
									e.target.checked ? 1 : 0
								);
							}}
						/>
					);
				},
			});
		}
		if (this.state.editAuth) {
			modelTableColumns.push({
				title: intl.get('ANAL.OPERATION').d('操作'),
				dataIndex: 'operation',
				width: '6%',
				align: 'center',
				render: (text, record, index) => {
					return (
						<span>
							<Popconfirm
								title={intl.get('COMM.AYSYWTRTF').d('确定要移除该字段?')}
								onConfirm={event => {
									event.stopPropagation();
									this.removeModelCol(index);
								}}
							>
								<a>{intl.get('ANAL.REMOVE').d('移除')}</a>
							</Popconfirm>
						</span>
					);
				},
			});
		}

		// 资产字段结构可关联数据标准的有哪些
		// -支持：Oracle、Mysql、DB2、SqlServer、Sysbase、GreenPlum、达梦、PostgreSql、GBase、Sqlite、Cloudtable
		if ([101, 102, 103, 104, 106, 107, 108, 109, 112, 113].includes(asset_type)) {
			tableColumns.splice(3, 0, {
				title: intl.get('ASS.ASSOCIATION_STANDARD').d('关联标准'),
				dataIndex: 'dataStandardId',
				key: 'dataStandardId',
				width: 200,
				render: (text, record, index) => {
					if (text) {
						return (
							<Tag
								closable={this.state.editAuth}
								onClose={() => this.removeStandard(index)}
								onClick={() => {
									if (!this.state.editAuth) {
										return;
									}
									this.setState({
										dataStandardModal: {
											visible: true,
											index,
											standardId: record.dataStandardId,
											catalog: record.dataStandardcatalogId,
										},
									});
								}}
							>
								{record.standardName}
							</Tag>
						);
					} else {
						return (
							<span
								style={{ cursor: 'pointer' }}
								onClick={() => {
									if (!this.state.editAuth) {
										return;
									}
									this.setState({
										dataStandardModal: {
											visible: true,
											index,
											standardId: undefined,
											catalog: undefined,
										},
									});
								}}
							>
								{intl.get('BLOO.RELATION').d('关联')}
							</span>
						);
					}
				},
			});
			modelTableColumns.splice(3, 0, {
				title: intl.get('ASS.ASSOCIATION_STANDARD').d('关联标准'),
				dataIndex: 'dataStandardId',
				key: 'dataStandardId',
				width: 200,
				render: (text, record, index) => {
					if (text) {
						return (
							<Tag
								closable={this.state.editAuth}
								onClose={() => this.removeStandard(index)}
								onClick={() => {
									if (!this.state.editAuth) {
										return;
									}
									this.setState({
										dataStandardModal: {
											visible: true,
											index,
											standardId: record.dataStandardId,
											catalog: record.dataStandardcatalogId,
										},
									});
								}}
							>
								{record.standardName}
							</Tag>
						);
					} else {
						return (
							<span
								style={{ cursor: 'pointer' }}
								onClick={() => {
									if (!this.state.editAuth) {
										return;
									}
									this.setState({
										dataStandardModal: {
											visible: true,
											index,
											standardId: undefined,
											catalog: undefined,
										},
									});
								}}
							>
								{intl.get('BLOO.RELATION').d('关联')}
							</span>
						);
					}
				},
			});
		}

		let addButtonFlag =
			editAuth && (this.props.model_type === 'physicalModel' || asset_type === 112);
		let heights = window.screen.height - (addButtonFlag ? 390 : 340);
		console.log(heights, 'heights');
		return (
			<div
				className={classNames('jdbc-asset-data-model ant-customized')}
				onClick={() => {
					this.setState({
						selectedIndex: undefined,
					});
				}}
			>
				<div className="content">
					<div className="top-operation">
						<span>{`共 ${data?.length || 0} 个字段`}</span>
						<div className="right">
							{!editAuth &&
								(asset_owner === 'self' || asset_owner === 'team') &&
								(asset_type === 101 ||
									asset_type === 102 ||
									asset_type === 103 ||
									asset_type === 104 ||
									asset_type === 106 ||
									asset_type === 107 ||
									asset_type === 108 ||
									asset_type === 109 ||
									asset_type === 112 ||
									asset_type === 113) && (
									<span
										className="sdata-btn-primary"
										onClick={() => {
											this.setState({ asyncModalVisible: true });
										}}
									>
										{intl.get('EVEN.SYNCHRONIZATION').d('同步')}
									</span>
								)}

							{editAuth ? (
								<>
									<span className="sdata-btn-primary" onClick={this.save}>
										{intl.get('ANAL.PRESERVATION').d('保存')}
									</span>
									<span
										className="sdata-btn"
										onClick={() => this.queryAssetModal(true)}
									>
										{intl.get('ANAL.CANCEL').d('取消')}
									</span>
								</>
							) : (asset_owner === 'self' || asset_owner === 'team') &&
							  asset_type !== 601 ? (
								<span className="sdata-btn-primary" onClick={this.edit}>
									{intl.get('COMM.EDIT').d('编辑')}
								</span>
							) : (
								<></>
							)}
						</div>
					</div>
					{addButtonFlag && (
						<div className="add-btn-content">
							<span className="sdata-btn-primary" onClick={this.addModelCol}>
								{intl.get('COMM.ADD_TO').d('添加')}
							</span>
						</div>
					)}
					<Table
						size="small"
						columns={
							this.props.model_type === 'physicalModel' || asset_type === 112
								? modelTableColumns
								: tableColumns
						}
						dataSource={dataSource}
						pagination={false}
						scroll={{ y: heights }}
						rowClassName={record => {
							return record.index === this.state.selectedIndex
								? 'selected-row'
								: 'default-row';
						}}
						onRow={record => {
							return {
								onClick: event => {
									event.stopPropagation();
									this.setState({
										selectedIndex: record.index,
									});
								},
							};
						}}
					/>
					<Modal
						className="jdbc-asset-async-modal"
						title={intl.get('COMM.DATA_SYNCHRONIZATION').d('数据同步')}
						visible={asyncModalVisible}
						onOk={this.syncModel}
						onCancel={() => {
							this.cancelModal();
						}}
						okText={intl.get('ANAL.CONFIRM').d('确认')}
						cancelText={intl.get('ANAL.CANCEL').d('取消')}
					>
						<div className="modal-wrap">
							<div style={{ marginBottom: '10px' }}>
								<ExclamationCircleOutlined style={{ color: '#faad14' }} />
								<span className="modal-message">
									{intl
										.get('COMM.TSTSMCPSAAEOASAA')
										.d(
											'同步表结构可能会导致相关联的交换机、分析仪等执行异常等问题'
										)}
								</span>
							</div>
							<div>
								<Checkbox
									checked={asyncDesc === 1}
									onChange={e => {
										this.setState({
											asyncDesc: e.target.checked ? 1 : 0,
										});
									}}
								/>
								<span className="modal-message">
									{intl.get('ASS.TBZDMSXX').d('同步字段描述信息')}
								</span>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		);
	}

	render() {
		return this.renderContent();
	}
}

export default Form.create()(DataModel);
