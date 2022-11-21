import React, { useEffect, useState } from "react";
import { Layout, Input, message, Card, Row, Col } from "antd";
import "./module.less";

import { queryListGroupByType } from "../api/asset";

const { Header, Content } = Layout;
const { Search } = Input;

const InitiateFolw = (props) => {
   const apiContextPath = window.location.origin;

   const [folwList, setFolwList] = useState([]);

   const [folwShowList, setFolwShowList] = useState([]);

   // 获取列表数据
   useEffect(() => {
      let dataForm = {
         orderBy: "last_modify_time",
         orderSort: "DESC",
         queryParams: [
            {
               colName: "activiti_type",
               type: 2,
               value: "flow",
            },
         ],
      };

      queryListGroupByType(dataForm)
         .then((res) => {
            setFolwList(res.data);
         })
         .catch((err) => {
            message.warning(err.data.message);
         });
   }, []);

   // 生成DOM
   useEffect(() => {
      getContentDom();
   }, [folwList]);

   const getContentDom = (value) => {
      let folw = JSON.parse(JSON.stringify(folwList));
      let showFolw = [];

      // 判断是否搜索
      if (!value) {
         for (let i in folw) {
            showFolw.push({
               name: i,
               list: folw[i],
            });
         }
      } else {
         for (let i in folw) {
            let arr = [];
            folw[i].forEach((item) => {
               if (item.name.indexOf(value) != -1) {
                  arr.push(item);
               }
            });

            showFolw.push({
               name: i,
               list: arr,
            });
         }
      }

      setFolwShowList(showFolw);

      return showFolw;
   };

   return (
      <Layout className="InitiateFolw_content">
         {/* 头部区域 */}
         <Header className="content_header">
            <div className="header_text">发起流程</div>
            <Search placeholder="请输入" onSearch={getContentDom} allowClear />
         </Header>
         {/* 内容区域 */}
         <Content className="content_inner">
            {folwShowList.map((item, index) => {
               if (item.list && item.list.length) {
                  return (
                     <div className="inner_list" key={index}>
                        <div className="list_title">
                           {item.name}（{item.list.length}）
                        </div>
                        <Row>
                           {item.list.map((e, i) => {
                              return (
                                 <Col span={8} key={i}>
                                    <Card
                                       hoverable
                                       onClick={() => {
                                          window.open(`${apiContextPath}/data-form/flow-start/insert?flowid=${e.id}&nodeid=sid-startevent`);
                                       }}
                                    >
                                       <img src={`${apiContextPath}/storage_area/image${e.icon}`} alt="" />
                                       <div className="card_line"></div>
                                       <div className="card_name">{e.name}</div>
                                    </Card>
                                 </Col>
                              );
                           })}
                        </Row>
                     </div>
                  );
               }
            })}
         </Content>
      </Layout>
   );
};

export default InitiateFolw;
