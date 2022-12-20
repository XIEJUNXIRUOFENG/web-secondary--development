import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
let wrapId = window._appData?.id;
// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "数据构建",
    desc: "无码化应用搭建，弹指间即完成数据从无到有到收集和使用",
    url: "http://baidu.com",
    imgUrl:
      "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
  };

  new Vue({
    render: h => {
      return <App customConfig={customConfig} />;
    },
  }).$mount("#app");
} else {
  let wrapDiv = document.getElementsByClassName(wrapId)[0];
  let dataOption = window._appData?.detail;
  let customConfig = dataOption?.customizeDetail || {};
  console.log(customConfig);
  // console.log(wrapId, customConfig, 'customConfig')
  if (wrapDiv) {
    new Vue({
      render: h => {
        return <App customConfig={customConfig} key={new Date().getTime()} />;
      },
    }).$mount(wrapDiv);;
  } else {
    new Vue({
      render: h => {
        return <App customConfig={customConfig} key={new Date().getTime()}/>;
      },
    }).$mount('#app');;
  }
}
