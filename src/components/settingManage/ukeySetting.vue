<template>
  <div class="ukeySetting-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>密钥配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="query-box">
      <el-form :inline="true" :model="form" ref="form" labelWidth="105px">
        <el-form-item label="管制单位：">
          <el-select v-model="form.companyId" filterable clearable style="width:203px">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in allCompanyListArr"
                       :label="item.name"
                       :value="item.id"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录用户名：">
          <el-input v-model.trim="form.userName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="token ID：">
          <el-input v-model.trim="form.tokenId" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button class="query" type="primary" @click="onClickQueryByParams">查询</el-button>
          <el-button class="second-btn" @click="onClickResetQueryParams">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        v-loading="loading"
        :data="ukeyListArr"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column label="操作" align="center" header-align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small"
                       v-show="scope.row.tokenSerial"
                       @click="onClickUnBindTokenBtn(scope.row.authorityMemberId, scope.row.tokenSerial)">解除绑定
            </el-button>
            <el-button type="primary" size="small" plain
                       v-show="scope.row.tokenSerial"
                       @click="onClickAsyncTokenBtn(scope.row.tokenSerial)">同步
            </el-button>
            <el-button type="primary" size="small" plain
                       v-show="!scope.row.tokenSerial"
                       @click="onClickBindTokenBtn(scope.row.authorityMemberId, scope.row.userName)">配置
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="账号" align="center" width="200"></el-table-column>
        <el-table-column label="状态" align="center" width="150">
          <template slot-scope="scope">
            <span v-show="scope.row.status === 1">未配置</span>
            <span v-show="scope.row.status === 2" class="passed-text-color">使用中</span>
            <span v-show="scope.row.status === 3" class="deleted-text-color">已删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="管制单位" align="center"></el-table-column>
        <el-table-column prop="tokenSerial" label="token ID" align="center">
          <template slot-scope="scope">
            {{ scope.row.tokenSerial ? scope.row.tokenSerial : "--" }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="ukeyListArr.length > 0"
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
    <el-dialog title="配置" class="bind-token-dialog" :visible.sync="isShowBindTokenDialog">
      <el-form labelWidth="120px">
        <el-form-item label="账号：">
          {{submitObj.userName}}
        </el-form-item>
        <el-form-item label="token ID：">
          <el-select v-model="submitObj.tokenId" filterable placeholder="未绑定">
            <el-option label="未绑定" value=""></el-option>
            <el-option v-for="(item, index) in tokenIdListArr"
                       :label="item"
                       :value="item"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickSureBindTokenBtn">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelBindTokenBtn">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="同步token"
               :visible.sync="isShowAsyncTokenDialog">
      <el-form :model="tokenObj" :rules="tokenObjRules" ref="tokenForm" labelWidth="120px">
        <el-form-item label="token ID：">
          {{tokenObj.serial}}
        </el-form-item>
        <el-form-item label="token-1：" prop="otpCode1">
          <el-input v-model="tokenObj.otpCode1" placeholder="请输入" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="token-2：" prop="otpCode2">
          <el-input v-model="tokenObj.otpCode2" placeholder="请输入" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickSureAsyncTokenBtn">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelAsyncTokenBtn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tool from "static/js/tool";
  export default {
    data() {
      return {
        form: {
          companyId: "",
          userName: "",
          tokenId: ""
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        allCompanyListArr: [],  //管制单位列表
        ukeyListArr: [],
        tokenIdListArr: [],      //tokenId列表
        isShowBindTokenDialog: false, //是否展示配置dialog
        submitObj: {
          userName: "",
          authorityMemberId: "",
          tokenId: ""
        },
        isShowAsyncTokenDialog: false, //是否显示同步token的dialog
        tokenObj: {
          serial: "",
          otpCode1: "",
          otpCode2: ""
        },
        tokenObjRules: {
          otpCode1: [
            {required: true, message: '请输入token验证码', trigger: 'blur'}
          ],
          otpCode2: [
            {required: true, message: '请输入token验证码', trigger: 'blur'}
          ]
        },
        loading: true
      }
    },
    async created() {
      await this.asyncGetMemberTokenList();
      this.asyncGetApprovalAuthorityList();
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
      //点击--同步dialog的确定
      onClickSureAsyncTokenBtn() {
        this.$refs.tokenForm.validate(valid => {
          if (valid) {
            this.$axios.post("/token/syncToken", this.tokenObj).then(res => {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.onClickCancelAsyncTokenBtn()
              } else {
                this.$message.error(res.data.msg);
              }
            })
          }
        })
      },
      //点击--同步dialog的取消
      onClickCancelAsyncTokenBtn() {
        this.tokenObj = {
          serial: "",
          otpCode1: "",
          otpCode2: ""
        };
        this.isShowAsyncTokenDialog = false;
      },
      //点击--配置dialog的取消
      onClickCancelBindTokenBtn() {
        this.isShowBindTokenDialog = false;
        this.submitObj = {
          userName: "",
          authorityMemberId: "",
          tokenId: ""
        }
      },
      //点击--配置dialog的确定
      onClickSureBindTokenBtn() {
        if (this.submitObj.tokenId) {
          this.$axios.get('/token/bindToken', {
            params: {
              authorityMemberId: this.submitObj.authorityMemberId,
              serial: this.submitObj.tokenId
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.onClickCancelBindTokenBtn();
              this.$confirm("", "token配置成功！", {
                confirmButtonText: "确定",
                showCancelButton: false,
                showClose: false,
                type: 'success',
                center: true,
                customClass: 'confirm-box confirm-single-box',
                cancelButtonClass: 'second-btn',
              }).then(() => {
                this.asyncGetMemberTokenList();
              })
            } else {
              this.$message.error(res.data.msg);
            }
          })
        } else {
          this.$message.warning("请先选择token ID")
        }
      },
      //点击--解除绑定
      onClickUnBindTokenBtn(id, token) {
        this.$confirm("", "确定要解除绑定吗？", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box confirm-single-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.asyncUnbindToken(id, token)
        }).catch(() => {
          //不做处理
        })
      },
      //点击--配置
      onClickBindTokenBtn(id, name) {
        this.submitObj.userName = name;
        this.submitObj.authorityMemberId = id;
        this.isShowBindTokenDialog = true;
        this.asyncGetUnusedTokenList()
      },
      //点击--同步
      onClickAsyncTokenBtn(tokenSerial) {
        this.tokenObj.serial = tokenSerial;
        this.isShowAsyncTokenDialog = true;
      },
      //点击--查询
      onClickQueryByParams() {
        this.asyncGetMemberTokenList()
      },
      //点击--重置
      onClickResetQueryParams() {
        this.form = {
          companyId: "",
          userName: "",
          tokenId: ""
        };
        this.currentPage = 1;
        this.pageSize = 10;
        this.asyncGetMemberTokenList()
      },
      //当前页展示条数改变
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetMemberTokenList()
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetMemberTokenList()
      },
      //解除绑定
      asyncUnbindToken(id, token) {
        this.$axios.get("/token/unbindToken", {
          params: {
            authorityMemberId: id,
            serial: token
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success("解绑成功！");
            this.asyncGetMemberTokenList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取tokenId列表
      asyncGetUnusedTokenList() {
        this.$axios.get('/token/getUnusedTokenList').then(res => {
          if (res.data.code === 200) {
            this.tokenIdListArr = [];
            this.tokenIdListArr = this.tokenIdListArr.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取管制单位列表
      asyncGetApprovalAuthorityList() {
        this.$axios.get('/flighttask/getApprovalAuthorityList').then(res => {
          if (res.data.code === 200) {
            this.allCompanyListArr = [];
            this.allCompanyListArr = this.allCompanyListArr.concat(res.data.data)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取table数据
      asyncGetMemberTokenList() {
        this.$axios.get("/token/getMemberTokenList", {
          params: {
            organizationId: this.form.companyId,
            userName: this.form.userName,
            tokenSerial: this.form.tokenId,
            pageSize: this.pageSize,
            pageNum: this.currentPage
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.ukeyListArr = [];
            this.ukeyListArr = this.ukeyListArr.concat(res.data.data.list);
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      }
    }
  }
</script>
<style scoped type="text/stylus">
  .query-btn-box {
    margin-left: 22px;
  }

  .btn-icon {
    position: relative;
    top: 2px;
    right: 1px;
  }

  .dialog-footer {
    text-align: center;
  }

  .passed-text-color {
    color: #279b37;
  }

  .deleted-text-color {
    color: #ccc;
  }
</style>
