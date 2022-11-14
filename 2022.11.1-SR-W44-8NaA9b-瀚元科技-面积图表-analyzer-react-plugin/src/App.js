import React, { Component } from "react";
import * as echarts from "echarts";
import "./app.less";

export default class App extends Component {
  constructor(props) {
    super(props);

    let external = props.options?.externalVariables ? props.options.externalVariables : {};
    // 全局配置
    this.echartsBackground = external["背景颜色"] || "transparent";
    this.echartsColorList = external["系列颜色配置"]?.split("-") || ["#FF6969", "#FF9E75", "#FFD03B", "#30D994"];
    this.echartsColorGradient = external["线条颜色渐变"]?.split("-") || "";
    this.echartsColorFillGradient = external["覆盖物颜色渐变"]?.split("-") || "";
    this.echartsColorFillGradientLevel = external["覆盖物颜色渐变程度"] || "0.7";
    // 图例配置
    this.legendIsShow = external["是否展示图例"] || "false";
    this.legendColor = external["图例文字颜色"] || "#fff";
    this.legendFontSize = external["图例文字字号"] || "13";
    this.legendPadding = external["图例之间间距"] || "20";
    this.legendIconWidth = external["图例图标宽度"] || "10";
    this.legendIconHeight = external["图例图标高度"] || "10";
    // 悬浮框配置
    this.tooltipTitleColor = external["悬浮框标题文字颜色"] || "#15F6EE";
    this.tooltipTitleFontSize = external["悬浮框标题文字字号"] || "16";
    this.tooltipContentNameColor = external["悬浮框内容名称颜色"] || "#99AFCC";
    this.tooltipContentNameFontSize = external["悬浮框内容名称字号"] || "14";
    this.tooltipContentValueColor = external["悬浮框内容数值颜色"] || "#FFF";
    this.tooltipContentValueFontSize = external["悬浮框内容数值字号"] || "13";
    // 辅助线配置
    this.yAxisGuideWidth = external["横向辅助线宽度"] || "1";
    this.yAxisGuideColor = external["横向辅助线颜色"] || "#fff";
    this.tooltipGuideWidth = external["垂直辅助线宽度"] || "1";
    this.tooltipGuideColor = external["垂直辅助线颜色"] || "#3CE2FE";
    this.seriesSymbolSize = external["垂直辅助线拐点大小"] || "6";
    this.seriesSymbolBorderWidth = external["垂直辅助线拐点边线宽度"] || "2";
    this.seriesSymbolBorderColor = external["垂直辅助线拐点边线颜色"] || "";
    this.seriesSymbolCenterColor = external["垂直辅助线拐点中心颜色"] || "";
    // X轴配置
    this.xAxisLabelColor = external["X轴文字颜色"] || "#FFF";
    this.xAxisLabelFontSize = external["X轴文字字号"] || "13";
    this.xAxisLineOffset = external["X轴上下偏移位置"] || "20";
    // Y轴配置
    this.yAxisLabelColor = external["Y轴文字颜色"] || "#FFF";
    this.yAxisLabelFontSize = external["Y轴文字字号"] || "13";
    this.yAxisLineOffset = external["Y轴左右偏移位置"] || "10";
    // 曲线配置
    this.seriesLineWidth = external["曲线宽度"] || "6";
  }

  componentDidMount() {
    this.refs["hykj_area"].parentNode.style.width = "100%";
    this.refs["hykj_area"].parentNode.style.height = "100%";
    this.refs["hykj_area"].parentNode.parentNode.style.minHeight = 0;

    this.handleEchartsData();
  }

  // 处理数据
  handleEchartsData() {
    let propsData = JSON.parse(JSON.stringify(this.props.dataSource));

    let xAxisData = {};
    let handleData = [];
    let seriesData = [];

    propsData[0].forEach((item, index) => {
      let dataObj = {
        name: "",
        dataList: [],
      };
      propsData.forEach((e, i) => {
        dataObj.name = item;
        if (i > 0) {
          dataObj.dataList.push(e[index]);
        }
      });
      if (index === 0) {
        xAxisData = dataObj;
      } else {
        handleData.push(dataObj);
      }
    });

    handleData.forEach((item, index) => {
      seriesData.push({
        name: item.name,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: this.seriesSymbolSize,
        showSymbol: false,
        // 拐点配置
        itemStyle: {
          color: this.seriesSymbolCenterColor || this.echartsColorList[index],
          borderWidth: this.seriesSymbolBorderWidth,
          borderColor: this.seriesSymbolBorderColor || this.echartsColorList[index],
        },
        // 线颜色
        lineStyle: {
          width: this.seriesLineWidth,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: this.echartsColorList[index],
            },
            {
              offset: 1,
              color: this.echartsColorGradient[index] || this.echartsColorList[index],
            },
          ]),
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: this.echartsColorFillGradient[index] || this.echartsColorList[index],
            },
            {
              offset: this.echartsColorFillGradientLevel,
              color: "transparent",
            },
          ]),
        },
        data: item.dataList,
      });
    });

    this.initEcharts(xAxisData, seriesData);
  }

  // 生成Echarts
  initEcharts(xAxisData, seriesData) {
    let myChart = echarts.init(this.refs["hykj_area"]);
    let option = {};

    option = {
      backgroundColor: this.echartsBackground,
      // 整体
      grid: {
        left: "2%",
        right: "2%",
        top: "5%",
        bottom: JSON.parse(this.legendIsShow) ? "7%" : "4%",
        containLabel: true,
      },
      // 悬浮框
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
          lineStyle: {
            width: this.tooltipGuideWidth,
            color: this.tooltipGuideColor,
          },
        },
        className: "tooltipBox",
        formatter: (params) => {
          let list = [];
          let listItem = "";
          for (var i = 0; i < params.length; i++) {
            list.push(
              `<div class="tooltipBox_content" style="color: #fff;">
                <div style="color: ${this.tooltipContentNameColor}; font-size: ${this.tooltipContentNameFontSize}px;">${params[i].seriesName}：</div>
                <div style="color: ${this.tooltipContentValueColor}; font-size: ${this.tooltipContentValueFontSize}px;">${params[i].data}</div>
              </div>`
            );
          }
          listItem = list.join("");
          return (
            `<div>
              <div class="tooltipBox_title" style="color: ${this.tooltipTitleColor}; font-size: ${this.tooltipTitleFontSize}px">${params[0].name}</div>` +
            listItem +
            `</div>`
          );
        },
      },
      // 图例
      legend: {
        show: JSON.parse(this.legendIsShow),
        orient: "horizontal",
        left: "center",
        bottom: "bottom",
        icon: "square",
        textStyle: {
          color: this.legendColor,
          fontSize: this.legendFontSize,
        },
        itemWidth: Number(this.legendIconWidth),
        itemHeight: Number(this.legendIconHeight),
        padding: [0, 0, 10, 0],
        itemGap: Number(this.legendPadding),
      },
      // X轴
      xAxis: [
        {
          type: "category",
          // boundaryGap: false,
          axisLabel: {
            color: this.xAxisLabelColor,
            fontSize: this.xAxisLabelFontSize,
          },
          offset: Number(this.xAxisLineOffset),
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          data: xAxisData.dataList,
        },
      ],
      // Y轴
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              width: this.yAxisGuideWidth,
              color: this.yAxisGuideColor,
              type: "dashed",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: this.yAxisLabelColor,
              fontSize: this.yAxisLabelFontSize,
            },
          },
          offset: Number(this.yAxisLineOffset),
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      // 数据
      series: seriesData,
    };

    option && myChart.setOption(option);

    function debounce(func, ms = 1000) {
      let timer;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, ms);
      };
    }
    const task = () => {
      myChart.resize();
    };
    const debounceTask = debounce(task, 300);
    window.addEventListener("resize", debounceTask);
  }

  render() {
    return <div ref="hykj_area" style={{ width: "100%", height: "100%" }}></div>;
  }
}
