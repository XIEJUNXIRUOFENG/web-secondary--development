import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Input,
  Select,
  Option,
  Form,
  FormItem,
  RadioGroup,
  RadioButton,
  Switch
} from "element-ui";
import "./index.css";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Switch);

// Vue.use(Element);

if (process.env.NODE_ENV !== "production") {
  const appArr = [
    { title: "设计页组件", type: "set" },
    { title: "设计页属性组件", type: "designConfiguration" },
    { title: "新增/编辑 主表组件", type: "add" },
    { title: "新增/编辑 主表多字段组件", type: "addMultiple" },
    { title: "新增/编辑 子表组件", type: "child" },
    { title: "列表页组件", type: "table" },
    { title: "详情页组件", type: "preview" }
  ];
  let temp = []
  const customConfig = {
    componentId: "111",
    // data: JSON.stringify(temp),
    data: '',
    saveValue: [],
    component: {
      columnStyle: {
        title: "二开测试title"
      }
    },

    formConfig: {
      form_name: "二开数据"
    },
    onChange: values => {
      console.log(values);
    },
    changeConfiguration: values => {
      console.log(values);
    },
    configuration: "{\"allowClear\":true,\"size\":\"大\",\"placeholder\":\"444\"}"
  };

  new Vue({
    render: h => {
      return (
        <div class="app-container">
          <App
            style={{ width: "100%" }}
            customConfig={customConfig}
            type='add'
          />
          {/* {appArr.map((item, index) => {
            return (
              <div class="components">
                <span class="title">{item.title}：</span>
                <App
                  style={{ width: "calc(100% - 220px)" }}
                  customConfig={customConfig}
                  type={item.type}
                />
              </div>
            );
          })} */}
        </div>
      );
    }
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props, _, eventBus) => {
      eventBus.on((props) => {
        console.log(props, '====a');
        const component = new Vue({
          render: (h) => <App type={props.type} customConfig={props} />,
        }).$mount();
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        dom.appendChild(component.$el);
      });
      if (dom.childNodes.length == 0) {
        const div = document.createElement("div");
        dom.appendChild(div);
        new Vue({
          render: h => <App type={props.type} customConfig={props || {}} />
        }).$mount(div);
      }


    }
  );
}




