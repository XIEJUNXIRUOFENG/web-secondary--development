<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" :style='{ width: "100%", height: `${height ? height + "px" : "100%"}` }' :ref="id" class="two_list2">

    <!-- -->
    <div class="parent_container_two">


      <div class="listClass_two">
        <div class="listClass_tree_two">
          <div class="list_serch">
            <el-input v-model="searchValue"></el-input>
            <button class="btn_serch" @click="searchFn">搜索</button>
          </div>

          <div class="tree_data_main" :style="{ boxShadow: '0 2px 12px 0 rgb(0 0 0 / 10%)' }">
            <div class="tree_title">停车场资源树</div>

            <el-tree :data="dataTree" ref="tree" node-key="id" :props="defaultProps" :filter-node-method="filterNode"
              :default-expand-all="true" :expand-on-click-node="false">

              <div class="custom-tree-node" slot-scope=" { node, data }">
                <span :class="{ test: true, leafNode: node.isLeaf, isopen: !data.switc }"
                  @dblclick.stop="testFn(node, data)" @click.stop="handleNodeClick(data, node)"> {{
                      data.park_name || data.camera_name
                  }}
                </span>

              </div>
            </el-tree>
          </div>

        </div>

      </div>
      <div class="listNode_two">

        <div ref="cardPar" :class="{ card_parent: true, parent_full: fulllScre }">

          <el-row v-for="(item, i) in lunbodata" :key="i" :gutter="fulllScre ? 0 : 20"
            :style="{ height: `${parseInt(100 / col_num)}%` }">
            <el-col v-for="(item2, i2) in  item " :key="i2" :xs="col_size" :sm="col_size" :md="col_size" :lg="col_size"
              :xl="col_size">
              <div class="list_video">
                <div class="video_title">{{ item2.camera_name }}</div>
                <div class="video_main">
                  <video poster="" class="centeredVideo" muted controls @click="mpegtsClick(i, i2)"></video>
                </div>
              </div>
            </el-col>


          </el-row>
        </div>


      </div>
    </div>
    <div class="page_fen">
      <i :class='`el-icon-menu a  ${col_num == 2 ? "active" : null}`' @click="changePageSize(4, 2)"></i>
      <i :class='`el-icon-s-grid a    ${col_num == 3 ? "active" : null}`' @click="changePageSize(9, 3)"></i>

      <div :class="{ gongge: true, active: col_num == 4 }" @click="changePageSize(16, 4)">
        <div class="row_g" v-for="o in 4" :key="o">
          <div class="col_g" v-for="y in 4" :key="y"></div>
        </div>

      </div>
      <svg @click="fullScreenFn" t="1667360319285" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4759" width="30" height="30">
        <path
          d="M285.866667 810.666667H384v42.666666H213.333333v-170.666666h42.666667v98.133333l128-128 29.866667 29.866667-128 128z m494.933333 0l-128-128 29.866667-29.866667 128 128V682.666667h42.666666v170.666666h-170.666666v-42.666666h98.133333zM285.866667 256l128 128-29.866667 29.866667-128-128V384H213.333333V213.333333h170.666667v42.666667H285.866667z m494.933333 0H682.666667V213.333333h170.666666v170.666667h-42.666666V285.866667l-128 128-29.866667-29.866667 128-128z"
          fill="#57a9fb" p-id="4760"></path>
      </svg>
      <el-pagination layout="prev, pager, next, jumper" :total="videoTotal" :current-page="pageNum"
        :page-size="pageSize" @current-change="handleCurrentChange">
      </el-pagination>

    </div>


  </div>
</template>

<script>



import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup, Tree, Row, Col, Card, Dialog, Button, DatePicker, Pagination, Input, Message
} from "element-ui";
import Vue from "vue"
import utils from "@/utils";
import axios from "axios";
import { querySourceTree, queryParkCamera } from "@/api/asset.js";
import $ from "jquery";
import videojs from 'video.js'
import mpegtFlvs from "mpegts.js"
import flvjs from 'flv.js'
import "video.js/dist/video-js.css";
import player from "video.js/es5/player";



Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message;

Vue.use(DatePicker)
Vue.use(Input)
Vue.use(Button)
const tempData = [
  { name: '11', id: '222' },
  { name: '11', id: '222' },
  { name: '11', id: '222' },
  { name: '11', id: '222' },


]
const roleList = window.currentUser?.roleList || ['000001']

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  // components: {
  //   Ckplayer
  // },

  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      }

      let themeColor = theme_global_config["--theme-public-pinPai-color"]
      let textColor = theme_global_config["--theme-public-text-color-1"]
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style")
          document.head.appendChild(this.styleEle)
          this.styleEle.innerText = style
        }
      })
      return {
        themeColor,
        textColor
      }
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      dialogVisible: false,
      currentDate: new Date(),
      //业务代码
      selected: "",
      buttons: [],

      defaultProps: {
        label: 'park_name',

      },
      styleEle: null,
      dateValue: [],
      dataTree: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      treeOnly: [],
      title: '',
      height: this.customConfig.height || '',
      cameraAssetId: this.customConfig.cameraAssetId || '6214a75f-9c10-3175-55d9-8738f78fdbd2',
      treeAssetId: this.customConfig.treeAssetId || '6214a75f-9c10-3175-55d9-8738f78fdbd2',
      parkId: '',
      col_num: 2,//列数
      col_size: 12,//用来控制列数大小
      pageNum: 1,//当前页数
      videoTotal: 5,//总计
      pageSize: 4,//页数大小
      videoLive: {},
      videoList: [],
      searchValue: '',//搜索词
      lunbodata: [],
      closeList: [],
      fulllScre: false,
      timer: null,
      mpegtsPlayer: null, // flv对象

    }
  },
  mounted() {
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    this.catalogueId = this.customConfig.catalogueId
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let { buttons, id } = this.customConfig
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    // this.defaultValue = JSON.parse(buttons).defaultValue;
    let temp = document.querySelector('.two_list2')
    temp.parentNode.style.width = '100%'
    temp.parentNode.style.height = '100%'
    this.catalogueId = Boolean(this.catalogueId) ? this.catalogueId : 'id'
    this.queryTree()

    // this.queryTree(this.catalogueAssetId)
    document.addEventListener('keydown', this.downFn)



    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }

  },
  methods: {
    closeFn() {
      // this.mpegts_destroy()
    },
    //查询列表树 
    queryTree() {
      let roleIds = roleList
      let assetId = this.treeAssetId
      querySourceTree({ roleIds, assetId }).then(res => {

        let a = this.addKey([res.data])

        this.treeOnly = a
        this.dataTree = a

      }).catch(err => { })
    },
    addKey(items) {
      return items.map(item => {
        const result = { ...item, switc: true }
        if (item.children) {
          item.children = item.cameraList ? item.cameraList : item.children
          console.log(item.children)
          result.children = this.addKey(item.children)
        }
        return result
      })
    },
    //查询节点 
    sercLable(items, value) {

      return items.map(item => {
        if (item.park_name.indexOf(value) != -1) {

          return item
        } else {
          if (item.children) {
            return this.sercLable(item.children, value)[0]
          }
        }


      })
    },

    //更改产选数据大小
    changePageSize(pageSize, num) {


      this.col_num = num
      this.col_size = 24 / num
      this.pageSize = pageSize

      if (!this.parkId) return


      let params = {
        roleIds: roleList,
        assetId: this.cameraAssetId,
        parkId: this.parkId,
        pageSize, pageNum: this.pageNum
      }
      this.queryVideo(params)

    },
    //双击
    testFn(node, data) {
      clearTimeout(this.timer); //清除未执行的定时器

      if (!node.isLeaf) return
      if (this.videoLive.length == 0) return


      if (data.switc) { //控制开关
        // this.mpegts_destroy(0)
        this.closeList.push(data.camera_id)


        let indexArr = this.selectIndex(this.closeList)
        indexArr.forEach((x, i) => {
          this.mpegts_destroy(x)
        })



        data.switc = false
      } else {
        data.switc = true
        this.closeList.splice(this.closeList.findIndex(item => item === data.camera_id), 1)


        let indexArr = this.selectIndex([data.camera_id])
        indexArr.forEach((x, i) => {
          this.initMpegtsItem(x)
        })


      }


    },
    //寻找叶子节点
    selectIndex(arr) {
      let indexArr = []
      let leng = this.videoList.length
      for (let i = 0; i < arr.length; i++) {

        for (let o = 0; o < leng; o++) {
          let item = this.videoList[o]

          if (arr[i] == item.camera_id) {
            indexArr.push(o)
            break
          }
        }
      }
      return indexArr
    },



    //页数改变
    handleCurrentChange(val) {
      this.pageNum = val

      let params = {
        roleIds: roleList,
        assetId: this.cameraAssetId,
        parkId: this.parkId,
        pageSize: this.pageSize, pageNum: val
      }
      this.queryVideo(params)
    },
    searchFn() {
      // this.$refs.tree.filter(this.searchValue);
      if (this.searchValue) {
        // this.dataTree = this.sercLable(this.treeOnly, this.searchValue)
        this.dataTree = this.lookForAllId(this.treeOnly, this.searchValue)
      } else {
        this.dataTree = this.treeOnly
      }
    },
    lookForAllId(data = [], value, arr = []) {
      for (let item of data) {
        if (item.park_name.indexOf(value) != -1) {
          arr.push(item)
        } else {
          if (item.children && item.children.length) this.lookForAllId(item.children, value, arr)
        }


      }
      return arr
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.park_name.indexOf(value) !== -1;
    },

    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    //查询节点关闭
    colseVidoeFn() {




      let indexArr = this.selectIndex(this.closeList)

      indexArr.forEach((x, i) => {
        this.mpegts_destroy(x, false)
      })



    },

    // renderContent(h, { node, data, store }) {

    //   let classname = '';
    //   if (node.childNodes.length === 0) {
    //     classname = 'leafNode';
    //   } else if (node.childNodes.length > 0) {
    //     classname = 'treeNode';
    //   }
    //   return <span class={classname}>{node.label}</span>;

    // },
    //点击节点
    handleNodeClick(data, e) {

      clearTimeout(this.timer); //清除未执行的定时器
      this.timer = setTimeout(() => {


        if (!e.isLeaf) {

          let parkId = data.id

          this.parkId = parkId
          let params = {
            roleIds: roleList,
            assetId: this.cameraAssetId,
            parkId: data.id,
            pageSize: this.pageSize, pageNum: this.pageNum
          }
          this.queryVideo(params)
        } else {



          let indexArr = this.selectIndex([data.camera_id])

          indexArr.forEach((x, i) => {
            this.refreshFn(x)
          })

        }
      }, 200);






    },
    downFn(e) {

      //此处填写你的业务逻辑即可

      if (e.keyCode == 27) {
        e.stopPropagation();

        this.fulllScre = false

      }
    },
    //全局
    fullScreenFn() {
      this.$message({
        showClose: true,
        message: '按ESC退出全屏',
        customClass: 'two_info', iconClass: 'template', center: true
      });
      this.fulllScre = true
    },
    //查询摄像头
    queryVideo(params) {

      queryParkCamera(params).then(res => {
        let tempData = res.data.result
        this.videoTotal = res.data.totalSize
        this.videoList = tempData
        let tempArr = []
        this.lunbodata = []
        let ddd = parseInt(tempData.length / this.col_num)
        let ind = 0

        if (this.videoLive.length != 0) {
          for (let i = 0; i < this.videoLive.length; i++) {

            this.mpegts_destroy(i)
          }
        }

        tempData.forEach((x, i) => {

          tempArr.push(x)
          if (tempArr.length == this.col_num) {
            this.lunbodata.push(tempArr)
            tempArr = []
            ind++
          }

          if (ind == ddd && tempData.length % this.col_num == tempArr.length && tempData.length % this.col_num != 0) {

            this.lunbodata.push(tempArr)
            tempArr = []
          }
        })


        this.initMpegts(tempData)

        if (this.closeList.length == 0) return
        this.$nextTick(() => {
          this.colseVidoeFn()
        })

      }).catch(err => {

      })
    },
    // testFn(data, e, eObj) {
    //   // console.log(data, e, eObj, '===========');

    // },
    //查询视频列表接口

    initMpegts(data) {

      if (mpegtFlvs.isSupported()) {
        this.videoLive = [];
        this.mpegtsPlayer = [];
        // this.videoLive = this.$refs.videoLive;
        this.$nextTick(() => {
          this.videoLive = document.querySelectorAll('.centeredVideo')

          mpegtFlvs.LoggingControl.forceGlobalTag = true;
          for (let i = 0; i < this.videoLive.length; i++) {

            this.mpegtsPlayer[i] = mpegtFlvs.createPlayer(
              {
                type: 'flv',
                isLive: true,
                hasAudio: true,
                url: data[i].push_url
                // url: 'https://rtmp01open.ys7.com:9188/v3/openlive/D37888765_1_1.flv?expire=1667790534&id=509670576952975360&t=5ca5689c7147fc3abd592fa65baf3c689bed93114d9ff067e5a3b823f0c8ded9&ev=100'
                // url: 'https://prod-streaming-video-msn-com.akamaized.net/648cc494-7337-4644-9517-46877e93de76/486dfd9e-b104-4f2e-92a7-74c0eab6b14b.mp4'
              },
              {
                autoCleanupSourceBuffer: true,// 是否自动清理缓存
                // fixAudioTimestampGap: true
              }
            )

            this.mpegtsPlayer[i].attachMediaElement(this.videoLive[i])
            this.mpegtsPlayer[i].load()
            this.mpegtsPlayer[i].play()

            if (this.videoLive[i].paused === true) {
              this.mpegtsPlayer[i].unload()
              this.mpegtsPlayer[i].detachMediaElement()
            }
            // 监听错误事件
            this.mpegtsPlayer[i].on(mpegtFlvs.Events.ERROR, (err, errdet) => {
              // 参数 err 是一级异常，errdet 是二级异常
              if (err == mpegtFlvs.ErrorTypes.MEDIA_ERROR) {
                console.log('媒体错误')
                if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
                if (errdet == mpegtFlvs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
                  console.log('媒体格式不支持')
                  if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
                }
              }
              if (err == mpegtFlvs.ErrorTypes.NETWORK_ERROR) {
                console.log('网络错误')
                if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
                if (errdet == mpegtFlvs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
                  console.log('http状态码异常')
                  if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
                }
              }
              if (err == mpegtFlvs.ErrorTypes.OTHER_ERROR) {
                console.log('其他异常：', errdet)
                if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
              }
            })
          }
        })




      }
    },
    //指定视频拉流
    initMpegtsItem(i) {

      this.mpegtsPlayer[i].attachMediaElement(this.videoLive[i])
      this.mpegtsPlayer[i].load()
      this.mpegtsPlayer[i].play()
      // if (mpegtFlvs.isSupported()) {
      //   this.videoLive = [];
      //   this.mpegtsPlayer = [];
      //   // this.videoLive = this.$refs.videoLive;
      //   this.$nextTick(() => {
      //     this.videoLive = document.querySelectorAll('.centeredVideo')

      //     mpegtFlvs.LoggingControl.forceGlobalTag = true;


      //     this.mpegtsPlayer[i] = mpegtFlvs.createPlayer(
      //       {
      //         type: 'flv',
      //         isLive: true,
      //         hasAudio: true,
      //         // url: this.videoItems.url
      //         url: 'https://rtmp01open.ys7.com:9188/v3/openlive/F97063184_1_1.flv?expire=1667544957&id=508640552091127808&t=00eb0864cdbf9b0bc4296737b09dfa60fe108f92df1f6081a14fb0caafd7fbe7&ev=100'
      //         // url: 'https://prod-streaming-video-msn-com.akamaized.net/648cc494-7337-4644-9517-46877e93de76/486dfd9e-b104-4f2e-92a7-74c0eab6b14b.mp4'
      //       },
      //       {
      //         autoCleanupSourceBuffer: true,// 是否自动清理缓存
      //         // fixAudioTimestampGap: true
      //       }
      //     )

      //     this.mpegtsPlayer[i].attachMediaElement(this.videoLive[i])
      //     this.mpegtsPlayer[i].load()
      //     this.mpegtsPlayer[i].play()

      //     if (this.videoLive[i].paused === true) {
      //       this.mpegtsPlayer[i].unload()
      //       this.mpegtsPlayer[i].detachMediaElement()
      //     }
      //     // 监听错误事件
      //     this.mpegtsPlayer[i].on(mpegtFlvs.Events.ERROR, (err, errdet) => {
      //       // 参数 err 是一级异常，errdet 是二级异常
      //       if (err == mpegtFlvs.ErrorTypes.MEDIA_ERROR) {
      //         console.log('媒体错误')
      //         if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
      //         if (errdet == mpegtFlvs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
      //           console.log('媒体格式不支持')
      //           if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
      //         }
      //       }
      //       if (err == mpegtFlvs.ErrorTypes.NETWORK_ERROR) {
      //         console.log('网络错误')
      //         if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
      //         if (errdet == mpegtFlvs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
      //           console.log('http状态码异常')
      //           if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
      //         }
      //       }
      //       if (err == mpegtFlvs.ErrorTypes.OTHER_ERROR) {
      //         console.log('其他异常：', errdet)
      //         if (this.mpegtsPlayer[i]) this.mpegts_destroy(i);
      //       }
      //     })

      //   })




      // }
    },
    //刷新时评
    refreshFn(i) {
      this.mpegtsPlayer[i].pause();
      this.mpegtsPlayer[i].unload();
      this.mpegtsPlayer[i].detachMediaElement();
      this.mpegtsPlayer[i].attachMediaElement(this.videoLive[i])
      this.mpegtsPlayer[i].load()
      this.mpegtsPlayer[i].play()
      // let end = this.videoLive[i].buffered.end(0) - 1;
      // this.videoLive[i].currentTime = end;
    },

    // 销毁flv
    mpegts_destroy(i, type = true) {


      if (type) {
        if (this.videoLive[i].paused === true) return

        this.mpegtsPlayer[i].pause();
        this.mpegtsPlayer[i].unload();
        this.mpegtsPlayer[i].detachMediaElement();
      } else {


        this.mpegtsPlayer[i].pause();
        this.mpegtsPlayer[i].unload();

        this.mpegtsPlayer[i].detachMediaElement();

      }


      // this.mpegtsPlayer[i].destroy();

      // this.mpegtsPlayer[i] = null

      // this.videoLive[i] = {};

      // }
      // if (this.mpegtsPlayer[i] != null) this.mpegtsPlayer[i].destroy();
      // this.mpegtsPlayer[i] = null;
      // this.videoLive[i] = {};
    },
    mpegtsClick(i, i2) {
      let index = (i + 1) * 2 + i2
      if (this.videoLive[index].paused === true) {
        // 已断流，重新拉流播放

        this.mpegtsPlayer[index].attachMediaElement(this.videoLive[i])
        this.mpegtsPlayer[index].load()
        this.mpegtsPlayer[index].play()
      } else {

        this.mpegtsPlayer[index].unload()
        this.mpegtsPlayer[index].detachMediaElement()
      }
    },
    //查询时评

    //查询列表数


    //处理成数显数据




    //录播查询

    dateChangeFn() {
      console.log(this.dateValue);
    },

    // 初始化直播窗口


    //  事件 必需，不可删除
    //  aram {String} eventName 事件名
    //  aram {Array} payload 事件传参

    triggerEvent(eventName, payload) {
      let { componentId, apparent_id } = this.customConfig || {};
      componentId && apparent_id && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload


      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_message_setValue(value) {
      this.setValue(value)
    },
    setValue(value) {
      this.selected = value

    }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>

<style lang="less" scoped>
.parent_container_two {
  display: flex;
  height: 90%;
  justify-content: space-between;

  .listClass_two {
    width: 20%;
    // height: 100%;
    background: white;

    .listClass_tree_two {
      padding: 20px 15px 15px 15px;

      .list_serch {
        display: flex;
        justify-content: space-around;

        .el-input {
          width: 69%;
        }

        /deep/ .el-input__inner:focus {
          border-color: #5973d8;
        }

        .btn_serch {
          background: #5973d8;
          border: 1px solid #5973d8;
          color: #fff;
          width: 25%;

          border-radius: 5px;
        }
      }

      .tree_title {
        text-align: center;
        color: #fff;
        padding: 10px;
        background-color: #5973d8;
        border-radius: 5px;
        margin-bottom: 10px;
      }

      .tree_data_main {
        // border: 1px solid #757877;
        border: 1px solid #ebeef5;
        margin-top: 10px;
        padding: 5px;
        background-color: #fff;

      }

      /deep/.leafNode {
        color: #008000;

      }

      /deep/.isopen {
        color: #CCCCCC;
      }

      /deep/.tow_checked {
        .leafNode {
          color: red;
        }
      }

      // /deep/ .el-tree-node__content {
      //   margin-right: 10px;
      //   height: 30px;
      //   color: #757877;

      //   .el-tree-node__expand-icon {
      //     color: #3e403d;
      //     font-size: 12px;
      //     margin-left: 10px;
      //   }

      //   .el-tree-node__expand-icon.is-leaf {
      //     color: transparent;
      //   }

      //   .edit_tree {
      //     font-size: 14px;
      //     font-weight: 500;
      //     text-indent: 24px;
      //     height: 28px;
      //     line-height: 28px;
      //     margin-left: -22px;
      //     width: 100%;
      //   }
      // }

      // /deep/.el-tree-node.is-current>.el-tree-node__content {
      //   color: #fff !important;
      //   background-color: #ffffff;

      //   .edit_tree {
      //     background-color: #3354f2 !important;
      //     border-radius: 4px;
      //   }
      // }
    }
  }

  .listNode_two {
    width: 78%;
    // background: white;
    // display: flex;
    flex-wrap: wrap;

    .card_parent {
      height: 100%;
      padding-right: 10px;

      .el-row {
        height: 50%;

        .el-col {
          height: 100%;
        }
      }

      .list_video {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;

        .video_title {
          text-align: justify;
          font-weight: 700;
        }



        .video_main {
          height: 90%;
          background-color: #3e403d;
          flex: 1;
        }


      }
    }

    .parent_full {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 99;
      background-color: white;

      .video_main {
        height: 100%;
      }

      .video_title {
        position: absolute;
        left: 50%;
        color: #fff;
      }
    }

    // justify-content: space-around;
    .date_two {
      background: #fff;
      width: 50%;
      padding: 20px;
      padding-right: 0px;
      margin-bottom: 20px;
    }

    .el-card__body {
      .border_two {
        border: 1px solid blue;

      }

      .body_two {

        .body_two_img {
          height: 160px;
          padding: 2px 20px 10px 20px;
          cursor: pointer;
        }
      }

      .title_two {
        padding: 2px 20px 10px 15px;

        span {
          color: #3354f2;
          cursor: pointer;
          font-weight: 600;
          display: block;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .el-card {
      border-radius: 2px;
    }

    .card_two {
      width: 22%;
      margin-right: 2%;
      margin-bottom: 20px;
      float: left;
    }

    .card_two:nth-child(4n+1) {
      margin-left: 2%;
    }
  }




}

.two_list2 {
  .page_fen {
    display: flex;
    align-items: center;
    padding-left: 22%;
    font-size: 30px;
    color: #a2d0fd;
    margin-top: 20px;

    i:hover {
      color: #3296fa;
      cursor: pointer;
    }

    i.active {
      color: #3296fa;
    }

    .gongge {
      height: 23px;
      width: 23px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      cursor: pointer;

      &:hover .col_g {
        background-color: #3296fa;
      }

      .row_g {
        display: flex;
        height: 19%;
        justify-content: space-around;
      }

      .col_g {
        height: 100%;
        width: 19%;
        background-color: #a2d0fd;
      }
    }

    .gongge.active .col_g {
      background-color: #3296fa;
    }

    svg {
      cursor: pointer;
    }

    .el-pagination {
      display: flex;
    }
  }

  // /deep/.el-dialog__header {
  //   display: none;
  // }
  .two_dialog {
    height: 100%;
    width: 100%;
  }

  /deep/.el-dialog__body {
    padding: 0px;
    width: 100%;
    height: 94%;
  }

  .video-js {
    height: 100%;
    width: 100%;
  }

  /deep/ .video-js .vjs-big-play-button {
    top: inherit !important;
    bottom: 10px !important;

  }
}


.centeredVideo {
  display: block;
  width: 100%;
  height: 100%;
  // height: 93%;
  background: #333;
}

video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-current-time-display {
  display: none;
}

// /deep/.el-message {
//   background-color: rgba(83, 86, 91, .8)
// }

/* 音量按钮 */
// video::-webkit-media-controls-mute-button {
//   display: none;
// }
/* 音量的控制条 */
// video::-webkit-media-controls-volume-slider {
//   display: none;
// }
/*  播放按钮 */
// video::-webkit-media-controls-play-button {
//   display: none;
// }
</style>
