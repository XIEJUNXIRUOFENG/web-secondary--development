import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { message, notification } from "antd";

// 登录接口
import { loginAccount } from "./api/asset";

const openNotification = (title, message) => {
  notification.open({
    message: title,
    description: message,
    duration: null,
  });
};

const App = ({ type, ...props }) => {
  const submit = (params, { history }) => {
    // 执行注册/登录时会触发此方法，所有参数在 params 中
    // ...
    return new Promise((resolve, reject) => {
      try {
        // 判断当前系统是ios还是安卓
        let u = navigator.userAgent;
        let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        // 安卓手机
        if (isAndroid) {
          console.log("安卓手机");
          postUUIDMessage("getUUID", {}, {});
        }
        // 苹果手机
        if (isIOS) {
          console.log("苹果手机");
          postUUIDMessage("getUUID", {}, {});
        }

        // 回调方法
        window.onAppActionDidComplete = (dataForm) => {
          // 如果存在uuid
          if (dataForm) {
            let form = JSON.parse(dataForm);
            if (form.action === "getUUID") {
              if (form.data.uuid) {
                let loginForm = {
                  uuid: form.data.uuid,
                  loginName: params.loginName,
                  password: props.Encrypt(params.password),
                };

                // openNotification(
                //   "已存在UUID,进行登录",
                //   JSON.stringify(loginForm)
                // );

                loginAccount(loginForm)
                  .then((res) => {
                    // openNotification(
                    //   "设置新的UUID,进行登录",
                    //   JSON.stringify(res.data)
                    // );
                    const login = {
                      success: true,
                      token: res.data,
                    };
                    resolve(login);
                  })
                  .catch((err) => {
                    if (err.data.message == "授权设备错误") {
                      message.error("请在授权的设备上登录！");
                    } else {
                      message.warning(err.data.message);
                    }
                    // openNotification(
                    //   "请在授权的设备上登录",
                    //   JSON.stringify({
                    //     message: err.data.message,
                    //     code: err.data.code,
                    //   })
                    // );
                  });
              } else {
                // 不存在uuid
                let _uuid = getUUID();
                // 安卓手机
                if (isAndroid) {
                  postUUIDMessage("setUUID", {}, { uuid: _uuid });
                }
                // 苹果手机
                if (isIOS) {
                  postUUIDMessage("setUUID", {}, { uuid: _uuid });
                }
              }
            } else if (form.action === "setUUID") {
              if (form.data.uuid) {
                let loginForm = {
                  uuid: form.data.uuid,
                  loginName: params.loginName,
                  password: props.Encrypt(params.password),
                };

                // openNotification(
                //   "设置新的UUID,进行登录",
                //   JSON.stringify(loginForm)
                // );

                loginAccount(loginForm)
                  .then((res) => {
                    // openNotification(
                    //   "设置新的UUID,进行登录",
                    //   JSON.stringify(res.data)
                    // );
                    const login = {
                      success: true,
                      token: res.data,
                    };
                    resolve(login);
                  })
                  .catch((err) => {
                    if (err.data.message == "授权设备错误") {
                      message.error("请在授权的设备上登录！");
                    } else {
                      message.warning(err.data.message);
                    }
                    // openNotification(
                    //   "请在授权的设备上登录",
                    //   JSON.stringify({
                    //     message: err.data.message,
                    //     code: err.data.code,
                    //   })
                    // );
                  });
              } else {
                console.log("拒绝储存UUID,退出登录");
                postUUIDMessage("ExitApp", {}, {});
              }
            }
          } else {
            console.log("未识别到参数");
          }
        };
      } catch {
        console.log(params, "err");
        reject(params);
      }
    });
  };

  // 生成UUID
  const getUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
        16
      );
    });
  };

  // 发送获取UUID消息
  const postUUIDMessage = (action, form, data) => {
    console.log("发送Message消息");

    try {
      if (window.uni?.postMessage) {
        window.uni.postMessage(
          JSON.stringify({
            action: action,
            form: form,
            data: data,
          })
        );
        console.log("发送uni消息");
      }
      if (window.nativeModule?.postMessage) {
        window.nativeModule.postMessage(
          JSON.stringify({
            action: action,
            form: form,
            data: data,
          })
        );
        console.log("发送nativeModule消息");
      } else if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            action: action,
            form: form,
            data: data,
          })
        );
        console.log("发送ReactNativeWebView消息");
      } else if (window.postMessage) {
        window.postMessage(
          JSON.stringify({
            action: action,
            form: form,
            data: data,
          })
        );
        console.log("发送postMessage消息");
      }
    } catch {
      console.log("发送消息失败");
    }
  };

  useEffect(() => {
    props.bindSubmit(submit); // 绑定监听方法
    console.log("登录覆盖已绑定");
  }, []);

  let Comp = () => <></>;
  return <Comp {...props} />;
};

App.propTypes = {
  type: PropTypes.string,
  bindSubmit: PropTypes.func,
};

export default App;
