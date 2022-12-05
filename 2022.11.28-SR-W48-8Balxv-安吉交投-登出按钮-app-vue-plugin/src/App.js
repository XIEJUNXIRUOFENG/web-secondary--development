import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import Setting from "./setting";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { logout } from './api/asset'
import "./app.less";

// 页面配置
const NavigateBar = (props) => {
  const { componentId, assetId } = props?.customConfig || {};

  useEffect(() => {
    console.log("资产ID", assetId);
  }, []);

  // 触发逻辑控制-动作
  const doEventCenterEvents = () => {
    window?.eventCenter?.triggerEvent(componentId, "sendData", {
      value: "测试数据",
    });
  };

  return (
    <>
      <Button type="primary" onClick={doEventCenterEvents}>
        逻辑控制-事件
      </Button>
    </>
  );
};

// 配置逻辑控制
const App = (props) => {
  const { componentId, img } = props?.customConfig || {};
  const { sysVariables = [] } = props;
  const [logOutUrl, setLogOutUrl] = useState('')

  useEffect(() => {
    // 注册事件
    const events = [
      {
        key: "sendData",
        name: "发送数据",
        payload: [
          {
            key: "value",
            name: "事件测试",
            dataType: "string",
          },
        ],
      },
    ];
    // 注册动作
    const actions = [
      {
        key: "messageSuccess",
        name: "接收消息",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];
    sysVariables?.forEach(x => {
      if (x.name == 'logout_Url') {
        setLogOutUrl(x.default_value)
        // setLogOutUrl('https://smardaten.feishu.cn/docx/VZY8dbXEwot6XZx9DAbc57NwnDe')
      }
    })

    // 注册事件中心
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        {
          do_EventCenter_messageSuccess: ({ value }) => {
            console.log("逻辑控制-动作", value);
          },
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

  const logOutClick = () => {

    logout().then(res => {
      window.location.href = logOutUrl
      // window.location.href = 'https://smardaten.feishu.cn/docx/VZY8dbXEwot6XZx9DAbc57NwnDe'
    }).catch(err => {

    })
  }
  const confirm = () => {
    Modal.confirm({
      title: '是否确认',
      icon: <ExclamationCircleOutlined />,
      width: '98%',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: logOutClick
    });
  };

  if (props.isConfig) {
    return <Setting {...props} />;
  }

  return (

    <button
      className='button_logout'
      onClick={() => {
        confirm()
      }}
    >
      <div className='button_img'> <img src={img}></img></div>
      <div className='button_title'>退出登录</div>
    </button>

  );;
};

export default App;
