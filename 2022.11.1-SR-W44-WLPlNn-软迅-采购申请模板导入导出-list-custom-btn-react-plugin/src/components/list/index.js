import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Modal, Button } from "antd";

import { downloadExcel } from "../../api/asset";

import Cookies from "js-cookie";

const List = (props) => {
  const { Dragger } = Upload;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleCancel = () => {
    if (isUpload) {
      props.handleSearch();
    }
    setIsModalOpen(false);
  };

  // 下载模板方法
  const AsciiToString = (asccode) => {
    return String.fromCharCode(asccode);
  };
  // 下载模板方法
  const UrlDecode = (zipStr) => {
    var uzipStr = "";
    for (var i = 0; i < zipStr.length; i += 1) {
      var chr = zipStr.charAt(i);
      if (chr === "+") {
        uzipStr += " ";
      } else if (chr === "%") {
        var asc = zipStr.substring(i + 1, i + 3);
        if (parseInt("0x" + asc) > 0x7f) {
          uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
          i += 8;
        } else {
          uzipStr += AsciiToString(parseInt("0x" + asc));
          i += 2;
        }
      } else {
        uzipStr += chr;
      }
    }
    return uzipStr;
  };

  // 下载模板
  const downloadFile = () => {
    let fileUrl = props?.customParams?.uploadFile?.file?.response?.result[0];

    if (!fileUrl) {
      return message.warning("请先上传模板");
    }

    downloadExcel(fileUrl)
      .then((res) => {
        const temp = res.headers["content-disposition"].split("=")[1]; // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
        let iconv = require("iconv-lite");
        iconv.skipDecodeWarning = true; //忽略警告
        let fileName = iconv.decode(temp, "utf-8");
        const _res = res.data;
        let blob = new Blob([_res]);
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        let fileNameNew = UrlDecode(fileName);
        downloadElement.download = fileNameNew; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      })
      .catch((err) => {
        message.warning("下载失败");
      });
  };

  // 导入配置
  const loadProps = {
    accept: ".xlsx,.xls",
    action: `/sdata/rest/ruanXunImportData/materialsNameTemplate?purchaseId=${props?.dataId}`,
    name: "file",
    maxCount: 1,
    multiple: false,
    headers: {
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },

    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        message.success("导入成功");
        props.handleSearch();
        setIsUpload(true);
        setIsModalOpen(false);
      } else if (status === "error") {
        message.error(info.file.response.message);
      }
    },
  };

  return (
    <Modal title="导入文件" visible={isModalOpen} onCancel={handleCancel} onOk={handleCancel} keyboard={false} maskClosable={false} okText="确认" cancelText="关闭">
      {/* 下载 */}
      <Button
        style={{ marginBottom: "24px" }}
        type="primary"
        onClick={() => {
          downloadFile();
        }}
      >
        下载导入模板
      </Button>
      {/* 导入 */}
      <Dragger {...loadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行导入</p>
      </Dragger>
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
