import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODg0NjcyMjAxNywidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.txFPTPkvFsT6wt94xTKl2eA_8iyftzC7aEidbyI6PbI";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc2MDY4MDg5OSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.LXUQxL42fR5hbQAPwjpo5n_AfYtKMLc7c4Zi_SkBlQU";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODg0NjcyMjAyMX0.1Hs8IXj9PMF7jUtOwlOg3YEoMkEDtAo_dTi2Y_dQXmQ";
  // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODgyNDcwNDM1NH0.aXLtC4ffrGy-8C-D9rgNaVXeKGXFjK8T1jWVc5Mxym0";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api";
}
let a = '/dtyq/pngf/'
const prefix = window.apiContextPathPrefix ? (window.apiContextPathPrefix + "/") : ""
const instance = axios.create({
  baseURL: `${prefix}${apiContextPath}/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers:
    (window.location.search && qs.parse(window.location.search).token) ||
      window.token
      ? { token: qs.parse(window.location.search).token || window.token }
      : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  response => {
    let { data } = response;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (data && data.status !== 200 && !(data instanceof Blob)) {
      return Promise.reject(response);
    }
    if (data instanceof Blob) {
      response.data = data;
      return response;
    }

    response.data = data && data.result;
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
