<template>
  <div class="checkAircraft_container"  v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/aircraftManage' }">航空器管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看航空器类型</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="craft_details">
      <div class="content-box">
        <el-row>
          <el-col :span="10" :offset="2">
            <span class="label">航空器属性 : </span>
            <span>{{machineTypeName ? machineTypeName : '--'}}</span>
          </el-col>
        </el-row>
        <div v-show="machineType===1">
          <div class="top-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">航空器型号 : </span>
              <span>{{name ? name : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">航空器类型 : </span>
              <span>{{aircraftTypeName ? aircraftTypeName : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">制造厂商 : </span>
              <span>{{aerocraftManufacturer ? aerocraftManufacturer : '--'}}</span>
            </el-col>
          </el-row>

          <div class="bottom-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大飞行速度 : </span>
              <span>{{maxFlightSpeed ? maxFlightSpeed : '--'}} 千米/小时(km/h)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">净重 : </span>
              <span>{{suttle ? suttle : '--'}} 千克(kg)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">巡航速度 : </span>
              <span>{{cruisingSpeed ? cruisingSpeed : '--'}} 千米/小时(km/h)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">理论配置驾驶员数量 : </span>
              <span>{{driverCount ? driverCount : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大航程 : </span>
              <span>{{maxFlightDistance ? maxFlightDistance : '--'}} 千米(km)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">座位 : </span>
              <span>{{seatCount ? seatCount : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大耗时 : </span>
              <span>{{maxTimeConsuming ? maxTimeConsuming : '--'}} 小时(h)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">升限 : </span>
              <span>{{maxHeight ? maxHeight : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">平均耗油量 : </span>
              <span>{{averageOilConsuming ? averageOilConsuming : '--'}} 小时(h)</span>
            </el-col>
          </el-row>
        </div>
        <div v-show="machineType===2">
          <div class="top-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">航空器型号 : </span>
              <span>{{name ? name : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">航空器类型 : </span>
              <span>{{aircraftTypeName ? aircraftTypeName : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">制造厂商 : </span>
              <span>{{aerocraftManufacturer ? aerocraftManufacturer : '--'}}</span>
            </el-col>
          </el-row>
          <div class="bottom-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">净重 : </span>
              <span>{{suttle ? suttle : '--'}} 千克(kg)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">最大起飞重量 : </span>
              <span>{{maxFlyWeight ? maxFlyWeight : '--'}} 千克(kg)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大着陆重量 : </span>
              <span>{{maxLandWeight ? maxLandWeight : '--'}} 千克(kg)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">最大飞行速度 : </span>
              <span>{{maxFlightSpeed ? maxFlightSpeed : '--'}} 千米/小时(km/h)</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="btns-box">
      <el-button type="primary" class="query" @click="jumpToAircraftManage">返回</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        id: "",
        name: "", //航空器型号
        aircraftTypeName: "",//航空器类型名称
        aerocraftManufacturer: "",  //制造厂商
        machineTypeName:"", //航空器属性名称
        
        suttle: "",   //净重
        cruisingSpeed: "", //巡航速度
        maxFlightDistance: "", //航程
        maxFlightSpeed: "",  //最大飞行速度
        maxTimeConsuming: "", //最大耗时
        maxHeight: "", //升限
        averageOilConsuming: "", //平均耗油量
        seatCount: "", //座位
        driverCount: "", //理论配置驾驶员数量
        maxFlyWeight: "", //最大起飞重量
        maxLandWeight: "", //最大着陆重量
        createdTime: "",   //添加时间 
        loading: true,
        machineType: 1,
        queryParams: []
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.id;
      this.asyncGetAircraftInfoById(this.id);
    },
    methods: {
      //获取航空器信息
      asyncGetAircraftInfoById(id) {
        this.$axios.get("/aerocraftModel/getAerocraftModelInfo?id=" + id).then( res => {
          if(res.data.code === 200) {
            let data = res.data.data;
            this.name = data.name;
            this.aircraftTypeName = data.aircraftTypeName;
            this.aerocraftManufacturer = data.aerocraftManufacturer;
            this.machineTypeName = data.machineTypeName;
            this.machineType = data.machineType;
            this.suttle = data.suttle;
            this.cruisingSpeed = data.cruisingSpeed;
            this.maxFlightDistance = data.maxFlightDistance;
            this.maxFlightSpeed = data.maxFlightSpeed;
            this.maxTimeConsuming = data.maxTimeConsuming;
            this.maxHeight = data.maxHeight;
            this.averageOilConsuming = data.averageOilConsuming;
            this.seatCount = data.seatCount;
            this.driverCount = data.driverCount;
            this.maxFlyWeight = data.maxFlyWeight;
            this.maxLandWeight = data.maxLandWeight;
            this.createdTime = data.createdTime;
          }else {
              this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //点击--返回
      jumpToAircraftManage() {
        this.$router.push({
          path: '/aircraftModelManage',
          query: this.queryParams
        })
      },
    }
  }
</script>
<style scoped>
  .checkAircraft_container {
    position: relative;
    min-width: 1050px;
    margin: 0 auto;
  }
  .checkAircraft_container.agree {
    padding-bottom: 90px;
  }
  .checkAircraft_container.disagree {
    padding-bottom: 230px;
  }
  .craft_details {
    font-size: 14px;
    min-width: 1050px;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 20px;
    margin: 0px auto;
  }
  .craft_details .el-row {
    padding: 10px 0;
    color: #3e4a54;
  }
  .craft_details .label {
    display: inline-block;
    width: 170px;
    text-align: right;
    color: #3e4a54;
  }
  .btns-box {
    margin: 20px;
    text-align: center;
  }
  .fixed-box {
    position: fixed;
    left: 200px;
    right: 10px;
    bottom: 50px;
    padding: 5px 0 0;
    background: #fff;
    border-radius: 4px;
    border-top: 1px solid #d9d9d9;
    margin-top: 50px;
    z-index: 10;
    box-shadow: 0 -2px 5px #ccc;
  }

  .top-border-box,.bottom-border-box  {
    margin: 20px 0;
    border-top: 1px dashed #c2c2c2;
  }

  .checkFile {
    color: #59b9e2;
    cursor: pointer;
    width: 400px;
  }

  .checkFile.multiple {
    margin-left: 162px;
    margin-top: -20px;
    line-height:24px;
    min-height: 21px;
  }

  .checkFile.airworthiness {
    margin-left: 258px;
    margin-top: -22px;
    line-height:24px;
  }


  .content-box {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
