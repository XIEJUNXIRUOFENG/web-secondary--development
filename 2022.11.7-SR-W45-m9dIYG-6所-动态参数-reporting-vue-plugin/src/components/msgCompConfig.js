// 组件可派发事件
export const events = [
  {
    key: "change",
    name: "内容改变",
    payload: [
      {
        name: "内容",
        key: "value",
        dataType: "string",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "passInParams",
    name: "传入动态参数",
    params: [
      {
        key: "value",
        name: "参数",
        dataType: "object",
      },
    ],
  },
];

export default {
  actions,
  events,
};
