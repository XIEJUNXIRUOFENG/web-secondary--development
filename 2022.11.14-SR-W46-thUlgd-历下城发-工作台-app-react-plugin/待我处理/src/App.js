import React, { useEffect, useState } from "react";
import { Layout, Form, Button, Row, Col, Select, Input, DatePicker, TreeSelect, Table, Tooltip, Pagination, ConfigProvider, Dropdown, Menu, message } from "antd";
import Setting from "./setting";
import "./app.less";

import { queryAllType, querySystemOffice, queryPendingHandleTasks, queryMoneyData, queryUserList, handleAndModify, unHandleAndModify } from "./api/asset";

// 引入antd国际化
import zh_CN from "antd/es/locale/zh_CN";
import moment from "moment";

const { Content } = Layout;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

// 页面配置
const PendingHandle = (props) => {
   const { moduleHeight, dwclFolw } = props?.customConfig || {};

   // 默认地址
   const apiContextPath = window.location.origin;
   // 表单数据
   const [form] = Form.useForm();
   // 事件类型数据
   const [flowConstantIdList, setFlowConstantIdList] = useState([]);
   // 创建人数据
   const [treeData, setTreeData] = useState([]);

   // 表格数据
   const [tableData, setTableData] = useState([]);
   // 表格查询表单
   const [tableForm, setTableForm] = useState({
      orderBy: "flow_inst_last_modify_time",
      orderSort: "DESC",
      pageNum: 1,
      pageSize: 10,
      queryParams: [
         {
            colName: "activiti_type",
            type: 2,
            value: "flow",
         },
      ],
   });

   // 分页
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [pageTotal, setPageTotal] = useState(0);

   // 初始化页面
   useEffect(() => {
      // 事件类型
      queryAllType().then((res) => {
         let selectList = [];
         let resData = res.data;
         for (let i in resData) {
            selectList.push({
               name: i,
               list: resData[i],
            });
         }
         setFlowConstantIdList(selectList);
      });
      // 获取创建人数据
      getSystemOfficeData();
      // 获取表格数据
      getTabelData();
   }, []);

   // 表格列数据
   const columns = [
      {
         title: "事件类型",
         dataIndex: "flow_definition_name",
         key: "flow_definition_name",
         width: 200,
         ellipsis: true,
         render: (_, record) => (
            <>
               <Tooltip placement="topLeft" title={record.flow_definition_name}>
                  {record.flow_definition_name}
               </Tooltip>
            </>
         ),
      },
      {
         title: "金额（元）",
         dataIndex: "money",
         key: "money",
         width: 150,
         ellipsis: true,
      },
      {
         title: "摘要",
         dataIndex: "digest",
         key: "digest",
         width: 300,
         ellipsis: true,
         render: (_, record) => (
            <>
               <Tooltip placement="topLeft" title={record.digest}>
                  {record.digest}
               </Tooltip>
            </>
         ),
      },
      {
         title: "节点名称",
         dataIndex: "flow_component_name",
         key: "flow_component_name",
         width: 200,
         ellipsis: true,
         render: (_, record) => <div>{record.flow_component_name}</div>,
      },
      {
         title: "发起时间",
         dataIndex: "create_time",
         key: "create_time",
         width: 150,
         ellipsis: true,
         render: (_, record) => <div>{moment(record.create_time).format("yyyy年MM月DD日")}</div>,
      },
      {
         title: "任务创建时间",
         dataIndex: "flow_inst_create_time",
         key: "flow_inst_create_time",
         width: 150,
         ellipsis: true,
         render: (_, record) => <div>{moment(record.flow_inst_create_time).format("yyyy年MM月DD日")}</div>,
      },
      {
         title: "创建人",
         dataIndex: "flow_inst_create_member_name",
         key: "flow_inst_create_member_name",
         width: 150,
         ellipsis: true,
      },
      {
         title: "经办人",
         dataIndex: "handleUserNameSexual",
         key: "handleUserNameSexual",
         width: 150,
         ellipsis: true,
         render: (_, record) => (
            <>
               <Tooltip placement="topLeft" title={record.handleUserNameSexual}>
                  {record.handleUserNameSexual}
               </Tooltip>
            </>
         ),
      },
      {
         title: "流程状态",
         dataIndex: "flow_inst_process_status",
         key: "flow_inst_process_status",
         width: 200,
         ellipsis: true,
         render: (_, record) => <div>{getFlowStatus(record.flow_inst_process_status)}</div>,
      },
      {
         title: "业务状态",
         dataIndex: "flow_inst_business_status",
         key: "flow_inst_business_status",
         width: 200,
         ellipsis: true,
         render: (_, record) => (
            <>
               <Tooltip placement="topLeft" title={record.flow_inst_business_status}>
                  {props.intlGetKey(record.flow_inst_business_status)}
               </Tooltip>
            </>
         ),
      },
      {
         title: "操作",
         key: "action",
         fixed: "right",
         align: "center",
         width: 200,
         ellipsis: true,
         render: (_, record) => (
            <div className="table_link_button">
               <Button
                  type="link"
                  onClick={() => {
                     window.open(`${apiContextPath}/event/detailsv2?objectid=${record.id}&type=deal-approval`);
                  }}
               >
                  处理
               </Button>
               {((record.act_buttons || []).filter((item) => item.type !== "save" && item.list_show_flag && item.list_show_flag !== 0) || []).length > 0 && (
                  <Dropdown overlay={handleMenuItem(record)} placement="bottom">
                     <Button type="link" onClick={(e) => e.preventDefault()}>
                        更多
                     </Button>
                  </Dropdown>
               )}
            </div>
         ),
      },
   ];

   // 获取表格数据
   const getTabelData = (queryForm) => {
      let dataForm = queryForm || tableForm;
      // 表格数据
      queryPendingHandleTasks(dataForm).then(async (res) => {
         let resData = res.data.results;
         setPageTotal(res.data.totalCount);

         for (let i in resData) {
            let arr = [];
            resData[i].money = await getTableMoneyData(resData[i]);
            resData[i].handleUserNameSexual.forEach((e) => {
               arr.push(e.name);
            });
            arr = arr.join(",");
            resData[i].handleUserNameSexual = arr;
         }

         setTableData(resData);
      });
   };

   // 获取创建人数据
   const getSystemOfficeData = () => {
      queryUserList().then((res1) => {
         let data = res1.data;
         querySystemOffice("").then((res2) => {
            let result = res2.data;
            transform(result.children, data);
            setTreeData(result.children);
         });
      });
   };

   // 转换树形数据
   const transform = (data, userListData) => {
      data.forEach((item) => {
         if ("loginName" in item) {
            item.title = item.name || item.loginName;
            item.value = item.id;
            item.key = item.id;
         } else {
            item.key = item.id;
            item.title = item.name;
            item.value = item.id;
            item.disabled = true;
         }
         (userListData[0] || []).map((res) => {
            if (item.key === res.officeId) {
               if (item.children !== undefined) {
                  res.name = res.userName ? `${res.name} (${res.userName})` : res.name;
                  item.children.push(res);
               }
            }
         });
         if (item.children) {
            transform(item.children, userListData);
         }
      });
   };

   // 获取金额
   const getTableMoneyData = async (row) => {
      let _dwclFolw = [];

      if (dwclFolw) {
         _dwclFolw = JSON.parse(dwclFolw);
      }

      let dataForm = {
         flowInstIds: [row.flow_inst_id],
         flowFormColumns: _dwclFolw,
      };

      let { data } = await queryMoneyData(dataForm);

      return NumFormat(data[0]?.column_data);
   };

   // 流程状态映射
   const getFlowStatus = (value) => {
      let type = "";

      switch (value) {
         case "processing":
            type = "处理中";
            break;
         case "suspend":
            type = "挂起";
            break;
         case "termination":
            type = "已终止";
            break;
         case "end":
            type = "结束";
            break;
         case "pendingApply":
            type = "待发起";
            break;
         case "revoked":
            type = "已撤销";
            break;
         case "beatBack":
            type = "打回";
            break;
         case "directFinish":
            type = "直接完成";
            break;
      }

      return type;
   };

   // 三位分节法
   const NumFormat = (value) => {
      if (!value) return "";
      let intPart = Number(String(value).split(".")[0]);
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      let floatPart = ".00";
      let value2Array = value.toString().split(".");
      if (value2Array.length === 2) {
         floatPart = value2Array[1].toString();
         if (floatPart.length === 1) {
            return intPartFormat + "." + floatPart + "0";
         } else {
            return intPartFormat + "." + floatPart;
         }
      } else {
         return intPartFormat + floatPart;
      }
   };

   // 切换分页
   const onChangePage = (page, pageSize) => {
      let _queryForm = JSON.parse(JSON.stringify(tableForm));
      _queryForm.pageNum = page;
      _queryForm.pageSize = pageSize;

      setPage(page);
      setPageSize(pageSize);
      setTableForm(_queryForm);
      getTabelData(_queryForm);
   };

   // 重置表单
   const resetForm = () => {
      form.resetFields();

      let _queryForm = JSON.parse(JSON.stringify(tableForm));

      _queryForm.queryParams = [
         {
            colName: "activiti_type",
            type: 2,
            value: "flow",
         },
      ];

      setTableForm(_queryForm);
   };

   // 查询表单
   const queryData = () => {
      let _tableForm = JSON.parse(JSON.stringify(tableForm));
      _tableForm.queryParams = [
         {
            colName: "activiti_type",
            type: 2,
            value: "flow",
         },
      ];
      let formData = form.getFieldsValue();

      for (let i in formData) {
         if (formData[i]) {
            if (i == "create_time" && formData[i].length) {
               _tableForm.queryParams.push({
                  colName: "create_time",
                  min: Date.parse(formData[i][0]),
                  max: Date.parse(formData[i][1]),
                  type: 119,
               });
            } else if (i == "flow_constant_id" && formData[i].length) {
               _tableForm.queryParams.push({
                  colName: "flow_constant_id",
                  value: formData[i].join(","),
                  type: 1,
               });
            } else if (i == "flow_inst_name" && formData[i]) {
               _tableForm.queryParams.push({
                  colName: "flow_inst_name",
                  value: formData[i],
                  type: 0,
               });
            } else if (i == "flow_inst_process_status" && formData[i].length) {
               _tableForm.queryParams.push({
                  colName: "flow_inst_process_status",
                  value: formData[i].join(","),
                  type: 1,
               });
            } else if (i == "flow_inst_create_member" && formData[i].length) {
               _tableForm.queryParams.push({
                  colName: "flow_inst_create_member",
                  value: formData[i].join(","),
                  type: 1,
               });
            }
         }
      }

      setTableForm(_tableForm);
      getTabelData(_tableForm);
   };

   // 生成下拉菜单
   const handleMenuItem = (row) => {
      let items = [];

      let btnArr = ["save", "tmpSave"];
      let applyBtns = (row.act_buttons || []).filter((item) => !btnArr.includes(item.type) && item.list_show_flag !== 0) || [];

      applyBtns.map((data, i) => {
         items.push({
            key: i,
            label: (
               <Button
                  type="link"
                  onClick={() => {
                     dropdownButton(row, data, data.name);
                  }}
               >
                  {data.name}
               </Button>
            ),
         });
      });

      return <Menu items={items}></Menu>;
   };

   // 触发下拉菜单按钮
   const dropdownButton = (row, data, name) => {
      let dataForm = {
         task_id: row.id,
         component_item_id: data.id,
         surface_type: data.flowComponentItemConfig.surface_type,
         surface_object_id: data.flowComponentItemConfig.surface_object_id || "1000000001",
         detail: data.flowComponentItemConfig.surface_type === "internal" ? data : undefined,
         formData: data.flowComponentItemConfig.surface_type === "formView" ? data : undefined,
         applyFormData: {
            pkValue: row.content_id,
            formId: row.form_id,
            masterTableData: {
               componentId: row.key_component_id,
               id: row.key_component_id,
               value: row.content_id,
            },
         },
      };

      if (name === "同意") {
         handleAndModify(dataForm)
            .then((res) => {
               getTabelData();
            })
            .catch((err) => {
               message.error(err.data.message);
            });
      } else if (name === "拒绝") {
         unHandleAndModify(dataForm)
            .then((res) => {
               getTabelData();
            })
            .catch((err) => {
               message.error(err.data.message);
            });
      }
   };

   return (
      <Layout className="table_content" style={{ height: moduleHeight ? moduleHeight : "100%" }}>
         {/* 头部区域 */}
         <div className="content_header">
            <div className="content_search">
               <Form labelCol={{ style: { width: 100 } }} form={form}>
                  <Row gutter={20}>
                     <Col span={8}>
                        <Form.Item label="事件类型：" name="flow_constant_id">
                           <Select showSearch mode="multiple" maxTagCount={1} popupClassName="table_select" placeholder="请选择 事件类型">
                              {flowConstantIdList.map((item) => {
                                 return (
                                    <OptGroup label={item.name} key={item.name}>
                                       {item.list.map((e) => {
                                          return (
                                             <Option value={e.flow_constant_id} key={e.id}>
                                                {e.name}
                                             </Option>
                                          );
                                       })}
                                    </OptGroup>
                                 );
                              })}
                           </Select>
                        </Form.Item>
                     </Col>
                     <Col span={8}>
                        <Form.Item label="节点名称：" name="flow_inst_name">
                           <Input placeholder="请输入 节点名称" />
                        </Form.Item>
                     </Col>
                     <Col span={8}>
                        <Form.Item label="流程状态：" name="flow_inst_process_status">
                           <Select
                              showSearch
                              mode="multiple"
                              maxTagCount={1}
                              placeholder="请选择 流程状态"
                              options={[
                                 { value: "processing", label: "处理中" },
                                 { value: "suspend", label: "挂起" },
                                 { value: "termination", label: "已终止" },
                                 { value: "end", label: "结束" },
                                 { value: "pendingApply", label: "待发起" },
                                 { value: "revoked", label: "已撤销" },
                                 { value: "beatBack", label: "打回" },
                                 { value: "directFinish", label: "直接完成" },
                              ]}
                           />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item label="创建人：" name="flow_inst_create_member">
                           <TreeSelect treeData={treeData} treeCheckable={true} placeholder="请选择用户" maxTagCount={1} fieldNames={{ label: "name", value: "id", children: "children" }} />
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <ConfigProvider locale={zh_CN}>
                           <Form.Item label="任务创建时间：" name="create_time">
                              <RangePicker showTime />
                           </Form.Item>
                        </ConfigProvider>
                     </Col>
                  </Row>
               </Form>
            </div>
            <div className="content_button">
               <Button type="primary" onClick={queryData}>
                  查询
               </Button>
               <Button type="primary" onClick={resetForm}>
                  重置
               </Button>
            </div>
         </div>
         {/* 内容区域 */}
         <Content className="content_inner">
            <Table
               columns={columns}
               dataSource={tableData}
               bordered
               scroll={{ x: 1600 }}
               rowClassName={(record, index) => {
                  return index % 2 !== 0 ? "table_black" : "";
               }}
               pagination={false}
            />
            <ConfigProvider locale={zh_CN}>
               <Pagination
                  className="table_pagination"
                  showTotal={(total) => `共${total}条`}
                  current={page}
                  total={pageTotal}
                  pageSize={pageSize}
                  onChange={onChangePage}
                  showSizeChanger
                  showQuickJumper
               />
            </ConfigProvider>
         </Content>
      </Layout>
   );
};

// 配置逻辑控制
const App = (props) => {
   const { componentId } = props?.customConfig || {};

   useEffect(() => {
      // 注册事件
      const events = [];
      // 注册动作
      const actions = [];
      // 注册事件中心
      componentId &&
         window.componentCenter?.register(
            componentId,
            "comp",
            {
               Event_Center_getName: () => {
                  return "工作台-待我处理";
               },
            },
            {
               events,
               actions,
            }
         );
   }, []);

   if (props.isConfig) {
      return <Setting {...props} />;
   }

   return <PendingHandle {...props} />;
};

export default App;
