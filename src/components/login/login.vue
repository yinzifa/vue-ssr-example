<template>
  <div class="login-container">
    <div class="top-box">
      <div class="logo-box" >
        <img src="../../../static/images/logo_test.png" class="logoImg" width="43px" height="30px">
        <span class="text">通航运营系统</span>
      </div>
      <!--登录-->
      <el-form label-position="right" label-width="0"
               :model="form" ref="ruleForm" :rules="rules">
        <span class="title">用户登录</span>
        <el-form-item  prop="name">
          <img src="../../../static/images/icon-admin.png" class="icon name" style="width: 18px;top: 15px;">
          <el-input v-model.trim="form.name" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <img src="../../../static/images/password.png" alt="" class="icon" width="17px">
          <el-input v-model.trim="form.password" type="password" clearable placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="code" style="margin-bottom: 7px;">
          <img src="../../../static/images/code.png" alt="" class="icon" width="16px">
          <el-input @keyup.enter.native="onClickLogin" v-model.trim="form.code" clearable placeholder="请输入图片验证码"></el-input>
          <img :src="imgSrc" alt="" class="auth_code" @click="asyncGetImgCode">
        </el-form-item>
        <div class="check-box">
          <el-checkbox v-model="checked" style="z-index: 11;visibility: hidden;" class="remember">记住账号</el-checkbox>
        </div>
        <div class="error-info" v-show="errorText">
          <i class="el-icon-warning"></i><span>{{errorText}}</span>
        </div>
        <div class="btn-box">
          <a href="javascript:void(0)" class="btn login-btn" @click="onClickLogin">登 录</a>
        </div>
      </el-form>
    </div>
    <div class="bottom-box">
      <div style="margin: 20px 0 5px">
        <span style="position: relative;left: -28px">
          <i class="el-icon-service"></i> 客服电话 : 400 650 0065</span>
        <span style="position: relative;right: -28px">
          <img src="../../../static/images/QQ.png" alt=""
               style="position: relative;top: 2px;" width="14px">
          客服QQ : 2438908746</span>
      </div>
      <div>
        <span>Copyright 2011-2018 翔晟航空科技（北京）有限公司 版权所有</span>
        <span style="border-left: 1px solid #ccc;padding: 0 10px;margin-left: 5px">备案号：京ICP备18012208号-1</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Axios from "static/js/request"
  import md5 from "md5"
  export default {
    data() {
      return {
        surePhone:'',
        isDisabled:false,
        buttonName: "获取验证码",
        time: 60,
        form: {
          name: "",
          password: "",
          code: ""
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入图片验证码', trigger: 'blur'}
          ]
        },
        imgSrc: '',
        imgSrcKey: "",
        errorText: "",
        checked: false,
        timer: null
      }
    },
    created() {
      this.asyncGetImgCode();
    },
    methods: {
      //获取图形验证码
      asyncGetImgCode() {
        Axios.asyncRequest("get", "/backstage/authCode", {}, {
        }).then(data => {
          this.imgSrc = 'data:image/jpeg;base64,' + data.authCode;
          this.imgSrcKey = data.authCodeKey;
          if (this.timer) clearInterval(this.timer);
          this.timer = setInterval(this.asyncGetImgCode, 60000)
        })
      },
      //点击--登录
      onClickLogin() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.asyncLogin().then(res => {
              if (this.timer) clearInterval(this.timer);
              this.asyncGetPowerList();
            }).catch((error) => {
              this.errorText = " " + error;
              this.asyncGetImgCode();
            });
          }
        })
      },
      //登录
      asyncLogin() {
        return new Promise((resolve, reject) => {
          Axios.asyncRequest("post", "/backstage/login", { authCodeKey:this.imgSrcKey}, {
            userName: this.form.name,
            authCode: this.form.code,
            password: md5(this.form.password)
          }).then((data) => {
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        })
      },
      //获取菜单权限
      asyncGetPowerList() {
        Axios.asyncRequest("get", "/backstage/getPowerList", {}, {}
        ).then(data => {
          sessionStorage.setItem("menuList", JSON.stringify(data));
          this.$router.push('/index');
        }).catch((error) => {
          this.errorText = " " + error;
        });
      }
    }
  }
</script>
<style scoped lang="stylus" type="text/stylus">
  .login-container
    width: 100%
    height: 100%
    .top-box
      position: relative
      height: 100%
      padding: 32px 0 0 30px
      background: url("../../../static/images/login_bg_new.jpg") no-repeat top center
      .logo-box
        .logoImg
          position: relative
          top: 6px
        .text
          color: #fff
          font-size: 26px
          font-weight: bold
      .el-form
        width: 449px
        height: 439px
        background-color:#f9f9f9
        position: absolute
        right: 10%
        top: 12%
        padding: 32px 64px 65px
        box-sizing: border-box
        border-radius: 6px
        .el-form-item
          .icon
            position:absolute
            top: 15px
            left: 13px
            z-index: 1
            &.name
              top: 18px
          .auth_code
            position: absolute
            top: 1px
            right: 1px
            height: 48px
            width: 80px
            cursor: pointer
            border-radius: 0 8px 8px 0
        .title
          font-size: 18px
          color: #59B9E2
          display: block
          text-align: center
          margin-bottom: 25px
        .forget-password
          color: #59b9e2
          font-size: 14px
          display: block
          right:0
          position: absolute
          top: 3px
          cursor: pointer
        .check-box
          position:relative
          margin:10px 0 16px 0
          .remember
            color: #59b9e2
        .error-info
          color: #f0474c
          margin-bottom:3px
        .btn-box
          position: relative
          height: 50px
          margin-bottom: 10px
          .btn
            display: inline-block
            height: inherit
            line-height: 50px
            border-radius: 4px
            text-align: center
            cursor: pointer
          .register-btn
            position: absolute
            left: 230px
            width: 90px
            height: 48px
            border: 1px solid #59b9e2
            color: #59b9e2
          .login-btn
            position: absolute
            left: 0
            width: 100%
            color: #fff
            letter-spacing: 2px
            background-color: #59b9e2
            font-weight: bold
          .next-btns
            width:150px
            background:#C2C2C2
            &.active
              background:#59b9e2
          .cancle-btns
            width:140px
            left: 180px
    .bottom-box
      padding-bottom 20px
      position: absolute
      left 0
      bottom: 0
      width: 100%
      text-align: center
      color: #8b8b8b
      font-size: 14px
</style>
<style>
  .login-container .el-input .el-input__inner {
    height: 50px;
    padding-left: 40px;
  }
  .login-container .el-input .el-input__inner:focus {
    border-color: #59b9e2;
  }
  .login-container .el-checkbox {
    top:5px;
  }
</style>
