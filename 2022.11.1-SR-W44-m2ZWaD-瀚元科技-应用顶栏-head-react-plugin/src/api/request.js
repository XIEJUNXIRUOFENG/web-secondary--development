import axios from "axios";
import qs from "querystringify";

if (process.env.NODE_ENV === "development") {
  document.cookie =
    // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODczNTQ0NzQzMSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.FjwFGyCC-a2QFua35MxXAcQnA9FV78rb-_pxF2hE9A0";
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTA4ODU3ODk4NiwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.Qb8LXtK4B5SXiQNrOw4tWxFhIr8_LoPJS3JzttevXTQ";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc3MzAwNTY1OCwidXNlcklkIjoiNmUyNTE5NDMtNmJiZS00YzA5LWExZTctMDI4ZGMzYmQ1NDZhIn0.eceV39Dt97ALIo8fCIXw_8DKXANU9U5DcSxwOl5qp9E";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc3Mjk1NTQxMiwidXNlcklkIjoiYmM0ODJmMjEtYThkYi00YTYxLTg2ODYtOGI4NzUzODYwM2YzIn0.v4Lo2Szftj2HKxf27xhWl2S0UClOHPIMBXJhf09YiBI";
  document.cookie =
    // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODczNTQ0NzU1OH0.0OpXidMdEjG_xUqLxfrxmoTSwazvS11ycY-EuobNIug";
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTA4ODU3OTA4MX0.nuXOBnoWBMK11EKqaOr_raUujYK5s_RA4l1_Q6JxuuI";
  // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc3MzAwNTc1Nn0.zAbWTtxx-chXr7x3EK3EBDg0uGCZtyvC-f3v80c82BY";
  // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc3Mjk1NTYxMX0.zg_F5flGAkEZ0sWg1BSCBcXYW3CSfiVmxfJWZFTCsZk";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  // document.cookie = "JSESSIONID=D2012FF85B626ADD2958913BC2F5CD92";
  // document.cookie = "XSRF-TOKEN=03b34bf1-3ce6-4d14-8894-1a42f0559947";
}

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/sdata/rest`,
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
  (response) => {
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
  (error) => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
