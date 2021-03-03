<template>
  <div class="applyTask-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>飞行任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" labelWidth="110px" style="padding-left: 20px;">
        <el-form-item label="任务编号：" class="applyTask-container-styleWidth">
          <el-input v-model.trim="form.task_no" placeholder="任务编号" clearable class="container-styleWidth-input"></el-input>
        </el-form-item>
        <el-form-item label="任务名称：" class="applyTask-container-styleWidth">
          <el-input v-model.trim="form.task_name" placeholder="任务名称" clearable class="container-styleWidth-input"></el-input>
        </el-form-item>
        <el-form-item label="飞行单位：">
          <el-select v-model="form.apply_company" filterable clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in aviationCompanyList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务性质：">
          <el-select v-model="form.task_type" filterable clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in allTaskList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="form.status" filterable clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="2"></el-option>
            <el-option label="已通过" value="3"></el-option>
            <el-option label="未通过" value="4"></el-option>
            <el-option label="受理中" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="核验状态：">
          <el-select v-model="form.isVerified" filterable clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
            <el-option label="待核验" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="空域申请方式：">
          <el-select v-model="form.applicationType" filterable clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="线上补录" value="1"></el-option>
            <el-option label="线上申请" value="2"></el-option>
            <el-option label="续签申请" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报批单位：">
          <el-select v-model="form.audit_company" filterable clearable placeholder="报批单位">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in allAllowCompany"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞行日期：" class="date-content">
          <el-date-picker
            class="startTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.fly_start_time"
            type="date"
            style="width: 180px;"
            placeholder="开始日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            class="endTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.fly_end_time"
            type="date"
            style="width: 160px;"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请日期：" class="date-content">
          <el-date-picker
            class="startTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.apply_start_time"
            type="date"
            style="width: 180px;"
            placeholder="开始日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            class="endTime date-input"
            value-format="yyyy-MM-dd"
            v-model="form.apply_end_time"
            type="date"
            style="width: 160px;"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" class="query" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <el-button type="primary" class="query" @click="exportData">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column label="操作" fixed align="left" header-align="center" width="150">
          <template slot-scope="scope">
            <el-button @click="jumpToCheckApplyTask(scope.row.id)"
                       size="small" type="primary" plain>查看</el-button>
            <el-button type="primary" size="small"
                       v-show="scope.row.isVerified === 3"
                       @click="jumpToEditApplyTask(scope.row.id, 1)">核验</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" fixed label="审核状态" align="center" width="120">
          <template  slot-scope="scope">
            <p class="lineStatus declareBg" :class="{'prohibitBg': (scope.row.status === 4 || scope.row.expireStatus === 3)}" v-if="scope.row.applicationType === 2">线上申请</p>
            <p class="lineStatus makeupBg" v-else-if="scope.row.applicationType === 1" :class="{'prohibitBg': (scope.row.status === 4 || scope.row.expireStatus === 3)}">线上补录</p>
            <p class="lineStatus renewalBg" v-else :class="{'prohibitBg': (scope.row.status === 4 || scope.row.expireStatus === 3)}">续签申请</p>
            <span v-show="scope.row.status === 2" :class="scope.row.expireStatus === 3 ? 'expiredColor' : ''">待审核
              <span v-show="scope.row.expireStatus === 3">(已过期)</span></span>
            <span v-show="scope.row.status === 3" :class="scope.row.expireStatus === 3 ? 'expiredColor' : 'passColor'">
              <span>已通过</span>
              <span class="expire-text-color"  v-show="scope.row.expireStatus === 3">(已过期)</span>
            </span>
            <span v-show="scope.row.status === 4" class="fail-text-color">未通过</span>
            <span v-show="scope.row.status === 5">受理中</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" fixed label="核验状态" align="center" >
          <template  slot-scope="scope">
            <span v-show="scope.row.isVerified === 1" class="passColor">已通过</span>
            <span v-show="scope.row.isVerified === 2" class="fail-text-color">未通过</span>
            <span v-show="scope.row.isVerified === 3" >待核验</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskNum" label="任务编号" align="center" width="150"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" align="center" width="200"></el-table-column>
        <el-table-column prop="aviationCompanyName" label="飞行单位" align="center" width="200"></el-table-column>
        <el-table-column prop="approvalAuthorityName" label="报批单位" align="center" width="200"></el-table-column>
        <el-table-column prop="taskTypeName" label="任务性质" align="center" width="150"></el-table-column>
        <el-table-column prop="startEndTime" label="飞行日期" align="center" width="250"></el-table-column>
        <el-table-column prop="accessoryName" label="批件名称" align="center" width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover">
              <p>{{scope.row.accessoryName}}</p>
              <el-button slot="reference" v-show="scope.row.accessoryNameNum > 1" class="pop-button">{{scope.row.accessoryNameNum}}</el-button>
            </el-popover>
            <span v-show="scope.row.accessoryNameNum == 1">{{scope.row.accessoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="submitDate" label="申请时间" align="center" width="200"></el-table-column>
        <el-table-column prop="auditDate" label="审核时间" align="center" width="200"></el-table-column>
      </el-table>
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
    <form action="/api/flighttask/exportTaskForBackstage" hidden ref="exportForm" method="get">
      <input type="hidden" name="taskName" v-model="form.taskName">
      <input type="hidden" name="taskType" v-model="form.taskType">
      <input type="hidden" name="taskNum" v-model="form.task_no">
      <input type="hidden" name="startDate" v-model="form.fly_start_time">
      <input type="hidden" name="endDate" v-model="form.fly_end_time">
      <input type="hidden" name="applyStartDate" v-model="form.apply_start_time">
      <input type="hidden" name="applyEndDate" v-model="form.apply_end_time">
      <input type="hidden" name="status" v-model="form.status">
      <input type="hidden" name="aviationCompanyId" v-model="form.apply_company">
      <input type="hidden" name="pageSize" v-model="pageSize">
      <input type="hidden" name="pageNum" v-model="currentPage">
    </form>
  </div>
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        loading: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        form: {
          applicationType: '',
          task_name: '',
          task_type: '',
          task_no: "",
          apply_company: "",
          fly_start_time: '',
          fly_end_time: '',
          apply_start_time: '',
          apply_end_time: '',
          status: '', //（2:待审核，3:已通过，4:未通过）
          isVerified: '',
          audit_company: '',   //报批单位
        },
        tableData: [],
        allTaskList: [],
        aviationCompanyList: [],
        allAllowCompany: [],    //报批单位列表
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
      _initData() {
        this.getQueryParams();
        this.asyncGetAviationCompanyList(); //获取飞行单位
        this.asyncGetTaskTypeList();  //获取任务性质
        this.asyncGetTableListData();
        this.asyncGetApprovalAuthorityList(); //获取报批单位
      },

      //获取查询参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.task_type = params.task_type ? parseInt(params.task_type) : "";
        this.form.apply_company = params.apply_company ? parseInt(params.apply_company) : "";
        this.form.audit_company = params.audit_company ? parseInt(params.audit_company) : "";
        this.form.task_name = params.task_name ? params.task_name : "";
        this.form.task_no = params.task_no ? params.task_no : "";
        this.form.status = params.status ? params.status : "";
        this.form.fly_start_time = params.fly_start_time ? params.fly_start_time : "";
        this.form.fly_end_time = params.fly_end_time ? params.fly_end_time : "";
        this.form.apply_start_time = params.apply_start_time ? params.apply_start_time : "";
        this.form.apply_end_time = params.apply_end_time ? params.apply_end_time : "";
        this.form.isVerified = params.isVerified ? params.isVerified : "";
        this.form.applicationType = params.applicationType ? params.applicationType : "";
      },
      //导出
      exportData() {
        this.$refs.exportForm.submit();
      },
      //获取报批单位
      asyncGetApprovalAuthorityList() {
        this.$axios.get('/flighttask/getApprovalAuthorityList').then(res => {
          if (res.data.code === 200) {
            this.allAllowCompany= [];
            this.allAllowCompany = this.allAllowCompany.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取飞行单位列表
      asyncGetAviationCompanyList() {
        this.$axios.get('/flighttask/getAviationCompanyList').then(res => {
          if (res.data.code === 200) {
            this.aviationCompanyList = [];
            this.aviationCompanyList = this.aviationCompanyList.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取任务性质
      asyncGetTaskTypeList() {
        this.$axios.get('/flightPlan/getTaskTypeList').then(res => {
          if (res.data.code === 200) {
            this.allTaskList = [];
            this.allTaskList = this.allTaskList.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击--查询
      onClickQueryByParams() {
        this.currentPage = 1;
        this.asyncGetTableListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          applicationType: '',
          task_name: '',
          task_type: '',
          task_no: "",
          apply_company: "",
          fly_start_time: '',
          fly_end_time: '',
          apply_start_time: '',
          apply_end_time: '',
          status: '', //（1:未提交，2:待审核，3:已通过，4:未通过）
          isVerified: '',
          audit_company: ''
        };
        this.pageSize = 10;
        this.currentPage = 1;
        this.asyncGetTableListData();
      },
      //点击--查看
      jumpToCheckApplyTask(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            taskId: id,
          },
        );
        this.$router.push({
          path: "/applyTask/check",
          query: params
        })
      },
      //点击--编辑
      jumpToEditApplyTask(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            taskId: id,
          },
        );
        this.$router.push({
          path: "/applyTask/edit",
          query: params
        });
      },
      //点击--删除
      delCurrentRecord(id) {
        this.$confirm('是否删除此记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.asyncDel(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //删除
      asyncDel(id) {
        this.$axios.get("/flighttask/deleteFlightTask?id=" + id).then(res => {
          if(res.data.code === 200) {
            this.asyncGetTableListData();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        });
      },
      //每页显示
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetTableListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetTableListData();
      },
      //跳转至添加页
      jumpToAddApplyTask() {
        this.$router.push({
          path: "/applyTask/add"
        })
      },
      //获取列表数据
      asyncGetTableListData() {
        this.$axios.get('/flighttask/getListForBackstage',{
          params: {
            applicationType: this.form.applicationType,
            taskName: this.form.task_name,
            taskType: this.form.task_type,
            taskNum: this.form.task_no,
            startDate: this.form.fly_start_time,
            endDate: this.form.fly_end_time,
            applyStartDate: this.form.apply_start_time,
            applyEndDate: this.form.apply_end_time,
            status: this.form.status,
            isVerified: this.form.isVerified,
            aviationCompanyId: this.form.apply_company,
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            approvalAuthorityId: this.form.audit_company,
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      }
    },
    watch: {
      $route(to, from) {
        if(to.path == "/applyTask") {
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
  .pop-button {
    box-sizing: border-box;
    padding: 0;
    width: 60px;
    height: 30px;
    background-color: #f2f9fc;
    color: #59b9e2;
    line-height: 30px;
    border-radius: 2px;
    border: none;
  }
  .lineStatus {
    width: 60px;
    height: 20px;
    margin: 0 auto;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
  }
  .declareBg{
    background: #FF8B26;
  }
  .makeupBg {
    background: #59b9e2;
  }
  .renewalBg {
    background: #71d0cf;
  }
  .prohibitBg{
    background: #CDCDCD;
  }
  .expiredColor {
    color: #c2c2c2;
  }
  .passColor {
    color: #279b37;
  }
  .fail-text-color {
    color: #f44739;
  }
  .expire-text-color {
    color: #c2c2c2;
  }
</style>
<style>
  .applyTask-container-styleWidth .container-styleWidth-input{
    width:217px;
  }
</style>
