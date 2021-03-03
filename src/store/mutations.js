/**
 * Created by yzf on 2017/8/10.
 */
export default {
  setMenuList(state, menuList) {
    state.menuList = menuList
  },

  setTokenID(state, id) {
    state.token_id = id
  },

  setLeftNumber(state, payload) {
    state.task_remark_num = payload.task_remark_num;
    state.plan_remark_num = payload.plan_remark_num;
  }
}
