<template>
   <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-form-item label="资产ID">
         <el-input size="small" placeholder="请输入资产ID" v-model="dataForm.assetId"></el-input>
      </el-form-item>

      <el-form-item label="展示字段">
         <el-input size="small" placeholder="请输入展示字段" v-model="dataForm.showField"></el-input>
      </el-form-item>

      <el-form-item label="储存字段">
         <el-input size="small" placeholder="请输入储存字段" v-model="dataForm.saveField"></el-input>
      </el-form-item>
   </el-form>
</template>

<script>
export default {
   data() {
      return {
         dataForm: {
            assetId: "",
            showField: "",
            saveField: "",
         },
      };
   },

   watch: {
      "dataForm.assetId": function (value, oldValue) {
         this.onFormLayoutChange();
      },
      "dataForm.showField": function (value, oldValue) {
         this.onFormLayoutChange();
      },
      "dataForm.saveField": function (value, oldValue) {
         this.onFormLayoutChange();
      },
   },

   props: {
      customConfig: Object,
   },
   methods: {
      onFormLayoutChange() {
         this.customConfig.changeConfiguration(JSON.stringify(this.dataForm));
      },
   },
   mounted() {
      this.dataForm = JSON.parse(this.customConfig.configuration || "{}");
   },
};
</script>
