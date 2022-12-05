import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Input, message } from "antd";
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { Upload } from "src/components/uplot";
import { isEqual } from 'lodash';
import "./app.less";
const { Dragger } = Upload
const Setting = (props) => {
  const accept = "image/png, image/jpeg, image/jpg";
  const baseURL = `${process.env.REACT_APP_API}/sdata/rest`;
  const { onConfigChange } = props;

  const [customConfig, setCustomConfig] = useState(props.customConfig || {});

  const changeAssedId = (e) => {
    let config = { ...customConfig };
    if (e.target.value) {
      config.assetId = e.target.value;
      setCustomConfig(config);
      onConfigChange && onConfigChange(config);
    }
  };
  const handleSubmit = () => {
    let config = { ...customConfig };

    onConfigChange && onConfigChange(config);
  }
  //处理删除图片
  const handleDeleteIcon = (index) => {

  };
  //上传图片之前进行验证
  const beforeUpload = file => {
    let name = file.name;
    let suffix = name.substring(name.lastIndexOf('.') + 1);
    return new Promise((resolve, reject) => {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type) || suffix === 'jfif') {
        message.error('请选择png、jpg、jpeg图片');
        reject(file);
      } else {
        resolve(file);
      }
    });
  };
  //上传图片之后
  const onUploadFinished = ({ file }) => {
    const { status, response } = file;
    let config = { ...customConfig };
    if (status === 'done') {
      const { result } = response;
      // setImageArr(result);
      config.img = result

      setCustomConfig(config)

    } else if (status === 'error') {
      message.error('上传出错，请重试');
    }
  };

  return (<>

    <Row>
      <Col span={8} className="rowtitle">
        <div>图标</div>
        <div className="upload-picture">
          <Dragger
            accept={accept}
            action={`${baseURL}/image/uploadPic?category=4`}
            onChange={e => onUploadFinished(e)}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <div className="upload-wrapper">
              <div className="ant-upload-drag-icon">
                {customConfig.img ? (
                  <img src={customConfig.img} className="backgroundImg" />
                ) : (
                  <InboxOutlined />
                )}
              </div>

              {
                !customConfig.img && (
                  <div className="ant-upload-text">上传图标</div>
                )
              }
            </div>
          </Dragger>
        </div>
      </Col>
    </Row>
    <Row>
      <div className="detail-btn" onClick={handleSubmit}>
        执行
      </div>
    </Row>
  </>
  );
};

export default Setting;
