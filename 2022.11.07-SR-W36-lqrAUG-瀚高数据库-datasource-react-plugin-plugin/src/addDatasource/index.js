import React, { useImperativeHandle, useEffect, useState } from 'react';
import {  Form, Input, Select } from 'antd';
import { link_names, basic_names } from './utils';
import PropTypes from 'prop-types';

import './index.less';

const AddDatasource = ({ scene, datasourceDetail = {}, pluginRef }) => {
  const [form] = Form.useForm();
  const [readOnlyValue, setReadOnlyValue] = useState({});

  const getData = async (onlyData) => {
    let tempValues = {};
    if (onlyData) {
      return form.getFieldsValue();
    }
  await  form
      .validateFields()
      .then(values => {
        tempValues = values;
      })
      .catch(errorInfo => {
        console.log(errorInfo);
        tempValues = false;
      });
    return tempValues;
  };

  useImperativeHandle(pluginRef, () => ({
    getData,
  }));

  const renderFormItem = ({ type, options = [], name }) => {
    if (type === 'password') {
      return <Input.Password readOnly={readOnlyValue[name]} />;
    }
    if (type === 'select') {
      return (
        <Select disabled={readOnlyValue[name]}>
          {options.map(item => (
            <Select.Option value={item.value} key={item.value} >
              {item.value || item.name}
            </Select.Option>
          ))}
        </Select>
      );
    }
    return <Input readOnly={readOnlyValue[name]} />;
  };

  useEffect(() => {
    const { datasource, ...formValues } = datasourceDetail;
    if (scene === 'edit') {
      form.setFieldsValue({ ...formValues });
      return;
    }
    if (scene === 'assetAdd' && datasource !== 'new') {
      form.setFieldsValue({ ...formValues });
      setReadOnlyValue({
        name: true,
        url: true,
        username: true,
        password: true,
        clientEncoding: true,
        serverEncoding: true
      });
    }
    if (datasource === 'new') {
      form.resetFields(['name', 'username', 'url', 'password']);
      setReadOnlyValue({
        name: false,
        url: false,
        username: false,
        password: false,
        clientEncoding: false,
        serverEncoding: false
      })
    }
  }, [scene, JSON.stringify(datasourceDetail)]);

  return (
    <Form
      form={form}
      colon={false}
      className="_add_dataSource_form"
      labelAlign={'left'}
    >
      <div>
        <div className="_add_dataSource_title">基础信息</div>
        {basic_names.map(({ type, options = [], name, ...formProps }) => (
          <Form.Item
            labelCol={{ span: 18 }}
            {...formProps}
            className="_add_dataSource_item"
            name={name}
            key={name}
          >
            {renderFormItem({ type, options, name })}
          </Form.Item>
        ))}
      </div>

      <div>
        <div className="_add_dataSource_title">连接信息</div>
        {link_names.map(({ type, options = [], name, ...formProps }) => (
          <Form.Item
            labelCol={{ span: 18 }}
            {...formProps}
            className="_add_dataSource_item"
            name={name}
            key={name}
          >
            {renderFormItem({ type, options, name })}
          </Form.Item>
        ))}
      </div>
    
    </Form>
  );
};

AddDatasource.propTypes = {
  scene: PropTypes.string,
  datasource: PropTypes.string,
  form: PropTypes.object,
  pluginRef: PropTypes.object,
  datasourceDetail: PropTypes.object,
};

export default AddDatasource;
