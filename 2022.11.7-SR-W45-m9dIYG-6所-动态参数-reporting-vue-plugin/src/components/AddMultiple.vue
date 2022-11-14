<template></template>

<script>
export default {
  name: "AddMultiple",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data.split(""),
    };
  },
};
</script>

<style lang="less">
.input-with-select {
  .el-input-group__prepend {
    background-color: #fff;
    .el-select .el-input {
      width: 130px;
    }
  }
}
</style>
