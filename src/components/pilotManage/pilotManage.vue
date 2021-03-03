<template>
  <div class="pilotManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/pilotManage' }">飞行员管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" ref="form" labelWidth="100px">
        <el-form-item label="姓名：">
          <el-input v-model.trim="form.name" placeholder="飞行员姓名" clearable @keyup.enter.native="onClickQueryByParams"></el-input>
        </el-form-item>
        <el-form-item label="执照类型：">
          <el-select v-model="form.pilotLicenseTypeId" filterable clearable style="width:203px">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in flyCardTypeList" :label="item.name" :value="item.id"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属企业：" label-width="130px">
          <el-select v-model="form.generalAviationCompanyId" filterable clearable style="width:203px">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(task, index) in enterpriseList" :label="task.name" :value="task.id"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人：" label-width="100px">
          <el-select v-model="form.creatorId" filterable clearable style="width:203px">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in operatorList" :label="item.name" :value="item.id"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="核验状态：" label-width="100px">
          <el-select v-model="form.audit_status" filterable clearable style="width:203px">
            <el-option label="全部" value=""></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
            <el-option label="未提交" value="3"></el-option>
            <el-option label="待审核" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button class="query" type="primary" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <el-button class="export" :type="disableAudit ? 'primary' : 'info'" :disabled="!disableAudit" @click="onClickAudit">批量核验</el-button>
      </div>
      <div class="table-container">
        <span class="table-checkbox-flag" v-if="showCheckboxFlag"><el-checkbox v-model="defaultChecked" disabled></el-checkbox></span>
        <el-table
        :data="tableData"
        v-loading="loading"
        border
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          fixed
          :selectable='checkboxInit'
          width="55">
        </el-table-column>
        <el-table-column label="操作" fixed align="left" header-align="center" width="150">
          <template slot-scope="scope">
            <el-button @click="jumpToCheckPilot(scope.row.id)" type="primary"
                       plain size="small">查看</el-button>
            <el-button type="primary" size="small"
                         v-if="scope.row.isVerified === 4"
                         @click="jumpToOnAuditPilot(scope.row.id)"> 核验</el-button>
          </template>
        </el-table-column>
        <el-table-column label="核验状态" fixed align="center" width="130">
          <template  slot-scope="scope">
            <span v-show="scope.row.isVerified === 1" class="passed-text-color">已通过</span>
            <span v-show="scope.row.isVerified === 3">未提交</span>
            <span v-show="scope.row.isVerified === 4" class="audited-text-color">待审核</span>
            <span v-show="scope.row.isVerified === 2" class="fail-text-color">未通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="150"></el-table-column>
        <el-table-column prop="sexName" label="性别" align="center" width="150"></el-table-column>
        <el-table-column label="执照类型" align="center" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.pilotLicenseTypeCount > 1">
              <span>{{ scope.row.pilotLicenseType }}</span>
              <el-popover trigger="hover" placement="top" class="tagStyle">
                <p>多个执照,请进详情查看</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">···</el-tag>
                </div>
              </el-popover>
            </div>
            <span v-else>{{ scope.row.pilotLicenseType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执照号" align="center" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.pilotLicenseTypeCount > 1">
              <span>{{ scope.row.licenseNumber }}</span>
              <el-popover trigger="hover" placement="top" class="tagStyle">
                <p>多个执照号,请进详情查看</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">···</el-tag>
                </div>
              </el-popover>
            </div>
            <span v-else>{{ scope.row.licenseNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="所属企业" align="center" width="200"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间" align="center" width="200"></el-table-column>
        <el-table-column prop="creator" label="操作人" align="center"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" align="center" width="200"></el-table-column>
      </el-table>
      </div>
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
    <el-dialog title="飞行员核验" :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :before-close="handleClose">
      <el-form :model="checkForm"  ref="checkForm" label-width="80px" >
        <el-form-item label="" style="margin-bottom: 0;">
          <el-radio v-model="checkForm.status" label="1">通过</el-radio>
          <el-radio v-model="checkForm.status" label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item label=""  style="margin-bottom: 0;">
          <el-input v-model="checkForm.content" :rows="3" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom: 10px;">
        <el-button type="primary" class="query" @click="auditSelectedPilots">确定</el-button>
        <el-button class="second-btn" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
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
          name: "",
          creatorId: "",
          pilotLicenseTypeId: "",
          generalAviationCompanyId: "",
          audit_status: ""
        },
        checkForm: {
          status: "1",
          content: ""
        },
        tableData: [],
        multipleSelection: [],
        flyCardTypeList: [],
        enterpriseList: [],
        operatorList: [],
        dialogFormVisible: false,
        defaultChecked: false,
        showCheckboxFlag: true,
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
        this.asyncGetPilotListData();  //获取表格数据
        this.asyncGetFlyCardTypeListData();    //获取执照类型列表
        this.asyncGetEnterpriseListData(); //获取企业列表
        this.asyncGetOperatorListData();   //获取操作员列表
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.creatorId = params.creatorId ? parseInt(params.creatorId) : "";
        this.form.pilotLicenseTypeId = params.pilotLicenseTypeId ? parseInt(params.pilotLicenseTypeId) : "";
        this.form.generalAviationCompanyId = params.generalAviationCompanyId ? parseInt(params.generalAviationCompanyId) : "";
        this.form.name = params.name ? params.name : "";
        this.form.audit_status = params.audit_status ? params.audit_status : "";
      },
      //表格选中行回调
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //处理需要审核的数据
      checkboxInit(row){
        if (row.isVerified === 4) {
          return 1;//可勾选
        } else {
          return 0;//不可勾选
        }
      },
      //弹框确认
      auditSelectedPilots() {
        this.$refs['checkForm'].validate((valid) => {
          if (valid) {
            this.onClickAudiTing();
          }
        });
      },
      //弹框关闭
      handleClose() {
        this.dialogFormVisible = false;
        this.checkForm.content = '';
        this.checkForm.status = '1';
      },
      //点击--批量核验
      onClickAudit(){
        if (this.multipleSelection.length !== 0) {
          this.dialogFormVisible = true;
        } else {
          this.$message.warning('请先选择需要核验的飞行员');
        }
      },
      //确定提交审核
      onClickAudiTing(){
        if(this.checkForm.status === '2' && !this.checkForm.content) {
            this.$message.error('请输入驳回意见');
        }else {
          let _AuditData = [];
          this.multipleSelection.forEach((item) => {
            _AuditData.push(item.id);
          });
          this.$axios.get('/pilot/auditBackPilot', {
            params: {
              ids: _AuditData.join(','),
              isVerified: this.checkForm.status, //审核状态  和意见 预留
              comment: this.checkForm.content,
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.dialogFormVisible = false;
              this.checkForm.status = '1';
              this.checkForm.content = '';
              this.asyncGetPilotListData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          name: "",
          creatorId: "",
          pilotLicenseTypeId: "",
          generalAviationCompanyId: "",
          audit_status: ""
        };
        this.pageSize = 10;
        this.currentPage = 1;
        this.asyncGetPilotListData();
      },
      //点击--查看
      jumpToCheckPilot(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            id: id
          },
        );
        this.$router.push({
          path:'/pilotManage/check',
          query: params
        })
      },
      //点击--核验
      jumpToOnAuditPilot(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            id: id,
            type: 1
          }
        );
        this.$router.push({
          path:'/pilotManage/onAudit',
          query: params
        })
      },
      //获取飞行单位-列表
      asyncGetEnterpriseListData() {
        this.$axios.get('/aviationcompany/getCompanylList')
          .then((res) => {
            if (res.data.code === 200) {
              this.enterpriseList = [];
              this.enterpriseList = this.enterpriseList.concat(res.data.data);
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      //获取操作人-列表
      asyncGetOperatorListData() {
        this.$axios.get('/user/getUserlList')
          .then((res) => {
            if (res.data.code === 200) {
              this.operatorList = [];
              this.operatorList = this.operatorList.concat(res.data.data);
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      //获取执照类型-列表
      asyncGetFlyCardTypeListData() {
        this.$axios.get('/pilotLicenseType/getPilotLicenseTypeList')
          .then((res) => {
            if (res.data.code === 200) {
              this.flyCardTypeList = [];
              this.flyCardTypeList = this.flyCardTypeList.concat(res.data.data);
            } else {
              this.$message.error(res.data.msg);
            }
          })
      },
      //获取飞行员列表
      asyncGetPilotListData() {
        this.$axios.get('/pilot/getBackPilotList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            name: this.form.name,
            pilotLicenseTypeId: this.form.pilotLicenseTypeId,
            generalAviationCompanyId: this.form.generalAviationCompanyId,
            creatorId: this.form.creatorId,
            isVerified: this.form.audit_status
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.showCheckboxFlag = true;

            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
            this.tableData.forEach((item) => {
              if(item.isVerified === 4) {
                this.showCheckboxFlag = false;
              }
            });
            tool.forbidUseCheckbox(this.showCheckboxFlag);
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //查询
      onClickQueryByParams() {
        this.asyncGetPilotListData();
      },
      //当前页展示条数改变
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetPilotListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetPilotListData();
      }
    },
    computed: {
      //提交审核按钮是否可用
      disableAudit () {
        if(this.tableData.length > 0) {
          return this.tableData.some(item => {
            return item.isVerified === 4;
          });
        } else {
          return false;
        }
      }
    },
    watch: {
      $route(to, from) {
        if(to.path == "/pilotManage") {
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

  .tagStyle {
    display: inline-block;
    cursor: pointer;
  }
  .audited-text-color {
    color: rgb(255, 219, 82);
  }
  .passed-text-color {
    color: #279b37;
  }
  .fail-text-color {
    color: #f44739;
  }
  .table-container {
    position: relative;
  }
  .table-checkbox-flag {
    position: absolute;
    left: 19px;
    top: 20px;
    z-index: 5;
  }

</style>
<style>
  .pilotManage-container .el-dialog .el-dialog__body{
    padding: 15px 20px;
  }
</style>
