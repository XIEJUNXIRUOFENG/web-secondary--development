export default {
  variable: { default_value: "测试的数据", id: "测试的ID" },
  options: {
    // auto: true,
    // showToolbar: false,
    // columns: ["年份", "数值", "指标名称"],
    // showColumns: ["指标名称", "数值"],
    // dataSourceType: 2,
    // customCss: "",
    externalVariables: {
      assetId: "ac7a6044-cbc0-611b-e207-8cf25bb5fd38",
      urlSelectKey: 'pageName',
      officeIdKey: 'officeId',
      assetFliterKey: 'concat_office_id',
      deveiceIdKey: 'device_id',
      intervalTime: '10'
    }
  },
  data: [
    ["项目一", "", ""],
    ["项目二", "", ""],
    ["项目三", "", ""]
  ],
  configuration: {
    background: "red"
  },
  changeConfiguration(newValue) {
    console.log("configuration has changed");
  }
};