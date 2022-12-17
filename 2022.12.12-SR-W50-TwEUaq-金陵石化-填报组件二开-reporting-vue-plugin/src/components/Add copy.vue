<template>
  <div class="liuChen-page">
    <div class="leftTree">
      <div class="plantAdd">
        <div class="planTitleLeft">
          <img class="planImg" src="../../pluginTemp/images/Category.png" alt="">
          <span class="planTitle">计划列表</span>
        </div>
        <div v-if="plantList.length == 0" class="addIcon" @click="addPalnt">＋</div>
      </div>
      <!-- <el-menu
        v-if="plantList.length > 0"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
        <el-submenu index="1">
          <template slot="title">
            <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
            <span class="menuPlanTitle">导航一级</span>
          </template>
          <el-submenu index="1-4">
            <template slot="title">
              <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
              <span class="taskTitle">导航二级</span>
            </template>
            <el-menu-item index="1-4-1">
              <div class="dotIcon"></div>
              <span  class="stepTitle">选项1</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="1-4-2">
            <template slot="title">
              <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
              <span class="taskTitle">导航二级</span>
            </template>
          </el-submenu>
        </el-submenu>
      </el-menu> -->
      <!-- 菜单 -->
      <div v-if="plantList.length > 0" class="menu_list">
        <div class="menu_item" v-for="planTtem, planIndx in plantList" :key="planTtem.seletKey">
          <div class="menu_item_box planIdent" :class="{'menu_item_box_active': menuActive == planTtem.seletKey}" @click="changeForm(planTtem)">
            <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
            <span class="menuPlanTitle">{{planTtem.plan_name}}</span>
            <el-dropdown class="dropdownBox" trigger="click" placement="bottom-start" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more" :style="{'color': menuActive == planTtem.seletKey ? '#FFFFFF' : '#373A55'}"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{mod: 'add', item: planTtem.tasks, index: planIndx}">新增</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="menu_item" v-for="taskItem, taskIndx in planTtem.tasks" :key="taskItem.seletKey">
            <div class="menu_item_box taskIdent" :class="{'menu_item_box_active': menuActive == taskItem.seletKey}" @click="changeForm(taskItem)">
              <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
              <span class="taskTitle">{{taskItem.task_name}}</span>
              <el-dropdown class="dropdownBox" trigger="click" placement="bottom-start" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" :style="{'color': menuActive == taskItem.seletKey ? '#FFFFFF' : '#373A55'}"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{mod: 'add', item: taskItem.procedures, index: taskIndx}">新增</el-dropdown-item>
                  <el-dropdown-item :command="{mod: 'del', item: planTtem.tasks, index: taskIndx}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="menu_item" v-for="procedures, proceduresIndx in taskItem.procedures" :key="procedures.seletKey">
              <div class="menu_item_box stepIdent" :class="{'menu_item_box_active': menuActive == procedures.seletKey}" @click="changeForm(procedures)">
                <div class="dotIcon"></div>
                <span class="stepTitle">{{procedures.name}}</span>
                <el-dropdown class="dropdownBox" trigger="click" placement="bottom-start" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more" :style="{'color': menuActive == procedures.seletKey ? '#FFFFFF' : '#373A55'}"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{mod: 'del', item: taskItem.procedures, index: proceduresIndx}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 菜单无数据 -->
      <div v-if="plantList.length == 0" class="emptyBox">
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
        <el-button style="width: 124px; font-size: 16px;" size="small" type="primary" @click="addPalnt()" round plain>＋新增计划</el-button>
      </div>
      <!-- 计划新增 -->
      <div v-if="componentType == 'PlantForm'" class="addplantBox">
        <div class="PlantForm_title">
          <span class="drawerTitle">计划信息</span>
          <el-button style="width: 96px; font-size: 14px;" size="small" type="primary" @click="saveSub('planForm')" round>
            <img class="saveIcon" src="../../pluginTemp/images/saveIcon.png" alt="">
            保存
          </el-button>
        </div>
        <div class="PlantForm_content">
          <el-form :model="planForm" :rules="rules" ref="planForm" size="small">
            <el-form-item label="计划名称：" :label-width="formLabelWidth" prop="addName">
              <el-input v-model="planForm.plan_name" :clearable="true" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="申报人：" :label-width="formLabelWidth" prop="applicant">
              <el-input v-model="planForm.applicant" :readonly="true" :clearable="true" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="申报单位：" :label-width="formLabelWidth" prop="applicant_unit">
              <el-select v-model="planForm.applicant_unit" placeholder="请选择" :readonly="true">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报子单位：" :label-width="formLabelWidth" prop="subunit">
              <el-select v-model="planForm.subunit" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报时间：" :label-width="formLabelWidth" prop="applicant_date">
              <el-date-picker
                v-model="planForm.applicant_date"
                format="yyyy-MM-DD"
                type="date"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划类型：" :label-width="formLabelWidth" prop="plan_type">
              <el-select v-model="planForm.plan_type" placeholder="请选择">
                <el-option v-for="item in planTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质量记录号：" :label-width="formLabelWidth" prop="quality_record_number"> 
              <el-input v-model="planForm.quality_record_number" autocomplete="off" placeholder="请输入" :clearable="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="预估工程费：" :label-width="formLabelWidth" prop="quality_record_number"> 
              <el-input v-model="planForm.quality_record_number" autocomplete="off" placeholder="请输入" :clearable="true"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="请输入名称"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="nameForm" :rules="rules" ref="addNameForm" size="small">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="addName"> 
          <el-input v-model.trim="nameForm.addName" :clearable="true" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeDialog('addNameForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import eventActionDefine from "./msgCompConfig";
import { Menu, MenuItem, Submenu, Drawer, Form, FormItem, Button, DatePicker, Dropdown, DropdownMenu, DropdownItem, Dialog} from "element-ui";

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dialog);

export default {
  name: "Add",
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
      componentType: "PlantForm", // 组件类型 emptyPage-空白页 PlantForm-计划新增
      plantList: [], // 大JSON
      menuActive: '',
      formLabelWidth: "80", // 表单label宽
      dialogVisible: false,
      nameForm: {
        addName: ""
      },
      clickTtem: {},
      clickType: "",
      // 计划表单
      planForm: {
        data_id: "", // 主键
        plan_name: "", // 计划名称
        plan_number: "", // 计划编号
        plan_type: "", // 计划类型
        applicant: "", // 申报人
        applicant_unit: "", // 申报单位
        subunit: "", // 子单元
        applicant_date: new Date(), // 申报日期
        quality_record_number: "NL/QR-PD-06", // 质量记录号
        mode_type: "Plan", // 类型
      },
      planTypeList: ['临时','月度','大修单项','维保'],  // 计划类型
      // 校验
      rules: {
        applicant: [
          { required: true, message: '请输入申报人', trigger: 'blur' }
        ],
        applicant_unit: [
          { required: true, message: '请输入申报单位', trigger: 'change' }
        ],
        subunit: [
          { required: true, message: '请输入申报子单元', trigger: 'change' }
        ],
        applicant_date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        quality_record_number: [
          { required: true, message: '请输入质量记录号', trigger: 'blur' }
        ],
        plan_type: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
        addName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
      }
    };
  },
  mounted() {
    let josnData = `[
      {
        "plan_id":"001","plan_name":"创建第一个计划","mode_type":"Plan","plan_no":"","plan_type":"","applicant":"","applicant_dept":"","sub_dept":"","applicant_date":"","quality_no":"",
        "tasks":[
          {
            "task_id":"001-001",
            "task_name":"创建第11个任务",
            "mode_type":"Task",
            "task_type":"",
            "plan_id":"",
            "fun_region":"",
            "relation_device":"",
            "standard":"",
            "remark":"",
            "attachment":"",
            "procedures":[
              {
                "id":"001-001-001",
                "name":"创建第111个工序",
                "mode_type":"Procedure","remark":"",
                "task_id":"",
                "steps":[
                  {
                    "id":"",
                    "name":"",
                    "procedure_id":"",
                    "work_unit":"",
                    "work_num":""
                  }
                ],
                "materials":[
                  {
                    "id":"",
                    "procedure_id":"",
                    "name":"","code":"",
                    "standard":"",
                    "remark":"",
                    "unit":"",
                    "number":"",
                    "workshop_flag":""
                  }
                ]
              },
              {
                "id":"001-001-001",
                "name":"创建第112个工序",
                "mode_type":"Procedure","remark":"",
                "task_id":"",
                "steps":[
                  {
                    "id":"",
                    "name":"",
                    "procedure_id":"",
                    "work_unit":"",
                    "work_num":""
                  }
                ],
                "materials":[
                  {
                    "id":"",
                    "procedure_id":"",
                    "name":"","code":"",
                    "standard":"",
                    "remark":"",
                    "unit":"",
                    "number":"",
                    "workshop_flag":""
                  }
                ]
              },
              {
                "id":"001-001-001",
                "name":"创建第113个工序",
                "mode_type":"Procedure","remark":"",
                "task_id":"",
                "steps":[
                  {
                    "id":"",
                    "name":"",
                    "procedure_id":"",
                    "work_unit":"",
                    "work_num":""
                  }
                ],
                "materials":[
                  {
                    "id":"",
                    "procedure_id":"",
                    "name":"","code":"",
                    "standard":"",
                    "remark":"",
                    "unit":"",
                    "number":"",
                    "workshop_flag":""
                  }
                ]
              }
            ]
          },
          {
            "task_id":"001-001",
            "task_name":"创建第12个任务",
            "mode_type":"Task",
            "task_type":"",
            "plan_id":"",
            "fun_region":"",
            "relation_device":"",
            "standard":"",
            "remark":"",
            "attachment":"",
            "procedures":[
              {
                "id":"001-001-001",
                "name":"创建第121个工序",
                "mode_type":"Procedure","remark":"",
                "task_id":"",
                "steps":[
                  {
                    "id":"",
                    "name":"",
                    "procedure_id":"",
                    "work_unit":"",
                    "work_num":""
                  }
                ],
                "materials":[
                  {
                    "id":"",
                    "procedure_id":"",
                    "name":"","code":"",
                    "standard":"",
                    "remark":"",
                    "unit":"",
                    "number":"",
                    "workshop_flag":""
                  }
                ]
              }
            ]
          },
          {
            "task_id":"001-001",
            "task_name":"创建第13个任务",
            "mode_type":"Task",
            "task_type":"",
            "plan_id":"",
            "fun_region":"",
            "relation_device":"",
            "standard":"",
            "remark":"",
            "attachment":"",
            "procedures":[
              {
                "id":"001-001-001",
                "name":"创建第131个工序",
                "mode_type":"Procedure","remark":"",
                "task_id":"",
                "steps":[
                  {
                    "id":"",
                    "name":"",
                    "procedure_id":"",
                    "work_unit":"",
                    "work_num":""
                  }
                ],
                "materials":[
                  {
                    "id":"",
                    "procedure_id":"",
                    "name":"","code":"",
                    "standard":"",
                    "remark":"",
                    "unit":"",
                    "number":"",
                    "workshop_flag":""
                  }
                ]
              }
            ]
          }
        ]
      }]`;
    this.plantList = JSON.parse(josnData);
    this.forKey(this.plantList);
    console.log('currentUser', this.currentUser);
    setTimeout(()=>{
      console.log('this.plantList',this.plantList)
    },500)
    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  },
  methods: {
    // key
    forKey(list) {
      list.forEach((x,index) =>{
        x.seletKey = `00${index}`;
        if (x.tasks.length > 0) {
          x.tasks.forEach((y,yIndex) =>{
            y.seletKey = `${x.seletKey}-00${yIndex}`;
            if (y.procedures.length > 0) {
              y.procedures.forEach((els,elsIndex) =>{
                els.seletKey = `${y.seletKey}-00${elsIndex}`;
              })
            }
          })
        }
      })
    },
    // 展开菜单栏
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    // 关闭菜单栏
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 点击菜单
    changeForm(item) {
      this.menuActive = item.seletKey;
      console.log('activeitem',item);
      switch (item.mode_type) {
        case "Plan":
        this.componentType = "PlantForm";
          break;
        case "Task":
        this.componentType = "PlantForm";
          break;
        case "Procedure":
        this.componentType = "PlantForm";
          break;
      }
    },
    // 新增计划
    addPalnt() {
      this.componentType = "PlantForm";
    },
    // 保存提交
    saveSub(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          console.log('11111111');
          let { onChange } = this.customConfig;
          onChange(e);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新增与删除
    handleCommand({mod, item, index}) {
      console.log(mod, item, index);
      this.clickTtem = item;
      if (mod == 'add') {
        this.planForm = {
          data_id: "", // 主键
          plan_name: "", // 计划名称
          plan_number: "", //计划编号
          plan_type: "", // 计划类型
          applicant: "", // 申报人
          applicant_unit: "", // 申报单位
          subunit: "", // 子单元
          applicant_date: new Date(), // 申报日期
          quality_record_number: "", // 质量记录号
          mode_type: "Plan", // 类型
        }
        this.dialogVisible = true;
        let { mode_type } = item;
        this.clickType = mode_type;
      } else {
        item = item.splice(index,1);
        this.forKey(this.plantList);
      }
    },
    // 名称
    closeDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          switch (this.clickType) {
            case "Plan":
              this.componentType = "PlantForm";
              break;
            case "Task":
              this.componentType = "PlantForm";
              break;
          }
          this.dialogVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
    do_EventCenter_setValue({ value }) {
      this.data = value;
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
    .menu_list {
      width: 100%;
      height: calc(100% - 40px);
      user-select: none;
      margin-top: 10px;
      overflow-y: scroll;
      overflow-x: hidden;
      .menu_item {
        width: 100%;
        box-sizing: border-box;
        .menu_item_box {
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          .dropdownBox {
            margin-left: auto;
            margin-right: 10px;
          }
          .menuPlanTitle,.taskTitle {
            font-weight: 500;
            font-size: 14px;
            color: #373A55;
          }
          .stepTitle {
            font-weight: 400;
            font-size: 14px;
            color: #626973;
          }
          .menuIcon {
            margin-right: 5px;
            width: 13px;
            height: 13px;
          }
          .dotIcon {
            display: inline-block;
            margin-right: 10px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #959CA6;
          }
        }
        .menu_item_box_active {
          background: #1A79FF;
          border-radius: 4px;
          .dotIcon {
            background-color: #FFFFFF;
          }
          .menuPlanTitle,.taskTitle {
            color: #FFFFFF;
          }
          .stepTitle {
            color: #FFFFFF;
          }
        }
      }
      .planIdent {
        padding-left: 10px;
      }
      .taskIdent {
        padding-left: 20px;
      }
      .stepIdent {
        padding-left: 30px;
      }
    }
    .menu_list::-webkit-scrollbar {
      /*滚动条整体样式*/
      width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    .menu_list::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 6px;
      background: #e7edef;
    }
    .menu_list::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 6px;
      background: #FFFFFF;
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
  }
}
// /deep/ .el-menu-vertical-demo {
    //   margin-top: 10px;
    //   border-right: none !important;
    //   .el-submenu__title {
    //     height: 36px !important;
    //     line-height: 36px !important;
    //   }
    //   .el-menu-item {
    //     height: 36px !important;
    //     line-height: 36px !important;
    //   }
    //   .menuIcon {
    //     margin-right: 4px;
    //     width: 13px;
    //     height: 13px;
    //   }
    //   .menuPlanTitle,.taskTitle {
    //     font-weight: 500;
    //     font-size: 14px;
    //     color: #373A55;
    //   }
    //   .stepTitle {
    //     font-weight: 400;
    //     font-size: 14px;
    //     color: #626973;
    //   }
    //   .dotIcon {
    //     display: inline-block;
    //     margin-right: 10px;
    //     width: 6px;
    //     height: 6px;
    //     border-radius: 50%;
    //     background-color: #959CA6;
    //   }
    //   .el-submenu__icon-arrow {
    //     display: none;
    //   }
    //   .el-menu-item.is-active {
    //     background: #1A79FF;
    //     border-radius: 4px;
    //     .dotIcon {
    //       background-color: #FFFFFF;
    //     }
    //     .stepTitle {
    //       color: #FFFFFF;
    //     }
    //   }
    // }
</style>