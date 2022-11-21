import React, { useState, useEffect } from "react";
import { Row, Col, Input, Select, message } from "antd";
import { queryAssetById } from './api/asset'
import "./app.less";

const Setting = (props) => {
  const { onConfigChange } = props;

  const [customConfig, setCustomConfig] = useState(props.customConfig || {});
  const [optionFiled, setOptionFiled] = useState([])
  const [valueFiled, setValueFiled] = useState([])
  const [statuSel, setStatuSel] = useState('')
  message.config({

    duration: 2,

  });
  useEffect(() => {
    let config = { ...customConfig };
    let optionFiledData = JSON.parse(JSON.stringify(optionFiled))
    if (config.assetId) {
      querySelectAsseid(config.assetId)
      // queryAssetById(config.assetId).then(res => {
      //   res.data[0].forEach((x) => {
      //     optionFiledData.push(
      //       {
      //         label: x.col_alias || x.col_name,
      //         value: x.col_name
      //       }
      //     )
      //   })
      //   setOptionFiled(optionFiledData)
      // })
      //   .catch(err => {

      //   })
    }

  }, [])

  // useEffect(()=>{

  // },[customConfig.])

  const saveFn = () => {
    let config = { ...customConfig };
    console.log(!config.seriesValue, config.seriesValue, '====');
    if (!config.seriesValue) {
      message.error('未选必选项');
      setStatuSel('error')
      return
    }
    setStatuSel('')

    setCustomConfig(config);
    onConfigChange && onConfigChange(config);

  };
  //资产id变化
  const changeAssedId = (e, key) => {
    let config = { ...customConfig };


    config[key] = e.target.value;
    setCustomConfig(config);

  };

  const changeSelectField = (e, key, keyArr) => {
    let config = { ...customConfig };
    let valueData = [...valueFiled]
    config[keyArr] = []
    valueData.forEach((x) => {
      config[keyArr].push({ value: x[e], label: x[e] })
    })
    config[key] = e
    setCustomConfig(config);

  };
  //处理资产数据
  const translatePlatformDataToJsonArray = (originTableData) => {
    let originTableHeader = originTableData.data[0];
    let tableHeader = [];
    originTableHeader.forEach((item) => {
      tableHeader.push(item.col_name);
    });
    let tableBody = originTableData.data[1];
    let tableData = [];
    tableBody.forEach((tableItem) => {
      let temp = {};
      tableItem.forEach((item, index) => {
        temp[tableHeader[index]] = item;
      });
      tableData.push(temp);
    });
    return tableData;
  }

  //
  const changeSelectValue = (e, key) => {
    let config = { ...customConfig };
    config[key] = e
    setCustomConfig(config);
  }


  //资产产选
  const querySelectAsseid = (e) => {
    let assetId = typeof e == 'object' ? e.target.value : e
    let optionFiledData = JSON.parse(JSON.stringify(optionFiled))
    let valueFiledData = JSON.parse(JSON.stringify(valueFiled))
    queryAssetById(assetId).then(res => {
      let data = translatePlatformDataToJsonArray(res);
      res.data[0].forEach((x) => {
        optionFiledData.push(
          {
            label: x.col_alias || x.col_name,
            value: x.col_name
          }
        )
      })
      setOptionFiled(optionFiledData)
      setValueFiled(data)
    })
      .catch(err => {

      })
  }

  return (
    <>
      <Row gutter={[16, 4]}>
        <Col span={6}>资产ID</Col>
        <Col span={18}>
          <Input onChange={(e) => { changeAssedId(e, 'assetId') }} onBlur={querySelectAsseid} value={customConfig.assetId} />
        </Col>

        <Col span={6}>系列主键字段名</Col>
        <Col span={18}>
          <Select
            value={customConfig.seriesId}
            style={{
              width: 120,
            }}
            allowClear
            options={
              optionFiled
            }
            onChange={(e) => { changeSelectField(e, 'seriesId', 'seriesIdArr') }}
          />
        </Col>
        <Col span={6}>产品名称主键字段名</Col>
        <Col span={18}>
          <Select
            value={customConfig.productionId}

            style={{
              width: 120,
            }}
            allowClear
            options={
              optionFiled
            }
            onChange={(e) => { changeSelectField(e, 'productionId', 'productionIdArr') }}
          />
        </Col>
        <Col span={6}>材质主键字段名</Col>
        <Col span={18}>
          <Select
            value={customConfig.textureId}

            style={{
              width: 120,
            }}
            allowClear
            options={
              optionFiled
            }
            onChange={(e) => { changeSelectField(e, 'textureId', 'textureIdArr') }}
          />
        </Col>
        <Col span={6}>系列主键值</Col>
        <Col span={18}>
          <Select
            value={customConfig.seriesValue}
            status={statuSel}
            style={{
              width: 120,
            }}
            onChange={(e) => { changeSelectValue(e, 'seriesValue',) }}
            allowClear
            options={
              customConfig.seriesIdArr
            }
          />
        </Col>
        <Col span={6}>产品名称值</Col>
        <Col span={18}>
          <Select
            value={customConfig.productionValue}
            style={{
              width: 120,
            }}
            onChange={(e) => { changeSelectValue(e, 'productionValue') }}
            allowClear
            options={
              customConfig.productionIdArr
            }
          />
        </Col>
        <Col span={6}>材质主键值</Col>
        <Col span={18}>
          <Select
            value={customConfig.textureValue}
            onChange={(e) => { changeSelectValue(e, 'textureValue') }}
            style={{
              width: 120,
            }}
            allowClear
            options={
              customConfig.textureIdArr
            }
          />
        </Col>
      </Row>
      <div className="detail-btn" onClick={saveFn}>
        执行
      </div>
    </>


  );
};

export default Setting;
