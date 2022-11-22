import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, message } from 'antd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

import './index.less';

function isDate(col_type) {
	return col_type === 5 || col_type === 6;
}

function DataPreview({ data, handleCancel, type }) {
	const [columns, setColumns] = useState([]);
	const [dataSource, setDataSource] = useState([]);
	async function getData() {
		try {
			let cols = [];
			let source = [];
			let dateIndex = [];
			if (data[0]) {
				cols = data[0].map((col, index) => {
					if (isDate(col.col_datatype)) {
						dateIndex.push(index);
					}
					return {
						title: col.col_name,
						dataIndex: col.col_name,
						key: col.col_name,
					};
				});
				setColumns(cols);
			}
			if (data[1]) {
				data[1].forEach((row, index) => {
					let item = {};
					row.forEach((dataItem, x) => {
						if (dateIndex.includes(x)) {
							if (data[0][x].col_datatype === 6) {
								if (dataItem) {
									dataItem = moment(dataItem).format('YYYY-MM-DD HH:mm:ss');
								}
							} else {
								if (dataItem) {
									dataItem = moment(dataItem).format('YYYY-MM-DD');
								}
							}
						}
						item[cols[x]['title']] = dataItem;
					});
					source.push({ ...item, key: index });
				});
				setDataSource(source);
				// }
			}
		} catch (error) {
			if (error && error.data && error.data.message) {
				message.error(error.data.message);
			}
		}
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<Modal
			onCancel={() => {
				handleCancel();
			}}
			visible
			footer={null}
			title={'资产数据预览'}
			width="80%"
			className="preview_data"
		>
			<Scrollbars
				className="filling-form-conent"
				autoHide
				autoHideTimeout={1000}
				autoHideDuration={200}
				thumbMinSize={30}
				autoHeight
				autoHeightMax={765}
				universal={true}
			>
				<Table
					bordered
					dataSource={dataSource}
					columns={columns}
					pagination={false}
					expandable={{ childrenColumnName: 'childrenColumnName' }}
				/>
			</Scrollbars>
		</Modal>
	);
}

DataPreview.propTypes = {
	data: PropTypes.array,
	handleCancel: PropTypes.func,
	type: PropTypes.string,
};

export default DataPreview;
