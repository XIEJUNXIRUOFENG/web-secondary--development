<template>
  <div class="live_box">
    <div v-if="playerShow" class="video_box">
      <video ref="videoPlayer" :id="videoUrl.deviceId" poster="" class="centeredVideo" muted controls></video>
      <span class="videName">{{videoUrl.deviceName}}</span>
    </div>
    <div v-else class="outLine"><i class="el-icon-warning-outline"></i></div>
  </div>
</template>

<script>
import mpegtFlvs from "mpegts.js"
export default {
  name: "player",
  props: {
    videoUrl: {
      type: Object,
      default: ()=>{}
    },
    isActive: {
      type: Number,
      default: 0
    },
    livengh: {
      type: Number,
      default: 0
    },
  },
  data: function () {
    return {
      // 直播数据
      videoItems: {
        current: 0,
        deviceId: "",
        deviceName: "",
        expireTime: "",
        protocolCode: "",
        url: "",
      },
      videoLive: {}, // video标签
      mpegtsPlayer: null, // mpegts对象
      playerShow: false
    };
  },
  watch: {
    isActive(newVal, OldVal){
      if (this.videoUrl.url == "") return;
      let nextNum = 0;
        // console.log('this.livengh===================',this.livengh);
      if (newVal == this.livengh) {
        nextNum = 0;
      } else {
        nextNum = newVal + 1;
      }
      if (this.videoUrl.current == newVal){
        // console.log('this.videoUrl.current=============================',this.videoUrl.current);
        // 播放
        this.mpegtsPlayer.play()
      }else if (this.videoUrl.current == nextNum){
        // 拉流
        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
      }else if (this.videoUrl.current == OldVal){
        setTimeout(() => {
          // 断流
          this.mpegtsPlayer.unload()
          this.mpegtsPlayer.detachMediaElement()
        }, 600);
      }
    }
  },
  created () {
    if (this.videoUrl.url != "") {
      this.playerShow = true;
    }
  },
  mounted() {
    this.setSrc();
  },
  methods: {
    // 初始化直播窗口
    initMpegts(){
      if (mpegtFlvs.isSupported()) {
        this.videoLive = {};
        this.mpegtsPlayer = null;
        // this.videoLive = this.$refs.videoPlayer;
        this.videoLive = document.getElementById(this.videoUrl.deviceId)
        // console.log('this.videoLive',this.videoLive);
        mpegtFlvs.LoggingControl.forceGlobalTag = true;
        this.mpegtsPlayer = mpegtFlvs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            url: this.videoItems.url
          },
          {
            enableWorker: true, // 是否多线程工作
            enableStashBuffer: false, // 是否启用缓存
            stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            autoCleanupSourceBuffer: true // 是否自动清理缓存
          }
        )
        
        // this.mpegtsPlayer.attachMediaElement(this.videoLive)
        // this.mpegtsPlayer.load()
        // this.mpegtsPlayer.play()

        if (this.videoUrl.current == this.isActive || this.videoUrl.current == this.isActive + 1) {
          this.mpegtsPlayer.attachMediaElement(this.videoLive)
          this.mpegtsPlayer.load()
          this.mpegtsPlayer.play()
        } 
        
        // 监听错误事件
        this.mpegtsPlayer.on(mpegtFlvs.Events.ERROR, (err, errdet) => {
          // 参数 err 是一级异常，errdet 是二级异常
          this.playerShow = false;
          if (err == mpegtFlvs.ErrorTypes.MEDIA_ERROR) {
            console.log('媒体错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if(errdet == mpegtFlvs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log('媒体格式不支持')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if (err == mpegtFlvs.ErrorTypes.NETWORK_ERROR) {
            console.log('网络错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if(errdet == mpegtFlvs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log('http状态码异常')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if(err == mpegtFlvs.ErrorTypes.OTHER_ERROR) {
            console.log('其他异常：', errdet)
            if (this.mpegtsPlayer) this.mpegts_destroy();
          }
        })
      }
    },
    setSrc(){
      if(this.videoUrl){
        this.videoItems = this.videoUrl;
        this.initMpegts();
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
    mpegtsClick(){
      if (this.videoLive.paused === true) {
        // 已断流，重新拉流
        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()
      }else {
        // 断流
        this.mpegtsPlayer.unload()
        this.mpegtsPlayer.detachMediaElement()
      }
    },
  },
};
</script>

<style lang="less" scoped>
.live_box {
  width: 100%;
  height: 100%;
  background: #333;

  .video_box {
    position: relative;
    width: 100%;
    height: 100%;

    .centeredVideo {
      display: block;
      width: 100%;
      height: 100%;
      background: #333;
      pointer-events: none;
    }
    /* 控件 */
    video::-webkit-media-controls-enclosure {
      display: none;
    }
    /* 进度条 */
    video::-webkit-media-controls-timeline {
      display: none;
    }
    video::-webkit-media-controls-current-time-display {
      display: none;
    }
    /* 音量按钮 */
    // video::-webkit-media-controls-mute-button {
    //   display: none;
    // }
    /* 音量的控制条 */
    // video::-webkit-media-controls-volume-slider {
    //   display: none;
    // }
    /*  播放按钮 */
    video::-webkit-media-controls-play-button {
      display: none;
    }
    video::-webkit-media-controls-toggle-closed-captions-button {
      display: none;
    }
    .videName {
      position: absolute;
      font-size: 20px;
      font-weight: 700;
      bottom: 30px;
      left: 10px;
      color: #fff;
    }
  }

  .outLine {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #333;

    .el-icon-warning-outline {
      font-size: 50px;
    }
  }
}
</style>
