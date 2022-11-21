<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%;height: 100%" :ref="id">
    <div class="inverter">
      <div class="inverter_information">
        <el-descriptions :column="4" labelClassName="information_title" contentClassName="information_content">
          <el-descriptions-item label="逆变器名称">{{ equipmentInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="设备厂家">{{ equipmentInfo.equipment_name }}</el-descriptions-item>
          <el-descriptions-item label="设备型号">{{ equipmentInfo.equipment_model }}</el-descriptions-item>
          <el-descriptions-item label="SN号">{{ equipmentInfo.equipment_pid }} </el-descriptions-item>
          <el-descriptions-item label="通讯地址码">{{ equipmentInfo.communication_address_code }}</el-descriptions-item>
          <el-descriptions-item label="逆变器类型">{{ equipmentInfo.nbqll }}</el-descriptions-item>
          <el-descriptions-item label="PV接入数量">{{ equipmentInfo.pvjrsl }}</el-descriptions-item>
          <el-descriptions-item label="接入容量（kWp）">{{ equipmentInfo.machine_volume }}</el-descriptions-item>

        </el-descriptions>

      </div>
      <div class="inverter_card">

        <el-card class="box-card" v-for="(x, i) in detailInfoAll" :key="i">
          <div class="box_item">
            <div class="clire_pin"><img :src="require(`./img/形状${i + 1}.png`)" alt="" srcset="" width="19" height="22">
            </div>
            <div class="list_descri">
              <div class="descri_top">

                <span class="descri_top1">{{ x.key }}</span>


                <span class="descri_top2" v-show="i != 0">{{ x.key2 }}</span>


              </div>
              <div class="descri_btm">
                <div class="descri_top_item">
                  <span class="descri_btm1">{{ x.tt ? Number((detail_info[x.filed] / 10000)).toFixed(2) :
                      detail_info[x.filed]
                  }}</span><span class="descri_btm3">{{ x.unit
}}</span>
                </div>
                <div class="descri_top_item">

                  <span class="descri_btm2" v-show="i != 0">{{ detail_info[x.field2] ?
                      Number(detail_info[x.field2]).toFixed(2) : 0
                  }}</span><span class="descri_btm3">{{ x.unit2 }}</span>
                </div>

              </div>

            </div>


          </div>
        </el-card>
      </div>
      <div class="inverter_tab">


        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="运行曲线" name="1">
            <span slot="label"> <button :class="`tabsButon`">运行曲线</button></span>
            <div class="inverter_echat_search">
              <div class="inverter_date">
                <el-date-picker prefix-icon="1" v-model="timeStart" @change="timeStartFn" type="date" placeholder="选择日期"
                  :clearable="false"> </el-date-picker>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
                  <path
                    d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
                    fill="white" />
                  <path
                    d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
                    fill="white" />
                </svg>
              </div>

              <el-select v-model="value" placeholder="请选择" @change="typeSFn">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="inverter_echart" ref="echart_curve"></div>



          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label"> <button :class="`tabsButon`">实时数据</button></span>
            <div class="table_top">
              <div class="table_top_left">
                <el-table :data="realDataT.left" border style=" margin-top: 20px" stripe :row-style="{ height: '32px' }"
                  :header-cell-style="{ padding: 0 + 'px' }"
                  :cell-style="{ padding: 0 + 'px', color: '#000000', height: '32px' }"
                  :header-row-style="{ height: '31.5px' }">
                  <el-table-column label="单向交流输出" align="center" width="134">
                    <el-table-column prop="phase" label="相位" align="center" width="134"> </el-table-column>
                    <el-table-column prop="AC_voltage" label="电压(V)" align="center" width="134"> </el-table-column>
                    <el-table-column prop="current" label="电流(A)" align="center" width="134"> </el-table-column>
                    <el-table-column prop="AC_power_zb" label="单项有功率(kW)" align="center" width="134"> </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
              <div class="table_top_right">
                <el-table :data="realDataT.right" border style=" margin-top: 20px" stripe
                  :row-style="{ height: '96px' }" :header-cell-style="{ padding: 0 + 'px' }" cell-class-name="bigWidth"
                  :cell-style="{ padding: 0 + 'px', color: '#000000', height: '96px' }"
                  :header-row-style="{ height: '63px' }">
                  <el-table-column prop="AcMeasuredActive" label="交流输出总有|功率(kW)" align="center" width="105"
                    :render-header="renderheader">
                  </el-table-column>
                  <el-table-column prop="AcMeasuringReactive" label="交流输出总无功|功率（kvar）" align="center" width="105"
                    :render-header="renderheader">
                  </el-table-column>
                  <el-table-column prop="InputP" label="直流输入功率|（kW）" align="center" width="105"
                    :render-header="renderheader">
                  </el-table-column>
                  <el-table-column prop="Cos" label="功率因数" align="center" width="105"> </el-table-column>
                  <el-table-column prop="GridFrequency" label="频率（HZ）" align="center" width="105"> </el-table-column>
                  <el-table-column prop="AirTemperature" label="柜内空气温度（℃）" align="center" width="105">
                  </el-table-column>
                  <el-table-column prop="SquareArray" label="绝缘阻抗（MΩ）" align="center" width="105"> </el-table-column>
                </el-table>

              </div>
            </div>


            <el-table :data="realDataB" border style="width: 100%; margin-top: 20px" stripe
              :row-style="{ height: '32px' }" :header-cell-style="{ padding: 0 + 'px' }"
              :cell-style="{ padding: 0 + 'px', color: '#000000', height: '32px' }"
              :header-row-style="{ height: '31.5px' }">
              <el-table-column label="MPPT" align="center" width="134">
                <el-table-column prop="MPPT" label="回路编号" align="center" width="134"> </el-table-column>
                <el-table-column prop="voltage_MPPT" label="电压(V)" align="center" width="134"> </el-table-column>
                <el-table-column prop="current_MPPT" label="电流(A)" align="center" width="134"> </el-table-column>

              </el-table-column>

              <el-table-column label="PV" align="center" stripe>
                <el-table-column prop="NAME" label="回路编号" align="center" width="134"> </el-table-column>
                <el-table-column prop="capacity" label="接入容量（kWp）" align="center" width="134"> </el-table-column>
                <el-table-column prop="voltage" label="电压（V）" align="center" width="134"> </el-table-column>
                <el-table-column prop="current" label="电流（A）" align="center" width="134"> </el-table-column>
                <el-table-column prop="NAME2" label="回路编号" align="center" width="134"> </el-table-column>
                <el-table-column prop="capacity2" label="接入容量（kWp）" align="center" width="134"> </el-table-column>
                <el-table-column prop="voltage2" label="电压（V）" align="center" width="134"> </el-table-column>
                <el-table-column prop="current2" label="电流（A）" align="center" width="134"> </el-table-column>
              </el-table-column>



            </el-table>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label"> <button :class="`tabsButon`">发电量</button></span>
            <div class="inverter_echat_search  inverter_echat_search_btw">
              <div class="inverter_box">
                <button v-for="(x, i ) in typeDate" :key="i" :class="`typeButon ${activeBut == x ? 'activeBtn' : ''} `"
                  @click="buttnClick(x)">{{ x }}</button>
                <div class="inverter_date inverter_date1" v-if="activeBut != '总'">
                  <el-date-picker prefix-icon="1" v-model="Start" @change="outPowerStartFn" :type="pickerType"
                    :clearable="false" placeholder="选择日期"> </el-date-picker>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
                    <path
                      d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
                      fill="white" />
                    <path
                      d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
                      fill="white" />
                  </svg>
                </div>
              </div>


              <img src="./img/导出标准大小.png" style="cursor: pointer" class="inverter_date_right" @click="tableToExcel()"
                alt="" />


            </div>
            <div class="inverter_echart" ref="echart_electricity"></div>

          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label"> <button :class="`tabsButon`">历史数据</button></span>
            <div class="inverter_echat_search inverter_echat_search_btw">
              <div class="inverter_date inverter_date4">
                <el-date-picker prefix-icon="1" v-model="hiostyTime" @change="hisotryStartFn" type="date"
                  :clearable="false" placeholder="选择日期"> </el-date-picker>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z" fill="#0084FF" />
                  <path
                    d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
                    fill="white" />
                  <path
                    d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
                    fill="white" />
                </svg>
              </div>
              <img src="./img/导出标准大小.png" style="cursor: pointer" class="inverter_date_right" @click="exportHisotryFn"
                alt="" />

            </div>

            <el-table :data="historyData" border style="width: 100%; margin-top: 20px" stripe
              :row-style="{ height: '35px' }" :header-cell-style="{ padding: 0 + 'px' }"
              :cell-style="{ padding: 0 + 'px', color: '#000000', height: '40px' }"
              :header-row-style="{ height: '35px' }">

              <el-table-column v-for="(x, i) in columnRand" :key="i" :label="x.label" :prop="x.field" align="center"
                :width="x.width || 120" :render-header="x.rander ? renderheader : ''">
                <el-table-column v-for="(item, index) in x.children" :key='index' :label='item.label' align="center"
                  :width="item.width || 120" :prop='item.field'>
                </el-table-column>
              </el-table-column>
            </el-table>

            <div class="tab_pagination">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total,  prev, pager, next,sizes, jumper" :total="totalD" background>
              </el-pagination>
            </div>

          </el-tab-pane>
        </el-tabs>


      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup, Descriptions, DescriptionsItem, Card, Tabs, TabPane, DatePicker, Select, Option, Table, TableColumn, Radio,
  Pagination
} from "element-ui";
import Vue from "vue"
import Utils from "./utils";
import moment from "moment";
import * as echarts from "echarts";
import { queryInverterData, queryIndexCard, queryPowerOutput, queryHistoryData, realTimeData, exportFn, queryOperationCurve } from './api/asset'
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Radio)
Vue.use(Pagination)
const PvU = ['U₁', 'U₂', 'U₃', 'U₄', 'U₅', 'U₆', 'U₇', 'U₈', 'U₉', 'U₁₀', 'U₁₁', 'U₁₂', 'U₁₃', 'U₁₄', 'U₁₅', 'U₁₆', 'U₁₇', 'U₁₈', 'U₁₉', 'U₂₀', 'U₂₁', 'U₂₂', 'U₂₃', 'U₂₄']
const PvI = ['I₁', 'I₂', 'I₃', 'I₄', 'I₅', 'I₆', 'I₇', 'I₈', 'I₉', 'I₁₀', 'I₁₁', 'I₁₂', 'I₁₃', 'I₁₄', 'I₁₅', 'I₁₆', 'I₁₇', 'I₁₈', 'I₁₉', 'I₂₀', 'I₂₁', 'I₂₂', 'I₂₃', 'I₂₄']
const MpU = ['U₁', 'U₂', 'U₃', 'U₄', 'U₅', 'U₆', 'U₇', 'U₈', 'U₉', 'U₁₀', 'U₁₁', 'U₁₂',]
const MpI = ['I₁', 'I₂', 'I₃', 'I₄', 'I₅', 'I₆', 'I₇', 'I₈', 'I₉', 'I₁₀', 'I₁₁', 'I₁₂']
const PvUfeild = []
const PvIfeild = []
const MpUfeild = []
const MpIfeild = []
for (let i = 1; i <= 24; i++) {
  PvUfeild.push(`PV${i}U`)
  PvIfeild.push(`PV${i}I`)
}
for (let i = 1; i <= 12; i++) {
  MpUfeild.push(`PV${i}U`)
  MpIfeild.push(`PV${i}I`)
}


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
      //业务代码
      selected: "",
      buttons: [],
      defaultValue: "",
      styleEle: null,
      activeName: '3',
      //运行曲线
      value: '发电功率',
      timeStart: new Date(),
      options: [{
        value: '发电功率',
        label: '发电功率', fieldArr: 'fdgl'
      }, {
        value: 'PV电压',
        label: 'PV电压', fieldArr: 'pvdy'
      },
      { value: 'PV电流', label: 'PV电流', fieldArr: 'pvdl' },
      { value: 'MPPT电压', label: 'MPPT电压', fieldArr: 'mpptdy' },
      { value: 'MPPT电流', label: 'MPPT电流', fieldArr: 'mpptdl' },
      { value: '交流输出总无功功率', label: '交流输出总无功功率', fieldArr: 'jltotal' },
      { value: '柜内温度', label: '柜内温度', fieldArr: 'gnwd' },
      { value: '交流输出电压', label: '交流输出电压', fieldArr: 'jldy' },
      { value: '交流输出电流', label: '交流输出电流', fieldArr: 'jldl' },
      ],
      fdField: 'fdgl',
      //----------
      tableData: [{
        id: '12987122',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '12987123',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987124',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      },],
      //历史数据 变量
      historyData: [],
      hiostyTime: new Date(),
      //历史表头
      columnRand: [
        { label: '数据时间', field: 'time', width: 180 },
        { label: '直流输入总功率|（kW）', field: 'InputP', width: 150, rander: true },
        { label: '交流输出总有功|功率(kW)', field: 'equipment_id', width: 140, rander: true },
        { label: '交流输出总无功|功率（kvar）', field: 'AcMeasuredActive', width: 140, rander: true },
        { label: '当日发电量|（kWh）', field: 'poweroutput_d', rander: true },
        { label: '累计发电量|（kWh）', field: 'poweroutput_all', rander: true },
        { label: '功率因数', field: 'Cos', width: 100 },
        { label: '频率（HZ）', field: 'GridFrequency' },
        { label: '柜内空气温度|（℃）', field: 'AirTemperature', width: 140, rander: true },
        { label: '绝缘阻抗|（MΩ）', field: 'SquareArray', width: 100, rander: true },
        { label: 'A相', children: [{ label: '电压（V）', field: 'AcUa' }, { label: '电流（A）', field: 'Ia' }, { label: '有功功率（kW）', field: 'AC_power_A', width: 140 },] },
        { label: 'B相', children: [{ label: '电压（V）', field: 'AcUb' }, { label: '电流（A）', field: 'Ib' }, { label: '有功功率（kW）', field: 'AC_power_B', width: 140 },] },
        { label: 'C相', children: [{ label: '电压（V）', field: 'AcUc' }, { label: '电流（A）', field: 'Ic' }, { label: '有功功率（kW）', field: 'AC_power_C', width: 140 },] },
        { label: 'PV1', children: [{ label: '电压（V）', field: 'PV1U' }, { label: '电流（A）', field: 'PV1A' }] },
        { label: 'PV2', children: [{ label: '电压（V）', field: 'PV2U' }, { label: '电流（A）', field: 'PV2A' }] },
        { label: 'PV3', children: [{ label: '电压（V）', field: 'PV3U' }, { label: '电流（A）', field: 'PV3A' }] },
        { label: 'PV4', children: [{ label: '电压（V）', field: 'PV4U' }, { label: '电流（A）', field: 'PV4A' }] },
        { label: 'PV5', children: [{ label: '电压（V）', field: 'PV5U' }, { label: '电流（A）', field: 'PV5A' }] },
        { label: 'PV6', children: [{ label: '电压（V）', field: 'PV6U' }, { label: '电流（A）', field: 'PV6A' }] },
        { label: 'PV7', children: [{ label: '电压（V）', field: 'PV7U' }, { label: '电流（A）', field: 'PV7A' }] },
        { label: 'PV8', children: [{ label: '电压（V）', field: 'PV8U' }, { label: '电流（A）', field: 'PV8A' }] },
        { label: 'PV9', children: [{ label: '电压（V）', field: 'PV9U' }, { label: '电流（A）', field: 'PV9A' }] },
        { label: 'PV10', children: [{ label: '电压（V）', field: 'PV10U' }, { label: '电流（A）', field: 'PV10A' }] },
        { label: 'PV11', children: [{ label: '电压（V）', field: 'PV11U' }, { label: '电流（A）', field: 'PV11A' }] },
        { label: 'PV12', children: [{ label: '电压（V）', field: 'PV12U' }, { label: '电流（A）', field: 'PV12A' }] },
        { label: 'PV13', children: [{ label: '电压（V）', field: 'PV13U' }, { label: '电流（A）', field: 'PV13A' }] },
        { label: 'PV14', children: [{ label: '电压（V）', field: 'PV14U' }, { label: '电流（A）', field: 'PV14A' }] },
        { label: 'PV15', children: [{ label: '电压（V）', field: 'PV15U' }, { label: '电流（A）', field: 'PV15A' }] },
        { label: 'PV16', children: [{ label: '电压（V）', field: 'PV16U' }, { label: '电流（A）', field: 'PV16A' }] },
        { label: 'PV17', children: [{ label: '电压（V）', field: 'PV17U' }, { label: '电流（A）', field: 'PV17A' }] },
        { label: 'PV18', children: [{ label: '电压（V）', field: 'PV18U' }, { label: '电流（A）', field: 'PV18A' }] },
        { label: 'PV19', children: [{ label: '电压（V）', field: 'PV19U' }, { label: '电流（A）', field: 'PV19A' }] },
        { label: 'PV20', children: [{ label: '电压（V）', field: 'PV20U' }, { label: '电流（A）', field: 'PV20A' }] },
        { label: 'PV21', children: [{ label: '电压（V）', field: 'PV21U' }, { label: '电流（A）', field: 'PV21A' }] },
        { label: 'PV22', children: [{ label: '电压（V）', field: 'PV22U' }, { label: '电流（A）', field: 'PV22A' }] },
        { label: 'PV23', children: [{ label: '电压（V）', field: 'PV23U' }, { label: '电流（A）', field: 'PV23A' }] },
        { label: 'PV24', children: [{ label: '电压（V）', field: 'PV24U' }, { label: '电流（A）', field: 'PV24A' }] },
        { label: 'MPPT1', children: [{ label: '电压（V）', field: 'MPPT1U' }, { label: '电流（A）', field: 'MPPT1A' }] },
        { label: 'MPPT2', children: [{ label: '电压（V）', field: 'MPPT2U' }, { label: '电流（A）', field: 'MPPT2A' }] },
        { label: 'MPPT3', children: [{ label: '电压（V）', field: 'MPPT3U' }, { label: '电流（A）', field: 'MPPT3A' }] },
        { label: 'MPPT4', children: [{ label: '电压（V）', field: 'MPPT4U' }, { label: '电流（A）', field: 'MPPT4A' }] },
        { label: 'MPPT5', children: [{ label: '电压（V）', field: 'MPPT5U' }, { label: '电流（A）', field: 'MPPT5A' }] },
        { label: 'MPPT6', children: [{ label: '电压（V）', field: 'MPPT6U' }, { label: '电流（A）', field: 'MPPT6A' }] },
        { label: 'MPPT7', children: [{ label: '电压（V）', field: 'MPPT7U' }, { label: '电流（A）', field: 'MPPT7A' }] },
        { label: 'MPPT8', children: [{ label: '电压（V）', field: 'MPPT8U' }, { label: '电流（A）', field: 'MPPT8A' }] },
        { label: 'MPPT9', children: [{ label: '电压（V）', field: 'MPPT9U' }, { label: '电流（A）', field: 'MPPT9A' }] },
        { label: 'MPPT10', children: [{ label: '电压（V）', field: 'MPPT10U' }, { label: '电流（A）', field: 'MPPT10A' }] },
        { label: 'MPPT11', children: [{ label: '电压（V）', field: 'MPPT11U' }, { label: '电流（A）', field: 'MPPT11A' }] },
        { label: 'MPPT12', children: [{ label: '电压（V）', field: 'MPPT12U' }, { label: '电流（A）', field: 'MPPT12A' }] },

      ],
      pageNum: 1,
      pageSize: 10,
      //-------------
      Start: new Date(),
      typeDate: ['日', '月', '年', '总'],
      totalD: null,
      activeBut: '日',
      //echarts
      Gechart: null,
      Gechart2: null,
      //头部信息存储字段
      equipmentInfo: {},
      //卡片信息存储字段
      detail_info: {},
      detailInfoAll: [
        { key: '当前发电功率', filed: 'AcMeasuredActive', unit: 'kW' },
        { key: '当日发电量', key2: '当日等效时数', unit: 'kWh', unit2: 'h', filed: 'poweroutput_d', field2: 'equivalent_hours_d' },
        { key: '当月发电量', key2: '当月等效时数', unit: 'kWh', unit2: 'h', filed: 'poweroutput_m', field2: 'equivalent_hours_m' },
        { key: '当年发电量', key2: '当年等效时数', tt: true, unit: '万kWh', unit2: 'h', filed: 'poweroutput_y', field2: 'equivalent_hours_y' },
        { key: '累计发电量', key2: '累计等效时数', tt: true, unit: '万kWh', unit2: 'h', filed: 'poweroutput_all', field2: 'equivalent_hours_all' },
      ],
      pickerType: 'date',
      //实时数据
      realDataT: {},
      realDataB: [],
      //逆变器id
      equipmentId: null,
    }
  },
  mounted() {
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let { id } = this.customConfig
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    // this.defaultValue = JSON.parse(buttons).defaultValue;
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }
    this.handleValueChange('1')
    this.initElectricity()
    this.descriQuery()
    this.historyQueryData()
    this.operationInit()
    this.connectWS()

  },
  methods: {
    //合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {

      if (columnIndex >= 4) {
        if (rowIndex == 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    exportFn() { },
    //日期类型改变
    buttnClick(key) {
      let a = { 日: 'date', 月: 'month', 年: 'year', 总: 'total' }
      this.activeBut = key
      this.pickerType = a[key]
      this.initElectricity()
    },
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    //实时表头渲染
    renderheader(h, { column, $index }) {
      return h("span", {}, [h("span", {}, column.label.split("|")[0]), h("br"), h("span", {}, column.label.split("|")[1])]);
    },

    //顶部表述查询
    descriQuery() {
      queryInverterData(this.equipmentId).then(res => {

        this.equipmentInfo = res.data
      }).catch(err => {
        console.log(err);
      }).catch(err => {
        console.log(err);
      })
      queryIndexCard(this.equipmentId).then(res => {
        this.detail_info = res.data


      }).catch(err => {
        console.log(err);
      }).catch(err => {
        console.log(err);
      })
      realTimeData(this.equipmentId).then(res => {

        let { MPPT, PV, leftTop, rightTop } = res.data
        let relBtm = []
        let temp = PV.splice(12)
        let PV2 = []
        temp.forEach(x => {
          let obj = {}
          for (const key in x) {
            obj[key + 2] = x[key]
          }
          PV2.push(obj)
        })

        MPPT.forEach((x, i) => {
          let y = PV[i]
          let z = PV2[i]
          relBtm.push({ ...x, ...y, ...z })
        })
        this.realDataB = relBtm
        this.realDataT.left = leftTop
        this.realDataT.right = rightTop

      }).catch(err => {
        console.log(err);
      })

    },
    //发电量echarts图初始化方法
    async initElectricity() {

      const colors = ['#5470C6', '#91CC75', '#EE6666'];
      let initialize = { date: 'YYYY-MM-DD', month: 'YYYY-MM', year: 'YYYY' }//日期格式

      let fieldP = {
        date: ['sub_time', 'power_output_h', 'theory_power_output_h', 'equivalent_hours_h', 'PR_h'],
        month: ['sub_time', 'poweroutput_d', 'theory_power_output_d', 'equivalent_hours_d', 'PR_d'],
        year: ['sub_time', 'poweroutput_m', 'theory_power_output_m', 'equivalent_hours_m', 'PR_m'],
        total: ['sub_time', 'poweroutput_y', 'theory_power_output_y', 'equivalent_hours_y', 'PR_y'],
      }
      let time = initialize[this.pickerType] ? moment(this.Start).format(initialize[this.pickerType]) : ''

      let { data } = await queryPowerOutput({ id: this.equipmentId, time })
      this.excelData = data
      let power_output = []
      let theory_power_output = []
      let equivalent_hours = []
      let PR = []
      let xAxis = data.map(x => {
        power_output.push(x[fieldP[this.pickerType][1]])
        theory_power_output.push(x[fieldP[this.pickerType][2]])

        equivalent_hours.push(x[fieldP[this.pickerType][3]])
        PR.push(x[fieldP[this.pickerType][4]])
        return x[fieldP[this.pickerType][0]]
      })

      let options = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },

        legend: {
          data: ['发电量', '理论发电量', '等效时数', 'PR'],
          itemHeight: 8,
          itemWidth: 12,

          textStyle: {
            fontSize: 10
          }
        },
        xAxis: [
          {

            axisTick: {
              alignWithLabel: true,
              show: false
            },

            // prettier-ignore
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位：h',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,

            },

          },
          {
            type: 'value',
            name: '%',
            position: 'right',
            alignTicks: true,
            offset: 40,
            axisLine: {
              show: true,

            },

          },
          {
            type: 'value',
            name: '单位：kWh',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,

            },

          }
        ],
        series: [
          {
            name: '发电量',
            type: 'bar',
            yAxisIndex: 2,
            data: power_output,

            barMaxWidth: 60,
            itemStyle: {
              color: 'rgb(89,204,117)'
            }
          },
          {
            name: '理论发电量',
            type: 'bar',
            yAxisIndex: 2,
            barMaxWidth: 60,
            data: theory_power_output,
            itemStyle: {
              color: 'rgba(29,104,121,1)'
            }
          },
          {
            name: '等效时数',
            type: 'line',
            yAxisIndex: 1,
            symbol: 'circle',
            data: equivalent_hours,
            itemStyle: {
              color: 'rgba(255,215,73,1)'
            }
          },
          {
            name: 'PR',
            type: 'line',
            yAxisIndex: 1,
            symbol: 'circle',
            data: PR,
            itemStyle: {
              color: 'rgba(255,0,0,1)'
            }
          }

        ]
      };
      this.Gechart = echarts.init(this.$refs.echart_electricity);
      this.Gechart.setOption(options);

    },
    //发电量日期选择框
    outPowerStartFn() {
      this.initElectricity()
    },
    //发电量导出
    tableToExcel() {
      let tableData = this.excelData
      const headArr = Object.keys(tableData[0])
      let fieldP = {
        date: { 'sub_time': '展示时间', 'power_output_h': '发电量', 'theory_power_output_h': '理论发电量', 'equivalent_hours_h': '等效时数', 'PR_h': 'PR' },
        month: { 'sub_time': '展示时间', 'poweroutput_d': '发电量', 'theory_power_output_d': '理论发电量', 'equivalent_hours_d': '等效时数', 'PR_d': 'PR' },
        year: { 'sub_time': '展示时间', 'poweroutput_m': '发电量', 'theory_power_output_m': '理论发电量', 'equivalent_hours_m': '等效时数', 'PR_m': 'PR' },
        total: { 'sub_time': '展示时间', 'poweroutput_y': '发电量', 'theory_power_output_y': '理论发电量', 'equivalent_hours_y': '等效时数', 'PR_y': 'PR' },

      }

      // 要导出的json数据
      // 列标题
      let str = "<tr>"
      headArr.forEach((item, index) => {

        str += (index == (headArr.length - 1)) ? `<td>${fieldP[this.pickerType][item]}</td></tr>` : `<td>${fieldP[this.pickerType][item]}</td>`

      })
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < tableData.length; i++) {
        str += '<tr>';
        for (const key of headArr) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${tableData[i][key] + '\t'}</td>`;
        }
        str += '</tr>';
      }
      // Worksheet名
      const worksheet = 'Sheet1'
      const uri = 'data:application/vnd.ms-excel;base64,';

      // 下载的表格模板数据
      const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`;
      // 下载模板

      // 输出base64编码
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
      a.download = `逆变器发电量${this.activeBut}` + ".xls";
      a.click();
    },

    //历史数据查询
    async historyQueryData() {
      let time = moment(this.hiostyTime).format('YYYY-MM-DD')
      let { data } = await queryHistoryData({
        equipment_id: this.equipmentId, date: time, "pageNum": this.pageNum,
        "pageSize": this.pageSize
      })

      this.historyData = [...data.results]
      this.totalD = data.totalCount
    },
    //更改页数大小
    handleSizeChange(val) {

      this.pageSize = val
      this.historyQueryData()

    },
    //更改页数
    handleCurrentChange(val) {

      this.pageNum = val
      this.historyQueryData()
    },
    hisotryStartFn() {
      this.historyQueryData()

    },
    exportHisotryFn() {
      let time = moment(this.hiostyTime).format('YYYY-MM-DD')
      exportFn({
        equipment_id: '1999123999348', date: time,

      }).then(res => {
        var blob = res.data;
        //  FileReader主要用于将文件内容读入内存
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        // onload当读取操作成功完成时调用
        reader.onload = function (e) {
          var a = document.createElement("a");
          // 获取文件名fileName
          var fileName = res.headers["content-disposition"].split("=");
          fileName = fileName[fileName.length - 1];
          fileName = decodeURI(fileName);
          a.download = fileName;
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      }).catch(err => {
        console.log(err);
      })
    },
    //---------
    //运行曲线查询

    //运行曲线图表渲染
    async operationInit() {
      this.Gechart2 && this.Gechart2.clear()
      let color = ['#6dbd81', '#47a2ff', '#e4b304', '#fd6e65', '#d04be5', '#f8a11f',
        '#0454f2', '#6688cc', '#8866cc', '#66ccbb', '#cc66bb', '#7c7cd3', '#8aca9a', '#47a2ff', '#e4b304', '#fd6e65', '#d04be5', '#f8a11f', '#0454f2', '#6688cc', '#8866cc', '#66ccbb', '#cc66bb', '#6b6bce',]
      let serName = { fdgl: ['直流输入功率', '交流总有功', '日辐射量', '光伏组件温度'], pvdy: PvU, pvdl: PvI, mpptdy: MpU, mpptdl: MpI, jltotal: ['交流测无功功率', '日辐射量', '光伏组件温度'], gnwd: ['柜内温度'], jldy: ['Ua', 'Ub', 'Uc'], jldl: ['Ia', 'Ib', 'Ic'] }
      let serData = { fdgl: ['InputP', 'AcMeasuredActive', 'radiation_day', 'PV_temperature'], pvdy: PvUfeild, pvdl: PvIfeild, mpptdy: MpUfeild, mpptdl: MpIfeild, jltotal: ['AcMeasuringReactive', 'radiation_day', 'PV_temperature'], gnwd: ['AirTemperature'], jldy: ['AcUa', 'AcUb', 'AcUc'], jldl: ['Ia', 'Ib', 'Ic'] }
      let symbolR = ['circle', 'diamond', 'rect', 'triangle', 'triangleRoate']
      let unit = { fdgl: '单位：kW', pvdy: '单位：V', pvdl: '单位：A', mpptdy: '单位：V', mpptdl: '单位：A', jltotal: '单位：kvar', gnwd: '单位：℃', jldy: '单位：V', jldl: '单位：A' }
      let serColor = { fdgl: ['#6dbd81', '#f50a05', '#6688cc', '#8866cc'], jltotal: ['#6dbd81', '#6688cc', '#8866cc'], jldy: ['#feff08', '#38af52', '#f50a05'], jldl: ['#feff08', '#38af52', '#f50a05'] }
      let param = {}
      param.id = this.equipmentId
      param.time = moment(this.timeStart).format('YYYY-MM-DD')
      param.type = this.value
      let { data } = await queryOperationCurve(param)
      let eachartData = {}
      let seriesData = []
      data.forEach((x, i) => {
        for (const key in x) {
          eachartData[key] = eachartData[key] ? [...eachartData[key], x[key]] : [x[key]]
        }
      })
      serData[this.fdField].forEach((x, i) => {
        let st = i % 5 == 4 ? "triangle" : symbolR[i % 5]
        let rotae = i % 5 == 4 ? 180 : 0
        let name = serName[this.fdField][i]
        let yAxi = name == '日辐射量' ? 1 : (name == '光伏组件温度' ? 2 : 0)
        eachartData[x] = eachartData[x] ? eachartData[x] : [0]
        seriesData.push({
          name: serName[this.fdField][i],
          type: 'line',
          symbol: st,
          yAxisIndex: yAxi,
          symbolRotate: rotae,
          data: eachartData[x],
          itemStyle: {
            color: serColor[this.fdField] && serColor[this.fdField][i] || color[i]
          }
        })
      })

      let options = {

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: serName[this.fdField],
          itemHeight: 8,
          itemWidth: 12,

          textStyle: {
            fontSize: 10
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          },

          data: eachartData.sub_time
        },
        yAxis: [
          {
            type: 'value',
            name: unit[this.fdField],
            position: 'left',
            alignTicks: true,
            // show: true,
            axisLine: {
              show: true,

            },

          },
          {
            type: 'value',
            name: '单位：W/m²',
            position: 'right',
            alignTicks: true,
            show: this.fdField == 'fdgl' || this.fdField == 'jltotal',
            min: 0,
            max: null,

            axisLine: {
              show: true,

            },

          },
          {
            type: 'value',
            name: '℃',
            position: 'right',
            alignTicks: true,
            show: this.fdField == 'fdgl' || this.fdField == 'jltotal',
            min: 0,
            max: null,

            offset: 40,
            axisLine: {
              show: true,

            },

          },

        ],
        series: seriesData
      };
      console.log(eachartData, '====', options);

      this.Gechart2 = echarts.init(this.$refs.echart_curve);
      this.Gechart2.setOption(options);


    },
    //选择框
    typeSFn(e) {
      let a = this.options.find((x) => {
        return x.value == e
      })
      this.fdField = a?.fieldArr
      this.operationInit()
    },
    //日期选择框
    timeStartFn() {
      this.operationInit()
    },
    //------
    //websockt
    connectWS() {
      try {

        let { 配置地址: wsConfig = '[]' } = this.customConfig;
        wsConfig = JSON.parse(wsConfig)
        const { hostname } = window.location;
        const wsUrl = wsConfig.find(
          conf => conf.env.indexOf(hostname) !== -1
        )?.ws;
        if (wsUrl) {
          const userid = window?.currentUser
            ? window?.currentUser.id
            : "1234567890";
          // let url = `ws://${window.location.host}/sdata/webSocket/` + userid;
          const url =
            `${wsUrl}/sdata/webSocket/` +
            userid +
            `@${Math.floor(Math.random() * 1000000)}`;
          console.log("-----前端开始连接websocket-----", url);
          // websocket = new WebSocket(url);
          let websocket = new WebSocket(url)
          websocket.onerror = function (e) {
            console.log(e);
          };
          websocket.onopen = function () {
            console.log("连接成功");
            timer = setInterval(() => {
              console.log("心跳");
              let ping = { type: "ping" };
              websocket.send(JSON.stringify(ping));
            }, 5000);
          };
          websocket.onmessage = function (event) {
            console.log(event);
            this.initElectricity()
            this.descriQuery()
            this.historyQueryData()
            this.operationInit()
          };
          window.onbeforeunload = function () {
            closeWebSocket();
          };
          websocket.onclose = function (e) {
            console.log("连接关闭");
            console.log(
              "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
            );
            clearInterval(timer);
            timer = null;
            if (e.code * 1 === 1000 || e.code * 1 === 1006) {
              console.log("尝试重连");
              this.connectWS();
            }
          };
          function closeWebSocket() {
            websocket.close();
            websocket = null;
          }
        }
      } catch (error) {
        console.log("e", error);
      }
    },


    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
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
    do_EventCenter_setValue({ value }) {
      this.setValue(value)
    },
    setValue(value) {
      this.equipmentId = value
      this.initElectricity()
      this.descriQuery()
      this.historyQueryData()
      this.operationInit()
    },


    //tabs选项卡
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },


  //表格合并



  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>

<style lang="less" scoped>
.inverter {
  .inverter_information {
    padding-left: 20px;
    padding-top: 15px;
    background-color: #fff;

    /deep/ .information_title {
      color: rgb(56, 54, 54);
      font-size: 16px;
      font-weight: 400;
    }

    /deep/ .information_content {
      color: rgba(0, 0, 0, 1);
      font-size: 16px;
      font-weight: 400;
    }
  }

  .inverter_card {
    display: flex;
    background-color: #fff;
    flex: 1;
    justify-content: space-around;
    padding: 15px;
    margin: 10px 0;

    .box_item {
      display: flex;

      .clire_pin {
        width: 41px;
        height: 42px;
        border-radius: 50%;
        border: 0 solid rgba(151, 151, 151, 1);
        // opacity: 0.30000001192092896;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e1efff;

      }

      .list_descri {
        margin-left: 10px;
        flex: 1;
        font-family: "Alibaba PuHuiTi";

        .descri_top {
          display: flex;
          color: rgba(0, 0, 0, 1);
          font-size: 14px;
          font-weight: 500;
          justify-content: space-between;
          align-items: center;

          .descri_top2 {
            font-size: 12px;
            color: #303133;
          }
        }

        .descri_btm {
          color: #3894FF;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .descri_btm2 {
            font-size: 12px;

          }

          .descri_btm3 {
            font-size: 10px;
            font-weight: 400;
          }
        }
      }
    }

    /deep/ .el-card__body {
      padding: 14px 10px;
    }

    .box-card {
      // width: 19%;
      width: 244.82px;
      height: 70px;
    }
  }

  .inverter_tab {
    padding: 15px;
    background-color: #fff;

    /deep/.el-tabs__item {
      padding: 0px;
    }

    .tabsButon {
      width: 124px;
      height: 32px;
      background-color: #fff;
      line-height: 28px;
      // border-radius: undefineNaNpxx undefineNaNpxx undefineNaNpxx undefineNaNpxx;
      opacity: 1;
      border: 1px solid rgba(222, 222, 222, 1);
      cursor: pointer;
      font-size: 16px;
      font-weight: 700;

      &:hover {
        color: #1B85FF;
        border: 1px solid #1B85FF;
      }
    }

    /deep/.el-tabs__active-bar {
      background-color: transparent;
    }

    /deep/.el-tabs__nav-wrap::after {
      background-color: transparent;
    }

    /deep/.el-tabs__item.is-active {
      .tabsButon {



        color: #1B85FF;
        border: 1px solid #1B85FF;

      }
    }

    .inverter_echat_search {
      display: flex;
      align-items: center;
      // justify-content: space-between;

      .inverter_box {
        display: flex;
        align-items: center;
      }

      .inverter_date {
        display: flex;
        align-items: center;
        margin-right: 15px;
      }

      .inverter_date1 {
        margin-left: 15px;
      }

      .inverter_date4 {

        width: 150px;


        /deep/ .el-date-editor .el-input__inner {
          width: 118px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }

        /deep/.el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 118px;
        }
      }

      .typeButon {
        width: 63.84px;
        height: 32px;
        background-color: #fff;
        // border-radius: undefineNaNpxx undefineNaNpxx undefineNaNpxx undefineNaNpxx;
        opacity: 1;
        border: 1px solid rgba(222, 222, 222, 1);
        cursor: pointer;

        &:hover {
          color: #1B85FF;
          border: 1px solid #1B85FF;
        }
      }

      .inverter_date_right {
        align-items: flex-end;
      }

      .activeBtn {
        color: #1B85FF;
        border: 1px solid #1B85FF;
      }
    }

    .inverter_echat_search_btw {
      align-items: center;
      justify-content: space-between;

    }

    .inverter_echart {
      width: 1290px;
      height: 594px;
    }

    //实时数据
    .table_top {
      display: flex;

      /deep/.bigWidth {
        height: 60px;
      }

      .table_top_left {}

      .table_top_right {}
    }

    //历史数据
    .tab_pagination {
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;

      /deep/.el-input__inner {
        background-color: transparent;
      }

      /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: transparent;
        color: #0454f2;
        border: 1px solid #0454f2;
      }

      /deep/ .el-pagination.is-background .el-pager li {
        background-color: transparent;
        border: 1px solid #f4f4f5;
        width: 32px;
        height: 32px;
        border-radius: 4px;

        line-height: 32px;

        &:hover {
          color: #0454f2;
          border: 1px solid #0454f2;
        }
      }

      /deep/.el-pagination__jump {

        font-weight: 400;
        font-size: 12px;
      }
    }

  }

  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100px;
    height: 32px;
  }

  /deep/.el-date-editor .el-input__inner {
    width: 100px;
    height: 32px;
    text-align: center;
    padding: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  /deep/.el-select .el-input__inner {
    height: 32px;


  }

  /deep/.el-select .el-input .el-select__caret {
    line-height: 32px;
  }


  /deep/ .el-table {
    color: #000;
  }

  /deep/ .el-table tr:hover {
    background-color: rgb(212, 238, 255);

  }

  /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background-color: rgb(212, 238, 255);
  }

  /deep/ .el-table .el-table__body-wrapper .el-table__row--striped td.el-table__cell {
    background: #f8fcff;
    border-color: #d8dfe7;
  }

  /deep/ .el-table .el-table__body-wrapper .el-table__row td.el-table__cell {
    border-color: #d8dfe7;
  }

  /deep/ .el-table__header-wrapper .has-gutter tr {
    background-color: #ebf5ff;
    border-color: #d8dfe7;
    color: #000000;
  }

  /deep/ .el-table th.el-table__cell {
    background-color: transparent;
    border-color: #d8dfe7;
    color: #000000;
  }

  /deep/.el-table th.el-table__cell>.cell {
    display: flex;
    justify-content: center;
    align-items: center;

    // :nth-child(0) {
    //   padding-left: 24px;
    // }
  }

  /deep/ .el-table__footer-wrapper tbody td.el-table__cell {
    background-color: transparent;
    border-color: #d8dfe7;

    color: #000000;
  }

  /deep/ .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #d8dfe7;
  }

  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #d8dfe7;
  }

  .el-table--border,
  .el-table--group {
    border-color: #d8dfe7;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-color: #d8dfe7;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-color: #d8dfe7;
  }

  .el-table--border td,
  .el-table--border th {
    border-color: #d8dfe7;
  }



}
</style>
