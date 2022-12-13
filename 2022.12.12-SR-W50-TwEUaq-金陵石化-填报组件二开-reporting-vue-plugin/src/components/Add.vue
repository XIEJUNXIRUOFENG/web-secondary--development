<template>
  <div class="liuChen-page">
    <div class="leftTree">
      <div class="plantAdd">
        <div class="planTitleLeft">
          <img class="planImg" src="../../pluginTemp/images/Category.png" alt="">
          <span class="planTitle">计划列表</span>
        </div>
        <div class="addIcon">＋</div>
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
  </div>
</template>

<script>
import Vue from "vue";
import eventActionDefine from "./msgCompConfig";
import EmptyRep from "./childRep/emptyRep";
import { Menu, MenuItem, Submenu } from "element-ui";

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);

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
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      childConfig: {},
      componentType: "EmptyRep",
      plantList: []
    };
  },
  mounted() {
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
    async inputChange(e) {
      this.data = e;
      let { formConfig, component, onChange } = this.customConfig;
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "change",
        payload: {
          value: e,
        },
      });
      onChange(e);
    },
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
}
</style>