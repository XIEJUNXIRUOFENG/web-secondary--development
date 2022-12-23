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
  let temp = [{ "applicant": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "applicant_date": 1671766836291, "applicant_unit": "310", "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "4cd6b884e1b24123b596bae17709b5bc", "estimate_amount_project_cost": 11.1, "last_modifier": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "last_modify_time": 1671766836291, "mode_type": "Plan", "plan_name": "南炼2022-10工程计划表", "plan_number": "2022-310D05", "plan_type": "大修单项", "quality_record_number": "NL/QR-PD-06", "subunit": "", "tasks": [{ "associated_devices": "13#罐", "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "2f11860ac531401294057cbc0c9d1f29", "file": "[]", "function_area": "白油罐区", "mode_type": "Task", "parent_id": "4cd6b884e1b24123b596bae17709b5bc", "procedures": [{ "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "5a6e5203ff5a4d86ab358d028db84df6", "mode_type": "Procedure", "parent_id": "2f11860ac531401294057cbc0c9d1f29", "process_name": "基础浇筑", "steps": [{ "data_id": "8707b9ed3b144fbdb31cdd9027d4bc85", "mode_type": "Step", "parent_id": "5a6e5203ff5a4d86ab358d028db84df6", "process_desc": "C15混凝土浇筑", "quantity_engineering_quantity": 2, "unit_engineering_quantity": "ca5f428c5fb94bd5af366a72f3f70f9f" }, { "data_id": "ec9e22d84b724162975a41d956187176", "mode_type": "Step", "parent_id": "5a6e5203ff5a4d86ab358d028db84df6", "process_desc": "支模550*550*800", "quantity_engineering_quantity": 8, "unit_engineering_quantity": "3c605ae8650248cda4298ed85301e059" }] }, { "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "bfd42e357928484ead2bd638ba433330", "materials": [{ "auxiliary_unit": "m³", "data_id": "5334ff487c3045a4950d042972043129", "main_unit": "吨", "material_code": "001", "material_demand": 12, "material_name": "油漆", "material_purchase_auxiliary": 12, "material_purchase_main": 0.012, "mode_type": "Material", "parent_id": "bfd42e357928484ead2bd638ba433330", "whether_workshop_supply": "0" }], "mode_type": "Procedure", "parent_id": "2f11860ac531401294057cbc0c9d1f29", "process_name": "管架防腐", "steps": [{ "data_id": "2a7679afd902497d9ac242db91b888ee", "mode_type": "Step", "parent_id": "bfd42e357928484ead2bd638ba433330", "process_desc": "聚氨酯蓝色面漆两遍", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "" }, { "data_id": "093af44f7c8e4b0cbd2bf9f684e500a5", "mode_type": "Step", "parent_id": "bfd42e357928484ead2bd638ba433330", "process_desc": "环氧铁红底漆两遍", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "" }, { "data_id": "e0cca7e2f17d4cc883b29197163b7906", "mode_type": "Step", "parent_id": "bfd42e357928484ead2bd638ba433330", "process_desc": "除轻锈（St2）", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "" }] }], "project_name": "装置东界区外部管廊龙门架管架防腐及底部防护水泥浇筑", "project_type": "A", "remark": "先做施工方案审批" }, { "associated_devices": "13#罐", "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "5683ce81ec3a4415a4a03d0308ce7e24", "file": "[]", "function_area": "白油罐区", "mode_type": "Task", "parent_id": "4cd6b884e1b24123b596bae17709b5bc", "procedures": [{ "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "eabd1f35c7904fd785cecd2af1e1110b", "mode_type": "Procedure", "parent_id": "5683ce81ec3a4415a4a03d0308ce7e24", "process_name": "原可燃气报警仪支座拆除" }, { "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "fb46872b57fd4661a6cff4f0e1392097", "materials": [{ "auxiliary_unit": "m³", "data_id": "07f985301c9942f0944379f4cccdaad7", "main_unit": "吨", "material_code": "001", "material_demand": 4, "material_name": "油漆", "material_purchase_auxiliary": 4, "material_purchase_main": 0.004, "mode_type": "Material", "parent_id": "fb46872b57fd4661a6cff4f0e1392097", "whether_workshop_supply": "1" }], "mode_type": "Procedure", "parent_id": "5683ce81ec3a4415a4a03d0308ce7e24", "process_name": "新制支座防腐刷漆", "steps": [{ "data_id": "04c5f68b723349f5bc85b4a3ba8c6563", "mode_type": "Step", "parent_id": "fb46872b57fd4661a6cff4f0e1392097", "process_desc": "所有金属表面手工动力工具除锈，St2", "quantity_engineering_quantity": 1, "unit_engineering_quantity": "ca5f428c5fb94bd5af366a72f3f70f9f" }, { "data_id": "d79e7115390249ae8a5e2606b0e43e85", "mode_type": "Step", "parent_id": "fb46872b57fd4661a6cff4f0e1392097", "process_desc": "环氧铁红底漆两遍，聚氨酯中酞蓝面漆", "quantity_engineering_quantity": 1, "unit_engineering_quantity": "ca5f428c5fb94bd5af366a72f3f70f9f" }] }, { "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "b272a7f745884e3c8a3f7c14e9c60550", "mode_type": "Procedure", "parent_id": "5683ce81ec3a4415a4a03d0308ce7e24", "process_name": "新可燃气报警仪支座制安", "steps": [{ "data_id": "bff643d893a4496d86f72be0da659ee8", "mode_type": "Step", "parent_id": "b272a7f745884e3c8a3f7c14e9c60550", "process_desc": "每个钢板开四个孔，用M10膨胀螺栓固定", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "" }, { "data_id": "1104653c2453401c81238384711d533d", "mode_type": "Step", "parent_id": "b272a7f745884e3c8a3f7c14e9c60550", "process_desc": "Q235A钢板制作成200*200钢板", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "" }, { "data_id": "fb2188d3a15b4afdb8699c3c77942d51", "mode_type": "Step", "parent_id": "b272a7f745884e3c8a3f7c14e9c60550", "process_desc": "长700mmDN50镀锌钢管焊接于钢板上", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "" }] }], "project_name": "可燃气报警仪支座更换", "project_type": "A", "remark": "详见图纸21457DD" }, { "associated_devices": "炼红2号", "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "bc15d164c4ff4b4da2acf08f87d2721e", "file": "[]", "function_area": "001-06#罐区", "mode_type": "Task", "parent_id": "4cd6b884e1b24123b596bae17709b5bc", "procedures": [{ "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "e98bfaacef1643e5827adfe621e0642f", "mode_type": "Procedure", "parent_id": "bc15d164c4ff4b4da2acf08f87d2721e", "process_name": "放料球阀安装" }, { "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "697a7f2b6675478abeef50d3f498d6ff", "mode_type": "Procedure", "parent_id": "bc15d164c4ff4b4da2acf08f87d2721e", "process_name": "起重配合", "steps": [{ "data_id": "ce70ee5e2d524e29a8be9d7c6549e09a", "mode_type": "Step", "parent_id": "697a7f2b6675478abeef50d3f498d6ff", "process_desc": "25t吊机配合", "quantity_engineering_quantity": 0, "unit_engineering_quantity": "901f686785654a2a9de57b41b62f56a1" }] }], "project_name": "新放料球阀更换安装配合", "project_type": "A" }, { "associated_devices": "炼红2号", "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "144557ef108947d8848641f842884c67", "file": "[]", "function_area": "白油罐区", "mode_type": "Task", "parent_id": "4cd6b884e1b24123b596bae17709b5bc", "procedures": [{ "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "42a150e75cf64dfdb90e5e2ce34a460c", "mode_type": "Procedure", "parent_id": "144557ef108947d8848641f842884c67", "process_name": "Ⅱ套动力检修箱更换", "steps": [{ "data_id": "40d3cf4574cc4ece8f88ba1187fc4601", "mode_type": "Step", "parent_id": "42a150e75cf64dfdb90e5e2ce34a460c", "process_desc": "新防爆动力检修箱安装，电缆过马路段穿DN150保护套管10m", "quantity_engineering_quantity": 1, "unit_engineering_quantity": "901f686785654a2a9de57b41b62f56a1" }, { "data_id": "df181332b3ad451583751f2e38ea4302", "mode_type": "Step", "parent_id": "42a150e75cf64dfdb90e5e2ce34a460c", "process_desc": "原动力检修箱拆除", "quantity_engineering_quantity": 1, "unit_engineering_quantity": "901f686785654a2a9de57b41b62f56a1" }] }, { "create_member": "15acb57c-e2a8-428e-93cd-cda22fa3ca7c", "create_time": 1671766836291, "data_id": "cdc7352ea587459a9b78f72a8b3fe950", "mode_type": "Procedure", "parent_id": "144557ef108947d8848641f842884c67", "process_name": "Ⅱ套动力检修箱更换", "steps": [{ "data_id": "f4782e2cfe4c42848102924f8690f724", "mode_type": "Step", "parent_id": "cdc7352ea587459a9b78f72a8b3fe950", "process_desc": "原动力检修箱拆除", "quantity_engineering_quantity": 1, "unit_engineering_quantity": "901f686785654a2a9de57b41b62f56a1" }, { "data_id": "3cf2a8b02e4744c1b36c0e4bcbef462d", "mode_type": "Step", "parent_id": "cdc7352ea587459a9b78f72a8b3fe950", "process_desc": "新防爆动力检修箱安装，电缆过马路段穿DN150保护套管10m", "quantity_engineering_quantity": 1, "unit_engineering_quantity": "901f686785654a2a9de57b41b62f56a1" }] }], "project_name": "Ⅱ套大修：装置动力检修箱更换为防爆动力检修箱", "project_type": "A", "remark": "该子项工作要求1天完成更换", "requirement_for_construction": "SHS06004.1" }] }]
  const customConfig = {
    componentId: "111",
    data: JSON.stringify(temp),
    // data: '',
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




