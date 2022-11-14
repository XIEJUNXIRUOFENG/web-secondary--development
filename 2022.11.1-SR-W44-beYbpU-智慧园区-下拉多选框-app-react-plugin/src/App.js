import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import "./app.less";

import Setting from "./setting";

import { queryCustomData } from "./api/asset";

const NavigateBar = (props) => {
  // 获取事件中心ID,和配置项参数
  const { componentId, componentName, assetId } = props?.customConfig || {};

  const [parkidlist, setParkidlist] = useState([]);

  const [optionList, setOptionList] = useState([]);

  useEffect(() => {
    getSelectValue();
  }, []);

  const getSelectValue = () => {
    let _optionList = [];
    let dataForm = {
      queryCondition: {
        pageNum: 1,
        pageSize: 500,
        queryParams: [],
      },
      jsonObject: {
        assetId: assetId,
        flag: true,
      },
    };
    queryCustomData(dataForm).then((res) => {
      res.data.forEach((item) => {
        if (!item.parent_id) {
          _optionList.push({
            label: item.name,
            value: item.data_id,
          });
        }
      });
      setOptionList(_optionList);
    });
  };

  const selectProps = {
    // 多选
    mode: "multiple",
    style: { width: "100%" },
    parkidlist,
    options: optionList,
    onChange: (newValue) => {
      setParkidlist(newValue);
    },
    onBlur: () => {
      window?.eventCenter?.triggerEvent(componentId, "sendParkIds", {
        idList: parkidlist,
      });
    },
    placeholder: "请选择",
    maxTagCount: 1,
  };

  return (
    <Form>
      <Form.Item label={componentName}>
        <Select {...selectProps} />
      </Form.Item>
    </Form>
  );
};

const App = (props) => {
  // 获取事件中心ID,和配置项参数
  const { componentId } = props?.customConfig || {};

  useEffect(() => {
    // 注册事件
    const events = [
      {
        key: "sendParkIds",
        name: "园区ID",
        payload: [
          {
            key: "idList",
            name: "园区ID",
            dataType: "array",
          },
        ],
      },
    ];
    // 注册动作
    const actions = [];
    // 注册逻辑控制
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        {
          Event_Center_getName: () => {
            return "组件名称";
          },
        },
        {
          events,
          actions,
        }
      );
  }, []);

  if (props.isConfig) {
    return <Setting {...props} />;
  }

  return <NavigateBar {...props} />;
};

export default App;
