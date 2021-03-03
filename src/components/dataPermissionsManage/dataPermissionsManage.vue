<template>
  <div class="ukeySetting-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" labelWidth="105px">
        <el-form-item label="角色名称：">
          <el-input v-model.trim="name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="系统区分：">
          <el-select v-model="systemNo" filterable clearable style="width:203px">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in systemListArr"
                       :label="item.name"
                       :value="item.id"
                       :key="index">
            </el-option>
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
        <el-button type="primary" class="query" @click="onClickAddUser">新增角色</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="permissionsListArr"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column label="操作" align="center" header-align="center" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain
                       @click="onClickEditCheckAndCheckData(scope.row.id,1)">编辑
            </el-button>
            <el-button type="primary"  size="small" plain
                       @click="onClickEditCheckAndCheckData(scope.row.id,2)">查看
            </el-button>
            <el-button type="primary"  size="small" plain
                       @click="onClickDelData(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="systemNo" label="所属系统" align="center" width="200"
                         :formatter="dataFormat"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
      </el-table>
      <el-pagination
        v-if="permissionsListArr.length > 0"
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
    <el-dialog :title="titleName"
               :close-on-click-modal="closeFlag"
               :before-close="onClickCancelPowerBtn"
               :visible.sync="isShowPowerDialog">
      <el-form labelWidth="120px">
        <el-form-item label="角色名称：" required>
          <el-input v-model.trim="userName" :maxlength="25" v-show="!isDisabled" placeholder="请输入角色名称" class="item-style"
                    clearable></el-input>
          <span v-show="isDisabled">{{userName}}</span>
        </el-form-item>
        <el-form-item label="系统区分：" required>
          <el-select v-model="systemId" filterable clearable v-show="!isDisabled"
                     @change="changeSystem"
                     class="item-style">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in systemListArr"
                       :label="item.name"
                       :value="item.id"
                       :key="index">
            </el-option>
          </el-select>
          <span v-show="isDisabled">
               <span v-show="systemId === '20'">申报系统</span>
               <span v-show="systemId === '10'">管制系统</span>
               <span v-show="systemId === '30'">运营系统</span>
          </span>
        </el-form-item>
        <el-form-item label="描述：" required>
          <el-input v-model.trim="desc" :maxlength="30" v-show="!isDisabled" placeholder="请输入描述" class="item-style"
                    clearable></el-input>
          <span v-show="isDisabled">{{desc}}</span>
        </el-form-item>
        <el-form-item label="配置权限：" required>
          <el-input
            v-show="systemId"
            class="item-style" clearable
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            v-if="systemId"
            @check="onClickCheckBox"
            :data="powerList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            class="tree-item"
            highlight-current
            :filter-node-method="filterNode"
            :check-strictly="flag"
            :props="defaultProps">
          </el-tree>
          <span v-show="!systemId">--</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickSurePowerBtn" v-show="!isDisabled">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelPowerBtn ">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        filterText: '',
        checkedPower: [], //选中的权限
        systemNo: '',//查询条件 系统
        name: '',//查询条件 角色名称
        userName: '',//弹框userName
        systemId: '',//弹框systemId
        userId: '',//弹框userId
        desc: '',//弹框描述
        flag: true,
        closeFlag: false,
        titleName: '新增角色权限',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        systemListArr: [
          {
            id: '20',
            name: "申报系统"
          },
          {
            id: '10',
            name: "管制系统"
          },
          {
            id: '30',
            name: "运营系统"
          }
        ],  //管制单位列表
        permissionsListArr: [],
        isShowPowerDialog: false,
        isChecked: false,
        loading: true,
        isDisabled: false,
        powerList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        allCheckedArr:[],//新增时默认全选中
        checkedArr:[]//点击选中的值
      }
    },
    async created() {
      await this.asyncGetPermissionsList();
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
      //弹框下拉框变动时
      changeSystem() {
        this.isChecked = true;
        this.commonGetTreeList();
      },
      //过滤列表系统数据
      dataFormat(val) {
        let systemName = '';
        if (val.systemNo === '10') {
          systemName = '管制系统';
        } else if (val.systemNo === '20') {
          systemName = '申报系统';
        } else if (val.systemNo === '30') {
          systemName = '运营系统';
        }
        return systemName;
      },
      //点击--复选框触发
      onClickCheckBox(ckd, data) {
        this.checkedPower = data.checkedKeys;
        /*this.checkedArr = [];
        data.checkedKeys.forEach(val => {
          this.checkedCheckBox(this.powerList,val);
        });
        this.checkedPower = [...new Set([...this.checkedArr, ...data.checkedKeys])];
        this.$refs.tree.setCheckedKeys(this.checkedPower);*/
      },
      //新增角色
      onClickAddUser() {
        this.titleName = '新增角色权限';
        this.isShowPowerDialog = true;
      },
      //点击--弹框的确定
      onClickSurePowerBtn () {
        if (!this.userName) {
          this.$message.error('请填写角色名称');
        } else if (!this.systemId) {
          this.$message.error('请选择对应系统');
        } else if (this.checkedPower.length === 0) {
          this.$message.error('请选择配置权限');
        } else if (!this.desc) {
          this.$message.error('请填写描述内容');
        } else {
          let url = this.userId ? '/role/updateBackRole' : '/role/saveBackRole';
          this.$axios.post(url, {
            id: this.userId,
            description: this.desc,
            systemNo: this.systemId,
            name: this.userName,
            powerNos: this.checkedPower
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success('保存成功');
              this.asyncGetPermissionsList();
              this.onClickCancelPowerBtn();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      },
      //点击--弹框取消
      onClickCancelPowerBtn () {
        this.isShowPowerDialog = false;
        this.isDisabled = false;
        this.systemId = '';
        this.userName = '';
        this.userId = '';
        this.filterText = '';
        this.desc = '';
        this.isChecked = false;
        this.checkedPower = [];
        this.allCheckedArr = [];
        this.$refs.tree.setCheckedKeys([]);
      },
      //点击--删除
      onClickDelData(id) {
        this.$confirm("", "确定要解除绑定吗？", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.asyncDeleteInfo(id)
        })
      },
      //点击--编辑
      onClickEditCheckAndCheckData(id, type) {
        if (type === 1) {
          this.titleName = '编辑角色权限';
        } else {
          this.titleName = '查看角色权限';
          this.isDisabled = true;
        }
        this.userId = id;
        this.asyncGetPermissionsUserInfo();
        this.isShowPowerDialog = true;

      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetPermissionsList()
      },
      //点击--重置
      onClickResetQueryParams() {
        this.name = '';
        this.systemNo = '';
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetPermissionsList()
      },
      //当前页展示条数改变
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetPermissionsList()
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetPermissionsList()
      },
      //删除数据
      asyncDeleteInfo(id) {
        this.$axios.get("/role/deleteBackRole", {
          params: {
            id: id
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success("删除成功！");
            this.asyncGetPermissionsList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取该条数据 权限信息
      asyncGetPermissionsUserInfo() {
        this.$axios.get('/role/getBackRoleInfo?id=' + this.userId).then(res => {
          if (res.data.code === 200) {
            this.systemId = res.data.data.systemNo;
            this.userName = res.data.data.name;
            this.desc = res.data.data.description;
            this.checkedPower = res.data.data.powerNos;
            if (this.systemId) {
              this.asyncGetPermissionsTreeList();
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //封装获取树
      commonGetTreeList() {
        if (this.systemId) {
          this.asyncGetPermissionsTreeList();
        }
      },
      //获取对应的权限树
      asyncGetPermissionsTreeList() {
        this.$axios.get('/power/getPowerTreeList?systemNo=' + this.systemId).then(res => {
          if (res.data.code === 200) {
            this.powerList = [];
            this.powerList = this.powerList.concat(res.data.data);
            this.$refs.tree.setCheckedKeys(this.checkedPower);
            if (this.isDisabled) {
              this.commonDisabled(this.powerList);
            }
            //当下拉框有变化，默认全选
            if (this.isChecked) {
              this.commonChecked(this.powerList);
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击选中子级关联父级
      checkedCheckBox(data,val) {
        data.forEach(item => {
          if (item.children && item.children.length>0) {
            item.children.forEach(v => {
              if (val === v.id) {
                this.checkedArr.push(item.id);
              }
              if(v.children.length>0 && v.children) {
                v.children.forEach(vc => {
                  if (val === vc.id) {
                    this.checkedArr.push(item.id,v.id);
                  }
                })
              }
            })
          }
        })
      },
      //默认禁用
      commonDisabled(data) {
        data.forEach(item => {
          if (item.id) {
            item.disabled = true;
          }
          if (item.children && item.children.length > 0) {
            item.children.forEach(v => {
              v.disabled = true;
              if(v.id && v.children.length > 0) {
                this.commonDisabled(v.children);
              }
            })
          }
        })
      },
      //默认全选中
      commonChecked(data) {
        data.forEach(item => {
          if (item.id) {
            this.allCheckedArr.push(item.id);
            if (item.children && item.children.length > 0) {
              item.children.forEach(val => {
                this.allCheckedArr.push(val.id);
                if(val.id && val.children.length > 0) {
                    this.commonChecked(val.children);
                }
              })
            }
          }
        });
        this.checkedPower = this.allCheckedArr;
        this.$refs.tree.setCheckedKeys(this.allCheckedArr);

      },
      //获取 权限数据列表
      asyncGetPermissionsList() {
        this.$axios.get("/role/getBackRoleList", {
          params: {
            name: this.name,
            systemNo: this.systemNo,
            pageSize: this.pageSize,
            pageNum: this.currentPage
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.permissionsListArr = [];
            this.permissionsListArr = this.permissionsListArr.concat(res.data.data.list);
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    }
  }
</script>
<style scoped>
  .query-btn-box {
    margin-left: 22px;
  }

  .dialog-footer {
    text-align: center;
  }

  .operate-btn-box {
    margin-bottom: 20px;
  }

  .tree-item {
    width: 300px;
    max-height: 220px;
    margin-top: 10px;
    overflow-y: auto;
  }

  .item-style {
    width: 300px;
  }
</style>

