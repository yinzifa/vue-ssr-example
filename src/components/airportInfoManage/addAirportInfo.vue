<template>
  <div class="airport_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/airportManage' }">机场信息</el-breadcrumb-item>
      <el-breadcrumb-item v-text="title"></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="airport_container-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="机场名称：" prop="name" label-width="155px">
              <el-input v-model="ruleForm.name" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场代码：" label-width="155px">
              <el-input v-model="ruleForm.code" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="简称：" prop="shortName" label-width="155px">
              <el-input v-model="ruleForm.shortName" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场所属管理局：" label-width="155px">
              <el-input v-model="ruleForm.administration" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="经度：" label-width="155px">
              <el-input v-model="ruleForm.lngPoint.degree" class="flex-center-style" placeholder="请输入度" :disabled="disabled"></el-input><span class="iconCompany">°</span>
              <el-input v-model="ruleForm.lngPoint.minute" class="flex-center-style" placeholder="请输入分" :disabled="disabled"></el-input><span class="iconCompany">′</span>
              <el-input v-model="ruleForm.lngPoint.sec" class="flex-center-style" placeholder="请输入秒" :disabled="disabled"></el-input><span class="iconCompany">″</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场联系电话：" label-width="155px">
              <el-input v-model="ruleForm.telephone" :maxlength="11" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="纬度：" label-width="155px">
              <el-input v-model="ruleForm.latPoint.degree" class="flex-center-style" placeholder="请输入度" :disabled="disabled"></el-input><span class="iconCompany">°</span>
              <el-input v-model="ruleForm.latPoint.minute" class="flex-center-style" placeholder="请输入分" :disabled="disabled"></el-input><span class="iconCompany">′</span>
              <el-input v-model="ruleForm.latPoint.sec" class="flex-center-style" placeholder="请输入秒" :disabled="disabled"></el-input><span class="iconCompany">″</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场地址：" label-width="155px">
              <el-input v-model="ruleForm.address" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">

            <el-form-item label="机场类型：" label-width="155px" prop="type">
              <el-select v-model="ruleForm.type"
                         :disabled="disabled"
                         filterable >
                <el-option
                  v-for="item in airPortListArr"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场可起降机型：" label-width="155px">
              <el-input v-model="ruleForm.aerocraftModelIds" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="机场产权：" label-width="155px">
              <el-select v-model="ruleForm.propertyRight" :disabled="disabled">
                <el-option
                  v-for="item in airportPropertyRight"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场开放时间：" label-width="155px">
              <el-radio class="radio" v-model="ruleForm.openType" :disabled="disabled" label="1">日航</el-radio>
              <el-radio class="radio" v-model="ruleForm.openType" :disabled="disabled" label="2">夜航</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="直升机机场跑道直径：" class="setWidth" label-width="155px">
              <el-input v-model.number="ruleForm.runwayDiameter" :disabled="disabled"></el-input>
            </el-form-item>
            <span class="meter">米</span>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="机场跑道长度：" class="setWidth" label-width="155px">
              <el-input v-model.number="ruleForm.runwayLength" :disabled="disabled"></el-input>
            </el-form-item>
            <span class="meter">米</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
            <el-form-item label="备注：" label-width="155px">
              <el-input type="textarea" :rows="3" :maxlength="200"
                        v-model="ruleForm.airportRemark" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="btns-box">
      <el-button class="query" type="primary" @click="asyncPostSaveNewAirportInfo" v-if="!actionType">保存</el-button>
      <el-button class="second-btn" @click="jumpToAirportInfoManage">返回</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      let checkTel = (rule, value, callback) => {
        if (!Number.isInteger(parseInt(value))) {
          callback(new Error('请输入正确的格式'));
        } else {
          callback()
        }
      };
      return {
        id: "",
        title: "",
        disabled: false,
        actionType: '',
        airportPropertyRight: [
          {
            id: '1',
            name: '私有'
          },
          {
            id: '2',
            name: '公共'
          }
        ],
        airPortListArr: [
          {
            id: '1',
            name: '民航机场'
          },
          {
            id: '2',
            name: '通航机场'
          },
          {
            id: '3',
            name: '混合机场'
          },
          {
            id: '13',
            name: '农用机场'
          }
        ],
        ruleForm: {
          name: '',
          type: '',
          code: '',
          address: '',
          openType: '',
          propertyRight: '',
          telephone: '',
          administration: '',
          runwayLength: '',
          shortName: '', // 简称
          lngPoint: {
            degree: '', // 度
            minute: '', // 分
            sec: '' // 秒
          }, // 经度
          latPoint: {
            degree: '', // 度
            minute: '', // 分
            sec: '' // 秒
          }, // 纬度
          runwayDiameter: '',
          aerocraftModelIds: '',
          airportRemark: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入机场名称', trigger: 'blur'}
          ],
          shortName: [
            {required: true, message: '请输入机场简称', trigger: 'blur'}
          ],
          type: [
            { required: true, message: '请选择机场类型', trigger: 'change' }
          ],
        },
        queryParams: {}, //列表页查询参数
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.airportName;
      this.actionType = this.$route.query.actionType;
      if (this.id && this.actionType) {
        this.title = '查看';
        this.disabled = true;
        this.asyncGetAirportInfo(this.id);
      } else if (this.id) {
        this.title = '编辑';
        this.asyncGetAirportInfo(this.id);
      } else {
        this.title = '添加';
      }
      // document.querySelector(".M_content").scrollTop = 0;
    },
    methods: {
      //获取机场信息
      asyncGetAirportInfo(id) {
        this.$axios.get("/airport/getAirportModelById?id=" + id).then(res => {
          if (res.data.code === 200) {
            this.ruleForm = res.data.data;
            this.ruleForm.openType = this.ruleForm.openType ? this.ruleForm.openType.toString() : '';
            this.ruleForm.type = this.ruleForm.type ? this.ruleForm.type.toString() : '';
          }
        })
      },
      //点击--返回
      jumpToAirportInfoManage() {
        this.$router.push({
          path: '/airportManage',
          query: this.queryParams
        })
      },
      //点击--保存
      asyncPostSaveNewAirportInfo() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if(!this.checkSmallNumber()) return;
            if (isNaN(this.ruleForm.runwayDiameter)) {
              this.$message.error('直升机机场跑道直径格式有误,请输入数字类型')
            } else if (isNaN(this.ruleForm.runwayLength)) {
              this.$message.error('机场跑道长度,请输入数字类型')
            } else {
              let _url = this.id ? 'airport/modifyAirport' : '/airport/saveAirport';
              this.$axios.post(_url,
                this.ruleForm
              ).then((res) => {
                if (res.data.code === 200) {
                  this.jumpToAirportInfoManage();
                } else if (res.data.code === 301007) {   //此处是为后台特殊处理的
                  this.$confirm(res.data.msg, '保存成功', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    showClose: false,
                    type: 'success',
                    center: true,
                    customClass: 'confirm-box airport-box',
                  }).then(() => {
                    this.jumpToAirportInfoManage();
                  })
                }
                else {
                  this.$message.error(res.data.msg);
                }
              })
            }
          }
        });
      },
      //度分秒校验
      checkSmallNumber() {
        let flag = true;
        if (isNaN(this.ruleForm.lngPoint.degree)) {
          flag = false;
          this.$message.error('请输入正确的经度格式');
          return;
        } else if (this.ruleForm.lngPoint.degree > 180 || this.ruleForm.lngPoint.degree < 0) {
          flag = false;
          this.$message.error('坐标需要在纬度0-90，经度0-180范围内');
          return;
        } else if (this.ruleForm.lngPoint.minute >= 60 || this.ruleForm.lngPoint.minute < 0) {
          flag = false;
          this.$message.error('坐标的分和秒需要小于60');
          return;
        } else if (isNaN(this.ruleForm.lngPoint.minute)) {
          flag = false;
          this.$message.error('请输入正确的经度分值格式');
          return;
        } else if (this.ruleForm.lngPoint.sec >= 60 || this.ruleForm.lngPoint.sec < 0) {
          flag = false;
          this.$message.error('坐标的分和秒需要小于60');
          return;
        } else if (isNaN(this.ruleForm.lngPoint.sec)) {
          flag = false;
          this.$message.error('请输入正确的经度秒值格式');
          return;
        } else if (isNaN(this.ruleForm.latPoint.degree)) {
          flag = false;
          this.$message.error('请输入正确的纬度格式');
          return;
        } else if (this.ruleForm.latPoint.degree > 90 || this.ruleForm.latPoint.degree < 0) {
          flag = false;
          this.$message.error('坐标需要在纬度0-90，经度0-180范围内');
          return;
        } else if (this.ruleForm.latPoint.minute >= 60 || this.ruleForm.latPoint.minute < 0) {
          flag = false;
          this.$message.error('坐标的分和秒需要小于60');
          return;
        } else if (isNaN(this.ruleForm.latPoint.minute)) {
          flag = false;
          this.$message.error('请输入正确的纬度分值格式');
          return;
        } else if (this.ruleForm.latPoint.sec >= 60 || this.ruleForm.latPoint.sec < 0) {
          flag = false;
          this.$message.error('坐标的分和秒需要小于60');
          return;
        } else if (isNaN(this.ruleForm.latPoint.sec)) {
          flag = false;
          this.$message.error('请输入正确的纬度秒值格式');
          return;
        }

        if (this.ruleForm.lngPoint.degree === '' || this.ruleForm.latPoint.degree === '') {
          flag = false;
          this.$message.error('请完善经纬度填写');
          return;
        }

        return flag;
      },
    }
  }
</script>
<style scoped>
  .airport_container-box {
    min-width: 1050px;
    background-color: #fff;
    border-radius: 4px;
    padding: 35px 0;
    margin: 0 auto;
  }

  .btns-box {
    margin: 20px;
    text-align: center;
  }

  .btns-box .btns {
    width: 100px;
  }

  .btns:nth-of-type(2) {
    background: none;
  }

  .btns:nth-of-type(2):hover {
    color: #27C1E4;
  }

  .meter {
    padding-left: 18px;
    font-size: 14px;
    color: #6B6B6B;
  }

  .setWidth {
    width: 250px;
    display: inline-block;
  }
  .flex-center-style {
    width: 90px;
    margin: 0 3px;
  }
  .iconCompany{
    position: relative;
    top: -17px;
  }
</style>
<style>
  .confirm-box.airport-box .el-message-box__message p {
    color: red;
  }
</style>
