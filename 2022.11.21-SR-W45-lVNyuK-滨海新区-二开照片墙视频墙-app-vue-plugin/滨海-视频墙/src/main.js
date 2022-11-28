import Vue from "vue";
import App from "./App.vue";
import { sysVariables, appVariables, customConfig } from "@/components/mockData.js";

// 引入参考https://element.eleme.cn/#/zh-CN/component/quickstart
import { Checkbox, CheckboxGroup, Card, Row, Col } from "element-ui";

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);

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
