/**
 * Created by yzf on 2017/8/10.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

const state = {
  menuList: [],
  token_id: "",
  task_remark_num: 0,
  plan_remark_num: 0
};
const getters = {};

export default new Vuex.Store({
  state, // 状态 存放
  mutations, // 修改、改变、切换、下一个改变的定义
  getters,
  actions // 动作，组件不能直接改变state，改变谁？
})
