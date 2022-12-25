import axios from "axios";
import qs from "querystringify";

// const apiContextPath = "http://192.168.1.240:43214";
let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
    document.cookie =
        "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MTc2Nzc1MDcyMSwidXNlcklkIjoiMTVhY2I1N2MtZTJhOC00MjhlLTkzY2QtY2RhMjJmYTNjYTdjIn0.Y7xByP1RdLxekBmk6ubXh-HeqgEUfcNwkl4rw08sJ2Q";
    document.cookie =
        "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MTc2MzMzNzg4Nn0.zFFOGV0ptZ8yQm8haEfTre7KIQnA-uE9gFoOwEWQigo";
    document.cookie = "username=admin";
    document.cookie = "windowOnline=true";
    apiContextPath = "/api";
}

const instance = axios.create({
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
