import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie =
    // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NjMxNTM5NDEyMSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.M7e79nGupb0dKiUzlOMfBXB5O4blHUCT_xT5p0TlUmA";
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2Nzc4NTU1MTQ1MCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.lWO1Y_chlrVD4DnyOCY7QiBXjSHRolYnx-lp8eYcCnI";
  document.cookie =
    // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NjMxNTM5NDEyM30.49cl3McisoE85u_vuFLwpfwLIpwqkGf0dcO0kwa_8bY";
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2Nzc4NTU1MTQ1MX0.NVn84EyQUbiNQTzttQ8AdnP7nkYem63VYzx8hc7S2a0";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api";
}

const instance = axios.create({
  // baseURL: `${apiContextPath}`,
  baseURL: `${apiContextPath}/sdata/rest`,
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
