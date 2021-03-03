<template>
  <div class="menu-container">
    <el-menu
      style="overflow-y: auto"
      router
      :default-active="onRoutes"
      background-color="#3e4b54"
      active-text-color="#27c1e4"
      :default-openeds="defaultOpenMenuArr"
      text-color="#fff"
      @close="setFirstChildToActive"
      :unique-opened="false">
      <div v-for="(item, index) in menuList" :key="index">
        <el-submenu v-if="item.children.length > 0" :index="item.url" :key="item.url">
          <template slot="title">
            <img :src="item.icon" style="margin-right: 7px" alt="">
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="obj in item.children" :index="obj.url" :key="obj.url" @click="routerPush(obj.url)">
            <i :class="'m'+obj.id"></i>
            <span slot="title">{{ obj.name }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.url" :key="item.url">
          <i :class="'m'+item.id" :title="item.name"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>
<script>
  export default {
    props: {
      menuList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        defaultOpenMenuArr: ['/index', '/4041', '/4042', '/4043', '/4044', '/4045', '/4046']
      }
    },
    methods: {
      routerPush(url) {
        this.$router.push(url + "?reload=1")
      },
      setFirstChildToActive(index, indexPath) {
        this.defaultOpenMenuArr.push(index);
        let obj = this.menuList.filter(item => {
          return item.url === index
        });
        this.$router.push(obj[0].children[0].url);
      }
    },
    computed: {
      onRoutes() {
        let _route = this.$route.path.split('/')[1];
        return '/' + _route;
      }
    }
  }
</script>
<style scoped>
  .menu-container {
    position: absolute;
    width: 200px;
    bottom: 0;
    top: 80px;
  }
</style>
<style>
  .menu-container .el-menu {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .menu-container .el-submenu__title {
    font-size: 16px;
    color: #919ead !important;
    margin-left: -10px;
  }

  .menu-container .el-submenu__title i {
    display: none;
  }

  .menu-container .el-menu-item {
    padding-left: 10px !important;
    margin: 20px;
    height: 22px !important;
    line-height: 22px !important;
    background-color: transparent !important;
    border-left: 2px solid transparent;
  }

  .menu-container .el-menu-item:hover {
    color: #27c1e4 !important;
    background-color: transparent !important;
  }

  .menu-container .el-menu-item.is-active {
    border-left: 2px solid #27c1e4;
  }

  .menu-container .el-submenu__title {
    cursor: default !important;
  }

  .menu-container .el-submenu__title:hover {
    background-color: transparent !important;
  }

  .menu-container .el-menu-item i {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url('../../../static/images/menu_icon_bg.png');
    background-size: 200% auto;
    margin: -2px 7px 0 0;
    background-position: 0 0;
  }

  .menu-container .el-menu-item .m300003 {
    background-position: 0 -60px;
  }

  /* 任务审核  */
  .menu-container .el-menu-item .m300004 {
    background-position: 0 -81px;
  }

  /* 计划审核  */
  .menu-container .el-menu-item .m300006 {
    background-position: 0 -101px;
  }

  /* 飞行员信息 ,角色管理 */
  .menu-container .el-menu-item .m300007 ,.menu-container .el-menu-item .m300025{
    background-position: 0 -120px;
  }

  /*  航空器信息 , 用户管理 */
  .menu-container .el-menu-item .m300008 ,.menu-container .el-menu-item .m300026{
    background-position: 0 -140px;
  }

  /* 通航企业管理  */
  .menu-container .el-menu-item .m300010 {
    background-position: 0 -200px;
  }

  /* 机场信息  */
  .menu-container .el-menu-item .m300012 {
    background-position: 0 -160px;
  }

  /* 常用空域  */
  .menu-container .el-menu-item .m300011 {
    background-position: 0 -220px;
  }

  /* 航空器厂商管理  */
  .menu-container .el-menu-item .m300027 {
    background-position: 0 -101px;
  }

  /* 航空器型号管理  */
  .menu-container .el-menu-item .m300028 {
    background-position: 0 -101px;
  }

  /*管制公告*/
  .menu-container .el-menu-item .m300201 {
    background-position: 0 -259px;
  }

  /*秘钥配置*/
  .menu-container .el-menu-item .m300601 {
    background-position: 0 -239px;
  }

  /*飞行进程单*/
  .menu-container .el-menu-item .m300401 {
    background-position: 0 -339px;
  }

  /* 常用航线  */
  .menu-container .el-menu-item:hover i, .menu-container .el-menu-item.is-active i {
    background-position-x: -20px;
  }
</style>
