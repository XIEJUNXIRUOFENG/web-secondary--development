// -----------------------------------------以详情页detailid为判断条件--------------------------------------------------------------------
const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
};

function getcookie(objname) {//获取指定名称的cookie的值
  var arrstr = document.cookie.split("; ");
  for (var i = 0; i < arrstr.length; i++) {
    var temp = arrstr[i].split("=");
    if (temp[0] == objname) return unescape(temp[1]);
  }
}

const flow_instid = getQueryString("flowInstId") || ""
const data_id = getQueryString("data_id") || ""
const detailid = getQueryString("detailid") || ""
const XSRF_TOKEN = getcookie('XSRF-TOKEN')

if (flow_instid && data_id) {
  if (detailid) {
    var url = `/sdata/rest/flow/lixia/hideComponentIds?flowInstId=${flow_instid}&detailId=${detailid}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("X-XSRF-TOKEN", XSRF_TOKEN);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let { result } = JSON.parse(xhr.responseText);
          for (let index = 0; index < result.length; index++) {
            console.log(result[index]);
            window.componentCenter.componentMap.get(result[index])?.do_EventCenter_hiddenFun({value: false})
          }
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  } else {
    var url = `/sdata/rest/flow/lixia/hideComponentIds?flowInstId=${flow_instid}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("X-XSRF-TOKEN", XSRF_TOKEN);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let { result } = JSON.parse(xhr.responseText);
          for (let index = 0; index < result.length; index++) {
            console.log(result[index]);
            window.componentCenter.componentMap.get(result[index])?.do_EventCenter_hiddenFun({ value: false })
          }
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  }
}


// -----------------------------------------不以详情页detailid为判断条件、分两段js代码详情页贴详情页新增页贴新增页--------------------------------------------------------------------
// ========================================新增页==========================================================
const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
};

function getcookie(objname) {//获取指定名称的cookie的值
  var arrstr = document.cookie.split("; ");
  for (var i = 0; i < arrstr.length; i++) {
    var temp = arrstr[i].split("=");
    if (temp[0] == objname) return unescape(temp[1]);
  }
}

const flow_instid = getQueryString("flowInstId") || ""
const data_id = getQueryString("data_id") || ""
const XSRF_TOKEN = getcookie('XSRF-TOKEN')

if (flow_instid && data_id) {
  var url = `/sdata/rest/flow/lixia/hideComponentIds?flowInstId=${flow_instid}`;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("X-XSRF-TOKEN", XSRF_TOKEN);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let { result } = JSON.parse(xhr.responseText);
        for (let index = 0; index < result.length; index++) {
          console.log(result[index]);
          window.componentCenter.componentMap.get(result[index])?.do_EventCenter_hiddenFun({ value: false })
        }
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}


// ========================================详情页==========================================================
const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
};

function getcookie(objname) {//获取指定名称的cookie的值
  var arrstr = document.cookie.split("; ");
  for (var i = 0; i < arrstr.length; i++) {
    var temp = arrstr[i].split("=");
    if (temp[0] == objname) return unescape(temp[1]);
  }
}

const flow_instid = getQueryString("flowInstId") || ""
const data_id = getQueryString("data_id") || ""
const detailid = getQueryString("detailid") || ""
const XSRF_TOKEN = getcookie('XSRF-TOKEN')

if (flow_instid && data_id) {
  var url = `/sdata/rest/flow/lixia/hideComponentIds?flowInstId=${flow_instid}&detailId=${detailid}`;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("X-XSRF-TOKEN", XSRF_TOKEN);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let { result } = JSON.parse(xhr.responseText);
        for (let index = 0; index < result.length; index++) {
          console.log(result[index]);
          window.componentCenter.componentMap.get(result[index])?.do_EventCenter_hiddenFun({ value: false })
        }
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}

