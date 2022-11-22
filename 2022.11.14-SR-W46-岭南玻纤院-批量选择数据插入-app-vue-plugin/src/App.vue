<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%" :ref="id">
    <!-- -->
    <el-button type="primary" @click="openDialog" size="mini">新增</el-button>
    <el-table v-if="false" :data="AListData" border style="width: 100%; margin-top: 10px" stripe @row-click="row_clickAList">
      <template v-for="(itemTitle, titleIndex) in AListShowTitleData">
        <el-table-column
          show-overflow-tooltip
          v-if="AListShowData.indexOf(itemTitle.col_alias.trim()) !== -1"
          :key="titleIndex"
          :prop="itemTitle.col_name"
          sortable
          :label="itemTitle.col_alias"
        >
          <!-- <el-table-column :key="titleIndex" :prop="itemTitle.col_name" sortable :label="itemTitle.col_alias" width="120"> -->
          <template slot-scope="scope">
            <span v-if="itemTitle.col_alias.indexOf('时间') !== -1">{{ scope.row[itemTitle.col_name] | datefmt(formatter) }}</span>
            <span v-else>{{ scope.row[itemTitle.col_name] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next,sizes"
      :total="total"
    >
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" width="60%">
      <div class="dialogTextSearch">
        <span style="font-weight: 700">筛选条件</span>
        <div>
          <el-button @click.native.prevent="reloadBList()" icon="el-icon-refresh-right" size="mini"> 重置 </el-button>
          <el-button @click.native.prevent="searchBListDialog()" icon="el-icon-search" type="primary" size="mini"> 查询 </el-button>
        </div>
      </div>
      <div>
        <el-form ref="form" :model="form"  @submit.native.prevent label-width="80px" :inline="true">
          <el-form-item label="检验项目">
            <el-input v-model="form.Test_Name" style="width: 180px" placeholder="请输入检验项目" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="searchALL">
        <i class="el-icon-warning-outline"></i>
        &nbsp;
        <span
          >查询到<span style="color: dodgerblue">{{ totalDialog }}</span
          >条相关记录</span
        >
      </div>
      <el-table :data="BListData" border row-key="data_id" style="width: 100%" ref="multipleTable" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :reserve-selection="true"> </el-table-column>
        <template v-for="(itemTitle, titleIndex) in BListShowTitleData">
          <el-table-column
            show-overflow-tooltip
            v-if="BListShowData.indexOf(itemTitle.col_alias.trim()) !== -1"
            :key="titleIndex"
            :prop="itemTitle.col_name"
            sortable
            :label="itemTitle.col_alias"
          >
            <template slot-scope="scope">
              <span v-if="itemTitle.col_alias.indexOf('时间') !== -1">{{ scope.row[itemTitle.col_name] | datefmt(formatter) }}</span>
              <span v-else>{{ scope.row[itemTitle.col_name] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        @size-change="handleSizeChangeDialog"
        @current-change="handleCurrentChangeDialog"
        :current-page="pageNumDialog"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSizeDialog"
        layout="total, prev, pager, next,sizes"
        :total="totalDialog"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateInspectionItemsEvent" size="mini">确 定</el-button>
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { Table, TableColumn, Button, Dialog, Form, FormItem, Input, Select, Option, OptionGroup, Pagination, Message } from "element-ui";
import Vue from "vue";
import Utils from "./utils";
import { queryAll, queryAssetById, updateInspectionItems, delRow, user } from "./api/asset";
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Pagination);
Vue.prototype.$message = Message;
export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "insertApp",
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
      dialogVisible: false,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageNumDialog: 1,
      pageSizeDialog: 10,
      totalDialog: 0,
      form: {
        Test_Name: "",
      },
      sysFilterData: "",
      AListData: [],
      AListShowData: [],
      AListShowTitleData: [],
      BListData: [],
      BListShowData: [],
      BListShowTitleData: [],
      multipleSelection: [],
      formatter: "",
      appVariablesMyApp: "",
      nowDep: "",
    };
  },
  mounted() {
    // this.AListShowData = this.customConfig.列表A显示字段;
    this.BListShowData = this.customConfig.列表显示字段;
    this.formatter = this.customConfig.时间显示格式 || "YYYY/MM/DD";
    this.appVariables?.forEach((item, index) => {
      if (item.name == this.customConfig.系统变量名称) {
        this.appVariablesMyApp = item.default_value;
      }
    });
    let message = {
      pageNum: 1,
      pageSize: 1000,
      queryParams: [],
    };
    queryAll(message).then((res) => {
      console.log(res);
    });
    // this.searchAList();
    this.searchBList();
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
    //用于定义接收用户输入
    this.buttons = JSON.parse(buttons).data;
    this.defaultValue = JSON.parse(buttons).defaultValue;
    //业务代码
  },
  methods: {
    searchAList() {
      let messageAList = {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          asset_id: this.customConfig?.列表A资产ID,
        },
        data: [
          {
            column: "Knowloedge_Id",
            compareObj: "acea40595ae64806aa5dbe2b0b5d121e",
            datatype: 0,
            type: 10,
          },
        ],
      };
      queryAssetById(messageAList.params, messageAList.data).then((res) => {
        this.AListData = Utils.translatePlatformDataToJsonArray(res);
        this.AListShowTitleData = res.data[0];
        this.total = res.data[2];
      });
    },
    searchBList() {
      user().then((resUser) => {
        this.nowDep = resUser.data.officeId;
        let messageAList = {
          params: {
            pageNum: this.pageNumDialog,
            pageSize: this.pageSizeDialog,
            asset_id: this.customConfig?.列表资产ID,
          },
          data: [
            {
              column: "Test_Name",
              compareObj: this.form.Test_Name,
              datatype: 0,
              type: 10,
            },
            {
              column: "Department_id",
              compareObj: this.nowDep,
              datatype: 0,
              type: 10,
            },
          ],
        };
        this.BListData = [];
        queryAssetById(messageAList.params, messageAList.data).then((res) => {
          this.BListData = Utils.translatePlatformDataToJsonArray(res);
          this.BListShowTitleData = res.data[0];
          this.totalDialog = res.data[2];
        });
      });
    },
    row_clickAList(val) {
      console.log(val);
      this.triggerEvent("");
    },
    reloadBList() {
      this.form.Test_Name = "";
      this.pageNumDialog = 1;
      this.searchBList();
    },
    searchBListDialog() {
      this.pageNumDialog = 1;
      this.searchBList();
    },
    deleteRow(row) {
      let message = {
        data_id: row.data_id,
      };
      delRow(message)
        .then((res) => {
      
        })
        .catch((error) => {
 
        });
    },
    updateInspectionItemsEvent() {
      let message = {
        treeId: this.appVariablesMyApp,
        ids: this.multipleSelection,
      };
      updateInspectionItems(message)
        .then((res) => {
          if (res.status == 200) {

            // this.searchAList();
            this.triggerEvent("");
            this.dialogVisible = false;
          }
        })
        .catch((error) => {
          console.log(error);
   
        });
    },
    openDialog() {
      this.multipleSelection = [];
      this.dialogVisible = true;
      this.$refs.multipleTable.clearSelection();
    },
    onSubmit() {
      console.log("submit!");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.searchAList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      // this.searchAList();
    },
    handleSizeChangeDialog(val) {
      this.pageSizeDialog = val;
      this.searchBList();
    },
    handleCurrentChangeDialog(val) {
      this.pageNumDialog = val;
      this.searchBList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.data_id);
      });
      console.log(this.multipleSelection);
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(data) {
      // console.log(data);
      let { componentId, appId } = this.customConfig || {};
      window.eventCenter?.triggerEventNew({
        objectId: appId,
        componentId: componentId,
        type: "app",
        event: "insertSuccess",
        payload: {
          value: data,
        },
      });
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue(value) {
      this.setValue(value);
    },
    setValue(value) {
      this.selected = value;
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
.dialogTextSearch {
  display: flex;
  justify-content: space-between;
}
.searchALL {
  height: 40px;
  width: calc(100%);
  padding: 0 20px;
  background: #eaf7fe;
  line-height: 40px;
  margin-bottom: 10px;
  span {
    font-size: 14px;
  }
}
/deep/.el-form-item {
  margin-bottom: 10px;
}
/deep/.el-dialog {
  margin-top: 6vh !important;
}
/deep/.el-pagination {
  display: flex;
  justify-content: flex-end;
}
/deep/.el-icon-warning-outline {
  color: dodgerblue;
  font-size: 16px;
  line-height: 40px;
}
/deep/.el-table__cell {
  padding: 3px 0;
}
/deep/.el-table th.el-table__cell {
  background: #fafafa;
  color: #000;
  font-size: 13px;
}
/deep/.el-button--primary {
  background-color: #225ef9;
  border-color: #225ef9;
}
/deep/.el-button--text {
  color: dodgerblue;
}
/deep/.el-dialog__body {
  padding: 0 50px;
}
/deep/.el-dialog__footer {
  text-align: center;
}
</style>
