<template>
  <el-form ref="form" :model="form"></el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        placeholder: "",
      },
    };
  },

  watch: {
    "form.placeholder": function (value, oldValue) {
      this.onFormLayoutChange();
    },
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
  },
};
</script>
