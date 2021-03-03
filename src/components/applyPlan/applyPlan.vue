<template>
  <div class="applyPlan-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>飞行计划管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box query-box-flightPlan">
      <el-form :inline="true" :model="form" labelWidth="100px">
        <el-form-item label="任务性质：">
          <el-select v-model="form.taskTypeId" filterable  clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in taskTypeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="form.status" filterable clearable >
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="2"></el-option>
            <el-option label="已通过" value="3"></el-option>
            <el-option label="未通过" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机场计划状态：" class="el-form-item-plan">
          <el-select v-model="form.isVerified" filterable clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="机场审核通过" value="1"></el-option>
            <el-option label="机场审核未通过" value="2"></el-option>
            <el-option label="待机场审核" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="报批单位：">
          <el-select v-model="form.dataFieldId" filterable clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞行单位：">
          <el-select v-model="form.flightUnitId" filterable clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in declareDate" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划编码 : ">
          <el-input v-model="form.planNumber" placeholder="计划编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="飞行日期：" class="date-content">
          <el-date-picker
            class="startTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.startDateFly"
            type="date"
            style="width: 180px;"
            placeholder="开始日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            class="endTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.endDateFly"
            type="date"
            style="width: 160px;"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请日期：" class="date-content">
          <el-date-picker
            class="startTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.applyStartTimeApply"
            type="date"
            style="width: 180px;"
            placeholder="开始日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            class="endTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.applyEndTimeApply"
            type="date"
            style="width: 160px;"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button class="query" type="primary" @click="onClickQueryPlanList">查询</el-button>
          <el-button class="second-btn" @click="onClickResetPlanInfo">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <div class="exportBox">
          <el-select v-model="exportPlanInfo"  >
            <el-option label="当前筛选结果" value="1"></el-option>
            <el-option label="明日飞行计划" value="2"></el-option>
          </el-select>
        </div>
        <el-button class="query" type="primary" @click="exportFlyPlanList">导出</el-button>
      </div>
      <div class="table-container">
        <span class="table-checkbox-flag" v-if="showCheckboxFlag"><el-checkbox v-model="defaultChecked" disabled></el-checkbox></span>
        <el-table
          :data="tableData"
          border
          v-loading="loading"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column label="操作" fixed align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="jumpToCheckflyPlan(scope.row)" type="primary" plain size="small"> 查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="status" fixed label="审核状态" align="center" width="120">
            <template slot-scope="scope">
              <span v-show="scope.row.status === 2" :class="scope.row.expireStatus === 3 ? 'color-gray' : 'color-yellow'">待审核 <span v-show="scope.row.expireStatus === 3">(已过期)</span></span>
              <span v-show="scope.row.status === 3" :class="scope.row.expireStatus === 3 ? 'color-gray' : 'color-green'">
              <span>已通过</span>
              <img src="../../../static/images/icon-today.png" alt="" v-show="scope.row.expireStatus === 1">
              <img src="../../../static/images/icon-tomorrow.png" alt="" v-show="scope.row.expireStatus === 2">
              <span v-show="scope.row.expireStatus === 3">(已过期)</span>
            </span>
              <span v-show="scope.row.status === 4" class="color-red">未通过</span>
            </template>
          </el-table-column>
          <el-table-column  label="机场计划状态" align="center" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.isVerified === 1" class="color-green">机场审核通过</span>
              <span v-else-if="scope.row.isVerified === 2" class="color-red">机场审核未通过</span>
              <span v-else-if="scope.row.isVerified === 3" class="color-yellow" >待机场审核</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="planNumber" label="计划编号" align="center" width="200"></el-table-column>
          <el-table-column prop="companyName" label="飞行单位" align="center" width="200"></el-table-column>
          <el-table-column prop="taskTypeName" label="任务性质" align="center" width="200"></el-table-column>
          <el-table-column prop="approvalAuthorityName" label="报批单位" align="center" width="200"></el-table-column>
          <el-table-column prop="takeoffPointName" label="起降场" align="center" width="200"></el-table-column>

          <el-table-column prop="aerocraftInfo" label="机型/架数" align="center" width="100"></el-table-column>
          <el-table-column prop="scopeName" label="空域/航线" align="center" width="200"></el-table-column>
          <el-table-column prop="startDate" label="飞行日期" align="center" width="200"></el-table-column>

          <el-table-column label="开飞时间" align="center">
            <el-table-column prop="takeOffTime" label="计划" align="center" width="100"></el-table-column>
            <el-table-column label="实施" align="center" width="100">
              <template slot-scope="scope">
                <span class="defaultText">{{!scope.row.actualTakeoffTime ? '未填写' : scope.row.actualTakeoffTime}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="结束时间" align="center" width="500">
            <el-table-column prop="landingTime" label="计划" align="center" width="100"></el-table-column>
            <el-table-column prop="actualLandingTime" label="实施" align="center" width="100">
              <template slot-scope="scope">
                <span class="defaultText">{{!scope.row.actualLandingTime ? '未填写' : scope.row.actualLandingTime}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="createdTime" label="申请日期" align="center" width="200"></el-table-column>
          <el-table-column prop="approvalTime" label="审核时间" align="center" width="200"></el-table-column>
        </el-table>
      </div>

      <el-pagination
        v-if="tableData.length>0"
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
    <el-dialog title="飞行计划审核" :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :before-close="onClickHandleClose"
    >
      <el-form :model="checkForm" :rules="rules" ref="checkForm" label-width="80px">
        <el-form-item label="" style="margin-bottom: 0;">
          <el-radio v-model="checkForm.status" label="1">通过</el-radio>
          <el-radio v-model="checkForm.status" label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item label="" prop="content" style="margin-bottom: 0;">
          <el-input v-model="checkForm.content" :rows="3" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom: 10px;">
        <el-button @click="onClickCancleDialog">取 消</el-button>
        <el-button type="primary" @click="onClickSubmitAuditing('checkForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="报备补录" width="80%" :visible.sync="dialogTableVisible">
      <div class="title-desc">
        <span>计划编码：</span>{{getReportNameAndPlanNumber.planNumber}}
        <span class="name">计划名称：</span>{{getReportNameAndPlanNumber.name}}
      </div>
      <div class="flightPlan-dialog-table">
        <el-table :data="getPilotReportData" border style="width: 100%">
          <el-table-column property="takeoffPointName" align="center" label="起降场" width=""></el-table-column>
          <el-table-column property="scopeName" align="center" label="空域/航线" width=""></el-table-column>
          <el-table-column property="aerocraftInfo" align="center" label="机型/驾数" width=""></el-table-column>
          <el-table-column align="center" label="开飞时间" width="200">
            <el-table-column property="takeOffTime" align="center" label="计划" width=""></el-table-column>
            <el-table-column align="center" label="实施" width="140">
              <template  slot-scope="scope">
                <div class="timeWidth" >
                  <el-time-picker
                    v-model="scope.row.actualTakeoffTime"
                    value-format="HH:mm:ss"
                    >
                  </el-time-picker>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="结束时间" width="200">
            <el-table-column property="landingTime" align="center" label="计划"></el-table-column>
            <el-table-column align="center" label="实施" width="140">
              <template slot-scope="scope">
                <div class="timeWidth">
                  <el-time-picker
                      value-format="HH:mm:ss"
                      v-model="scope.row.actualLandingTime"
                    >
                  </el-time-picker>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="备注"  width="200">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;">
         <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="completeReport">完成</el-button>
          <el-button type="primary" plain @click="onClickCloseDialog">取消</el-button>
        </span>
        </div>
      </div>
    </el-dialog>
    <form action="/api/flightPlan/exportFlightPlan" hidden ref="exportForm" method="get">
      <input type="hidden" name="taskTypeId" v-model="form.taskTypeId">
      <input type="hidden" name="startDate" v-model="form.startDateFly">
      <input type="hidden" name="endDate" v-model="form.endDateFly">
      <input type="hidden" name="applyStartTime" v-model="form.applyStartTimeApply">
      <input type="hidden" name="applyEndTime" v-model="form.applyEndTimeApply">
      <input type="hidden" name="flightUnitId" v-model="form.flightUnitId">
      <input type="hidden" name="dataFieldId" v-model="form.dataFieldId">
      <input type="hidden" name="exportType" v-model="exportPlanInfo">
      <input type="hidden" name="status" v-model="form.status">
      <input type="hidden" name="planNumber" v-model="form.planNumber">
    </form>
  </div>
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        defaultChecked: false,
        showCheckboxFlag: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        remarks: 0,
        currentIndex: 0,
        exportPlanInfo: '2',
        actualizeStartsTime: "",//弹框开始  时间
        actualizeEndTime: "",//弹框实施结束时间
        taskTypeData: [],
        declareDate: [],
        unitData: [],
        getPilotReportData: [],
        getReportNameAndPlanNumber: {},
        ApplyData: '',
        flyData: '',
        dialogTableVisible: false,
        planPeriodLis: [],
        form: {
          flightUnitId: '',
          taskTypeId: '',
          dataFieldId: '',
          startDateFly: '',//飞行开始日期
          endDateFly: '',//飞行结束日期
          applyStartTimeApply: '',//审批开始日期
          applyEndTimeApply: '',//审批结束时间
          isVerified: '',
          planNumber: '',//计划编码
          status: ''
        },
        checkForm: {
          status: "1",
          content: "",
        },
        rules: {
          content: [
            {required: true, message: '请输入驳回意见', trigger: 'blur'}
          ]
        },
        tableData: [],
        dialogFormVisible: false,
        loading: true
      }
    },
    created() {
      this._initData();
      this.$nextTick(() => {
        document.querySelector('.M_content').addEventListener('scroll', tool.watchScroll);
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$nextTick(() => {
        document.querySelector('.M_content').removeEventListener('scroll', tool.watchScroll);
        window.removeEventListener('resize', tool.watchScroll);
      });
      next();
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', tool.watchScroll);
      })
    },
    methods: {
      //初始化加载相关数据
      _initData() {
        this.getQueryParams();
        this.asyncGetPlanInfoListData();
        this.asyncGetTaskTypeData();
        this.asyncGetUnitData();
        this.asyncGetDeclareData();
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.taskTypeId = params.taskTypeId ? parseInt(params.taskTypeId) : "";
        this.form.dataFieldId = params.dataFieldId ? parseInt(params.dataFieldId) : "";
        this.form.flightUnitId = params.flightUnitId ? parseInt(params.flightUnitId) : "";
        this.form.startDateFly = params.startDateFly ? params.startDateFly : "";
        this.form.endDateFly = params.endDateFly ? params.endDateFly : "";
        this.form.applyStartTimeApply = params.applyStartTimeApply ? params.applyStartTimeApply : "";
        this.form.applyEndTimeApply = params.applyEndTimeApply ? params.applyEndTimeApply : "";
        this.form.status = params.status ? params.status : "";
        this.form.isVerified = params.isVerified ? params.isVerified : "";
        this.form.planNumber = params.planNumber ? params.planNumber : "";
      },
      //选中未提交的 值
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击--报备按钮
      onClickReport(id) {
        this.dialogTableVisible = true;
        this.currentIndex = id;
        this.$axios.get('/flightPlan/getPlanPeriodList', {
          params: {
            id: id,
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.getPilotReportData = res.data.data.list;
            this.getReportNameAndPlanNumber = {
              name: res.data.data.name,
              planNumber: res.data.data.planNumber,
            };

          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //提交报备信息
      completeReport() {
        let _Data = {
          id: this.currentIndex,
          list: this.getPilotReportData
        };
        this.$axios.post('/flightPlan/updateFlightPlanPeriod', _Data)
          .then((res) => {
            if (res.data.code === 200) {
              this.dialogTableVisible = false;
              this.currentIndex = '';
              this.asyncGetPlanInfoListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      //取消报备
      onClickCloseDialog() {
        this.dialogTableVisible = false;
        this.currentIndex = '';
      },
      //弹框取消
      onClickCancleDialog() {
        this.dialogFormVisible = false;
        this.checkForm.content = '';
        this.checkForm.status = '1';
      },
      //弹框关闭
      onClickHandleClose() {
        this.dialogFormVisible = false;
        this.checkForm.content = '';
        this.checkForm.status = '1';
      },
      //点击--批量审核
      onClickAudit(){
        if (this.multipleSelection && this.multipleSelection.length !== 0) {
          this.dialogFormVisible = true;
        } else {
          this.$message.warning('请先选择待提交审核的飞行员');
        }
      },
      //确定提交审核
      asyncPostAudiTing(){
        let _AuditData = [];
        this.multipleSelection.forEach((item) => {
          _AuditData.push(item.id);
        });
        _AuditData = _AuditData.join(',');
        this.$axios.post('/flightPlan/approveFlightPlanList', {
            ids: _AuditData,
            action: this.checkForm.status,
            approvalOpinion: this.checkForm.content,
        }).then((res) => {
          if (res.data.code === 200) {
            this.dialogFormVisible = false;
            this.asyncGetPlanInfoListData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //弹框确认
      onClickSubmitAuditing(checkForm) {
        if (this.checkForm.status == 2) {
          this.$refs[checkForm].validate((valid) => {
            if (valid) {
              this.asyncPostAudiTing();
            }
          });
        }
      },
      //导出
      exportFlyPlanList() {
        this.$refs.exportForm.submit();
      },
      //每页多少条
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetPlanInfoListData();
      },
      //当前页
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetPlanInfoListData();
      },
      //点击查询
      onClickQueryPlanList() {
        this.asyncGetPlanInfoListData();
      },
      //重置
      onClickResetPlanInfo() {
        this.form = {
          taskTypeId: '',
          applyStartTimeApply: '',
          applyEndTimeApply: '',
          startDateFly: '',
          endDateFly: '',
          flightUnitId: '',
          dataFieldId: '',
          isVerified: '',
          planNumber: '',
          status: ''
        };
        this.pageSize = 10;
        this.currentPage = 1;
        this.asyncGetPlanInfoListData();
      },
      //获取列表查询数据
      asyncGetPlanInfoListData() {
        this.$axios.get('/flightPlan/getFlightPlanInfoList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            taskTypeId: this.form.taskTypeId,
            startDate: this.form.startDateFly,//飞行开始日期
            endDate: this.form.endDateFly,//结束日期
            applyStartTime: this.form.applyStartTimeApply,//审批开始日期
            applyEndTime: this.form.applyEndTimeApply,//审批结束时间
            flightUnitId: this.form.flightUnitId,
            dataFieldId: this.form.dataFieldId,
            status: this.form.status,
            planNumber: this.form.planNumber,
            isVerified: this.form.isVerified
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.showCheckboxFlag = true;
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
            this.tableData.forEach((item) => {
                if(item.status === 2) {
                    this.showCheckboxFlag = false;
                }
            });
            this.loading = false;
          } else {
            this.$confirm("", res.data.msg, {
              confirmButtonText: '确定',
              showCancelButton: false,
              showClose: false,
              type: 'error',
              center: true,
              customClass: 'confirm-box confirm-single-box',
              cancelButtonClass: 'second-btn'
            }).then(() => {
              this.$router.push("/index")
            })
          }
        })
      },
      //获取任务性质
      asyncGetTaskTypeData() {
        this.$axios.get("/flightPlan/getTaskTypeList").then(data => {
          if (data.data.code === 200) {
            this.taskTypeData = data.data.data;
          } else {
            this.$message({
              type: 'error',
              message: data.data.msg,
              duration: 1200
            })
          }
        })
      },
      //获取飞行单位
      asyncGetDeclareData() {
        this.$axios.get("/flighttask/getAviationCompanyList").then(data => {
          if (data.data.code === 200) {
            this.declareDate = data.data.data
          } else {
            this.$message({
              type: 'error',
              message: data.data.msg,
              duration: 1200
            })
          }
        })
      },
      //获取报批单位
      asyncGetUnitData() {
        this.$axios.get("/flightPlan/getDataFieldList").then(data => {
          if (data.data.code === 200) {
            this.unitData = data.data.data
          } else {
            this.$message({
              type: 'error',
              message: data.data.msg,
              duration: 1200
            })
          }
        });
      },
      //点击--查看
      jumpToCheckflyPlan(row) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage
          },
          {
            id: row.id,
            currentStatus: row.status,
          }
        );
        this.$router.push({
          path: '/applyPlan/check',
          query: params
        })
      },
      //点击--审核
      onClickAuditing(id) {
        this.$router.push({
          path: '/applyPlan/audit',
          query: {
            id: id,
            type: 1
          }
        })
      }
    },
    watch: {
      $route(to, from) {
        if(to.path == "/applyPlan") {
          this._initData()
        }
      }
    }
  }
</script>
<style scoped>
  .query-btn-box {
    margin-left: 17px;
  }

  .operate-btn-box {
    margin-bottom: 20px;
  }

  .title-desc {
    margin: 10px 0;
  }

  .title-desc span {
    color: #A5A5AB;
  }

  .title-desc .name {
    padding-left: 30px;
  }
  .defaultText{
    color: #A7A7A7;
  }
  .flightPlan-dialog-table .el-date-editor.el-input {
    width: 120px;
  }
  .timeWidth{
    width: 100px;
  }
  .exportBox{
    width: 130px;
    display: inline-block;
    margin-left: 5px;
  }
  .color-yellow{
    color: #FFDB52;
  }
  .color-green{
    color: #279b37;
  }
  .color-gray{
    color: #c2c2c2;
  }
  .color-red{
    color: #FF0000;
  }
  .table-container {
    position: relative;
  }
  .table-checkbox-flag {
    position: absolute;
    left: 19px;
    top: 47px;
  }
</style>
<style>
  .applyPlan-container .el-dialog__body {
    padding: 10px 20px 20px !important;
  }
  .applyPlan-container .el-form-item-plan .el-form-item__label{
    width: 120px!important;
  }
</style>
