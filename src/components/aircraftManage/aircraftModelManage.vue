<template>
  <div class="aircraftManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/aircraftManage' }">航空器管理</el-breadcrumb-item>
      <el-breadcrumb-item>航空器型号列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" label-width="140px">
        <el-form-item label="航空器型号名称：">
            <el-input v-model.trim="form.name" clearable placeholder="请输入航空器型号名称"></el-input>
        </el-form-item>
        <el-form-item label="航空器属性：">
          <el-select v-model="form.machineType" @change="changeMachineType" style="width:203px" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="有人机" value="1"></el-option>
            <el-option label="无人机" value="2"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="航空器制造商：">
          <el-select v-model="form.aerocraftManufacturerId" filterable style="width:240px" clearable>
            <el-option v-for="(item, index) in aerocraftManufacturerData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="航空器类型：">
          <el-select v-model="form.aircraftType"  style="width:203px" clearable>
            <el-option v-for="(item) in aircraftTypeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
        <el-button type="primary" @click="jumpToAddAircraft">添加航空器型号</el-button>
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
          <el-table-column prop="name" label="航空器型号" align="center" width="250"></el-table-column>
          <el-table-column prop="aerocraftManufacturer" label="制造厂商名称" align="center" min-width="250"></el-table-column>
          <el-table-column prop="machineTypeName" label="设备类型" align="center" width="250"></el-table-column>
          <el-table-column prop="aircraftTypeName" label="航空器类型" align="center" width="250"></el-table-column>
          <el-table-column prop="createdTime" label="创建时间" align="center" width="250"></el-table-column>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        status: "1",
        form: {
          name: "",  // 航空器型号名称
          machineType: "", // 航空器属性
          aircraftType: "",   //航空器类型
          aerocraftManufacturerId: "" // 制造厂商id
        },
        tableData: [],
        aircraftTypeData: [
          {id: 1, name: '固定翼'},
          {id: 2, name: '直升机'},
          {id: 3, name: '超轻型'},
          {id: 4, name: '其他'},
          {id: 1, name: '多旋翼'},
          {id: 2, name: '固定翼'},
          {id: 3, name: '直升机'},
          {id: 4, name: '垂直起降固定翼'},
          {id: 5, name: '自转旋翼'},
          {id: 6, name: '飞艇'},
          {id: 7, name: '其他'}
        ],
        aerocraftManufacturerData: []
      }
    },
    created() {
      this._initData();
    },
    methods: {
      _initData() {
        this.getQueryParams();
        this.changeMachineType();
        this.asyncGetAircraftListData();   //获取飞行器列表数据
        this.getAerocraftManufacturer(); // 获取航空器制造商
      },
      //获取查询条件参数
      getQueryParams() {
        let params = this.$route.query;
        this.pageNum = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        this.form.name = params.name ? params.name : "";
        this.form.machineType = params.machineType ? params.machineType : "";
        this.form.aircraftType = params.aircraftType ? params.aircraftType : "";
        this.form.aerocraftManufacturerId = params.aerocraftManufacturerId ? params.aerocraftManufacturerId : "";
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAircraftListData();
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          name: "",
          machineType: "",
          aircraftType: "",
          aerocraftManufacturerId: ""
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAircraftListData();
      },
      // 点击--添加航空器
      jumpToAddAircraft() {
        this.$router.push({
          path: '/addAircraftModelManage/add'
        })
      },
      //点击--查看
      onClickShowCheckDialog(id) {
        let params = Object.assign({}, this.form,
          {
            pageSize: this.pageSize,
            currentPage: this.currentPage},
          {
            id: id,
          }
        );
        this.$router.push({
          path: '/checkaircraftModelManage/check',
          query: params
        })
      },
      // 点击--编辑
      onClickShowEditDialog(id) {
        let params = Object.assign({}, this.form,
            {
                pageSize: this.pageSize,
                currentPage: this.currentPage},
            {
                id: id,
            }
        );
        this.$router.push({
        path: '/addAircraftModelManage/add',
        query: params
        })
      },
      // 点击--删除
      async delCur(id) {
          const resConfirm = await this.$confirm('是否删除该数据？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).catch(error => error)
        if(resConfirm == 'confirm') {
            this.$axios.get('/aerocraftModel/deleteAerocraftModel', {
                params: {
                    id: id
                }
            }).then((res) => {
                if (res.data.code === 200) {
                  this.asyncGetAircraftListData()
                  this.$message.success('删除成功!')
                }else {
                  this.$message.error(res.data.msg);
                }
            })
        }
      },
      //获取列表查询数据
      asyncGetAircraftListData() {
        this.$axios.get('/aerocraftModel/getAerocraftModelList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            name: this.form.name,
            aerocraftManufacturerId: this.form.aerocraftManufacturerId,
            machineType: this.form.machineType,
            aircraftType: this.form.aircraftType,
          }
        }).then((res) => {
          if(res.data.code == 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
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
      },
      // 切换设备类型
      changeMachineType() {
        this.form.aerocraftManufacturerId = '';
          if(this.form.machineType == 1) {
            this.aircraftTypeData = [
                {id: 1, name: '固定翼'},
                {id: 2, name: '直升机'},
                {id: 3, name: '超轻型'},
                {id: 4, name: '其他'}
            ]
          }else if(this.form.machineType == 2) {
            this.aircraftTypeData = [
                {id: 1, name: '多旋翼'},
                {id: 2, name: '固定翼'},
                {id: 3, name: '直升机'},
                {id: 4, name: '垂直起降固定翼'},
                {id: 5, name: '自转旋翼'},
                {id: 6, name: '飞艇'},
                {id: 7, name: '其他'}
            ]
          }else {
              this.aircraftTypeData = [
                {id: 1, name: '固定翼'},
                {id: 2, name: '直升机'},
                {id: 3, name: '超轻型'},
                {id: 4, name: '其他'},
                {id: 1, name: '多旋翼'},
                {id: 2, name: '固定翼'},
                {id: 3, name: '直升机'},
                {id: 4, name: '垂直起降固定翼'},
                {id: 5, name: '自转旋翼'},
                {id: 6, name: '飞艇'},
                {id: 7, name: '其他'}
              ]
          }
          this.getAerocraftManufacturer();
      },
      // 获取航空器制造商
        getAerocraftManufacturer() {
            this.$axios.get('/aerocraftManufacturer/listGerocraftManufacturer', {
            params: {
                machineType: this.form.machineType
            }
            }).then((res) => {
            if(res.data.code == 200) {
                this.aerocraftManufacturerData = [];
                this.aerocraftManufacturerData = this.aerocraftManufacturerData.concat(res.data.data);
            }
            this.loading = false;
            })
        },
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
        width: 240px;
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
</style>
