import React, { useEffect, useState } from "react";
import Icon, { CheckCircleOutlined, InfoCircleFilled } from '@ant-design/icons';
import PropTypes from "prop-types";
// import vConsole from '../../utils/vconsole'
import { bindPatrolPoint } from './../../api/asset';
import './index.less';

const List = (props) => {
  const {
      dataSource,
      customParams,
      dataId,
      deleteData
  } = props;
  /* 
  任务ID: taskId
  路线ID：routeId
  dataId主键变量名：dataIdKey
  上报记录跳转路径：routerUrl
  */
  const taskIdKey = customParams?.taskIdKey || "";
  const routeIdKey = customParams?.routeIdKey || "";
  const dataIdKey = customParams?.dataIdKey || "";
  const routerUrl = customParams?.routerUrl || "";
  let taskid = "";
  let routeid = "";

  const [ dialogVisible, setDialogVisible ] = useState(false);
  const [ dotLoading, setDotLoading ] = useState('');
  const [ phonePower, setPhonePower ] = useState('');
  const [NFCBind, setNFCBind] = useState(0);
  const [fromData, setFromData] = useState(null);
  const [messageTip, setMessageTip] = useState('');
  const [nfcTaskId, setNfcTaskId] = useState('');
  const [nfcRouteId, setNfcRouteId] = useState('');

  useEffect(() => {
    console.log('props-list', props);
    taskid = getQueryString(taskIdKey)
    routeid = getQueryString(routeIdKey)
    console.log('taskid==', taskid, 'routeid==', routeid);
    setNfcTaskId(taskid)
    setNfcRouteId(routeid)
    if (window.IotJSInterface) {
      window.IotJSInterface.putNFCResult = putNFCResult;
    } else {
      window.IotJSInterface = {
        putNFCResult: putNFCResult
      }
    }
    // 判断当前系统是ios还是安卓
    let u = navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      console.log('安卓手机')
      window.FEParksJSInterface.startNFCListening()
      setDialogVisible(true)
      setDotLoading("load")
      setPhonePower("Android")
    }
    if (isIOS) {
      console.log('苹果手机')
      window.webkit.messageHandlers.FEParksJSInterface.startNFCListening();
      setDialogVisible(true)
      setDotLoading("load")
      setPhonePower("ios")
    }
  }, [])

  const getQueryString = (name) => {
    const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return r[1];
    return "";
  }

  // 请求接口
  const putNFCResult = (pointName) => {
    console.log('NFCRes', pointName);
    // let params = {
    //   task_id: "XJ_T20221111000290",
    //   patrol_spot_nfc: "BW_PT_20221",
    //   route_id: "XG_L20221027000005",
    // }
    let params = {
      task_id: taskid,
      patrol_spot_nfc: pointName,
      route_id: routeid,
    }

    bindPatrolPoint(params).then(({ data }) => {
      console.log('data', data);
      setFromData(data)
      setMessageTip(data.msg)
      setNFCBind(data.successFlag)
      if (data) {
        setDotLoading('success')
      }
    }).catch(({ data }) => {
      console.log('err', data);
      if (data.status == 500) {
        setMessageTip(data.result.message)
        setDotLoading('success')
      } else {
        setMessageTip("绑定失败！")
        setDotLoading('success')
      }
    })
  }

  const footBtnHandel = (vals) => {
    diaLogClose();
    if (vals == '1') {
      props.allParams.loadRefresh && props.allParams.loadRefresh();
    }
  }

  const diaLogClose = () => {
    switch (phonePower) {
      case 'Android':
        setDotLoading('')
        setDialogVisible(false)
        window.FEParksJSInterface.stopNFCListening()
        break;
      case 'ios':
        setDotLoading('')
        setDialogVisible(false)
        window.webkit.messageHandlers.FEParksJSInterface.stopNFCListening();
        break;
    }
  }

  const setForm = () => {
    let dataIds = fromData.data_id;
    console.log('dataId', dataId);
    // triggerEvent('setForm',dataId)
    let urlA = routerUrl.indexOf('?')
    diaLogClose();
    if (urlA != "-1") {
      // alert(`${window.location.origin}${routerUrl}&${dataIdKey}=${dataId}`)
      window.location.href = `${window.location.origin}${routerUrl}&${dataIdKey}=${dataIds}`;
    } else {
      // alert(`${window.location.origin}${routerUrl}?${dataIdKey}=${dataId}`)
      window.location.href = `${window.location.origin}${routerUrl}?${dataIdKey}=${dataIds}`;
    }
  }

  return (
    <div className="iotNFC">
      {dialogVisible ? 
        <div className="zhezhao" onClick={diaLogClose} >
          {/* 加载 */}
          {dotLoading == 'load' ?
            <div className="loading">
              <div className="dotBox">
                <div className="greenDot"></div>
                <div className="yellowDot"></div>
                <div className="blueDot"></div>
              </div>
            </div> : ""
          }
          {/* 绑定 */}
          {dotLoading == 'success' ? 
            <div v-if="dotLoading == 'success'" className="dialogBox">
              <div className="dialogBody">
                <b className="nfcTitle">NFC绑定</b>
                <div className="nfcTip" style={{ color: NFCBind == 1 ? '#75d4c4' : '#ff8d8d' }}>
                  {NFCBind == 0 ? <InfoCircleFilled style={{ fontSize: '18px', color: '#ff8d8d' }} /> : <CheckCircleOutlined style={{ fontSize: '18px', color: '#75d4c4' }} />}&nbsp;&nbsp;{messageTip}
                </div>
              </div >
              <div className="lineHr"></div>
              {NFCBind == 0 ? 
                <div className="dialogFoot">
                  <div className="footBtn" onClick={() => { footBtnHandel('0') }}>知道了</div>
                </div >
                :
                <div className="dialogFoot">
                  <div className="footBtn btnClass" onClick={setForm}>上报记录</div >
                  <div className="footBtn" onClick={() => { footBtnHandel('1') }}>确认</div >
                </div >
              }
            </div > : ""
          }
        </div > : ""
      }
    </div >
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
