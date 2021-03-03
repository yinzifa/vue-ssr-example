/**
 * Created by yinzifa on 2018/1/8.
 */

import $ from "axios"

/*
* method 请求方式
* url 请求url
* headers 请求头
* params 请求参数
* */
function  asyncRequest(method, url, headers, params) {
  let obj = {
    method: method,
    url: url,
    headers: headers
  };
  if(method === "get") {
    obj.params = params
  }else {
    obj.data = params
  }
  return new Promise((resolve, reject) => {
    $(obj).then((res) => {
      if(res.data.code === 200) {
        resolve(res.data.data)
      }else {
        reject(res.data.msg)
      }
    })
  })
}

export default { asyncRequest: asyncRequest }
