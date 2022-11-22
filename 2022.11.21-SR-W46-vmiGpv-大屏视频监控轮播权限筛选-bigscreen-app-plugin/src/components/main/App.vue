<template>
  <div class="player_box">
    <el-carousel :interval="interval" arrow="never" indicator-position="none" :initial-index="currentindex" @change="carouselChange">
      <el-carousel-item v-for="item in videoLiveList" :key="item.deviceId">
        <playerModal v-if="item.deviceId" :isActive="currentindex" :videoUrl="item" :livengh="liveLength"></playerModal>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { queryLiveing, queryAssetById } from "../../api/asset";
import { Carousel, CarouselItem } from "element-ui";
import Vue from "vue";
import playerModal from "./player.vue"

Vue.use(Carousel)
Vue.use(CarouselItem)

const zipObject = (arr1, arr2) => {
  const ret = {}
  arr1.forEach((item, index) => {
    ret[item.col_name] = arr2[index]
  })
  return ret
}

const getQueryString = (name) => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
}

export default {
  name: "App",
  props: {
    customConfig: Object,
    options: Object
  },
  components:{
    playerModal
  },
  data: function () {
    return {
      videoLiveList: [],
      dataIdList: [],
      interval: 10000,
      currentindex: 0,
      liveLength: 0,
      assetId: '',
      deveiceIdKey: '',
      assetFliterKey: '',
      urlSelectKey: '',
      dataLength: 10
    };
  },
  computed: {},
  watch: {},
  created() {
    const pubSub = this.customConfig?.pubSub;
    pubSub &&
      pubSub.subscribe(
        "updateChart" + this.customConfig?.componentId,
        (data) => {
          console.log("updateChart");
        }
      );
  },
  mounted() {
    this.assetId = this.options?.externalVariables.assetId;
    this.urlSelectKey = this.options?.externalVariables.urlSelectKey; // 园区IDKEY
    this.officeIdKey = this.options?.externalVariables.officeIdKey; // 部门IDKEY
    this.assetFliterKey = this.options?.externalVariables.assetFliterKey; // 资产刷选字段Key
    this.deveiceIdKey = this.options?.externalVariables.deveiceIdKey; // 设备IDKey
    this.interval = Number(this.options?.externalVariables.intervalTime) * 1000;
    this.dataLength = Number(this.options?.externalVariables.dataLength) || 10;
    console.log('this.options.externalVariables',this.options.externalVariables);
    this.getDataList();
    const events = [];
    const actions = [];
    window.componentCenter?.register &&
      window.componentCenter.register(
        this.customConfig?.componentId,
        "comp",
        this,
        {
          events,
          actions,
        }
      );
    this.customConfig?.updateProcess && this.customConfig.updateProcess();
  },

  methods: {
    carouselChange(current) {
      // console.log('current',current)
      this.currentindex = current;
    },
    getDataList() {
      let garden_id = getQueryString(this.urlSelectKey) || ''
      let office_id = window?.currentUser ? window?.currentUser[this.officeIdKey] : ''
      let params = [
        // {
        //   column: "office_id",
        //   datatype: 0,
        //   type: 10,
        //   compareObj: office_id
        // },
        // {
        //   column: "garden_id",
        //   datatype: 0,
        //   type: 10,
        //   compareObj: garden_id
        // }
      ]
      queryAssetById(this.assetId,params).then(({ data })=>{
        let keyValue = data[0]
        let valValue = data[1]
        let datalist = []
        
        datalist = valValue.map(x=>{
          let obj = zipObject(keyValue,x)
          return obj
        })

        if (garden_id && office_id) {
          console.log('1');
          datalist.forEach(item => {
            let filterKeyList = item[this.assetFliterKey].split(',')
            if (filterKeyList.indexOf(garden_id) != -1 && filterKeyList.indexOf(office_id) != -1) {
              this.dataIdList.push(item[this.deveiceIdKey])
            }
          })
        } else if (garden_id) {
          console.log('2');
          datalist.forEach(item => {
            let filterKeyList = item[this.assetFliterKey].split(',')
            if (filterKeyList.indexOf(garden_id) != -1) {
              this.dataIdList.push(item[this.deveiceIdKey])
            }
          })
        } else if (office_id) {
          console.log('3');
          datalist.forEach(item => {
            let filterKeyList = item[this.assetFliterKey].split(',')
            if (filterKeyList.indexOf(office_id) != -1) {
              this.dataIdList.push(item[this.deveiceIdKey])
            }
          })
        } else {
          console.log('4');
          datalist.forEach(item => {
            this.dataIdList.push(item[this.deveiceIdKey])
          })
        }
        if (this.dataIdList.length > this.dataLength) {
          this.dataIdList = this.dataIdList.splice(0,this.dataLength)
        }

        console.log('dataList',this.dataIdList.length);
        this.getLiveings();
      }).catch(err=>{
        console.log('err',err);
      })
    },
    // 直播请求
    async getLiveings() {
      for (let index = 0; index < this.dataIdList.length; index++) {
        let dataId = this.dataIdList[index]
        await queryLiveing(dataId).then(res=>{
          res.data.current = index;
          this.videoLiveList.push(res.data);
        }).catch(err=>{
          this.dataIdList.splice(index,1)
          index = index - 1;
          console.log(err);
          // this.$message.error('直播接口：'+ err.status +` - `+ err.statusText)
        })
      }
      this.liveLength = this.videoLiveList.length - 1;
      console.log('videoLiveList',this.videoLiveList);
    },
    Event_Center_getName: () => {
      return "";
    },
    do_EventCenter_messageSuccess: function (param) {
      console.log(param);
      alert("动作执行成功！");
    },
    // clickbt: function () {
    //   console.log("clickbt");
    //   window.eventCenter?.triggerEvent &&
    //     window.eventCenter.triggerEvent(
    //       this.customConfig.componentId,
    //       "onClick",
    //       {
    //         name: "二开插件",
    //       }
    //     );
    // },
  },
};
</script>

<style lang="less" scoped>
.player_box {
  width: 100%;
  height: 100%;
  background: #333;

  /deep/ .el-carousel--horizontal {
    height: 100%;
    width: 100%;
    .el-carousel__container {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
