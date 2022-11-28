import axios from 'axios';
// import qs from 'querystringify';

// const apiContextPath = "http://192.168.1.240:43214";

const instance = axios.create({
	baseURL: `/sdata/rest`,
	timeout: 60000,
	validateStatus: function (status) {
		return status >= 200 && status < 300; // default
	},
	headers: {
		token: 'eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MjEwNDEwMzI4MSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.tWl1iWokm-mlLKBdI0XCYdfwJ7Fv4NFLOWpIw5HThR0',
	},
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.response.use(
	response => {
		let { data } = response;
		if (typeof data === 'string') {
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
