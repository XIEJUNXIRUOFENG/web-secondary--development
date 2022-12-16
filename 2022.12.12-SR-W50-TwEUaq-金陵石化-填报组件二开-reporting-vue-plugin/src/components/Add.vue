<template>
  <div class="liuChen-page">
    <div class="leftTree">
      <div class="plantAdd">
        <div class="planTitleLeft">
          <img class="planImg" src="../../pluginTemp/images/Category.png" alt="">
          <span class="planTitle">计划列表</span>
        </div>
        <div class="addIcon" @click="addPalnt">＋</div>
      </div>
      <el-menu v-if="plantList.length > 0" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-submenu index="1">
          <template slot="title">

            <span>导航一</span>
          </template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
          <el-menu-item index="1-3">选项3</el-menu-item>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
      <div v-else class="emptyBox">
        <img class="emptyIcon" src="../../pluginTemp/images/emptyIcon.png" alt="">
        <span>尚未创建计划</span>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="rightConcent">
      <!-- <component v-if="plantList.length > 0" :is="componentType" :dataSource="{}" :componentType="changeComponentType"/> -->
      <!-- 空白页 -->
      <div v-if="componentType == 'emptyPage'" class="rightEmptyBox">
        <img class="rightEmptyIcon" src="../../pluginTemp/images/plantTask.png" alt="">
        <span class="rightEmptyText">请创建工程计划</span>
        <el-button style="width: 124px; font-size: 16px;" size="small" type="primary" @click="addPalnt()" round
          plain>＋新增计划</el-button>
      </div>
      <!-- 计划新增 -->
      <div v-if="componentType == 'PlantForm'" class="addplantBox">
        <div class="PlantForm_title">
          <span class="drawerTitle">计划信息</span>
          <el-button style="width: 96px; font-size: 14px;" size="small" type="primary" @click="saveSub" round>
            <img class="saveIcon" src="../../pluginTemp/images/saveIcon.png" alt="">
            保存
          </el-button>
        </div>
        <div class="PlantForm_content">
          <el-form :model="planForm" :rules="rules" ref="planForm" size="small">
            <el-form-item label="申报人：" :label-width="formLabelWidth" :readonly="true" prop="reportMember">
              <el-input v-model="planForm.reportMember" :clearable="true" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="申报单位：" :label-width="formLabelWidth" prop="reportUnit">
              <el-select v-model="planForm.reportUnit" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报子单位：" :label-width="formLabelWidth" prop="secondUnit">
              <el-select v-model="planForm.secondUnit" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报时间：" :label-width="formLabelWidth" prop="reportDate">
              <el-date-picker v-model="planForm.reportDate" format="yyyy-MM-DD" type="date" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划类型：" :label-width="formLabelWidth" prop="reportType">
              <el-select v-model="planForm.reportType" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质量记录号：" :label-width="formLabelWidth" prop="reportNum">
              <el-input v-model="planForm.reportNum" autocomplete="off" placeholder="请输入" :clearable="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 工序任务新增 -->
      <div class="Task-page-add" v-if="componentType == 'TaskForm'">
        <div class="operation_headr">
          <div class="operation_headr_back"><i class="el-icon-back"></i> <span>工程任务</span></div>
          <div class="operation_headr_itme">
            <el-button type="primary" round>
              <svg style="margin-right:5px" width="14" height="14" viewBox="0 0 14 14" fill="#fff"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 0.5C1.61929 0.5 0.5 1.61929 0.5 3V11C0.5 12.3807 1.61929 13.5 3 13.5H11C12.3807 13.5 13.5 12.3807 13.5 11V3.72727V3.52017L13.3536 3.37372L10.6263 0.646447L10.4798 0.5H10.2727H3ZM1.5 3C1.5 2.17157 2.17157 1.5 3 1.5H3.5V3.5C3.5 4.88071 4.61929 6 6 6H7.5C8.88071 6 10 4.88071 10 3.5V1.5H10.0656L12.5 3.93438V11C12.5 11.8284 11.8284 12.5 11 12.5V10.5C11 9.11929 9.88071 8 8.5 8H5.5C4.11929 8 3 9.11929 3 10.5L3 12.5C2.17157 12.5 1.5 11.8284 1.5 11V3ZM10 10.5V12.5H4V10.5C4 9.67157 4.67157 9 5.5 9H8.5C9.32843 9 10 9.67157 10 10.5ZM9 1.5H4.5V3.5C4.5 4.32843 5.17157 5 6 5H7.5C8.32843 5 9 4.32843 9 3.5V1.5ZM8 3H7V4H8V3Z"
                  fill="white" />
              </svg>
              保存
            </el-button>
          </div>
        </div>
        <div class="operation_main">
          <el-form :model="taskForm" :rules="rules" ref="taskForm" size="small">
            <el-form-item label="工程名称：" :label-width="formLabelWidth" :clearable="true" :readonly="true"
              prop="project_name">
              <el-input v-model="taskForm.project_name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="类型：" :label-width="formLabelWidth" prop="project_type">
              <el-select v-model="taskForm.project_type" placeholder="请选择">
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="功能区域：" :label-width="formLabelWidth" prop="function_area">
              <el-select v-model="taskForm.function_area" placeholder="请选择">
                <el-option v-for="(item, i) in funAreaArr  " :key="i" :label="item.function_area"
                  :value="item.function_area"></el-option>

              </el-select>
            </el-form-item>
            <el-form-item label="关联设备：" :label-width="formLabelWidth" prop="associated_devices">
              <el-select v-model="taskForm.associated_devices" placeholder="请选择">
                <el-option v-for="(item, i) in devicesArr  " :key="i" :label="item.associated_devices"
                  :value="item.associated_devices"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="施工标准或要求：" :label-width="formLabelWidth" prop="requirement_for_construction">
              <el-input type="textarea" :rows="3" maxlength="100" placeholder="请输入内容" show-word-limit
                v-model="taskForm.requirement_for_construction">
              </el-input>
            </el-form-item>
            <el-form-item label="备注信息：" :label-width="formLabelWidth" prop="remark">
              <el-input type="textarea" :rows="3" maxlength="100" placeholder="请输入内容" show-word-limit
                v-model="taskForm.remark">
              </el-input>
            </el-form-item>
            <el-form-item label="附件信息：" :label-width="formLabelWidth" prop="file">
              <div> <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="handleChange" :file-list="taskForm.file">

                  <button class="Task_add_upload"><span class="iconfont">&#xe63d;</span> 上传附件</button>
                </el-upload></div>

            </el-form-item>
          </el-form>

        </div>
      </div>
      <!-- 工序任务详情页 -->
      <div class="Task-page" v-if="componentType == 'Task'">
        <div class="descriptions_task">
          <div class="title_class">
            <div class="title_class_start">
              <img class="imgTile" src="../../pluginTemp/images/layer.png" alt="" srcset="">
              <span class="spanTile"> {{
                  tasksPrievw.project_name
              }}</span>
            </div>
            <div class="title_class_end">
              <el-button circle type="small"> <i class="el-icon-edit"></i> </el-button>
            </div>
          </div>
          <el-descriptions :column="4">

            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="工程名称">{{
                tasksPrievw.project_name
            }}</el-descriptions-item>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="功能区域">{{
                tasksPrievw.function_area
            }}</el-descriptions-item>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="关联设备">{{
                tasksPrievw.associated_devices
            }}</el-descriptions-item>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="施工要求">{{
                tasksPrievw.requirement_for_construction
            }}</el-descriptions-item>

          </el-descriptions>
          <el-descriptions>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="备注信息">{{
                tasksPrievw.remark
            }}</el-descriptions-item>


          </el-descriptions>
          <el-descriptions>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="附件信息">{{
                tasksPrievw.file
            }}</el-descriptions-item>


          </el-descriptions>
        </div>
        <div class="task_operaList">
          <div class="task_opear_title_add">
            <div class="task_opear_title">

              <img src="../../pluginTemp/images/hengLine.png" alt="" srcset="">
              任务工序
            </div>
            <div class="addIcon">＋</div>
          </div>

          <div class="task_opear_main">
            <div class="task_operaList_item" v-for="(item, i) in tasksPrievw.procedures" :key="i">
              <div class="task_opera_name text_class">{{ item.process_name }}</div>
              <div class="task_opera_step text_class"><span class="title_label">工序步骤：</span>{{ item.steps.length }}
              </div>
              <div class="task_opera_procedure text_class"><span class="title_label">物料清单：</span>{{
                  item.materials.length
              }}</div>
              <div class="task_opera_cz"><img style="vertical-align: middle;" src="../../pluginTemp/images/Edit.png"
                  alt="" srcset=""> 编辑</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 工序新增 -->
      <div class="Operation-page" v-if="componentType == 'Procedure'">
        <div class="operation_headr">
          <div class="operation_headr_back"><i class="el-icon-back"></i> <span>工序名称</span></div>
          <div class="operation_headr_itme">
            <el-button type="primary" round @click="OperationSave">
              <svg style="margin-right:5px" width="14" height="14" viewBox="0 0 14 14" fill="#fff"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 0.5C1.61929 0.5 0.5 1.61929 0.5 3V11C0.5 12.3807 1.61929 13.5 3 13.5H11C12.3807 13.5 13.5 12.3807 13.5 11V3.72727V3.52017L13.3536 3.37372L10.6263 0.646447L10.4798 0.5H10.2727H3ZM1.5 3C1.5 2.17157 2.17157 1.5 3 1.5H3.5V3.5C3.5 4.88071 4.61929 6 6 6H7.5C8.88071 6 10 4.88071 10 3.5V1.5H10.0656L12.5 3.93438V11C12.5 11.8284 11.8284 12.5 11 12.5V10.5C11 9.11929 9.88071 8 8.5 8H5.5C4.11929 8 3 9.11929 3 10.5L3 12.5C2.17157 12.5 1.5 11.8284 1.5 11V3ZM10 10.5V12.5H4V10.5C4 9.67157 4.67157 9 5.5 9H8.5C9.32843 9 10 9.67157 10 10.5ZM9 1.5H4.5V3.5C4.5 4.32843 5.17157 5 6 5H7.5C8.32843 5 9 4.32843 9 3.5V1.5ZM8 3H7V4H8V3Z"
                  fill="white" />
              </svg>
              保存
            </el-button>
          </div>
        </div>
        <div class="operation_main">
          <el-form :model="operationForm" :rules="rules" ref="operationForm" size="small">
            <el-form-item label="工序名称:" :label-width="formLabelWidth" :clearable="true" :readonly="true"
              prop="procedures_name">
              <el-input v-model="operationForm.process_name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="工序步骤:" :label-width="formLabelWidth" prop="">
              <div class="procedures_name_table_detailed">
                <el-table :data="detailedTable" style="width: 100%" border stripe header-cell-class-name='listBan'>
                  <el-table-column type="index" width="50" label="序号">
                  </el-table-column>
                  <el-table-column prop="loadValue" label="工序描述">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="'work_name'">
                        <el-input v-model="scope.row.process_desc" :controls="false" type="text" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="vnotchesWidth" label="工程量单位">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="'work_unit'">
                        <el-select v-model="scope.row.unit_engineering_quantity" placeholder="请选择">
                          <el-option v-for="(item, i) in stepsUnit  " :key="i" :label="item.unit_engineering_quantity"
                            :value="item.data_id"></el-option>

                        </el-select>
                      </el-form-item>

                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="工程量数量">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.quantity_engineering_quantity" controls-position="right"
                        size="small" />
                    </template>
                  </el-table-column>


                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="detailedDelFn(scope)" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                  <div slot="append" class="child_end_fill">
                    <div class="end_span" @click="detailedAddFn">新增</div>
                  </div>
                </el-table>
              </div>

            </el-form-item>
            <el-form-item label="物料清单:" :label-width="formLabelWidth" prop="">
              <div class="procedures_name_table_detailed  procedures_name_table_procedure">
                <el-table :data="procedureTable" style="width: 100%" border stripe header-cell-class-name='listBan'>
                  <el-table-column type="index" width="50" label="序号">
                  </el-table-column>
                  <el-table-column prop="loadValue" label="物料编码">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.material_code" :controls="false" disabled="true" type="text"
                        size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="vnotchesWidth" label="物料名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.material_name" :controls="false" disabled="true" type="text"
                        size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="材料标准">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.standard_materials" :controls="false" type="text" size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="补充说明">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.additional_note" :controls="false" type="text" size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="主单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.main_unit" :controls="false" type="text" disabled="true"
                        size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="副单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.auxiliary_unit" :controls="false" type="text" disabled="true"
                        size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料需求量">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="'work_name'">
                        <el-input v-model="scope.row.material_demand" :controls="false" type="text" size="small" />
                      </el-form-item>

                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料采购量（主单位）">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="'work_name'">
                        <el-input v-model="scope.row.material_purchase_main" :controls="false" type="text"
                          size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料采购量（副单位）">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="'work_name'">
                        <el-input v-model="scope.row.material_purchase_auxiliary" :controls="false" type="text"
                          size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="是否提供车间">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.whether_workshop_supply" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>


                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="procedureDelFn(scope)" size="small">计算</el-button>
                      <el-button type="text" @click="calculationClick(scope.row)" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                  <div slot="append" class="child_end_fill">
                    <div class="end_span" @click="procedureAddFn">新增</div>
                  </div>
                </el-table>
              </div>

            </el-form-item>

          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import eventActionDefine from "./msgCompConfig";
import { Menu, MenuItem, Descriptions, DescriptionsItem, Table, TableColumn, Option, Submenu, InputNumber, Select, Upload, Input, Drawer, Form, FormItem, Button, DatePicker } from "element-ui";
import { queryUnit, queryDevices, queryFunArea } from '../api/asset'
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(DatePicker);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Upload);

export default {
  name: "AddMultiple",
  props: {
    customConfig: Object,
  },
  // computed: {
  //   componentType: function () {
  //     return "PlantForm";
  //   },
  // },
  data() {
    let currentUser = window?.currentUser || {};
    return {
      currentUser, // 当前用户
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      componentType: "Procedure", // 组件类型 emptyPage-空白页 PlantForm-计划新增
      plantList: [], // 大JSON
      formLabelWidth: "80", // 表单label宽
      detailedTable: [],  // 工序步骤数据
      procedureTable: [], //物料数据
      devicesArr: [],//关联设备
      funAreaArr: [],//功能区域
      stepsUnit: [],//工程量单位
      fileList: [],//上传文件保存
      tasksPrievw: {},//工程任务详情
      // 计划表单
      planForm: {
        reportMember: '',
        reportUnit: '',
        secondUnit: '',
        reportDate: new Date(),
        reportType: '',
        reportNum: ''
      },
      //工程任务表单
      taskForm: {
        project_name: '',//工程任务名
        project_type: '', //工程任务类型
        function_area: '',//功能区域 
        associated_devices: '',//关系设备
        requirement_for_construction: '',//规范
        remark: '',//备注
        file: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]//附件
      },
      //工序表单
      operationForm: {
        name: ''
      },
      // 校验
      rules: {
        reportMember: [
          { required: true, message: '请输入申报人', trigger: 'blur' }
        ],
        reportUnit: [
          { required: true, message: '请输入申报单位', trigger: 'change' }
        ],
        secondUnit: [
          { required: true, message: '请输入申报子单元', trigger: 'change' }
        ],
        reportDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        reportNum: [
          { required: true, message: '请输入质量记录号', trigger: 'blur' }
        ],
        reportType: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
        project_name: [
          { required: true, message: '请输入工程名', trigger: 'blur' }
        ],
        project_type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        function_area: [
          { required: true, message: '请选择功能区域', trigger: 'change' }
        ],
        associated_devices: [
          { required: true, message: '请选择关联设备', trigger: 'change' }
        ],
        work_unit: [
          { required: true, message: '请输入工程量单位', trigger: 'blur' }
        ],
        work_name: [
          { required: true, message: '请输入工序描述', trigger: 'blur' }
        ],
        procedures_name: [
          { required: true, message: '请输入工序名称', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    console.log('currentUser', this.currentUser);

    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.plantList = JSON.parse(this.customConfig.data)
      this.taskForm = this.plantList[0].tasks[0]
      this.tasksPrievw = this.plantList[0].tasks[0]
      this.operationForm = this.plantList[0].procedures[0]
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    this.querySelect()
  },
  methods: {
    //选择框查询
    querySelect() {
      queryUnit().then(res => { this.stepsUnit = res.data }).catch(err => { this.stepsUnit = [] }) //工程量单位
      queryDevices().then(res => { this.devicesArr = res.data }).catch(err => { this.devicesArr = [] }) //关联设备
      queryFunArea().then(res => { this.funAreaArr = res.data }).catch(err => { this.funAreaArr = [] })//功能区域
    },
    // 展开菜单栏
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    // 关闭菜单栏
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 新增计划
    addPalnt() {
      this.componentType = "PlantForm";
    },
    // 保存提交
    saveSub() {
      let { onChange } = this.customConfig;
      onChange(e);
    },
    //工序步骤新增
    detailedAddFn() {
      this.detailedTable.push({})
    },
    //工序步骤删除
    detailedDelFn(row) {
      const i = row.$index
      this.detailedTable.splice(i, 1)
    },
    //物料删除
    procedureDelFn(row) {
      const i = row.$index
      this.procedureTable.splice(i, 1)
    },
    //物料新增
    procedureAddFn() {
      this.procedureTable.push({})
    },
    //工序保存
    OperationSave() {

    },
    //保存的change事件
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    // async inputChange(e) {
    //   this.data = e;
    //   let { formConfig, component, onChange } = this.customConfig;
    //   await window.eventCenter.triggerEventNew({
    //     objectId: formConfig?.id,
    //     componentId: component.id,
    //     type: "report",
    //     event: "change",
    //     payload: {
    //       value: e,
    //     },
    //   });
    //   onChange(e);
    // },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    //逻辑控制 计算
    async calculationClick(e) {
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "  calculation",
        payload: {
          value: e,
        },
      });
    },
    //金额计算设值
    do_EventCenter_setValue({ value }) {
      this.procedureTable[value.index].material_demand = value.material_demand
      this.procedureTable[value.index].material_purchase_main = value.material_purchase_main
      this.procedureTable[value.index].material_purchase_auxiliary = value.material_purchase_auxiliary
    },
    Event_Center_getName() {
      return this.data;
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
  },
};
</script>

<style lang="less" scoped>
.liuChen-page {
  padding: 15px;
  display: flex;
  width: calc(100% - 30px) !important;
  height: calc(100% - 30px);
  background-color: #e7edef;

  .leftTree {
    padding: 24px 16px 0 16px;
    width: 248px;
    height: 100%;
    background-color: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;

    .plantAdd {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 24px;

      .planTitleLeft {
        display: flex;
        align-items: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        height: 24px;
        color: #373A55;

        .planImg {
          margin-right: 5px;
          width: 20px;
          height: 20px;
        }

        .planTitle {
          width: 64px;
        }
      }

      .addIcon {
        cursor: pointer;
        color: #50536a;
        font-size: 20px;
        width: 23px;
        height: 23px;
        border: 1px solid #dfe1e8;
        line-height: 19px;
        text-align: center;
        border-radius: 50%;
      }
    }

    .el-menu-vertical-demo {
      margin-top: 10px;
    }

    .emptyBox {
      margin-top: 110px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: center;
      color: #959CA6;

      .emptyIcon {
        margin-bottom: 10px;
        height: 28px;
        width: 26px;
      }
    }
  }

  // 右侧
  .rightConcent {
    margin-left: 15px;
    display: flex;
    flex: 1;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;

    // 空白页
    .rightEmptyBox {
      margin-top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: #626973;

      .rightEmptyIcon {
        height: 50px;
        width: 50px;
      }

      .rightEmptyText {
        margin: 28px 0 10px 0;
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
      }
    }

    // 计划新增
    .addplantBox {
      padding: 24px;
      width: 100%;
      display: flex;
      flex-direction: column;

      .PlantForm_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .drawerTitle {
          font-weight: 500;
          font-size: 16px;
          color: #373A55;
        }

        .saveIcon {
          margin-bottom: -1px;
          margin-right: 2px;
          width: 13px;
          height: 13px;
        }
      }

      .PlantForm_content {
        margin-top: 24px;

        .el-select {
          width: 100% !important;
        }

        .el-date-editor--date {
          width: 100% !important;
        }
      }
    }

    //工程任务新增
    .Task-page-add {
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;

      .Task_add_upload {
        width: 184px;
        height: 34px;
        color: #626973;
        /* 白色/100% */

        background: #FFFFFF;
        /* 描边/三级描边（输入框） */


        border: 1px dashed #DADDE6;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          border: 1px dashed #1A79FF;
          color: #1A79FF;
        }
      }

      .operation_headr {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;

        /deep/ .el-icon-back {
          font-size: 20px;
          cursor: pointer;
        }

        .operation_headr_itme {

          /deep/.el-button.is-round {
            display: flex;
            align-items: center;
            height: 32px;
          }

          /deep/ .el-button--primary {
            span {
              display: flex;
              align-items: center;

            }
          }
        }
      }

      .operation_main {
        /deep/ .listBan {
          background: #f7f7f7;
        }

        /deep/ .child_end_fill {
          text-align: center;
          // line-height: 65px;
          background: #fafafa;
          padding: 16px;

          .eidt_end_span {
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;
          }

          .end_span {
            cursor: pointer;
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;

            &:hover {
              color: #81befe;
              border-color: #81befe
            }
          }
        }
      }

      .el-select {
        width: 100% !important;
      }

      .upload-demo {
        width: 100% !important;

        /deep/.el-upload {
          width: 100% !important;
          text-align: justify;

        }
      }

      .el-date-editor--date {
        width: 100% !important;
      }
    }

    //工程任务详情
    .Task-page {
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;

      .descriptions_task {
        .title_class {
          display: flex;
          margin-bottom: 18px;
          justify-content: space-between;

          .title_class_start {
            // display: flex;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;

            .imgTile {
              vertical-align: middle;
              display: inline-block;
            }

            .spanTile {
              vertical-align: middle;
              display: inline;
            }
          }

          .title_class_end {
            /deep/ .el-icon-edit {
              font-size: 16px;
            }

          }

        }

        /deep/ .title_label {
          height: 22px;
          /* 14px-常规 */
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          /* 文本色/三级文本 */
          color: #959CA6;
        }

        /deep/ .title-content {
          height: 22px;
          /* 14px-常规 */
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          /* 文字色/一级文本 */
          color: #373A55;
          mix-blend-mode: normal;
        }
      }

      .task_operaList {
        margin-top: 26px;

        .task_opear_title_add {
          display: flex;
          justify-content: space-between;

          .task_opear_title {
            height: 24px;
            /* 16px-粗 */
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            color: #203040;
            display: flex;

            img {
              margin-right: 8px;
            }
          }

          .addIcon {
            cursor: pointer;
            color: #50536a;
            font-size: 20px;
            width: 36px;
            height: 36px;
            border: 1px solid #dfe1e8;
            line-height: 32px;
            text-align: center;
            border-radius: 50%;
          }
        }

        .task_opear_main {
          margin-top: 24px;

          .task_operaList_item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 16px 40px;
            gap: 107px;
            width: calc(100% - 80px);
            height: 54px;
            background: #F7F8F9;
            border-radius: 8px;
            margin-bottom: 8px;

            .text_class {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 600;
              font-size: 14px;
              line-height: 22px;
              /* identical to box */
            }

            .title_label {
              height: 22px;
              /* 14px-常规 */
              font-family: 'PingFang SC';
              font-size: 14px;
              line-height: 22px;
              /* identical to box height, or 157% */
              // display: flex;
              // align-items: center;
              /* 文本色/三级文本 */
              color: #959CA6;
            }

            .task_opera_cz {
              cursor: pointer;
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 22px;
              color: #1A79FF;
            }
          }
        }

      }
    }

    //工序新增
    .Operation-page {
      // width: 100%;
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;

      .operation_headr {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;

        /deep/ .el-icon-back {
          font-size: 20px;
          cursor: pointer;
        }

        .operation_headr_itme {
          /deep/.el-button.is-round {
            display: flex;
            align-items: center;
            height: 32px;
          }

          /deep/ .el-button--primary {
            span {
              display: flex;
              align-items: center;

            }
          }
        }
      }

      .operation_main {
        /deep/ .listBan {
          background: #f7f7f7;
        }

        .procedures_name_table_detailed {
          .el-form-item {
            margin-bottom: 0px;
          }

          .el-select {
            width: 100%;
          }
        }

        /deep/ .el-input-number {
          width: 100%;
        }

        /deep/.el-input--small {}

        /deep/ .child_end_fill {
          text-align: center;
          // line-height: 65px;
          background: #fafafa;
          padding: 16px;

          .eidt_end_span {
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;
          }

          .end_span {
            cursor: pointer;
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;

            &:hover {
              color: #81befe;
              border-color: #81befe
            }
          }
        }
      }

    }
  }
}

@font-face {
  font-family: 'iconfont';
  src: url('../utils/fonts/iconfont.ttf?t=1671106323572') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>