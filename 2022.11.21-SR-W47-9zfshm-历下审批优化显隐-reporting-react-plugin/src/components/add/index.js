import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Input } from "antd";
import { getUserInfo } from "../../api/asset";
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import { getThemeStyle } from "../themeColor";

const Add = (props) => {
  const {
    data,
    onChange,
    formConfig,
    component,
    detailInfo,
    configuration: propsConfiguration,
    type,
    isMobile,
  } = props;
  console.log("props:add", props);
  const state2 = useRef(data);
  const [spyj, setSpyj] = useState(""); //审批意见
  const [sgin, setSgin] = useState(""); //签名
  const [spsjc, setSpsjc] = useState(""); //时间戳
  const [hiddenDom, setHiddenDom] = useState(true); //显隐
  const [state, setState] = useState(data);
  const [configuration, setConfiguration] = useState({});
  async function getData() {
    let comInfo = [];
    if (data) {
      comInfo = data.split("@@");
    }
    if (comInfo.length > 0 && comInfo[0]) {
      setSpyj(comInfo[0]);
    }
    if (comInfo.length > 0 && comInfo[1]) {
      setSgin(comInfo[1]);
    }
    if (comInfo.length > 0 && data[2]) {
      setSpsjc(comInfo[2]);
    }
  }
  useEffect(() => {
    try {
      setConfiguration(JSON.parse(propsConfiguration));
      if (
        (detailInfo && detailInfo.dataId !== "") ||
        (isMobile && type === "Edit")
      )
        getData();
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const triggerEventCenter = async (targetValue) => {
    await window.eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: "change",
      payload: {
        value: targetValue,
      },
    });
  };

  const do_EventCenter_getValue = function () {
    console.log(state2.current);
    return {
      value: state2.current,
    };
  };

  const do_EventCenter_setValue = function ({ value }) {
    setState(value);
    // state2.current = value;
  };

  const do_EventCenter_hiddenFun = function ({ value }) {
    setHiddenDom(value);
  };

  const Event_Center_getName = () => {
    return `${formConfig?.form_name}-${component.columnStyle.title}`;
  };

  // 事件中心注册挂载
  useDelegator(
    component.id,
    { Event_Center_getName, do_EventCenter_getValue, do_EventCenter_setValue, do_EventCenter_hiddenFun },
    eventActionDefine,
    formConfig?.id,
    null,
    -1,
    { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
  );

  if (
    (detailInfo && detailInfo.dataId !== "") ||
    (isMobile && type === "Edit")
  ) {
    if (!data){
      return <></>;
    } else {
      return (
        (hiddenDom ?
          <>
            <div className="spyj">{spyj}</div>
            <div className="sgin">
              {sgin ? sgin.startsWith("/") ? <img src={sgin}></img> : sgin : ""}
            </div>
            <div className="spsj">{spsjc}</div>
          </>
          : <></>
        )
      );
    };
  }else{
    return <></>;
  }
  // return (
  //   <></>
  //   // <Input
  //   //   style={getThemeStyle(formConfig.theme)}
  //   //   value={state}
  //   //   defaultValue={data}
  //   //   onChange={(e) => {
  //   //     onChange(e.target.value);
  //   //     triggerEventCenter(e.target.value);
  //   //     state2.current = e.target.value;
  //   //     setState(e.target.value);
  //   //   }}
  //   //   {...configuration}
  //   // />
  // );
};

Add.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Add;
