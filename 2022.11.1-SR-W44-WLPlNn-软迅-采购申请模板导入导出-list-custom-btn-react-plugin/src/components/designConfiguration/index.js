import React, { useEffect, useState } from "react";

import { UploadOutlined } from "@ant-design/icons";
import { Form, Button, message, Upload } from "antd";

import Cookies from "js-cookie";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();

  const [upFileList, setUpFileList] = useState([]);

  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
      setUpFileList(JSON.parse(configuration).uploadFile.fileList);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  // 触发修改配置项方法
  const onFormLayoutChange = (changedValues, allValues) => {
    if (upFileList) {
      if (!upFileList.length) {
        allValues.uploadFile = [];
      }
    }
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  // 上传配置
  const upLoadProps = {
    accept: ".xls,.xlsx",
    maxCount: 1,
    multiple: false,
    name: "file",
    action: "/sdata/rest/image/upload",
    headers: {
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },

    // 触发上传
    onChange(info) {
      const { status } = info.file;

      setUpFileList(info.fileList);

      if (status === "done") {
        message.success("上传成功");
      } else if (status === "error") {
        message.error("上传失败");
      }
    },

    // 移除
    onRemove() {
      setUpFileList([]);
    },
  };

  return (
    <>
      <Form {...formItemLayout} form={form} onValuesChange={onFormLayoutChange}>
        <Form.Item label="上传模板" name="uploadFile">
          <Upload {...upLoadProps} fileList={upFileList}>
            <Button icon={<UploadOutlined />}>上传导入模板</Button>
          </Upload>
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
