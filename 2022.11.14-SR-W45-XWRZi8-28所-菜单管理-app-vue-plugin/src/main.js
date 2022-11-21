import Vue from "vue";
import App from "./App.vue";
import { sysVariables, appVariables, customConfig } from "@/components/mockData.js";

// 引入参考https://element.eleme.cn/#/zh-CN/component/quickstart
import { Row, Col, Tree, Table, TableColumn, Button, Select, Option, Pagination, Tag, Dialog, Tabs, TabPane, CheckboxGroup, Checkbox, Collapse, CollapseItem, Card, Message, Form, FormItem, Input } from "element-ui";

Vue.use(Row);
Vue.use(Col);
Vue.use(Tree);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Card);
Vue.prototype.$message = Message;
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  };
  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} sysVariables={sysVariables} appVariables={appVariables} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount(div);
  });
}
