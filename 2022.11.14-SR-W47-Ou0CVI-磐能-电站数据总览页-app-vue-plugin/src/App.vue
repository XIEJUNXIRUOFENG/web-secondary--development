<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%" :ref="id">
    <!-- -->
    <div class="topStation">
      <div class="top_Left_Card">
        <el-card class="top_Left_Card_Station_Name"> 电站名称:{{ this.queryLeftDataRes.name }}<span style="float: right">></span></el-card>
        <el-card class="top_Left_Card_ButtonArray">
          <div class="blueButton" @click="goOneLine">一次接线图</div>
          <div class="blueButton" @click="goCallMore">通讯拓补图</div>
          <div class="blueButton">备用</div>
          <div class="blueButton">备用</div>
        </el-card>
        <el-card class="top_Left_Card_Station_Info">
          <div>并网日期：{{ this.formatDate(this.queryLeftDataRes.connection_date) }}</div>
          <div>并网电压等级：{{ this.queryLeftDataRes.voltage }}</div>
          <div>装机容量：{{ this.queryLeftDataRes.machine_volume }}kWp</div>
          <div>地址：{{ this.queryLeftDataRes.address }}</div>
        </el-card>
        <el-card class="top_Left_Card_Weather">
          <div>2022-03-07</div>
          <div>多云 19°~20°</div>
          <span>日出：06:25</span><span style="float: right">日落：18:08</span>
        </el-card>
      </div>
      <el-card class="top_Center_Card">
        <span class="top_Center_Card_Title">┃ 功率</span>
        <hr />
        <div class="top_Center_Card_Date_Operation">
          <div class="top_Center_Card_Date_Box">
            <el-date-picker
              class="top_Center_Card_Date"
              v-model="powerDatePick"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              clear-icon="el-icon-error"
              type="date"
              @change="queryPowerData()"
              placeholder="选择时间"
            />
            <img src="../pluginTemp/images/date.png" alt="" />
          </div>
          <img style="cursor: pointer" @click="exportPower" src="../pluginTemp/images/export.png" alt="" />
        </div>
        <div class="top_Center_Card_StationCharts" style="height: 74%; width: 98%" ref="top_Center_Card_StationCharts" id="top_Center_Card_StationCharts"></div>
      </el-card>
      <el-card class="top_Right_Card">
        <span class="top_Right_Card_Title">┃ 发电量</span>
        <hr />
        <div class="top_Right_Card_Date_Operation">
          <el-radio-group v-model="radioData" size="mini" @change="radioChange">
            <el-radio-button label="日"></el-radio-button>
            <el-radio-button label="月"></el-radio-button>
            <el-radio-button label="年"></el-radio-button>
            <el-radio-button label="总"></el-radio-button>
          </el-radio-group>
          <div class="top_Right_Card_Date_Box">
            <el-date-picker
              v-if="radioData == '日'"
              class="top_Right_Card_Date"
              v-model="electricDatePick"
              clear-icon="el-icon-error"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              @change="queryGeneratingCapacity()"
              placeholder="选择时间"
            />
            <el-date-picker
              v-if="radioData == '月'"
              class="top_Right_Card_Date"
              v-model="electricDatePickMon"
              clear-icon="el-icon-error"
              value-format="yyyy-MM"
              format="yyyy-MM"
              type="month"
              @change="queryGeneratingCapacityMon()"
              placeholder="选择时间"
            />
            <el-date-picker
              v-if="radioData == '年'"
              class="top_Right_Card_Date"
              v-model="electricDatePickYear"
              clear-icon="el-icon-error"
              value-format="yyyy"
              format="yyyy"
              type="year"
              @change="queryGeneratingCapacityYear()"
              placeholder="选择时间"
            />
            <img v-show="radioData !== '总'" src="../pluginTemp/images/date.png" alt="" />
          </div>
          <img style="cursor: pointer" @click="exportElectric" src="../pluginTemp/images/export.png" alt="" />
        </div>
        <div
          class="top_Right_Card_StationCharts"
          v-show="radioData == '日'"
          style="height: 74%; width: 98%"
          ref="top_Right_Card_StationCharts"
          id="top_Right_Card_StationCharts"
        ></div>
        <div
          class="top_Right_Card_StationChartsMon"
          v-show="radioData == '月'"
          style="height: 74%; width: 98%"
          ref="top_Right_Card_StationChartsMon"
          id="top_Right_Card_StationChartsMon"
        ></div>
        <div
          class="top_Right_Card_StationChartsYear"
          v-show="radioData == '年'"
          style="height: 74%; width: 98%"
          ref="top_Right_Card_StationChartsYear"
          id="top_Right_Card_StationChartsYear"
        ></div>
        <div
          class="top_Right_Card_StationChartsAll"
          v-show="radioData == '总'"
          style="height: 74%; width: 98%"
          ref="top_Right_Card_StationChartsAll"
          id="top_Right_Card_StationChartsAll"
        ></div>
      </el-card>
    </div>
    <div class="bottom">
      <div class="bottom_Left_Card">
        <el-card class="bottom_Left_Card_Station">
          <div class="bottom_Left_Card_Station1">
            <span>电站运行状态</span>
            <img src="../pluginTemp/images/Group 633.png" width="27px" height="25px" alt="" />
            <span class="span2">{{ this.queryLeftDataRes.run_status }}</span>
          </div>
          <div class="bottom_Left_Card_Station2">
            <span>逆变器</span>
            <div class="colorText_Array">
              <div class="colorText green">正常<br />{{ this.queryLeftDataRes.normal }}台</div>
              <div class="colorText yellow">异常<br />{{ this.queryLeftDataRes.abnormal }}台</div>
              <div class="colorText">离线<br />{{ this.queryLeftDataRes.offLine }}台</div>
            </div>
          </div>
        </el-card>
        <el-card class="bottom_Left_Card_Station_Use">
          <div>当日发电量：</div>
          <div style="float: right; margin-bottom: 3px; text-align: right">
            {{
              this.queryLeftDataRes.power_output_d / 10000 > 1
                ? (this.queryLeftDataRes.power_output_d / 10000).toFixed(2) + "万kWh/"
                : this.queryLeftDataRes.power_output_d + "kWh/"
            }}
            {{ this.queryLeftDataRes.equivalent_hours_d }} h
          </div>
          <div>当月发电量：</div>
          <div style="float: right; margin-bottom: 3px; text-align: right">
            {{
              this.queryLeftDataRes.power_output_m / 10000 > 1
                ? (this.queryLeftDataRes.power_output_m / 10000).toFixed(2) + "万kWh/"
                : this.queryLeftDataRes.power_output_m + "kWh/"
            }}
            {{ this.queryLeftDataRes.equivalent_hours_m }} h
          </div>
          <div>当年发电量：</div>
          <div style="float: right; margin-bottom: 3px; text-align: right">
            {{
              this.queryLeftDataRes.power_output_y / 10000 > 1
                ? (this.queryLeftDataRes.power_output_y / 10000).toFixed(2) + "万kWh/"
                : this.queryLeftDataRes.power_output_y + "kWh/"
            }}
            {{ this.queryLeftDataRes.equivalent_hours_y }} h
          </div>
          <div>累计发电量：</div>
          <div style="float: right; margin-bottom: 3px; text-align: right">
            {{
              this.queryLeftDataRes.power_output_all / 10000 > 1
                ? (this.queryLeftDataRes.power_output_all / 10000).toFixed(2) + "万kWh/"
                : this.queryLeftDataRes.power_output_all + "kWh/"
            }}
            {{ this.queryLeftDataRes.equivalent_hours_all }} h
          </div>
        </el-card>
      </div>
      <el-card class="bottom_Right_Card">
        <span class="bottom_Right_Card_Title">┃ 事件列表</span>
        <hr />
        <div class="bottom_Right_Card_ButtonArray">
          <div class="blueButton" @click="sureTrue">确认无故障</div>
          <div class="blueButton" @click="notDefine">暂不处理</div>
          <div class="blueButton" @click="bugUp">缺陷上报</div>
        </div>
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          max-height="245px"
          stripe
          :header-cell-style="{ background: '#F2F3F5', color: '#000000', padding: '3px 0' }"
        >
          <el-table-column align="center" type="selection" width="40"> </el-table-column>
          <el-table-column align="center" type="index" width="48" label="序号"> </el-table-column>
          <el-table-column align="center" sortable prop="occur_time" label="发生时间" class-name="flexCenter" width="140">
            <template slot-scope="scope">
              {{ formatDateHMS(scope.row.occur_time) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="station_name" label="电站名称" width="130"> </el-table-column>
          <el-table-column align="center" prop="equipment_name" label="设备名称" width="80"> </el-table-column>
          <el-table-column align="center" prop="emergency_content" label="事件内容"> </el-table-column>
          <el-table-column align="center" prop="emergency_level" label="告警等级" width="80"> </el-table-column>
          <el-table-column align="center" prop="collect_type" label="告警来源" width="80"> </el-table-column>
          <el-table-column align="center" prop="emergency_status" label="处理状态" width="80"> </el-table-column>
          <el-table-column align="center" label="查看图表" width="80">
            <template slot-scope="scope">
              <div class="blueButtonTable" @click="goCharts(scope.row)">图表</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom_Right_Card_Pagination">
          <span>共{{ this.total }}条记录</span>
          <el-pagination background layout="prev, pager, next" :total="total" :page-size="5" @current-change="handleCurrentChange"> </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { Card, DatePicker, Radio, RadioButton, RadioGroup, Table, TableColumn, Pagination } from "element-ui";
import Vue from "vue";
import Utils from "./utils";
import { getWeather, queryLeftData, queryPowerData, queryGeneratingCapacity, queryApplyTable, queryViewTableInfo, longitudeAndLatitude, buttonUpdateDataList } from "./api/asset";
import "./index.css";
import Qs from "qs";
Vue.use(Card);
Vue.use(DatePicker);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style");
          document.head.appendChild(this.styleEle);
          this.styleEle.innerText = style;
        }
      });
      return {
        themeColor,
        textColor,
      };
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      radioData: "日",
      pageNum: 1,
      total: 0,
      powerData: [],
      electricData: [],
      electricDataMon: [],
      electricDataYear: [],
      electricDataAll: [],
      powerDatePick: new Date(),
      electricDatePickMon: new Date(),
      electricDatePickYear: new Date(),
      electricDatePick: new Date(),
      tableData: [],
      queryLeftDataRes: {},
      startData: [],
      latitude: "",
      longitude: "",
      multipleSelection: "",
      tableColData: {},
      stationID: "",
    };
  },
  mounted() {
    //业务代码
    this.powerDatePick = this.formatDate(this.powerDatePick);
    this.electricDatePick = this.formatDate(this.electricDatePick);
    this.electricDatePickMon = this.formatDateMon(this.electricDatePickMon);
    this.electricDatePickYear = this.formatDateYear(this.electricDatePickYear);
    this.connectWS();
    this.longitudeAndLatitude();
    this.queryLeftData();
    this.queryPowerData();
    this.queryGeneratingCapacity();
    // this.queryGeneratingCapacityMon();
    // this.queryGeneratingCapacityYear();
    // this.queryGeneratingCapacityAll();
    this.queryApplyTableData();
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
    //用于定义接收用户输入
    this.buttons = JSON.parse(buttons).data;
    this.defaultValue = JSON.parse(buttons).defaultValue;
  },
  methods: {
    radioChange(val) {
      console.log(val);
      if (val == "日") {
        this.queryGeneratingCapacity();
      } else if (val == "月") {
        this.queryGeneratingCapacityMon();
      } else if (val == "年") {
        this.queryGeneratingCapacityYear();
      } else if (val == "总") {
        this.queryGeneratingCapacityAll();
      }
    },
    goOneLine() {
      window.PubSub.publish("menuClick", {
        key: `${this.customConfig.一次接线图跳转}`,
        isSubMenu: 1,
        pubsubParams: "",
      });
    },
    goCallMore() {
      window.PubSub.publish("menuClick", {
        key: `${this.customConfig.通讯拓补图跳转}`,
        isSubMenu: 1,
        pubsubParams: "",
      });
    },
    goCharts(row) {
      window.PubSub.publish("menuClick", {
        key: `${this.customConfig.图例跳转}`,
        isSubMenu: 1,
        pubsubParams: Qs.stringify({
          SearchTreeSelectedKey: row.id,
        }),
      });
      this.triggerEvent(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sureTrue() {
      let message = {
        params: {
          form_id: this.tableColData.components[0].form_id,
        },
        data: {
          replaceCols: [],
        },
      };

      this.multipleSelection.forEach((item, index) => {
        let info = {
          childrenColumnList: [],
          queryCondition: {
            queryParams: [{}],
          },
          masterColumnList: [{}, {}],
        };
        info.masterColumnList[0] = JSON.parse(this.tableColData.queryColumn.formViewButtons[0].response_detail).query[0];
        info.masterColumnList[1].asset_id = JSON.parse(this.tableColData.queryColumn.formViewButtons[0].response_detail).query[0].asset_id;
        info.masterColumnList[1].col_datatype = JSON.parse(this.tableColData.queryColumn.formViewButtons[0].response_detail).query[0].col_datatype;
        info.masterColumnList[1].col_name = "data_id";
        info.masterColumnList[1].col_value = item.data_id;
        info.queryCondition.queryParams[0].colName = "data_id";
        info.queryCondition.queryParams[0].value = item.data_id;
        message.data.replaceCols.push(info);
      });
      buttonUpdateDataList(message).then((res) => {
        this.queryApplyTableData();
      });
    },
    notDefine() {
      let message = {
        params: {
          form_id: this.tableColData.components[0].form_id,
        },
        data: {
          replaceCols: [],
        },
      };

      this.multipleSelection.forEach((item, index) => {
        let info = {
          childrenColumnList: [],
          queryCondition: {
            queryParams: [{}],
          },
          masterColumnList: [{}, {}],
        };
        info.masterColumnList[0] = JSON.parse(this.tableColData.queryColumn.formViewButtons[1].response_detail).query[0];
        info.masterColumnList[1].asset_id = JSON.parse(this.tableColData.queryColumn.formViewButtons[1].response_detail).query[0].asset_id;
        info.masterColumnList[1].col_datatype = JSON.parse(this.tableColData.queryColumn.formViewButtons[1].response_detail).query[0].col_datatype;
        info.masterColumnList[1].col_name = "data_id";
        info.masterColumnList[1].col_value = item.data_id;
        info.queryCondition.queryParams[0].colName = "data_id";
        info.queryCondition.queryParams[0].value = item.data_id;
        message.data.replaceCols.push(info);
      });
      buttonUpdateDataList(message).then((res) => {
        this.queryApplyTableData();
      });
    },
    bugUp() {
      let message = {
        params: {
          form_id: this.tableColData.components[0].form_id,
        },
        data: {
          replaceCols: [],
        },
      };

      this.multipleSelection.forEach((item, index) => {
        let info = {
          childrenColumnList: [],
          queryCondition: {
            queryParams: [{}],
          },
          masterColumnList: [{}, {}],
        };
        info.masterColumnList[0] = JSON.parse(this.tableColData.queryColumn.formViewButtons[2].response_detail).query[0];
        info.masterColumnList[1].asset_id = JSON.parse(this.tableColData.queryColumn.formViewButtons[2].response_detail).query[0].asset_id;
        info.masterColumnList[1].col_datatype = JSON.parse(this.tableColData.queryColumn.formViewButtons[2].response_detail).query[0].col_datatype;
        info.masterColumnList[1].col_name = "data_id";
        info.masterColumnList[1].col_value = item.data_id;
        info.queryCondition.queryParams[0].colName = "data_id";
        info.queryCondition.queryParams[0].value = item.data_id;
        message.data.replaceCols.push(info);
      });
      buttonUpdateDataList(message).then((res) => {
        this.queryApplyTableData();
      });
    },
    longitudeAndLatitude() {
      let message = {
        stationId: this.stationID,
      };
      let message2 = {
        longitude: 112.982951,
        latitude: 28.116007,
        address: "湖南省",
      };
      getWeather(message2).then((resp) => {
        console.log(resp);
      });
      longitudeAndLatitude(message).then((res) => {
        this.longitude = res.data.longitude;
        this.latitude = res.data.latitude;
      });
    },
    queryLeftData() {
      let message = {
        stationId: this.stationID,
      };
      queryLeftData(message).then((res) => {
        console.log(res);
        this.queryLeftDataRes = res.data;
      });
    },
    queryPowerData() {
      let message = {
        stationId: this.stationID,
        time: this.powerDatePick,
      };
      queryPowerData(message).then((res) => {
        let xData = [];
        let yData = [];
        res.data.forEach((element) => {
          xData.push(element.sub_time);
          yData.push(element.AC_active_power);
          this.powerData.push({
            时间: element.sub_time,
            发电功率: element.AC_active_power,
          });
        });
        this.top_Center_Card_StationCharts(xData, yData);
      });
    },
    queryGeneratingCapacity() {
      let message = {
        stationId: this.stationID,
        time: this.electricDatePick,
      };
      queryGeneratingCapacity(message).then((res) => {
        let xData = [];
        let yData = [];
        let yData2 = [];
        res.data.forEach((element) => {
          xData.push(element.sub_time);
          yData.push(element.power_output_h);
          yData2.push(element.equivalent_hours_h);
          this.electricData.push({
            时间: element.sub_time,
            发电量: element.power_output_h,
            等效时数: element.equivalent_hours_h,
          });
          this.top_Right_Card_StationCharts(xData, yData, yData2);
        });
      });
    },
    queryGeneratingCapacityMon() {
      let message = {
        stationId: this.stationID,
        time: this.electricDatePickMon,
      };
      queryGeneratingCapacity(message).then((res) => {
        let xData = [];
        let yData = [];
        let yData2 = [];
        res.data.forEach((element) => {
          xData.push(element.sub_time);
          yData.push(element.power_output_d);
          yData2.push(element.equivalent_hours_d);
          this.electricDataMon.push({
            时间: element.sub_time,
            发电量: element.power_output_d,
            等效时数: element.equivalent_hours_d,
          });
          this.top_Right_Card_StationChartsMon(xData, yData, yData2);
        });
      });
    },
    queryGeneratingCapacityYear() {
      let message = {
        stationId: this.stationID,
        time: this.electricDatePickYear,
      };
      queryGeneratingCapacity(message).then((res) => {
        let xData = [];
        let yData = [];
        let yData2 = [];
        res.data.forEach((element) => {
          xData.push(element.sub_time);
          yData.push(element.power_output_m);
          yData2.push(element.equivalent_hours_m);
          this.electricDataYear.push({
            时间: element.sub_time,
            发电量: element.power_output_m,
            等效时数: element.equivalent_hours_m,
          });
          this.top_Right_Card_StationChartsYear(xData, yData, yData2);
        });
      });
    },
    queryGeneratingCapacityAll() {
      let message = {
        stationId: this.stationID,
        time: "",
      };
      queryGeneratingCapacity(message).then((res) => {
        let xData = [];
        let yData = [];
        let yData2 = [];
        res.data.forEach((element) => {
          xData.push(element.sub_time);
          yData.push(element.power_output_y);
          yData2.push(element.equivalent_hours_y);
          this.electricDataAll.push({
            时间: element.sub_time,
            发电量: element.power_output_y,
            等效时数: element.equivalent_hours_y,
          });
          this.top_Right_Card_StationChartsAll(xData, yData, yData2);
        });
      });
    },
    top_Center_Card_StationCharts(xData, yData) {
      const myChart = this.$echarts.init(this.$refs.top_Center_Card_StationCharts);
      myChart.resize();
      let dataX = xData;
      let dataY = yData;
      const option = {
        color: ["#47A2FF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return dataX[params[0].dataIndex] + "<br/>" + params[0].marker + "发电功率" + dataY[params[0].dataIndex] + "kW";
          },
        },
        grid: {
          left: "0%",
          right: "4%",
          bottom: "7%",
          top: "60px",
          containLabel: true,
        },
        legend: {
          data: ["发电功率"],
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#B8B8B8",
            },
          },
          axisLabel: {
            fontSize: 12,
            color: "#000",
            interval: 0,
            formatter: function (value, index) {
              if (index % 48 == 0) {
                return value;
              }
            },
          },
          axisTick: {
            show: false,
          },
          data: dataX,
        },
        yAxis: {
          type: "value",
          min: 0,
          minInterval: 1,
          name: "单位（kW）",
          nameTextStyle: {
            fontSize: 12,
            color: "#000",
            padding: [0, 0, 0, 30], // 上右下左与原位置距离
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#EBEBEB",
            },
          },
          splitArea: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#B8B8B8",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
            fontFamily: "Bebas",
            color: "#000",
          },
        },
        series: [
          {
            type: "line",
            showSymbol: false,
            symbol: "circle",
            smooth: true,
            name: "发电功率", // 图例对应类别
            data: dataY, // 纵坐标数据
          },
        ],
      };
      myChart.setOption(option);
    },
    top_Right_Card_StationCharts(xData, yData, yData2) {
      const myChart = this.$echarts.init(this.$refs.top_Right_Card_StationCharts);
      myChart.resize();
      let dataX = xData;
      let dataY = yData;
      let dataY2 = yData2;
      var option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return `${dataX[params[0].dataIndex]}<br/>${params[0].marker}发电量：${
              dataY[params[0].dataIndex] / 10000 > 1 ? (dataY[params[0].dataIndex] / 10000).toFixed(2) + "万kWh" : dataY[params[0].dataIndex] + "kWh"
            }<br>${params[1].marker}等效时数：${dataY2[params[0].dataIndex]}h`;
          },
        },
        grid: {
          top: "60px",
          bottom: "7%",
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        legend: {
          data: ["发电量", "等效时数"],
          textStyle: {
            padding: [4, 0, 0, 0],
            color: "#000",
          },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 25,
        },
        xAxis: {
          type: "category",
          data: dataX,
          axisLine: {
            lineStyle: {
              color: "#B8B8B8",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#000",
            },
            interval: 0,
            formatter: function (value, index) {
              if (index % 3 == 0) {
                return value;
              }
            },
          },
        },

        yAxis: [
          {
            type: "value",
            name: "单位（kWh）",
            type: "value",
            nameTextStyle: {
              color: "#000",
            },
            axisLabel: {
              textStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#EBEBEB",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B8B8B8",
              },
            },
          },
          {
            type: "value",
            name: "单位（h）",
            nameTextStyle: {
              color: "#000",
              padding: [0, -10, 0, 30], // 上右下左与原位置距离
            },
            scale: false,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              formatter: "{value}", //右侧Y轴文字显示
              textStyle: {
                fontSize: 12,
                color: "#000",
              },
            },
          },
        ],
        series: [
          {
            name: "发电量",
            type: "bar",
            barWidth: "12px",
            data: dataY,
            itemStyle: {
              color: "#6CB4EA",
            },
          },
          {
            name: "等效时数",
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: false, //平滑曲线显示
            symbol: "circle", //标记的图形为实心圆
            itemStyle: {
              normal: {
                color: "#ffa43a",
                borderColor: "#ffa43a", //圆点透明 边框
                borderWidth: 5,
              },
            },
            lineStyle: {
              color: "#ffa43a",
            },
            data: dataY2,
          },
        ],
      };
      myChart.setOption(option);
    },
    top_Right_Card_StationChartsMon(xData, yData, yData2) {
      const myChart = this.$echarts.init(this.$refs.top_Right_Card_StationChartsMon);
      myChart.resize();
      let dataX = xData;
      let dataY = yData;
      let dataY2 = yData2;
      var option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return `${dataX[params[0].dataIndex]}<br/>${params[0].marker}发电量：${
              dataY[params[0].dataIndex] / 10000 > 1 ? (dataY[params[0].dataIndex] / 10000).toFixed(2) + "万kWh" : dataY[params[0].dataIndex] + "kWh"
            }<br>${params[1].marker}等效时数：${dataY2[params[0].dataIndex]}h`;
          },
        },
        grid: {
          top: "60px",
          bottom: "7%",
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        legend: {
          data: ["发电量", "等效时数"],
          textStyle: {
            padding: [4, 0, 0, 0],
            color: "#000",
          },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 25,
        },
        xAxis: {
          type: "category",
          data: dataX,
          axisLine: {
            lineStyle: {
              color: "#B8B8B8",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#000",
            },
            interval: 1,
          },
        },

        yAxis: [
          {
            type: "value",
            name: "单位（kWh）",
            type: "value",
            nameTextStyle: {
              color: "#000",
            },
            axisLabel: {
              textStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#EBEBEB",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B8B8B8",
              },
            },
          },
          {
            type: "value",
            name: "单位（h）",
            nameTextStyle: {
              color: "#000",
              padding: [0, -10, 0, 30], // 上右下左与原位置距离
            },
            scale: false,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              formatter: "{value}", //右侧Y轴文字显示
              textStyle: {
                fontSize: 12,
                color: "#000",
              },
            },
          },
        ],
        series: [
          {
            name: "发电量",
            type: "bar",
            barWidth: "12px",
            data: dataY,
            itemStyle: {
              color: "#6CB4EA",
            },
          },
          {
            name: "等效时数",
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: false, //平滑曲线显示
            symbol: "circle", //标记的图形为实心圆
            itemStyle: {
              normal: {
                color: "#ffa43a",
                borderColor: "#ffa43a", //圆点透明 边框
                borderWidth: 5,
              },
            },
            lineStyle: {
              color: "#ffa43a",
            },
            data: dataY2,
          },
        ],
      };
      myChart.setOption(option);
    },
    top_Right_Card_StationChartsYear(xData, yData, yData2) {
      const myChart = this.$echarts.init(this.$refs.top_Right_Card_StationChartsYear);
      myChart.resize();
      let dataX = xData;
      let dataY = yData;
      let dataY2 = yData2;
      var option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return `${dataX[params[0].dataIndex]}<br/>${params[0].marker}发电量：${
              dataY[params[0].dataIndex] / 10000 > 1 ? (dataY[params[0].dataIndex] / 10000).toFixed(2) + "万kWh" : dataY[params[0].dataIndex] + "kWh"
            }<br>${params[1].marker}等效时数：${dataY2[params[0].dataIndex]}h`;
          },
        },
        grid: {
          top: "60px",
          bottom: "7%",
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        legend: {
          data: ["发电量", "等效时数"],
          textStyle: {
            padding: [4, 0, 0, 0],
            color: "#000",
          },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 25,
        },
        xAxis: {
          type: "category",
          data: dataX,
          axisLine: {
            lineStyle: {
              color: "#B8B8B8",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#000",
            },
            interval: 0,
          },
        },

        yAxis: [
          {
            type: "value",
            name: "单位（kWh）",
            type: "value",
            nameTextStyle: {
              color: "#000",
            },
            axisLabel: {
              textStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#EBEBEB",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B8B8B8",
              },
            },
          },
          {
            type: "value",
            name: "单位（h）",
            nameTextStyle: {
              color: "#000",
              padding: [0, -10, 0, 30], // 上右下左与原位置距离
            },
            scale: false,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              formatter: "{value}", //右侧Y轴文字显示
              textStyle: {
                fontSize: 12,
                color: "#000",
              },
            },
          },
        ],
        series: [
          {
            name: "发电量",
            type: "bar",
            barWidth: "12px",
            data: dataY,
            itemStyle: {
              color: "#6CB4EA",
            },
          },
          {
            name: "等效时数",
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: false, //平滑曲线显示
            symbol: "circle", //标记的图形为实心圆
            itemStyle: {
              normal: {
                color: "#ffa43a",
                borderColor: "#ffa43a", //圆点透明 边框
                borderWidth: 5,
              },
            },
            lineStyle: {
              color: "#ffa43a",
            },
            data: dataY2,
          },
        ],
      };
      myChart.setOption(option);
    },
    top_Right_Card_StationChartsAll(xData, yData, yData2) {
      const myChart = this.$echarts.init(this.$refs.top_Right_Card_StationChartsAll);
      myChart.resize();
      let dataX = xData;
      let dataY = yData;
      let dataY2 = yData2;
      var option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return `${dataX[params[0].dataIndex]}<br/>${params[0].marker}发电量：${
              dataY[params[0].dataIndex] / 10000 > 1 ? (dataY[params[0].dataIndex] / 10000).toFixed(2) + "万kWh" : dataY[params[0].dataIndex] + "kWh"
            }<br>${params[1].marker}等效时数：${dataY2[params[0].dataIndex]}h`;
          },
        },
        grid: {
          top: "60px",
          bottom: "7%",
          left: "5%",
          right: "5%",
          containLabel: true,
        },
        legend: {
          data: ["发电量", "等效时数"],
          textStyle: {
            padding: [4, 0, 0, 0],
            color: "#000",
          },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 25,
        },
        xAxis: {
          type: "category",
          data: dataX,
          axisLine: {
            lineStyle: {
              color: "#B8B8B8",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#000",
            },
            interval: 0,
          },
        },

        yAxis: [
          {
            type: "value",
            name: "单位（kWh）",
            type: "value",
            nameTextStyle: {
              color: "#000",
            },
            axisLabel: {
              textStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#EBEBEB",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B8B8B8",
              },
            },
          },
          {
            type: "value",
            name: "单位（h）",
            nameTextStyle: {
              color: "#000",
              padding: [0, -10, 0, 30], // 上右下左与原位置距离
            },
            scale: false,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#000",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              formatter: "{value}", //右侧Y轴文字显示
              textStyle: {
                fontSize: 12,
                color: "#000",
              },
            },
          },
        ],
        series: [
          {
            name: "发电量",
            type: "bar",
            barWidth: "12px",
            data: dataY,
            itemStyle: {
              color: "#6CB4EA",
            },
          },
          {
            name: "等效时数",
            type: "line",
            yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: false, //平滑曲线显示
            symbol: "circle", //标记的图形为实心圆
            itemStyle: {
              normal: {
                color: "#ffa43a",
                borderColor: "#ffa43a", //圆点透明 边框
                borderWidth: 5,
              },
            },
            lineStyle: {
              color: "#ffa43a",
            },
            data: dataY2,
          },
        ],
      };
      myChart.setOption(option);
    },
    async queryApplyTableData() {
      let message = {
        pageNum: this.pageNum,
        pageSize: 5,
        orderBy: "occur_time,emergency_status",
        orderSort: "DESC,DESC",
        queryParams: [],
        variables: [],
      };
      for (let k in this.getSearch(window.location.search)) {
        message.variables.push({
          variable_name: k,
          variable_value: this.getSearch(window.location.search)[k],
        });
      }
      let params = {
        view_id: `${this.customConfig.view_id}`,
      };
      await queryViewTableInfo(params).then(async (res) => {
        console.log(res.data.components);

        this.tableData = [];
        let query = {
          view_id: `${this.customConfig.view_id}`,
          data: message,
        };
        await this.queryApplyTable(query);
        this.startData.forEach((item, index) => {
          let info = {
            occur_time: "",
            station_name: "",
            equipment_name: "",
            emergency_content: "",
            emergency_level: "",
            collect_type: "",
            emergency_status: "",
            data_id: "",
            id: "id",
          };
          this.tableColData = res.data;
          res.data.components.forEach((itemSon, itemIndex) => {
            console.log(itemSon);
            if (itemSon.columnStyle.title == "发生时间") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.occur_time = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "电站名称") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.station_name = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "设备名称") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.equipment_name = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "事件内容") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.emergency_content = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "告警等级") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.emergency_level = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "告警来源") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.collect_type = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "状态") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.emergency_status = item[k];
                }
              }
            }
            if (itemSon.columnStyle.title == "设备ID") {
              for (let k in item) {
                if (itemSon.id == k) {
                  info.id = item[k];
                }
              }
            }
            info.data_id = item.data_id || "";
          });
          this.tableData.push(info);
        });
        console.log(this.tableData);
      });
    },
    async queryApplyTable(message) {
      let res = await queryApplyTable(message);
      console.log(res.data.results);
      this.startData = res.data.results;
      this.total = res.data.totalCount;
    },
    connectWS() {
      let websocket;
      try {
        let userid = window?.currentUser ? window?.currentUser.id : "1234567890";
        // let url = `ws://${window.location.host}/sdata/webSocket/` + userid;
        let url = `ws://122.112.210.100:15933/`;
        console.log("-----前端开始连接websocket-----", url);
        websocket = new WebSocket(url);
        websocket.onerror = (e) => {
          console.log(e);
        };
        websocket.onopen = () => {
          console.log("连接成功");
          let timer = setInterval(() => {
            console.log("心跳");
            this.queryPowerData();
            this.queryGeneratingCapacity();
            this.queryGeneratingCapacityMon();
            this.queryGeneratingCapacityYear();
            this.queryGeneratingCapacityAll();
            let ping = { type: "ping" };
            websocket.send(JSON.stringify(ping));
          }, 5000);
        };
        websocket.onmessage = (event) => {
          console.log("onmessage");
        };
        window.onbeforeunload = () => {
          closeWebSocket();
        };
        websocket.onclose = (e) => {
          console.log("连接关闭");
          console.log("websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean);
          let timer = null;
          if (e.code * 1 === 1000 || e.code * 1 === 1006) {
            console.log("尝试重连");
            this.connectWS();
          }
        };
        function closeWebSocket() {
          websocket.close();
          websocket = null;
        }
      } catch (error) {
        console.log("e", error);
      }
    },
    exportElectric() {
      let message = {};
      if (this.radioData == "日") {
        message = this.electricData;
      } else if (this.radioData == "月") {
        message = this.electricDataMon;
      } else if (this.radioData == "年") {
        message = this.electricDataYear;
      } else if (this.radioData == "总") {
        message = this.electricDataAll;
      }
      const headArr = Object.keys(message[0]); // 要导出的json数据 // 列标题
      let str = "<tr>";
      headArr.forEach((item, index) => {
        str += index == headArr.length - 1 ? `<td>${item}</td></tr>` : `<td>${item}</td>`;
      }); // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < message.length; i++) {
        str += "<tr>";
        for (const key of headArr) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${message[i][key] + "\t"}</td>`;
        }
        str += "</tr>";
      } // Worksheet名
      const worksheet = "Sheet1";
      const uri = "data:application/vnd.ms-excel;base64,"; // 下载的表格模板数据
      const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`; // 下载模板 // 输出base64编码
      const base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      };
      const format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };
      const a = document.createElement("a");
      a.href = uri + base64(format(template));
      a.download = "发电量" + ".xls";
      a.click();
    },
    exportPower() {
      const headArr = Object.keys(this.powerData[0]); // 要导出的json数据 // 列标题
      let str = "<tr>";
      headArr.forEach((item, index) => {
        str += index == headArr.length - 1 ? `<td>${item}</td></tr>` : `<td>${item}</td>`;
      }); // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < this.powerData.length; i++) {
        str += "<tr>";
        for (const key of headArr) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${this.powerData[i][key] + "\t"}</td>`;
        }
        str += "</tr>";
      } // Worksheet名
      const worksheet = "Sheet1";
      const uri = "data:application/vnd.ms-excel;base64,"; // 下载的表格模板数据
      const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`; // 下载模板 // 输出base64编码
      const base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      };
      const format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };
      const a = document.createElement("a");
      a.href = uri + base64(format(template));
      a.download = "功率" + ".xls";
      a.click();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.queryApplyTableData();
    },
    formatDate(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + "-";
      const M = date.getMonth() + 1 + "-";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D;
    },
    formatDateMon(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + "-";
      const M = date.getMonth() + 1 + "";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M;
    },
    formatDateYear(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + "";
      const M = date.getMonth() + 1 + "-";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y;
    },
    formatDateHMS(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + ".";
      const M = date.getMonth() + 1 + ".";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D + h + m + s;
    },
    getSearch(str) {
      if (!str) {
        return;
      }
      str = str.slice(1);
      let obj = {};
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("=");
        obj[arr[i][0]] = arr[i][1];
      }
      return obj;
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(data) {
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.customConfig.componentId, "stationInfo", {
          value: data,
        });
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue({ value }) {
      this.setValue(value);
    },
    setValue(value) {
      this.stationID = value;
      this.connectWS();
      this.longitudeAndLatitude();
      this.queryLeftData();
      this.queryPowerData();
      this.queryGeneratingCapacity();
      this.queryGeneratingCapacityMon();
      this.queryGeneratingCapacityYear();
      this.queryGeneratingCapacityAll();
      this.queryApplyTableData();
    },
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle);
  },
};
</script>
<style lang="less" scoped>
.topStation {
  height: 43.9vh;
  width: 100%;
  background: rgba(240, 242, 245, 1);
  display: flex;
  .top_Left_Card {
    width: 20%;
    height: 100%;
    margin-right: 14px;
    .top_Left_Card_Station_Name {
      height: 11%;
      width: 100%;
      margin-bottom: 15px;
      /deep/.el-card__body {
        padding: 15px 2px 15px 18px;
      }
    }
    .top_Left_Card_ButtonArray {
      height: 20.5%;
      width: 100%;
      margin-bottom: 15px;
      .blueButton {
        width: 110px;
        height: 30px;
        border-radius: 2px;
        background: #0084ff;
        margin-bottom: 2%;
        color: rgba(255, 255, 255, 1);
        font-size: 16px;
        font-weight: 500;
        font-family: "Alibaba PuHuiTi";
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
      /deep/.el-card__body {
        padding: 15px 15px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
    .top_Left_Card_Station_Info {
      height: 35.5%;
      width: 100%;
      margin-bottom: 15px;
      /deep/.el-card__body {
        padding: 15px 18px;
      }
      div {
        margin-bottom: 8px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        font-weight: 400;
        font-family: "Alibaba PuHuiTi";
        text-indent: -3em;
        margin-left: 3em;
      }
    }
    .top_Left_Card_Weather {
      width: 100%;
      height: 22.5%;
      /deep/.el-card__body {
        padding: 10px 20px 10px 14px;
      }
      div {
        margin-bottom: 8px;
      }
    }
  }
  .top_Center_Card {
    width: 39%;
    // height: 100% ;
    background: #fff;
    margin-right: 15px;
    /deep/.el-card__body {
      padding: 13px 23px;
      height: 100%;
    }
    .top_Center_Card_Title {
      color: rgba(0, 132, 255, 1);
      font-size: 22px;
      font-weight: 700;
      font-family: "Alibaba PuHuiTi";
    }
    hr {
      margin-top: 13px;
      margin-bottom: 14px;
      border-color: rgba(231, 231, 231, 1);
    }
    .top_Center_Card_Date_Operation {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .top_Center_Card_Date_Box {
        height: 32px;
        display: flex;
        .top_Center_Card_Date {
          width: 133px;
          height: 32px;
        }
        /deep/.el-input__inner {
          height: 32px;
          background: rgba(239, 240, 243, 1);
          border-radius: 1px;
        }
        /deep/.el-input__prefix {
          display: none;
        }
        /deep/.el-input--prefix .el-input__inner {
          padding-left: 13px;
        }
      }
    }
  }
  .top_Right_Card {
    width: 39%;
    // height: 100%;
    background: #fff;
    /deep/.el-card__body {
      padding: 13px 23px;
      height: 100%;
    }
    .top_Right_Card_Title {
      color: rgba(0, 132, 255, 1);
      font-size: 22px;
      font-weight: 700;
      font-family: "Alibaba PuHuiTi";
    }
    hr {
      margin-top: 13px;
      margin-bottom: 14px;
      border-color: rgba(231, 231, 231, 1);
    }
    .top_Right_Card_Date_Operation {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      /deep/.el-radio-button--mini .el-radio-button__inner {
        padding: 9px 12px;
      }
      /deep/.el-radio-button:first-child .el-radio-button__inner,
      /deep/.el-radio-button:last-child .el-radio-button__inner {
        border-radius: 2px;
      }
      /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #0084ff;
        background: #fff;
        border-color: #0084ff;
      }
      .top_Right_Card_Date_Box {
        height: 32px;
        display: flex;
        .top_Right_Card_Date {
          width: 133px;
          height: 32px;
        }

        /deep/.el-input__inner {
          height: 32px;
          background: rgba(239, 240, 243, 1);
          border-radius: 1px;
        }
        /deep/.el-input__prefix {
          display: none;
        }
        /deep/.el-input--prefix .el-input__inner {
          padding-left: 13px;
        }
      }
    }
  }
}
.bottom {
  height: 41vh;
  width: 100%;
  background: rgba(240, 242, 245, 1);
  display: flex;
  margin-top: 15px;
  .bottom_Left_Card {
    // height: calc(100% - 20px);
    width: 20%;
    margin-right: 15px;
    .bottom_Left_Card_Station {
      height: 40%;
      width: 100%;
      margin-bottom: 15px;
      /deep/.el-card__body {
        padding: 15px;
      }
      .bottom_Left_Card_Station1 {
        margin-bottom: 5%;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        span {
          margin-left: 15px;
        }
        .span2 {
          margin-left: 0px;
          margin-right: 15px;
        }
        img {
          margin-top: 12px;
          margin-left: 10px;
        }
      }
      .bottom_Left_Card_Station2 {
        display: flex;
        justify-content: space-between;
        span {
          line-height: 50px;
          margin-left: 15px;
        }
        .colorText_Array {
          display: flex;
          justify-content: space-around;
          width: 70%;
          margin-top: 5px;
          .green {
            color: #44d49e;
          }
          .yellow {
            color: #ff8a00;
          }
          .colorText {
            width: 55px;
            height: 40px;
          }
        }
      }
      .bottom_Left_Card_Station1,
      .bottom_Left_Card_Station2 {
        width: calc(100% - 10px);
        height: 50px;
        border-radius: 4px;
        border: 1px solid rgba(208, 218, 228, 1);
      }
    }
    .bottom_Left_Card_Station_Use {
      width: 100%;
      height: 56.5%;
      /deep/.el-card__body {
        padding: 11px 15px;
      }
      div {
        width: 100%;
      }
    }
  }
  .bottom_Right_Card {
    width: 79%;
    /deep/.el-card__body {
      padding: 13px 35px;
    }
    .bottom_Right_Card_Title {
      color: rgba(0, 132, 255, 1);
      font-size: 22px;
      font-weight: 700;
      font-family: "Alibaba PuHuiTi";
    }
    hr {
      margin-top: 13px;
      margin-bottom: 15px;
      border-color: rgba(231, 231, 231, 1);
    }
    .blueButtonTable {
      width: 50px;
      height: 24px;
      border-radius: 2px;
      background: #0084ff;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      font-weight: 500;
      font-family: "Alibaba PuHuiTi";
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      margin: auto;
    }

    .bottom_Right_Card_ButtonArray {
      display: flex;
      .blueButton {
        width: 110px;
        height: 30px;
        border-radius: 2px;
        background: #0084ff;
        margin-bottom: 10px;
        margin-right: 10px;
        color: rgba(255, 255, 255, 1);
        font-size: 16px;
        font-weight: 500;
        font-family: "Alibaba PuHuiTi";
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    }
    .bottom_Right_Card_Pagination {
      height: 32px;
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
      span {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        font-weight: 400;
        font-family: "Alibaba PuHuiTi";
        line-height: 32px;
      }
      /deep/.el-pagination .active {
        background: #1b85ff;
      }
      /deep/.el-table__cell {
        border-bottom: 1px solid red !important;
      }
    }
  }
}
/deep/.el-table__row--striped {
  td {
    background: rgba(0, 132, 255, 0.1) !important;
  }
}
/deep/.el-input__icon {
  line-height: 35px;
}
/deep/.el-table .el-table__cell {
  padding: 2px 0;
}
/deep/.el-table__body-wrapper {
  .cell {
    font-size: 12px;
    line-height: 14px;
  }
}
/deep/.el-table .el-table__cell.gutter {
  background: #f2f3f5;
}
/deep/.el-table .warning-row {
  background: oldlace;
}
/deep/.el-card {
  border: 0px;
}
</style>
<style>
.flexCenter {
  padding: 4px 0px 1px 0px !important;
}
</style>
