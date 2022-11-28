import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import './index.less';

// eslint-disable-next-line no-unused-vars
function DTable({ columns, dataSource, total, loading, pagination }) {
  columns = columns.filter(el => !!el.dataIndex);
  return (
    <div className="d-table" id="readable-table">
      <Table
        loading={loading}
        childrenColumnName="antdChildren"
        bordered
        dataSource={dataSource}
        columns={columns}
        // scroll={{ x: 'max-content', y: 550 }}
        scroll={columns?.length > 0 ? { x: 'max-content', y: 550 } : { y: 550 }}
        pagination={pagination?.show ? pagination : false}
      />
    </div>
  );
}

DTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  total: PropTypes.number,
  pagination: PropTypes.object,
  loading: PropTypes.boolean,
};

export default DTable;
