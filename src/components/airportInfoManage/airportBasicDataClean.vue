<template>
  <div class="airPortInfoManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/airportManage'}">机场信息</el-breadcrumb-item>
      <el-breadcrumb-item>机场起降点数据清洗</el-breadcrumb-item>
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
        <el-button type="primary"  @click="jumpToAirportBasicEditInfo" class="operate-btn-item">编辑机场名称及坐标</el-button>

      </el-form>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column  label="地点展示名称（用户录入）" align="center" width="250">
          <template slot-scope="scope">
            {{scope.row.name}} {{scope.row.coordinateInfo ? (scope.row.coordinateInfo): ''}}
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="企业名称" align="center" width="100"></el-table-column>
        <el-table-column label="地点展示名称（基础数据）" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.companyId" style="width: 100%;"
                       @click.native="rowClick(scope.$index,scope.row.id)"
                       @change="changeCompanyId"
                       :disabled="scope.row.flag!=='1'"
                       filterable>
              <el-option
                v-for="item in scope.row.airportData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="地点全称（基础数据）" align="center" width="168">
          <template slot-scope="scope">
            {{scope.row.customOriginalName ? scope.row.customOriginalName : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="坐标（基础数据）" align="center" width="180">
          <template slot-scope="scope">
            {{scope.row.customCoordinateInfo ? scope.row.customCoordinateInfo : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.flag === '1'" type="primary" size="small"
                       @click="onClickConfirm(scope.row,scope.$index)">确定
            </el-button>
            <el-button v-else type="primary" size="small" disabled>确定</el-button>
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
  </div>
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        trIndex: '',
        airportShowName: '',
        airportAllName: '',
        loading: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        name: "",
        tableData: [],
        airPortNameListArr: [],
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
        }
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
        this.asyncGetAirportListData();
      },
      //获取地点名称
      asyncGetAirportNameListData(id) {
        this.$axios.get("/landingPoint/listLandingPoint?id=" + id).then(res => {
          if (res.data.code === 200) {
            this.tableData[this.trIndex].airportData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      rowClick(index, id) {
        this.trIndex = index;
        if(this.tableData[index].airportData.length === 0) {
          this.asyncGetAirportNameListData(id);
        }
      },
      changeCompanyId(id) {
        /*通过id 发送请求 拿到对应的数据后 ，修改对应的下标 数据进行赋值*/
        this.asyncGetAirportName(id);
      },
      //点击--确定-------------缺少接口
      onClickConfirm(data, idx) {
        if (this.tableData[idx].companyId) {
          this.$confirm('', '确定要提交吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showClose: false,
            type: 'warning',
            center: true,
            customClass: 'confirm-box confirm-single-box',
            cancelButtonClass: 'second-btn'
          }).then(() => {
            this.asyncSaveAirportNewName(data.id, data.companyId, idx);
          })
        } else {
          this.$message.error('请选择地点展示名称');
        }
      },
      //获取对应的地点全称 和 坐标 ------------接口未调
      asyncGetAirportName(id) {
        let obj = this.tableData[this.trIndex].airportData.filter((item) => {
           return item.id === id;
        });
        this.tableData[this.trIndex].customOriginalName = obj[0].originalName;
        this.tableData[this.trIndex].customCoordinateInfo = obj[0].coordinateInfo;
      },
      //点击--确定修改机场
      asyncSaveAirportNewName(oldId, newId, idx) {
        this.$axios.post('/landingPoint/modifyLandingPoint', {
          oldId: oldId,
          newId: newId
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData[idx].flag = '2';
          } else {
            this.$message.error(res.data.msg);
          }
        })
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
      //跳转至编辑机场坐标及名称
      jumpToAirportBasicEditInfo() {
        this.$router.push({
          path: "/airportManage/airportBasicEditInfo"
        })
      },
      //获取地点列表
      asyncGetAirportListData() {
        this.$axios.get("/landingPoint/listPageLandingPoint", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.name,
            type: 1
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.list;
            this.tableData.forEach((item) => {
              this.$set(item, 'companyId', '');
              this.$set(item, 'flag', '1');
              this.$set(item, 'airportData', []);
              this.$set(item, 'customOriginalName', '');
              this.$set(item, 'customCoordinateInfo', '');
            });
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
      }
    }
  }
</script>
<style scoped>
  .query-btn-box {
    margin-left: 17px;
  }
  .operate-btn-item {
    position: absolute;
    right: 35px;
  }
</style>
