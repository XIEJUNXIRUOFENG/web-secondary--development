<template>
  <div class="login_all" :class="bgClass">
    <div class="block">
      <div class="top-title">
        <span>{{ toTitleInfo.top }}</span>
        <br v-if="toTitleInfo.bottom">
        <span class="bottom-info">{{ toTitleInfo.bottom }}</span>
      </div>
      <!-- 登录表单 -->
      <div class="login_frame" v-if="activeType === 'login'">
        <el-form :rules="loginDataRule" ref="loginForm" :model="loginFormData">
          <!-- 登录账号 -->
          <el-form-item class="frame_input" prop="account">
            <el-input autopla v-model="loginFormData.account" placeholder="身份证号">
              <img :src="frameIcon.account" slot="prefix"/>
            </el-input>
          </el-form-item>
          <!-- 登录密码 -->
          <el-form-item class="frame_input" prop="password">
            <el-input
                v-model="loginFormData.password"
                placeholder="密码"
                :type="getPasswordType(loginPasswordShow)"
            >
              <img :src="frameIcon.password" slot="prefix"/>
              <img
                  v-if="!loginPasswordShow"
                  @click.stop="handeShowToggle('loginPasswordShow')"
                  :src="frameIcon.passwordOn" slot="suffix"
              />
              <img
                  v-if="loginPasswordShow"
                  @click.stop="handeShowToggle('loginPasswordShow')"
                  :src="frameIcon.passwordOff" slot="suffix"
              />
            </el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <div class="frame_button">
            <el-button :loading="submitLoading" type="primary" @click="handleLogin()">登 录</el-button>
          </div>
        </el-form>
      </div>
      <!-- 注册表单 -->
      <div class="login_frame" v-if="activeType === 'register' || activeType === 'reset'">
        <el-form :rules="regDataRule" ref="loginForm" :model="regFormData">
          <!-- 用户注册 -->
          <div class="frame_title"></div>
          <!-- 注册姓名 -->
          <el-form-item class="frame_input" prop="userName">
            <el-input v-model="regFormData.userName" placeholder="姓名">
              <img :src="frameIcon.user" slot="prefix"/>
            </el-input>
          </el-form-item>
          <!-- 注册身份证 -->
          <el-form-item class="frame_input" prop="loginName">
            <el-input v-model="regFormData.loginName" placeholder="身份证号">
              <img :src="frameIcon.account" slot="prefix"/>
            </el-input>
          </el-form-item>
          <!-- 注册手机号 -->
          <el-form-item class="frame_input" prop="mobile">
            <el-input v-model="regFormData.mobile" placeholder="手机号" :type="getPasswordType(regMobileShow)">
              <img :src="frameIcon.mobile" slot="prefix"/>
              <img
                  v-if="!regMobileShow"
                  @click.stop="handeShowToggle('regMobileShow')"
                  :src="frameIcon.passwordOn" slot="suffix"
              />
              <img
                  v-if="regMobileShow"
                  @click.stop="handeShowToggle('regMobileShow')"
                  :src="frameIcon.passwordOff" slot="suffix"
              />
            </el-input>
          </el-form-item>
          <!-- 注册密码 -->
          <el-form-item class="frame_input" prop="password">
            <el-input
                v-model="regFormData.password"
                placeholder="密码"
                :type="getPasswordType(regPasswordShow)"
            >
              <img :src="frameIcon.password" slot="prefix"/>
              <img
                  v-if="!regPasswordShow"
                  @click.stop="handeShowToggle('regPasswordShow')"
                  :src="frameIcon.passwordOn" slot="suffix"
              />
              <img
                  v-if="regPasswordShow"
                  @click.stop="handeShowToggle('regPasswordShow')"
                  :src="frameIcon.passwordOff" slot="suffix"
              />
            </el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <div class="frame_button">
            <el-button :loading="submitLoading" type="primary" @click="handleReg()">{{ regBtnText }}</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="block">
      <div class="btn-box">
        <div>
          <span v-if="activeType === 'login'" @click="activeType = 'reset'; resetFormData()">忘记密码</span>
          <span v-if="activeType === 'login'" @click="activeType = 'register'; resetFormData()">注册</span>
          <span v-if="activeType === 'register' || activeType === 'reset'"
                @click="activeType = 'login'; resetFormData()">立即登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 接口
import {
  fetchLogin,
  fetchRegister
} from "./api/asset"
// 加密
import {Encrypt} from "./api/index";

import qs from "querystringify";
// 样式
import "./index.css";

import {ERROR_LIST} from './dict'

export default {
  name: "App",

  props: {
    customConfig: Object,
  },

  beforeMount() {
    document.title = '登录'
  },

  mounted() {
  },

  watch: {
    activeType: function (newData) {
      const config = {
        login: '登录',
        register: '注册',
        reset: '重置密码',
      }
      document.title = config[newData]
    }
  },

  data() {
    return {
      // 登录框图标
      frameIcon: {
        account: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGnSURBVHgBpVNdTsJAEJ5ZaOubeIMeAU8A3MBXxMQ0iAliopwAOUExCE0EUxIDPHoEuQEcoUeoj/Kz42xxmwLliW3a3e5+3+w33+wCnNjQfR/nLYEtHuf05MPddSkN7H1MW0RU1P8bgFfBZJeAipIn1EsAoQb0OHh38BkT1iQvNI6bLRBc7A8n3/u7up5vW4blczBNDpaZ38um48TB3waTEQooiDSppnHWUmQi2QQkR+1mrs3nNKxISo6NAbK5WzzWbjqNamXEmAUiFpIYTjvgT4hpUbuD8YtANlaSQ0g5ROEC4qhRLTtJnO/7uWxagHV22bE21i0J9FHpAZhlltDexznsyYEHqqxn0nR5GPxPRSBpQkuZCwfpJskMMAxzjlGOuEiucRCb1FmRVGrcV+K1rCojEf40auUr5T4LDnGFpXq9HCQDeN7UJkPOISOelHrNizxApPMtjHLRLgb5DNiRStGjyhZVCDRvxwOxwqYqmT5t+y8bOmN1O5XA3nDyxX2R847zOnYX+ltsdGckUF6wT1k2pc3lUtK1qyEcaTJx4ZQaYi6c2v4Ay9WxJSeZ2fUAAAAASUVORK5CYII=',
        password: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFaSURBVHgBjVJNTsJQEJ55LdCNSW8gnsB4Ar2BbHFFQ1ygC8sJwBMAC2BhDWzElRFvgDfQEyg3YGlTOuO0hKZ90KaTtPMy8803vwg5MpjNbIOqDWTcbAP/q9txfo/h8Jhx/PzaA+Z+2qYQ+51281HHqoLgkQr8MyC+IOARiW3ytHB1vKkbJLgFiPP7djMNdife4pwRevIe5lYQ9S2qzsTfOi8xfYiyPe/tNJfA+rPsHZg3BwQKD2yR4D5zNHFFbCOqQdRCCPSZBhqsLqW/lnwuAa63hr/qOs4mnkE1tAaxEzGZgwHYyubifc5hVHaVrLkox9yVwXVRKwx8B0pIWKm9K45jslvoaMcy9l4e5JDw7vYmM3nZSDIPBQWCgA35XRdhCgnKiFnk3O1elSOQGdvT6aye8W6DZaR0O+sExLCWDV5RpfYDZUVuJSEITN81Q3PJqOyy8SfKj6v7B0z3iH2sPSRfAAAAAElFTkSuQmCC',
        mobile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADlSURBVHgB7VPLDYJAEJ2dRblSAiVoJXo0Gk9+DhqjlmAFQgiaoIaDwbMl2IGWQgGw4y6RBBEhxosH3x52dibvZTZ5j0EOrhc0BBMGFAAJw+m4d8v2WPaxOZzWRLCAEjCG1mTQWb4IuJ7fANSvsrQFxediNrYR2BwENdNNtHQmmGaguiV5NupfivjO7ihF+Dz7RYQv8Rf4BQHt3WC99U29pvuqJkHLvIUrBeq8bohHzWMMoWoDpCiULgOOtZZynJAHCFZqFmlgyp7JkbdkVpJQpbynMDn7wEq8Xg57OuwuCgUUPo3zHWY0TiKhku/sAAAAAElFTkSuQmCC',
        user: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFgSURBVHgBrVJLTgJBEK3qaUaXeIO5gXADb4AukRAgigkhRDmBcAJMjLIQ07BAt3ACOcLcAI7AVhi6rBqQxIT5JFJJp7vr8/pVvQb4p2FU4OV9XEXCAh+zZGnUvCsND+Wpw8Wfj0BoLIAHshSavvjSMOj1jedmTuaAOGzeFGviex6MnxTg/cr5PmvXastYBlprT3Zrg9HeSXYSxgKdg6QWAh34sjsqU9gnoa7sABaQ1EJI+W3cUYjSsxQI5RwQdZv1UicVgJioQIQVFABL0ygV/gD0jMm6a9ezaLNRwK16eXYQ4HXwcWmBDAJGFu9swfK2W7fXkz3Ar3R88Tew6QLBMqraQceQ/A1LeW7L1+J0M6c8MFriGq9ajfIi7nluM+9u3DlLU+Xrg9rSIE9ebzSKscVi8pG4TZ/zz+UeMqCtVBc8hy9IYTyrHKIKZxAyUGtsE8HUhsHkxQxmagVdOIb9AAQ5hQzBspmCAAAAAElFTkSuQmCC',
        passwordOn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFaSURBVHgBxVLLbYNAFGQxMteUQCqI0wGpwO4AuPA5xanAuILYJyRAIqkgSQV2ByEduATfkPhmBrERipGvXmnFvrcz82bfQ1FuvcRUMooiczabWTguhlTeNM17EATHqwJZlt1VVfXRdZ0Bwh7fnqCq6gJ7I4Q4Ir+F0OlCAFUNgA4gffm+v1amnYXAWG3bPkkRISuXZfmNC9oMZa4oCrsHCfEpCVJkPp8/Oo5zVpmE7VdWlmS6oaCmaQ8g0/6BgrwjhlhyGGsA20iYsH0vrSJe8b2u6zqD4BsE6WbHWNf1kAXYbDo4AXxWrixMpBvHtD4cjb4HcRyzebnneS/jntDF4MgcNy5Jkg0nRYd9DzAaWl2laWrJCiTUdf3DzYZJMjG4sznOvymMx4jjHk52U0+B02dUXl+McUJEAWiLnfcgIUxMZImYz3Emf6R/QjZIS2xj6EGOPfkr3379Ands68PFH5gxAAAAAElFTkSuQmCC',
        passwordOff: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADPSURBVHgB7VBLDoIwEG0LYc0NhBvoDeQG3kDY8Akrb+ANjAtCWPUIegS5gTdQb8Ce0PomsSYQQyBxY+JLXtuZznudDmN/fAdFUSzZTBiNoMW27VNZluupYqolzdtAKRUJIeSUTqiGanHcUczNRVVVG2wHzvmlbdtjnufXoRCvbnEMwShJknPP4GVy01rfYeIhdLGTiYucBzZgbVnWIo7jwGjEoIMmTdMA7r7jOH7XdQ98rwZXyPtZloVmBuwTpJQu6w9rTxyrGQXE3izBb+IJTZNWVZSrUA4AAAAASUVORK5CYII=',
      },
      // 登录表单
      loginFormData: {
        account: '',
        password: '',
      },
      // 注册表单
      regFormData: {
        userName: '',
        loginName: '',
        mobile: '',
        password: '',
      },
      activeType: 'login',
      loginPasswordShow: false,
      regMobileShow: false,
      regPasswordShow: false,
      submitLoading: false,
    }
  },

  computed: {
    // 登录表单校验
    loginDataRule() {
      return {
        account: [{required: true, message: '请输入身份证号', trigger: 'submit'}],
        password: [{required: true, message: '请输入密码', trigger: 'submit'}],
      }
    },
    // 注册表单校验
    regDataRule() {
      return {
        userName: [{required: true, message: '请输入姓名', trigger: 'submit'}],
        loginName: [{required: true, message: '请输入身份证号', trigger: 'submit'}],
        mobile: [{required: true, message: '请输入手机号', trigger: 'submit'}],
        password: [{required: true, message: '请输入密码', trigger: 'submit'}],
      }
    },
    bgClass() {
      const config = {
        login: 'bg1',
        register: 'bg2',
        reset: 'bg2',
      }
      return config[this.activeType]
    },
    toTitleInfo() {
      const config = {
        login: {
          top: '欢迎登录，',
          bottom: '班玛数字乡村'
        },
        register: {
          top: '请填写您的信息'
        },
        reset: {
          top: '请填写您的信息'
        },
      }
      return config[this.activeType] || {}
    },
    regBtnText() {
      return this.activeType === 'register' ? '注册' : '重置密码'
    }
  },

  methods: {
    resetFormData() {
      this.loginFormData = {
        account: '',
        password: '',
      }
      this.loginFormData = {
        userName: '',
        loginName: '',
        mobile: '',
        password: '',
      }
    },
    handeShowToggle(key) {
      this[key] = !this[key]
    },
    getPasswordType(type) {
      return type ? '' : 'password'
    },
    // 消息提示
    openMessage(res, type, defaultText) {
      this.$message({
        message: ERROR_LIST[`ERROR.${res?.data?.code}`] || res?.data?.message || defaultText,
        center: true,
        type: type,
        customClass: 'message-custom',
      });
    },
    loadingToggle() {
      this.submitLoading = !this.submitLoading
    },
    // 登录
    handleLogin() {
      this.loadingToggle();
      this.$refs['loginForm'].validate(valid => {
        if (!valid) {
          this.loadingToggle();
          return false
        }
        const loginForm = {
          account: this.loginFormData.account,
          password: Encrypt(this.loginFormData.password)
        }
        // 跳转页面
        fetchLogin(loginForm).then(() => {
          const {inviteUrl} = qs.parse(location.search)
          if (inviteUrl) return window.location.href = inviteUrl
          this.loadingToggle();
          history.back()
        }).catch((err) => {
          this.loadingToggle();
          this.openMessage(err, 'error', '登录失败')
        })
      })
    },
    // 注册
    handleReg() {
      this.loadingToggle();
      this.$refs['loginForm'].validate(valid => {
        if (!valid) {
          this.loadingToggle();
          return false
        }
        const loginForm = {
          userName: this.regFormData.userName,
          loginName: this.regFormData.loginName,
          mobile: this.regFormData.mobile,
          password: this.regFormData.password,
          type: this.activeType
        }
        fetchRegister(loginForm).then((res) => {
          this.openMessage(res, 'success', '注册成功')
          this.loadingToggle();
          this.resetFormData()
          this.activeType = 'login'
        }).catch((err) => {
          this.loadingToggle();
          this.openMessage(err, 'error', '注册失败')
        })
      })
    }
  },
};
</script>

<style scoped lang="less">
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.bg1 {
  background: #F9FBFD url('./assets/bg1.png') no-repeat;
}

.bg2 {
  background: #F9FBFD url('./assets/bg2.png') no-repeat;
}


.login_all {
  width: 100%;
  height: 100%;
  line-height: 1.5715;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  background-size: 100%;
  padding: 32px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;

  & > .block {
    width: 100%;
  }

  .btn-box {
    color: #1A79FF;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;

    & span {
      position: relative;

      &:not(:last-of-type) {
        margin-right: 48px;

        &:after {
          content: '';
          position: absolute;
          height: 14px;
          top: 5px;
          width: 1px;
          background: rgba(0, 0, 0, 0.2);
          right: -24px;
        }
      }
    }
  }

  .top-title {
    width: calc(100% - 48px);
    font-weight: 600;
    font-size: 32px;
    line-height: 45px;
    margin: 0 auto;
    margin-bottom: 20px;

    .bottom-info {
      font-size: 32px;
      font-weight: 300;
    }
  }

  // 登录框整体
  .login_frame {
    box-sizing: border-box;
    text-align: center;
    padding: 40px 16px;
    width: calc(100% - 48px);
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 10px 30px rgba(3, 71, 204, 0.1);
    border-radius: 8px;

    .register-immediately {
      color: #FF0607;
      cursor: pointer;
    }

    .login-immediately {
      color: #2c97dd;
      cursor: pointer;
    }
  }

  // 账号密码框
  .frame_input {
    margin-bottom: 24px;

    /deep/ .el-input__inner {
      box-sizing: border-box;
      height: 50px;
      font-size: 16px;
      padding-top: 2px;
      padding-left: 38px;

      &:hover {
        border-color: #2e7bff;
      }

      &:focus {
        box-shadow: 0 0 0 2px #cdddfc;
      }
    }

    // 左槽
    /deep/ .el-input__prefix {
      display: flex;
      align-items: center;
      margin-right: 4px;
      left: 12px;
    }

    // 右槽
    /deep/ .el-input__suffix-inner {
      display: flex;
      align-items: center;
      height: 100%;
      margin-left: 4px;
      padding-right: 7px;
      cursor: pointer;
    }
  }

  // 登录按钮
  .frame_button {
    width: 100%;

    /deep/ .el-button {
      width: 100%;
      height: 100%;
      margin-top: 56px;
      padding-top: 16px;
      border-radius: 4px;
      border-color: #2c97dd;
      background-color: #1A79FF;
      font-size: 16px;
      box-shadow: 0 9px 7px rgba(4, 84, 242, 0.12);
    }
  }

  // 记住密码
  .frame_remember {
    width: 100%;
    text-align: center;
    margin-top: 35px;
    font-family: PingFang SC Regular, PingFang SC Regular-Regular;
    letter-spacing: 2px;

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #5e605f;
    }

    span {
      letter-spacing: 0;
      margin-left: 13px;
      cursor: pointer;
      color: blue;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>