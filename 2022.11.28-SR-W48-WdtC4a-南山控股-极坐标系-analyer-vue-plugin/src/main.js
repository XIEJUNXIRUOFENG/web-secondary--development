import Vue from "vue";
import App from "./App.vue";
import './index.css'
import { Table, TableColumn, Message } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);
Vue.prototype.$message = Message;

import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: h => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["status","value"],["月",10],["月",60],["日",10],["日",30],["年",40],["年",10]]'
    );
    const options = {
      externalVariables: {

        fontFamilyBar: '',
        fontColorBar: '',
        fontSizeBar: '20',
        fontFamilySum: '',
        fontColorSum: '',
        fontSizeSum: '',
        fontFamilyTitle: '',
        fontColorTitle: '',
        fontSizeTitle: '',
        coordinateY: '48%',
        barWidth: '20',
        radius: '10%|150%',
        bodyColor: '',
        bodyFontFamily: '',
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({

      render: h => <App {...{ props }} />,
    }).$mount("#app");
  } else {
    if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(
      process.env.VUE_APP_CUSTOM_PLUGIN_ID,
      (dom, props) => {
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const div = document.createElement("div");
        dom.appendChild(div);
        new Vue({
          render: h => <App {...{ props }} />,
        }).$mount(div);
      }
    );
  }
}
