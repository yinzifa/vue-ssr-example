<template>
  <div class="airPortInfoManage-container" >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>机场信息</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" labelWidth="100px">
        <el-form-item label="机场名称：">
          <el-select v-model="form.id"
                     clearable
                     filterable >
            <el-option label="请选择" value=""></el-option>
            <el-option
              v-for="item in airPortNameListArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机场代码：">
          <el-input v-model.trim="form.code" placeholder="机场代码"  clearable @keyup.enter.native="onClickQueryByParams"></el-input>
        </el-form-item>
        <el-form-item label="机场分类：">
          <el-select v-model="form.type"
                     filterable  clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option
              v-for="item in airPortListArr"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" class="query" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <el-button type="primary" class="query" @click="jumpToAddAirport">添加</el-button>
        <el-button type="primary"  @click="jumpToAirportBasicDataClean">机场基础数据清洗</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="jumpToCheckRoutes(scope.row.id)">查看
            </el-button>
            <el-button type="primary" plain size="small" @click="jumpToEditRoutes(scope.row.id)">编辑
            </el-button>
            <el-button v-if="scope.row.status == 1" @click="onClickStop(scope.row.id)" type="primary" plain size="small">停用
            </el-button>
            <el-button v-else-if="scope.row.status == 2" @click="onClickStart(scope.row.id)" type="primary" plain size="small">启用
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="机场名称" align="center" width="200"></el-table-column>
        <el-table-column prop="code" label="机场代码" align="center" width="200"></el-table-column>
        <el-table-column prop="address" label="机场地址" align="center" width="250"></el-table-column>
        <el-table-column prop="type" label="机场分类" align="center"  :formatter="formateAirportType"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间" align="center" width="200"></el-table-column>
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
        loading: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        form: {
          id: "",
          type: "",
          code: ""
        },
        tableData: [],
        airPortNameListArr: [],
        airPortListArr: [
          {
            id: '1',
            name: '民航机场'
          },
          {
            id: '2',
            name: '通航机场'
          },
          {
            id: '3',
            name: '混合机场'
          },
          {
            id: '13',
            name: '农用机场'
          }
        ]
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
        this.asyncGetAirportListData();
        this.asyncGetAirportNameListData();
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.id = params.id ? parseInt(params.id) : "";
        this.form.type = params.type ?params.type: "";
        this.form.code = params.code ? params.code : "";
      },
      //格式机场分类
      formateAirportType(row) {
        if(row.type === 1) {
          return "民航机场"
        }else if(row.type === 2) {
          return "通航机场"
        }else if(row.type === 3) {
          return "混合机场"
        }else if(row.type === 13) {
          return "农用机场"
        }
        return "--"
      },
      //获取机场名称
      asyncGetAirportNameListData() {
        this.$axios.get("/airport/getAirportList").then(res => {
          if(res.data.code === 200) {
            this.airPortNameListArr = [];
            this.airPortNameListArr = this.airPortNameListArr.concat(res.data.data);
          }else {
            this.$message.error(res.data.msg);
          }
        });
      },
      //停用
      onClickStop(id) {
        this.$confirm('', '是否停用此记录?', {
          confirmButtonText: '确定',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.$axios.get('/airport/stopAirport', {
            params: {
              id: id
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.asyncGetAirportListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        });
      },
      //启用
      onClickStart(id) {
        this.$confirm('', '是否启用此记录?', {
          confirmButtonText: '确定',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.$axios.get('/airport/startAirport', {
            params: {
              id: id
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.asyncGetAirportListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        });
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAirportListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
              id: "",
              type: "",
              code: ""
            };
        this.currentPage = 1;
        this.pageSize = 10;
        this.$router.push('/airportManage');
        this.asyncGetAirportListData();
      },
      //跳转至查看页
      jumpToCheckRoutes(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            airportName: id,
            actionType: 1,
          }
        );
        this.$router.push({
          path: "/airportManage/check",
          query: params
        })
      },
      //跳转至编辑页
      jumpToEditRoutes(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            airportName: id
          }
        );
        this.$router.push({
          path: "/airportManage/edit",
          query: params
        })
      },
      //跳转至添加页
      jumpToAddAirport() {
        this.$router.push({
          path: "/airportManage/add"
        })
      },
      //跳转至机场基础数据清洗
      jumpToAirportBasicDataClean() {
        this.$router.push({
          path: "/airportManage/airportBasicDataClean"
        })
      },
      //获取机场列表
      asyncGetAirportListData() {
        this.$axios.get("/airport/getAirportModelList", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            id: this.form.id,
            type: this.form.type,
            code: this.form.code
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
            this.loading = false;
          } else {
            this.$confirm( "", res.data.msg,{
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
      $route(to, from) {
        if(to.path == "/airportManage") {
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
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

</style>
