<template>
  <div class="header-container">
    <div class="left-box">
      <img src="../../../static/images/logo_test_small.png" class="logo-img" alt="">
      <span class="titles-msg">通航运营系统</span>
    </div>
    <div class="right-box">
      <div class="notice-box" @click="jumpToApplyTask">
        <span> 待审任务 <span class="bradge" >{{task_remark_num ? this.$store.state.task_remark_num : 0}}</span></span>
      </div>
      <span class="download-specification">
           <div class="specification-box" @click="jumpToPrivateLetter">
              <span> <img src="../../../static/images/icon-letter.png" alt=""> <!--<span class="letter-bradge" v-show="letterNum>0"></span>-->
                <span class="letter-text">私信</span>
              </span>
          </div>
      </span>
      <div class="user-info-box">
        <img src="../../../static/images/admin.png" alt="" width="40">
        <el-dropdown>
              <span class="el-dropdown-link" >
                {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout"><span>退出</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
  import tool from "static/js/tool"
  export default {
    data() {
      return {
        userType: "",
        isVerifed: "",
        userName: "",
        task_remark_num: 0,
        plan_remark_num: 0,
        timer: null,
        letterNum: 0,
        letterFlag: 0
      }
    },
    created() {
      this.asyncGetRemarkNum();
      this.asyncAviationCompanyInfo();
      this.timer = setInterval(this.asyncGetRemarkNum, 120000);
    },
    methods: {
      //跳转至任务列表
      jumpToApplyTask() {
        this.$router.push({
          path: "/applyTask",
          query: {
            isVerified: '3'
          }
        })
      },
      //点击私信--跳转私信页
      jumpToPrivateLetter () {
        this.letterFlag++;
        this.letterNum = 0;
        location.href = `/#/privateLetterManage?letterFlag=${this.letterFlag}`;
      },
      //退出
      logout() {
        this.$axios.get("/backstage/logout").then(res => {
          if (res.data.code === 200) {
            this.$router.push({
              path: "/login"
            })
          }
        })
      },
      //获取待审任务, 待审计划等
      asyncGetRemarkNum() {
        this.$axios.get("/flighttask/indexCount").then(res => {
          if(res.data.code === 200) {
            this.task_remark_num = res.data.data.taskCount;
            this.plan_remark_num = res.data.data.planCount;
            this.$store.commit('setLeftNumber', {
              task_remark_num: this.task_remark_num,
              plan_remark_num: this.plan_remark_num
            });
          }
        })
      },
      //获取用户名、是否认证、用户类型等
      asyncAviationCompanyInfo() {
        this.$axios.get("/flighttask/getAviationCompanyInfo").then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            if (data.userType === 1) {
              this.userType = "个人";
            } else if (data.userType === 2) {
              this.userType = "企业";
            }
            if (data.isVerifed === 1) {
              this.isVerifed = "已认证";
            } else if (data.isVerifed === 2) {
              this.isVerifed = "未认证";
            }
            this.userName = data.userName;
          }
        })
      }
    },
    beforeDestroy() {
      if(this.timer) clearInterval(this.timer)
    },
    watch: {
      $route(to) {
        this.asyncAviationCompanyInfo()
      }
    },
    computed: {
      btnBg() {
        if (this.form.oldPwd && this.form.password && this.form.passwordBak) return true;
      },
      actives() {
        if (this.ruleForm.phoneCode && this.ruleForm.code && (this.ruleForm.phoneNum || this.ruleForm.newPhoneNum)) return true;
      }
    }
  }
</script>
<style scoped>
  .header-container {
    width: 100%;
    height: 80px;
    background-color: #fff;
  }

  .left-box {
    width: 200px;
    height: 80px;
    line-height: 81px;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    background-color: #3E4B54;
    letter-spacing: 1px;
  }

  .logo-img {
    position: relative;
    top: 5px;
    width: 36px;
    left: 15px;
    margin-right: 15px;
  }

  .right-box {
    height: inherit;
    position: absolute;
    top: 0;
    left: 200px;
    right: 0;
    padding: 16px 40px;
  }

  .notice-box {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .specification-box{
    display: inline-block;
    cursor: pointer;
  }
  .bradge {
    display: inline-block;
    width: 30px;
    text-align: center;
    background-color: red;
    color: rgb(255, 255, 255);
    height: 34px;
    line-height: 34px;
    border-radius: 2px;
    margin-left: 3px;
    cursor: pointer;
  }
  .letter-bradge {
    width: 8px;
    height: 8px;
    position:absolute;
    left: 15px;
    top: 9px;
    background-color: #F44739;
    border-radius: 50%;
    cursor: pointer;
  }
 .download-specification {
    position: absolute;
    right: 210px;
    top: 28px;
    font-size: 14px;
    cursor: pointer;
  }
  .download-specification a {
    color: #606266;
  }
  .download-specification img {
    vertical-align: middle;
  }
  .user-info-box {
    display: inline-block;
    position: absolute;
    right: 50px;
  }

  .user-info-box .el-dropdown {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 14px;
    top: -16px;
  }

  .certification-info {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 14px;
    top: -16px;
  }

  .el-dropdown-link ,.certification-info{
    cursor: pointer;
  }

  .formWidth {
    width: 380px;
    margin: 0 auto;
  }

  .dialog-footer {
    text-align: center;
    margin: -20px 0 20px 70px;
  }

  .btn {
    width: 120px;
    border-radius: 6px;
    font-size: 14px;
  }

  .btnColor {
    background: #C2C2C2;
    border: none;
  }

  .active {
    background: #59b9e2;
  }

  .el-form-item .el-form-item__label {
    font-size: 14px;
    color: #555555;
    font-weight: bolder;
  }

  .titleMsg {
    display: flex;
    height: 50px;
    margin-bottom: 26px;
    text-align: center;
    line-height: 50px;
    border-radius: 5px;
    border: 1px solid #59b9e2;
    overflow: hidden;
    font-size: 16px;
  }

  .titleMsg .titleMsg-step {
    flex: 1;
    font-weight: bold
  }

  .titleMsg .titleMsg-step span {
    border-radius: 50%;
    background: #D8D6D6;
    width: 32px;
    height: 32px;
    display: inline-block;
    position: relative;
    line-height: 32px;
    left: -8px;
    color: #545454;
  }

  .titleMsg-step.activeBg {
    background: #59b9e2;
    color: #fff;
  }

  .titleMsg-step.activeBg span {
    border-radius: 50%;
    background: #fff;
    color: #59b9e2;
  }

  .titleMsg-step .step-text {
    color: #59b9e2;
  }

  .btn-box {
    position: relative;
    height: 40px;
    margin: 40px 0 15px 0;
    text-align: center;
  }

  .btn-box .btn {
    display: inline-block;
    height: inherit;
    line-height: 40px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    margin: 0 10px;
  }

  .btn-box .register-btn {
    width: 90px;
    height: 40px;
    border: 1px solid #59b9e2;
    color: #59b9e2;
  }

  .login-btn {
    width: 222px;
    color: #fff;
    letter-spacing: 2px;
    background-color: #59b9e2;
    font-weight: bold;
  }

  .next-btns {
    width: 100px;
    background: #C2C2C2;
  }

  .next-btns.active {
    background: #59b9e2;
  }

  .cancle-btns {
    width: 140px;
  }

  .auth_code {
    position: absolute;
    top: 1px;
    right: 96px;
    height: 38px;
    width: 80px;
    cursor: pointer;
    border-radius: 0 8px 8px 0;
  }

  .formWidthBox {
    width: 480px;
    margin: 0 auto;
  }
  .titles-msg{
    color:#59b9e2;
    font-weight: bold;
  }
  .letter-text {
    position: relative;
    left:5px;
    top: 1px;
  }
</style>
<style>
  .formWidth .el-form-item .el-input .el-input__inner {
    border-radius: 8px;
  }

  .formWidth .el-form-item .el-form-item__label {
    font-size: 14px;
    color: #555555;
    font-weight: bolder;
  }
</style>
