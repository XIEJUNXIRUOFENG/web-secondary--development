<template>
  <div class="secondary_bigscreen" :style="{
    width: '100%',
    height: '100%',
  }" ref="secondary_bigscreen" :id="id">
    <video ref="videoLive" id="videoLive" poster="" class="centeredVideo" muted controls @click="mpegtsClick"></video>

  </div>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import { queryStartVideo, queryUserVideo } from "@/api/asset.js";
import flvjs from 'flv.js'
import mpegtFlvs from "mpegts.js"
export default {
  name: "Main",
  components: {},
  data() {
    return {
      id: "",
      videoItems: {
        token: '',
        url: ''
      },
      videoLive: {}, // video标签
      mpegtsPlayer: null, // flv对象
      flvPlayer: null,
    };
  },
  props: {
    pubSub: Object,
    data: Object | Array,
    componentId: String,
    configuration: Object,
    options: Object
  },
  mounted() {
    this.pubSub &&
      this.pubSub.subscribe(
        "updateChart" + this.componentId,
        (data) => {
          console.log(data);
        }
      );
    window.componentCenter?.register &&
      window.componentCenter.register(
        this.componentId,
        "comp",
        this,
        MsgCompConfig
      );
    this.updateProcess && this.updateProcess();
    let id = this.options?.externalVariables?.id;
    this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.handelClick('1003625$1$0$0')
  },
  methods: {
    //查询实时视频  
    handelClick(id) {
      // queryUserVideo().then(res => {
      //   console.log(res, '=====');
      // })

      queryUserVideo().then(res => {

        this.videoItems = res.data
        this.initMpegts()
        // this.createVideo()
      }).catch(err => {
        this.videoItems = {
          token: '',
          url: ''
        }
        this.videoLive = {};
        this.mpegtsPlayer = null;
      })
    },
    initMpegts() {

      if (mpegtFlvs.isSupported()) {

        this.videoLive = {};
        this.mpegtsPlayer = null;
        // this.videoLive = this.$refs.videoLive;
        this.videoLive = document.getElementById('videoLive')
        mpegtFlvs.LoggingControl.forceGlobalTag = true;
        this.mpegtsPlayer = mpegtFlvs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasAudio: false,
            url: this.videoItems.url
            // url: 'https://rtmp01open.ys7.com:9188/v3/openlive/F97063184_1_1.flv?expire=1666235559&id=503148537140219904&t=f334f828f357e46aed82f5a6b724681cb5feaec419335b248f3d6c149b4513df&ev=100'
          },
          {
            autoCleanupSourceBuffer: true,// 是否自动清理缓存
            // fixAudioTimestampGap: true
          }
        )

        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()

        if (this.videoLive.paused === true) {
          this.mpegtsPlayer.unload()
          this.mpegtsPlayer.detachMediaElement()
        }

        // 监听错误事件
        this.mpegtsPlayer.on(mpegtFlvs.Events.ERROR, (err, errdet) => {
          // 参数 err 是一级异常，errdet 是二级异常
          if (err == mpegtFlvs.ErrorTypes.MEDIA_ERROR) {
            console.log('媒体错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if (errdet == mpegtFlvs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log('媒体格式不支持')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if (err == mpegtFlvs.ErrorTypes.NETWORK_ERROR) {
            console.log('网络错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if (errdet == mpegtFlvs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log('http状态码异常')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if (err == mpegtFlvs.ErrorTypes.OTHER_ERROR) {
            console.log('其他异常：', errdet)
            if (this.mpegtsPlayer) this.mpegts_destroy();
          }
        })
      }
    },
    // 销毁flv
    mpegts_destroy() {
      if (this.videoLive.paused === false) {
        this.mpegtsPlayer.pause();
        this.mpegtsPlayer.unload();
        this.mpegtsPlayer.detachMediaElement();
      }
      if (this.mpegtsPlayer != null) this.mpegtsPlayer.destroy();
      this.mpegtsPlayer = null;
      this.videoLive = {};
    },
    mpegtsClick() {

      if (this.videoLive.paused === true) {
        // 已断流，重新拉流播放

        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()
      } else {

        this.mpegtsPlayer.unload()
        this.mpegtsPlayer.detachMediaElement()
      }
    },


    Event_Center_getName() {
      return this.id;
    }
  }
};
</script>

<style lang="less" scoped>
.centeredVideo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  // height: 93%;
  background: #333;
}

video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-current-time-display {
  display: none;
}
</style>