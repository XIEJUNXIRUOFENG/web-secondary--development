import React, { useEffect } from "react";
import { Form, Input } from "antd";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="任务ID变量名：" name="taskIdKey">
          <Input />
        </Form.Item>
        <Form.Item label="路线ID变量名：" name="routeIdKey">
          <Input />
        </Form.Item>
        <Form.Item label="dataId主键变量名：" name="dataIdKey">
          <Input />
        </Form.Item>
        <Form.Item label="上报记录跳转路径：" name="routerUrl">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
