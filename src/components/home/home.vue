<template>
  <div class="home-container">
    <Header></Header>
    <Menu :menuList="menuList"></Menu>
    <div class="M_content">
      <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
  import Footer from "common/footer/footer";
  import Header from "common/header/header";
  import Menu from "common/menu/menu";
  export default {
    components: { Header, Menu, Footer },
    data() {
      return {
        menuList: []
      }
    },
    created() {
      this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
      this.menuList.forEach((item) => {
        if(item.url === "/index") {
          item.icon = require("../../../static/images/index.png");
        }
        if(item.children) {
          item.children.forEach((obj => {
            if(obj.url === "/applyTask") {
              obj.icon = require("../../../static/images/rwsq.png")
            }
            if(obj.url === "/applyPlan") {
              obj.icon = require("../../../static/images/jhsq.png")
            }
            if(obj.url === "/aircraftManage") {
              obj.icon = require("../../../static/images/fxqgl.png")
            }
            if(obj.url === "/pilotManage") {
              obj.icon = require("../../../static/images/fxygl.png")
            }
            if(obj.url === "/airspaceManage") {
              obj.icon = require("../../../static/images/kygl.png")
            }
            if(obj.url === "/airLineManage") {
              obj.icon = require("../../../static/images/hxgl.png")
            }
            if(obj.url === "/accountManage") {
              obj.icon = require("../../../static/images/zhgl.png")
            }
            if(obj.url === "/airportManage") {
              obj.icon = require("../../../static/images/fxinfo.png")
            }
            if(obj.url === "/ukeySetting") {
              obj.icon = require("../../../static/images/fxinfo.png")
            }
          }))
        }
      });
    }
  }
</script>
<style scoped>
  .home-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: #e8edee;
  }
  .M_content {
    position: absolute;
    left: 200px;
    right: 0;
    top: 80px;
    bottom: 30px;
    width: auto;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 15px;
    border-top: 1px solid #eee;
  }
</style>
