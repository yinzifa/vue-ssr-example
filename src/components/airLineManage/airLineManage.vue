<template>
  <div class="routesManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>航线管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" labelWidth="100px">
        <el-form-item label="航线路径：">
          <el-input v-model.trim="form.airLineName" clearable placeholder="航线路径"></el-input>
        </el-form-item>
        <el-form-item label="起飞场地：">
          <el-input v-model.trim="form.upAirPort" clearable placeholder="起飞场地"></el-input>
        </el-form-item>
        <el-form-item label="创建公司：">
          <el-input v-model.trim="form.companyName" clearable placeholder="创建公司"></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" class="query" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <el-button type="primary" class="query" @click="jumpToAddAirLine">添加航线</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column label="操作" align="left" header-align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="jumpToCheckAirline(scope.row.id)">查看</el-button>
            <el-button type="primary" size="small" @click="jumpToEditAirline(scope.row.id)" v-if="scope.row.generalAviationCompanyId === 0" style="margin-left: 0;">编辑</el-button>
            <span v-if="scope.row.status !=1 && scope.row.status !=2">
              <el-button v-if="scope.row.isUsable == 0" @click="onClickStop(scope.row,1)" type="primary" plain size="small">停用
              </el-button>
              <el-button v-else-if="scope.row.isUsable == 1" @click="onClickStop(scope.row,0)" type="primary" plain size="small">启用
              </el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="航线ID" align="center" width="80"></el-table-column>
        <el-table-column prop="name" label="航线路径" align="center" width=""></el-table-column>
        <el-table-column prop="departureAirport" label="起飞场地" align="center" width="250"></el-table-column>
        <el-table-column label="创建公司" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.generalAviationCompanyId ? scope.row.generalAviationCompanyName : '常用航线'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center" width="150"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间" align="center"  width="160"></el-table-column>
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
        currentPage: 1,
        pageSize: 10,
        total: 0,
        form: {
          airLineName: "",
          upAirPort: "",
          companyName: ""
        },
        tableData: [],
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
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', tool.watchScroll);
      })
    },
    methods: {
      _initData() {
        this.getQueryParams();
        this.asyncGetAirlineListData();
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseFloat(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseFloat(params.pageSize) : 10;
        this.form.airLineName = params.airLineName ? params.airLineName : "";
        this.form.upAirPort = params.upAirPort ? params.upAirPort : "";
        this.form.companyName = params.companyName ? params.companyName : "";
      },
      //点击--删除
      onClickDelBtn(id) {
        this.$confirm('是否删除此航线?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.asyncDeleteAirLine(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //删除
      asyncDeleteAirLine(id) {
        this.$axios.get("/airline/deleteAirline?id=" + id).then((res) => {
          if(res.data.code === 200) {
            this.asyncGetAirlineListData();
          }
        })
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
          this.$axios.get('/airline/updateAirlineIsUsable', {
            params: {
              id: row.id,
              isUsable: status
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.asyncGetAirlineListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        });
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAirlineListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          airLineName: "",
          upAirPort: "",
          companyName: ""
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAirlineListData();
      },
      //跳转至查看页
      jumpToCheckAirline(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            lineId: id
          }
        );
        this.$router.push({
          path: "/airLineManage/msgInfo/check",
          query: params
        })
      },
      //跳转至编辑页
      jumpToEditAirline(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            lineId: id
          }
        );
        this.$router.push({
          path: "/airLineManage/edit",
          query: params
        })
      },
      //跳转至复制页
      jumpToCopyAirline(id) {
        this.$router.push({
          path: "/airLineManage/copy",
          query: {
            lineId: id
          }
        })
      },
      //跳转至添加页
      jumpToAddAirLine() {
        this.$router.push({
          path: "/airLineManage/add"
        })
      },
      //获取航线列表
      asyncGetAirlineListData() {
        this.$axios.get("/airline/getBackAirlineList", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.form.airLineName,
            departureAirport: this.form.upAirPort,
            generalAviationCompanyName: this.form.companyName
          }
        }).then((res) => {
          if(res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
            this.loading = false;
          }else {
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
        this.asyncGetAirlineListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAirlineListData();
      },
    },
    watch: {
      $route(to, from) {
        if(to.path == "/airLineManage") {
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
  .btn-open-close{
    display: inline-block;
    margin-left: 10px;
  }
</style>
