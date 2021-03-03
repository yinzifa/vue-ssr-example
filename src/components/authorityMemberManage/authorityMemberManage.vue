<template>
  <div class="ukeySetting-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" labelWidth="105px">
        <el-form-item label="用户类型：">
          <el-select v-model="form.managerType" clearable :disabled="isDisabled" @change="changeManagerTypeOnSelect">
            <el-option label="全部" value=""></el-option>
            <el-option label="管制用户" value="1"></el-option>
            <el-option label="后台用户" value="2"></el-option>
            <el-option label="民航用户" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构：">
          <el-select v-model="form.organizationId" clearable filterable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in organizationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称：">
          <el-select v-model="form.roleId" clearable filterable>
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="form.userName" placeholder="用户名" clearable style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="是否可用：">
          <el-select v-model="form.status" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="可用" value="1"></el-option>
            <el-option label="不可用" value="0"></el-option>
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
        <el-button type="primary" class="query" @click="onClickAddAuthority">新增</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="authorityMemberList"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column label="操作" align="center" header-align="center" width="400">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain
                       @click="onClickEditCheckAndCheckData(scope.row.id,2)">查看
            </el-button>
            <el-button type="primary" size="small" plain
                       @click="onClickEditCheckAndCheckData(scope.row.id,1)">编辑
            </el-button>
            <el-button type="primary" size="small" plain
                       @click="onClickChangeStatus(scope.row.id, scope.row.statusName)">
              {{scope.row.statusName === '可用' ? '禁用' : '启用'}}
            </el-button>
            <el-button type="primary" size="small" plain
                       @click="onClickChangePwd(scope.row.id)">重置密码
            </el-button>
            <el-button type="primary" size="small" plain
                       @click="onClickDelete(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="organizationName" label="所属机构" align="center"></el-table-column>
        <el-table-column prop="managerTypeName" label="用户类型" align="center"></el-table-column>
        <el-table-column prop="statusName" label="是否可用" align="center"></el-table-column>
      </el-table>
      <el-pagination
        v-if="authorityMemberList.length > 0"
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
    <el-dialog :title="dialogTitle"
               :close-on-click-modal="false"
               :before-close="onClickCancel"
               :visible.sync="showAuthorityDialog">
      <el-form labelWidth="120px" :model="addAuthorityForm" ref="addAuthorityForm" :rules="rules">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model.trim="addAuthorityForm.name" :maxlength="25" placeholder="请输入姓名" class="item-style" clearable v-if="!isDisabled"></el-input>
          <span v-else>{{addAuthorityForm.name}}</span>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model.trim="addAuthorityForm.userName" :maxlength="25" placeholder="请输入用户名" class="item-style" clearable v-if="!isDisabled"></el-input>
          <span v-else>{{addAuthorityForm.userName}}</span>
        </el-form-item>
        <el-form-item label="密码：" prop="password" v-if="!authorityMemberId">
          <el-input type="password" v-model.trim="addAuthorityForm.password" :maxlength="20" placeholder="请输入密码" class="item-style" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword" v-if="!authorityMemberId">
          <el-input type="password" v-model.trim="addAuthorityForm.confirmPassword" :maxlength="20" placeholder="请再次输入密码" class="item-style" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model.trim="addAuthorityForm.phone" :maxlength="11" placeholder="请输入手机号" class="item-style" clearable v-if="!isDisabled"></el-input>
          <span v-else>{{addAuthorityForm.phone ? addAuthorityForm.phone : '--'}}</span>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model.trim="addAuthorityForm.email" :maxlength="30" placeholder="请输入邮箱" class="item-style" clearable v-if="!isDisabled"></el-input>
          <span v-else>{{addAuthorityForm.email ? addAuthorityForm.email : '--'}}</span>
        </el-form-item>
        <el-form-item label="会话超时时间：" prop="sessionTimeout" :maxlength="30">
          <el-input v-model.trim="addAuthorityForm.sessionTimeout" placeholder="请输入会话超时时间" class="item-style" clearable v-if="!isDisabled"></el-input>
          <span v-else>{{addAuthorityForm.sessionTimeout}}</span>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="用户类型：" prop="managerType">
          <el-select v-model="addAuthorityForm.managerType" clearable :disabled="isDisabled" class="item-style" @change="changeManagerType">
            <el-option label="管制用户" value="1"></el-option>
            <el-option label="后台用户" value="2"></el-option>
            <el-option label="民航用户" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构：" prop="organizationId" v-if="addAuthorityForm.managerType === '1' || addAuthorityForm.managerType === '3'">
          <el-select v-model="addAuthorityForm.organizationId" filterable clearable class="item-style" :disabled="isDisabled">
            <el-option v-for="item in organizationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称：" prop="roleId">
          <el-select v-model="addAuthorityForm.roleId" filterable clearable class="item-style" :disabled="isDisabled">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查看权限：">
          <el-select v-model="addAuthorityForm.checkOrganizationIds" filterable clearable multiple class="item-style" :disabled="isDisabled">
            <el-option v-for="item in organizationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批权限：">
          <el-select v-model="addAuthorityForm.approvalOrganizationIds" filterable clearable multiple class="item-style" :disabled="isDisabled">
            <el-option v-for="item in organizationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickSave" v-if="!isDisabled">确定</el-button>
        <el-button class="second-btn" @click="onClickCancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="showPwdDialog" width="500px">
      <el-form :model="resetForm" ref="resetForm" label-width="110px" :rules="rules">
        <el-form-item label="新密码：" prop="newPwd">
          <el-input v-model.trim="resetForm.newPwd" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmNewPwd">
          <el-input v-model.trim="resetForm.confirmNewPwd" clearable type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickResetPwd">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelReset">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tool from "static/js/tool";
  import md5 from "md5";
  export default {
    data() {
      const checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addAuthorityForm.password) {
          callback(new Error('两次输入的密码不一致！'));
        } else {
          callback();
        }
      };
      const checkNewPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetForm.newPwd) {
          callback(new Error('两次输入的密码不一致！'));
        } else {
          callback();
        }
      };
      const validPhone = (rule, value, callback) => {
        if (value) {
          if (!tool.isvalidPhone(value)) {
            callback(new Error('请输入正确的11位手机号'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        dialogTitle: '新增用户',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        showAuthorityDialog: false,
        loading: true,
        isDisabled: false,
        form: {
          managerType: "",     //用户类型1=空管部门，2=运营后台
          organizationId: "",  //所属机构id
          roleId: "",          //角色名称
          userName: "",        //用户名
          status: ""           //是否可用0=不可用 ，1=可用
        },
        addAuthorityForm: {
          name: "",
          userName: "",
          password: "",
          confirmPassword: "",
          phone: "",
          email: "",
          managerType: "1",
          sessionTimeout: "",
          organizationId: "",
          roleId: "",
          checkOrganizationIds: [],
          approvalOrganizationIds: []
        },
        organizationList: [],
        authorityMemberList: [],
        roleList: [],
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '请输入字母、数字或者英文符号，6-20位，区分大小写', trigger: 'blur' }
          ],
          newPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '请输入字母、数字或者英文符号，6-20位，区分大小写', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '请输入字母、数字或者英文符号，6-20位，区分大小写', trigger: 'blur' },
            { validator: checkPwd, trigger: 'blur' }
          ],
          confirmNewPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '请输入字母、数字或者英文符号，6-20位，区分大小写', trigger: 'blur' },
            { validator: checkNewPwd, trigger: 'blur' }
          ],
          phone: [
            {validator: validPhone, trigger: 'blur'}
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          sessionTimeout: [
            { required: true, message: '请输入会话超时时间', trigger: 'blur' }
          ],
          managerType: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          organizationId: [
            { required: true, message: '请选择所属机构', trigger: 'change' }
          ],
          roleId: [
            { required: true, message: '请选择角色名称', trigger: 'change' }
          ]
        },
        authorityMemberId: "",
        showPwdDialog: false,
        resetForm: {
          newPwd: "",
          confirmNewPwd: ""
        },
        resetId: "",
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
        this.asyncGetAuthorityMemberList();
        this.asyncGetOrganizationList();
        this.asyncGetRoleList();
      },
      //新增角色
      onClickAddAuthority() {
        this.dialogTitle = '新增用户';
        this.showAuthorityDialog = true;
        this.asyncGetRoleList(this.addAuthorityForm.managerType);
      },
      //点击--弹框的确定
      onClickSave () {
        this.$refs['addAuthorityForm'].validate(valid => {
          if (valid) {
            let url = this.authorityMemberId ? '/authoritymember/updateAuthorityMember' : '/authoritymember/saveAuthorityMember';
            let _data = {
              id: this.authorityMemberId ? this.authorityMemberId : "",
              name: this.addAuthorityForm.name,
              userName: this.addAuthorityForm.userName,
              phone: this.addAuthorityForm.phone,
              email: this.addAuthorityForm.email,
              sessionTimeout: this.addAuthorityForm.sessionTimeout,
              managerType: parseInt(this.addAuthorityForm.managerType),
              organizationId: this.addAuthorityForm.organizationId,
              roleId: this.addAuthorityForm.roleId,
              checkOrganizationIds: this.transformArrayIntoString(this.addAuthorityForm.checkOrganizationIds),
              approvalOrganizationIds: this.transformArrayIntoString(this.addAuthorityForm.approvalOrganizationIds),
            };
            if (!this.authorityMemberId) {
              _data.password = md5(this.addAuthorityForm.password);
              _data.confirmPassword = md5(this.addAuthorityForm.confirmPassword);
            }
            this.$axios.post(url, _data).then(res => {
              if (res.data.code === 200) {
                this.$message.success('保存成功');
                this.asyncGetAuthorityMemberList();
                this.onClickCancel()
              } else {
                this.$message.error(res.data.msg);
              }
            })
          }
        })
      },
      //点击--弹框取消
      onClickCancel () {
        this.addAuthorityForm = {
          name: "",
          userName: "",
          password: "",
          confirmPassword: "",
          phone: "",
          email: "",
          managerType: "1",
          sessionTimeout: "",
          organizationId: "",
          roleId: "",
          checkOrganizationIds: [],
          approvalOrganizationIds: []
        };
        this.showAuthorityDialog = false;
        this.isDisabled = false;
        this.authorityMemberId = "";
        this.$refs['addAuthorityForm'].clearValidate();
        this.asyncGetRoleList(this.form.managerType);
      },
      //点击--禁用/启用
      onClickChangeStatus(id, statusName) {
        let notes = "";
        let status = "";
        if (statusName === '可用') {
          notes = "禁用";
          status = 0;
        } else {
          notes = "启用";
          status = 1;
        }
        this.$confirm("", `确定要${notes}吗？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.asyncChangeStatus(id, status);
        }).catch(() => {

        })
      },
      asyncChangeStatus(id, status) {
        this.$axios.get('/authoritymember/updateAuthorityMemberStatusById', {
          params: {
            id: id,
            status: status
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.asyncGetAuthorityMemberList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击--编辑
      onClickEditCheckAndCheckData(id, type) {
        if (type === 1) {
          this.dialogTitle = '编辑用户';
        } else {
          this.dialogTitle = '查看用户';
          this.isDisabled = true;
        }
        this.authorityMemberId = id;
        this.asyncGetAuthorityMemberInfo(id);
        this.showAuthorityDialog = true;
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetAuthorityMemberList()
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          managerType: "",
          organizationId: "",
          roleId: "",
          userName: "",
          status: ""
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetAuthorityMemberList();
        this.asyncGetRoleList();
      },
      //当前页展示条数改变
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetAuthorityMemberList()
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAuthorityMemberList()
      },
      //获取用户信息列表
      asyncGetAuthorityMemberList() {
        this.$axios.get("/authoritymember/getAuthorityMemberList", {
          params: {
            userName: this.form.userName,
            status: this.form.status,
            managerType: this.form.managerType,
            organizationId: this.form.organizationId,
            roleId: this.form.roleId,
            pageSize: this.pageSize,
            pageNum: this.currentPage
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.authorityMemberList = [];
            this.authorityMemberList = this.authorityMemberList.concat(res.data.data.list);
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //获取角色下拉列表
      asyncGetRoleList(managerType) {
        let _systemNo = "";
        if (managerType) {
          _systemNo = managerType === '1' || managerType === '3'? 10 : 30;
        } else {
          _systemNo = '';
        }
        this.$axios.get("/role/getModelRoleList?systemNo=" + _systemNo).then(res => {
          if (res.data.code === 200) {
            this.roleList = [];
            this.roleList = this.roleList.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取所属机构下拉列表
      asyncGetOrganizationList() {
        this.$axios.get("/datafield/getCommonDataFieldList").then(res => {
          if (res.data.code === 200) {
            this.organizationList = [];
            this.organizationList = this.organizationList.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取用户详细信息
      asyncGetAuthorityMemberInfo(id) {
        this.$axios.get('/authoritymember/getAuthorityMemberInfo?id=' + id).then(res => {
          if (res.data.code === 200) {
            let _data = res.data.data;
            this.addAuthorityForm.name = _data.name;
            this.addAuthorityForm.userName = _data.userName;
            this.addAuthorityForm.phone = _data.phone;
            this.addAuthorityForm.email = _data.email;
            this.addAuthorityForm.sessionTimeout = _data.sessionTimeout;
            this.addAuthorityForm.managerType = _data.managerType ? _data.managerType.toString() : "";
            this.addAuthorityForm.organizationId = _data.organizationId;
            this.addAuthorityForm.roleId = _data.roleId;
            this.addAuthorityForm.checkOrganizationIds = this.transformStringIntoArray(_data.checkOrganizationIds);
            this.addAuthorityForm.approvalOrganizationIds = this.transformStringIntoArray(_data.approvalOrganizationIds);
            this.asyncGetRoleList(this.addAuthorityForm.managerType);
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      //将数组分割成字符串
      transformArrayIntoString(array) {
        if (array && array.length > 0) {
         return array.join(',');
        } else {
          return "";
        }
      },
      //将字符串转成数组
      transformStringIntoArray(string) {
        let arr = [];
        if (string) {
         arr = string.split(',');
         return arr.map(item => {
           return +item;
         })
        } else {
          return [];
        }
      },
      //点击重置密码
      onClickChangePwd(id) {
        this.resetId = id;
        this.showPwdDialog = true;
      },
      //点击重置密码确定
      onClickResetPwd() {
        this.$refs['resetForm'].validate(valid => {
          if (valid) {
            this.$axios.post('/authoritymember/resetPwd', {
              id: this.resetId,
              newPwd: md5(this.resetForm.newPwd)
            }).then(res => {
              if (res.data.code === 200) {
                this.$message.success('新密码设置成功');
                this.onClickCancelReset();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          }
        })
      },
      //重置密码点击取消
      onClickCancelReset() {
        this.resetForm = {
          newPwd: "",
          confirmNewPwd: ""
        };
        this.showPwdDialog = false;
        this.$refs['resetForm'].resetFields();
      },
      //点击删除
      onClickDelete(id) {
        this.$confirm('', '是否删除此用户?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.asyncDeleteAuthority(id);
        }).catch(() => {
        });
      },
      asyncDeleteAuthority(id) {
        this.$axios.get('/authoritymember/deletedAuthorityMember?id=' + id).then(res => {
          if (res.data.code === 200) {
            this.asyncGetAuthorityMemberList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //切换用户类型
      changeManagerType(val) {
        this.addAuthorityForm.organizationId = "";
        this.addAuthorityForm.roleId = "";
        this.addAuthorityForm.checkOrganizationIds = [];
        this.addAuthorityForm.approvalOrganizationIds = [];
        this.asyncGetRoleList(val);
        this.$refs['addAuthorityForm'].clearValidate();
      },
      //切换查询条件用户类型
      changeManagerTypeOnSelect(val) {
        this.asyncGetRoleList(val);
        this.form.roleId = "";
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

  .item-style {
    width: 300px;
  }
</style>

