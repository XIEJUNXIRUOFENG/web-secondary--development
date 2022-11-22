// 组件可派发事件
export const events = [
  {
    key: "setForm",
    name: "上报记录",
    payload: [
      {
        name: "参数",
        key: "formValue",
        dataType: "string",
      },
    ],
  },
  {
    key: "refreshList",
    name: "刷新列表",
    payload: [
      {
        name: "",
        key: "",
        dataType: "",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [];

export default {
  actions,
  events,
};
