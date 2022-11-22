import React, { useState, useCallback } from "react";
import { Input, Select, message, Row, Col } from "antd";
// import SdataIcon from "./SdataIcon";
import "./app.less";
import { logout, getMenuData, queryAssetById } from "./api/asset";
import utils from "./utils/index.js";
const { Option } = Select;
// const options = [
//   { key: "appPage", value: "appPage", label: "页面" },
//   { key: "data-form-design", value: "data-form-design", label: "表单" },
//   { key: "data-form-detail", value: "data-form-detail", label: "详情" },
//   { key: "data-form-list", value: "data-form-list", label: "列表" },
// ];
// let btnPos = 0;
const { currentUser = {} } = window

const Setting = (props) => {
  const { funcRef, onConfigChange } = props;


  const [customConfig, setCustomConfig] = useState(props.customConfig || {});
  const { optiFieldR = [], assetIdR = '', optionsR = [], optionsValueR = [], assetDataR = [], optiFieldValueR = [], optionlabelR = [] } = customConfig;
  const [assetId, setAssetId] = useState(assetIdR)
  const [options, setOptions] = useState(optionsR) //字段

  const [optionsValue, setOptionsValue] = useState(optionsValueR) //字段对应的值
  const [optiField, setOptiField] = useState(optiFieldR)//字段

  const [assetData, setAssetData] = useState(assetDataR)
  const [optiFieldValue, setOptiFieldValue] = useState(optiFieldValueR)//字段对应的值
  const [optionlabel, setOptionlabel] = useState(optionlabelR)


  //   const changeName = (e) => {
  //     let config = { ...customConfig };
  //     if (e.target.value) {
  //       config.subTitle = e.target.value;
  //       setCustomConfig(config);
  //       onConfigChange && onConfigChange(config);
  //     } else {
  //       message.warn("按钮名称不能为空");
  //     }
  //   };
  //去重
  const removeDuplicateObj = (arr, key) => {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      if (!obj[next[key]]) (obj[next[key]] = true && newArr.push(next))

      return newArr;
    }, []);
    return arr

  }


  const handleChange1 = (value) => {
    let result = value
    if (value.length > 2) {
      result.shift()
    }
    let optionsValue = assetData.map((x, i) => {
      return { label: x[result[0]], id: x[result[1]] }
    })
    optionsValue = removeDuplicateObj(optionsValue, 'label')
    optionsValue.forEach((x, i) => {
      x.value = i
    });
    let config = { ...customConfig };
    config.optionsValueR = optionsValue
    config.optiFieldR = result
    setCustomConfig(config)
    setOptionsValue(optionsValue)
    setOptiField(result)
  };
  const handleChangeValue = (value, option) => {


    let result = value
    // let result = option.map(x => x.id)

    let temp = option.map((x) => {
      return x.id
    })
    if (value.length > 4) {
      result.shift()
      temp.shift()
    }
    let config = { ...customConfig };
    let filer = []
    let status = true
    temp.forEach(x => {
      if (filer.indexOf(x) == -1) {
        filer.push(x)
      } else {
        status = false
      }
    })

    config.optiFieldValueR = temp
    config.optionlabelR = result
    setCustomConfig(config)
    setOptiFieldValue(temp)
    setOptionlabel(result)
  };

  const onChangeAssetid = (e) => {
    let value = e.target.value
    let config = { ...customConfig };
    config.assetIdR = value

    queryAssetById(value).then(res => {
      let temp = res.data[0].map((x, i) => {
        return { value: x.col_alias || x.col_name, label: x.col_alias || x.col_name }
      })
      let result = utils.translatePlatformDataToJsonArray(res)
      config.assetDataR = result
      config.optionsR = temp
      setCustomConfig(config)
      setAssetData(result)
      setOptions(temp)
    }).catch(err => {
      console.log(err);
    })

    setAssetId(value)

  }
  const handleSubmit = () => {

    let config = { ...customConfig };


    onConfigChange && onConfigChange(config);

  }
  return (
    <>


      <Row>
        <Col span={8} className="rowtitle">字典表资产id</Col>
        <Col span={16} ><Input style={{ width: "100%" }} value={assetId} onChange={(e) => onChangeAssetid(e)}></Input></Col>

      </Row>
      {options.length != 0 &&
        <Row>
          <Col span={8} className="rowtitle">选择字段</Col>
          <Col span={16} > <Select
            mode="multiple"
            style={{
              width: '100%',
            }}
            placeholder="选择字段"
            options={options}
            value={optiField}
            onChange={handleChange1}
            optionLabelProp="label"
            className="two_select"
          >
          </Select>
          </Col>

        </Row>
      }
      {optionsValue.length != 0 &&
        <Row>
          <Col span={8} className="rowtitle">选择字段对应的值</Col>
          <Col span={16} >    <Select
            mode="multiple"
            style={{
              width: '100%',
            }}
            placeholder="选择字段对应的值"
            options={optionsValue}
            value={optionlabel}
            onChange={handleChangeValue}
            optionLabelProp="label"
            className="two_select"
          >
          </Select>
          </Col>

        </Row>
      }

      <div className="detail-btn" onClick={handleSubmit}>
        执行
      </div>
    </>
  );
};

export default Setting;
