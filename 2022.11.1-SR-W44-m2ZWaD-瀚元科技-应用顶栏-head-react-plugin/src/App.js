import React, { Component } from "react";
import { Button, Input, Layout, Menu, Anchor, message, Dropdown, Cascader } from "antd";
import Setting from "./setting";
// import classNames from "classnames";
import qs from "querystringify";
import { stringify } from "./qs";
// import ApplicationNotice from "./notice";
import history from "./history";
import utils from "./utils/index.js";
import {
  // PoweroffOutlined,
  BellOutlined,
  SettingOutlined,
  // LaptopOutlined,
  DownOutlined, MailOutlined, AppstoreOutlined
} from "@ant-design/icons";
import { logout, getMenuData, queryAssetById } from "./api/asset";
// import appService from "@njsdata/app-sdk";
import head from "./assets/headbg.png";
import user from "./assets/user.png";
import "./app.less";
const { Search } = Input;
// const { SubMenu } = Menu;
// const { Link } = Anchor;
const appid = qs.parse(window.location.search).appid;
const regionalAssets = []

const logoutSystem = () => {
  logout()
    .then((res) => {
      console.log("res", res);
      if (res.status === 200) {
        if (res.data) {
          console.log("res.data", res.data);
          let href = `/application/login/${appid}`;
          window.location.href = href;
        } else {
          console.log("Nores.data");
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const menu2 = (
  <Menu
    items={[
      // {
      //   key: "1",
      //   label: (
      //     <span
      //       onClick={() => {
      //         window.history.push(
      //           `/applicationview/personalcenter?appid=${
      //             qs.parse(window.location.search).appid
      //           }&type=view&menuId=${qs.parse(window.location.search).menuId}${
      //             qs.parse(window.location.search).pId
      //               ? "&pId=" + qs.parse(window.location.search).pId
      //               : ""
      //           }`
      //         );
      //         window.location.reload();
      //       }}
      //     >
      //       个人中心
      //     </span>
      //   ),
      // },
      {
        key: "2",
        label: <span onClick={logoutSystem}>退出登录</span>,
      },
    ]}
    forceSubMenuRender={true} className='tow_mentParent'
  />
);
// const menu3 = <ApplicationNotice styleStore={{}} />;
/*!TODO:1.菜单接口；2.站内信接口；3.主题改变方法 ；4.用户信息；*/
export default class App extends Component {
  async componentDidMount() {
    let { menuData = '[]', alarmAsset = '0cda0b85-ddf3-42eb-9180-3d08d947b628', regionAsset = '33b93646-868b-4ffc-a249-e766b5af9be8', time = 3 } = this.props;

    console.log(menuData, '====');
    // const { data } = await getMenuData(appId, menuId);
    // let buttons = data?.menuAndButton?.datappMenus;
    // let menuid = qs.parse(window.location.search)?.menuId;
    // console.log("menuId: ", menuid);

    const events = [
      {
        key: "valueChange",
        name: "值改变",
        payload: [
          {
            name: "值",
            key: "value",
            dataType: "string",
          },
        ],
      },
    ];
    const actions = [
      {
        key: "setValue",
        name: "设值",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
        hasReturn: false,
        // hasReturn为false则不用写returns选项
        returns: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      }
    ]
    this.props?.componentId &&
      window.componentCenter?.register(
        this.props?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
    menuData = JSON.parse(menuData)
    menuData.forEach((x, i) => {
      x.className = 'handerMenu2'
      x.key = 'menu' + i
      x.onTitleClick = this.onClick
    })
    this.setState({
      menuData
    })


    queryAssetById(regionAsset).then(res => {

      let data = utils.translatePlatformDataToJsonArray(res)
      let tree = this.GetTreeData(data)
      this.setState({
        treeData: tree
      })

    }).catch(err => {

    })

    queryAssetById(alarmAsset).then(res => {

      let data = utils.translatePlatformDataToJsonArray(res)

      let a = {}
      let b = []
      data.forEach(x => {
        let key = x.type
        if (a[key]) {
          a[key]++
        } else {
          a[key] = 1
        }
      })
      let temp = { 紧急: 0, 高: 0, 中: 0, 低: 0 }
      for (const key in temp) {
        for (const keya in a) {
          if (keya == key) {
            temp[key] = a[keya]

          }
        }

      }
      let i = 0
      for (let key in temp) {
        // b[i] = [Number(a[key].toFixed(2)), key]
        b[i] = { type: key, num: temp[key] }

        i++
      }

      this.setState({
        warningAlter: b
      })

    }).catch(err => {

    })

    let time1 = setInterval(() => {
      queryAssetById(alarmAsset).then(res => {

        let data = utils.translatePlatformDataToJsonArray(res)

        let a = {}
        let b = []
        data.forEach(x => {
          let key = x.type
          if (a[key]) {
            a[key]++
          } else {
            a[key] = 1
          }
        })
        let temp = { 紧急: 0, 高: 0, 中: 0, 低: 0 }
        for (const key in temp) {
          for (const keya in a) {
            if (keya == key) {
              temp[key] = a[keya]

            }
          }

        }
        let i = 0
        for (let key in temp) {
          // b[i] = [Number(a[key].toFixed(2)), key]
          b[i] = { type: key, num: temp[key] }

          i++
        }

        this.setState({
          warningAlter: b
        })

      }).catch(err => {

      })
    }, time * 1000)
    this.setState({ tiemObj: time1 })
    // let ulitem = document.querySelectorAll('ul.ant-menu-vertical')

    // ulitem.forEach(x => {

    //   x.className += ' tow_mentParent'
    //   x.style.border = '1px solid rgba(89, 175, 249, 0.7)'
    // })
    // console.log(ulitem, '====');
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }
  do_EventCenter_setValue = ({ value }) => {
    console.log(value, '====设值');
  }

  componentWillUnmount() {
    clearInterval(this.state.tiemObj)
    this.setState({
      tiemObj: null
    })
  }
  state = {
    selectButton: "",
    buttons: [],
    counting: 0,
    current: 'SubMenu', menuData: [], treeData: [], warningAlter: [], regionValue: '全国', tiemObj: null
  };
  GetTreeData = (data) => {
    let TreeData = [];
    let map = new Map(); //存在id,对应所在的内存地址
    let outputObj, parentid;
    for (let i = 0; i < data.length; i++) {
      parentid = data[i].parentid;

      if (map.has(parentid)) {
        //存在，将些信息，加入到对应id=pid的对象上的children
        if (!map.get(parentid).childrens)
          map.get(parentid).childrens = [];
        let obj = new Object(data[i]);
        map.get(parentid).childrens.push(obj);
        //通过pid在Map中查找，并将当前对象，加入到对应的childres属性
        map.set(data[i].id, obj);
        //重点(必须也加入Map)：将当前id及对应的对象，存入Map对象中
      } else if (!map.has(parentid) && (parentid == 0 || parentid == null)) {
        //这里处理pid不存在，且pid 为0的处理，pid不存在，且不为0的，程序不考虑这种情况
        outputObj = new Object(data[i]);
        //加入到要返回的数组中
        TreeData.push(outputObj);
        //将id添加到Map中
        map.set(data[i].id, outputObj);

      }
    }
    return TreeData;
  }
  // onMenuButtonClick = (e) => {
  //   this.setState({ selectButton: e });
  // };
  onSearch = (value) => {
    const { searchUrl = "" } = this.props;

    let a = searchUrl;
    let b = a + value;
    window.open(b);
  };
  onGongzuotaiClick = () => {
    const { workbenchUrl = "" } = this.props;

    window.open(workbenchUrl);
  };
  /*
   * url 目标url
   * arg 需要替换的参数名称
   * arg_val 替换后的参数的值
   * return url 参数替换后的url
   */

  onClickMenu = async ({ key, isSubMenu }) => {
    let menuAnchor = "";
    if (key?.split("#")[0]) {
      let menu = this.state.buttons.find((el) => el.id === key.split("#")[0]);
      menuAnchor = menu?.mapping_id;
    }

    if (key.split("#")[1] === "2" || key.split("#")[1] === "4") {
      if (!isSubMenu && key.split("#")[1] !== "4") {
        message.info("该菜单没有绑定页面！");
      }
      return false;
    }
    this.setState({ selectButton: key });

    this.goSearch(
      { ...qs.parse(window.location.search), menuId: key },
      menuAnchor
    );
  };
  goSearch(query, menuAnchor) {
    if (query.breadcrumb) {
      delete query.breadcrumb;
    }
    if (query.pId) {
      delete query.pId;
    }
    console.log("window.history: ", window.history);

    history.push({
      pathname: "/applicationview/content/view",
      search: stringify({
        ...query,
      }),
    });
    // {intl.get('APP.JTA')}
    if (menuAnchor) {
      setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        document.getElementById(menuAnchor)?.scrollIntoView(true);
      }, 3000);
    }
  }
  onChangeC = (_, arrsel) => {
    // console.log(_, arrsel);
    const { changeAppVariables } = this.props
    let leng = arrsel.length
    let regionValue = arrsel[leng - 1].name
    this.setState({ regionValue })
    changeAppVariables && changeAppVariables({
      name: _,
      index: arrsel
    })
    window.eventCenter?.triggerEvent(this.props?.componentId, "valueChange", {
      value: this.props?.componentId
    })
  };
  onMenuButtonClick = (item, index) => {
    // if (item.name === "SYSR.APP_MANAGEMENT") {
    //   this.onClickMenu({ key: "system#" + item.type, isSubMenu: false });
    // } else {
    //   this.onClickMenu({ key: item.id, isSubMenu: false });

    // }
    let params = []
    let url = item.url
    if (item?.params?.length > 0) {
      item.params.forEach(x => {
        let item = x.key + '=' + x.value
        params.push(item)
      })
      params = params.join('&')
      url = url + '?' + params
    }

    if (index > 0) {
      this.setState({ selectButton: item.name }, () => window.open(url));
    } else {
      this.setState({ selectButton: item.name }, window.location.reload());
    }
  };
  onClick = (e) => {
    let { history } = this.props;
    // let url = ""
    // history.push(url) 
    // console.log(e, '=====');
    this.setState({
      current: e.key
    })
  }
  itmeOnClick = ({ item, key, keyPath, domEven }) => {
    // console.log(item, key, keyPath, 'item=====');
    let pid = item.props.pid
    let address = item.props.url
    let { appId, history } = this.props;
    if (pid) {
      let url = `applicationview/content/view?appid=${appId}&pId=${pid}`
      history.push(url)
    } else {
      window.location.href = address
    }




    if (keyPath.length == 1) {
      this.setState({
        current: key
      })
    }

  }
  querySel = (e) => {

    if (this.state.counting) return
    let ulitem = document.querySelectorAll('ul.ant-menu-vertical')
    ulitem.forEach(x => {

      x.className += ' tow_mentParent'
      x.style.border = '1px solid rgba(89, 175, 249, 0.7)'
    })
    this.setState({ counting: 1 })
  }
  warningClick = (type) => {
    const { alarmUrl, alarmField, history } = this.props

    if (alarmUrl.indexOf('applicationview/content/view') != -1) {

      history.push(`${alarmUrl}${alarmField}=${type}`)
    } else {
      window.open(`${alarmUrl}${alarmField}=${type}`)
    }
  }
  Event_Center_getName = () => {
    return "应用头部二开测试";
  }

  render() {



    // const warningAlter = [1, 2, 3, 4]
    const {

      title,

      // 菜单高度

      //被选中菜单文字颜色

      // 搜索框地址
      // searchUrl = "",
      // 工作台地址
      // workbenchUrl = "",

    } = this.props || {};

    const { selectButton, current, menuData, treeData, warningAlter, regionValue } = this.state;
    // if (this.props.isConfig) {
    //   return <Setting {...this.props} />;
    // }
    return (
      <div
        className="herder"
        style={

          { backgroundSize: "cover", }
        }
      >
        <div
          className="mainTop"
          style={{ background: ` url(${head}) `, backgroundSize: "100%  100%" }}
        >
          <div className="leftInfo">

            <img
              alt="logo2"
              src={require("./assets/logo2.png").default}
              style={{ display: "block" }}
              className="logo"
            />
            <div className="title">{title ? title : "变电站(换流站)无人机运防一体系统"}</div>
          </div>

          <div className='metaButton' >

            <div
              className="secondLine"
              style={{ height: "64px" }}
            >
              <div className="allButtons">


                <Menu
                  className='handerMenu'

                  items={
                    menuData
                  }
                  mode='horizontal' forceSubMenuRender={true} selectedKeys={[current]} triggerSubMenuAction='hover' onClick={(e) => { this.itmeOnClick(e) }} onOpenChange={(e) => { this.querySel(e) }}
                >
                  <Menu.Item key="mail" icon={<MailOutlined />}>
                    Navigation One
                  </Menu.Item>

                </Menu>


              </div>


            </div>

          </div>

          <div className="lineRight">
            <Cascader options={treeData} popupClassName='tow_Cascader' fieldNames={{ children: 'childrens', value: 'id', label: 'name' }} className='dddd' onChange={this.onChangeC}>
              <a href="#">{regionValue}   <DownOutlined /></a>
            </Cascader>


            <div className='warningAlter' >
              {warningAlter.map((x, i) => {
                return (<div className={`warningItem Item${i}`} onClick={() => { this.warningClick(x.type) }}>{x.num}</div>)
              })

              }
            </div>




            {/* <Button
              icon={<LaptopOutlined />}
              className="gongzuotai"
              onClick={this.onGongzuotaiClick}
            >
              工作台
            </Button> */}
            <div className="user_info">

              <img src={user} style={{ marginRight: '5px' }} ></img>
              {/* 默认用户登录趋向于 */}
              <Dropdown overlay={menu2}>
                <span
                  className="zuzhi"
                  style={{
                    minWidth: 40,
                    marginRight: 15,
                    whiteSpace: "nowrap",
                    color: '#fff'
                  }}
                >
                  {window?.currentUser?.office_name || "默认"}
                  <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div>
        </div>


        {/* {菜单按钮} */}

      </div>
    );
  }
}
