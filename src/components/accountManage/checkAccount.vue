<template>
  <div class="checkAccount-container" :class="{agree:isAgree==='1',disagree:isAgree==='2'}" v-loading="loading"
  >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/accountManage'}">企业信息</el-breadcrumb-item>
      <el-breadcrumb-item v-if="isVerified === '1' ">查看</el-breadcrumb-item>
      <el-breadcrumb-item v-else>认证</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="account-detail-box">
      <div class="content-box">
        <div class="status">
          <div class="colorActiveW" v-if="form.is_verified === 0 ">
            <i class="el-icon-time"></i> 待审核
            <span v-show="remark">({{remark}})</span>
          </div>
          <div class="colorActiveS" v-else-if="form.is_verified === 1">
            <i class="el-icon-circle-check-outline"></i> 已通过
            <span v-show="remark">({{remark}})</span>
          </div>
          <div class="colorActiveNo" v-else-if="form.is_verified === 2">
            <i class="el-icon-error"></i> 未通过
            <span v-show="remark">({{remark}})</span>
          </div>
        </div>
        <h4>企业信息</h4>
        <div class="account-content">
          <div class="text-info" :model="form" ref="form">
            <el-row>
              <el-col :span="12">
                <span class="label">企业用户 ： </span>
                <span v-show="form.is_verified === 0">{{customerTypeName ? customerTypeName : '--'}}  <img src="../../../static/images/icon-adoptIng.png"class="text-info-icon">审核中</span>
                <span class="info-text-type" v-show="form.is_verified === 1">{{customerTypeName ? customerTypeName : '--'}}  <img src="../../../static/images/icon-adopt.png" alt="" class="text-info-icon">已认证</span>
                <span style="color:#a7a7a7" v-show="form.is_verified === 2">{{customerTypeName ? customerTypeName : '--'}}  <img src="../../../static/images/icon-unadopt.png" alt="" class="text-info-icon">未认证</span>
              </el-col>
              <el-col :span="12"><span class="label">企业法人 ：</span><span> {{ form.juridical_person ? form.juridical_person : '--'  }}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span class="label">企业名称 ：</span><span>{{ form.name ? form.name : '--' }}</span></el-col>
              <el-col :span="12"><span class="label">企业简称 ：</span><span>{{ form.short_name ? form.short_name : '--' }}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="label">航空器数量 ：</span>
                <span v-if="form.aircraftNum" class="num-to-click" @click="jumpToAircraftManage">{{ form.aircraftNum }}</span>
                <span v-else>{{ form.aircraftNum ? form.aircraftNum : '--'}}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">飞行员数量 ：</span>
                <span v-if="form.pilotNum" class="num-to-click" @click="jumpToPilotManage">{{ form.pilotNum}}</span>
                <span v-else>{{ form.pilotNum ? form.pilotNum : '--'}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span class="label">执行过的任务类型 ：</span><div class="text-info-task">{{ form.performedApplyTask ? form.performedApplyTask : '--' }}</div>
              </el-col>
              <el-col :span="12"  v-if="customerType != '3'"><span class="label">运营类型 ：</span><div class="text-info-task">{{ enterpriseType===1 ? '有人驾驶航空器运营企业' : '无人驾驶航空器运营企业' }}</div>
              </el-col>
            </el-row>
            <div class="certificate">
              <el-row>
                <el-col :span="12">
                  <span class="label">工商营业执照注册号 ：</span><span>{{ form.registered_No ? form.registered_No : '--'}}</span>
                  <span class="checkPhoto" @click="showPreviewDialog(form.certificate_photo_url, '工商营业执照注册号')"><img src="../../../static/images/icon-check.png" alt="" style="vertical-align: middle;margin-right: 5px;">预览证件</span>
                </el-col>
                <el-col :span="12" v-if="enterpriseType===1 && customerType != '3'">
                  <span class="label">商业航空运营人运行合格证 ：</span>
                  <span class="checkPhoto" @click="showPreviewDialog(form.operatePermissionPhoto, '商业航空运营人运行合格证')" v-if="form.operatePermissionPhoto"><img src="../../../static/images/icon-check.png" alt="" style="vertical-align: middle;margin-right: 5px;">预览证件</span>
                  <span v-else> -- </span>
                </el-col>
                <el-col :span="12" v-if="enterpriseType===2 && customerType != '3'">
                  <span class="label label-width ">民用无人驾驶航空器经营许可证 ：</span>
                  <span class="checkPhoto" @click="showPreviewDialog(form.businessPermissionPhoto, '民用无人驾驶航空器经营许可证')" v-if="form.businessPermissionPhoto"><img src="../../../static/images/icon-check.png" alt="" style="vertical-align: middle;margin-right: 5px;">预览证件</span>
                  <span v-else> -- </span>
                </el-col>
              </el-row>
              <el-row v-if="enterpriseType===1 && customerType != '3'">
                <el-col>
                  <span class="label">通用航空经营许可证 ：</span>
                  <span>有效期{{ form.businessPermitStartStr }}至{{ form.businessPermitEndStr }}</span>
                  <span class="checkPhoto" @click="showPreviewDialog(form.businessPermissionPhoto, '通用航空经营许可证')" v-if="form.businessPermissionPhoto"><img src="../../../static/images/icon-check.png" alt="" style="vertical-align: middle;margin-right: 5px;">预览证件</span>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="12"><span class="label">企业所在地 ：</span><div class="text-info-task">{{ form.province + form.city + form.district + form.address }}</div></el-col>
              <el-col :span="12"><span class="label">固定电话 ：</span><span>{{ form.contact_tel ? form.contact_tel : '--'}}</span></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-info-box">
      <div class="content-box">
        <h4>联系人信息</h4>
        <el-table
          :data="tableData"
          class="checkTable"
          style="width: 100%">
          <el-table-column
            prop="loginName"
            label="用户名"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="运营者姓名"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="contact-info-box" v-if="form.is_verified === 1 && customerTypeName === '机场'">
      <div class="content-box">
        <h4>机场关联企业</h4>
        <div class="content-box-btn">
          <el-button type="primary"
                     @click="onClickOpenAddDialog"
                     class="query">添加</el-button>
          <span>
            <el-input placeholder="请输入企业名称搜索"
                      v-model="searchName"
                      @clear="onClickSearch"
                      @keyup.enter.native="onClickSearch"
                      class="search-input"
                      clearable>
            </el-input>
            <el-button type="plain" icon="el-icon-search" class="search-btn" @click="onClickSearch"></el-button>
          </span>
        </div>
        <el-table
          :data="affiliatedTableData"
          class="checkTable"
          style="width: 100%">
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="jumpToCheckCompany(scope.row.generalAviationCompanyId)">
                <img src="../../../static/images/icon-check.png" alt="" class="table-icon">查看
              </el-button>
              <el-button type="text" @click="onClickUnbind(scope.row.shortName, scope.row.id)">
                <img src="../../../static/images/icon_unbind.png" alt="" class="table-icon">解除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="shortName"
            label="企业简称"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="企业全称"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="contact"
            label="联系人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="contactTel"
            label="联系电话"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="关联时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
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
    <div class="cancel-box">
      <el-button type="primary" class="query" @click="onClickCancelCheck" v-show="isVerified === '1' ">返回</el-button>
    </div>
    <div class="verify-box" v-show="isVerified === '2' ">
      <div class="advice"><span>审批意见 :</span>
        <el-radio-group v-model="isAgree">
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">驳回</el-radio>
        </el-radio-group>
      </div>
      <div class="click-show" v-show="isAgree=== '2'">
        <div class="comment">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入驳回原因"
            v-model="verifiedDesc">
          </el-input>
        </div>
      </div>
      <div class="operate-btn" v-show="isAgree">
        <el-button type="primary" class="query" @click="onClickAuthCompany">认证</el-button>
        <el-button class="second-btn" @click="onClickCancelCheck">返回</el-button>
      </div>
    </div>
    <el-dialog title="添加" :visible.sync="addCompanyDialogVisible" width="558px" class="dialog-box">
      <div :class="['dialog-content', {withSelect: isWithSelect}]">
        <div class="dialog-content-title">为{{form.short_name}}， 选择关联企业：</div>
        <el-select v-model="affiliatedCompany"
                   @visible-change="changeVisible"
                   filterable
                   multiple placeholder="请选择">
          <el-option
            v-for="item in affiliatedCompanyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="query" @click="onClickAddCompany">确定</el-button>
        <el-button class="second-btn" @click="onClickCloseCompanyDialog">取消</el-button>
      </span>
    </el-dialog>
    <faxpreview :fax-to-show="faxToShow" :show-fax-preview="showFaxPreview" :initial-photo-to-show="initialPhotoToShow" @faxPreviewPass="faxPreviewPass"></faxpreview>
  </div>
</template>
<script>
  import faxpreview from 'common/picpreview/faxpreview';
  export default {
    components: {
      faxpreview
    },
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        isImage: false, // 是否是图片，用来判断dialog里面显示图片还是pdf
        id: "",
        photoToShow: '', //需要显示的图片
        showPreview: false, //是否显示预览弹框
        isVerified: "",
        isAgree: "",
        verifiedDesc: "",
        form: {
          is_verified: "",
          name: "",
          short_name: "",
          registered_No: "",
          juridical_person: "",
          user_id: "",
          mobile: "",
          contact_email: "",
          contact_tel: "",
          address: "",
          certificate_photo_url: "",
          identity: "",
          province: "",
          city: "",
          district: "",
          operatePermissionPhoto: "", //商业航空运营人运行合格证
          businessPermissionPhoto: "", //通航经营许可证
          businessPermitStartStr: "", //开始日期
          businessPermitEndStr: "", //结束日期
          aircraftNum: 0,          //航空器数量
          pilotNum: 0,             //飞行员数量
          performedApplyTask: "",   //执行过的飞行任务
        },
        tableData: [],
        queryParams: {}, //列表页查询参数
        remark: "", //审核意见
        customerTypeName: '',//展示 机场或企业
        customerType: '',//机场类型或企业类型
        searchName: '',       //企业名称搜索输入框
        addCompanyDialogVisible: false, //添加关联企业弹框是否可见
        isWithSelect: false,           //下拉框选项是否激活
        affiliatedCompany: [],         //添加的关联企业
        affiliatedCompanyList: [],     //添加的关联企业
        affiliatedTableData: [],   //机场关联企业
        loading: true,
        showFaxPreview: false,         //是否显示图片预览
        faxToShow: [],                 //预览图片列表
        initialPhotoToShow: '',        //图片预览时默认显示的大图
        enterpriseType:1
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.id;
      this.isVerified = this.$route.query.audit;
      this.asyncGetUserInfoById();
      this.asyncGetContactListData();
    },
    methods: {
      //点击预览
      showPreviewDialog(fileUrl, accessoryName) {
        let fileList = [];
        fileList.push({
          url: fileUrl,
          accessoryName: accessoryName
        })
        this.initialPhotoToShow = fileUrl ? fileUrl : fileList[0].url;
        this.faxToShow = [];
        this.faxToShow = fileList;
        this.showFaxPreview = true;
      },
      // 图片预览参数回传
      faxPreviewPass(data){
        this.showFaxPreview = data;
        this.faxToShow = [];
        this.initialPhotoToShow = "";
      },
      //点击取消
      onClickCancelCheck() {
        this.$router.push({
          path: '/accountManage',
          query: this.queryParams
        })
      },
      //获取用户信息
      asyncGetUserInfoById() {
        this.$axios.get('/backstageuser/getCompanyInfoByCompanyId?companyId=' + this.id).then(res => {
          if (res.data.code === 200) {
            let _data = res.data.data;
            this.form.is_verified = _data.isVerified;
            this.enterpriseType = _data.enterpriseType?_data.enterpriseType:null;
            this.form.name = _data.name;
            this.form.short_name = _data.shortName;
            this.form.registered_No = _data.registeredNo;
            this.form.juridical_person = _data.juridicalPerson;
            this.form.user_id = _data.userId;
            this.form.contact_email = _data.contactEmail;
            this.form.contact_tel = _data.contactTel;
            this.form.address = _data.address;
            this.form.certificate_photo_url = _data.certificatePhotoUrl;
            this.form.identity = _data.identity;
            this.form.province = _data.province;
            this.form.city = _data.city;
            this.form.district = _data.district;
            this.form.mobile = _data.mobile;
            this.form.businessPermissionPhoto = _data.businessPermitUrl;
            this.form.operatePermissionPhoto = _data.operatingCertificateUrl;
            this.form.businessPermitStartStr = _data.businessPermitStartStr;
            this.form.businessPermitEndStr = _data.businessPermitEndStr;
            this.remark = _data.verifiedDesc;
            this.form.aircraftNum = _data.aircraftNum;
            this.form.pilotNum = _data.pilotNum;
            this.form.performedApplyTask = _data.performedApplyTask;
            if (_data.registerType === 3 && _data.isVerified === 1) {
              this.asyncGetAffiliatedCompanyListData();
            }
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //获取联系人列表
      asyncGetContactListData () {
        this.$axios.get('/backstageuser/getUserListByCompanyId?companyId=' + this.id).then(res => {
          if(res.data.code === 200) {
            let _data = res.data.data;
            this.tableData = [];
            this.tableData = this.tableData.concat(_data);
            this.customerType = _data[0].registerType;
            if(this.customerType === 1 ) {
              this.customerTypeName = '个人';
            } else if(this.customerType === 2 ) {
              this.customerTypeName = '企业';
            } else if(this.customerType === 3) {
              this.customerTypeName = '机场';
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击认证
      onClickAuthCompany () {
        if(this.isAgree === '2' && !this.verifiedDesc) {
          this.$message.error('请输入驳回原因');
          return;
        }
        this.$axios.post('/backstageuser/authCompany', {
          companyId: this.id,
          isVerified: this.isAgree,
          verifiedDesc: this.verifiedDesc
        }).then(res => {
          if(res.data.code === 200) {
            this.onClickCancelCheck();
            this.asyncGetUserInfoById();
          }else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击跳转至航空器列表页
      jumpToAircraftManage() {
        window.open('#/aircraftManage?companyId=' + this.id);
      },
      //点击跳转至飞行员列表页
      jumpToPilotManage() {
        window.open('#/pilotManage?generalAviationCompanyId=' + this.id);
      },
      //下拉框选项激活
      changeVisible(val) {
        this.isWithSelect = val;
      },
      //点击确定关联企业
      onClickAddCompany() {
        if (this.affiliatedCompany && this.affiliatedCompany.length > 0) {
          this.affiliatedCompany = this.affiliatedCompany.join(',');
          this.asyncSaveAffiliatedCompany();
          this.onClickCloseCompanyDialog();
        } else {
          this.$message.error('请选择关联企业');
        }
      },
      //新增关联企业
      asyncSaveAffiliatedCompany() {
        this.$axios.get('/entrustingRelation/saveEntrustingRelationList', {
          params: {
            id: parseInt(this.id),
            generalAviationCompanyIds: this.affiliatedCompany
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.asyncGetAffiliatedCompanyListData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //关闭关联企业弹框
      onClickCloseCompanyDialog() {
        this.affiliatedCompany = [];
        this.addCompanyDialogVisible = false;
      },
      //点击解绑
      onClickUnbind(companyName, unbindId) {
        this.$confirm(`是否解除${this.form.short_name}与${companyName}的关联关系？`, '确认解绑', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showClose: false,
          type: 'warning',
          center: true,
          customClass: 'confirm-box',
          cancelButtonClass: 'second-btn'
        }).then(() => {
          this.asyncUnbindCompany(unbindId);
        }).catch(() => {

        })
      },
      //解除绑定
      asyncUnbindCompany(id) {
        this.$axios.get('/entrustingRelation/deleteEntrustingRelation?id='+id).then(res => {
          if (res.data.code === 200) {
            this.asyncGetAffiliatedCompanyListData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击查看
      jumpToCheckCompany(id) {
        window.open(`#/accountManage/checkAccount?audit=${'1'}&&id=${id}`);
      },
      //搜索企业
      onClickSearch() {
        this.asyncGetAffiliatedCompanyListData();
      },
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetAffiliatedCompanyListData();
      },
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetAffiliatedCompanyListData();
      },
      //获取关联企业列表接口
      asyncGetAffiliatedCompanyListData() {
        this.$axios.get('/entrustingRelation/getEntrustingRelationList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
            name: this.searchName,
            generalAviationCompanyId: this.id
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.affiliatedTableData = [];
            if (res.data.data.list) {
              this.affiliatedTableData = this.affiliatedTableData.concat(res.data.data.list);
            }
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取关联企业下拉列表接口
      asyncGetAffiliatedCompanyNameList() {
        this.$axios.get('/entrustingRelation/getGeneralAviationCompanyList?generalAviationCompanyId='+this.id).then(res => {
          if (res.data.code === 200) {
            this.affiliatedCompanyList = [];
            this.affiliatedCompanyList = this.affiliatedCompanyList.concat(res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击添加关联企业
      onClickOpenAddDialog() {
        this.asyncGetAffiliatedCompanyNameList();
        this.addCompanyDialogVisible = true;
      }
    }
  }
</script>
<style scoped>
  .checkAccount-container {
    min-width: 1050px;
    margin: 0 auto 130px;
  }
  .checkAccount-container.agree {
    margin-bottom: 185px;
  }
  .checkAccount-container.disagree {
    margin-bottom: 285px;
  }
  .text-info img {
    margin-right:5px;
  }

  .account-detail-box {
    position: relative;
  }

  h4 {
    padding-bottom: 30px;
  }

  .account-detail-box, .contact-info-box {
    background-color: #fff;
    border-radius: 4px;
    padding: 30px;
    font: 14px Microsoft YaHei;
    color: #3e4a54;
  }

  .account-detail-box .account-content, .el-table {
    min-width: 1050px;
    margin: 0 auto;
  }

  .account-detail-box .label {
    display: inline-block;
    width: 190px;
    text-align: right;
    margin: 0 0 20px 15px;
    color: #3e4a54;
    font-weight: 700;
  }
  .account-detail-box .label.label-width {
    width: 215px;
    margin-left: -10px;
  }

  .account-detail-box .verified {
    color: #568c8b;
  }

  .contact-info-box {
    margin: 20px 0 30px;
  }

  .cancel-box {
    text-align: center;
    margin-bottom: 20px;
  }

  .verify-box {
    background-color: #fff;
    margin-top: 50px;
    padding: 30px;
    box-sizing: border-box;
    border-radius: 4px;
    position: fixed;
    left: 200px;
    right: 10px;
    bottom: 50px;
    z-index: 100;
    box-shadow: 0 -2px 5px #ccc;
  }
  .verify-box .comment {
    margin: 20px 0;
  }
  .verify-box .advice span {
    margin-right:10px;
  }
  .verify-box .operate-btn {
    text-align: center;
    margin-bottom:20px;
  }
  .certificate {
    border-top: 1px dashed #c2c2c2;
    border-bottom: 1px dashed #c2c2c2;
    margin: 15px 0 30px;
    padding: 30px 0 10px;
  }
  .checkPhoto {
    cursor: pointer;
    color: #59b9e2;
    margin-left: 10px;
  }
  .status {
    padding: 10px 0 10px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #ccc;
  }
  .colorActiveNo {
    color: #F4483A;
  }

  .colorActiveS {
    color: #6CC29B;
  }

  .colorActiveW {
    color: #2c3e50;
  }

  .colorActiveNo, .colorActiveS, .colorActiveW {
    font-weight: bold;
  }

  .content-box {
    max-width: 1200px;
    margin: 0 auto;
  }
  .text-info-icon{
    position: relative;
    top: 2px;
  }
  .info-text-type{
    color:#56bc8b;
  }
  .num-to-click {
    cursor: pointer;
    color: #59b9e2;
    text-decoration: underline;
  }
  .text-info-task {
    margin: -38px 0 20px 206px;
    line-height: 20px;
  }
  .content-box-btn {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .content-box-btn .el-input {
    width: 180px;
  }
  .table-icon {
    width:15px;
    vertical-align: bottom;
    margin-right: 5px;
  }
  .dialog-content-title {
    text-align: left;
    margin:0 0 10px 52px;
  }
  .dialog-content.withSelect {
    margin-bottom: 274px;
  }
  .content-box-btn .el-input__icon {
    cursor: pointer;
  }
  .search-btn {
    margin-left: -5px;
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

</style>
<style>
  .checkAccount-container .dialog-content,
  .checkAccount-container .el-dialog__footer{
    text-align: center;
  }
  .checkAccount-container .dialog-content .el-select {
    width: 410px;
    text-align: left;
  }
  .checkAccount-container .dialog-box .el-select__tags > span {
    max-height: 84px;
    overflow: auto;
  }
  .checkAccount-container .search-input .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
