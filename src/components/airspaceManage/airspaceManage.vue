<template>
  <div class="airspaceManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>空域管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" labelWidth="100px">
        <el-form-item label="空域名称：">
          <el-input v-model.trim="form.airspaceName" placeholder="空域名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="起降场：">
          <el-select v-model="form.upDownAirPort"
                     filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in airPortListArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建公司：">
          <el-input v-model.trim="form.companyName" placeholder="创建公司" clearable></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" class="query" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <el-button type="primary" class="query" @click="jumpToAddAirLine">添加空域</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column label="操作" fixed align="center" header-align="center" :min-width="operateColumnWidth">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="jumpToCheckRoutes(scope.row.id)">
              查看
            </el-button>
            <el-button type="primary" size="small" @click="jumpToCopyRoutes(scope.row.id)"
                       v-if="scope.row.generalAviationCompanyId === 0">复制
            </el-button>
            <el-button type="primary" plain size="small" @click="jumpToEditRoutes(scope.row.id)"
                       v-if="scope.row.generalAviationCompanyId === 0">编辑
            </el-button>
            <el-button type="primary" plain size="small" @click="onClickDelBtn(scope.row.id)"
                       v-if="scope.row.generalAviationCompanyId === 0"> 删除
            </el-button>
            <span v-if="scope.row.status !=3 && scope.row.status !=4" class="btn-open-close">
              <el-button v-if="scope.row.isUsable == 0" @click="onClickStop(scope.row,1)" type="primary" plain size="small">停用
              </el-button>
              <el-button v-else-if="scope.row.isUsable == 1" @click="onClickStop(scope.row,0)" type="primary" plain
                         size="small">启用
              </el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="landingField" label="起降场" align="center" width="200"></el-table-column>
        <el-table-column prop="name" label="空域名称" align="center" width="150"></el-table-column>
        <el-table-column prop="shapeTypeName" label="空域类型" align="center" width="150"></el-table-column>
        <el-table-column label="坐标" align="center" min-width="220">
          <template slot-scope="scope">
            <div v-for="eachCoordinate in scope.row.coordinateArr">{{eachCoordinate}}</div>
          </template>
        </el-table-column>
        <<el-table-column label="创建公司" align="center" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.generalAviationCompanyId ? scope.row.generalAviationCompanyName : '常用空域'}}</span>
        </template>
      </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center" width="150"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间" align="center" width="200"></el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length > 0"
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
        currentPage: 1,
        pageSize: 10,
        total: 0,
        form: {
          airspaceName: "",
          upDownAirPort: "",
          companyName: ""
        },
        tableData: [],
        airPortListArr: [],
        loading: true
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
    computed: {
      operateColumnWidth() {
        let flag = false;
        flag = this.tableData.some((item) => {
          return item.generalAviationCompanyId === 0
        })
        if(flag) {
          return 380
        }else {
          return 180
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', tool.watchScroll);
      })
    },
    methods: {
      _initData() {
        this.getQueryParams();
        this.asyncGetAirspaceListData();
        this.asyncGetAirportListData()
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.upDownAirPort = params.upDownAirPort ? parseInt(params.upDownAirPort) : "";
        this.form.airspaceName = params.airspaceName ? params.airspaceName : "";
        this.form.companyName = params.companyName ? params.companyName : "";
      },
      //获取起降场列表
      asyncGetAirportListData() {
        this.$axios.get("/landingPoint/getLandingPointList").then(res => {
          if (res.data.code === 200) {
            this.airPortListArr = [];
            this.airPortListArr = this.airPortListArr.concat(res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      //点击--删除
      onClickDelBtn(id) {
        this.$confirm('', '是否删除此航线?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.asyncDeleteAirspace(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //停用或启用
      onClickStop(row, status) {
        this.$confirm('', `是否${ status === 0 ? '启用' : '停用'}此记录?`, {
          confirmButtonText: '确定',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.$axios.get('/airspace/updateBackAirspaceIsUsable', {
            params: {
              id: row.id,
              isUsable: status
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.asyncGetAirspaceListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        });
      },
      //删除
      asyncDeleteAirspace(id) {
        this.$axios.get("/airspace/deleteAirspace?id=" + id).then((res) => {
          if (res.data.code === 200) {
            this.asyncGetAirspaceListData();
          }
        })
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAirspaceListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          airspaceName: "",
          upDownAirPort: "",
          companyName: ""
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAirspaceListData();
      },
      //跳转至查看页
      jumpToCheckRoutes(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            airspaceId: id
          }
        );
        this.$router.push({
          path: "/airspaceManage/msgInfo/check",
          query: params
        })
      },
      //跳转至复制页
      jumpToCopyRoutes(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            airspaceId: id
          }
        );
        this.$router.push({
          path: "/airspaceManage/copy",
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
            airspaceId: id
          }
        );
        this.$router.push({
          path: "/airspaceManage/edit",
          query: params
        })
      },
      //跳转至添加页
      jumpToAddAirLine() {
        this.$router.push({
          path: "/airspaceManage/add"
        })
      },
      //获取空域列表
      asyncGetAirspaceListData() {
        this.$axios.get("/airspace/getBackAirspaceList", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.form.airspaceName,
            landingFieldId: this.form.upDownAirPort,
            generalAviationCompanyName: this.form.companyName
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.tableData.forEach(item => {
              this.$set(item, 'coordinateArr', item.coordinate.split("|"));
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
        this.asyncGetAirspaceListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAirspaceListData();
      },
    },
    watch: {
      $route(to, from) {
        if(to.path == "/airspaceManage") {
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

  .btn-open-close {
    display: inline-block;
    margin-left: 10px;
  }
</style>
