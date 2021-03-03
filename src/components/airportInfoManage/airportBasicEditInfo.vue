<template>
  <div class="airPortInfoManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/airportManage'}">机场信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/airportManage/airportBasicDataClean'}">机场起降点数据清洗</el-breadcrumb-item>
      <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" labelWidth="220px">
        <el-form-item label="地点展示名称（基础数据）：">
          <el-input v-model.trim="name" placeholder="地点展示名称" clearable
                    @keyup.enter.native="onClickQueryByParams"></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" class="query" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column label="地点名称（用户录入）" align="center" width="320">
          <template slot-scope="scope">
            {{scope.row.name}} {{scope.row.coordinateInfo ? (scope.row.coordinateInfo): ''}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="地点展示名称（基础数据）" align="center"></el-table-column>
        <el-table-column label="地点全称（基础数据）" align="center" width="168">
          <template slot-scope="scope">
            {{scope.row.originalName ? scope.row.originalName : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="坐标（基础数据）" align="center" width="180">
          <template slot-scope="scope">
            {{scope.row.coordinateInfo ? scope.row.coordinateInfo : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="地点类型" align="center" width="80" :formatter="formateAirportType">

        </el-table-column>
        <el-table-column label="操作" align="center" width="320">
          <template slot-scope="scope">
            <el-button @click="onClickEditName(scope.row)" type="primary" size="small">编辑名称</el-button>
            <el-button @click="onClickEditCoordinate(scope.row)" type="primary" size="small">编辑坐标</el-button>
            <el-button @click="onClickEditType(scope.row)" type="primary" size="small">编辑类型</el-button>
          </template>
        </el-table-column>
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
    <el-dialog title="编辑类型" :visible.sync="isShowTypeDialog" width="500px" :before-close="closeCommonDialog"
               :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="">
          <el-select v-model="airporTypeId" style="width: 75%;"
                     filterable>
            <el-option
              v-for="item in airportTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickSaveAirporType">保存</el-button>
        <el-button class="second-btn" @click="closeCommonDialog">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑名称" :visible.sync="dialogFormVisible" width="500px" :before-close="closeCommonDialog"
               :close-on-click-modal="false">
      <el-form label-width="150px">
        <el-form-item label="地点展示名称：">
          <el-input v-model.trim="airporName" clearable auto-complete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="地点全称：">
          <el-input v-model.trim="originalName" clearable auto-complete="off" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="asyncSaveAirportName">保存</el-button>
        <el-button class="second-btn" @click="closeCommonDialog">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑坐标" :visible.sync="isShowCoordDialog" :before-close="closeCommonDialog"
               :close-on-click-modal="false"
               width="830px">
      <el-form>
        <el-form-item>
          <span>地点坐标：</span>
          <span>N</span>
          <el-input v-model.trim="pointArrType.lat.degree" class="flex-center-style" placeholder="请输入度"></el-input>
          <span class="iconCompany">°</span>
          <el-input v-model.trim="pointArrType.lat.minute" class="flex-center-style" placeholder="请输入分"></el-input>
          <span class="iconCompany">′</span>
          <el-input v-model.trim="pointArrType.lat.sec" :disabled="forbid" class="flex-center-style"
                    placeholder="请输入秒"></el-input>
          <span class="iconCompany">″</span>
          <span class="coordinate">E</span>
          <el-input v-model.trim="pointArrType.lng.degree" class="flex-center-style" placeholder="请输入度"></el-input>
          <span class="iconCompany">°</span>
          <el-input v-model.trim="pointArrType.lng.minute" class="flex-center-style" placeholder="请输入分"></el-input>
          <span class="iconCompany">′</span>
          <el-input v-model.trim="pointArrType.lng.sec" :disabled="banSec" class="flex-center-style"
                    placeholder="请输入秒"></el-input>
          <span class="iconCompany">″</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" class="query" @click="onClickSaveCoordinate">确认</el-button>
        <el-button class="second-btn" @click="closeCommonDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        name: '',
        isShowTypeDialog: false,
        dialogFormVisible: false,
        isShowCoordDialog: false,
        banSec: false,
        forbid: false,
        loading: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        airportTypeList: [
          {
            id: 1,
            name: "机场"
          }, {
            id: 2,
            name: "起降场"
          }, {
            id: 3,
            name: "途径点"
          }, {
            id: 4,
            name: "导航台"
          }, {
            id: 5,
            name: "航线"
          }, {
            id: 6,
            name: "航路"
          }
        ],
        pointArrType: {
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
        airporId: '',
        airporName: '',
        originalName: '',
        airporTypeId: ''
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
        document.querySelector('.el-table').removeEventListener('resize', tool.watchScroll);
      });
      next();
    },
    mounted() {
      this.$nextTick(() => {
        document.querySelector('.el-table').addEventListener('resize', tool.watchScroll);
      })
    },
    methods: {
      _initData() {
        this.asyncGetAirportListData();
      },
      //格式机场分类
      formateAirportType(row) {
          let type = {1:'机场',2:'起降场', 3:'途径点',4:'导航台',5:'航线',6:'航路'};
          return type[row.type];
      },
      //点击--编辑名称 进行对应赋值
      onClickEditName(data) {
        this.airporId = data.id;
        this.airporName = data.name;
        this.originalName = data.originalName;
        this.dialogFormVisible = true;
      },
      //点击--编辑坐标 进行对应赋值
      onClickEditCoordinate(data) {
        this.airporId = data.id;
        this.pointArrType = JSON.parse(JSON.stringify(data.coordinate));
        this.isShowCoordDialog = true;
      },
      //点击--编辑类型 进行对应赋值
      onClickEditType(data) {
        this.airporId = data.id;
        this.airporTypeId = data.type;
        this.isShowTypeDialog = true;
      },
      //点击--保存 修改地点名称
      asyncSaveAirportName() {
        if (!this.airporName || !this.originalName) {
          this.$message.error("请完善修改名称");
        } else {
          this.$axios.post('/landingPoint/modifyLandingPointName', {
            id: this.airporId,
            name: this.airporName,
            originalName: this.originalName
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.closeCommonDialog();
              this.asyncGetAirportListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      },
      //点击--确定 修改坐标
      onClickSaveCoordinate() {
        if (this.transformSmallNumber()) {
          this.pointArrType.id = this.airporId;
          this.asyncSaveCoordinate(this.pointArrType);
        }
      },
      //点击--编辑类型
      onClickSaveAirporType() {
        if (this.airporTypeId) {
          let data = {
            id: this.airporId,
            type: this.airporTypeId
          };
          this.asyncSaveAirporType(data);
        } else {
          this.$message.error('请选择编辑类型');
        }
      },
      //保存--坐标
      asyncSaveCoordinate(data) {
        this.$axios.post('/landingPoint/modifyPointCoordinate', data)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.closeCommonDialog();
              this.asyncGetAirportListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      //保存--类型
      asyncSaveAirporType(data) {
        this.$axios.post('/landingPoint/modifyLandingPointType', data)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.closeCommonDialog();
              this.asyncGetAirportListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      //取消--修改地点名称
      closeCommonDialog() {
        this.dialogFormVisible = false;
        this.isShowCoordDialog = false;
        this.isShowTypeDialog = false;
        this.airporName = '';
        this.originalName = '';
        this.airporTypeId = '';
        this.pointArrType = {
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
        };
      },
      //封装处理 度分秒校验
      transformSmallNumber() {
        let flag = true;
        let item = this.pointArrType;
        if (isNaN(item.lng.degree)) {
          flag = false;
          this.$message.error('请输入正确的经度格式');
          return;
        } else if (item.lng.minute >= 60) {
          flag = false;
          this.$message.error('经度的分值必须小于60');
          return;
        } else if (isNaN(item.lng.minute)) {
          flag = false;
          this.$message.error('请输入正确的经度分值格式');
          return;
        } else if (item.lng.sec >= 60) {
          flag = false;
          this.$message.error('经度的秒值必须小于60');
          return;
        } else if (isNaN(item.lng.sec)) {
          flag = false;
          this.$message.error('请输入正确的经度秒值格式');
          return;
        } else if (isNaN(item.lat.degree)) {
          flag = false;
          this.$message.error('请输入正确的纬度格式');
          return;
        } else if (item.lat.minute >= 60) {
          flag = false;
          this.$message.error('纬度的分值必须小于60');
          return;
        } else if (isNaN(item.lat.minute)) {
          flag = false;
          this.$message.error('请输入正确的纬度分值格式');
          return;
        } else if (item.lat.sec >= 60) {
          flag = false;
          this.$message.error('纬度的秒值必须小于60');
          return;
        } else if (isNaN(item.lat.sec)) {
          flag = false;
          this.$message.error('请输入正确的纬度秒值格式');
          return;
        }

        if (item.lng.degree === '' || item.lat.degree === '') {
          flag = false;
          this.$message.error('请完善经纬度填写');
          return;
        }
        return flag;
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAirportListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.name = "";
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAirportListData();
      },
      //获取地点列表
      asyncGetAirportListData() {
        this.$axios.get("/landingPoint/listPageLandingPoint", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.name,
            type: 2
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
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
      //每页显示
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetAirportListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAirportListData();
      },
    },
    watch: {
      pointArrType: {
        handler(item) {
          if (isNaN(item.lng.degree)) {
            this.$message.error('请输入正确度格式');
          } else if (isNaN(item.lng.minute)) {
            this.$message.error('请输入正确分格式');
          } else if (item.lng.minute && item.lng.minute.toString().indexOf('.') >= 0) {
            this.banSec = true;
            item.lng.sec = '';
          } else if (item.lng.minute && item.lng.minute.toString().indexOf('.') === -1) {
            this.banSec = false;
          } else if (isNaN(item.lng.sec)) {
            this.$message.error('请输入正确秒格式');
          }
          if (isNaN(item.lat.degree)) {
            this.$message.error('请输入正确度格式');
          } else if (isNaN(item.lat.minute)) {
            this.$message.error('请输入正确分格式');
          } else if (item.lat.minute && item.lat.minute.toString().indexOf('.') >= 0) {
            this.forbid = true;
            item.lat.sec = '';
          } else if (item.lat.minute && item.lat.minute.toString().indexOf('.') === -1) {
            this.forbid = false;
          } else if (isNaN(item.lat.sec)) {
            this.$message.error('请输入正确秒格式');
          }
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
  .query-btn-box {
    margin-left: 17px;
  }

  .dialog-footer {
    text-align: center;
  }

  .flex-center-style {
    width: 90px;
    margin: 0 3px;
  }

  .iconCompany {
    position: relative;
    top: -17px;
  }

  .coordinate {
    padding-left: 20px;
  }

</style>
