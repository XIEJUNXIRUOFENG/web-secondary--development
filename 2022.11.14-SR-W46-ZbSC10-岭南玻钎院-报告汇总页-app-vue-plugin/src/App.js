import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button, message, Select } from "antd";
import { SummaryResult, createExcel, queryAssetById } from './api/asset'
import Setting from "./setting";
import "./app.less";


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
  const [columnData, setColumnData] = useState([])
  const [optionsList, setOptionsList] = useState({})
  const [optionsAll, setOptionsAll] = useState({})
  const [optionsValue, setOptionsValue] = useState({})
  const [exportValue, setExportValue] = useState({})
  const [statuSel, setStatuSel] = useState('')
  //宽度
  const colWidth = { 系列: 200, 产品名称: 200, 材质: 150, 规格型号: 150, 检测员: 100, 备注: 200 }
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
      let textureIdArr = []

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
        columnD.push({
          title: x,
          dataIndex: x,
          align: "left",
          width: colWidth[x] || 100,
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
      let titleN = res.data.seriesTitle.replace('.xlsx', '')
      titleN = titleN.indexOf('null') != -1 ? '' : titleN
      setTitle(titleN)
      setColumnData(columnD)
      setDataSource(data)

    }).catch(err => {
      message.error('该系列暂无数据')
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
    SummaryResult(params).then(res => {
      let col = res.data.columnName
      let data = res.data.data

      col.forEach((x, i) => {
        columnD.push({
          title: x,
          dataIndex: x,
          align: "left",
          width: colWidth[x] || 100,
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
      titleN = titleN.indexOf('null') != -1 ? '' : titleN
      setTitle(titleN)
      setColumnData(columnD)
      setDataSource(data)

    }).catch(err => {
      message.error('该系列暂无数据')
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
      setOptionsList(listOp)
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
      message.error('未选择系列主键');
      return
    }
    let tempObj = { ...optionsValue }
    setExportValue(tempObj)
    setStatuSel('')
    querySelectTable(optionsValue)
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
              allowClear
              options={
                optionsList.seriesIdArr
              }
              onClear={(e) => { clearSelectField('series') }}
              onChange={(e) => { changeSelectField(e, 'series_id', 'productionIdArr') }}
            /></div>


          </Col>
          <Col span={7}>
            <div className='two_row_item ' >
              产品名称：
              <Select
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

                allowClear
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





      </div>
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
        pagination={{ options: [], pageSize: 20, onChange: changePage }}
      >

      </Table>

    </div>
  )
};

export default App;
