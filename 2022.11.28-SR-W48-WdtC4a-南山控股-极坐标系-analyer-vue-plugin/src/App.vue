<template>
  <!--注意，有些老版本的父级宽高没有100%，需要在mounted中使用this.$refs.refName.parentNode.style.width = "100%"规避，高度同理  -->
  <div className="analyzer-vue-demo" :style="{
    width: '100%',
    height: '100%',
  }" ref="multistageTable" :id="id">
    <div ref="echarts_jizuo" class="multistage">


    </div>
  </div>
</template>

<script>
import msgCompConfig from "./msgCompConfig";
import Utils from "./utils";
import * as echarts from "echarts";

const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};
const debounce = (func, ms) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
}
export default {
  props: {
    //用于接收分析仪拖拽过来的数据源，
    dataSource: {
      type: Array,
      default: () => []
    },
    //用于接收组件id，用于注册逻辑控制，不需要修改使用，保持默认即可
    componentId: {
      type: String | undefined,
      default: ""
    },
    //重要，用于接收分析仪右侧的配置项参数
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {}
      })
    },
    //保持默认即可
    updateProcess: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      id: "",
      //此处定义自己的业务数据
      colorArrlist: "#f8f8f8",
      fontFamilyBar: "",
      fontColorBar: "",
      fontSizeBar: "",
      fontFamilySum: '',
      fontColorSum: '',
      fontSizeSum: '',
      fontFamilyTitle: '',
      fontColorTitle: '',
      fontSizeTitle: '',
      coordinateY: "",
      barWidth: "",
      radius: '',
      Gechart: null,
      confirmW: false
    };
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    let id = this.options?.externalVariables?.id;
    this.id = id ? `secondary_analyzer_${id}` : `secondary_analyzer_${Utils.generateUUID()}`;
    //重要，此处不可删除，用于注册逻辑控制
    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, msgCompConfig);
    this.updateProcess && this.updateProcess();
    this.colorArrlist = this.options?.externalVariables?.colorArrlist ? this.options?.externalVariables.colorArrlist?.split('|') : ['#1c76fd', '#36abbf', '#5b8bdd']
    this.fontFamilyBar = this.options?.externalVariables.fontFamilyBar
    this.fontColorBar = this.options?.externalVariables.fontColorBar || '#c0c0c0'
    this.fontSizeBar = this.options?.externalVariables.fontSizeBar || '20'
    this.fontFamilySum = this.options?.externalVariables.fontFamilySum
    this.fontColorSum = this.options?.externalVariables.fontColorSum || '#0c0d0e'
    this.fontSizeSum = this.options?.externalVariables.fontSizeSum || '30'
    this.fontFamilyTitle = this.options?.externalVariables.fontFamilyTitle
    this.fontColorTitle = this.options?.externalVariables.fontColorTitle || '#a1a1a1'
    this.fontSizeTitle = this.options?.externalVariables.fontSizeTitle || '16'
    this.coordinateY = this.options?.externalVariables.coordinateY
    this.barWidth = this.options?.externalVariables.barWidth
    this.radius = this.options?.externalVariables?.radius ? this.options?.externalVariables?.radius.split('|') : ['10%', '100%']
    //这里用于将配置项的参数传入，与用户的代码进行交互，按照自己的业务逻辑填写

    this.dataHanlder()






  },
  methods: {
    initFn(series, legend, sumValue) {


      let options = {
        legend: {
          show: true,
          bottom: '5%',
          left: 'center',
          data: legend,
          itemWidth: 18,
          itemHeight: 18,
          icon: 'rect',

          // width: 50,
          // padding: [0, 5],
          // itemGap: 25,
          orient: 'horizontal',

        },
        tooltip: {
          show: true,
          trigger: 'item',

        },

        title: {
          text: `${sumValue}`,
          subtext: '总计',
          x: 'center',
          padding: 2,
          y: this.coordinateY || '48%',
          textStyle: {
            fontFamily: this.fontFamilySum,

            fontSize: this.fontSizeSum,
            fontWeight: 'normal',
            color: this.fontColorSum,
          },
          subtextStyle: {
            fontSize: this.fontSizeTitle,
            fontWeight: 'normal',
            lineHeight: -5,
            fontFamily: this.fontFamilyTitle,
            color: this.fontColorTitle,
          },
        },
        color: this.colorArrlist,
        grid: {
          top: '20%',
          bottom: '48%',
          left: '30%',
          containLabel: false,
        },
        polar: {
          center: ['50%', '50%'],
          radius: this.radius
          // radius: this.radius //图形大小
        },
        angleAxis: {
          show: false,
          startAngle: 90,
          min: 0,
          max: sumValue
        },
        radiusAxis: {
          type: 'category',
          show: false,

          data: legend
        },
        series
      }
      this.Gechart = echarts.init(this.$refs.echarts_jizuo);
      // console.log(options);




      this.Gechart.setOption(options);
      options && this.Gechart.setOption(options);
      const task = () => {
        this.Gechart.resize();
      };
      window.addEventListener("resize", debounce(task, 300));
    },


    dataHanlder() {
      let tableD = JSON.parse(JSON.stringify(this.dataSource))
      tableD.shift()
      let color = ['#1c76fd', '#36abbf', '#5b8bdd']
      let res = this.analyerData(tableD)
      let sumValue = 0
      let legend = []
      for (const key in res) {
        sumValue += Number(res[key])
        legend.push(key)
      }
      let series = []
      let i = 0
      for (const key in res) {

        series.push({
          name: key,
          type: 'bar',
          coordinateSystem: 'polar',
          // roundCap: true,
          barWidth: this.barWidth || 20, //宽度
          barCategoryGap: "40%",
          // barCategoryGap: "80%",
          showBackground: true,
          backgroundStyle: {
            color: "#f4f5f6",
            barBorderRadius: 5
          },
          label: {
            position: 'start',
            show: true,
            color: this.fontColorBar, fontSize: Number(this.fontSizeBar),
            fontFamily: this.fontFamilyBar
          },
          data: [
            {
              value: res[key],

              name: key,

            },

          ],
        });


        i++
      }

      this.initFn(series, legend, sumValue)

    },
    //分析仪数据处理
    analyerData(data) {
      let obj = {}
      data.forEach(x => {
        if (!obj[x[0]] && obj[x[0]] != 0) {
          obj[x[0]] = 0
        }
      })
      data.forEach(x => {
        for (const key in obj) {
          if (key == x[0]) {
            obj[key] += Number(x[1])

          }
        }
      })
      return obj
    },


    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return this.id;
    },
    /**
     * 触发事件方法，window.eventCenter?.triggerEvent封装了一层， 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      this.componentId && window.eventCenter?.triggerEvent(
        this.componentId,
        eventName,
        //payload需为一个object，如msgCompConfig.js定义的payload则为{value:""}这样的形式
        payload
      );
    },
    //do_EventCenter_前缀开头的方法，用来定义对应动作
    do_EventCenter_messageSuccess(param) {
      console.log(param);
      alert("动作执行成功！");
    }
  }
};
</script>

<style lang="less" scoped>
// .multistage {
//   padding: 20px 0;
// }

/deep/ .multistage {
  // background: transparent;
  width: 100%;
  height: 100%;
}
</style>

