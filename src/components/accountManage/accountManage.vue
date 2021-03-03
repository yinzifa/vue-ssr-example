<template>
  <div class="accountManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" labelWidth="100px">
        <el-form-item label="企业管理员 : ">
          <el-input v-model="form.name" placeholder="企业管理员" clearable></el-input>
        </el-form-item>
        <el-form-item label="认证状态 : ">
          <el-select v-model="form.is_verified" clearable style="width:203px">
            <el-option label="全部" value=""></el-option>
            <el-option label="待认证" value="0"></el-option>
            <el-option label="已认证" value="1"></el-option>
            <el-option label="未认证" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业状态 : ">
          <el-select v-model="form.company_status" clearable style="width:203px">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="冻结" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称 : ">
          <el-select v-model="form.company_id" filterable clearable style="width:203px">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in companyNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型 : ">
          <el-select v-model="form.register_type" filterable clearable style="width:203px">
            <el-option label="全部" value=""></el-option>
            <el-option label="企业" value="2"></el-option>
            <el-option label="机场" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button class="query" type="primary" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        v-loading="loading"
        border>
        <el-table-column label="详情" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="jumpToCheckAccount(scope.row.id,'1')">查看</el-button>
            <el-button v-show="scope.row.isVerified === 0" type="primary" plain size="small" @click="jumpToCheckAccount(scope.row.id, '2')">认证</el-button>
            <el-button v-show="scope.row.companyStatus === 1 && scope.row.isVerified === 1" type="primary" plain size="small" @click="onClickSwitchFreeze(scope.row.id, 1)">冻结</el-button>
            <el-button v-show="scope.row.companyStatus === 2 && scope.row.isVerified === 1" type="primary" plain size="small" @click="onClickSwitchFreeze(scope.row.id, 2)">激活</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="isVerified" label="认证状态" align="center" width="90">
          <template  slot-scope="scope">
            <span v-show="scope.row.isVerified === 0" class="certified-text-color">待认证</span>
            <span v-show="scope.row.isVerified === 1" class="passed-text-color">已通过</span>
            <span v-show="scope.row.isVerified === 2" class="fail-text-color">未通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="单位名称" align="center" width="200"></el-table-column>
        <el-table-column prop="registerType" label="用户类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.registerType === 2">企业</span>
            <span v-else-if="scope.row.registerType === 3">机场</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式" align="center" width="200"></el-table-column>
        <el-table-column prop="name" label="企业管理员" align="center" width="200"></el-table-column>
        <el-table-column prop="createdTime" label="注册时间" align="center" width="160"></el-table-column>
        <el-table-column prop="verifiedTime" label="认证时间" align="center" width="160"></el-table-column>
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
        companyNameList: [],
        form: {
          username: "",
          name: "",
          is_verified: "",
          company_id: "",
          company_status: "",
          company_name: "",
          register_type: "",
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
        this.asyncGetAccountListData();
        this.asyncGetCompanyNameListData();
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.company_id = params.company_id ? parseInt(params.company_id) : "";
        this.form.register_type = params.register_type ? params.register_type : "";
        this.form.company_status = params.company_status ? params.company_status : "";
        this.form.name = params.name ? params.name : "";
        this.form.is_verified = params.is_verified ? params.is_verified : "";
      },
      //获取飞行单位下拉列表
      asyncGetCompanyNameListData() {
        this.$axios.get("/common/getCompanyNameList").then(res => {
          if(res.data.code === 200) {
            this.companyNameList = [];
            this.companyNameList = this.companyNameList.concat(res.data.data);
          }else {
            this.$message({
              type: 'error',
              message: res.data.msg,
              duration: 1200
            })
          }
        })
      },
      //跳转至查看页
      jumpToCheckAccount(id, isVerified) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            id: id,
            audit: isVerified
          }
        );
        this.$router.push({
          path: '/accountManage/checkAccount',
          query: params
        })
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          name: "",
          is_verified: "",
          company_status: "",
          company_id: "",
          register_type: "",
        };
        this.pageSize = 10;
        this.currentPage = 1;
        this.asyncGetAccountListData();
      },
      //获取用户列表
      asyncGetAccountListData() {
        this.$axios.get('/backstageuser/getCompanyList',{
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            name: this.form.name,
            companyStatus: this.form.company_status,
            isVerified: this.form.is_verified,
            companyId: this.form.company_id,
            registerType: this.form.register_type,
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
          } else {
           this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //查询
      onClickQueryByParams() {
        this.asyncGetAccountListData();
      },
      //点击弹框冻结/激活
      onClickSwitchFreeze (id, status) {
        let title = "";
        let url = "";
        if(status === 1 ) {
          title = "是否冻结账户";
          url = "/backstageuser/freezeCompany";
        }else {
          title = "是否激活账户";
          url = "/backstageuser/startCompany";
        }
        this.$confirm('', title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then( () => {
          this.onClickConfirmSwitchBtn(url, id);
        })
      },
      //点击确认冻结/激活
      onClickConfirmSwitchBtn (url, id) {
        this.$axios.post(url, {
          companyId: id
        }).then(res => {
          if(res.data.code === 200) {
            this.asyncGetAccountListData();
          }
        })
      },
      //点击认证
      clickToVerify (id, isVerified) {
        this.$axios.post('/user/authCompany', {
          companyId: id,
          isVerified: isVerified
        }).then(res => {
          if(res.data.code === 200) {
            this.asyncGetAccountListData();
          }
        })
      },
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetAccountListData();
      },
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAccountListData();
      }
    },
    watch: {
      $route(to, from) {
        if(to.path == "/accountManage") {
          this._initData()
        }
      }
    }
  }
</script>
<style scoped>
  .query-box .el-form {
    min-width: 1050px;
    margin: 0 auto;
  }
  .query-btn-box {
    margin-left: 17px;
  }
  .certified-text-color {
    color: #FFDB52;
  }
  .passed-text-color {
    color: #279b37;
  }
  .fail-text-color {
    color: #f44739;
  }
</style>
