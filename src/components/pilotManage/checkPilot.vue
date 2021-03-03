<template>
  <div class="checkPilot-container" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/pilotManage">飞行员信息</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-text="title"></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="M-main-box-info">
      <div class="status">
        <div class="colorActiveW" v-if="isVerified === 4 ">
          <i class="el-icon-time"></i> 待审核
          <span v-show="remark">({{remark}})</span>
        </div>
        <div class="colorActiveS" v-else-if="isVerified === 1">
          <i class="el-icon-circle-check-outline"></i> 已通过
          <span v-show="remark">({{remark}})</span>
        </div>
        <div class="colorActiveNo" v-else-if="isVerified === 2">
          <i class="el-icon-error"></i> 未通过
          <span v-show="remark">({{remark}})</span>
        </div>
      </div>
      <div class="M-base-info-box">
        <h4 class="title" style="border-bottom: none;">基础信息</h4>
        <div class="con-box">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <div style="text-align: center;">
                <img :src="form.idNumberUrl"
                     alt="证件照片" width="167px" height="223px" v-if="form.idNumberUrl">
                <img src="../../../static/images/pilot.png" alt="证件照片" v-else>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-box-top">
                <el-form labelWidth="115px">
                  <el-form-item label="姓名 : ">
                    <span>{{form.name ? form.name : '--'}}</span>
                  </el-form-item>
                  <el-form-item label="国籍 : ">
                    {{form.nationality ? form.nationality : '--'}}
                  </el-form-item>
                  <el-form-item label="生日 : ">
                    {{form.birthday ? form.birthday : '--'}}
                  </el-form-item>
                  <el-form-item label="创建人 : ">
                    {{form.creator ? form.creator : '--'}}
                  </el-form-item>
                  <el-form-item label="审核时间 : ">
                    {{form.auditTime ? form.auditTime : '--'}}
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="info-box-top">
                <el-form labelWidth="105px">
                  <el-form-item label="性别 : ">
                    <span>{{form.sexName ? form.sexName : '--'}}</span>
                  </el-form-item>
                  <el-form-item label="身份证号 : ">
                    {{form.idNumber ? form.idNumber : '--'}}
                  </el-form-item>
                  <el-form-item label="飞行单位 : ">
                    {{form.generalAviationCompany ? form.generalAviationCompany : '--'}}
                  </el-form-item>
                  <el-form-item label="创建时间 : ">
                    {{form.createdTime ? form.createdTime : '--'}}
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="M-main-box-info M-fly-license-box">
      <div class="M-base-info-box" v-for="(item,index) in pilotLicenseModelList" :key="index">
        <h4 class="title">执照信息{{index + 1}}</h4>
        <div class="con-box con-box-card con-other-box">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <div style="text-align: center;">
                <img :src="item.licensePhoto"
                     alt="证件照片" width="260" height="190">
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-box-card">
                <el-form labelWidth="115px">
                  <el-form-item label="证件类型 : ">
                    <span>{{item.pilotLicenseTypeName}}</span>
                  </el-form-item>
                  <el-form-item label="签发日期 : ">
                    {{item.issuingDate}}
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="info-box-card">
                <el-form labelWidth="115px">
                  <el-form-item label="执照有效日期 : ">
                   <span v-if="item.expireType === 1">
                        {{item.expireDate}}
                   </span>
                   <span v-else>长期有效</span>
                  </el-form-item>
                  <el-form-item label="执照编号 : ">
                    {{item.licenseNumber}}
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="M-main-box-info M-fly-record-box"
         :class="[{'show-textarea': checkForm.status && flag}, {'unshow-textarea': !checkForm.status && flag}]">
      <div class="M-base-info-box">
        <h4 class="fly-record">飞行记录</h4>
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          class="fly-record-table checkTable"
          style="width: 100%">
          <el-table-column prop="planNumber" label="计划编号" align="center"></el-table-column>
          <el-table-column prop="name" label="计划名称" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer" class="planName"
                    @click="jumpToFlightFlan(scope.row.flightPlanId, scope.row.id)">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="flightTime" label="飞行日期" align="center"></el-table-column>
          <el-table-column prop="taskTypeName" label="任务性质" align="center"></el-table-column>
          <el-table-column prop="model" label="飞行设备" align="center"></el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="checkPilot-btn-box" v-if="!flag">
      <el-button class="export" type="primary" @click="jumpToPilotManage">返回</el-button>
    </div>
    <div class="fixed-box" v-if="flag">
      <el-form :model="checkForm" :rules="rules" ref="checkForm" label-width="100px">
        <el-form-item label="审批意见：" style="margin-bottom: 5px;">
          <el-radio v-model="checkForm.status" :label="1" @change="onChangeVak">通过</el-radio>
          <el-radio v-model="checkForm.status" :label="2" @change="onChangeVak">驳回</el-radio>
        </el-form-item>
        <el-form-item label="" prop="content" style="margin: 0 20px 20px 0;" v-show="showType">
          <el-input v-model="checkForm.content" :rows="3" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="showBtnBox" style="text-align: center;margin: 0 20px 20px;">
        <el-button class="query" type="primary" @click="onClickAuditPilot">审核</el-button>
        <el-button class="second-btn" @click="jumpToPilotManage">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        id: '',
        title: '查看',
        type: 0,
        flag: false,
        showType: false,
        showBtnBox: false,
        content: '',
        tableData: [],
        pilotLicenseModelList: [],
        form: {
          name: '',
          sexName: '',
          birthday: '',
          idNumber: '',
          creator: '',
          nationality: '',
          createdTime: '',
          auditTime: '',
          generalAviationCompany: '',
          idNumberUrl: ''
        },
        checkForm: {
          status: "",
          content: "",
        },
        rules: {
          content: [
            {required: true, message: '请输入驳回意见', trigger: 'blur'}
          ]
        },
        queryParams: {}, //列表页查询参数
        isVerified: '', //核验状态
        remark: '',
        loading: true
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
      if (this.type && this.type != 0) {
        this.flag = true;
        this.title = '核验';
      }
      this.asyncGetPilotInfo();
      this.asyncGetFlyRecordListData();
    },
    methods: {
      //跳转至列表页
      jumpToPilotManage() {
        this.$router.push({
          path: '/pilotManage',
          query: this.queryParams
        });
      },
      onChangeVak(val) {
        val === '1' ? this.showType = false : this.showType = true;
        this.showBtnBox = true;
      },
      //审核确认
      onClickAuditPilot() {
        if (this.checkForm.status == 2) {
          this.$refs['checkForm'].validate((valid) => {
            if (valid) {
              this.onClickAudiTing();
            }
          });
        } else {
          this.onClickAudiTing();
        }
      },
      //确定提交审核
      onClickAudiTing() {
        this.$axios.get('/pilot/auditBackPilot', {
          params: {
            ids: this.id,
            isVerified: this.checkForm.status, //审核状态  和意见 预留
            comment: this.checkForm.content
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            this.jumpToPilotManage();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取飞行员信息
      asyncGetPilotInfo() {
        this.$axios.get('/pilot/getBackPilotInfo?id=' + this.id)
          .then((res) => {
            if (res.data.code === 200) {
              let _data = res.data.data;
              this.isVerified = _data.isVerified;
              this.remark = _data.remark;
              this.form.name = _data.name;
              this.form.sexName = _data.sexName;
              this.form.birthday = _data.birthday;
              this.form.idNumber = _data.idNumber;
              this.form.createdTime = _data.createdTime;
              this.form.auditTime = _data.auditTime;
              this.form.creator = _data.creator;
              this.form.nationality = _data.nationality;
              this.form.generalAviationCompany = _data.generalAviationCompany;
              this.form.idNumberUrl = _data.idNumberUrl;
              if (_data.pilotLicenseModelList && _data.pilotLicenseModelList.length > 0) {
                this.pilotLicenseModelList = [];
                this.pilotLicenseModelList = this.pilotLicenseModelList.concat(_data.pilotLicenseModelList);
              }
            } else {
              this.$message.error(res.data.msg);
            }
            this.loading = false;
          })
      },
      //飞行记录
      asyncGetFlyRecordListData() {
        this.$axios.get('/pilot/getFlyRecordList', {
          params: {
            id: this.id,
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //当前页展示条数改变
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetFlyRecordListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetFlyRecordListData();
      },
      //点击跳转至计划详情页
      jumpToFlightFlan (id) {
        this.$router.push({
          path: '/applyPlan/check',
          query: {
            id: id,
            pilotId: id,
            from: 'pilot'
          }
        })
      }
    }
  }
</script>
<style scoped>
  .checkPilot-container {
    overflow: hidden;
    position: relative;
  }

  .M-main-box-info {
    background-color: #fff;
    border-radius: 5px;
    padding: 15px 20px 0;
    margin-bottom: 20px;
  }

  .M-base-info-box {
    min-width: 1050px;
    margin: 0 auto;
    max-width: 1200px;
  }

  .M-base-info-box .title {
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
  }

  .M-fly-record-box {
    padding-bottom: 20px;
  }

  .M-fly-record-box.unshow-textarea {
    margin-bottom: 80px;
  }

  .M-fly-record-box.show-textarea {
    margin-bottom: 240px;
  }

  .info-box-top {
    margin-top: 15px;
  }

  .info-box-card {
    margin-top: 55px;
  }

  .con-box {
    height: 260px;
    position: relative;
    margin-top: 20px;
  }

  .con-box-card {
    height: 220px;
  }

  .fly-record {
    margin-bottom: 40px;
  }

  .M-main-box-info .con-other-box:last-child {
    border: none;
  }

  .checkPilot-btn-box {
    width: 100%;
    margin: 20px 0 105px 0;
    text-align: center;
  }

  .fixed-box {
    position: fixed;
    padding: 5px 0 0;
    background: #fff;
    border-radius: 4px;
    border-top: 1px solid #d9d9d9;
    left: 200px;
    right: 10px;
    bottom: 50px;
    z-index: 10;
    box-shadow: 0 -2px 5px #ccc;

  }

  .planName:hover {
    color: #59b9e2;
  }

  .status {
    padding: 10px 0 10px;
    border-bottom: 1px dashed #ccc;
    max-width: 1200px;
    margin: 0 auto 20px;
  }
  .colorActiveNo {
    color: #F4483A;
  }

  .colorActiveS {
    color: #6CC29B;
  }

  .colorActiveW {
    color: #2c3e50;
  }

  .colorActiveNo, .colorActiveS, .colorActiveW {
    font-weight: bold;
  }
</style>
<style>
  .checkPilot-container .el-form-item {
    margin-bottom: 0;
  }

  .checkPilot-container .el-table.fly-record-table {
    bottom: 20px;
  }

  .checkPilot-container .M-main-box-info .el-form-item__label {
    font-size: 15px;
    color: #3e4a54;
    font-weight: 700;
  }
</style>
