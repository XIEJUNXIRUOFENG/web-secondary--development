// intl.get('CONT.TIMESTAMP_CONVERSION')yyyy/mm/dd
export const formatDates = e => {
	let time = '';
	if (e || e === 0) {
		let now = new Date(e);
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let date = now.getDate();
		if (date < 10) {
			date = '0' + date;
		}
		if (month < 10) {
			month = '0' + month;
		}
		time = year + '-' + month + '-' + date;
		return time;
	}
};

export const formatDate = e => {
	let time = '';
	if (e || e === 0) {
		let now = new Date(e);
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let date = now.getDate();
		let hour = now.getHours();
		let minute = now.getMinutes();
		let second = now.getSeconds();
		if (second < 10) {
			second = '0' + second;
		}
		if (minute < 10) {
			minute = '0' + minute;
		}
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (date < 10) {
			date = '0' + date;
		}
		if (month < 10) {
			month = '0' + month;
		}
		time = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
		return time;
	}
};
