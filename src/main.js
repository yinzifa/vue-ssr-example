import Vue from 'vue';
import elementUi from 'element-ui';
import App from './App';
import router from './router';
import store from './store';
import axios from "axios";
import '../theme/index.css';
import '../static/css/reset.css';

//请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
});
//响应拦截器
axios.interceptors.response.use((res) => {
  if(res.data.code === 401) {
    router.replace("/login");
    return;
  }else if(res.data.code === 403) {
    router.replace("/index");
    return;
  }
  return res;
}, (error) => {
  return Promise.reject(error);
});

Vue.use(elementUi);
axios.defaults.baseURL = "/api";
Vue.prototype.$axios = axios;

//关闭生产环境的调试信息
const isDebug_mode = process.env.NODE_ENV !== 'production';
Vue.config.debug = isDebug_mode;
Vue.config.devtools = isDebug_mode;
Vue.config.productionTip = isDebug_mode;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
