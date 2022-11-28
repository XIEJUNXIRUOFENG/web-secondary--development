/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Button, InputNumber, DatePicker, Dropdown, Menu, AutoComplete, message } from 'antd';
import moment from 'moment';

import PhotoView from '../components/photo-view';
import DTable from '../components/table';
import FilterColumns from '../components/filter-columns';
import { formatDates, formatDate } from './Transform';
import * as JdbcAsset from '../api/jdbc-asset';
import imgWarning from './images/warning.png';

import './index.less';

const { RangePicker } = DatePicker;

class AssetData extends Component {
	static propTypes = {
		id: PropTypes.string,
		name: PropTypes.string,
		data: PropTypes.object,
	};

	state = {
		id: this.props.id,
		moreType: false,
		filterData: [],
		columns: [],
		data: [],
		autoCompleteData: [],
		total: 0,
		showTotal: 0,
		displayedCols: [],
		showCols: [],
		queryCols: [],
		filterObj: [],
		imgBase64: undefined,
		imgvisible: false,
		pageNum: 1,
		pageSize: 10,
		loading: false,
		opacityStyle: {
			opacity: 0,
		},
	};

	componentDidMount() {
		this.setState(
			{
				id: this.props.id,
			},
			() => {
				this.queryColumns();
				this.queryAssetData();
				this.queryAutoComplete();
			}
		);
	}

	queryColumns = async () => {
		try {
			const { data } = await JdbcAsset.assetQueryModel(this.state.id);
			let [showCols, queryCols] = [[], []];
			data.forEach(col => {
				if (col.displayed === 1) {
					showCols.push(col.col_name);
				}
				if (col.queryable === 1) {
					queryCols.push(col.col_name);
				}
			});
			this.setState({ columns: data, showCols, queryCols });
		} catch (err) {
			message.error('查询资产模型失败！');
		}
	};

	queryAssetData = async params => {
		const { pageNum, pageSize } = this.state;
		try {
			this.setState({
				loading: true,
			});
			const { data } = await JdbcAsset.queryAssetData(
				this.state.id,
				params || [],
				undefined,
				pageNum,
				pageSize
			);
			this.setState(
				{
					total: data[2],
					displayedCols: data[0],
					data: data[1],
					showTotal: data[1].length,
					loading: false,
				},
				() => {
					this.setState({
						opacityStyle: {
							opacity: 1,
							transition: 'opacity 0.5s',
						},
					});
				}
			);
		} catch (error) {
			if (error && error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error('查询分析仪数据失败');
			}
		}
	};

	onSearchData = () => {
		const { filterObj } = this.state;
		let newFilter = [];
		filterObj.forEach(item => {
			if (item.type === 10 && item.compareObj && item.compareObj !== '') {
				newFilter.push(item);
			}
			// 日期类型比较
			if (item.type === 119 && item.min && item.max) {
				newFilter.push(item);
			}
			if (item.type === 119 && item.min && !item.max) {
				newFilter.push({
					...item,
					type: 9,
					compareObj: item.min,
					min: undefined,
					max: undefined,
				});
			}
			if (item.type === 119 && !item.min && item.max) {
				newFilter.push({
					...item,
					type: 8,
					compareObj: item.max,
					min: undefined,
					max: undefined,
				});
			}
			// 数字类型比较
			if (item.type === 13 && item.min && item.max) {
				newFilter.push(item);
			}
			if (item.type === 13 && item.min && !item.max) {
				newFilter.push({
					...item,
					type: 1,
					compareObj: item.min,
					min: undefined,
				});
			}
			if (item.type === 13 && !item.min && item.max) {
				newFilter.push({
					...item,
					type: 3,
					compareObj: item.max,
					max: undefined,
				});
			}
		});
		this.queryAssetData(newFilter);
	};

	queryAutoComplete = async () => {
		try {
			const { data } = await JdbcAsset.autoComplete(this.state.id);
			this.setState({
				autoCompleteData: data,
			});
		} catch (error) {}
	};

	changeMoreType = () => {
		this.setState({ moreType: !this.state.moreType });
	};

	saveQueryCols = async cols => {
		const { columns } = this.state;
		columns.forEach((item, i) => {
			if (cols.includes(item.col_name)) {
				columns[i].queryable = 1;
			} else {
				columns[i].queryable = 0;
			}
		});
		try {
			await JdbcAsset.updateQueryCols(columns);
			this.setState({ queryCols: cols, filterObj: [] });
			this.queryColumns();
			this.queryAutoComplete();
			message.success('设置查询字段成功！');
		} catch (err) {
			message.error('更新设置查询字段失败！');
		}
	};

	onRest = () => {
		this.setState({ filterObj: [], pageNum: 1 }, () => {
			this.queryAssetData();
		});
	};

	saveDisplayCols = async cols => {
		const { columns } = this.state;
		columns.forEach((item, i) => {
			if (cols.includes(item.col_name)) {
				columns[i].displayed = 1;
			} else {
				columns[i].displayed = 0;
			}
		});
		try {
			await JdbcAsset.updateDisplayCols(columns);
			this.setState({ showCols: cols }, () => {
				this.queryAssetData();
			});

			message.success('设置展示字段成功！');
		} catch (err) {
			message.error('更新设置展示字段失败！');
		}
	};

	changeCol(columns) {
		let newCols = [
			{
				title: '',
				dataIndex: 'hanghao',
				key: 'hanghao',
				fixed: 'left',
				align: 'center',
				width: 60,
				render: (text, row, index) => <div className="hanghao">{index + 1}</div>,
			},
		];

		columns = columns.filter(item => item.displayed === 1);

		let width = 0;
		if (document.getElementById('readable-table')) {
			width = document.getElementById('readable-table').offsetWidth / columns.length;
		}
		columns.forEach(col => {
			const alias = col.col_alias ? `(${col.col_alias})` : '';
			if (col.col_datatype === 10) {
				newCols.push({
					key: col.col_index,
					dataIndex: col.col_name,
					title: col.col_name + alias,
					type: col.col_datatype,
					width: width > 299 ? width : 299,
					className: 'maxWidthClass',
					// eslint-disable-next-line react/display-name
					render: text =>
						text === '1' ? (
							<span className="lookImg" onClick={() => this.onlookImg(text)}>
								{'查看图片'}
							</span>
						) : (
							''
						),
				});
			} else {
				newCols.push({
					key: col.col_index,
					dataIndex: col.col_name,
					title: col.col_name + alias,
					type: col.col_datatype,
					width: width > 299 ? width : 299,
					render: text => (
						<span
							className="maxWidthClass"
							title={text}
							style={{
								textAlign:
									col.col_datatype === 8 ||
									col.col_datatype === 5 ||
									col.col_datatype === 6
										? 'right'
										: 'left',
							}}
						>
							{text}
						</span>
					),
				});
			}
		});
		// delete newCols[newCols.length - 1].width;
		return newCols.length > 1 ? newCols : [];
	}

	onlookImg = async img => {
		this.setState({ imgBase64: img, imgvisible: true });
	};

	closeImageVisible = () => {
		this.setState({ imgvisible: false });
	};

	changeData = data => {
		const { displayedCols } = this.state;
		return data.map(row => {
			let obj = {};
			displayedCols.forEach((col, index) => {
				if (col.col_datatype === 10) {
					obj[col.col_name] = null;
				} else if (col.col_datatype === 5) {
					obj[col.col_name] = formatDates(row[index]);
				} else if (col.col_datatype === 6) {
					obj[col.col_name] = formatDate(row[index]);
				} else {
					if (col.col_property && ['user', 'office'].includes(col.col_property)) {
						const rowIndex = displayedCols.findIndex(
							item => col.col_name + '#' + col.col_property === item.col_name
						);
						obj[col.col_name] = row[rowIndex];
					} else {
						obj[col.col_name] = row[index];
					}
				}
			});
			return obj;
		});
	};

	onChangeText = (val, col) => {
		const { filterObj } = this.state;
		let num = 0;
		filterObj.forEach(item => {
			if (item.column === col.col_name) {
				item.compareObj = val;
				num++;
			}
		});
		if (num === 0) {
			filterObj.push({
				column: col.col_name,
				datatype: 0,
				type: 10,
				compareObj: val,
			});
		}
		this.setState({ filterObj });
	};

	onChangeNumber = (val, col, type) => {
		const { filterObj } = this.state;
		let num = 0;
		filterObj.forEach(item => {
			if (item.column === col.col_name) {
				item[type] = val;
				num++;
			}
		});
		if (num === 0) {
			let filter = { column: col.col_name, datatype: 8, type: 13 };
			filter[type] = val;
			filterObj.push(filter);
		}
		this.setState({ filterObj });
	};

	onChangeDate = (val, col) => {
		const { filterObj } = this.state;
		let num = 0;
		filterObj.forEach(item => {
			if (item.column === col.col_name) {
				item.min = val?.[0] ? Date.parse(val[0]) : '';
				item.max = val?.[1] ? Date.parse(val[1]) : '';
				num++;
			}
		});
		if (num === 0) {
			filterObj.push({
				column: col.col_name,
				datatype: col.col_datatype,
				type: 119,
				min: Date.parse(val[0]),
				max: Date.parse(val[1]),
			});
		}
		this.setState({ filterObj });
	};

	getValueText = col => {
		let value = '';
		const { filterObj } = this.state;
		filterObj.forEach(item => {
			if (item.column === col.col_name) {
				value = item.compareObj;
			}
		});
		return value;
	};

	getValueDate = col => {
		let value;
		const { filterObj } = this.state;
		filterObj.forEach(item => {
			if (item.column === col.col_name) {
				let date1 = item.min ? moment(item.min) : item.min;
				let date2 = item.max ? moment(item.max) : item.max;
				value = [date1, date2];
			}
		});
		return value;
	};

	getValueNumber = (col, type) => {
		let value;
		const { filterObj } = this.state;
		filterObj.forEach(item => {
			if (item.column === col.col_name) {
				value = item[type];
			}
		});
		return value;
	};

	renderFilter = () => {
		let div = [];
		const { columns, queryCols, autoCompleteData } = this.state;
		try {
			columns.map(col => {
				if (queryCols.includes(col.col_name)) {
					if (col.col_datatype === 0) {
						div.push(
							<Col className="filter-col" span={8} style={{ marginBottom: 20 }}>
								<span className="filter-label" title={col.col_name}>
									{col.col_name}
								</span>
								：
								<AutoComplete
									dataSource={
										autoCompleteData[col.col_name] &&
										typeof autoCompleteData[col.col_name] !== 'function'
											? typeof autoCompleteData[col.col_name][0] === 'number'
												? []
												: autoCompleteData[col.col_name]
											: []
									}
									filterOption={(inputValue, option) =>
										option.props.children.indexOf(inputValue) !== -1
									}
									onChange={e => this.onChangeText(e, col)}
									value={this.getValueText(col)}
									style={{ width: '60%' }}
								/>
							</Col>
						);
					}
					if (col.col_datatype === 5 || col.col_datatype === 6) {
						div.push(
							<Col className="filter-col" span={8} style={{ marginBottom: 20 }}>
								<span className="filter-label" title={col.col_name}>
									{col.col_name}
								</span>
								：
								<RangePicker
									showTime={
										col.col_datatype === 5
											? false
											: {
													hideDisabledOptions: true,
													defaultValue: [
														moment('00:00:00', 'HH:mm:ss'),
														moment('11:59:59', 'HH:mm:ss'),
													],
											  }
									}
									onOk={value => this.onChangeDate(value, col)}
									onChange={value => this.onChangeDate(value, col)}
									format={
										col.col_datatype === 5
											? 'YYYY-MM-DD'
											: 'YYYY-MM-DD HH:mm:ss'
									}
									style={{ width: '60%' }}
									value={this.getValueDate(col)}
								/>
							</Col>
						);
					}
					if (col.col_datatype === 8) {
						div.push(
							<Col className="filter-col" span={8} style={{ marginBottom: 20 }}>
								<span className="filter-label" title={col.col_name}>
									{col.col_name}
								</span>
								：
								<InputNumber
									onChange={e => this.onChangeNumber(e, col, 'min')}
									value={this.getValueNumber(col, 'min')}
									style={{ width: '30%' }}
								/>
								~
								<InputNumber
									onChange={e => this.onChangeNumber(e, col, 'max')}
									value={this.getValueNumber(col, 'max')}
									style={{ width: '30%' }}
								/>
							</Col>
						);
					}
				}
			});
		} catch (error) {
			console.log(error);
		}

		return div;
	};

	exportData = async ({ key }) => {
		const { filterObj } = this.state;
		let newFilter = [];
		filterObj.forEach(item => {
			if (item.type === 10 && item.compareObj && item.compareObj !== '') {
				newFilter.push(item);
			}
			// 日期类型比较
			if (item.type === 119 && item.min && item.max) {
				newFilter.push(item);
			}
			if (item.type === 119 && item.min && !item.max) {
				newFilter.push({
					...item,
					type: 9,
					compareObj: item.min,
					min: undefined,
					max: undefined,
				});
			}
			if (item.type === 119 && !item.min && item.max) {
				newFilter.push({
					...item,
					type: 8,
					compareObj: item.max,
					min: undefined,
					max: undefined,
				});
			}
			// 数字类型比较
			if (item.type === 13 && item.min && item.max) {
				newFilter.push(item);
			}
			if (item.type === 13 && item.min && !item.max) {
				newFilter.push({
					...item,
					type: 1,
					compareObj: item.min,
					min: undefined,
				});
			}
			if (item.type === 13 && !item.min && item.max) {
				newFilter.push({
					...item,
					type: 3,
					compareObj: item.max,
					max: undefined,
				});
			}
		});
		try {
			const { data } = await JdbcAsset.exportAssetData(this.state.id, key, newFilter);
			if (data) {
				let type =
					key === '1' ? 'application/csv;charset=UTF-8' : 'application/vnd.ms-excel';
				let fileName = `${this.props.name || this.props.data?.source_name}.${
					key === '0' ? 'xlsx' : 'csv'
				}`;
				let blob = new Blob([data], { type: type });
				if (typeof window.navigator.msSaveBlob !== 'undefined') {
					/*
					 * IE workaround for "HTML7007: One or more blob URLs were revoked by closing
					 * the blob for which they were created. These URLs will no longer resolve as
					 * the data backing the URL has been freed."
					 */
					window.navigator.msSaveBlob(blob, fileName);
				} else {
					let URL = window.URL || window.webkitURL;
					let objectUrl = URL.createObjectURL(blob);
					if (fileName) {
						var a = document.createElement('a');
						// safari doesn't support this yet
						if (typeof a.download === 'undefined') {
							window.location = objectUrl;
						} else {
							a.href = objectUrl;
							a.download = fileName;
							document.body.appendChild(a);
							a.click();
							a.remove();
						}
					} else {
						window.location = objectUrl;
					}
				}
			}
		} catch (e) {
			const reader = new FileReader();
			reader.onload = e =>
				message.error(e.target.result ? JSON.parse(e.target.result).message : '导出失败！');
			reader.readAsText(e.data);
		}
	};

	onPaginationChange = (pageNum, pageSize) => {
		const { pageSize: curPageSize } = this.state;
		this.setState(
			{
				pageNum: curPageSize !== pageSize ? 1 : pageNum,
				pageSize: pageSize,
			},
			() => {
				this.onSearchData();
			}
		);
	};

	render() {
		const {
			moreType,
			columns,
			displayedCols,
			data,
			total,
			// showTotal,
			showCols,
			imgvisible,
			imgBase64,
			pageNum,
			pageSize,
			opacityStyle,
		} = this.state;
		return (
			<div className="jdbc-asset-data">
				<div className="data-view">
					<div className="data-labels">
						<div className="label">
							<img src={imgWarning} />
							{`查询到${total}条记录`}
						</div>
						<div>
							<Dropdown
								overlay={
									<Menu onClick={this.exportData}>
										<Menu.Item key={0}>xlsx</Menu.Item>
										<Menu.Item key={1}>csv</Menu.Item>
									</Menu>
								}
								placement="bottomRight"
							>
								<Button style={{ marginRight: 20 }}>导出</Button>
							</Dropdown>
							<Dropdown
								overlay={
									<FilterColumns
										columns={columns}
										title={'选择数据文件'}
										onSave={this.saveDisplayCols}
										value={showCols}
									/>
								}
								placement="bottomCenter"
							>
								<Button>列设置</Button>
							</Dropdown>
						</div>
					</div>
					<div style={opacityStyle}>
						<DTable
							columns={this.changeCol(displayedCols)}
							dataSource={this.changeData(data)}
							total={total > 200 ? 200 : total}
							pagination={{
								show: true,
								total: total > 200 ? 200 : total,
								onChange: this.onPaginationChange,
								pageSize: pageSize,
								current: pageNum,
							}}
							loading={this.state.loading}
						/>
					</div>
				</div>
				{imgvisible && <PhotoView url={imgBase64} close={this.closeImageVisible} />}
			</div>
		);
	}
}

export default AssetData;
