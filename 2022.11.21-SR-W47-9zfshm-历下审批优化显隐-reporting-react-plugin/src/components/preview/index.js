import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { getUserInfo } from "../../api/asset";
import { getThemeStyle } from "../themeColor";
import { useEffect, useState } from "react";
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
const Preview = (props) => {
  const {
    component,
  } = props;
  console.log("props:preview3 ", props);
  const { data, formConfig } = props;
  const [spyj, setSpyj] = useState(""); //审批意见
  const [sgin, setSgin] = useState(""); //签名
  const [spsjc, setSpsjc] = useState(""); //时间戳
  const [hiddenDom, setHiddenDom] = useState(true); //显隐
  useEffect(() => {
    getData();
  }, []);
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
  
  const do_EventCenter_hiddenFun = function ({ value }) {
    setHiddenDom(value);
  };
  // 事件中心注册挂载
  useDelegator(
    component.id,
    { do_EventCenter_hiddenFun },
    eventActionDefine,
    formConfig?.id,
    null,
    -1,
    { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
  );
  return (
    ( hiddenDom ?
      <div style={getThemeStyle(formConfig.theme)}>
        <div className="spyj">{spyj}</div>
        <div className="sgin">
          {sgin ? sgin.startsWith("/") ? <img src={sgin}></img> : sgin : ""}
        </div>
        <div className="spsj">{spsjc}</div>
      </div>
      : <></>
    )
  );
};

Preview.propTypes = {
  data: PropTypes.string,
};

export default Preview;
