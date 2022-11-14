import React, { useEffect } from "react";
import { queryCurrentUser, ssoLoginNew, isSso, tokenIsValid, setCookie } from "./api/asset";

import Cookies from "js-cookie";

const App = (props) => {
  const { loginStatus = () => {}, updateProcess } = props;

  useEffect(() => {
    updateProcess && updateProcess();
    newSsoFuc();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const newSsoFuc = async () => {
    try {
      const { sso_new_flag } = window.configuration || {};
      const { data } = await queryCurrentUser();

      if (!data && sso_new_flag?.current_value === "1") {
        const ssoType = getQueryString("ssoType");
        const { data: ssoResult } = await isSso(ssoType);
        // 获取sso配置，存在配置则走sso跳转逻辑，否则走正常跳转逻辑
        if (ssoResult) {
          const { tokenName, ssoType: _ssoType } = ssoResult;
          if (_ssoType === "application") {
            let token = "";
            // 判断从url或cookies中取token
            if (ssoResult?.tokenFlag === 1) {
              token = getQueryString(tokenName);
            } else if (ssoResult?.tokenFlag === 2) {
              token = getQueryStringCookies(tokenName);
            }
            // 如果没有token直接跳转配置的地址
            if (!token) {
              failLogin(ssoResult);
              return;
            }
            // 校验token是否有效
            tokenIsValid(token)
              .then((res) => {
                setCookie(token);
                window.SSO_IS_LOGIN = true;
                loginStatus({
                  flag: true,
                  ssoResult,
                });
              })
              .catch((err) => {
                failLogin(ssoResult);
              });
          } else {
            failLogin(ssoResult);
          }
        } else {
          failLogin();
        }
      }
    } catch (error) {
      console.log(error);
      failLogin();
    }
  };

  const failLogin = async (ssoResult) => {
    console.log("SSO登录失败!");
    if (ssoResult) {
      loginStatus({
        flag: false,
        ssoResult,
      });
    } else {
      let configuration = sessionStorage.getItem("sessionValue");
      configuration = JSON.parse(configuration);

      const { sso_fail_url = {} } = configuration;
      const { current_value } = sso_fail_url;

      if (current_value) {
        window.location.href = current_value;
      }
    }
  };

  return <></>;
};
export default App;

const getQueryString = (name) => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
};

const getQueryStringCookies = (name) => {
  return Cookies.get(name);
};
