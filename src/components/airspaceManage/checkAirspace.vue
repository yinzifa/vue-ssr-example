<template>
  <div>
    <div class="checkAirSpace-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/airspaceManage' }">空域管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="M-main-box" v-loading="loading">
        <div class="content-container">
          <el-row>
            <el-col :span="10" :offset="3"><span class="M-label">空域名称 : </span> <span>{{name ? name : '--'}}</span></el-col>
            <el-col :span="10"><span class="M-label">空域ID : </span> <span>{{airspaceId ? airspaceId : '--'}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="3"><span class="M-label">起降场 : </span> <span>{{upDownAirPort ? upDownAirPort : '--'}}</span></el-col>
            <el-col :span="10">
              <span class="M-label">关联任务编号 : </span>
              <div class="taskNumbers">
                <span v-for="(item, index) in codeArr" :key="index"><span v-show="index !== 0">, </span><span>{{item}}</span></span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="3" v-show="type === 2"><span class="M-label">中心点经纬度 : </span> <span style="white-space: pre">{{coordinate ? coordinate : '--'}}</span></el-col>
            <el-col :span="10" :offset="3" v-show="type === 1"><span class="M-label">顶点经纬度 : </span> <div class="point-box"><div class="point-item" v-for="item in pointArr">{{item}}</div></div></el-col>
          </el-row>
          <div class="content-border"></div>
          <el-row>
            <el-col :span="10" :offset="3"><span class="M-label">创建人 : </span> <span>{{creater ? creater : '--'}}</span></el-col>
            <el-col :span="10"><span class="M-label">最后更新时间 : </span> <span>{{updateTime ? updateTime : '--'}}</span></el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="3"><span class="M-label">创建公司 : </span> <span>{{generalAviationCompanyName ? generalAviationCompanyName : '--'}}</span></el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-row style="margin-left: 80px">
      <el-col :offset="10">
        <el-button type="primary" class="query" @click="jumpToAirspaceManage">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        name: "",
        type: 1,
        airspaceId: "",
        upDownAirPort: "",
        code: "",
        codeArr: [], //关联任务编号存放数组
        coordinate: "",
        creater: "",
        generalAviationCompanyName: "",
        status: "",
        updateTime: "",
        pointArr: [],
        queryParams: {}, //列表页查询参数
        loading: true
      }
    },
    created() {
      this.queryParams = this.$route.query;
      let id = this.$route.query.airspaceId;
      this.asyncGetAirspaceInfo(id);
    },
    methods: {
      //获取空域信息
      asyncGetAirspaceInfo(id) {
        this.$axios.get("/airspace/getBackAirspaceInfo?id=" + id).then(res => {
          if(res.data.code === 200) {
            let data = res.data.data;
            this.name = data.name;
            this.airspaceId = data.id;
            this.upDownAirPort = data.landingField;
            this.coordinate =  data.coordinate;
            this.creater = data.creator;
            this.generalAviationCompanyName = data.generalAviationCompanyName;
            this.updateTime = data.updatedTime;
            this.status = data.statusName;//审核状态
            this.code = data.taskNumber ? data.taskNumber : "--";
            this.codeArr = this.code.split(",");
            this.type = data.shapeType;
            if(this.type === 1) {
              this.pointArr = this.coordinate.split("|");
            }
          }else {
              this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //跳转至列表页
      jumpToAirspaceManage() {
        this.$router.push({
          path: "/airspaceManage",
          query: this.queryParams
        })
      },
    }
  }
</script>
<style scoped>
  .checkAirSpace-container {
    margin-bottom: 30px;
  }
  .M-main-box {
    background-color: #fff;
    margin-top: 20px;
    border-radius: 5px;
    padding: 30px 0;
    font-size: 14px;
    min-height: 290px;
  }
  .content-container {
    width: 1050px;
    margin: 0 auto;
    max-width: 1200px;
  }
  .M-label {
    display: inline-block;
    width: 120px;
    text-align: right;
    color: #8b8b8b;
  }
  .point-box {
    position: relative;
    top: -17px;
  }
  .point-item {
    position: relative;
    right: -125px;
    white-space: pre;
  }
  .taskNumbers {
    width: 400px;
    line-height: 20px;
    margin-left: 125px;
    margin-top: -18px;
  }
  .content-border {
    margin: 30px 0 25px;
    height: 0;
    border-top: 1px dashed #c2c2c2;
  }
</style>
<style>
  .checkAirSpace-container .el-row {
    margin-bottom: 20px;
  }
  .checkAirSpace-container .M-label {
    font-weight: 700;
    color: #3e4a54;
  }
</style>
