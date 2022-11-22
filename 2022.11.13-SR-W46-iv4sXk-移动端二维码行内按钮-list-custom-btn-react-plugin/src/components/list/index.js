import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import vConsole from '../../utils/vconsole'
import { Button } from "antd";
import { queryAssetById } from './../../api/asset';
import { decrypt } from "../../utils/rsa"

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
  const dataIdKey = customParams?.dataId || 'dataId';
  const infoUrl = customParams?.infoUrl || 'https://blog.csdn.net/Mybabyying/article/details/107930743?dataId=123';
  const [phonePowers, setPhonePowers] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (window.IotJSInterface) {
      window.IotJSInterface.putQRScanResult = putQRScanResult;
    } else {
      window.IotJSInterface = {
        putQRScanResult: putQRScanResult
      }
    }
    // 判断当前系统是ios还是安卓
    let u = navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      console.log('安卓手机')
      window.FEParksJSInterface.startQRScanner()
      setPhonePowers("Android")
    }
    if (isIOS) {
      console.log('苹果手机')
      window.webkit.messageHandlers.FEParksJSInterface.startQRScanner();
      setPhonePowers("ios")
    }
    // openCode()
  }, [])

  const openCode = () => {
    switch (phonePowers) {
      case 'Android':
        window.FEParksJSInterface.startQRScanner()
        break;
      case 'ios':
        window.webkit.messageHandlers.FEParksJSInterface.startQRScanner();
        break;
    }
  }

  const diaLogClose = () => {
    setDialogVisible(false)
  }

  const putQRScanResult = async (pointName) => {
    let decryptPointName = decrypt(pointName) // 解密
    console.log('codeRes', decryptPointName);
    let params = [
      {
        column: checkKey,
        datatype: 0,
        type: 10,
        compareObj: decryptPointName
      }
    ]
    let { data } = await queryAssetById(checkAssetsId, params)
    console.log('data', data);
    if (data[2] > 0) {
      let urlA = infoUrl.indexOf('?')
      if (urlA != "-1") {
        // alert(`${window.location.origin}${infoUrl}&${dataIdKey}=${dataId}&pointName=${decryptPointName}`)
        window.location.href = `${window.location.origin}${infoUrl}&${dataIdKey}=${dataId}`;
      } else {
        // alert(`${window.location.origin}${infoUrl}?${dataIdKey}=${dataId}&pointName=${decryptPointName}`)
        window.location.href = `${window.location.origin}${infoUrl}?${dataIdKey}=${dataId}`;
      }
    }else {
      setDialogVisible(true)
    }
  }

  return (
    <>
      { 
        dialogVisible ? 
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
    </>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
