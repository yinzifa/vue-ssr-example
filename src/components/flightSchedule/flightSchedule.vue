<template>
  <div class="flight-schedule-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>飞行进程单</el-breadcrumb-item>

    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" ref="form" style="padding-left: 20px">
        <el-form-item label="飞行单位：" labelWidth="95px">
          <el-select v-model="form.flightCompanyId" filterable placeholder="请选择">
            <el-option v-for="(item, index) in aviationCompanyList" :label="item.name" :value="item.id"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机号：" labelWidth="60px">
          <el-input v-model.trim="form.aircraftNo" clearable placeholder="请输入" @keyup.enter.native="queryByParams"></el-input>
        </el-form-item>
        <el-form-item label="飞行时间：" labelWidth="95px">
          <el-date-picker type="datetime"
                          class="M-start-date"
                          placeholder="开始日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"
                          v-model="form.startDate">
          </el-date-picker>
          <el-form-item label="至" prop="endDate" labelWidth="20px" class="M-end-date">
            <el-date-picker type="datetime"
                            placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            v-model="form.endDate">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button class="query" type="primary" @click="queryByParams">查询</el-button>
          <el-button class="second-btn" @click="resetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column label="操作" fixed align="center">
          <template slot-scope="scope">
            <el-button @click="jumpToCheckFlightInfo(scope.row.flightPlanPeriodId)"
                       size="small" type="primary" plain>详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="planNumber" label="计划编号" align="center"></el-table-column>
        <el-table-column prop="companyName" label="飞行单位" align="center"></el-table-column>
        <el-table-column prop="taskTypeName" label="任务性质" align="center"></el-table-column>
        <el-table-column prop="aerocraftInfoList" label="机号（机型）" align="center" width="200">
          <template slot-scope="scope">
            <p v-for="(name, index) in scope.row.aerocraftInfoList">{{name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="takeoffPointName" label="起降场" align="center"></el-table-column>
        <el-table-column prop="flightDate" label="飞行日期" align="center"></el-table-column>
        <el-table-column label="飞行时间" align="center">
          <template slot-scope="scope">
            {{scope.row.takeoffTime}}-{{scope.row.landingTime}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="tableData.length > 0"
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
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        form: {
          flightCompanyId: "",
          aircraftNo: "",
          startDate: "",
          endDate: ""
        },
        formBak: {
          flightCompanyId: "",
          aircraftNo: "",
          startDate: "",
          endDate: "",
          pageSize: 10,
          currentPage: 1,
        },
        aviationCompanyList: [],
        pageSize: 10,
        currentPage: 1,
        total: 0,
        tableData: [],
        queryString: "",
        loading: true

      }
    },
    created() {
      this.queryString = this.$route.query.queryString ? this.$route.query.queryString : "";
      if(this.queryString) {
        this.form = JSON.parse(this.queryString);
        this.currentPage = this.form.currentPage;
        this.pageSize = this.form.pageSize;
        this.formBak = JSON.parse(this.queryString);
      }
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
        this.asyncAviationCompanyList();
        this.asyncGetTableDataList();
      },
      //点击--详情
      jumpToCheckFlightInfo(id) {
        this.$router.push({
          path: "/flightSchedule/check",
          query: {
            flightPlanPeriodId: id,
            queryString: JSON.stringify(this.formBak)
          }
        })
      },
      //点击--查询
      queryByParams() {
        this.formBak = this.form;
        this.formBak.pageSize = this.pageSize;
        this.formBak.currentPage = this.currentPage;
        this.asyncGetTableDataList();
      },
      //点击--重置
      resetQueryParams() {
        this.form = {
          flightCompanyId: "",
          aircraftNo: "",
          startDate: "",
          endDate: ""
        };
        this.pageSize = 10;
        this.currentPage = 1;
        this.formBak = this.form;
        this.formBak.pageSize = this.pageSize;
        this.formBak.currentPage = this.currentPage;
        this.asyncGetTableDataList();
      },
      //每页显示
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetTableDataList();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetTableDataList();
      },
      //获取飞行单位列表
      asyncAviationCompanyList() {
        this.$axios.get('/flighttask/getAviationCompanyList').then(res => {
          if (res.data.code === 200) {
            this.aviationCompanyList = [];
            this.aviationCompanyList = this.aviationCompanyList.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取列表数据
      asyncGetTableDataList() {
        this.$axios.get('/flightPlan/listFlightPlanPeriodVo', {
          params: {
            companyId: this.form.flightCompanyId,
            aircraftNumber: this.form.aircraftNo,
            startDate: this.form.startDate,
            endDate: this.form.endDate,
            pageSize: this.pageSize,
            pageNum: this.currentPage
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
        if(to.path === "/flightSchedule") {
          this._initData()
        }
      }
    }
  }
</script>
<style scoped>

</style>
