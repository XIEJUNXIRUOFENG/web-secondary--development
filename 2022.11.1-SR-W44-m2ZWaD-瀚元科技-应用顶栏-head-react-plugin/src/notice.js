/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-restricted-globals */
/*
 * @Author: sun
 */
import React, { Component } from "react";
import hashHistory from "./history";
import PropTypes from "prop-types";
import { Popover, Tooltip, Badge, message } from "antd";
import moment from "moment";
import qs from "querystringify";
import { queryApplyInfoList, externalConfirm, setRead } from "./api/asset";
import { BellOutlined } from "@ant-design/icons";
import "./notice.less";
const { origin } = window.location;
const routePrefix = "";
const apiContextPath = `${origin}${routePrefix}`;
class ApplicationNotice extends Component {
  static propTypes = {
    id: PropTypes.string,
    styleStore: PropTypes.object,
  };
  state = {
    noticeData: [],
    page: {
      pageSize: 5,
      pageNum: 1,
      orderBy: "create_time",
      orderSort: "DESC",
      queryParams: [{ colName: "info_status", type: 2, value: "1" }],
    },
  };

  componentDidMount() {
    this.loadDataSource();
  }

  setItemRead = async (item) => {
    try {
      await setRead(item.id);
    } catch (err) {
      console.log(err);
      message.error(err.data.message);
    }
  };
  /**
   * 转换悬浮框的标题：title
   *
   * @param {*} title
   * @memberof ApplicationNotice
   */
  getInfoTitle = (title) => {
    const res = title;
    return res;
  };

  goAnalyzer = (item) => {
    this.setItemRead(item);
    if (item.info_type === "4") {
      window.open(
        `${apiContextPath}/event/detailsv2?objectid=${item.object_id}&type=deal-approval`
      );
    } else {
      window.open(
        `${apiContextPath}/analyzer/${item.analysis_id}?&owner=1&module=数据分析仪`
      );
    }
  };

  loadDataSource = async () => {
    const { data } = await queryApplyInfoList(
      qs.parse(location.search).appid,
      this.state.page
    );
    this.setState({
      noticeData: data.results,
    });
  };
  externalConfirm = async (item, agree) => {
    await externalConfirm(item.object_id, agree);
    this.loadDataSource();
  };
  getDescContent = (item) => {
    let showName = "";
    try {
      showName = JSON.parse(item?.info_content).viewName;
    } catch (e) {
      console.log(e);
    }
    return `导出文件完成「${showName}」导出文件已完成。文件下载链接将于24小时后失效，请尽快下载
    )}`;
  };
  render() {
    const { noticeData } = this.state;
    return (
      <Popover
        trigger="hover"
        overlayClassName="menuClass"
        content={
          <div
            style={{
              width: "280px",
              padding: "0 20px",
              color: "black",
            }}
          >
            {noticeData.map((item, index) => {
              const title = this.getInfoTitle(item.info_title);
              return (
                <div
                  key={index}
                  className={"index-notify-hover"}
                  style={{
                    height: "84px",
                    borderBottom: "1px solid #ECECEC",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "20px 0 5px 0",
                    }}
                  >
                    <Tooltip
                      title={item.info_type === "4" ? item.info_content : title}
                    >
                      <span style={{ fontSize: "16px", fontWeight: "400" }}>
                        {item.info_type !== "1"
                          ? title.length > 6
                            ? title.substring(0, 6) + "..."
                            : title
                          : ""}
                      </span>
                    </Tooltip>
                    <span style={{ fontSize: "12px", color: "#999999" }}>
                      {moment(item.last_modify_time).format("YYYY-MM-DD")}
                    </span>
                  </div>
                  {item.info_type === "1" ? (
                    <div>
                      <Tooltip title={title}>
                        {title.length > 14
                          ? title.substring(0, 13) + "..."
                          : title}
                      </Tooltip>
                      ，<a onClick={() => this.goAnalyzer(item)}>点击前往</a>
                    </div>
                  ) : item.info_type === "2" ? (
                    <div>
                      <Tooltip title={item.info_content}>
                        {item.info_content.length > 14
                          ? item.info_content.substring(0, 13) + "..."
                          : item.info_content}
                      </Tooltip>
                      ，
                      <a
                        onClick={() => this.externalConfirm(item, true)}
                        style={{ marginRight: 8 }}
                      >
                        {/* {"同意"} */}
                      </a>
                      <a onClick={() => this.externalConfirm(item, false)}>
                        {/* 拒绝 */}
                      </a>
                    </div>
                  ) : item.info_type === "3" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Tooltip title={this.getDescContent(item)}>
                        <div
                          className={"text-ellipsis"}
                          style={{ width: "210px", display: "inline-block" }}
                        >
                          {this.getDescContent(item)}
                        </div>
                      </Tooltip>
                      {item.info_status === "1" && (
                        <a onClick={() => this.setItemRead(item)}>已读</a>
                      )}
                    </div>
                  ) : item.info_type === "4" ? (
                    <div>
                      <Tooltip title={item.info_content}>
                        {item.info_content.length > 14
                          ? item.info_content.substring(0, 13) + "..."
                          : item.info_content}
                      </Tooltip>
                      ，<a onClick={() => this.goAnalyzer(item)}>点击前往</a>
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div
              style={{
                textAlign: "center",
                height: "45px",
                lineHeight: "45px",
                cursor: "pointer",
              }}
              onClick={() => {
                hashHistory.push(
                  `/applicationview/content/notice?appid=${
                    qs.parse(location.search).appid
                  }&type=view&menuId=${qs.parse(location.search).menuId}${
                    qs.parse(location.search).pId
                      ? "&pId=" + qs.parse(location.search).pId
                      : ""
                  }`
                );
                window.location.reload();
              }}
            >
              查看全部通知
            </div>
          </div>
        }
      >
        <div className="header-notice">
          <Badge
            dot={noticeData.length > 0}
            style={{ top: "2px", right: "4px" }}
          >
            <BellOutlined style={{ margin: "0px 5px 0px 10px" }} />
          </Badge>
        </div>
      </Popover>
    );
  }
}

export default ApplicationNotice;
