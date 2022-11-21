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
      assetId: "6a6ed4d3-d3aa-418c-85a2-7fc7d768eaf8",
    },
  },
  data: [
    ["项目一", "", ""],
    ["项目二", "", ""],
    ["项目三", "", ""],
  ],
  configuration: {
    assetId: "15972b2f-5d89-419d-89d8-bbe0b2676116",
    defaultUrl: "https://www.bilibili.com/guochuang/?spm_id_from=666.4.0.0",
    linkField: "linkId",
    filterField: "iframeUrl",
  },
  changeConfiguration(newValue) {
    console.log("configuration has changed");
  },
};
