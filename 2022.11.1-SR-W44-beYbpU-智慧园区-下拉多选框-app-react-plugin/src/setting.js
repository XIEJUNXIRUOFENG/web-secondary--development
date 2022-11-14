import React, { useState } from "react";
import { Input, Row, Col } from "antd";
import "./app.less";

const Setting = (props) => {
  const { onConfigChange } = props;

  const [customConfig, setCustomConfig] = useState(props.customConfig || {});

  const changeComponentName = (e) => {
    let config = { ...customConfig };
    if (e.target.value) {
      config.componentName = e.target.value;
      setCustomConfig(config);
      onConfigChange && onConfigChange(config);
    }
  };

  const changeAssedId = (e) => {
    let config = { ...customConfig };
    if (e.target.value) {
      config.assetId = e.target.value;
      setCustomConfig(config);
      onConfigChange && onConfigChange(config);
    }
  };

  return (
    <Row gutter={[16, 4]}>
      <Col span={24}>组件名称</Col>
      <Col span={24}>
        <Input onChange={changeComponentName} />
      </Col>
      <Col span={24}>下拉框选项资产ID</Col>
      <Col span={24}>
        <Input onChange={changeAssedId} />
      </Col>
    </Row>
  );
};

export default Setting;
