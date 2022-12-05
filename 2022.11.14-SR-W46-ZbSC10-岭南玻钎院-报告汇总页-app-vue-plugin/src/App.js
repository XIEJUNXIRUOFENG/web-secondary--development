import React, { useEffect, useState, memo } from "react";
import { Row, Col, Table, Button, message, Select, Input, ConfigProvider, Spin, Pagination, DatePicker } from "antd";
import { SummaryResult, createExcel, queryAssetById } from './api/asset'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'//在原有的基础上加上下面三行代码
import 'moment/locale/zh-cn'

import Setting from "./setting";
import "./app.less";

const { RangePicker } = DatePicker;
moment.locale('zh-cn')
// 页面配置
const NavigateBar = (props) => {
  const { componentId, assetId } = props?.customConfig || {};

  useEffect(() => {
    console.log("资产ID", assetId);
  }, []);

  // 触发逻辑控制-动作
  const doEventCenterEvents = () => {
    window?.eventCenter?.triggerEvent(componentId, "sendData", {
      value: "测试数据",
    });
  };

  return (
    <>
      <Button type="primary" onClick={doEventCenterEvents}>
        逻辑控制-事件
      </Button>
    </>
  );
};



// 配置逻辑控制
const App = (props) => {
  // const { componentId, seriesValue = '', productionValue = '', textureValue = '' } = props?.customConfig || {};
  const { componentId, typeFiled = '', defaultSeries = '', nameFiled = '', parentFiled = '', dataFiled = '', assetId = '8573abab-d0a3-4f2b-afda-7686a5e68850' } = props?.customConfig || {};
  const [dataSource, setDataSource] = useState([])
  const [currentPage, setcurrentPage] = useState(1)
  const [dataSourceAll, setDataSourceAll] = useState([])
  const [columnData, setColumnData] = useState([])
  const [optionsList, setOptionsList] = useState({})
  const [optionsAll, setOptionsAll] = useState({})
  const [optionsValue, setOptionsValue] = useState({})
  const [exportValue, setExportValue] = useState({})
  const [statuSel, setStatuSel] = useState('')
  const [loading, setLoading] = useState(false)
  //宽度
  const colWidth = { 系列: 150, 产品名称: 200, 材质: 150, 规格型号: 150, 检测员: 80, 备注: 200, 时间: 200, 复核通过时间: 200, 订货单位: 100, 订单编号: 100 }
  const [title, setTitle] = useState('')
  useEffect(() => {
    // 注册事件
    const events = [
      {
        key: "sendData",
        name: "发送数据",
        payload: [
          {
            key: "value",
            name: "事件测试",
            dataType: "string",
          },
        ],
      },
    ];
    // 注册动作
    const actions = [
      {
        key: "messageSuccess",
        name: "接收消息",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];
    // 注册事件中心
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        {
          do_EventCenter_messageSuccess: ({ value }) => {
            console.log("逻辑控制-动作", value);
          },
          Event_Center_getName: () => {
            return "组件名称";
          },
        },
        {
          events,
          actions,
        }
      );
    let columnD = []
    setLoading(true)
    queryAssetById(assetId).then(res => {
      let optionsObj = { ...optionsList }
      optionsObj.seriesIdArr = []
      optionsObj.productionIdArr = []
      optionsObj.textureIdArr = []



      let data = translatePlatformDataToJsonArray(res)
      data.forEach(x => {

        switch (x[typeFiled]) {
          case '系列名称':

            optionsObj.seriesIdArr.push({ value: x[dataFiled], label: x[nameFiled] })
            break;
          case '产品名称':
            optionsObj.productionIdArr.push({ value: x[dataFiled], label: x[nameFiled], parentId: x[parentFiled] })
            break;
          case '材质':
            optionsObj.textureIdArr.push({ value: x[dataFiled], label: x[nameFiled], parentId: x[parentFiled] })
            break;

          default:
            break;
        }


      })

      setOptionsAll({ ...optionsObj })
      let optionsV = { ...optionsValue }
      optionsV.series_id = defaultSeries
      let productionIdArr = []


      optionsObj.productionIdArr.forEach(x => {
        if (defaultSeries == x.parentId) productionIdArr.push(x)
      })
      // optionsObj.textureIdArr.forEach(x => {
      //   if (defaultSeries == x[parentFiled]) textureIdArr.push(x)
      // })
      optionsObj.productionIdArr = productionIdArr


      setOptionsValue(optionsV)
      setExportValue(optionsV)
      setOptionsList(optionsObj)

    }).catch(err => {

    })

    SummaryResult({ series_id: defaultSeries }).then(res => {
      let col = res.data.columnName
      let data = res.data.data

      col.forEach((x, i) => {
        let defwidth = x.length > 6 ? 100 : 50
        columnD.push({
          title: x,
          dataIndex: x,
          align: "left",
          width: colWidth[x] || defwidth,
          render: (text, record, index) => {
            return (<div className='two_table_cell' title={text}>
              {text}
            </div>)
          }
        })
      })
      columnD.unshift({
        title: '序号', render: (text, record, index) => `${index + 1}`
        , align: "center", width: 70, fixed: 'left',
      })
      let titleN = res.data.seriesTitle && res.data.seriesTitle.replace('.xlsx', '')

      titleN = titleN && titleN.indexOf('null') != -1 ? '' : titleN
      titleN = titleN && titleN.lastIndexOf('(') != -1 ? titleN.substr(0, titleN.lastIndexOf('(')) : titleN
      setTitle(titleN)
      setLoading(false)
      setColumnData(columnD)

      setDataSource(pagingHandler(1, 10, data))
      setDataSourceAll(data)
    }).catch(err => {
      setColumnData([])
      setDataSource([])
      setLoading(false)
      setDataSourceAll([])
      message.warning('查询不到数据')
    })

  }, []);

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
  //导出接口
  const exportClickFN = () => {

    createExcel(exportValue).then(res => {

      //  FileReader主要用于将文件内容读入内存
      let files = res.data.file[0]

      let fielUrl = files.url
      let fielName = files.name

      // onload当读取操作成功完成时调用
      // reader.onload = function (e) {
      var a = document.createElement("a");
      //   // 获取文件名fileName
      //   var fileName = res.headers["content-disposition"].split("=");
      //   fileName = fileName[fileName.length - 1];
      //   fileName = decodeURI(fileName);
      a.download = fielName;
      a.href = fielUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // }
    }).catch(err => {

    })

  }

  //查询表
  const querySelectTable = (params) => {
    let columnD = []
    setLoading(true)
    SummaryResult(params).then(res => {
      let col = res.data.columnName
      let data = res.data.data
      setLoading(false)
      col.forEach((x, i) => {
        let defwidth = x.length > 6 ? 100 : 50
        columnD.push({
          title: x,
          dataIndex: x,
          align: "left",
          width: colWidth[x] || defwidth,
          render: (text, record, index) => {
            return (<div className='two_table_cell'>
              {text}
            </div>)
          }
        })
      })
      columnD.unshift({
        title: '序号', render: (text, record, index) => `${index + 1}`
        , align: "center", width: 70, fixed: 'left',
      })
      let titleN = res.data.seriesTitle.replace('.xlsx', '')
      titleN = titleN.indexOf('null') != -1 ? '' : titleN.substr(0, titleN.lastIndexOf('('))

      setTitle(titleN)
      setColumnData(columnD)
      setDataSource(pagingHandler(1, 10, data))
      setDataSourceAll(data)

    }).catch(err => {
      setLoading(false)
      setDataSource([])
      setDataSourceAll([])
      setColumnData([])
      setTitle('')

      message.warning('查询不到数据')



    })
  }

  //去重
  const removeDuplicateObj = (arr, key) => {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      if (!obj[next[key]]) (obj[next[key]] = true && newArr.push(next));
      // obj[next[key]] ? "" : (obj[next[key]] = true && newArr.push(next));
      return newArr;
    }, []);
    return arr


  }


  const changePage = (page, pageSize) => {
    // let pageconfig={...pagination}
    let columnD = [...columnData]
    columnD[0] = {
      title: '序号', render: (text, record, index) => `${(page - 1) * 20 + (index + 1)}`
      , align: "center", width: 70, fixed: 'left',
    }

    setColumnData(columnD)

    // console.log(page, pageSize, '==');
  }
  //选择框
  const changeSelectField = (e, key, keyArr) => {
    let config = { ...optionsValue };
    let config2 = { ...optionsAll };
    let listOp = { ...optionsList };
    config[key] = e

    if (keyArr && e) {
      listOp[keyArr] = []
      config2[keyArr].forEach(x => {
        if (e == x.parentId) listOp[keyArr].push(x)
      })
      if (key == 'series_id') {
        listOp.complete_time = []
      }
      setOptionsList(listOp)
    }

    if (key == 'series_id') {
      config.production_id = ''
      config.texture_id = ''
      config.order_no = ''
      config.maxCompleteTime = ''
      config.minCompleteTime = ''

    }
    if (key == 'production_id') {
      config.texture_id = ''
    }


    setOptionsValue(config);

  };
  //清除事件
  const clearSelectField = (key) => {
    let config2 = { ...optionsAll };
    let listOp = { ...optionsList };

    if (key == 'series') {
      listOp.productionIdArr = config2.productionIdArr
      listOp.textureIdArr = config2.textureIdArr
    }
    if (key == 'production') {
      listOp.textureIdArr = config2.textureIdArr
    }
    setOptionsList({ ...listOp })
  }
  //筛选方法
  const querySelectFn = () => {
    if (!optionsValue.series_id) {
      setStatuSel('error')
      message.warning('未选择系列主键');
      return
    }
    let tempObj = { ...optionsValue }
    setExportValue(tempObj)
    setStatuSel('')
    querySelectTable(optionsValue)
  }
  //页数改变
  const changePage2 = (e) => {
    // console.log(e);
    setcurrentPage(e)
    setDataSource(pagingHandler(e, 10, dataSourceAll))
  }
  //分页
  const pagingHandler = (pageNum, pageSize, data) => {

    return data.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize)

    // this.initEchartFn(this.tableData)
  }
  //选项框更改事件
  const changeInput = (e, type) => {

    let config = { ...optionsValue };
    let listOp = { ...optionsList };
    console.log(e);
    if (type == 'order_no') {
      config[type] = e.target.value
    } else {
      listOp[type] = e

      config.minCompleteTime = e ? e[0]._d.getTime() : ''
      config.maxCompleteTime = e ? e[1]._d.getTime() : ''
    }
    setOptionsValue(config)
    setOptionsList(listOp)
  }

  if (props.isConfig) {
    return <Setting {...props} />;
  }

  return (
    <div className='glassbraze_table '>
      <div className='glassbraze_table_export'>

        <Row gutter={[20, 4]} >
          <Col span={7}>

            <div className='two_row_item' >    系列名称： <Select
              value={optionsValue.series_id}
              status={statuSel}
              style={{
                width: '80%',
              }}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={
                optionsList.seriesIdArr
              }
              onClear={(e) => { clearSelectField('series') }}
              onChange={(e) => { changeSelectField(e, 'series_id', 'productionIdArr') }}
            /></div>


          </Col>
          <Col span={7}>
            <div className='two_row_item two_row_production ' >
              产品名称：
              <Select
                value={optionsValue.production_id}
                style={{
                  width: '80%',
                }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                allowClear
                options={
                  optionsList.productionIdArr
                }
                onChange={(e) => { changeSelectField(e, 'production_id', 'textureIdArr') }}
                onClear={(e) => { clearSelectField('production') }}
              />
            </div>

          </Col>
          <Col span={7}>
            <div className='two_row_item two_row_ping' >
              材质名称：
              <Select
                value={optionsValue.texture_id}
                style={{
                  width: '80%',
                }}
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={
                  optionsList.textureIdArr
                }
                onChange={(e) => { changeSelectField(e, 'texture_id') }}
                onClear={(e) => { clearSelectField('') }}
              />
            </div>

          </Col>

          <div className='two_row_button' >
            <Button onClick={querySelectFn} type='primary' className='two_button_s'  >筛选</Button>

          </div>


        </Row>
        <div className='two_row_item_two'>


          <Row gutter={[20, 4]} >
            <Col span={7}>
              <div className='two_row_item' >    订单编号：<Input allowClear style={{
                width: '80%',
              }} value={optionsValue.order_no} onChange={(e) => { changeInput(e, 'order_no') }}
              ></Input></div>


            </Col>
            <Col span={7}>
              <div className='two_row_item ' >
                复核通过时间：
                <ConfigProvider locale={zhCN}>


                  <RangePicker

                    style={{
                      width: '76%',
                    }}
                    value={optionsList.complete_time}
                    onChange={(e) => { changeInput(e, 'complete_time') }}
                  ></RangePicker>
                </ConfigProvider >
                {/* <Select
                value={optionsValue.production_id}
                style={{
                  width: '80%',
                }}

                allowClear
                options={
                  optionsList.productionIdArr
                }
                onChange={(e) => { changeSelectField(e, 'production_id', 'textureIdArr') }}
                onClear={(e) => { clearSelectField('production') }}
              /> */}
              </div>

            </Col>




          </Row>
        </div>





      </div>
      <Spin spinning={loading}>
        <div className='glassbraze_table_title' >{title}</div>
        <div className='glassbraze_table_button' >
          <Button onClick={exportClickFN} type='primary'  >导出</Button>
        </div>

        <Table
          className="infoCard"
          columns={columnData}
          dataSource={dataSource}
          bordered
          size="small"
          scroll={{
            x: 1300,
          }}
          pagination={false}
        >

        </Table>
        <div className='Pagination_two'>
          <Pagination
            total={dataSourceAll.length}
            showTotal={(total) => `共 ${total} 条 `}
            defaultPageSize={10}
            defaultCurrent={1}
            current={currentPage}
            onChange={(e) => { changePage2(e) }}
          /></div>
      </Spin>


    </div>
  )
};

export default App;
