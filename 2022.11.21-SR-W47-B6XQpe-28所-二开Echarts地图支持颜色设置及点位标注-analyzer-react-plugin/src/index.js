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
  const dataSource = {
    dims: [
      {
        asset_id: "ce699ec1-2810-4b6b-b50e-0f81c00e2d8c",
        col_datatype: 0,
        col_index: 2,
        col_name: "班级",
        date: false,
        displayed: 1,
        id: "4bef925d-9934-4194-8c4f-a7674b33f440",
        import_flag: false,
        is_ciphertext: false,
        is_private: false,
        multipleComponentFlag: false,
        timeGranularity: 0,
        column: "班级",
        datatype: 0,
        data: ["1", "1", "1", "1", "2", "2", "2", "2", "3", "3"],
      },
    ],
    vals: [
      {
        asset_id: "ce699ec1-2810-4b6b-b50e-0f81c00e2d8c",
        col_datatype: 0,
        col_index: 4,
        col_name: "成绩",
        date: false,
        displayed: 1,
        id: "f1edd99e-83d3-4777-ba1f-05cfaa92396d",
        import_flag: false,
        is_ciphertext: false,
        is_private: false,
        multipleComponentFlag: false,
        timeGranularity: 0,
        column: "成绩",
        datatype: 0,
        data: ["100", "99", "98", "97", "96", "95", "94", "93", "92", "91"],
      },
      {
        asset_id: "ce699ec1-2810-4b6b-b50e-0f81c00e2d8c",
        col_datatype: 0,
        col_index: 1,
        col_name: "姓名",
        date: false,
        displayed: 1,
        id: "6f7c88df-2383-4072-a26b-c368e54fa9c9",
        import_flag: false,
        is_ciphertext: false,
        is_private: false,
        multipleComponentFlag: false,
        queryable: 1,
        timeGranularity: 0,
        column: "姓名",
        datatype: 0,
        data: ["张三", "张三", "李四", "李四", "王五", "王五", "赵六", "赵六", "小七", "小八"],
      },
      {
        asset_id: "ce699ec1-2810-4b6b-b50e-0f81c00e2d8c",
        col_datatype: 0,
        col_index: 3,
        col_name: "学期",
        date: false,
        displayed: 1,
        id: "7bbb59aa-a123-413a-8d82-8eaaf6b93bbc",
        import_flag: false,
        is_ciphertext: false,
        is_private: false,
        multipleComponentFlag: false,
        timeGranularity: 0,
        column: "学期",
        datatype: 0,
        data: ["第一学期", "第二学期", "第一学期", "第二学期", "第一学期", "第二学期", "第一学期", "第二学期", "第一学期", "第一学期"],
      },
    ],
    keys: [],
    sers: [],
  };
  const options = {
    externalVariables: {
      headerBGColor: "#000",
    },
  };
  ReactDOM.render(<App dataSource={dataSource} options={options} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props, 303030);
    ReactDOM.render(<App {...props} />, dom);
  });
}
