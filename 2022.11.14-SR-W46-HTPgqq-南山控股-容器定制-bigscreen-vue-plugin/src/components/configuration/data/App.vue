<template>
  <el-form ref="dataForm" :model="dataForm">
    <el-form-item label="资产ID">
      <el-input v-model="dataForm.assetId" size="samll"></el-input>
    </el-form-item>

    <el-form-item label="默认地址">
      <el-input v-model="dataForm.defaultUrl" size="samll"></el-input>
    </el-form-item>

    <el-form-item label="链接对应字段">
      <el-input v-model="dataForm.linkField" size="samll"></el-input>
    </el-form-item>

    <el-form-item label="过滤字段名称">
      <el-input v-model="dataForm.filterField" size="samll"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { Form, FormItem, Input } from "element-ui";
import Vue from "vue";
import configurationMixin from "@/mixins/configuration.js";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

export default {
  name: "DataConfiguration",

  data() {
    return {
      dataForm: {
        assetId: "",
        defaultUrl: "",
        linkField: "",
        filterField: "",
      },
    };
  },

  mixins: [configurationMixin],

  mounted() {
    this.dataForm = this.newOptions;
  },

  watch: {
    "dataForm.assetId": function (value, oldValue) {
      this.handleValueChange();
    },
    "dataForm.defaultUrl": function (value, oldValue) {
      this.handleValueChange();
    },
    "dataForm.linkField": function (value, oldValue) {
      this.handleValueChange();
    },
    "dataForm.filterField": function (value, oldValue) {
      this.handleValueChange();
    },
  },

  methods: {
    handleValueChange() {
      this.newOptions = this.dataForm;
      this.handleSubmit();
    },
  },
};
</script>
