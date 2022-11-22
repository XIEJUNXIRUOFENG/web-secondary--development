import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import vConsole from '../../utils/vconsole'
import { Button } from "antd";
import { queryAssetById } from './../../api/asset';
// import Rsa from "../../utils/rsa"
import './index.less';

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {

  const width = customParams?.width;
  const height = customParams?.height;
  const checkAssetsId = customParams?.checkAssetsId || '4d0c2c48-7c54-b20f-b406-977745e50847'; 
  const checkKey = customParams?.checkKey || 'product_id'; 
  const infoUrl = customParams?.infoUrl || '';
  const dataIdKey = customParams?.dataId || 'dataId';
  const [dialogVisible, setDialogVisible] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [phonePowers, setPhonePowers] = useState('');

  useEffect(() => {
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
      setPhonePowers("Android")
    }
    if (isIOS) {
      console.log('苹果手机')
      window.webkit.messageHandlers.FEParksJSInterface.startNFCListening();
      setDialogVisible(true)
      setPhonePowers("ios")
    }
  }, [])

  const putNFCResult = async (pointName) => {
    // Rsa.decrypt(pointName) // 解密
    console.log('NFCRes', pointName);
    let params = [
      {
        column: checkKey,
        datatype: 0,
        type: 10,
        compareObj: pointName
      }
    ]
    let { data } = await queryAssetById(checkAssetsId, params)
    if (data[2] > 0) {
      let urlA = infoUrl.indexOf('?')
      if (urlA != "-1") {
        // alert(`${window.location.origin}${infoUrl}&${dataIdKey}=${dataId}&pointName=${pointName}`)
        window.location.href = `${window.location.origin}${infoUrl}&${dataIdKey}=${dataId}`;
      } else {
        // alert(`${window.location.origin}${infoUrl}?${dataIdKey}=${dataId}&pointName=${pointName}`)
        window.location.href = `${window.location.origin}${infoUrl}?${dataIdKey}=${dataId}`;
      }
    }else {
      setTipVisible(true)
    }
    console.log(data);
    diaLogClose()
  }
  const openCode = () => {
    switch (phonePowers) {
      case 'Android':
        window.FEParksJSInterface.startNFCListening()
        setDialogVisible(true)
        break;
      case 'ios':
        window.webkit.messageHandlers.FEParksJSInterface.startNFCListening();
        setDialogVisible(true)
        break;
    }
  }
  const diaLogClose = () => {
    console.log('phonePowers', phonePowers);
    switch (phonePowers) {
      case 'Android':
        window.FEParksJSInterface.stopNFCListening()
        setDialogVisible(false)
        setTipVisible(false)
        break;
      case 'ios':
        window.webkit.messageHandlers.FEParksJSInterface.stopNFCListening();
        setDialogVisible(false)
        setTipVisible(false)
        break;
    }
  }

  return (
    <> 
      <div className="iotNFC">
        {/* 加载 */}
        { 
          dialogVisible ? 
            <div className="zhezhao" onClick={() => { diaLogClose() }}>
            <div className="loading">
              <div className="dotBox">
                <div className="greenDot"></div>
                <div className="yellowDot"></div>
                <div className="blueDot"></div>
              </div>
            </div>
          </div >
          : ''
        }
        {/* 提示 */}
        {
          tipVisible ?
            <div className="zhezhao" onClick={() => { diaLogClose() }}>
              <div className="dialogBox">
                <div className="dialogBody">
                  <div className="nfcTip">查无此设备信息，请确认该设备是否属于巡检设备或联系管理员</div>
                </div>
                <div className="lineHr"></div>
                <div className="dialogFoot">
                  <div className="footBtn" onCclick={() => { diaLogClose() }}>知道了</div>
                </div >
              </div >
            </div >
            : ''
        }
      </div >
    </>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
