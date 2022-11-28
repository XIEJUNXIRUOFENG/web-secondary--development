<template>
   <div class="outermost">
      <!-- 标题 -->
      <div class="page_title">视频</div>
      <!-- 视频区域 -->
      <div class="page_content">
         <el-card class="video_box" v-for="(item, index) in videoDataList" :key="index">
            <video :src="item.url" :id="`video_${index}`" />
            <!-- <video src="./assets/video_2000764912c4f1_mark.mp4" :id="`video_${index}`" /> -->
            <!-- 播放按钮 -->
            <div class="video_mask">
               <img v-if="!item.isPlay" src="./assets/playIcon.png" @click="videoPlay(item, index)" />
               <img v-if="item.isPlay" src="./assets/suspend.png" @click="videoSuspend(item, index)" />
            </div>
            <!-- 视频信息 -->
            <div class="video_info">
               <div class="info_title">{{ item.name }}</div>
            </div>
         </el-card>
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
         videoDataList: [],
      };
   },

   mounted() {
      this.getVideoData();
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
      getVideoData() {
         let assetId = this.customConfig["资产Id"];
         let assetField = this.customConfig["资产字段"];
         let primaryField = this.customConfig["主键字段"];

         let search = qs.parse(window.location.search);
         let primaryId = search[primaryField];

         queryAssetById(assetId).then((res) => {
            let resData = this.translatePlatformDataToJsonArray(res);

            let videoData = [];
            resData.forEach((item) => {
               if (item[primaryField] == primaryId) {
                  if (item[assetField]) {
                     videoData = JSON.parse(item[assetField]);
                  }
               }
            });

            this.videoDataList = videoData;
         });
      },

      // 播放视频
      videoPlay(row, index) {
         row.isPlay = true;
         let ele = document.getElementById(`video_${index}`);
         if (ele.requestFullscreen) {
            ele.requestFullscreen();
            ele.play();
         } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
            ele.play();
         } else if (ele.webkitRequestFullScreen) {
            ele.webkitRequestFullScreen();
            ele.play();
         }

         this.$forceUpdate();
      },

      // 暂停播放视频
      videoSuspend(row, index) {
         row.isPlay = false;
         let ele = document.getElementById(`video_${index}`);
         ele.pause();

         this.$forceUpdate();
      },

      // 获取视频信息
      getVidDur(vedio, index) {
         this.$nextTick(() => {
            vedio.length = this.formatSeconds(document.getElementById(`video_${index}`).duration);
            this.$forceUpdate();
         });
      },

      // 转换时间格式
      formatSeconds(value) {
         let secondTime = parseInt(value); // 秒
         let minuteTime = 0; // 分
         let hourTime = 0;
         if (secondTime > 60) {
            minuteTime = parseInt(secondTime / 60);
            secondTime = parseInt(secondTime % 60);
            if (minuteTime > 60) {
               hourTime = parseInt(minuteTime / 60);
               minuteTime = parseInt(minuteTime % 60);
            }
         }
         let result = "" + parseInt(secondTime);

         if (parseInt(secondTime) < 10) {
            result = "0" + parseInt(secondTime);
         }

         if (minuteTime > 0) {
            if (parseInt(minuteTime) < 10) {
               result = "0" + parseInt(minuteTime) + ":" + result;
            } else {
               result = "" + parseInt(minuteTime) + ":" + result;
            }
         }
         if (hourTime > 0) {
            if (parseInt(minuteTime) < 10) {
               result = "0" + parseInt(hourTime) + ":" + result;
            } else {
               result = "" + parseInt(hourTime) + ":" + result;
            }
         }

         console.log("result", result);

         return result;
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
