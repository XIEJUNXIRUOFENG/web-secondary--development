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
    { label: '首页', pid: '61bb5d5b-7f41-a0e5-3f14-4152bb7c9f5f', },
    { label: '第二页面', pid: 'dsada2', children: [{ label: '子级2', pid: '1ddd' }] },
    { label: '第三页面', pid: 'dsada3', children: [{ label: '子级3', pid: '3ddd' }] },
    { label: '第四页面', pid: 'dsada4', children: [{ label: '子级4', url: '4ddd' }] },
  ]
  let props = {
    title: "变电站(换流站)无人机运防一体系统",
    logoUrl: null,
    mainHeight: null,
    menuData: JSON.stringify(a),
    appId: '',
    regionAsset: '33b93646-868b-4ffc-a249-e766b5af9be8',
    alarmAsset: '0cda0b85-ddf3-42eb-9180-3d08d947b628',
    alarmUrl: '',
    alarmUrl: '', time: '1'
  };
  let isConfig = '';
  ReactDOM.render(<App {...props} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props, '====8080');
    ReactDOM.render(<App {...props} />, dom);
  });
}
