<template>
  <div class="checkApplyPlan-container" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/applyPlan">计划审核</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-text="title"></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="base-info-check">
      <div class="content-box">
        <div class="status colorActiveNo" v-if="currentStatus == 4">
          <i class="el-icon-error"></i> 未通过 ( {{desc}} )
        </div>
        <div class="status colorActiveS" v-else-if="currentStatus == 3">
          <i class="el-icon-circle-check-outline"></i> 已通过
        </div>
        <div class="status colorActiveW" v-else-if="currentStatus == 2">
          <i class="el-icon-time"></i> 待审核
        </div>
        <div class="status colorActiveW" v-else-if="currentStatus == 1">
          <i class="el-icon-time"></i> 未提交
        </div>
        <el-button class="m-change-status-btn" type="text" size="small"
          @click="showChangeStatusDialog=true">更改计划状态</el-button>
      </div>
      <div class="content-box">
        <div class="remark-box">
          <p class="remark-title">调配意见</p>
          <el-table
            :data="remarkTableData"
            :show-header="false"
            v-if="remarkTableData && remarkTableData.length > 0"
            class="checkTable">
            <el-table-column align="center">
              <template slot-scope="scope">
                <p>{{ scope.row.referenceName }}</p>
                <p v-if="scope.row.approvalMechanism === 1">（审批单位）</p>
              </template>
            </el-table-column>
            <el-table-column prop="message" align="left" min-width="180"></el-table-column>
            <el-table-column prop="createdTime" align="center"></el-table-column>
          </el-table>
          <span v-else>暂无</span>
        </div>
      </div>
    </div>
    <div class="base-info-check">
      <div class="content-box">
        <div class="base-box-content">
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">飞行单位：</span>
              <span>{{form.flightUnit}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">报批类型：</span>
              <span v-if="form.approvalType === 1">机场</span>
              <span v-else-if="form.approvalType === 2">空管</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">报批单位：</span>
              <span>{{form.approvalAuthorityName}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">提交单位：</span>
              <span>{{form.generalAviationCompanyName}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">是否引用已审批空域：</span>
              <span>{{form.applyTask === 1 ? "是" : "否"}}</span>
            </el-col>
          </el-row>
          <div v-if="form.applyTask === 1">
            <el-row>
              <el-col :span="10" :offset="1">
                <span class="M-label">任务编码：</span>
                <span>{{form.taskNumber}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="1">
                <span class="M-label">任务名称：</span>
                <span>{{form.taskName}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22" :offset="1">
                <span class="M-label">任务性质：</span>
                <span>{{form.taskTypeName}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="1">
                <span class="M-label">任务起止日期：</span>
                <span>{{form.taskDate}}</span>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in form.approveFileList" :key="item.id">
              <el-col :span="11" :offset="1">
                <span class="M-label" v-if="index === 0">空域批件名称：</span>
                <span class="M-label" v-else style="color: #fff">空域批件名称：</span>
                <div class="M-content">
                  <span>{{item.accessoryName ? item.accessoryName : '--'}}</span>
                  <p v-for="(file, idx) in item.fileList"
                     :key="file.url" class="fileTitle">
                    <span class="urlName">{{file.name}}</span>
                    <span class="fileName" @click="showPreviewDialog(item.fileList, file.url, item.accessoryName)">
                        <img src="../../../static/images/icon-check.png" alt=""> 预览</span>
                    <a class="fileName" :href="file.url" :download="file.name">
                      <img src="../../../static/images/icon-download.png" alt="">
                      下载</a>
                  </p>
                </div>
              </el-col>
              <el-col :span="10">
                <span class="M-label" v-if="index === 0">批复单位：</span>
                <span class="M-label" v-else style="color: #fff">批复单位：</span>
                <span>{{item.authority ? item.authority : '--'}}</span>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in form.otherFileList" :key="item.id">
              <el-col :span="11" :offset="1">
                <span class="M-label" v-if="index === 0">资质文件名称：</span>
                <span class="M-label" v-else style="color: #fff">资质文件名称：</span>
                <div class="M-content">
                  <span>{{item.accessoryName ? item.accessoryName : '--'}}</span>
                  <p v-for="(file, idx) in item.fileList"
                     :key="file.url" class="fileTitle">
                    <span class="urlName">{{file.name}}</span>
                    <span class="fileName" @click="showPreviewDialog(item.fileList, file.url, item.accessoryName)">
                        <img src="../../../static/images/icon-check.png" alt=""> 预览</span>
                    <a class="fileName" :href="file.url" :download="file.name">
                      <img src="../../../static/images/icon-download.png" alt="">
                      下载</a>
                  </p>
                </div>
              </el-col>
              <el-col :span="10">
                <span class="M-label" v-if="index === 0">颁发机构：</span>
                <span class="M-label" v-else style="color: #fff">颁发机构：</span>
                <span>{{item.authority ? item.authority : '--'}}</span>
              </el-col>
            </el-row>
          </div>
          <div v-else-if="form.applyTask === 2">
            <el-row>
              <el-col :span="10" :offset="1">
                <span class="M-label">任务性质：</span>
                <span>{{form.taskTypeName}}</span>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in form.otherFileList" :key="item.id">
              <el-col :span="11" :offset="1">
                <span class="M-label" v-if="index === 0">资质文件名称：</span>
                <span class="M-label" v-else style="color: #fff;">资质文件名称：</span>
                <div class="M-content">
                  <span>{{item.accessoryName ? item.accessoryName : '--'}}</span>
                  <p v-for="(file, idx) in item.fileList"
                     :key="file.url" class="fileTitle">
                    <span class="urlName">{{file.name}}</span>
                    <span class="fileName" @click="showPreviewDialog(item.fileList, file.url, item.accessoryName)">
                        <img src="../../../static/images/icon-check.png" alt=""> 预览</span>
                    <a class="fileName" :href="file.url" :download="file.name">
                      <img src="../../../static/images/icon-download.png" alt="">
                      下载</a>
                  </p>
                </div>
              </el-col>
              <el-col :span="10">
                <span class="M-label" v-if="index === 0">颁发机构：</span>
                <span class="M-label" v-else style="color: #fff;">颁发机构：</span>
                <span>{{item.authority ? item.authority : '--'}}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="base-info-check">
      <div class="content-box">
        <div class="base-box-content down-box">
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">计划名称：</span>
              <div class="plan-name">{{form.name ? form.name : '--'}}</div>
            </el-col>
            <el-col :span="10" :offset="1">
              <span class="M-label">计划编码：</span>
              <span>{{form.planNumber ? form.planNumber : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">飞行日期：</span>
              <span>{{form.startDate ? form.startDate : '--'}}</span>
            </el-col>
            <el-col :span="10" :offset="1">
              <span class="M-label">申请时间：</span>
              <span>{{form.createdTime ? form.createdTime : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">审核时间：</span>
              <span>{{form.approvalTime ? form.approvalTime : '--'}}</span>
            </el-col>
          </el-row>
          <div class="split-border"></div>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">联系人：</span>
              <span>{{form.contact ? form.contact : '--'}}</span>
            </el-col>
            <el-col :span="10" :offset="1">
              <span class="M-label">联系人手机号：</span>
              <span>{{form.contactTel ? form.contactTel : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">联系人座机：</span>
              <span>{{form.contactTelephone ? form.contactTelephone : '--'}}</span>
            </el-col>
            <el-col :span="10" :offset="1">
              <span class="M-label">机组联系手机号：</span>
              <span>{{form.chiefCrewMobile ? form.chiefCrewMobile : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="1">
              <span class="M-label">传真：</span>
              <span>{{form.fax ? form.fax : '--'}}</span>
            </el-col>
            <el-col :span="10" :offset="1">
              <span class="M-label">计划批号：</span>
              <span>{{form.batchNumber ? form.batchNumber : '--'}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="table-box">
      <div class="table-box-content authority-box">
        <el-table :data="authorityData" class="checkTable historyTable">
          <el-table-column label="审批单位" align="center" prop="audit.name"></el-table-column>
          <el-table-column label="抄送单位" align="left" header-align="center" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.copy && scope.row.copy.length > 0">
                <div class="copy-box">
                  <span class="copy-title">系统送达：</span>
                  <div class="copy-item" v-if="scope.row.systemSendUnits && scope.row.systemSendUnits.length > 0">
                    <span v-for="(item, index) in scope.row.systemSendUnits" :key="item.distributionId" class="copy-item">
                      <span v-show="index !== 0">、</span>
                      <span>{{item.name}}</span>
                    </span>
                  </div>
                  <div v-else>--</div>
                </div>
                <div class="copy-box">
                  <span class="copy-title">传真送达：</span>
                  <div class="copy-item" v-if="scope.row.faxSendUnits && scope.row.faxSendUnits.length > 0">
                  <span v-for="(item, index) in scope.row.faxSendUnits" :key="item.distributionId" class="copy-item">
                    <span v-show="index !== 0">、</span>
                    <span>{{item.name}}</span>
                    <span v-show="item.fax">（{{item.fax}}）</span>
                  </span>
                  </div>
                  <div v-else>--</div>
                </div>
                <div class="copy-box">
                  <span class="copy-title">未送达：</span>
                  <div class="copy-item" v-if="scope.row.noSendUnits && scope.row.noSendUnits.length > 0">
                  <span v-for="(item, index) in scope.row.noSendUnits" :key="item.distributionId" class="copy-item">
                    <span v-show="index !== 0">、</span>
                    <span>{{item.name}}</span>
                  </span>
                  </div>
                  <div v-else>--</div>
                </div>
              </div>
              <div class="no-copy" v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="飞行空域涉及的管制区域" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.related ? scope.row.related : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="onClickEditAuthority(scope.row, 1)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-box">
      <div class="table-box-content" v-for="(flyPlanItem, idx) in flyPlanArr" :key="idx">
        <el-form :inline="true" labelWidth="153px">
          <div class="box-content-title" @click="openFlyPlanDialog(idx)">
            <el-row type="flex" justify="space-between">
              <el-col :span="18">
                <el-form-item label="起飞机场/起降点:">
                  <span class="box-content-item">{{flyPlanItem.takeoffPointName}}</span>
                </el-form-item>
                <el-form-item label="起降时间:">
                  <span class="box-content-item">{{flyPlanItem.takeOffTime}} <span style="padding: 0 10px;">至</span> {{flyPlanItem.landingTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="text-align: right;">
                <span style="opacity: 0">站位</span><span class="iconArrow" :class="{'active':flyPlanItem.open}"></span>
              </el-col>
            </el-row>
          </div>
          <div v-show="flyPlanItem.open" class="table-content-item">
            <div class="table-boxs">
              <p class="title no-border">空域/航线</p>
              <el-table
                :data="flyPlanItem.flightPlanScopeModels"
                class="checkTable">
                <el-table-column prop="scopeTypeName" label="飞行类型" align="center" width="200"></el-table-column>
                <el-table-column label="起飞场地" align="center" width="200">
                  <template  slot-scope="scope">
                    <div :class="scope.row.departuredFieldPoint.lat?'flyPoint':''">
                      <p>{{scope.row.departuredFieldName}}</p>
                      <p>{{scope.row.departuredFieldPoint.lat}}</p>
                      <p>{{scope.row.departuredFieldPoint.lng}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="降落场地" align="center" width="200">
                  <template  slot-scope="scope">
                    <div :class="scope.row.landingFieldPoint.lat?'flyPoint':''">
                      <p>{{scope.row.landingFieldName}}</p>
                      <p>{{scope.row.landingFieldPoint.lat}}</p>
                      <p>{{scope.row.landingFieldPoint.lng}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="作业区域范围" align="center" width="">
                  <template  slot-scope="scope">
                    <p>{{scope.row.scopePointName}}</p>
                    <p v-if="scope.row.airspaceAccessWay">空域进出方法：{{scope.row.airspaceAccessWay}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="heightDesc" label="飞行高度" align="center" width="200"></el-table-column>
              </el-table>
              <el-table :data="flyPlanItem.periodDistributionList" class="checkTable historyTable" style="margin-top: 20px;">
                <el-table-column label="飞前申请受理单位" align="center" prop="accept.referenceName"></el-table-column>
                <el-table-column label="发布放行单位" align="center" prop="release.referenceName"></el-table-column>
                <el-table-column label="实时态势相关单位" align="center" header-align="center" min-width="200">
                  <template slot-scope="scope">
                    <div v-if="scope.row.flyCopy && scope.row.flyCopy.length > 0">
                      <span v-for="(item, index) in scope.row.flyCopy" :key="item.distributionId" class="copy-item">
                        <span v-show="index !== 0">、</span>
                        <span>{{item.referenceName}}</span>
                      </span>
                    </div>
                    <div class="no-copy" v-else>--</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="onClickEditAuthority(scope.row, 2, flyPlanItem.id)">修改</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="table-boxs">
              <p class="title no-border">设备及人员</p>
              <el-table
                :data="flyPlanItem.flightPlanAerocraftModels"
                class="checkTable">
                <el-table-column label="设备型号" align="center" width="350">
                  <template slot-scope="scope">
                    <span>{{scope.row.machineTypeRemark ? scope.row.model + '-' + scope.row.machineTypeRemark : scope.row.model }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="certificateNum" label="机号" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.certificateNum ? scope.row.certificateNum : '--' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pilotLicense" label="机长-执照号" align="center">
                  <template slot-scope="scope">
                    <div v-for="captainItem in scope.row.flightPlanPilotModels">{{captainItem.pilotLicense}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="aircrewCount" label="机组人数" align="center" width="200"></el-table-column>
              </el-table>
            </div>
            <div class="table-boxs">
              <p class="title">备降机场</p>
              <span class="title-content">{{flyPlanItem.bakLandingPointName ? flyPlanItem.bakLandingPointName : "暂无备降机场"}}</span>
            </div>
            <div class="table-boxs">
              <p class="title">备注</p>
              <span class="title-content">{{flyPlanItem.remark ? flyPlanItem.remark : "暂无备注"}}</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="table-box">
      <div class="table-box-content">
        <el-row type="flex" justify="space-between" :class="['history-header', showHistoryTable ? 'history-title' : '']" @click.native="showHistoryTable = !showHistoryTable">
          <el-col class="title no-border">历史记录</el-col>
          <el-col class="content-box-icon"><span :class="['content-table',showHistoryTable ? 'content-table-show' : 'content-table-hide']"></span></el-col>
        </el-row>
        <div class="history-table-box" v-show="showHistoryTable">
          <el-table :data="historyTableData" class="checkTable historyTable">
            <el-table-column label="操作人" align="center" prop="operationUserName"></el-table-column>
            <el-table-column label="操作内容" align="center" prop="operationTypeDesc"></el-table-column>
            <el-table-column label="操作IP" align="center" prop="operationUserIp"></el-table-column>
            <el-table-column label="操作时间" align="center" prop="createdTime" ></el-table-column>
            <el-table-column label="详情" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.recordLogList && scope.row.recordLogList.length > 0">
                  <el-button type="text" @click="onClickGetRecordList(scope.$index)">查看</el-button>
                  <el-dialog
                    title="修改详情"
                    :visible.sync="detailDialogVisible"
                    width="1180px"
                    :before-close="handleClose">
                    <el-table :data="recordTableData" class="checkTable">
                      <el-table-column label="修改内容" align="center" prop="operationContext"></el-table-column>
                      <el-table-column label="修改前" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.operationBeforeList && scope.row.operationBeforeList.length > 0">
                            <p v-for="(item, index) in scope.row.operationBeforeList" :key="index">{{item}}</p>
                          </div>
                          <div v-else>--</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="修改后" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.operationAfterList && scope.row.operationAfterList.length > 0">
                            <p v-for="(item, index) in scope.row.operationAfterList" :key="index">{{item}}</p>
                          </div>
                          <div v-else>--</div>
                        </template>
                      </el-table-column>
                    </el-table>
                    <span slot="footer" class="dialog-footer">
                          <el-button type="primary" class="export" @click="handleClose">关闭</el-button>
                        </span>
                  </el-dialog>
                </div>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="save_btns">
      <div>
        <el-button type="primary" class="query" @click="jumpToApplyPlan">返回</el-button>
      </div>
    </div>
    <div class="fixed-box" v-if="showFixedBox">
      <el-form :model="checkForm" :rules="rules" ref="checkForm" label-width="100px">
        <el-form-item label="审批意见：" style="margin-bottom: 0;">
          <el-radio v-model="checkForm.status" label="1" @change="onChangeVak">通过</el-radio>
          <el-radio v-model="checkForm.status" label="2" @change="onChangeVak">驳回</el-radio>
        </el-form-item>
        <el-form-item label="" prop="content" style="margin-bottom: 20px;width: 80%;" v-show="showType">
          <el-input v-model="checkForm.content" :rows="3" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-show="showBtn" class="dialog-footer" style="text-align: center;margin:0 0 10px -280px;">
        <el-button class="query" type="primary" @click="asyncPostSubmitAuditing('checkForm')">审核</el-button>
        <el-button class="second-btn" @click="jumpToApplyPlan">取消</el-button>
      </div>
    </div>
    <el-dialog
      title="修改"
      :visible.sync="showAuthorityDialog"
      :before-close="onClickCancelEdit"
      width="683px">
      <el-form :model="editAuthorityForm" ref="editAuthorityForm" label-width="150px" v-if="showEditForm === 1">
        <el-form-item label="计划审批单位：">
          <el-col :span="7" class="edit-item">
            <el-select placeholder="请选择" v-model="editAuthorityForm.auditType" @change="onChangeAuditType" :disabled="currentStatus == 3">
              <el-option v-for="item in authorityTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-select placeholder="请选择" filterable v-model="editAuthorityForm.auditId" style="width: 306px;" @change="onChangeAudit" :disabled="currentStatus == 3">
              <el-option v-for="item in auditNameList" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disabled"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="抄送单位：">
          <el-select placeholder="请选择" filterable v-model="editAuthorityForm.copyIdList" multiple style="width: 460px;" @change="onChangeCopy">
            <el-option-group
              v-for="group in authorityNameList"
              :key="group.id"
              :label="group.name">
              <el-option v-for="item in group.data" :label="item.name" :value="item.id" :disabled="item.disabled" :key="item.id"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="editEachAuthorityForm" ref="editEachAuthorityForm" label-width="150px" v-if="showEditForm === 2">
        <el-form-item label="飞前申请受理单位：">
          <el-col :span="7" class="edit-item">
            <el-select placeholder="请选择" v-model="editEachAuthorityForm.acceptType" @change="onChangeAcceptType">
              <el-option v-for="item in acceptTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-select placeholder="请选择" filterable v-model="editEachAuthorityForm.acceptId" style="width: 306px;" @change="onChangeAccept">
              <el-option v-for="item in acceptNameList" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disableType === 2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="发布放行单位：">
          <el-col :span="7" class="edit-item">
            <el-select placeholder="请选择" v-model="editEachAuthorityForm.releaseType" @change="onChangeReleaseType">
              <el-option v-for="item in authorityTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-select placeholder="请选择" filterable v-model="editEachAuthorityForm.releaseId" style="width: 306px;" @change="onChangeRelease">
              <el-option v-for="item in releaseNameList" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disableType === 2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="实时态势相关单位：">
          <el-select placeholder="请选择" filterable v-model="editEachAuthorityForm.flyCopyList" multiple style="width: 460px;" @change="onChangeFlyCopy">
            <el-option-group
              v-for="group in authorityNameList"
              :key="group.id"
              :label="group.name">
              <el-option v-for="item in group.data" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disableAcceptType || item.disableReleaseType"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" class="query" @click="onClickSaveEdit">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelEdit">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="更改计划状态"
      :visible.sync="showChangeStatusDialog"
      width="500px">
      <div style="margin-left: 15px">
        <span class="m-label">更改计划状态为：</span>
        <el-select v-model="changeStatus" placeholder="请选择">
          <el-option label="未提交" value="1"></el-option>
          <el-option label="待审核" value="2"></el-option>
          <el-option label="通过" value="3"></el-option>
          <el-option label="驳回" value="4"></el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button type="primary" class="query" @click="onClickChangeStatusBtn">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelChangeStatusBtn">取消</el-button>
      </div>
    </el-dialog>
    <faxpreview :fax-to-show="faxToShow" :show-fax-preview="showFaxPreview" :initial-photo-to-show="initialPhotoToShow" @faxPreviewPass="faxPreviewPass"></faxpreview>
  </div>
</template>
<script>
  import tool from "static/js/tool"
  import faxpreview from 'common/picpreview/faxpreview';
  export default {
    components: {
      faxpreview
    },
    data() {
      return {
        title: '查看',
        desc: '',
        imageUrl: '', //点击预览的图片路径
        center: true,
        loading: true,
        flag: false,
        showFixedBox: false,
        showType: false,
        showBtn: false,
        currentStatus: "",
        sureIndex: 0,
        id: '',
        type: 0,
        dialogTableVisible: false,
        showPreview: false, //是否显示预览弹框
        allAirTaskList: [],//所属飞行任务
        aircraftListData: [],//航空器
        captainList: [],//机长选项
        takeoffPointName: [],//起降机场
        routeData: [],//获取航线/空域
        flyPlanArr: [
          {
            takeoffPointName: "--",//起飞机场
            startFallTime: "--",
            aerocraftId: "--",//航空器
            pilotLicenseId: [],// 机长
            remark: "--",// 备注
            aircrewCount: "--",// 机组人数
            flightPlanScopeModels: [],//空域
            flightPlanAerocraftModels: [],//设备人员
            open: true,
            bakLandingPointName: "",      //备降机场
          }
        ],
        rules: {
          content: [
            {required: true, message: '请输入驳回意见', trigger: 'blur'}
          ]
        },
        checkForm: {
          status: "",
          content: "",
        },
        form: {
          startDate: '--',
          name: '--',
          flightTaskId: '',//任务ID
          taskName: '--',//任务名称
          taskTypeName: '--',//任务性质
          contact: '--',
          contactTel: '--',
          taskContact: '--', //任务联系人
          taskContactTel: '--', //任务联系电话
          approver: '--',//审批人
          approvalTime: '--',//审核时间
          approvalAuthorityName: '--',//报批单位
          generalAviationCompanyName: '',//提交单位
          planNumber: '--',//计划编码
          taskNumber: '--',//任务编码
          flightUnit: '--',//飞行单位
          createdTime: '--',//申请时间
          approvalType: "",              //报批类型
          applyTask: "",                     //是否引用审批空域 1 是 2 否
          taskDate: "", //任务起止日期
          taskApprovalAuthorityName : "",         //批复单位
          approveFileList: [
            {
              accessoryName: "",
              authority: "",
              fileList: []
            }
          ],                // 空域批件名称
          otherFileList: [
            {
              accessoryName: "",
              authority: "",
              fileList: []
            }
          ],                              //资质文件名称
          contactTelephone: "--",         //联系人座机
          chiefCrewMobile: "--",          //机组联系人手机号
          fax: "--",                      //传真
          batchNumber: "--",              //计划批号
        },
        tableData: [],
        multipleSelection: [],
        queryParams: {}, //列表查询参数
        detailDialogVisible: false,//是否显示记录详情弹框
        showHistoryTable: false,  //是否显示历史记录表格
        historyTableData: [],     //历史记录列表
        recordTableData: [],     //记录列表
        notifyCompanyName: '',  //抄送单位
        showFaxPreview: false,         //是否显示图片预览
        faxToShow: [],                 //预览图片列表
        initialPhotoToShow: '',        //图片预览时默认显示的大图
        authorityData: [],             //审批单位、抄送单位及其他单位
        showAuthorityDialog: false,    //显示修改单位弹框
        editAuthorityForm: {
          auditId: '',
          copyIdList: [],
          auditType: ''
        },
        editEachAuthorityForm: {
          acceptType: '',
          acceptId: '',
          releaseType: '',
          releaseId: '',
          flyCopyList: []
        },
        authorityTypeList: [
          {
            id: 1,
            name: '战区'
          },
          {
            id: 2,
            name: '分区'
          },
          {
            id: 3,
            name: '军航机场管制室'
          },
        ], //计划审批单位及发布放行单位类型下拉列表
        acceptTypeList: [
          {
            id: 1,
            name: '战区'
          },
          {
            id: 2,
            name: '分区'
          },
          {
            id: 3,
            name: '军航机场管制室'
          },
          {
            id: 11,
            name: '民航'
          },
          {
            id: 21,
            name: '通航'
          },
        ],    //飞前申请受理单位下拉列表
        authorityNameList: [],
        auditNameList: [],    //计划审批具体单位下拉列表
        acceptNameList: [],    //飞前申请受理单位下拉列表
        releaseNameList: [],    //发布放行单位下拉列表
        remarkTableData: [],            //调配意见
        showChangeStatusDialog: false,  //是否显示更改计划状态弹框
        changeStatus: '1',  //要改变的状态
        showEditForm: 0,
        periodId: '',         //每条计划的id
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
      this.queryParams = this.$route.query;
      this.asyncGetCheckPlanData();
      this.asyncGetHistoryList();
      this.asyncGetRemarkData();
      if (this.type && this.type != 0) {
        this.showFixedBox = true;
        this.title = '核验';
      }
      this.asyncGetAuthorityList();
    },
    methods: {
      //点击--变更计划状态的取消
      onClickCancelChangeStatusBtn() {
        this.showChangeStatusDialog = false;
        this.changeStatus = "1"
      },
      //点击--更改计划状态弹框的确定
      onClickChangeStatusBtn() {
        this.$axios.post("/flightPlan/modifyPlanStatus", {
          id: this.id,
          status: this.changeStatus
        }).then(res => {
          this.showChangeStatusDialog = false;
          if(res.data.code === 200) {
            this.asyncGetCheckPlanData();
            this.$message.success("计划状态变更成功！");
          }else {
            this.$message.error("计划状态变更失败！");
          }
        })
      },
      // 图片预览参数回传
      faxPreviewPass(data){
        this.showFaxPreview = data;
        this.faxToShow = [];
        this.initialPhotoToShow = "";
      },
      //点击预览
      showPreviewDialog(fileList, fileUrl, accessoryName) {
        if (fileList && fileList.length > 0) {
          fileList.forEach(item => {
            if (item.accessAddressUrl) {
              this.$set(item, 'url', item.accessAddressUrl);
            }
            this.$set(item, 'accessoryName', accessoryName ? accessoryName : '')
          });
        }
        this.initialPhotoToShow = fileUrl ? fileUrl : fileList[0].url;
        this.faxToShow = [];
        this.faxToShow = fileList;
        this.showFaxPreview = true;
      },
      //点击显示隐藏--起飞
      openFlyPlanDialog(idx) {
        this.flyPlanArr[idx].open = !this.flyPlanArr[idx].open;
      },
      //点击显示隐藏--附件
      showDocument() {
        this.flag = !this.flag;
      },
      //点击批审意见 切换 下拉及文本域
      onChangeVak(val) {
        val === '1' ? this.showType = false : this.showType = true;
        this.showBtn = true
      },
      //取消
      jumpToApplyPlan() {
        this.$router.push({
          path: '/applyPlan',
          query: this.queryParams
        });
      },
      //获取编辑的数据
      asyncGetCheckPlanData() {
        this.$axios.get('/flightPlan/getBackstageFlightPlanById?id=' + this.id)
          .then((res) => {
            if (res.data.code === 200) {
              let _data = res.data.data.flightPlanModel;
              this.form.startDate = _data.startDate;
              this.form.contactTel = _data.contactTel * 1;
              this.form.taskContactTel = _data.flightTaskContactTel * 1;
              this.form.contact = _data.contact;
              this.form.taskContact = _data.flightTaskContact;
              this.form.name = _data.name;
              this.currentStatus = _data.status;
              this.form.flightTaskId = _data.flightTaskId;
              this.form.taskName = _data.taskName;
              this.form.taskTypeName = _data.taskTypeName;
              this.form.approvalTime = _data.approvalTime;
              this.form.approvalAuthorityName = _data.approvalAuthorityName;
              this.form.generalAviationCompanyName = _data.generalAviationCompanyName;
              this.form.planNumber = _data.planNumber;
              this.form.taskNumber = _data.taskNumber;
              this.form.flightUnit = _data.flightUnit;
              this.form.createdTime = _data.createdTime;
              this.form.applyTask = _data.applyTask;
              this.form.approvalType = _data.approvalType;
              this.form.taskDate = _data.taskDate;
              this.form.taskApprovalAuthorityName = _data.taskApprovalAuthorityName;
              this.form.contactTelephone = _data.contactTelephone;
              this.form.chiefCrewMobile = _data.chiefCrewMobile;
              this.form.fax = _data.fax;
              this.form.batchNumber = _data.batchNumber;
              this.form.taskApprovalAuthorityName  = _data.taskApprovalAuthorityName ;
              //空域文件
              if (_data.approveFileList && _data.approveFileList.length > 0) {
                this.form.approveFileList = [];
                this.form.approveFileList = this.form.approveFileList.concat(_data.approveFileList);
              }
              //资质文件
              if (_data.otherFileList && _data.otherFileList.length > 0) {
                this.form.otherFileList = [];
                this.form.otherFileList = this.form.otherFileList.concat(_data.otherFileList);
              }
              this.desc = _data.approvalOpinion ? _data.approvalOpinion : '--';
              //获取抄送单位
              if (_data.listOrganizationName && _data.listOrganizationName.length > 0) {
                this.notifyCompanyName = _data.listOrganizationName.join("，");
              }
              //赋值Arr
              this.flyPlanArr = _data.flightPlanPeriodModels;
              this.flyPlanArr.forEach((item, index) => {
                this.$set(item, "open", true);
                let scopeModel = item.flightPlanScopeModels;
                scopeModel.forEach(item => {
                  if(item.shapeDescription) {
                    this.$set(item, 'coordinateArr', item.shapeDescription.split("|"));
                  }
                });
                let _list = [];
                _list = item.periodDistribution ? _list.concat(item.periodDistribution) : [];
                this.$set(item, 'periodDistributionList', _list);
              });
              if (_data.planDistribution) {
                this.authorityData = [];
                this.authorityData = this.authorityData.concat(_data.planDistribution);
                this.getCopyBySendType();
              }
            } else {
              this.$message.error(res.data.msg);
            }
            this.loading = false;
          })
      },
      //审核确认
      asyncPostSubmitAuditing(checkForm) {
        if (this.checkForm.status == 2) {
          this.$refs[checkForm].validate((valid) => {
            if (valid) {
              this.onClickAudiTing();
            }
          });
        } else {
          this.onClickAudiTing();
        }
      },
      //确定提交审核
      onClickAudiTing(){
        this.$axios.post('/flightPlan/approveFlightPlan', {
          id: this.id,
          action: this.checkForm.status,
          approvalOpinion: this.checkForm.content
        }).then((res) => {
          if (res.data.code === 200) {
            this.jumpToApplyPlan();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //关闭历史记录详情弹出框
      handleClose(done) {
        this.detailDialogVisible = false;
      },
      //获取历史记录列表
      asyncGetHistoryList() {
        this.$axios.get('/flighttask/listOperationRecord', {
          params: {
            type: 2,
            referenceId: this.id
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.historyTableData = [];
            this.historyTableData = this.historyTableData.concat(res.data.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取记录详情
      onClickGetRecordList(index) {
        this.detailDialogVisible = true;
        if (this.historyTableData && this.historyTableData.length > 0) {
          this.recordTableData = this.historyTableData[index].recordLogList;
        }
      },
      //点击修改审批单位等按钮
      onClickEditAuthority(data, type, periodId) {
        this.showAuthorityDialog = true;
        this.showEditForm = type;
        this.periodId = periodId ? periodId : '';
        if (type === 1) {
          this.editAuthorityForm.auditType = data.audit.referenceType;
          this.editAuthorityForm.copyIdList = [];
          data.copy.forEach(item => {
            this.editAuthorityForm.copyIdList.push(item.distributionId)
          });
          this.getAuthorityByChangeType(this.editAuthorityForm.auditType);
          this.editAuthorityForm.auditId = data.audit.distributionId;
        } else if (type === 2) {
          this.editEachAuthorityForm.acceptType = data.accept.referenceType;
          this.editEachAuthorityForm.releaseType = data.release.referenceType;
          this.editEachAuthorityForm.flyCopyList = [];
          if (data.flyCopy && data.flyCopy.length > 0) {
            data.flyCopy.forEach(item => {
              this.editEachAuthorityForm.flyCopyList.push(item.distributionId)
            });
          }
          this.getAcceptByChangeType(this.editEachAuthorityForm.acceptType);
          this.getReleaseByChangeType(this.editEachAuthorityForm.releaseType);
          this.editEachAuthorityForm.acceptId = data.accept.distributionId;
          this.editEachAuthorityForm.releaseId = data.release.distributionId;
        }
      },
      //点击修改弹框确定按钮
      onClickSaveEdit() {
        if (this.showEditForm === 1) {
          if (!this.editAuthorityForm.auditId) {
            this.$message.error('计划审批单位不能为空');
            return;
          }
          this.$axios.post('/flightPlan/updatePlanDistribution', {
            planId: this.id ? parseInt(this.id) : '',
            auditId: this.editAuthorityForm.auditId,
            copyList: this.editAuthorityForm.copyIdList
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success('修改成功');
              this.onClickCancelEdit();
              this.asyncGetCheckPlanData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        } else if (this.showEditForm === 2) {
          if (!this.editEachAuthorityForm.acceptId) {
            this.$message.error('飞前申请受理单位不能为空');
            return;
          }
          if (!this.editEachAuthorityForm.releaseId) {
            this.$message.error('发布放行单位不能为空');
            return;
          }
          this.$axios.post('/flightPlan/updatePeriodDistribution', {
            planId: this.id ? parseInt(this.id) : '',
            periodId: this.periodId,
            acceptId: this.editEachAuthorityForm.acceptId,
            releaseId: this.editEachAuthorityForm.releaseId,
            flyCopyList: this.editEachAuthorityForm.flyCopyList,
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success('修改成功');
              this.onClickCancelEdit();
              //获取最新数据
              this.asyncGetCheckPlanData();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }

      },
      //点击修改弹框取消按钮
      onClickCancelEdit() {
        this.showAuthorityDialog = false;
      },
      //切换审批单位类型
      onChangeAuditType(val) {
        this.getAuthorityByChangeType(val);
      },
      //切换飞前申请受理单位类型
      onChangeAcceptType(val) {
        this.getAcceptByChangeType(val);
      },
      //切换发布放行单位类型
      onChangeReleaseType(val) {
        this.getReleaseByChangeType(val);
      },
      //审批单位类型与审批单位级联
      getAuthorityByChangeType(val) {
        this.authorityNameList.forEach(item => {
          if (item.id === val) {
            this.auditNameList = [];
            this.auditNameList = item.data.filter(eachItem => {
              return eachItem.isReceive ===  1;
            });
          }
        });
        this.editAuthorityForm.auditId = '';
      },
      //飞前申请受理单位类型与飞前申请受理单位级联
      getAcceptByChangeType(val) {
        this.authorityNameList.forEach(item => {
          if (item.id === val) {
            this.acceptNameList = [];
            this.acceptNameList = item.data;
          }
        });
        this.editEachAuthorityForm.acceptId = '';
      },
      //飞前申请受理单位类型与飞前申请受理单位级联
      getReleaseByChangeType(val) {
        this.authorityNameList.forEach(item => {
          if (item.id === val) {
            this.releaseNameList = [];
            this.releaseNameList = item.data;
          }
        });
        this.editEachAuthorityForm.releaseId = '';
      },
      //获取单位下拉数据
      asyncGetAuthorityList() {
        this.$axios.get('/distribution/getCommonDistributionList').then(res => {
          if (res.data.code === 200) {
            this.authorityNameList = [];
            this.authorityNameList = this.authorityNameList.concat(res.data.data);
          }
        })
      },
      //抄送单位按类型分类
      getCopyBySendType() {
        if (this.authorityData) {
          this.authorityData.forEach(item => {
            if (item) {
              let systemData = item.copy.filter(val => {
                return val.sendType === "系统送达";
              });
              let faxData = item.copy.filter(val => {
                return val.sendType === "传真送达";
              });
              let noData = item.copy.filter(val => {
                return val.sendType === "未送达";
              });
              this.$set(item, 'systemSendUnits', systemData);
              this.$set(item, 'faxSendUnits', faxData);
              this.$set(item, 'noSendUnits', noData);
            }
          })
        }
      },
      //切换审批单位
      onChangeAudit(val) {
        this.disableSameAudit(val);
      },
      //切换飞前申请受理单位
      onChangeAccept(val) {
        this.disableSameAccept(val);
      },
      //切换发布放行单位
      onChangeRelease(val) {
        this.disableSameRelease(val);
      },
      //切换抄送单位
      onChangeCopy(val) {
        this.disableSameCopy(val);
      },
      //切换适时态势
      onChangeFlyCopy(val) {
        this.disableSameFlyCopy(val);
      },
      //审批单位与抄送单位互斥
      disableSameAudit(val) {
        this.authorityNameList.forEach(item => {
          if (item && item.data) {
            item.data.forEach(eachVal => {
              if (val === eachVal.id) {
                this.$set(eachVal, 'disabled', true);
              } else {
                this.$set(eachVal, 'disabled', false);
              }
            })
          }
        })
      },
      //飞前申请受理单位与实时态势相关单位互斥
      disableSameAccept(val) {
        this.authorityNameList.forEach(item => {
          if (item && item.data) {
            item.data.forEach(eachVal => {
              if (val === eachVal.id) {
                this.$set(eachVal, 'disableAcceptType', true);
              } else {
                this.$set(eachVal, 'disableAcceptType', false);
              }
            })
          }
        })
      },
      //发布放行单位与实时态势相关单位互斥
      disableSameRelease(val) {
        this.authorityNameList.forEach(item => {
          if (item && item.data) {
            item.data.forEach(eachVal => {
              if (val === eachVal.id) {
                this.$set(eachVal, 'disableReleaseType', true);
              } else {
                this.$set(eachVal, 'disableReleaseType', false);
              }
            })
          }
        })
      },
      //抄送单位与审批单位互斥
      disableSameCopy(arr) {
        this.authorityNameList.forEach(item => {
          if (item && item.data) {
            item.data.forEach(eachItem => {
              if (arr.includes(eachItem.id)) {
                this.$set(eachItem, 'disabled', true);
              } else {
                this.$set(eachItem, 'disabled', false);
              }
            })
          }
        });
      },
      //实时态势相关单位与飞前受理单位互斥
      disableSameFlyCopy(arr) {
        this.authorityNameList.forEach(item => {
          if (item && item.data) {
            item.data.forEach(eachItem => {
              if (arr.includes(eachItem.id)) {
                this.$set(eachItem, 'disableType', 2);
              } else {
                this.$set(eachItem, 'disableType', 0);
              }
            })
          }
        });
      },
      //获取调配意见列表
      asyncGetRemarkData() {
        this.$axios.get('/flightPlan/getAllocateSuggestionListByPlanId?id=' + this.id).then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            this.remarkTableData = [];
            this.remarkTableData = this.remarkTableData.concat(data.allocateSuggestionListByPlanId);
          } else {
            this.message.error(res.data.msg);
          }
        })
      },
    },
    watch: {
      editAuthorityForm: {
        handler (val) {
          this.disableSameAudit(val.auditId);
          this.disableSameCopy(val.copyIdList);
        },
        deep: true
      },
      editEachAuthorityForm: {
        handler (val) {
          this.disableSameAccept(val.acceptId);
          this.disableSameRelease(val.releaseId);
          this.disableSameFlyCopy(val.flyCopyList);
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
  .base-box-content, .table-box-content {
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    font-size: 14px;
  }

  .base-info-check {
    background-color: #fff;
    border-radius: 8px;
    padding: 22px 0;
    margin-bottom: 20px;
  }

  .line {
    position: relative;
    text-align: center;
    width: 94%;
    margin: 0 auto;
    padding-bottom: 30px;
  }

  .line-title {
    width: 112px;
    position: absolute;
    top: -12px;
    left: 50%;
    margin-left: -61px;
    background: #fff;
    color: #59b9e2;
    cursor: pointer;
  }

  .box-content-borders {
    position: relative;
    border-bottom: 1px dashed #ddd;
    text-align: center;
  }

  .info-title {
    margin-left: 20px;
  }

  .allDownLoad, .colorS {
    color: #59b9e2;
  }

  .allDownLoad span, .colorS {
    cursor: pointer;
  }

  .view {
    padding: 0 20px;
  }

  .title-content {
    font-size: 14px;
  }

  .icon-Arrow {
    width: 10px;
    height: 6px;
    position: relative;
    display: inline-block;
    top: -2px;
    background: url('../../../static/images/icon-enclosureDown.png');
    background-size: contain;
    margin-right: 5px;
  }

  .icon-Arrow.active {
    background: url('../../../static/images/icon-enclosureTop.png');
    background-size: contain;
  }

  .box-content-title {
    background: #59b9e2;
    color: #fff;
    height: 70px;
    line-height: 70px;
    margin-bottom: 23px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    cursor: pointer;
  }

  .box-content-title:hover {
    background-color: #31A6D8;
  }

  .add-content-btn {
    height: 70px;
    line-height: 70px;
    border-radius: 8px;
    width: 1024px;
    margin: 20px auto;
    padding-left: 45px;
    color: #59b9e2;
    border: 1px dashed #59b9e2;
    background: #fff;
    cursor: pointer;
  }

  .add-content-btn:hover {
    background: #59b9e2;
    color: #fff;
  }

  .box-content-title .border-icon-del {
    border-left: 1px solid #fff;
    cursor: pointer;
  }

  .border-icon-del:hover {
    color: #F3908C;
  }

  .iconArrow {
    width: 28px;
    height: 28px;
    display: block;
    position: absolute;
    right: 30px;
    top: 20px;
    cursor: pointer;
    background: url('../../../static/images/icon-down.png') no-repeat;
  }
  .iconArrow:hover {
    background: url('../../../static/images/icon-down-hover.png') no-repeat;
  }
  .iconArrow.active {
    background: url('../../../static/images/icon-top.png') no-repeat;
  }
  .iconArrow.active:hover {
    background: url('../../../static/images/icon-top-hover.png') no-repeat;
  }

  .add-btn {
    height: 60px;
    text-align: right;
    margin-right: 0px;
  }

  .addClass {
    width: 70px;
    margin-left: 6px;
  }

  .add-btn-change {
    width: 135px;
  }

  .table-boxs {
    width: 96%;
    margin: 0 auto 20px;
    max-width: 1200px;
  }

  .title {
    font-size: 14px;
    margin: 5px 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ccc;
    font-weight: 700;
  }

  .title.no-border {
    padding-bottom: 0px;
    border-bottom: none;
  }

  .save_btns {
    text-align: center;
    margin: 20px 0 30px 0;
  }

  .Auditing {
    width: 138px;
  }

  .cancle_btn {
    background: none;
    color: #59b9e2;
  }

  #box-content-h .el-row--flex {
    height: 40px;
  }

  #box-content-h .el-row--flex:last-child {
    height: 60px;
  }

  .fixed-box {
    position: fixed;
    padding: 15px;
    width: 100%;
    background: #fff;
    left: 200px;
    bottom: 25px;
    z-index: 99;
    box-shadow: 1px 0 5px #888888;
  }

  .row-bg-top {
    margin-top: 20px;
  }

  .row-bg-desc {
    padding-left: 22px;
  }

  .status {
    padding: 0 0 20px 0px;
    border-bottom: 1px dashed #ddd;
    margin: 0 20px 20px;
    font-weight: bold;
  }

  .colorActiveNo {
    color: #F4483A;
  }

  .colorActiveS {
    color: #279b37;
  }

  .colorActiveW {
    color: #2c3e50;
  }
  .fileTitle {
    line-height: 25px;
  }
  .fileName {
    display: inline-block;
    color: #59b9e2;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: top;
  }
  .fileName img {
    vertical-align: middle;
  }
  .fileLists-content {
    margin: -40px 0 0 160px;
  }
  .fileLists-item {
    display: inline-block;
    width: 40%;
    max-width: 645px;
    vertical-align: top;
  }
  .item-title {
    display: inline-block;
    width: 160px;
    text-align: right;
    font-weight: 700;
    margin-right: 12px;
  }
  .urlName {
    display: inline-block;
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .split-border {
    border-top: 1px dashed #ccc;
    margin: 10px 20px;
  }
  .table-box {
    padding: 0;
    background-color: transparent;
  }
  .M-label {
    display: inline-block;
    width: 180px;
    font-weight: 700;
    text-align: right;
  }
  .M-content {
    margin: -19px 0 0 185px;
    line-height: 20px;
  }
  .content-box {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
  }
  .flyPoint {
    text-align: left;
    padding-left: 20px;
  }
  .content-box-icon {
    text-align: right;
  }
  .m-change-status-btn {
    position: absolute;
    top: -5px;
    left: 160px;
  }
  .content-table {
    display: inline-block;
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
  .content-table:hover {
    opacity: 0.5;
  }
  .content-table-hide {
    background: url('../../../static/images/icon-arrow-down.png') no-repeat;
  }
  .content-table-show {
    background: url('../../../static/images/icon-arrow-up.png') no-repeat;
  }
  .historyTable {
    margin: 0 auto;
    max-width: 1200px;
  }
  .table-content-item {
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .history-header {
    padding: 20px 30px 10px;
    border-radius: 8px;
  }
  .history-header:hover {
    background-color: #F1F8FF;
    cursor: pointer;
  }
  .history-title {
    border-bottom: 1px dashed #ccc;
    margin-bottom: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .box-content-item {
    position: relative;
    top: 16px;
    font-size: 16px;
    font-weight: 700;
  }
  .history-table-box {
    padding: 0 30px 20px;
  }
  .plan-name {
    margin: -19px 0 0 184px;
  }
  .authority-box {
    padding: 30px;
  }
  .edit-item {
    margin-right: 10px;
  }
  .copy-box {
    display: flex;
  }
  .copy-title {
    display: inline-block;
    width: 80px;
    text-align: right;
    color: #a7a7a7;
  }
  .copy-item {
    flex: 1;
  }
  .no-copy {
    text-align: center;
  }
  .remark-title {
    font-weight: 700;
    padding-bottom: 10px;
    font-size: 16px;
  }
  .remark-box {
    padding: 0 20px;
  }
</style>
<style>
  .checkApplyPlan-container {
    min-width: 1050px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .checkApplyPlan-container .box-content-title .el-form-item__label {
    color: #fff;
  }
  .checkApplyPlan-container .el-form--inline .el-form-item__label {
    font-weight: 700;
    color: #3e4a54;
  }
  .checkApplyPlan-container .box-content-title .el-form-item__label {
    color: #fff;
    font-size: 16px;
  }
  .checkApplyPlan-container .base-box-content  .el-col {
    padding: 10px 0;
  }
  .checkApplyPlan-container .el-dialog__footer {
    text-align: center;
  }
  .checkApplyPlan-container .el-dialog__header {
    text-align: left;
  }
</style>
