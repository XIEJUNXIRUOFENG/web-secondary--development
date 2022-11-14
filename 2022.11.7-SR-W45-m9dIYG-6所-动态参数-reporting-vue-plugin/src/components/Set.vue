<template>
  <div class="outermost_box">
    <!-- 描述模板 -->
    <el-form ref="dataForm" :model="dataForm" label-width="100px">
      <div v-for="item in paramsData" :key="item.data_id">
        <el-tabs v-if="item.audit_status == '2'" v-model="item.name">
          <el-tab-pane :label="item.name" :name="item.name">
            <el-row>
              <div v-for="e in item.descTmplDetails" :key="e.data_id">
                <el-col :span="formColList || 24">
                  <el-form-item :prop="item.name + '.' + e.descItem.name" :label="e.descItem.name" :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }">
                    <!-- type1 输入框 -->
                    <el-input v-if="e.descItem.value_type == '1'" v-model="dataForm[item.name][e.descItem.name]" :maxlength="e.descItem.value_length" :placeholder="`请输入${e.descItem.name}`" clearable style="width: 100%"></el-input>
                    <!-- type2 数字框 -->
                    <el-input-number v-if="e.descItem.value_type == '2'" v-model="dataForm[item.name][e.descItem.name]" :maxlength="e.descItem.value_length" :placeholder="`请输入${e.descItem.name}`" clearable controls-position="right" style="width: 100%"></el-input-number>
                    <!-- type3 日期框 -->
                    <el-date-picker v-if="e.descItem.value_type == '3'" v-model="dataForm[item.name][e.descItem.name]" align="right" type="date" placeholder="请选择日期" style="width: 100%"></el-date-picker>
                    <!-- type4 日期时间框 -->
                    <el-date-picker v-if="e.descItem.value_type == '4'" v-model="dataForm[item.name][e.descItem.name]" type="datetime" placeholder="请选择日期时间" style="width: 100%"></el-date-picker>
                    <!-- type5 下拉框 -->
                    <el-select v-if="e.descItem.value_type == '5'" v-model="dataForm[item.name][e.descItem.name]" placeholder="请选择" style="width: 100%">
                      <el-option v-for="item in e.descItem.descItemDicts" :key="item.data_id" :label="item.dict_label" :value="item.dict_key"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import { queryDynamicParams } from "../api/asset";

export default {
  name: "Set",

  props: {
    customConfig: Object,
  },

  data() {
    return {
      // 配置项参数
      configuration: {},
      // 表单数据
      paramsData: [],
      // 表单
      dataForm: {},
      // 布局列表
      formColList: "",
    };
  },

  mounted() {
    // 注册逻辑控制
    window?.componentCenter?.register(this.customConfig.componentId, "comp", this, eventActionDefine);
    // 解析配置项参数
    try {
      this.configuration = JSON.parse(this.customConfig.configuration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  },

  methods: {
    // 获取动态参数 生成Form表单
    getDynamicParams(params) {
      this.formColList = params.colList;

      queryDynamicParams(params.assetId)
        .then((res) => {
          this.paramsData = res.data;
          let newFormList = {};

          res.data.forEach((item) => {
            newFormList[item.name] = {};
            item.descTmplDetails.forEach((e) => {
              if (e.descItem.audit_status == "2") {
                if (e.descItem.value_type == "2") {
                  newFormList[item.name][e.descItem.name] = undefined;
                } else {
                  newFormList[item.name][e.descItem.name] = null;
                }
              }
            });
          });

          this.dataForm = newFormList;
        })
        .catch((err) => {
          this.$message.warning(err.data.message);
        });
    },

    // 注册组件
    Event_Center_getName() {
      return "6所-动态参数";
    },
  },

  // 销毁组件
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
  },
};
</script>

<style lang="less">
// 最外层盒子
.outermost_box {
  width: 100%;
  height: 100%;
}
</style>
