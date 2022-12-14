<template>
  <div class="liuChen-page">
    <div class="leftTree">
      <div class="plantAdd">
        <div class="planTitleLeft">
          <img class="planImg" src="../../pluginTemp/images/Category.png" alt="">
          <span class="planTitle">计划列表</span>
        </div>
        <div class="addIcon" @click="addPalnt">＋</div>
      </div>
      <el-menu
        v-if="plantList.length > 0"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            
            <span>导航一</span>
          </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
      <div v-else class="emptyBox">
        <img class="emptyIcon" src="../../pluginTemp/images/emptyIcon.png" alt="">
        <span>尚未创建计划</span>
      </div>
    </div>
    <div class="rightConcent">
      <component :is="componentType" :dataSource="{}" :componentType="changeComponentType"/>
    </div>
    <el-drawer
      ref="planDrawer"
      custom-class="planDrawer"
      size="30%"
      :visible.sync="planDrawer"
      label-position="top"
      :show-close="false"
      direction="rtl">
      <template slot="title">
        <span class="drawerTitle">计划信息</span>
        <el-button type="primary" @click="planSbumit()">提交</el-button>
      </template>
      <div class="drawer_content">
        <el-form :model="planForm" :rules="rules" ref="planForm" size="small">
          <el-form-item label="申报人：" :label-width="formLabelWidth" :clearable="true" :readonly="true" prop="reportMember">
            <el-input v-model="planForm.reportMember" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="申报单位：" :label-width="formLabelWidth" prop="reportUnit">
            <el-select v-model="planForm.reportUnit" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申报子单位：" :label-width="formLabelWidth" prop="secondUnit">
            <el-select v-model="planForm.secondUnit" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申报时间：" :label-width="formLabelWidth" prop="reportDate">
            <el-date-picker
              v-model="planForm.reportDate"
              format="yyyy-MM-DD"
              type="date"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划类型：" :label-width="formLabelWidth" prop="reportType">
            <el-select v-model="planForm.reportType" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="质量记录号：" :label-width="formLabelWidth" prop="reportNum">
            <el-input v-model="planForm.reportNum" autocomplete="off" placeholder="请输入" :clearable="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Vue from "vue";
import eventActionDefine from "./msgCompConfig";
import EmptyRep from "./childRep/emptyRep";
import { Menu, MenuItem, Submenu, Drawer, Form, FormItem, Button, DatePicker} from "element-ui";

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);

export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  components: {
    EmptyRep
  },
  // computed: {
  //   componentType: function () {
  //     return "EmptyRep";
  //   },
  // },
  data() { 
    let currentUser = window?.currentUser || {};
    return {
      currentUser,
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      childConfig: {},
      componentType: "EmptyRep",
      plantList: [],
      planDrawer: false,
      formLabelWidth: "80",
      planForm: {
        reportMember: '',
        reportUnit: '',
        secondUnit: '',
        reportDate: new Date(),
        reportType: '',
        reportNum: '' 
      },
      rules: {
        reportMember: [
          { required: true, message: '请输入申报人', trigger: 'blur' }
        ],
        reportUnit: [
          { required: true, message: '请输入申报单位', trigger: 'change' }
        ],
        secondUnit: [
          { required: true, message: '请输入申报子单元', trigger: 'change' }
        ],
        reportDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        reportNum: [
          { required: true, message: '请输入质量记录号', trigger: 'blur' }
        ],
        reportType: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
      }
    };
  },
  mounted() {
    console.log('currentUser', this.currentUser);
    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  },
  methods: {  
    // 展开菜单栏
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    // 关闭菜单栏
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 新增 
    addPalnt() {
      this.planDrawer = true;
    },
    // 计划提交
    planSbumit(){
      this.$refs.planDrawer.closeDrawer()
    },
    // async inputChange(e) {
    //   this.data = e;
    //   let { formConfig, component, onChange } = this.customConfig;
    //   await window.eventCenter.triggerEventNew({
    //     objectId: formConfig?.id,
    //     componentId: component.id,
    //     type: "report",
    //     event: "change",
    //     payload: {
    //       value: e,
    //     },
    //   });
    //   onChange(e);
    // },
    // 切换组件
    changeComponentType(comName) {
      this.componentType = comName;
    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    do_EventCenter_setValue({ value }) {
      this.data = value;
    },
    Event_Center_getName() {
      return this.data;
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
  },
};
</script>

<style lang="less" scoped>
.liuChen-page {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #e7edef;
  .leftTree {
    padding: 24px 16px 0 16px;
    width: 248px;
    height: 100%;
    background-color: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
    .plantAdd {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 24px;
      .planTitleLeft {
        display: flex;
        align-items: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        height: 24px;
        color: #373A55;
        .planImg {
          margin-right: 5px;
          width: 20px;
          height: 20px;
        }
        .planTitle {
          width: 64px;
        }
      }
      .addIcon {
        cursor: pointer;
        color: #50536a;
        font-size: 20px;
        width: 23px;
        height: 23px;
        border: 1px solid #dfe1e8;
        line-height: 19px;
        text-align: center;
        border-radius: 50%;
      }
    }
    .el-menu-vertical-demo {
      margin-top: 10px;
    }
    .emptyBox {
      margin-top: 50px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: center;
      color: #959CA6;
      .emptyIcon {
        margin-bottom: 10px;
        height: 28px;
        width: 26px;
      }
    }
  }
  .rightConcent {
    display: flex;
    flex: 1;
    background: pink;
  }
  /deep/ .el-drawer__wrapper{
    .planDrawer {
      margin: 10px !important;
      border-radius: 6px !important;
      height: calc(100% - 20px) !important;
      .el-drawer__header {
        margin-bottom: 0 !important;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebebeb;
      }
      .el-drawer__body {
        padding: 15px !important;
        .drawer_content {
          .el-select {
            width: 100% !important;
          }
          .el-date-editor--date {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>