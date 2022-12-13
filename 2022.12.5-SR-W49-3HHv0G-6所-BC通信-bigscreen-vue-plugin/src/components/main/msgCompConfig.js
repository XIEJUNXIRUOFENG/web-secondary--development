// 组件可派发事件
export const events = [
  {
    key: "receiveBCInfo",
    name: "接收BC信息",
    payload: [
      {
        name: "BC信息",
        dataType: "string",
        key: "value",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  // {
  //   key: "changeColor",
  //   name: "改变颜色",
  //   params: [
  //     {
  //       key: "color",
  //       name: "颜色",
  //       dataType: "string"
  //     }
  //   ],
  //   hasReturn: false,
  //   // hasReturn为false则不用写returns选项
  //   returns: [
  //     {
  //       key: "value",
  //       name: "值",
  //       dataType: "string"
  //     }
  //   ]
  // }
];

export default {
  actions,
  events,
};
