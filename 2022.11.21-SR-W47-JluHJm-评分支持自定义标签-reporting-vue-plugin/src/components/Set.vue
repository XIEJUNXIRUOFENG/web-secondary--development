<template>
  <div class="rateBox">
    <el-rate v-model="rateLeve" :show-text="true" :texts="rateText" @change="rateClick"></el-rate>
    <div class="tagsBox">
      <span class="tagItem" v-for="item in dataSource" :key="item.key" :class="{'activeTag': item.activeKey}" @click="tagClick(item.key)">{{item.text}}</span>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
export default {
  name: "Set",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      rateList: [],
      rateText: [],
      rateLeve: null,
      dataSource: [],
      selectTags: [],
      rateTags: []
    };
  },
  methods: {
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    rateClick(e) {
      // console.log(e);
      let key = e - 1;
      this.selectTags = [];
      this.dataSource = JSON.parse(JSON.stringify(this.rateTags[key]));
    },
    tagClick(key) {
      // console.log(key);
      this.dataSource[key].activeKey = true;
      let pushKey = this.selectTags.indexOf(key);
      // console.log(pushKey);
      if (pushKey == -1) {
        this.selectTags.push(key);
      }else {
        this.dataSource[key].activeKey = false;
        this.selectTags.splice(pushKey, 1);
      }
      // console.log(this.selectTags);
    }
  },
  mounted() {
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.rateTags = this.configuration.rateTags ? JSON.parse(this.configuration.rateTags) : [];
      this.rateText = this.configuration.rateTitle ? this.configuration.rateTitle.split(",") : [];
      // console.log('set',this.rateTags);
      // console.log('set',this.rateText);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    window?.componentCenter?.register(initId, "comp", this, eventActionDefine);
  },
  destroyed() {
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    window?.componentCenter?.removeInstance(initId);
  },
};
</script>

<style lang="less" scoped>
.rateBox {
  user-select: none;
  width: 100%;
  height: 100%;
  /deep/.el-rate {
    display: flex;
    justify-content: center;
    padding-top: 30px;
    position: relative;
    -webkit-tap-highlight-color: transparent !important;
    .el-rate__icon {
      font-size: 40px;
    }
    .el-rate__text {
      position: absolute;
      top: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
  .tagsBox {
    margin-top: 40px;
    width: 100%;
    .tagItem {
      display: inline-block;
      padding: 6px 12px;
      font-size: 16px;
      color: #3570e5;
      margin: 6px;
      border: 1px solid #e8e9ed;
      border-radius: 30px;
      // white-space: nowrap;
    }
    .activeTag {
      color: #ffffff;
      border-color: rgba(64, 158, 255, 0.6);
      background: #3570e5;
    }
  }
}
</style>