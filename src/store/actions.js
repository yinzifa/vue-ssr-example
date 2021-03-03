/**
 * Created by yzf on 2017/8/10.
 */
export default {
    //设置菜单权限列表
    setMenuList: ({commit}, menuList) => {
        commit('setMenuList', menuList)
    },

    setTokenID({commit}, id) {
        commit('setTokenID', id)
    }
}
