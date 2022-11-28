import React, { useState, useCallback } from "react";
import { ChromePicker } from "react-color";
import { isEqual } from "lodash";
import Utils from "../utils";
import { Button, Popover, Select, Upload, Switch } from "antd";
import { getAssets } from "../api/asset";
import "./design.css";
function Configuration(props) {
  const { changeConfiguration, configuration, dataSource } = props;
  console.log(props);
  let message = [];
  let options = [];
  let dataSourceApp = dataSource.dims.concat(dataSource.vals || []);
  dataSourceApp.forEach((item, index) => {
    options.push({
      value: item.col_name,
      label: item.col_name,
    });
  });
  dataSource.dims[0].data.forEach((item, index) => {
    let info = {};
    dataSourceApp.forEach((itemSon, indexSon) => {
      info[itemSon.col_name] = itemSon.data[index];
    });
    message.push(info);
  });
  console.log(message);
  console.log(configuration);
  const pluginOptions = JSON.parse(JSON.stringify(configuration || {}));
  const [bacColor, setBacColor] = useState(pluginOptions.bacColor ? pluginOptions.bacColor : "#333");
  const [areaColor, setAreaColor] = useState(pluginOptions.areaColor ? pluginOptions.areaColor : "#333");
  const [pointData, setPointData] = useState(pluginOptions.pointData ? pluginOptions.pointData : []);
  const [fileList, setFileList] = useState(pluginOptions.fileList ? pluginOptions.fileList : []);
  // const [assetId, setAssetId] = useState(pluginOptions.assetId ? pluginOptions.assetId : "");
  const [backSwitch, setBackSwitch] = useState(pluginOptions.backSwitch ? pluginOptions.backSwitch : false);
  const [mapSwitch, setMapSwitch] = useState(pluginOptions.mapSwitch ? pluginOptions.mapSwitch : false);
  const [assetData, setAssetData] = useState(message);
  const [longitudeData, setLongitudeData] = useState(pluginOptions.longitudeData ? pluginOptions.longitudeData : "");
  const [latitudeData, setLatitudeData] = useState(pluginOptions.latitudeData ? pluginOptions.latitudeData : "");
  const [longitudeOption, setLongitudeOption] = useState(pluginOptions.longitudeOption ? pluginOptions.longitudeOption : options);
  const [latitudeOption, setLatitudeOption] = useState(pluginOptions.latitudeOption ? pluginOptions.latitudeOption : options);
  const handleSubmit = useCallback(() => {
    const newOptions = {
      bacColor: bacColor,
      assetData: assetData,
      areaColor: areaColor,
      longitudeData: longitudeData,
      latitudeData: latitudeData,
      longitudeOption: longitudeOption,
      latitudeOption: latitudeOption,
      fileList: fileList,
      backSwitch: backSwitch,
      mapSwitch: mapSwitch,
      // assetId: assetId,
      pointData: pointData,
    };
    console.log(newOptions);
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });
  const handleChangeLong = (value) => {
    let message = [];
    assetData.forEach((item) => {
      message.push({
        value: [item[value], item[latitudeData]],
      });
    });
    setPointData(message);
    setLongitudeData(value);
  };
  const handleChangeLat = (value) => {
    let message = [];
    assetData.forEach((item) => {
      message.push({
        value: [item[longitudeData], item[value]],
      });
    });
    setPointData(message);
    setLatitudeData(value);
  };
  const propsUpload = {
    name: "file",
    action: `${process.env.REACT_APP_API}/sdata/rest/image/uploadPic?category=4`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      console.log(info);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
        setFileList(info.fileList);
      }
      if (info.file.status === "done") {
      }
    },
  };
  const colorContent = (
    <div>
      <ChromePicker
        color={bacColor}
        onChangeComplete={(color) => {
          setBacColor(color.hex);
        }}
      />
    </div>
  );
  const colorAreaContent = (
    <div>
      <ChromePicker
        color={areaColor}
        onChangeComplete={(color) => {
          setAreaColor(color.hex);
        }}
      />
    </div>
  );
  const BacOnChange = (checked) => {
    setBackSwitch(checked);
  };
  const mapOnChange = (checked) => {
    setMapSwitch(checked);
  };
  return (
    <>
      <span>地图设置</span>
      <br />
      <br />
      <div className="Item">
        <span className="ItemName">背景色</span>
        <Popover content={colorContent} trigger="click">
          <div className="chooseColor" style={{ background: bacColor }}></div>
        </Popover>
      </div>
      <br />
      <div className="Item">
        <span className="ItemName">背景色透明</span>
        <Switch checked={backSwitch} onChange={BacOnChange} />
      </div>
      <br />
      <div className="Item">
        <span className="ItemName">区域颜色</span>
        <Popover content={colorAreaContent} trigger="click">
          <div className="chooseColor" style={{ background: areaColor }}></div>
        </Popover>
      </div>
      <br />
      <div className="Item">
        <span className="ItemName">区域色透明</span>
        <Switch checked={mapSwitch} onChange={mapOnChange} />
      </div>
      <br />
      <br />
      <span>点位设置</span>
      <br />
      <br />
      <br />
      <div className="Item">
        <span className="ItemName">经度</span>
        <Select
          style={{
            width: 120,
          }}
          defaultValue={longitudeData}
          size="small"
          onChange={handleChangeLong}
          options={longitudeOption}
        />
      </div>
      <br />
      <div className="Item">
        <span className="ItemName">维度</span>
        <Select
          style={{
            width: 120,
          }}
          size="small"
          defaultValue={latitudeData}
          onChange={handleChangeLat}
          options={latitudeOption}
        />
      </div>
      <br />
      <div className="Item">
        <span className="ItemName">上传图片</span>
        <Upload {...propsUpload} maxCount={1}>
          <Button>上传图片</Button>
        </Upload>
      </div>
      <br />
      <br />
      <Button type="primary" onClick={handleSubmit}>
        执行
      </Button>
    </>
  );
}

Configuration.propTypes = {};

export default Configuration;
