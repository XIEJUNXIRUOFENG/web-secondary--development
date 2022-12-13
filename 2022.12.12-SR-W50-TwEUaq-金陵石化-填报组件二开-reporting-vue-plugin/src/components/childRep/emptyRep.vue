<template>
  <div class="emptyRep-page">
    2
  </div>
</template>

<script>

export default {
  name: "emptyRep",
  props: {
    dataSource: {
      type: Object,
      default: () => {}
    },
    changeComponentType: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      data: []
    };
  },
  mounted() {
    this.data = JSON.parse(JSON.stringify(this.dataSource));
  },
  methods: {
    inputChange(e) {
      this.changeComponentType();
    },
  }
};
</script>

<style lang="less" scoped>
.emptyRep-page {
  width: 100%;
  height: 100%;
  background-color: pink;
}
</style>