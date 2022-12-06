import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MDI5NTA4ODE1MywidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.nuhvVXe8Eyd4AyYiIkJ2FJa11VDqFzg8OszspTap0jw";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTAxNzk4ODE2NywidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.JQ9RzoTE5AIyeG4voNbUBTQRsEuaxp8ybVPhBhr7fvE";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTI5NzkzNDEwM30.D5vszpoZh5yv7mWSXelr8IhP93jPZpIBqDvM5NxRvag";
  // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTAxNzk4ODE3MX0.akPb_rfnaLBeFaJCxyk4AXcXdzkR1xXgpISmkm9KJbE";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api";
}
let a = '/dtyq/pngf/'
const prefix = window.apiContextPathPrefix ? (window.apiContextPathPrefix + "/") : ""
const instance = axios.create({
  baseURL: `${apiContextPath}/dtyq/pngf/sdata/rest`,
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
