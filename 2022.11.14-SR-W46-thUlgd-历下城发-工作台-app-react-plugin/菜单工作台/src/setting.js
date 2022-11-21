import React, { useState, useEffect } from "react";
import { Row, Col, Input, Checkbox, Form } from "antd";
import "./app.less";

const Setting = (props) => {
   const { onConfigChange } = props;

   const [form] = Form.useForm();

   useEffect(() => {
      try {
         form.setFieldsValue(props.customConfig);
      } catch (error) {
         console.error("configuration解析错误", error);
      }
   }, []);

   const onFormLayoutChange = (changedValues, allValues) => {
      onConfigChange && onConfigChange(allValues);
   };

   const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
   };

   return (
      <Form {...formItemLayout} layout="vertical" form={form} onValuesChange={onFormLayoutChange}>
         <Form.Item label="组件高度" name="moduleHeight">
            <Input></Input>
         </Form.Item>
         <Form.Item label="显示菜单" name="menuCheckList" className="app_setting">
            <Checkbox.Group style={{ width: "100%" }}>
               <Row gutter={16}>
                  <Col span={12}>
                     <Checkbox value="0">发起流程</Checkbox>
                  </Col>
                  <Col span={12}>
                     <Checkbox value="1">待我处理</Checkbox>
                  </Col>
                  <Col span={12}>
                     <Checkbox value="2">我已处理</Checkbox>
                  </Col>
                  <Col span={12}>
                     <Checkbox value="3">我发起的</Checkbox>
                  </Col>
                  <Col span={12}>
                     <Checkbox value="4">抄送我的</Checkbox>
                  </Col>
               </Row>
            </Checkbox.Group>
         </Form.Item>
         <Form.Item label="待我处理" name="dwclFolw">
            <Input />
         </Form.Item>
         <Form.Item label="我已处理" name="wyclFolw">
            <Input />
         </Form.Item>
         <Form.Item label="我发起的" name="wfqdFolw">
            <Input />
         </Form.Item>
         <Form.Item label="抄送我的" name="cswdFolw">
            <Input />
         </Form.Item>
      </Form>
   );
};

export default Setting;
