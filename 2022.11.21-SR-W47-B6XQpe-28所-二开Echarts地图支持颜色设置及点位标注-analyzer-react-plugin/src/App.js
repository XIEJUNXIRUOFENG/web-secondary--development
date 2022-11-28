import React, { Component } from "react";
import * as echarts from "echarts";
import geoJson from "./map.json";
import $ from "jquery";
import { Table, Button, message } from "antd";
import "./app.less";
import Configuration from "./components/configuration";

const events = [
  {
    key: "onClick",
    name: "点击",
    payload: [
      {
        name: "名称",
        dataType: "string",
        key: "name",
      },
    ],
  },
];

const actions = [
  {
    key: "messageSuccess",
    name: "成功提示",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "string",
      },
    ],
  },
];
const componentMap = {
  designConfiguration: Configuration,
};
export default class App extends Component {
  state = {
    dataSource: [],
    rowId: "",
    columns: [],
  };

  constructor(props) {
    super(props);
    const { pubSub } = props;
    pubSub?.subscribe &&
      pubSub.subscribe("analyzeDataSource", (data) => {
        this.loadTableFromData && this.loadTableFromData(data);
      });
  }

  initEcharts(data) {
    this.initComData();
    let pluginOptions = JSON.parse(JSON.stringify(this.props?.options));
    var geoCoordMap = {};
    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    };
    var img = pluginOptions.fileList ? `image://${process.env.REACT_APP_API}${pluginOptions.fileList[0]?.response?.result}` : "";
    let defualColorback = pluginOptions.backSwitch ? "transparent" : pluginOptions.bacColor ||'#000';
    let defualColor = pluginOptions.mapSwitch ? "transparent" : pluginOptions.areaColor ||'#23A199';
    echarts.registerMap("china", { geoJSON: geoJson });
    const myChart = echarts.init(this.refs.Map28);
    var data = pluginOptions.pointData;
    var option = {
      backgroundColor: defualColorback,
      geo: {
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"],
        layoutSize: "120%",
        itemStyle: {
          normal: {
            areaColor: {
              type: "linear-gradient",
              x: 0,
              y: 1200,
              x2: 1000,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: defualColor, // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: defualColor, // 50% 处的颜色
                },
              ],
              global: true, // 缺省为 false
            },
            shadowColor: defualColor,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            opacity: 0.5,
          },
          emphasis: {
            areaColor: defualColor,
          },
        },
        regions: [
          {
            name: "南海诸岛",
            itemStyle: {
              areaColor: defualColor,
              borderColor: defualColor,
              normal: {
                opacity: 0,
                label: {
                  show: false,
                  color: defualColor,
                },
              },
            },
            label: {
              show: false,
              color: "#FFFFFF",
              fontSize: 12,
            },
          },
        ],
      },
      series: [
        {
          type: "map",
          selectedMode: "multiple",
          mapType: "china",
          aspectScale: 0.8,
          layoutCenter: ["49.5%", "51%"], //地图位置
          layoutSize: "120%",
          zoom: 1, //当前视角的缩放比例
          // roam: true, //是否开启平游或缩放
          scaleLimit: {
            //滚轮缩放的极限控制
            min: 1,
            max: 2,
          },
          label: {
            show: true,
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily: "宋体",
            fontStyle: "italic",
          },

          itemStyle: {
            normal: {
              areaColor: defualColor,
              borderColor: "#1cccff",
              borderWidth: 1.8,
            },
            emphasis: {
              areaColor: defualColor,
              label: {
                show: true,
                color: "#fff",
              },
            },
          },
          data: data,
        },
        {
          name: "Top 5",
          type: "scatter",
          coordinateSystem: "geo",
          //   symbol: 'image://http://ssq168.shupf.cn/data/biaoji.png',
          // symbolSize: [30,120],
          // symbolOffset:[0, '-40%'] ,
          label: {
            normal: {
              show: false,
            },
          },
          symbol: img,
          symbolSize: [40, 40],
          data: data,
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
          },
          hoverAnimation: true,
          zlevel: 1,
        },
      ],
    };
    myChart.setOption(option, true);
  }
  initComData = () => {
    console.log(this.props, 205);
    const pluginOptions = JSON.parse(JSON.stringify(this.props?.options));
    this.setState({
      pluginOptions: pluginOptions,
    });
    console.log(pluginOptions);
  };
  componentDidMount() {
    const { dataSource, updateProcess, componentId, type } = this.props;
    const data = dataSource;
    type !== "designConfiguration" && this.initEcharts();

    window?.componentCenter?.register(componentId, "comp", this, {
      events,
      actions,
    });
    updateProcess && updateProcess();

    this.Event_Center_getName = () => {
      return "Demo实例";
    };
  }

  do_EventCenter_messageSuccess(param) {
    console.log(param);
    alert("动作执行成功！");
  }

  render() {
    const { dataSource, rowId, columns } = this.state;
    const { componentId, options = {}, type } = this.props;
    const { externalVariables = {} } = options;
    const { headerBGColor = "#0f2437" } = externalVariables;
    const RenderComponent = componentMap[type];
    if (RenderComponent) {
      return <RenderComponent {...this.props} />;
    }
    return <div ref="Map28" style={{ width: "100%", height: "100%" }}></div>;
  }
}
