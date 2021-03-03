<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/airLineManage'}">航线管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{action}}航线</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="addRoutes-container">
      <div class="item-wrapper">
        <div class="item">
          <div class="label self-start">航线路径 :</div>
          <div class="mul-height mul-height-col">
            <el-col :span="6" v-for="(item, index) in routesArr" :key="index">
              <el-autocomplete v-model="item.name"
                               :autofocus="item.autofocus"
                               :disabled="action.indexOf('查看')>-1"
                               :fetch-suggestions="querySearch"
                               :trigger-on-focus="false"
                               placeholder="请选择或输入机场名称">
              </el-autocomplete>
              <a class="route-input" v-show="showDelBtn" @click.prevent="onClickDelAirlineByIndex(index)"
                 v-if="unShowDelBtnInCheck"></a>
            </el-col>
            <el-col :span="6" v-show="action.indexOf('查看') < 0">
              <div class="el-btn-das flex-center" @click="onClickAddRoute">+添加地点</div>
            </el-col>
          </div>
        </div>
        <div class="item flex-center">
          <div class="label">起飞场地 :</div>
          <div class=" mul-height">
            <el-col :span="6">
              <el-autocomplete v-model="departureAirport"
                               :maxlength="30"
                               :fetch-suggestions="querySearch"
                               :trigger-on-focus="false"
                               placeholder="请选择或输入场地"
                               :disabled="action.indexOf('查看')>-1">
              </el-autocomplete>
            </el-col>
            <div class="spe-label margin-right-20">降落场地 :</div>
            <el-col :span="6">
              <el-autocomplete v-model="endAirport"
                               :maxlength="30"
                               :fetch-suggestions="querySearch"
                               :trigger-on-focus="false"
                               placeholder="请选择或输入场地"
                               :disabled="action.indexOf('查看')>-1">
              </el-autocomplete>
            </el-col>
          </div>
        </div>
      </div>
    </div>
    <el-row style="margin-bottom: 30px;">
      <el-col :offset="9">
        <el-button type="primary" class="query" v-show="action.indexOf('查看')<0" @click="asyncSaveAirline">保存</el-button>
        <el-button class="second-btn" @click="jumpToAirlineManage">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lineId: "",
        action: "添加",
        showDelActiveBtn: "false",
        unShowDelBtnInCheck: "true", //在查看页不显示删除按钮
        routesArr: [
          {
            name: "",
            autofocus: false
          },
          {
            name: "",
            autofocus: false
          }
        ],
        height: '',
        departureAirport: '',
        endAirport: '',
        airPortListArr: [],   //起降场列表
        queryParams: {}, //列表页查询参数
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.lineId = this.$route.query.lineId;
      let action = this.$route.params.action;
      if (action === "edit") {
        this.action = "编辑";
      } else if (action === "check") {
        this.action = "查看";
        this.unShowDelBtnInCheck = false;
      } else if (action === "copy") {
        this.action = "复制";
      }
      this.asyncGetAirportListData();
    },
    methods: {
      //添加航线模态框--航线点的输入搜索
      querySearch(queryString, cb) {
        let restaurants = this.airPortListArr;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //点击--取消
      jumpToAirlineManage() {
        this.$router.push({
          path: "/airlineManage",
          query: this.queryParams
        })
      },
      //点击--保存
      asyncSaveAirline() {
        let nameStr = [];
        let _flag = true;
        let url = "/airline/saveBackAirline";
        if (this.routesArr.length === 2) {
          this.routesArr.forEach(item => {
            if (!item.name) {
              this.$confirm('', '航线路径不能为空', {
                confirmButtonText: '确定',
                showCancelButton: false,
                showClose: false,
                type: 'warning',
                center: true,
                customClass: 'confirm-box confirm-single-box',
                cancelButtonClass: 'second-btn'
              });
              _flag = false;
              return;
            }
          })
        }
        //非空校验
        if (this.routesArr.filter(item => {
            return item.name !== "";
          }).length < 2) {
          this.$confirm( '', '请至少输入两条航线路径', {
            confirmButtonText: '确定',
            showCancelButton: false,
            showClose: false,
            type: 'warning',
            center: true,
            customClass: 'confirm-box confirm-single-box',
            cancelButtonClass: 'second-btn'
          });
          _flag = false;
          return;
        }
        if(this.departureAirport.trim() ==='' || this.endAirport.trim() === '') {
          this.$message.error('请完善起降机场');
          _flag = false;
          return;
        }

        if (_flag) {
          this.routesArr.forEach((item) => {
            if (item.name) {
              nameStr.push(item.name)
            }
          });
          let data = {
            name: nameStr.join("-"),
            departureAirport: this.departureAirport.trim(),
            landingAirport: this.endAirport.trim()
          };
          if (this.action === "复制") {
            url = "/airline/saveBackAirline";
          }else if (this.action === "编辑") {
            data.id = this.lineId;
            url = "/airline/updateBackAirline";
          }
          this.save(url, data);
        }
      },
      //点击删除
      onClickDelAirlineByIndex(i) {
        this.routesArr.map((item, index) => {
          if (index === i)
            this.routesArr.splice(index, 1)
        })
      },
      //新增或修改
      save(url, data) {
        this.$axios.post(url, data).then(res => {
          if (res.data.code === 200) {
            this.$router.push({
              path: "/airlineManage",
              query: this.queryParams
            })
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取起降场列表
      asyncGetAirportListData() {
        this.$axios.get("/landingPoint/getLandingPointList").then(res => {
          if (res.data.code === 200) {
            this.airPortListArr = [];
            this.airPortListArr = this.airPortListArr.concat(res.data.data);
            this.airPortListArr.forEach(item => {
              this.$set(item, 'value', item.name)
            });
            if (this.lineId) {
              this.asyncGetAirlineInfo();
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      //获取编辑回显信息
      asyncGetAirlineInfo() {
        this.$axios.get("/airline/getBackAirlineInfo?id=" + this.lineId).then((res => {
          if (res.data.code === 200) {
            let _data = res.data.data;
            this.departureAirport = _data.departureAirport;
            this.endAirport = _data.landingAirport;
            let routesArr = _data.name.split("-");
            if (routesArr.length >= 2) {
              this.routesArr = [];
            }
            routesArr.forEach(item => {
              this.routesArr.push({
                name: item
              })
            })
          } else {
            this.$message.error(res.data.msg);
          }
        }))
      },
      //添加航线点
      onClickAddRoute() {
        if (this.routesArr.length < 20) {
          this.routesArr.push({
            name: "",
            autofoucus: false
          })
        }
      }
    },
    computed: {
      //是否显示删除按钮
      showDelBtn() {
        if (this.routesArr.length > 2) {
          return true;
        } else {
          return false;
        }
      }
    },
  }
</script>

<style scoped>
  .item-wrapper {
    width: 1040px;
    margin: 0 auto;
    box-sizing: border-box;
    max-width: 1200px;
  }

  .item {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
  }

  .mul-height {
    width: calc(1040px - 120px);
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }

  .mul-height-col .el-col {
    margin: 0 20px 20px 0;
    position: relative;
  }

  .item .label {
    width: 120px !important;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    margin-right: 20px;
  }

  .item .self-start {
    align-self: flex-start;
  }

  .el-btn-das {
    width: 80% !important;
    font-size: 14px;
    height: 40px;
    background-color: #fff;
    box-sizing: border-box;
    outline: none;
    line-height: 1;
    color: #59b9e2;
    border: 1px dashed #dcdfe6;
    cursor: pointer;
    border-radius: 4px;
  }

  a.route-input {
    display: block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: 20px;
    background: url("../../../static/images/del-default.png") no-repeat right top;
  }

  a.route-input:hover {
    background-image: url("../../../static/images/del-active.png");
  }
</style>
<style>
  .addRoutes-container {
    position: relative;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    min-width: 1050px;
    margin-bottom: 20px;
    min-height: 290px;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .margin-right-20 {
    margin-right: 20px;
  }

  .addRoutes-container .spe-label,.label {
    font-weight: 700;
    color: #3e4a54;
  }
</style>
