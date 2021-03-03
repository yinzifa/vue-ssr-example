<template>
  <div class="wrapper flex-center">
    <div class="left-box gutter flex-center">
      <div class="task left-wh gutter flex-center-col item" @click="jumpToTask">
        <div class="img-box">
          <img src="../../../static/images/task-index.png">
        </div>
        <span class="left-font">任务审核</span>
      </div>
      <div class="plan left-wh flex-center-col item" @click="jumpToPlan">
        <div class="img-box">
          <img src="../../../static/images/plan-index.png">
        </div>
        <span class="left-font">计划审核</span>
      </div>
    </div>
    <div class="right-box">
      <div class="right-box-top flex-center ">
        <div class="aircraft gutter right-top-wh flex-center-col item" @click="jumpToAircraft">
          <div class="img-box-right">
            <img src="../../../static/images/airCraft-index.png">
          </div>
          <span class="right-font">航空器信息</span>
        </div>
        <div class="airpilot right-top-wh flex-center-col item" @click="jumpToPilot">
          <div class="img-box-right">
            <img src="../../../static/images/pilot-index.png">
          </div>
          <span class="right-font">飞行员信息</span>
        </div>
      </div>
      <div class="right-box-bottom">
        <div class="userinfo flex-center-col item" @click="jumpToUserInfo">
          <div class="img-box-right">
            <img src="../../../static/images/userinfo-index.png">
          </div>
          <span class="right-font">通航企业管理</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      jumpToTask() {
        this.$router.push('/applyTask')
      },
      jumpToPlan() {
        this.$router.push('/applyPlan')
      },
      jumpToAircraft() {
        this.$router.push('/aircraftManage')
      },
      jumpToPilot() {
        this.$router.push('/pilotManage')
      },
      jumpToUserInfo() {
        this.$router.push('/accountManage')
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    height: 100%;
    padding: 15px;
  }
  .item {
    cursor: pointer;
    transition: all .6s;
  }
  .item:hover{
    transform: scale(1.02);
    box-shadow: 0 0 5px #ddd;
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flex-center-col {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .img-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    margin-bottom: 30px;
  }
  .img-box .badge {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    border: 3px solid white;
    border-radius: 50%;
    background: red;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
  }
  .img-box-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 90px;
    margin-bottom: 15px;
  }
  .left-font {
    color: white;
    font-size: 2vw;
    font-family: '微软雅黑';
  }
  .right-font {
    color: white;
    font-size: 2vw;
    font-family: '微软雅黑';
  }

  .gutter {
    margin-right: 30px;
  }
  .left-box {
    display: flex;
    flex: 1;
    box-sizing: border-box;
    height: 100%;
  }
  .task {
    flex: 1;
    background-color: #59b9e2;
    height: inherit;
  }
  .task .img-box > img {
    width: 100px;
    height: 97px;
  }
  .plan {
    flex: 1;
    background-color: #21bdcc;
    height: inherit;
  }
  .pan .img-box > img {
    width: 91px;
    height: 89px;
  }
  .right-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
  }
  .right-top-wh {
    flex:　1;
    height: 100%;
    box-sizing: border-box;
  }
  .right-box-top {
    flex: 1;
    margin-bottom: 30px;
  }
  .right-box-bottom {
    flex: 1;
  }
  .aircraft {
    flex: 1;
    background-color: #f49133;
  }
  .aircraft .img-box-right > img {
    width: 76px;
    height: 62px;
  }
  .airpilot {
    flex: 1;
    background-color: #9081c4;
  }
  .airpilot .img-box-right > img {
    width: 91px;
    height: 63px;
  }
  .userinfo {
    flex: 1;
    height: 100%;
    background-color: #67ce9f;
  }
  .userinfo .img-box-right {
    margin-bottom: 5px;
  }
  .userinfo .img-box-right > img {
    width: 85px;
    height: 85px;
  }
</style>
