import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Form, FormItem, Input, InputNumber, DatePicker, Select, Option, Row, Col, Tabs, TabPane, Button, Message } from "element-ui";
import "./index.css";
// import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Button);
Vue.prototype.$message = Message;

if (process.env.NODE_ENV !== "production") {
  const appArr = [
    { title: "预览页", type: "set" },
    { title: "配置项", type: "designConfiguration" },
    { title: "新增页", type: "add" },
  ];

  const customConfig = {
    componentId: "",
    data: "",
    saveValue: [],
    component: {},

    formConfig: {
      form_name: "二开数据",
    },
    onChange: (values) => {},
    changeConfiguration: (values) => {},
    configuration: '{"allowClear":true,"size":"大","placeholder":"444"}',
  };

  new Vue({
    render: (h) => {
      return (
        <div class="app-container">
          {appArr.map((item, index) => {
            return (
              <div class="components">
                <span class="title">{item.title}：</span>
                <App style={{ width: "calc(100% - 220px)" }} customConfig={customConfig} type={item.type} />
              </div>
            );
          })}
        </div>
      );
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    if (dom.childNodes.length == 0) {
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: (h) => <App type={props.type} customConfig={props || {}} />,
      }).$mount(div);
    }
  });
}
