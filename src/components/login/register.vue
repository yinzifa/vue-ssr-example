<template>
  <div class="register-container">
    <h3 class="container-title">注册信息</h3>
    <div class="register-container-form">
      <el-form :model="ruleForm" :rules="rules" id="register-container-forms" ref="ruleForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名 : " prop="name" id="register_name" style="margin-bottom: 80px;">
          <el-input v-model="ruleForm.name" style="display: block;" @blur="blurCheck" placeholder="请输入用户名"></el-input>
          <span
            style="position: absolute;top: 57px;">作为企业管理员登录账号使用,设置后不可修改<br>用户名支持中英文、数字和下划线,且不能为纯数字,最多7个汉字或14个字符</span>

        </el-form-item>
        <el-form-item prop="pwd" label="密码 : " id="register_pdw" style="margin-bottom: 50px;">
          <el-input :maxlength=20 type="password" v-model="ruleForm.pwd" style="display: block;"
                    placeholder="请输入密码"></el-input>
          <span style="position: absolute;top: 58px;">字母、数字或者英文符号,6-20位,区分大小写</span>
        </el-form-item>
        <el-form-item prop="surePwd" label="确认密码 : ">
          <el-input :maxlength=20 type="password" v-model="ruleForm.surePwd" placeholder="请再次输入密码"></el-input>
        </el-form-item>

        <el-form-item prop="phoneNum" label="手机号 : " style="margin-top: 100px;">
          <el-input v-model.number="ruleForm.phoneNum" :maxlength=11 placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码 : ">
          <el-input v-model="ruleForm.code" placeholder="请输入验证码" :maxlength=6></el-input>
          <img :src="imgSrc" class="auth_code" @click="asyncGetImgCode">
        </el-form-item>
        <el-form-item prop="phoneCode" label="手机验证码 : ">
          <el-input v-model.number="ruleForm.phoneCode" :maxlength=6 placeholder="请输入手机验证码"
                    style="width: 230px;"></el-input>
          <el-button type="info" class="btns" @click="getCode('ruleForm')" :disabled="isDisabled">{{buttonName}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="registerBtn" @click="registerForm('ruleForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="register-borders"></div>
  </div>
</template>

<script>
  import Axios from "static/js/request"
  import tool from "static/js/tool"
  import md5 from "md5"
  export default {
    data() {
      var checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号码'))
        } else if (!tool.isvalidPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      };
      return {
        isDisabled:false,
        buttonName: "获取验证码",
        time: 60,
        ruleForm: {
          name: '',
          code: '',
          phoneCode: '',
          phoneNum: '',
          pwd: '',
          surePwd: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 14, message: '请输入正确格式名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '请输入字母、数字或者英文符号，6-20位，区分大小写', trigger: 'blur'}
          ],
          surePwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '请输入字母、数字或者英文符号，6-20位，区分大小写', trigger: 'blur'},
            {validator: checkPwd, trigger: 'blur'}
          ],
          phoneCode: [
            {required: true, message: '请输入手机验证码', trigger: 'blur'}
          ],
          phoneNum: [
            {required: true, message: '手机号不能为空'},
            {type: 'number', message: '手机号必须为数字'},
            {validator: validPhone, trigger: 'blur'}
          ]
        },
        imgSrc: '',
        imgSrcKey: ''
      }
    },
    methods: {
      registerForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios({
              method:"POST",
              url:'/user/saveCompanyUser',
              data:{
                loginName: this.ruleForm.name,
                pwd: md5(this.ruleForm.surePwd),
                mobile: this.ruleForm.phoneNum,
                smsCode: this.ruleForm.phoneCode
              }
            }).then((res) => {
              if (res.data.code === 200) {
                this.$router.push({
                  path:'/certification',
                  query: {
                    type: 1
                  }
                });
              } else {
                this.$message(res.data.msg);
              }
            });
          }
        });
      },
      //获取图形验证码
      asyncGetImgCode() {
        Axios.asyncRequest("get", "/declaring/authCode", {}, {}).then(data => {
          this.imgSrc = data.authCode;
          this.imgSrcKey = data.authCodeKey;
        })
      },
      getCode(formName){
        //获取短信验证码
        this.$refs[formName].validateField('phoneNum', (valid) => {
          if (!valid) {
            this.$refs[formName].validateField('code', (valid) => {
              if (!valid) {
                //发送手机验证码
                if (tool.isvalidPhone(this.ruleForm.phoneNum)) {
                  this.$axios.get("/user/checkMobile", {
                    params: {
                      mobile: this.ruleForm.phoneNum,
                      type: 1
                    }
                  })
                    .then(data => {
                      if (!this.isDisabled) {
                        if (data.data.code === 200117) {
                          this.$confirm(data.data.msg, '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning',
                            center: true
                          }).then(() => {
                            this.sendPhoneCode();
                          });
                        } else  if (data.data.code === 200126) {
                          this.sendPhoneCode();
                        }else {
                          this.$message({
                            type: 'error',
                            message: data.data.msg,
                            duration: 1200
                          })
                        }
                      }
                    })
                }
              }
            })
          }
        });
      },
      sendMsg(code,phone) {
        this.$axios.get("/user/sendSmsCode", {
          params: {
            authCode: code,
            mobile: phone,
            smsCodeType:"01"
          },
          headers: {
            authCodeKey: this.imgSrcKey
          }
        }).then(data => {

        })
      },
      //发送手机短信验证码 倒计时
      sendPhoneCode() {
        this.isDisabled = true;
        let interval = window.setInterval(()=> {
          this.buttonName = '重新发送('+this.time+'s)';
          --this.time;
          if(this.time < 0) {
            this.buttonName = "重新发送";
            this.time = 60;
            this.isDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
        this.sendMsg(this.ruleForm.code,this.ruleForm.phoneNum);
      },
      //失去焦点 校验用户名
      blurCheck(){
        if (this.ruleForm.name) {
          this.$axios.get('/user/checkLoginName', {
            params: {
              loginName: this.ruleForm.name
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '用户名可以使用',
                duration: 1000
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg,
                duration: 1200
              })
            }
          });
        }
      }
    },
    created() {
      this.asyncGetImgCode();
    }
  }
</script>

<style scoped>
  .container-title {
    margin: 0 0 30px 80px;
  }

  .register-container {
    padding-top: 30px;
    background: #fff;
    border-radius: 8px;
    margin: 0 auto;
    height: 100%;
    overflow: auto;
    position: relative;
  }

  .register-borders {
    position: absolute;
    border-bottom: 1px dashed #ccc;
    height: 1px;
    top: 380px;
    width: 1050px;
    margin-left: -525px;
    left: 50%;
  }

  .register-container-form {
    width: 600px;
    margin: 0 auto;
  }

  .el-form-item .el-form-item__content .el-input {
    width: 338px;
  }

  span {
    color: #C1C1C1;
  }

  .el-form-item .icon {
    position: absolute;
    top: 15px;
    left: 13px;
    z-index: 1;
  }

  .el-form-item .icon {
    top: 18px;
  }

  .auth_code {
    position: absolute;
    top: 1px;
    right: 163px;
    height: 38px;
    width: 80px;
    cursor: pointer;
    border-radius: 0 8px 8px 0;
  }

  .btns {
    margin-left: 8px;
    width: 100px;
    padding: 12px 8px;
    border-radius: 7px;
  }

  .registerBtn {
    width: 340px;
    background: #59b9e2;
    margin: 10px 0 30px 0;
  }

</style>
<style>
  #register_name .el-form-item__content, #register_pdw .el-form-item__content {
    line-height: 22px !important;
  }

  #register-container-forms label {
    color: #838383;
    font-weight: bold;
  }
</style>
