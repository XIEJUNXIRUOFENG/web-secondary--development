import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, Button } from 'antd';

import './index.less';

const CheckboxGroup = Checkbox.Group;

class FilterColumns extends Component {
  static propTypes = {
    columns: PropTypes.array,
    title: PropTypes.string,
    onSave: PropTypes.func,
    value: PropTypes.array,
  };

  state = {
    checkedList: [],
    indeterminate: true,
    checkAll: false,
    plainOptions: [],
    searchName: undefined,
  };

  componentDidMount() {
    let plainOptions = [];
    const { columns, value } = this.props;
    columns.forEach(item => {
      plainOptions.push(item.col_name);
    });
    this.setState({ plainOptions, checkedList: value });
  }

  onChange = checkedList => {
    const { plainOptions } = this.state;
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    const { plainOptions } = this.state;
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  onSearch = e => {
    this.setState({ searchName: e.target.value });
  };

  render() {
    const { columns, title } = this.props;
    const { searchName, checkedList } = this.state;
    return (
      <div className="filter-columns">
        <div className="title">{title}</div>
        <div className="search-input">
          <Input
            placeholder={intl.get('ASS.PETSC')}
            onChange={this.onSearch}
            value={searchName}
          />
        </div>
        <div className="header-check-all">
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {intl.get('ASS.SELECT_ALL').d('全选')}
          </Checkbox>
        </div>
        <CheckboxGroup value={this.state.checkedList} onChange={this.onChange}>
          {columns.map((item, i) => {
            if (!searchName || item.col_name.indexOf(searchName) >= 0) {
              return (
                <div className="row" key={i}>
                  <Checkbox value={item.col_name}>{item.col_name}</Checkbox>
                </div>
              );
            }
          })}
        </CheckboxGroup>
        <div className="header-btn">
          <Button size="small">{intl.get('ASS.CANCEL')}</Button>
          <Button
            type="primary"
            size="small"
            className="saveok-btn"
            onClick={() => {
              this.props.onSave(checkedList);
            }}
          >
            {intl.get('ASS.DETERMINE').d('确定')}
          </Button>
        </div>
      </div>
    );
  }
}

export default FilterColumns;
