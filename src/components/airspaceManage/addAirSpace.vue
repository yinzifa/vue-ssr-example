<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/airspaceManage' }">空域管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{action}}空域</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="addAirSpace-container">
      <div class="item-wrapper">
        <el-form inline :model="form" labelWidth="125px" :rules="rules" style="margin-bottom: 10px">
          <el-form-item label="起降场：" prop="updownairport">
            <el-autocomplete v-model="form.updownairport"
                             :maxlength="30"
                             @select="onChangeName(form.updownairport)"
                             @input="onChangeInput"
                             :fetch-suggestions="querySearch"
                             :trigger-on-focus="false"
                             placeholder="请选择或输入机场名称">
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="空域名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入空域名称"  @blur="onBlurValidateAirspaceName"></el-input>
          </el-form-item>
          <el-form-item label="临时起降场坐标 : " style="width: 100%;" class="tempCoord">
            <el-row>
              <el-col :span="8">
                <span style="margin-right: 5px;">N</span>
                <el-input v-model="TempPointArrType.lat.degree" class="flex-center-style" placeholder="请输入度"></el-input><span class="iconCompany">°</span>
                <el-input  v-model="TempPointArrType.lat.minute" class="flex-center-style" placeholder="请输入分"></el-input><span class="iconCompany">′</span>
                <el-input   v-model="TempPointArrType.lat.sec" class="flex-center-style" placeholder="请输入秒"></el-input><span class="iconCompany">″</span>
              </el-col>
              <el-col :span="8">
                <span style="margin-right: 5px;">E</span>
                <el-input   v-model="TempPointArrType.lng.degree" class="flex-center-style" placeholder="请输入度"></el-input><span class="iconCompany">°</span>
                <el-input   v-model="TempPointArrType.lng.minute" class="flex-center-style" placeholder="请输入分"></el-input><span class="iconCompany">′</span>
                <el-input   v-model="TempPointArrType.lng.sec" class="flex-center-style" placeholder="请输入秒"></el-input><span class="iconCompany">″</span>
              </el-col>
              <el-col :span="8">
                <span style="color: #f44739;">注意 ：使用临时起降场, 坐标要求必填</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="item">
          <div class="label self-start label-style">空域类型：</div>
          <div class="flex-center">
            <div class="flex-center-col area">
              <img :src="cirUrl" @click="onChangeArea(2)">
              <span>圆形区域</span>
            </div>
            <div class="flex-center-col area">
              <img :src="polUrl" @click="onChangeArea(1)">
              <span>多边形区域</span>
            </div>
          </div>
        </div>
        <div v-if="type === 2">
          <div class="item">
            <div class="label label-style ">中心坐标：</div>
            <div class="flex-center right-part">
              <div class="flex-center">
                <p class="flex-center-center label label-style label-40">经度</p>
                <el-input v-model="circle.lng" placeholder="请输入内容"></el-input>
              </div>
              <div class="flex-center">
                <p class="flex-center label label-style label-40">纬度</p>
                <el-input v-model="circle.lat" placeholder="请输入内容"></el-input>
              </div>
              <div class="flex-center">
                <p class="flex-center label label-style label-40">半径</p>
                <el-input class="margin-right-10" v-model="circle.radius" placeholder="请输入内容"></el-input>
                <p>米</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="type === 1">
          <div class="item">
            <div class="label self-start label-style" style="height:40px;">顶点坐标：</div>
            <div class="flex-start-start-col rel">
              <div class="flex-start-start item-col" v-for="(item,index) in pointArr" :key="index">
                <div class="flex-center margin-right-10">
                  <p class="flex-center label-start" style="height:40px;">顶点</p>
                </div>
                <div class="flex-center margin-right-30">
                  <p class="flex-center label-start label-style">经度</p>
                  <el-input v-model="item.lng" placeholder="请输入经度"></el-input>
                </div>
                <div class="flex-center margin-right-30">
                  <p class="flex-center label-start label-style">纬度</p>
                  <el-input v-model="item.lat" placeholder="请输入纬度"></el-input>
                </div>
                <div class="flex-center margin-right-30 del-btn" @click="onClickDelPointByIndex(index)" v-show="pointArr.length > 3">
                  <img src="../../../static/images/delete.png" alt="">
                  <span>删除</span>
                </div>
              </div>
              <div class="flex-center ">
                <div class="top-btn flex-center" @click="onClickAddTop">
                  +顶点
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="label self-start label-style">空域状态：</div>
          <el-switch
            v-model="bisUsable"
            active-color="#59b9e2"
            inactive-color="#E6E7E9">
          </el-switch>
          <span class="bisUsable-text" :class="{'active':bisUsable}">{{text}}</span>
        </div>

      </div>
    </div>
    <el-row>
      <el-col :offset="9">
        <el-button type="primary" class="query" @click="asyncSaveAirspace">保存</el-button>
        <el-button class="second-btn" @click="jumpToAirspaceManage">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        text: '已启用',
        bisUsable: true,
        action: "添加",
        airspaceId: "",
        form: {
          updownairport: "", //起降场
          name: "" //空域名称
        },
        type: 2,  //空域类型  1多边形 2圆形
        circle: {
          lng: "",
          lat: "",
          radius: ""
        },
        rules: {
          updownairport: [
            {required: true, message: '请选择或输入起降场', trigger: 'blur,change'}
          ],
          name: [
            {required: true, message: '空域名称', trigger: 'change'}
          ]
        },
        pointArr: [
          {
            lng: "",
            lat: ""
          },
          {
            lng: "",
            lat: ""
          },
          {
            lng: "",
            lat: ""
          }
        ],
        TempPointArrType: {
          lng: {
            degree: '',
            minute: '',
            sec: ''
          },
          lat: {
            degree: '',
            minute: '',
            sec: ''
          }
        },
        airPortListArr: [], //起降场列表
        queryParams: {}, //列表页查询参数
        flyUpDownId:''//起降场id
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.asyncGetAirportListData();
      let action = this.$route.params.action;
      this.airspaceId = this.$route.query.airspaceId;
      if (action === "edit") {
        this.action = "编辑";
      } else if (action === "add") {
        this.action = "新增";
      } else if(action === "copy") {
        this.action = "复制";
      }
    },
    methods: {
      //实时校验空域名称
      onBlurValidateAirspaceName() {
        if (this.form.updownairport) {
          this.$axios.get("/airspace/validAirspaceIsexsit", {
            params: {
              id: this.airspaceId,
              name: this.form.name,
              landingField: this.form.updownairport,
              landingFieldId: this.flyUpDownId
            }
          }).then(res => {
            if (res.data.code !== 200) {
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
        }
      },
      //切换起降场 获取临时坐标
      onChangeName(id) {
        if (typeof id !== 'number') {
          this.getFlyUpDownId();
        }
        this.$axios.get("/landingPoint/getCoordinate", {
          params: {
            id: this.flyUpDownId
          }
        }).then(res => {
          if (res.data.code === 200) {
            if (res.data.data) {
              let _data = res.data.data.coordinate;
              if (_data.lat && _data.lng) {
                this.TempPointArrType = _data;
              } else {
                this.TempPointArrType = {
                  lng: {
                    degree: '',
                    minute: '',
                    sec: ''
                  },
                  lat: {
                    degree: '',
                    minute: '',
                    sec: ''
                  }
                }
              }
            }
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        });
      },
      //起降场
      onChangeInput() {
       this.getFlyUpDownId();
        this.onChangeName(this.flyUpDownId);
      },
      //获取起降场id
      getFlyUpDownId() {
        this.flyUpDownId = '';
        this.airPortListArr.forEach((item) => {
          if (item.name === this.form.updownairport) {
            this.flyUpDownId = item.id;
          }
        });
      },
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
      //获取回显空域信息
      asyncGetAirspaceInfo(id) {
        this.$axios.get("airspace/getBackUpdateInfo?id=" + id).then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            this.form.name = data.name;
            this.form.updownairport = data.landingField;
            this.type = data.shapeType;
            this.bisUsable = data.bisUsable;
            this.TempPointArrType.lat = data.lat;
            this.TempPointArrType.lng = data.lng;
            if (this.type === 1) {
              this.pointArr = data.coordinateModelList;
            } else {
              this.circle = data.circleCoordinate;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //跳转至列表页
      jumpToAirspaceManage() {
        this.$router.push({
          path: "/airspaceManage",
          query: this.queryParams
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
            if (this.action.indexOf("编辑") > -1 || this.action.indexOf("复制") > -1) {
              this.asyncGetAirspaceInfo(this.airspaceId);
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      //保存
      asyncSaveAirspace() {
        let url = "/airspace/saveBackAirspace";
        let data = {
          name: this.form.name,
          landingField: this.form.updownairport,
          bisUsable: this.bisUsable,
          shapeType: this.type,
          lat: this.TempPointArrType.lat,
          lng: this.TempPointArrType.lng
        };
        if (this.type === 1) {
          data.coordinateModelList = this.pointArr
        } else {
          data.circleCoordinate = this.circle
        }
        if (this.airspaceId && this.action !== "复制") {
          data.id = this.airspaceId;
          url = "/airspace/updateBackAirspace"
        }
        if (!this.form.updownairport) {
          this.$message.error('请输入或选择起降场');
        } else if (!this.form.name) {
          this.$message.error('请输入空域名称');
        } else {
          this.$axios.post(url, data).then(res => {
            if (res.data.code === 200) {
              this.jumpToAirspaceManage()
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      },
      //点击--切换圆形-多边形
      onChangeArea(flag) {
        this.type = flag;
      },
      //添加多边形顶点坐标
      onClickAddTop() {
        this.pointArr.push({
          lng: '',
          lat: ''
        })
      },
      //点击删除顶点
      onClickDelPointByIndex(i) {
        this.$confirm('', '是否删除此顶点?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.pointArr.splice(i, 1);
        });
      }
    },
    computed: {
      cirUrl() {
        if (this.type === 2) {
          return require('../../../static/images/circular-active.png')
        } else {
          return require('../../../static/images/circular.png')
        }
      },
      polUrl() {
        if (this.type === 1) {
          return require('../../../static/images/polygon-active.png')
        } else {
          return require('../../../static/images/polygon.png')
        }
      }
    },
    watch: {
      bisUsable(newV) {
        newV == 1 ? this.text = '已启用' : this.text = '已停用';
      }
    }
  }
</script>

<style scoped>
  .addAirSpace-container {
    position: relative;
    padding: 15px 20px 40px 20px;
    background: #fff;
    border-radius: 8px;
    min-width: 1050px;
    margin-bottom: 20px;
  }

  .item-wrapper {
    width: 1040px;
    margin: 0 auto;
  }

  .item {
    margin-bottom: 30px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
  }

  .item .label {
    width: 120px !important;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    margin-right: 20px;
  }

  .flex-center.right-part {
    position: relative;
    left: -52px;
  }

  .item .right-part {
    width: calc(1040px - 140px);
    box-sizing: border-box;
  }

  .label-start {
    width: 40px;
    margin-right: 20px;
  }

  .item .self-start {
    align-self: flex-start;
  }

  .item .area-name {
    width: 450px;
  }

  .item .area {
    margin-right: 40px;
  }

  .fix-width {
    width: 75px;
  }

  .item .area img {
    margin-bottom: 20px;
    cursor: pointer;
  }

  .item .pick-pox {
    color: #59b9e2;
    cursor: pointer;
  }

  .item .rel {
  }

  .item .top-btn {
    height: 30px;
    width: 90px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    background-color: #59b9e2;
    margin-right: 20px;
    cursor: pointer;
  }

  .item .item-col {
    margin-bottom: 20px;
  }

  .label-40 {
    width: 40px !important;
  }

  .flex-end {
    align-items: flex-end !important;
  }

  .flex-start-start-col {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
  }

  .flex-start-start {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-center-col {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .el-form-item__label {
    color: #3e4a54;
  }

  .margin-right-30 {
    margin-right: 30px;
  }

  .margin-right-15 {
    margin-right: 15px;
  }

  .margin-right-10 {
    margin-right: 10px;
  }

  .del-btn {
    vertical-align: middle;
    padding: 8px 0;
    color: #f44739;
    font-size: 12px;
    cursor: pointer;
  }

  .del-btn img {
    padding-right: 5px;
  }

  .bisUsable-text {
    padding-left: 20px;
    color: #ddd;
  }

  .bisUsable-text.active {
    color: #59b9e2;
  }

  .flex-center-style {
    width: 78px;
    margin: 0 3px;
  }
  .iconCompany{
    position: relative;
    top: -17px;
  }
</style>
<style>
  .addAirSpace-container .el-form-item.tempCoord .el-form-item__content {
    width: 87% !important;
  }

  .addAirSpace-container .el-input__inner {
    padding: 0px 10px;
  }
</style>
