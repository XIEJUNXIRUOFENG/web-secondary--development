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
  name: "Add",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      rateText: [],
      rateLeve: null,
      dataSource: [],
      selectTags: [],
      selectRateTags: [],
      rateTags: []
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
      this.rateTags = this.configuration.rateTags ? JSON.parse(this.configuration.rateTags) : [];
      this.rateText = this.configuration?.rateTitle.split(",")
      // console.log('addthis.rateTags',this.rateTags);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  },
  methods: {
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
        this.selectRateTags.push(this.dataSource[key])
      }else {
        this.dataSource[key].activeKey = false;
        this.selectTags.splice(pushKey, 1);
        this.selectRateTags.splice(pushKey,1)
      }
      let params = {
        rate: this.rateLeve,
        rateTags: this.selectRateTags
      }
      // console.log(params);
      this.rateChange(params);
    },
    async rateChange(val) {
      this.data = val;
      let selectTag = JSON.stringify(val)
      let { formConfig, component, onChange } = this.customConfig;
      // await window.eventCenter.triggerEventNew({
      //   objectId: formConfig?.id,
      //   componentId: component.id,
      //   type: "report",
      //   event: "change",
      //   payload: {
      //     value: selectTag,
      //   },
      // });
      // console.log(selectTag);
      onChange(selectTag);
    },
    // Event_Center_getName() {
    //   let { formConfig, component } = this.customConfig;
    //   return `${formConfig?.form_name}-${component.columnStyle.title}`;
    // },
    do_EventCenter_setValue({ value }) {
      // this.data = value;
    },
    Event_Center_getName() {
      // return this.data;
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
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
