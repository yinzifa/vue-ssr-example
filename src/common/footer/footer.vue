<template>
  <div class="footer-container">
    <div>
      <span class="footer-container-copyright" >Copyright 2011-2018 翔晟航空科技（北京）有限公司 版权所有</span>
      <span style="border-left: 1px solid #ccc;padding: 0 15px">备案号：京ICP备18012208号-1</span>
      <span class="footer-container-tel"><i class="el-icon-service"></i> 客服电话 : 400 650 0065</span>
      <span><img src="../../../static/images/QQ.png"  class="footer-container-icon" >客服QQ : 2438908746</span>
    </div>
  </div>
</template>
<script>
  export default {}
</script>
<style scoped>
  .footer-container {
    text-align: center;
    position: absolute;
    left: 200px;
    right: 0;
    bottom: 0;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    color: #8b8b8b;
    background-color: #e8edee;
    border-top: 1px solid #c2c2c2;
    z-index: 1999;
  }
  .footer-container-copyright{
    margin-right: 10px;
  }
  .footer-container-tel{
    margin-right: 10px;
  }
  .footer-container-icon{
    width: 15px;
    position: relative;
    top: 2px;
    right: 3px;
  }
</style>

