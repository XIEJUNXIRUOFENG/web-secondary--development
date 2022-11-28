<template>
   <div class="outermost">
      <!-- 标题 -->
      <div class="page_title">图片</div>
      <!-- 图片区域 -->
      <div class="page_content">
         <el-row :gutter="24">
            <el-col class="image_box" :span="4" v-for="(item, index) in imgDataList" :key="index">
               <div class="image_position">
                  <el-image :src="item.url" lazy :preview-src-list="imgShowList"></el-image>
                  <div class="image_title">{{ item.name }}</div>
               </div>
            </el-col>
         </el-row>
      </div>
   </div>
</template>

<script>
// 引入逻辑控制
import eventActionDefine from "./components/msgCompConfig";
// 引入公共封装方法
import utils from "@/utils";
// 引入CSS文件
import "./index.less";

import { queryAssetById } from "./api/asset";

// 按需引入
import qs from "querystringify";
// import $ from "jquery";

export default {
   name: "App",

   props: {
      customConfig: Object,
      sysVariables: Array,
      appVariables: Array,
   },

   data() {
      return {
         // 图片数据
         imgDataList: [],
         // 图片预览数据
         imgShowList: [],
      };
   },

   mounted() {
      this.getImgData();
   },

   methods: {
      // 数据格式转换
      translatePlatformDataToJsonArray(originTableData) {
         let originTableHeader = originTableData.data[0];
         let tableHeader = [];
         originTableHeader.forEach((item) => {
            tableHeader.push(item.col_name);
         });
         let tableBody = originTableData.data[1];
         let tableData = [];
         tableBody.forEach((tableItem) => {
            let temp = {};
            tableItem.forEach((item, index) => {
               temp[tableHeader[index]] = item;
            });
            tableData.push(temp);
         });
         return tableData;
      },

      // 获取照片墙数据
      getImgData() {
         let assetId = this.customConfig["资产Id"];
         let assetField = this.customConfig["资产字段"];
         let primaryField = this.customConfig["主键字段"];

         let search = qs.parse(window.location.search);
         let primaryId = search[primaryField];

         queryAssetById(assetId).then((res) => {
            let resData = this.translatePlatformDataToJsonArray(res);
            let imageData = [];
            resData.forEach((item) => {
               if (item[primaryField] == primaryId) {
                  if (item[assetField]) {
                     imageData = JSON.parse(item[assetField]);
                  }
               }
            });

            let showList = [];
            imageData.forEach((item) => {
               showList.push(item.url);
            });

            this.imgShowList = showList;
            this.imgDataList = imageData;
         });
      },

      // 注册组件名
      Event_Center_getName() {
         return "组件名称";
      },
   },
   // 注销页面
   destroyed() {
      window.componentCenter?.removeInstance(this.customConfig?.componentId);
   },
};
</script>
