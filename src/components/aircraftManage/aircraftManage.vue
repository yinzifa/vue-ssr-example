<template>
  <div class="aircraftManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/aircraftManage' }">航空器管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" labelWidth="130px">
        <el-form-item label="航空器型号：">
          <el-select v-model="form.modelId"  style="width:203px" filterable clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in allAircraftModelList"
              :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国籍登记号(机号)：">
          <el-input v-model.trim="form.certificateNum" clearable placeholder="请输入国籍登记号(机号)"></el-input>
        </el-form-item>
        <el-form-item label="航空器属性：">
          <el-select v-model="form.aircraftType"  style="width:203px" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="typeValue in machineTypeData" :key="typeValue.id" :label="typeValue.name"
                       :value="typeValue.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" label-width="130px">
          <el-select v-model="form.aircraftStatus"  style="width:203px" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
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
        <el-form-item label="所属企业：">
          <el-select v-model="form.companyId" placeholder="请选择" filterable clearable style="width:203px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in allCompanyList" :value="item.id" :label="item.name" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控设备号(IMEI)：">
          <el-input v-model.trim="form.imei" clearable placeholder="请输入监控设备号(IMEI)"></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button class="query" type="primary" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="operate-btn-box">
        <el-button class="export" :type="disableAudit ? 'primary' : 'info'" :disabled="!disableAudit" @click="onClickBatchAudit">批量核验</el-button>
      </div>
      <div class="table-container">
        <span class="table-checkbox-flag" v-if="showCheckboxFlag"><el-checkbox v-model="defaultChecked" disabled></el-checkbox></span>
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            align="center"
            fixed
            :selectable='checkboxInit'
            width="55">
          </el-table-column>
          <el-table-column label="操作" fixed header-align="center" align="left" width="150">
            <template slot-scope="scope">
              <el-button @click="jumpToCheckAircraft(scope.row.id, 1)" type="primary" plain size="small">查看</el-button>
              <el-button @click="jumpToCheckAircraft(scope.row.id, 2)" v-show="scope.row.isVerified != 1 && scope.row.isVerified != 2" type="primary" size="small">核验</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="isVerified" fixed label="核验状态" align="center" width="130">
            <template slot-scope="scope">
              <span v-show="scope.row.isVerified === 3" class="submitted-text-color">待提交</span>
              <span v-show="scope.row.isVerified === 4">待审核</span>
              <span v-show="scope.row.isVerified === 1" class="passed-text-color">已通过</span>
              <span v-show="scope.row.isVerified === 2" class="fail-text-color">未通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="航空器型号" align="center" width="200"></el-table-column>
          <el-table-column prop="certificateNum" label="国籍登记号(机号)" align="center" width="200"></el-table-column>
          <el-table-column prop="machineTypeName" label="航空器属性" align="center" width="150">
          </el-table-column>
          <el-table-column prop="airworthinessCertificate" label="适航证号/无人机序列号" align="center"
                           width="200"></el-table-column>
          <el-table-column prop="companyName" label="所属企业" align="center" width="200"></el-table-column>
          <el-table-column prop="createdTime" label="添加时间" align="center" width="200"></el-table-column>
          <el-table-column prop="creator" label="操作人" align="center"></el-table-column>
          <el-table-column prop="approvalTime" label="审核时间" align="center" width="200"></el-table-column>
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
    <el-dialog title="航空器核验" :visible.sync="showDialog"
               :close-on-click-modal="false"
               :before-close="handleClose">
      <el-form>
        <el-form-item label="">
          <el-radio v-model="status" label="1">通过</el-radio>
          <el-radio v-model="status" label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input v-model="content" :rows="3" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;margin-bottom: 10px;">
        <el-button type="primary" class="query" @click="onClickAuditSelectedPilots">确定</el-button>
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
        showDialog: false,
        defaultChecked: false,
        loading: true,
        showCheckboxFlag: true,
        content: "",
        status: "1",
        form: {
          modelId: "",  //航空器型号
          certificateNum: "", //航空器登记号
          aircraftType: "",   //航空器类型
          aircraftStatus: "1", //航空器状态
          companyId: "",       //飞行单位
          audit_status: "",    //核验状态
          imei: ""             //监控设备号
        },
        tableData: [],
        multipleSelection: [],
        allCompanyList: [],
        allAircraftModelList: [],
        machineTypeData: []
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
        this.asyncGetAircraftListData();   //获取飞行器列表数据
        this.asyncGetAerocraftModelListData();//获取所有航空器型号
        this.asyncGetCompanylListData();      //获取所有飞行单位下拉列表
        this.getMachineTypeData();   //获取航空器属性下拉列表
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.modelId = params.modelId ? parseInt(params.modelId) : "";
        this.form.companyId = params.companyId ? parseInt(params.companyId) : "";
        this.form.certificateNum = params.certificateNum ? params.certificateNum : "";
        this.form.aircraftType = params.aircraftType ? parseInt(params.aircraftType ): "";
        this.form.aircraftStatus = params.aircraftStatus ? params.aircraftStatus : "";
        this.form.audit_status = params.audit_status ? params.audit_status : "";
        this.form.imei = params.imei ? params.imei : "";
      },
      // 获取航空器属性
      getMachineTypeData() {
        this.$axios.get("/aerocraft/listMachineType").then(res => {
          if (res.data.code === 200) {
            this.machineTypeData = [];
            this.machineTypeData = this.machineTypeData.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg)
          }
        });
      },
      //获取飞行单位下拉列表
      asyncGetCompanylListData() {
        this.$axios.get('/aviationcompany/getCompanylList').then( res => {
          if(res.data.code === 200) {
            this.allCompanyList = [];
            this.allCompanyList = this.allCompanyList.concat(res.data.data)
          }else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAircraftListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          modelId: "",  //航空器型号
          certificateNum: "", //航空器登记号
          aircraftType: "",   //航空器类型
          aircraftStatus: "1", //航空器状态
          companyId: "",       //飞行单位
          audit_status: "",    //核验状态
          imei: ""
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAircraftListData();
      },
      //点击--批量核验
      onClickBatchAudit() {
        if (this.multipleSelection.length > 0) {
          this.showDialog = true;
        } else {
          this.$message.error("请先选择需要核验的航空器");
        }
      },
      //点击dialog--关闭、取消按钮
      handleClose() {
        this.showDialog = false;
      },
      //处理需要审核的数据
      checkboxInit(row) {
        if (row.isVerified !== 1 && row.isVerified !== 2) {
          return 1;//可勾选
        } else {
          return 0;//不可勾选
        }
      },
      //选择的需批量审核的值
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击dialog--确定
      onClickAuditSelectedPilots() {
        if (this.status == '2' && !this.content) {
          this.$message.error('请输入驳回意见');
          return;
        }
        let _AuditData = [];
        this.multipleSelection.forEach((item) => {
          _AuditData.push(item.id);
        });
        this.$axios.get('/backstageaerocraft/auditAerocraft', {
          params: {
            ids: _AuditData.join(','),
            isVerified: this.status, //审核状态  和意见 预留
            remark: this.content
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            this.showDialog = false;
            this.asyncGetAircraftListData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击--查看
      jumpToCheckAircraft(id, flag) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            id: id,
            actionType: flag
          }
        );
        this.$router.push({
          path: '/aircraftManage/check',
          query: params
        })
      },
      //获取航空器型号下拉列表
      asyncGetAerocraftModelListData() {
        this.$axios.get('/backstageaerocraft/getAerocraftModelList').then(res => {
          if (res.data.code === 200) {
            this.allAircraftModelList = [];
            this.allAircraftModelList = this.allAircraftModelList.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取列表查询数据
      asyncGetAircraftListData() {
        this.$axios.get('/backstageaerocraft/getAerocraftList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            modelId: this.form.modelId,
            certificateNum: this.form.certificateNum,
            machineType: this.form.aircraftType,
            aircraftStatus: this.form.aircraftStatus,
            companyId: this.form.companyId,
            isVerified: this.form.audit_status,
            imei: this.form.imei
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.showCheckboxFlag = true;
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
            this.tableData.forEach((item) => {
              if(item.isVerified !== 1 && item.isVerified !== 2) {
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
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetAircraftListData();
      },
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAircraftListData();
      }
    },
    computed: {
      //提交审核按钮是否可用
      disableAudit () {
        if(this.tableData.length > 0) {
          return this.tableData.some(item => {
            return item.isVerified !== 1 && item.isVerified !== 2;
          });
        } else {
          return false;
        }
      }
    },
    watch: {
      $route(to, from) {
        if(to.path == "/aircraftManage") {
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
    margin-bottom: 15px;
  }
  .passed-text-color {
    color: #279b37;
  }
  .fail-text-color {
    color: #f44739;
  }
  .submitted-text-color {
    color: #a7a7a7;
  }
  .table-container {
    position: relative;
  }
  .table-checkbox-flag {
    position: absolute;
    left: 19px;
    top: 20px;
  }
</style>
<style>
  .aircraftManage-container .query-box .el-form-item__label {
    width: 140px !important;
  }
</style>
