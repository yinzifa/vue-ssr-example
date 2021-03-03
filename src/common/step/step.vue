<template>
  <div class="step flex-center">
    <div v-for="(item,index) in stepArr" :key="item"
         class="step-item flex-center"
         :class="{'success': active > index+1, 'active': active === index+1, 'wait' : active < index+1}">
      <div class="flex-center step-item-row">
        <img v-if="active > index+1" src="../../../static/images/success.png">
        <div v-if="active <= index+1" class="icon-div flex-center">
          {{index+1}}
        </div>
        <div>{{item}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      stepArr: {
        type: Array,
        required: true,
        default: function() {
          return ['步骤一', '步骤二']
        }
      },
      active: {
        type: Number,
        required: true,
        default: 1
      }
    },
    data() {
      return {
        activeIndex: 0
      }
    }
  }
</script>
<style scoped>
  .flex-center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .step {
    background: #fff;
    border-radius: 5px;
    min-width: 1050px;
    margin-bottom: 20px;
    height: 50px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .step-item {
    height: 100%;
    flex: 1;
    border-right: 1px solid #d2d2d2;
    font-size: 14px;
  }
  .step > .step-item:last-child {
    border-right-width: 0;
  }
  .step-item-row {
    width: 100%;
    height: 100%;
  }
  .step-item-row > img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
    box-sizing: border-box;
  }
  .icon-div {
    width: 25px;
    height: 25px;
    margin-right: 10px;
    border-radius: 50%;
    box-sizing: border-box;
  }
  /* 成功 */
  .success .step-item-row {
    background-color: white;
    color: #59b9e2;
  }
  .success .icon-div {
    background-color: white;
  }
  /* 当前 */
  .active .step-item-row {
    background-color: #59b9e2;
    color: white;
  }
  .active  .icon-div{
    background-color: white;
    color: #59b9e2;
  }
  /* 等待 */
  .wait .step-item-row {
    color: black;
    background-color: white;
  }
  .wait .icon-div {
    background-color: #c2c2c2;
  }
</style>
