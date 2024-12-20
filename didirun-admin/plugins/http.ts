/* eslint-disable camelcase */
import axios from 'axios';
import jsCookie from 'js-cookie';
import queryString from 'query-string';
import Vue from 'vue';
interface Result {
  code: number;
  data: any;
  msg: string;
}
const axios_instance = axios.create({
  baseURL: '',
  timeout: 120000,
  headers: {
    'x-csrf-token': jsCookie.get('csrfToken')
  }
});

axios.defaults.withCredentials = true;

axios_instance.interceptors.response.use(
  result => {
    // result的结构：{ config, data, headers, request, status, statusText, }
    const { data } = result;
    if (data.code !== 200 && data.code !== 203 && data.code !== 1003) {
      Vue.prototype.$message.error(data.msg);
    }
    // 请登录
    if (data.code === 203) {
      jsCookie.remove('token');
      window.location.href = '/login';
    }
    // 请设置密码
    if (data.code === 202) {
      if (window.location.pathname !== '/user/setPwd') {
        window.location.href = '/user/setPwd';
      }
    }
    return data as Result;
  },
  (error: Error) => {
    if (error.message.includes('404')) {
      Vue.prototype.$message.error('接口没有找到404');
    } else if (error.message.includes('500')) {
      Vue.prototype.$message.error('服务端错误500');
    } else {
      Vue.prototype.$message.error(error.message);
    }
    return { code: 1000, msg: '服务端错误' };
  }
);

/**
 * 定义更便捷的$http，其中get改写一下。
 *
 * 原因：axios_instance的get是传对象需要{params:{...}}，太麻烦了。我改成{params}直接传。
 */
const $get = (url: string, params?: any) => {
  const params_str = queryString.stringify(params || {});

  let fullUrl = url;
  if (params_str) {
    if (url.includes('?')) {
      fullUrl += '&' + params_str;
    } else {
      fullUrl += '?' + params_str;
    }
  }

  return axios_instance.get(fullUrl);
};

// delete方法的参数上提一层（同myGet）
const $delete = (url: string, params: any) => {
  return axios_instance.delete(url, { data: params });
};

const httpInstance = {
  get: $get,
  delete: $delete,
  post: (url: string, params: any) => {
    return axios_instance.post(url, params);
  },
  put: (url: string, params: any) => {
    return axios_instance.put(url, params);
  }
};

['options', 'head', 'patch', 'request'].forEach(method => {
  (httpInstance as any)[method] = (url: string, params: any) => {
    // eslint-disable-next-line camelcase
    return (axios_instance as any)[method](url, params);
  };
});

export default httpInstance;
