<template>
  <div class="aircraftManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/aircraftManage' }">航空器管理</el-breadcrumb-item>
      <el-breadcrumb-item>航空器制造商列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" label-width="160px">
        <el-form-item label="航空器制造商名称：">
          <el-input v-model.trim="form.manufacturerName" clearable placeholder="请输入航空器制造商名称"></el-input>
        </el-form-item>
        <el-form-item label="航空器设备类型：">
          <el-select v-model="form.aircraftType" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="有人机" value="1"></el-option>
            <el-option label="无人机" value="2"></el-option>
            <el-option label="都生产" value="3"></el-option>
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
        <el-button type="primary" @click="onClickShowAddDialog">添加航空器制造商</el-button>
      </div>
      <div class="table-container">
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          style="width: 100%">
          <el-table-column label="操作" fixed header-align="center" align="center" width="300">
            <template slot-scope="scope">
              <el-button @click="onClickShowCheckDialog(scope.row.id)" type="primary" size="small" plain>查看</el-button>
              <el-button @click="onClickShowEditDialog(scope.row.id)" type="primary" size="small" plain>编辑</el-button>
              <el-button @click="delCur(scope.row.id)" type="primary" size="small" plain>删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="制造商名称" align="center" min-width="300"></el-table-column>
          <el-table-column prop="produceMachineType" label="设备类型" align="center" width="300">
              <template slot-scope="scope">
                  {{scope.row.produceMachineType == 2 ? '无人机' : scope.row.produceMachineType == 1 ? '有人机' : '都生产'}}
              </template>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" align="center" width="300"></el-table-column>
          <el-table-column prop="updatedTime" label="更新时间" align="center" width="300"></el-table-column>
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
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" @close="handleClose('ruleForm')">
        <el-form v-if="showAdd" :model="dialogForm"  ref="ruleForm" :rules="rules">
            <el-form-item label="制造商名称:" label-width="150px" prop="name">
                <el-input v-model="dialogForm.name"  placeholder="请输入制造商名称"></el-input>
            </el-form-item>
            <el-form-item label="设备类型:" label-width="150px" prop="produceMachineType">
                <el-select v-model="dialogForm.produceMachineType" :disabled="!isAddOrCheck">
                    <el-option label="有人机" value="1"></el-option>
                    <el-option label="无人机" value="2"></el-option>
                    <el-option label="都生产" value="3"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="check-dialog" v-if="showCheck">
            <el-row>
                <el-col :span="6">
                    <p class="check-title">厂商名称:</p>
                </el-col>
                <el-col :span="18">
                    <p>{{this.checkName}}</p>
                </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="check-title">航空器设备类型:</p>
                </el-col>
                <el-col :span="18">
                    <p>{{this.checkProduceMachineType == 1 ? '有人机' : this.checkProduceMachineType == 2 ? '无人机' : '都生产'}}</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="check-title">创建时间:</p>
                </el-col>
                <el-col :span="18">
                    <p>{{this.checkCreatedTime}}</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <p class="check-title">更新时间:</p>
                </el-col>
                <el-col :span="18">
                    <p>{{this.checkUpdatedTime}}</p>
                </el-col>
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button v-if="showAdd" @click="handleClose('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="savaData('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        showDialog: false,
        loading: true,
        form: {
          manufacturerName: "", // 航空器制造商名称
          aircraftType: "" // 航空器类型
        },
        tableData: [],
        dialogForm: {
            name: '',
            produceMachineType: ''
        },
        rules: {
            name: [
                {required: true, message: '请输入航空器制造商', trigger: 'blur'}
            ],
            produceMachineType: [
                {required: true, message: '请选择航空器设备类型', trigger: 'blur,change'}
            ]
        },
        checkName: '',
        checkProduceMachineType: '',
        checkCreatedTime: '',
        checkUpdatedTime: '',
        showAdd: false, // 是否显示添加dialog
        showCheck: false, // 是否显示查看dialog
        isAddOrCheck: true, // 判断是添加还是编辑
        aircraftId: '', // 航空器id
        dialogTitle: '新增航空器制造商'
      }
    },
    created() {
      this._initData();
    },
    methods: {
      _initData() {
        this.getQueryParams();
        this.asyncGetAircraftListData();   //获取飞行器列表数据
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.manufacturerName = params.name ? params.name : "";
        this.form.aircraftType = params.produceMachineType ? params.produceMachineType : "";
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAircraftListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          manufacturerName: "", // 航空器登记号
          aircraftType: "" // 航空器类型
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAircraftListData();
      },
      // 点击--添加航空器
      onClickShowAddDialog() {
        this.dialogTitle = '新增航空器制造商';
        this.isAddOrCheck = true;
        this.showAdd = true;
        this.showDialog = true;
      },
      //点击--查看
      onClickShowCheckDialog(id) {
        this.dialogTitle = '查看航空器制造商';
        this.showCheck = true;
        this.showDialog = true;
        this.$axios.get('/aerocraftManufacturer/getAerocraftManufacturerInfo', {
            params: {
                id: id
            }
        }).then((res) => {
            if (res.data.code === 200) {
                this.checkName = res.data.data.name;
                this.checkProduceMachineType = res.data.data.produceMachineType;
                this.checkCreatedTime = res.data.data.createdTime;
                this.checkUpdatedTime = res.data.data.updatedTime;
            } else {
            this.$message.error('获取数据失败!');
            }
            this.loading = false;
        })
      },
      // 点击--编辑
      onClickShowEditDialog(id) {
        this.dialogTitle = '编辑航空器制造商';
        this.isAddOrCheck = false;
        this.aircraftId = id;
        this.$axios.get('/aerocraftManufacturer/getAerocraftManufacturerInfo', {
            params: {
                id: id
            }
        }).then((res) => {
            if (res.data.code === 200) {
                this.dialogForm.name = res.data.data.name;
                this.dialogForm.produceMachineType = (res.data.data.produceMachineType).toString();
            } else {
                this.$message.error(res.data.msg);
            }
            this.loading = false;
        })
        this.showAdd = true;
        this.showDialog = true;
      },
      // 点击--删除
      async delCur(id) {
        const resConfirm = await this.$confirm('是否删除该数据？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).catch(error => error)
        if(resConfirm == 'confirm') {
            this.$axios.get('/aerocraftManufacturer/deleteAerocraftManufacturer', {
                params: {
                    id: id
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    this.asyncGetAircraftListData();
                    this.$message.success('删除成功!')
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        }
      },
      //点击dialog--关闭、取消按钮
      handleClose(formName) {
        this.showDialog = false;
        this.showAdd = false;
        this.showCheck = false;
        this.dialogForm.name = '';
        this.dialogForm.produceMachineType = '';
        if(this.showAdd || this.showCheck) {
            this.$refs[formName].resetFields();
        }
      },
      //点击dialog--确定
      savaData(formName) {
        if(this.showAdd) {
            let _url = '';
            let params = {}
            if(this.isAddOrCheck) {
                _url = '/aerocraftManufacturer/saveAerocraftManufacturer';
                params = {
                    name: this.dialogForm.name,
                    produceMachineType: this.dialogForm.produceMachineType
                }
            }else {
                _url = '/aerocraftManufacturer/updateAerocraftManufacturer';
                params = {
                    id: this.aircraftId,
                    name: this.dialogForm.name,
                    produceMachineType: this.dialogForm.produceMachineType
                }
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post(_url, params).then((res) => {
                        if (res.data.code !== 200) return this.$message.error(res.data.msg)
                        this.showDialog = false;
                        this.showAdd = false;
                        this.showCheck = false;
                        this.$refs[formName].resetFields();
                        this.dialogForm.name = '';
                        this.dialogForm.produceMachineType = '';
                        this.$message.success('保存成功!');
                        this.asyncGetAircraftListData();
                    })
                } else {
                    return false;
                }
            });
        }
        if(this.showCheck) {
            this.showDialog = false;
            this.showAdd = false;
            this.showCheck = false;
        }
      },
      //获取列表查询数据
      asyncGetAircraftListData() {
        this.$axios.get('/aerocraftManufacturer/getAerocraftManufacturerList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            name: this.form.manufacturerName,
            produceMachineType: this.form.aircraftType
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
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetAircraftListData();
      },
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAircraftListData();
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
    .query-box .el-input {
        width: 300px;
    }
    .query-box .el-select {
        width: 200px;
    }
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
    .check-dialog .check-title {
        text-align: right;
        padding-right: 20px;
    }
    .check-dialog p {
        height: 36px;
        line-height: 36px;
    }
    .aircraftManage-container .el-dialog .el-input {
        width: 300px;
    }
</style>
