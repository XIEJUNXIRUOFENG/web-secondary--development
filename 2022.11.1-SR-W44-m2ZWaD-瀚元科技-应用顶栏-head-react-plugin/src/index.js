/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  // 添加 customConfig 进行测试
  window.currentUser = {
    account_code: '1234567890', id: '1234567890id', loginName: "admin"
  }
  const a = [
    { label: '首页', pid: '13fa289a-d46c-31e4-6da2-af2410e68c6f', },
    { label: '空中管理', pid: 'dsada2', children: [{ label: '子级2', pid: 'f685d8eb-e780-6674-55cc-2c97b56ce548', key: 'id1' }] },
    { label: '无人机巡检', pid: 'dsada3', children: [{ label: '子级3', pid: '7c9e0b84-acfa-ddc3-58fd-30e7be986893' }] },
    { label: '低空防御监视', pid: 'dsada4', children: [{ label: '子级4', url: '6c1b89ee-07f1-d73e-acc4-7267cab4a01b' }] },
    { label: '态势感知', pid: 'dsada4', children: [{ label: '子级4', url: 'a0fb1ff5-cfa5-7b8e-d22d-086f4803abee' }] },
    { label: '统计分析', pid: 'dsada4', children: [{ label: '子级4', url: 'af4b6b03-4086-3c80-2483-e6cf0aa022be' }] },
    { label: '基础数据', pid: 'dsada4', children: [{ label: '子级4', url: 'b68bf656-307b-119c-1549-4eeeb0a7b160' }] },
    { label: '第四页面', pid: 'dsada4', children: [{ label: '子级4', url: '8d0a05ef-294e-7124-0585-95b3263653da' }] },
  ]
  let props = {
    title: "变电站(换流站)无人机运防一体系统",
    logoUrl: null,
    mainHeight: null,
    menuData: JSON.stringify(a),
    appId: '',
    regionAsset: '9c54500a-b7f4-0f80-c01b-ca1c4af8b660',
    alarmAsset: '334b2d43-7a37-c173-fc8a-962d64ffafe2',
    substationAsset: 'ea7c9900-0652-a5a0-2f11-194074ec2957',
    alarmUrl: '',
    alarmField: 'alarm_level', time: '60'
  };
  let isConfig = '';
  ReactDOM.render(<App {...props} isConfig={isConfig} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }








  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props, '====8080');
    ReactDOM.render(<App {...props} />, dom);
  });
}
