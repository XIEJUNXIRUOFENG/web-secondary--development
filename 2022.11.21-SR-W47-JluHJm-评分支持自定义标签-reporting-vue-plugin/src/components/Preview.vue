<template>
  <div class="rateBox">
    <el-rate v-model="rateLeve" :show-text="true" :texts="rateText" disabled></el-rate>
    <div class="tagsBox">
      <span class="tagItem" v-for="item in dataSource" :key="item.key" :class="{'activeTag': item.activeKey}">{{item.text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Preview",
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
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      // console.log('详情',this.configuration);
      this.rateText = this.configuration.rateTitle.split(",")
      this.rateTags = this.configuration.rateTags ? JSON.parse(this.configuration.rateTags) : [];
      this.data = JSON.parse(this.data);
      this.rateLeve = this.data.rate;
      this.selectRateTags = this.data.rateTags;
      this.dataSource = JSON.parse(JSON.stringify(this.rateTags[this.rateLeve - 1]));

      this.selectTags = this.selectRateTags.map(x=>{
        return x.key
      });

      this.dataSource.forEach(x=>{
        let { key } = x
        let indexs = this.selectTags.indexOf(key)
        if (indexs != -1) {
          x.activeKey = true
        }
      })
      // console.log('this.data',this.data);
      // console.log('详情页',this.rateTags);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
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

