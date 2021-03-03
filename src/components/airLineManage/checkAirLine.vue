<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/airLineManage' }" style="color: #59b9e2">航线管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看航线</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="checkRoutes-container" v-loading="loading">
      <div class="routesDetail">
        <el-row>
          <el-col :span="12"><span class="label">航线路径：</span><div class="routes">{{name ? name : '--'}}</div></el-col>
          <el-col :span="12"><span class="label">航线ID：</span><span>{{id ? id : '--'}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="label">起飞场地： </span><span>{{departureAirport ? departureAirport : '--'}}</span></el-col>
          <el-col :span="12"><span class="label">降落场地：</span><span>{{landingAirport ? landingAirport : '--'}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="label">创建人： </span><span>{{creator ? creator : '--'}}</span></el-col>
          <el-col :span="12"><span class="label">最后更新时间： </span><span>{{updatedTime ? updatedTime : '--'}}</span></el-col>
        </el-row><el-row>
          <el-col :span="12"><span class="label">创建公司： </span><span>{{generalAviationCompanyName ? generalAviationCompanyName : '--'}}</span></el-col>
        </el-row>
      </div>
    </div>
    <el-row style="margin-bottom: 30px;">
      <el-col :offset="10">
        <el-button type="primary" class="query" @click="jumpToRoutesManage">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lineId: "",
        name: "", //航线名称
        id: "", //航线ID
        departureAirport: "",
        landingAirport: "",
        creator: "",
        updatedTime: "", //最后更新时间
        statusName: "",
        taskNumber: "",
        codeArr: [], //关联任务编号存放数组
        generalAviationCompanyName: "", //所属企业
        queryParams: {}, //列表页查询参数
        loading: true
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.lineId = this.$route.query.lineId;
      this.asyncGetAirlineInfo();
    },
    methods: {
      //点击--取消
      jumpToRoutesManage() {
        this.$router.push({
          path: "/airLineManage",
          query: this.queryParams
        })
      },
      //获取航线回显信息
      asyncGetAirlineInfo() {
        this.$axios.get("/airline/getBackAirlineInfo?id=" + this.lineId).then((res => {
          if (res.data.code === 200) {
            let _data = res.data.data;
            this.name = _data.name;
            this.id = _data.id;
            this.departureAirport = _data.departureAirport;
            this.landingAirport = _data.landingAirport;
            this.creator = _data.creator;
            this.updatedTime = _data.updatedTime;
            this.statusName = _data.statusName;
            this.taskNumber = _data.taskNumber ? _data.taskNumber : "--";
            if (this.taskNumber) {
              this.codeArr = this.taskNumber.split(",");
             }
            this.generalAviationCompanyName = _data.generalAviationCompanyName;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        }))
      },
      //点击关联任务编号跳转至任务详情页
      jumpToTaskDetail(taskNumber) {
        this.$axios.get("/flighttask/getIdByTaskNumber?taskNumber=" + taskNumber).then(res => {
          if(res.data.code === 200) {
            let taskId = res.data.data;
            this.$router.push({
              path: "/applyTask/check" ,
              query: {
                taskId: taskId
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .checkRoutes-container {
    position: relative;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    min-width: 1050px;
    margin-bottom: 20px;
    min-height: 290px;
  }
  .routesDetail {
    font-size: 14px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .routesDetail .el-row {
    margin-bottom: 20px;
    color: #3e4a54;
  }

  .label {
    display: inline-block;
    width: 150px;
    text-align: right;
    margin-right: 5px;
    font-weight: 700;
  }
  .reset-btn.el-button--info.is-plain {
    color: #59b9e2;
    background: #f4f4f5;
    border-color: #59b9e2;
  }
  .taskNum {
    cursor: pointer;
  }
  .taskNum:hover {
    color: #59b9e2;
  }
  .taskNumbers {
    width: 400px;
    line-height: 20px;
    margin-left: 152px;
    margin-top: -18px;
  }
  .routes {
    margin: -18px 0 0 154px;
    line-height: 20px;
  }
</style>
