<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="数据">
      <el-input v-model="form.rateTags" type="textarea" :rows="8"></el-input>
    </el-form-item>
    <el-form-item label="辅助文字">
      <el-input v-model="form.rateTitle"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        rateTags: "",
        rateTitle: ""
      },
    };
  },

  watch: {
    "form.rateTags": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.rateTitle": function (value, oldValue) {
      this.onFormLayoutChange();
    }
  },

  props: {
    customConfig: Object,
  },
  methods: {
    onFormLayoutChange() {
      this.customConfig.changeConfiguration(JSON.stringify(this.form));
    },
  },
  mounted() {
    this.form = JSON.parse(this.customConfig.configuration || "{}");
    console.log('this.form',this.form);
  },
};
</script>
