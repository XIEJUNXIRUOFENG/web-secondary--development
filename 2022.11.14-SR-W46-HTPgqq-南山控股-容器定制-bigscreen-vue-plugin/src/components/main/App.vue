<template>
   <iframe :style="{ width: '100%', height: '100%' }" ref="secondary_bigscreen" :id="id" :src="defaultUrl" frameborder="no"></iframe>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import qs from "querystringify";

import { queryAssetById, queryUserInfo } from "../../api/asset";

export default {
   name: "Main",

   props: {
      pubSub: Object,
      data: Object | Array,
      componentId: String,
      configuration: Object,
      options: Object,
   },

   data() {
      return {
         id: "",
         // 配置项
         configurationForm: {},
         // 资产Id
         assetId: "",
         // 嵌入地址
         defaultUrl: "",
         // 链接字段
         linkField: "",
         // 过滤字段
         filterField: "",
      };
   },

   mounted() {
      this.pubSub &&
         this.pubSub.subscribe("updateChart" + this.componentId, (data) => {
            console.log(data);
         });
      window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
      this.updateProcess && this.updateProcess();
      let id = this.options?.externalVariables?.id;
      this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;

      this.configurationForm = JSON.parse(JSON.stringify(this.configuration));
      this.assetId = this.configuration.assetId;
      this.defaultUrl = this.configuration.defaultUrl;
      this.linkField = this.configuration.linkField;
      this.filterField = this.configuration.filterField;

      this.handleUrl();
   },

   methods: {
      // 处理地址
      handleUrl() {
         let _paramsId = "";
         let _linkUrl = qs.parse(window.location.search);
         // 获取到链接字段
         if (_linkUrl[this.linkField]) {
            _paramsId = _linkUrl[this.linkField];
         } else {
            queryUserInfo()
               .then((res) => {
                  _paramsId = res.data.officeId;
               })
               .catch((err) => {
                  console.log("请求用户信息失败", err);
               });
         }

         // 请求资产
         queryAssetById(this.assetId)
            .then((res) => {
               let _resData = Utils.translatePlatformDataToJsonArray(res);
               // 过滤数据
               let filterRow = _resData.filter((item) => {
                  return item.id == _paramsId;
               });

               if (filterRow[0] && filterRow[0][this.filterField]) {
                  this.defaultUrl = filterRow[0][this.filterField];
               }
            })
            .catch((err) => {
               console.log("请求资产失败", err);
            });
      },

      Event_Center_getName() {
         return this.id;
      },
   },
};
</script>
