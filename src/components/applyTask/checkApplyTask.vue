<template>
  <div class="check-apply-task-container"
       :class="[{'agree': action==='edit' && !agree} , {'dontagree': action==='edit' && agree}]"  v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/applyTask' }">飞行任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="base-info-box second-box">
      <div class="content-box">
        <div class="status">
          <div class="colorActiveW" v-if="status === 2 ">
            <i class="el-icon-time"></i> 待审核
          </div>
          <div class="colorActiveS" v-else-if="status === 3">
            <i class="el-icon-circle-check-outline"></i> 已通过
          </div>
          <div class="colorActiveNo" v-else-if="status === 4">
            <i class="el-icon-error"></i> 未通过
          </div>
          <div class="colorActiveW" v-if="status === 5 ">
            <i class="el-icon-time"></i> 受理中
          </div>
          <div v-if="status !== 2 && status !== 5">
            <el-row>
              <el-col :span="22">
                <span class="M-label" style="width: 93px;">审批意见 : </span>
                <div class="remark-content" v-if="remark">{{remark}}</div>
                <span v-else-if="status === 3 && (applicationType === 2 || applicationType === 3)">请严格按照管制部门批复的作业空域/航线执行</span>
                <span v-else>--</span>
              </el-col>
            </el-row>
            <el-row v-if="approveFileList && approveFileList.length > 0 && (applicationType === 2 || applicationType === 3)">
              <el-col>
                <span class="M-label" style="width: 93px;">批件编号 : </span>
                <span v-for="item in approveFileList" :key="item.id">{{item.accessoryName}}</span>
                <span class="file-download" @click="downloadAllPJ"><img src="../../../static/images/icon-download.png" alt="">下载批件</span>
              </el-col>
              <el-col class="sendFax-box">
                <span>传真发送记录</span>
                <el-table :data="faxTableData" class="checkTable">
                <el-table-column prop="receiveName" label="接收单位" width="180" align="center"></el-table-column>
                <el-table-column prop="faxNo" label="传真号" align="center"></el-table-column>
                <el-table-column prop="sendCompleteTime" label="发送时间" width="180" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status === 1" class="send-success">发送成功</div>
                    <div v-else-if="scope.row.status === 3" class="send-success">待发送...</div>
                    <div v-else-if="scope.row.status === 2" class="send-fail">
                      <p>发送失败</p>
                      <p class="send-fail-cause">{{ scope.row.failCause }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="creator" label="操作人" align="center"></el-table-column>
                </el-table>
                <div class="send-expand" v-show="showExpand">
                  <span class="send-expand-item" @click="onClickExpandData">
                    <i :class="isExpand ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
                    <span>{{isExpand ? '展开全部' : '收起展开'}}</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-row>
          <el-col :span="10" class="first-label">基本信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3"><span class="M-label">任务名称 : </span>{{taskName ? taskName : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="19" :offset="3"><span class="M-label">任务性质 : </span>{{taskTypeName ? taskTypeName : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="19" :offset="3"><span class="M-label">提交单位 : </span>{{generalAviationCompanyName ? generalAviationCompanyName : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3"><span class="M-label">飞行单位 : </span>{{entrustingPartyName ? entrustingPartyName : '--'}}</el-col>
          <el-col :span="10"><span class="M-label">报批单位 : </span>{{approvalAuthorityName ? approvalAuthorityName : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3"><span class="M-label">任务编号 : </span>{{taskNumber ? taskNumber : '--'}}</el-col>
          <el-col :span="10" v-show="originalTaskNumber"><span class="M-label">续签原始任务编号 : </span>
            <span @click="jumpToCheckOriginalTask" class="content-original">{{originalTaskNumber ? originalTaskNumber : '--'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3"><span class="M-label">联系人 : </span>{{contact ? contact : '--'}}</el-col>
          <el-col :span="10"><span class="M-label">联系人手机号 : </span>{{contactTel ? contactTel : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3"><span class="M-label">联系人座机 : </span>{{contactTelephone ? contactTelephone : '--'}}</el-col>
          <el-col :span="10"><span class="M-label">机组负责人手机号 : </span>{{chiefCrewMobile ? chiefCrewMobile : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3">
            <span class="M-label">空域申请方式 : </span>
            <span v-if="applicationType === 1">线上补录</span>
            <span v-else-if="applicationType === 2">线上申请</span>
            <span v-else>续签申请</span>
          </el-col>
          <el-col :span="10"><span class="M-label">传真 : </span>{{fax ? fax : '--'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3"><span class="M-label">任务起始日期 : </span>{{startDate}}至{{endDate}}</el-col>
          <el-col :span="10"><span class="M-label">任务审核日期 : </span>{{submitDate ? submitDate : '--'}}</el-col>
        </el-row>
      </div>
    </div>
    <div class="airspace-info-box second-box">
      <div class="content-box">
        <el-row type="flex" justify="space-between">
          <el-col :span="10" style="height: 40px; line-height: 40px;" class="first-label">作业区域</el-col>
          <el-col :span="10" style="text-align: right;">
            <el-button class="second-btn" @click="previewMap()">预览</el-button>
            <el-button class="second-btn" @click="onClickEditAuthority" v-if="status === 3">批量修改</el-button>
          </el-col>
        </el-row>
        <el-table :data="airspaceAndAirLineList" class="checkTable">
          <el-table-column label="起飞场地"  width="200" align="center">
            <template  slot-scope="scope">
              <div :class="scope.row.departuredFieldPoint.lat?'flyPoint':''">
                <p>{{scope.row.upAirPortName}}</p>
                <p>{{scope.row.departuredFieldPoint.lat}}</p>
                <p>{{scope.row.departuredFieldPoint.lng}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="降落场地" width="200" align="center">
            <template  slot-scope="scope">
              <div :class="scope.row.landingFieldPoint.lat?'flyPoint':''">
                <p>{{scope.row.downAirPortName}}</p>
                <p>{{scope.row.landingFieldPoint.lat}}</p>
                <p>{{scope.row.landingFieldPoint.lng}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="作业区域范围" align="center" min-width="200">
            <template  slot-scope="scope">
              <p>{{scope.row.workspace}}</p>
              <p v-if="scope.row.airspaceAccessWay">空域进出方法：{{scope.row.airspaceAccessWay}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="heightDesc" label="飞行高度" align="center" width="150"></el-table-column>
          <el-table-column label="审批 / 受理单位" align="center" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.scopeDistributionModelMap">
                <div v-if="scope.row.scopeDistributionModelMap.audit">
                  <p>{{scope.row.scopeDistributionModelMap.audit.name}}</p>
                  <p class="authority-type">（计划审批单位）</p>
                </div>
                <div v-if="scope.row.scopeDistributionModelMap.fly">
                  <p>{{scope.row.scopeDistributionModelMap.fly.name}}</p>
                  <p class="authority-type">（发布放行许可单位）</p>
                </div>
                <div v-if="scope.row.scopeDistributionModelMap.accept">
                  <p>{{scope.row.scopeDistributionModelMap.accept.name}}</p>
                  <p class="authority-type">（飞前申请受理单位）</p>
                </div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="适时态势相关单位" align="center" header-align="center" min-width="300">
            <template slot-scope="scope">
              <div v-if="scope.row.scopeDistributionModelMap">
                <div v-if="scope.row.scopeDistributionModelMap.flyCopy && scope.row.scopeDistributionModelMap.flyCopy.length > 0">
                  <span v-for="(item, index) in scope.row.scopeDistributionModelMap.flyCopy" :key="item.distributionId">
                    <span v-show="index !== 0">、</span>
                    <span>{{item.name}}</span>
                  </span>
                </div>
              </div>
              <div class="no-copy" v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="计划抄送单位" align="left" header-align="center" min-width="300">
            <template slot-scope="scope">
              <div v-if="scope.row.scopeDistributionModelMap">
                <div v-if="scope.row.scopeDistributionModelMap.copy && scope.row.scopeDistributionModelMap.copy.length > 0">
                  <div class="copy-box">
                    <span class="copy-title">系统送达：</span>
                    <div class="copy-item" v-if="scope.row.scopeDistributionModelMap.systemSendUnits && scope.row.scopeDistributionModelMap.systemSendUnits.length > 0">
                    <span v-for="(item, index) in scope.row.scopeDistributionModelMap.systemSendUnits" :key="item.distributionId" class="copy-item">
                      <span v-show="index !== 0">、</span>
                      <span>{{item.name}}</span>
                    </span>
                    </div>
                    <div v-else>--</div>
                  </div>
                  <div class="copy-box">
                    <span class="copy-title">传真送达：</span>
                    <div class="copy-item" v-if="scope.row.scopeDistributionModelMap.faxSendUnits && scope.row.scopeDistributionModelMap.faxSendUnits.length > 0">
                  <span v-for="(item, index) in scope.row.scopeDistributionModelMap.faxSendUnits" :key="item.distributionId" class="copy-item">
                    <span v-show="index !== 0">、</span>
                    <span>{{item.name}}</span>
                    <span v-show="item.fax">（{{item.fax}}）</span>
                  </span>
                    </div>
                    <div v-else>--</div>
                  </div>
                  <div class="copy-box">
                    <span class="copy-title">未送达：</span>
                    <div class="copy-item" v-if="scope.row.scopeDistributionModelMap.noSendUnits && scope.row.scopeDistributionModelMap.noSendUnits.length > 0">
                  <span v-for="(item, index) in scope.row.scopeDistributionModelMap.noSendUnits" :key="item.distributionId" class="copy-item">
                    <span v-show="index !== 0">、</span>
                    <span>{{item.name}}</span>
                  </span>
                    </div>
                    <div v-else>--</div>
                  </div>
                </div>
              </div>
              <div class="no-copy" v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="飞行空域涉及的管制区域" prop="districtScopeName" align="center" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.districtScopeName ? scope.row.districtScopeName : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="130">
            <template slot-scope="scope">
              <span class="discountText" v-if="scope.row.scopeType === '1'"  @click="previewMap(scope.row)">预览</span>
              <span class="discountText" v-if="status === 3" @click="onClickEditAuthority(scope.row)">{{scope.row.scopeDistributionModelMap ? '修改' : '设置'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="aircraft-info-box second-box">
      <div class="content-box">
        <el-row>
          <el-col :span="10" class="first-label">飞行器信息</el-col>
        </el-row>
        <el-table :data="aircraftTableData" class="checkTable">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="model" label="型号" width="180" align="center"></el-table-column>
          <el-table-column label="机号" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.machineCode ? scope.row.machineCode : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="machineTypeName" label="设备类型" align="center"></el-table-column>
          <el-table-column prop="aviationCompanyName" label="所属企业" align="center"></el-table-column>
        </el-table>
        <el-row style="margin: 15px 0">
          <el-col :span="10" class="first-label">飞行员信息</el-col>
        </el-row>
        <el-table :data="pilotTableData" class="checkTable">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180" align="center"></el-table-column>
          <el-table-column prop="licenseTypeName" label="执照类型" align="center"></el-table-column>
          <el-table-column prop="licenseNumber" label="执照编号" width="180" align="center"></el-table-column>
          <el-table-column label="有效日期" align="center">
            <template  slot-scope="scope">
            <span v-if="scope.row.expireType === 1">
                        {{scope.row.expireDate}}
                   </span>
              <span v-else>长期有效</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="second-box">
      <div class="content-box">
        <el-row>
          <el-col class="first-label">备降机场</el-col>
        </el-row>
        <el-row class="instructions-section">
          <el-col>{{bakLandingPoint ? bakLandingPoint : '暂无'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="10" class="first-label">其他说明事项 : </el-col>
        </el-row>
        <el-row class="instructions-section">
          <el-col>
            <div class="description" :class="{ hide:isShowMore }">
              {{description ? description : '暂无'}}
            </div>
            <div class="more" v-show="isShowMoreTitle" @click="showMore">
              <div class="more-title"><i :class="isShowMore ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>更多说明</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="other-file-info-box second-box" v-if="applicationType === 1">
      <div class="content-box">
        <el-row>
          <el-col :span="10" class="first-label">批件及附件</el-col>
        </el-row>
        <el-row style="margin-left: 20px" v-show="allFileList.length > 0 && showDownloadAllBtn">
          <el-col><span style="cursor: pointer;color: #59b9e2" @click="downloadAllFile">全部下载</span></el-col>
        </el-row>
        <div v-for="(item, index) in approveFileList" :key="index">
          <el-row>
            <el-col :span="10">
              <span class="file-title" v-if="index === 0">文件批号或文件名: </span>
              <span class="file-title" v-else style="opacity: 0;">文件批号或文件名: </span>
              <span style="font-weight: 700;">{{item.accessoryName ? item.accessoryName : '--'}}</span>
            </el-col>
          </el-row>
          <el-row v-show="approveFileList.length > 0" v-for="eachFile in item.fileList" :key="eachFile.url"  style="margin-left: 126px">
            <el-col :span="10">
              <span>{{eachFile.name}}</span>
            </el-col>
            <el-col :span="4" >
            <span style="cursor: pointer;color: #59b9e2" @click="showPreviewDialog(item.fileList, eachFile.url, item.accessoryName)"><i
              class="el-icon-view"></i> 预览</span>
              <a :href="eachFile.url" style="margin-left: 10px;color: #59b9e2;" download="eachFile.name"><i
                class="el-icon-download"></i>下载</a>
            </el-col>
          </el-row>
        </div>
        <div v-for="(item, index) in otherFileList" :key="item.id">
          <el-row>
            <el-col :span="10">
              <span class="file-title" v-if="index === 0">其他批件: </span>
              <span class="file-title" v-else style="opacity: 0;">其他批件: </span>
              <span style="font-weight: 700;">{{item.accessoryName ? item.accessoryName : '--'}}</span>
            </el-col>
            <el-col :span="10">
              <span class="file-title" v-if="index === 0">颁发机构: </span>
              <span class="file-title" v-else style="opacity: 0;">颁发机构: </span>
              <span style="font-weight: 700;">{{item.authority ? item.authority : '--'}}</span>
            </el-col>
          </el-row>
          <el-row v-show="otherFileList.length > 0"  v-for="eachFile in item.fileList" :key="eachFile.url"  style="margin-left: 126px">
            <el-col :span="10">
              <span>{{eachFile.name}}</span>
            </el-col>
            <el-col :span="4" >
            <span style="cursor: pointer;color: #59b9e2" @click="showPreviewDialog(item.fileList, eachFile.url, item.accessoryName)"><i
              class="el-icon-view"></i> 预览</span>
              <a :href="eachFile.url" style="margin-left: 10px;color: #59b9e2;" download="eachFile.name"><i
                class="el-icon-download"></i>下载</a>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="other-file-info-box second-box" v-else-if="applicationType === 2 || applicationType === 3">
      <div class="content-box">
        <el-row>
          <el-col :span="10" class="first-label">其他批件</el-col>
        </el-row>
        <div v-for="(item, index) in otherFileList" :key="item.id">
          <el-row>
            <el-col :span="10">
              <span class="file-title-other" v-if="index === 0">文件名: </span>
              <span class="file-title-other" v-else style="opacity: 0;">文件名: </span>
              <span style="font-weight: 700;">{{item.accessoryName ? item.accessoryName : '--'}}</span>
            </el-col>
            <el-col :span="10">
              <span class="file-title" v-if="index === 0">颁发机构: </span>
              <span class="file-title" v-else style="opacity: 0;">颁发机构: </span>
              <span style="font-weight: 700;">{{item.authority ? item.authority : '--'}}</span>
            </el-col>
          </el-row>
          <el-row v-show="otherFileList.length > 0"  v-for="eachFile in item.fileList" :key="eachFile.url"  style="margin-left: 56px">
            <el-col :span="10">
              <span>{{eachFile.name}}</span>
            </el-col>
            <el-col :span="4" >
            <span style="cursor: pointer;color: #59b9e2" @click="showPreviewDialog(item.fileList, eachFile.url, item.accessoryName)"><i
              class="el-icon-view"></i> 预览</span>
              <a :href="eachFile.url" style="margin-left: 10px;color: #59b9e2;" download="eachFile.name"><i
                class="el-icon-download"></i>下载</a>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="other-file-info-box second-box">
      <div class="content-box">
        <el-row class="title"><el-col :span="10" class="first-label">资质证件</el-col> </el-row>
        <el-row style="margin-left: 20px"  v-show="accessoryList.length > 0">
          <el-col>
            <span class="preview-all" @click="showAllCertificatePreviewDialog"><i class="el-icon-view"></i>全部预览</span>
            <span class="download-all preview-all" @click="downloadAllCertificateFile"><i
              class="el-icon-download"></i>全部下载</span>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in accessoryList" :key="index"
                style="margin-left: 20px">
          <el-col :span="10">
            <span v-show="item.accessoryTypeName" style="margin-right: 10px;">{{item.accessoryTypeName}}</span>
            <div v-for="(eachFile, idx) in item.taskForUrlList" :key="eachFile.id" v-show="item.showMoreFile" style="line-height: 22px;">
              <div style="margin-right: 10px;">{{eachFile.accessAddressName}}</div>
            </div>
          </el-col>
          <el-col :span="4" v-show="accessoryList.length > 0">
            <span style="cursor: pointer;color: #59b9e2" @click="showPreviewDialog(item.taskForUrlList, '', item.accessoryTypeName, item.accessoryType)"><i class="el-icon-view"></i> 预览</span>
            <a :href="item.taskForUrlList[0].accessAddressUrl" style="margin-left: 10px;color: #59b9e2;" download="eachFile.name" v-if="item.taskForUrlList.length === 1"><i class="el-icon-download"></i>下载</a>
            <span class="download-all preview-all" v-else-if="item.taskForUrlList.length > 1" @click="downloadPartCertificateFile(item.referenceId, item.accessoryType)"><i class="el-icon-download"></i>下载</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="other-file-info-box second-box history-box" v-show="action==='check'">
      <div class="content-box">
        <el-row :class="['title', showHistoryTable ? 'history-title' : '']" type="flex" justify="space-between" @click.native="showHistoryTable = !showHistoryTable">
          <el-col class="first-label">历史记录</el-col>
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
    <div class="btn-box" v-show="action==='check'">
      <el-button type="primary" class="query" @click="jumpToApplyTask">返回</el-button>
    </div>
    <div class="fixed-check-box" v-show="action==='edit'">
      <div style="margin-bottom: 15px">
        <span style="font-size: 14px;margin-right: 10px">审批意见 : </span>
        <el-radio v-model="agree" label="1">同意</el-radio>
        <el-radio v-model="agree" label="2">驳回</el-radio>
      </div>
      <div v-show="agree">
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="500"
          :placeholder="agree==='1' ? '' : '请输入驳回原因'"
          v-model="remark">
        </el-input>
        <div style="margin-top: 20px; text-align: center">
          <el-button type="primary" class="query" @click="asyncAuditFlightTask">审核</el-button>
          <el-button class="second-btn" @click="jumpToApplyTask">返回</el-button>
        </div>
      </div>
    </div>
    <form action="/api/flighttask/downLoadAllFile" hidden ref="downloadForm" method="get">
      <input type="hidden" name="taskId" v-model="id">
    </form>
    <form action="/api/flighttask/downLoadAllFile" hidden ref="downloadPJForm" method="get">
      <input type="hidden" name="taskId" v-model="id">
      <input type="hidden" name="accessoryType" v-model="accessoryTypeId">
    </form>
    <form action="/api/flighttask/downLoadFile" hidden ref="downloadCertificateForm" method="get">
      <input type="hidden" name="taskId" v-model="id">
    </form>
    <form action="/api/flighttask/downLoadPartFile" hidden ref="downloadPartFile" method="get">
      <input type="hidden" name="taskId" v-model="id">
      <input type="hidden" name="referenceId" v-model="referenceId">
      <input type="hidden" name="accessoryType" v-model="accessoryType">
    </form>
    <mapview
      :is-map-pop-show="isMapPopShow"
      :map-info="mapInfo"
      :coord-data="coordDate"
      :gaode-coord-arr="gaodeCoordArr"
      @mapPreviewPass="mapPreviewPass"
      :maptype="mapType"
    ></mapview>
    <faxpreview :fax-to-show="faxToShow" :show-fax-preview="showFaxPreview" :initial-photo-to-show="initialPhotoToShow" @faxPreviewPass="faxPreviewPass"></faxpreview>
    <el-dialog
      title="修改"
      :visible.sync="showAuthorityDialog"
      :before-close="onClickCancelEdit"
      width="683px">
      <el-form :model="editAuthorityForm" ref="editAuthorityForm" label-width="150px">
        <el-form-item label="飞前申请受理单位：">
          <el-col :span="7" class="edit-item">
            <el-select placeholder="请选择" v-model="editAuthorityForm.acceptType" @change="onChangeAcceptType">
              <el-option v-for="item in acceptTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-select placeholder="请选择" filterable clearable v-model="editAuthorityForm.acceptId" style="width: 306px;" @change="onChangeAccept">
              <el-option v-for="item in acceptNameList" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disableType === 2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="发布放行单位：">
          <el-col :span="7" class="edit-item">
            <el-select placeholder="请选择" v-model="editAuthorityForm.releaseType" @change="onChangeReleaseType">
              <el-option v-for="item in authorityTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-select placeholder="请选择" filterable clearable v-model="editAuthorityForm.releaseId" style="width: 306px;" @change="onChangeRelease">
              <el-option v-for="item in releaseNameList" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disableType === 2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="计划审批单位：">
          <el-col :span="7" class="edit-item">
            <el-select placeholder="请选择" v-model="editAuthorityForm.auditType" @change="onChangeAuditType">
              <el-option v-for="item in authorityTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-select placeholder="请选择" filterable clearable v-model="editAuthorityForm.auditId" style="width: 306px;" @change="onChangeAudit">
              <el-option v-for="item in auditNameList" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disable"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="实时态势相关单位：">
          <el-select placeholder="请选择" filterable v-model="editAuthorityForm.flyCopyList" multiple style="width: 460px;" @change="onChangeFlyCopy">
            <el-option-group
              v-for="group in authorityNameList"
              :key="group.id"
              :label="group.name">
              <el-option v-for="item in group.data" :label="item.name" :value="item.id" :key="item.id" :disabled="item.disableAcceptType || item.disableReleaseType"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="计划抄送单位：">
          <el-select placeholder="请选择" filterable v-model="editAuthorityForm.copyIdList" multiple style="width: 460px;" @change="onChangeCopy">
            <el-option-group
              v-for="group in authorityNameList"
              :key="group.id"
              :label="group.name">
              <el-option v-for="item in group.data" :label="item.name" :value="item.id" :disabled="item.disableAuditType" :key="item.id"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="">-->
          <!--<el-checkbox v-model="editAuthorityForm.updatePlan">同时修改飞行计划页面的设置</el-checkbox>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer">
        <el-button type="primary" class="query" @click="onClickSaveEdit">确定</el-button>
        <el-button class="second-btn" @click="onClickCancelEdit">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import faxpreview from 'common/picpreview/faxpreview';
  import mapview from 'common/mapview/mapview';
  export default {
    components: {
      faxpreview,mapview
    },
    data() {
      return {
        isImage: '',
        loading: true,
        id: "",
        task_remark_num: 0, //待审任务数量
        plan_remark_num: 0, //待审计划数量
        photoToShow: "",
        status: "", //审核状态
        remark: "", //审核意见
        action: "",
        taskName: "",
        taskTypeName: "",
        generalAviationCompanyName: "",   //提交单位
        entrustingPartyName: "",   //飞行单位
        approvalAuthorityName: "",
        contact: "",
        contactTel: "",
        contactTelephone: "",
        chiefCrewMobile: "",
        startDate: "",
        endDate: "",
        submitDate: "",
        agree: "",
        airspaceAndAirLineList: [],
        aircraftTableData: [],
        pilotTableData: [],
        otherFileList: [],
        approveFileList: [],
        allFileList: [],
        accessoryList: [], //资质文件
        showPreview: false, //是否显示预览弹框
        downloadPJForm:"", //全部下载批件 线上申请
        downloadForm:"", //全部下载批件及附件
        downloadCertificateForm: "", //全部下载资质证件
        referenceId: "",
        accessoryType: "",
        queryParams: {}, //列表页查询参数
        applicationType: "", //空域申请方式
        applicationTypeName: "",
        fax: "",
        description: "", //其它说明事项
        bakLandingPoint: "", //备降机场
        accessoryTypeId: 1,
        isShowMore: false,   //是否显示更多说明
        isShowMoreTitle: false,
        // 地图预览
        isMapPopShow:false, // 空域预览地图显示
        mapInfo:{
          title:'',
          moveLng:'',
          moveLat:'',
          heightDesc:'',
          coord:[],
        },
        mapType:null,
        coordDate:[],
        gaodeCoordArr:{}, // 地图预览
        taskNumber: "",   //任务编号
        originalTaskNumber: "",  //原始任务编号
        originalId: "",  //原始任务id
        detailDialogVisible: false,//是否显示记录详情弹框
        showHistoryTable: false,  //是否显示历史记录表格
        historyTableData: [],     //历史记录列表
        recordTableData: [],     //记录列表
        faxTableData: [],
        allFaxTableData: [],
        isExpand: true,               //传真记录表格是否展开
        showExpand: false,             //是否显示展开按钮
        showFaxPreview: false,         //是否显示图片预览
        faxToShow: [],                 //预览图片列表
        initialPhotoToShow: '',        //图片预览时默认显示的大图
        showAuthorityDialog: false,    //显示修改单位弹框
        editAuthorityForm: {
          auditId: '',
          auditType: '',
          acceptId: '',
          acceptType: '',
          releaseId: '',
          releaseType: '',
          updatePlan: false,
          copyIdList: [],
          flyCopyList: [],              //实时态势相关单位
          taskScopeId: ''
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
        ],    //计划审批单位及发布放行许可单位类型下拉列表
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
        auditNameList: [],    //审批单位下拉列表
        acceptNameList: [],    //飞前申请受理单位下拉列表
        releaseNameList: [],    //发布放行单位下拉列表
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.taskId;
      this.action = this.$route.params.action;
      this.asyncGetFlightTaskById(this.id);
      this.asyncGetRemarkNum();
      this.asyncGetHistoryList();
      this.asyncGetFaxList();
      this.asyncGetAuthorityList();
    },
    mounted () {
      this.$nextTick(() => {
        let ele = document.querySelector(".description");
        let eleHeight = ele.offsetHeight;
        if (eleHeight > 60) {
          this.isShowMore = true;
          this.isShowMoreTitle = true;
        }
      })
    },
    methods: {
      //点击显示更多说明
      showMore() {
        this.isShowMore = !this.isShowMore;
      },
      //点击切换更多
      toggleMoreFile(file) {
        if(file.showMoreFile) {
          file.showMoreFile = false;
        }else {
          file.showMoreFile = true;
        }
      },
      // 图片预览参数回传
      faxPreviewPass(data){
        this.showFaxPreview = data;
        this.faxToShow = [];
        this.initialPhotoToShow = "";
      },
      //点击预览
      showPreviewDialog(fileList, fileUrl, accessoryName, accessoryType) {
        if (fileList && fileList.length > 0) {
          let _index = accessoryName.indexOf('(');
          if (accessoryType !== '0102' && _index > -1) {
            accessoryName = accessoryName.substring(0, _index);
          }
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
      //点击全部预览
      showAllCertificatePreviewDialog() {
        let fileList = [];
        if (this.accessoryList && this.accessoryList.length > 0) {
          this.accessoryList.forEach(item => {
            let _index = item.accessoryTypeName.indexOf('(');
            if (item.accessoryType !== '0102' && _index > -1) {
              this.$set(item, 'newAccessoryTypeName', item.accessoryTypeName.substring(0, _index ))
            } else {
              this.$set(item, 'newAccessoryTypeName', item.accessoryTypeName )
            }
            if (item.taskForUrlList && item.taskForUrlList.length > 0) {
              item.taskForUrlList.forEach(fileItem => {
                this.$set(fileItem, 'accessoryName', item.newAccessoryTypeName)
                fileList.push(fileItem);
              })
            }
          });
        }
        if (fileList && fileList.length > 0) {
          fileList.forEach(item => {
            if (item.accessAddressUrl) {
              this.$set(item, 'url', item.accessAddressUrl);
            }
          });
        }
        this.initialPhotoToShow = fileList[0].url;
        this.faxToShow = [];
        this.faxToShow = fileList;
        this.showFaxPreview = true;
      },
      //点击--审核
      asyncAuditFlightTask() {
        this.$axios.post("/flighttask/verifyFlightTask", {
          taskId: this.id,
          auditType: this.agree,
          remark: this.remark
        }).then(res => {
          if (res.data.code === 200) {
            this.jumpToApplyTask();
//            Bus.$emit('changeLeftNumber');
            this.asyncGetRemarkNum();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //获取待审任务, 待审计划等
      asyncGetRemarkNum() {
        this.$axios.get("/flighttask/indexCount").then(res => {
          if(res.data.code === 200) {
            this.task_remark_num = res.data.data.taskCount;
            this.plan_remark_num = res.data.data.planCount;
            this.$store.commit('setLeftNumber', {
              task_remark_num: this.task_remark_num,
              plan_remark_num: this.plan_remark_num
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //跳转至列表页
      jumpToApplyTask() {
        this.$router.push({
          path: "/applyTask",
          query: this.queryParams
        })
      },
      //跳转至原始任务查看
      jumpToCheckOriginalTask() {
        window.open("/#/applyTask/check/?taskId=" + this.originalId);
      },
      //获取回显数据
      asyncGetFlightTaskById(id) {
        this.$axios.get("/flighttask/getBackstageFlightTaskById?id=" + id).then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            this.taskName = data.taskName;
            this.status = data.status;
            this.remark = data.remark;
            this.taskTypeName = data.taskTypeName;
            this.generalAviationCompanyName = data.generalAviationCompanyName;
            this.entrustingPartyName = data.entrustingPartyName;
            this.approvalAuthorityName = data.approvalAuthorityName;
            this.contact = data.contact;
            this.contactTel = data.contactTel;
            this.contactTelephone = data.contactTelephone;
            this.chiefCrewMobile = data.chiefCrewMobile;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.submitDate = data.auditModel.auditDate;
            this.applicationType = data.applicationType;
            this.applicationTypeName = data.applicationTypeName;
            this.fax = data.fax;
            this.bakLandingPoint = data.bakLandingPoint;
            this.description = data.description;
            this.taskNumber = data.taskNumber;
            this.originalTaskNumber = data.originalTaskNumber;
            this.originalId = data.originalId;
            //空域航线信息
            this.airspaceAndAirLineList = [];
            this.airspaceAndAirLineList = this.airspaceAndAirLineList.concat(data.scopeModelList);
            //飞行器信息
            this.aircraftTableData = [];
            this.aircraftTableData = this.aircraftTableData.concat(data.aerocraftModelList);
            this.airspaceAndAirLineList.forEach(item => {
              if(item.shapeDescription) {
                this.$set(item, 'coordinateArr', item.shapeDescription.split("|"));
              }
            });
            //飞行员信息
            this.pilotTableData = [];
            this.pilotTableData = this.pilotTableData.concat(data.pilotLicenseModelList);
            this.allFileList = [];
            this.allFileList = this.allFileList.concat(data.approveFileList, data.otherFileList);
            //批件及附件
            this.otherFileList = [];
            this.otherFileList = this.otherFileList.concat(data.otherFileList);
            this.approveFileList = [];
            this.approveFileList = this.approveFileList.concat(data.approveFileList);

            //资质证件
            this.accessoryList = [];
            this.accessoryList = this.accessoryList.concat(data.accessoryList);
            this.accessoryList.forEach(item => {
              this.$set(item, 'showMoreFile', false);
            });
            this.getCopyBySendType();
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //全部下载批件及附件
      downloadAllPJ() {
        this.$refs.downloadPJForm.submit();
      },
      //全部下载批件及附件
      downloadAllFile() {
        this.$refs.downloadForm.submit();
      },
      //点击全部下载资质证件
      downloadAllCertificateFile() {
        this.$refs.downloadCertificateForm.submit();
      },
      //点击下载部分资质文件
      downloadPartCertificateFile(referenceId, accessoryType) {
        this.referenceId = referenceId;
        this.accessoryType = accessoryType;
        setTimeout(() => {
          this.$refs.downloadPartFile.submit();
        }, 20);
      },
      mapPreviewPass(data){  //地图预览参数传回
        this.isMapPopShow = data;
      },
      previewMap(para,index){ // 空域预览
        this.isMapPopShow = true;
        this.mapInfo.title = this.taskName;
        this.coordDate = [...this.airspaceAndAirLineList]; // 预览全部
        if (para) {
          this.mapType = {
            type:'all',
            index:index,
          };
          this.coordDate = para;  // 单独预览
        }else{
          this.mapType = null;
        }
      },
      //关闭历史记录详情弹出框
      handleClose(done) {
        this.detailDialogVisible = false;
      },
      //获取历史记录列表
      asyncGetHistoryList() {
        this.$axios.get('/flighttask/listOperationRecord', {
          params: {
            type: 1,
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
      //获取传真发送记录列表
      asyncGetFaxList() {
        this.$axios.get('/sendFaxLog/getBackSendFaxLogList', {
          params: {
            sendType: 1,
            faxRelevanceId: this.id
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.allFaxTableData = [];
            this.allFaxTableData = this.allFaxTableData.concat(res.data.data);
            if (this.allFaxTableData.length > 10) {
              this.faxTableData = this.allFaxTableData.slice(0, 10);
              this.showExpand = true;
            } else {
              this.faxTableData = this.allFaxTableData;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //点击展开全部
      onClickExpandData() {
        this.isExpand = !this.isExpand;
        if (this.isExpand) {
          this.faxTableData = this.allFaxTableData.slice(0, 10);
        } else {
          this.faxTableData = this.allFaxTableData;
        }
      },
      //点击修改审批单位等其他单位
      onClickEditAuthority(data) {
        this.showAuthorityDialog = true;
        this.editAuthorityForm.taskScopeId = data ? data.id : '';
        if (!data || !data.scopeDistributionModelMap) return;
        //编辑回显
        let _data = data.scopeDistributionModelMap;
        this.editAuthorityForm.auditType = _data.audit.referenceType;
        this.editAuthorityForm.acceptType = _data.accept.referenceType;
        this.editAuthorityForm.releaseType = _data.fly.referenceType;
        this.editAuthorityForm.flyCopyList = [];
        if (_data.flyCopy && _data.flyCopy.length > 0) {
          _data.flyCopy.forEach(item => {
            this.editAuthorityForm.flyCopyList.push(item.distributionId)
          });
        }
        this.editAuthorityForm.copyIdList = [];
        if (_data.copy && _data.copy.length > 0) {
          _data.copy.forEach(item => {
            this.editAuthorityForm.copyIdList.push(item.distributionId)
          });
        }
        this.getAuditByChangeType(this.editAuthorityForm.auditType);
        this.getAcceptByChangeType(this.editAuthorityForm.acceptType);
        this.getReleaseByChangeType(this.editAuthorityForm.releaseType);
        this.editAuthorityForm.auditId = _data.audit.distributionId;
        this.editAuthorityForm.acceptId = _data.accept.distributionId;
        this.editAuthorityForm.releaseId = _data.fly.distributionId;
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
      //点击修改弹框确定按钮
      onClickSaveEdit() {
        this.asyncUpdateAuthority();
      },
      //点击修改弹框取消按钮
      onClickCancelEdit() {
        this.showAuthorityDialog = false;
        this.editAuthorityForm = {
          auditId: '',
          auditType: '',
          acceptId: '',
          acceptType: '',
          releaseId: '',
          releaseType: '',
          updatePlan: false,
          copyIdList: [],
          flyCopyList: [],
          taskScopeId: ''
        };
        this.auditNameList = [];
        this.acceptNameList = [];
        this.releaseNameList = [];
      },
      //修改/设置单位
      asyncUpdateAuthority() {
        let _data = this.editAuthorityForm;
        let path = _data.taskScopeId ? '/flighttask/saveOrupdateScopeDistribution' : '/flighttask/bachUpdateScopeDistribution';
        this.$axios.post(path, {
          acceptId: _data.acceptId,
          releaseId: _data.releaseId,
          updatePlan: _data.updatePlan,
          auditId: _data.auditId,
          copyList: _data.copyIdList,
          flyCopyList: _data.flyCopyList,
          acceptId: _data.acceptId,
          taskScopeId: _data.taskScopeId,
          taskId: this.id
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功');
            this.onClickCancelEdit();
            this.asyncGetFlightTaskById(this.id);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      //切换审批单位类型
      onChangeAuditType(val) {
        this.getAuditByChangeType(val);
      },
      //切换飞前申请受理单位类型
      onChangeAcceptType(val) {
        this.getAcceptByChangeType(val);
      },
      //切换发布放行单位类型
      onChangeReleaseType(val) {
        this.getReleaseByChangeType(val);
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
      //审批单位类型与审批单位级联
      getAuditByChangeType(val) {
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
        this.editAuthorityForm.acceptId = '';
      },
      //飞前申请受理单位类型与飞前申请受理单位级联
      getReleaseByChangeType(val) {
        this.authorityNameList.forEach(item => {
          if (item.id === val) {
            this.releaseNameList = [];
            this.releaseNameList = item.data;
          }
        });
        this.editAuthorityForm.releaseId = '';
      },
      //抄送单位按类型分类
      getCopyBySendType() {
        if (this.airspaceAndAirLineList) {
          this.airspaceAndAirLineList.forEach(item => {
            if(item.scopeDistributionModelMap) {
              let eachItem = item.scopeDistributionModelMap;
              //计划抄送单位分类
              let systemData = eachItem.copy.filter(val => {
                return val.sendType === "系统送达";
              });
              let faxData = eachItem.copy.filter(val => {
                return val.sendType === "传真送达";
              });
              let noData = eachItem.copy.filter(val => {
                return val.sendType === "未送达";
              });
              this.$set(eachItem, 'systemSendUnits', systemData);
              this.$set(eachItem, 'faxSendUnits', faxData);
              this.$set(eachItem, 'noSendUnits', noData);
            }
          })
        }
      },
      //审批单位与抄送单位互斥
      disableSameAudit(val) {
        this.authorityNameList.forEach(item => {
          if (item && item.data) {
            item.data.forEach(eachVal => {
              if (val === eachVal.id) {
                this.$set(eachVal, 'disableAuditType', true);
              } else {
                this.$set(eachVal, 'disableAuditType', false);
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
                this.$set(eachItem, 'disable', true);
              } else {
                this.$set(eachItem, 'disable', false);
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
      }
    },
    computed: {
      //是否显示全部下载按钮
      showDownloadAllBtn() {
        if(this.allFileList) {
          return this.allFileList.some(item => {
            return item.fileList.length > 0;
          });
        } else {
          return false;
        }
      }
    },
    watch:{
      agree(){
        this.remark='';
      },
      editAuthorityForm: {
        handler (val) {
          this.disableSameAudit(val.auditId);
          this.disableSameAccept(val.acceptId);
          this.disableSameRelease(val.releaseId);
          this.disableSameCopy(val.copyIdList);
          this.disableSameFlyCopy(val.flyCopyList);
        },
        deep: true
      }
    },
  }
</script>
<style scoped>
  .check-apply-task-container {
    position: relative;
  }

  .check-apply-task-container.agree {
    padding-bottom: 90px;
  }

  .check-apply-task-container.dontagree {
    padding-bottom: 200px;
  }

  .second-box {
    min-width: 1050px;
    margin: 0 auto 10px;
    overflow-x: auto;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 15px;
  }

  .el-row {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .M-label {
    font-size : 14px;
    font-weight: 700;
    color: #3e4a54;
    display: inline-block;
    width: 125px;
    text-align: right;
    margin-right: 5px;
  }

  .airspace-item {
    padding: 10px 0;
  }

  .airspace-item.not-last:after {
    display: inline-block;
    content: "";
    width: 90%;
    border-top: 1px dashed #ccc;
    margin-left: 10%;
  }

  .airspace-item-index {
    position: absolute;
    left: 10%;
  }

  .btn-box {
    margin: 20px auto 30px;
    text-align: center;
  }

  .fixed-check-box {
    position: fixed;
    left: 200px;
    right: 10px;
    z-index: 10;
    background: #fff;
    bottom: 50px;
    border-top: 1px solid #ccc;
    border-radius: 5px;
    padding: 22px 15px 10px;
    box-shadow: 0 -2px 5px #ccc;

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
    color: #279b37;
  }

  .colorActiveW {
    color: #2c3e50;
  }

  .colorActiveNo, .colorActiveS, .colorActiveW {
    font-weight: bold;
    padding-bottom: 10px;
  }

  .colorActiveNo i, .colorActiveS i, .colorActiveW i {
    font-size: 23px;
    vertical-align: bottom;
  }

  .coordinate {
    position: relative;
    left: 129px;
    top: -22px;
    width: 230px;
    line-height: 200%;
  }

  .routes {
    margin: -18px 0 0 128px;
  }
  .first-label {
    font-weight: 700;
    margin-left: 5px;
  }
  .instructions-section, .other-section {
    padding:0 5px;
  }
  .file-download {
    color: #59b9e2;
    cursor: pointer;
    margin-left: 10px;
  }
  .file-download img {
    vertical-align: middle;
  }
  .description {
    font-size: 14px;
    line-height: 20px;
  }
  .hide {
    height: 60px;
    overflow: hidden;
  }
  .more {
    border-bottom: 1px dashed #ccc;
    padding-top: 20px;
    position: relative;

  }
  .more-title {
    color: #59b9e2;
    background-color: #fff;
    padding: 0 15px 0 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    cursor: pointer;
  }
  .remark-content {
    margin: -18px 0 0 100px;
    line-height: 20px;
  }
  .file-title {
    display: inline-block;
    width: 122px;
    text-align: right;
  }
  .file-title-other {
    display: inline-block;
    width: 50px;
    text-align: right;
  }
  .discountText {
    cursor: pointer;
    color: #59b9e2;
    text-decoration: underline;
  }
  .content-box {
    max-width: 1500px;
    margin: 0 auto;
  }
  .flyPoint {
    text-align: left;
    padding-left: 20px;
  }
  .content-original {
    color: #59b9e2;
    cursor: pointer;
    text-decoration: underline;
  }
  .content-box-icon {
    text-align: right;
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
  .history-title {
    border-bottom: 1px dashed #ccc;
    margin-bottom: 20px !important;
  }
  .send-expand {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    position: relative;
  }
  .send-expand-item {
    display: inline-block;
    position: absolute;
    top: -10px;
    left: 50%;
    padding: 0 10px;
    background-color: #fff;
    color: #a7a7a7;
    cursor: pointer;
  }
  .send-expand-item span {
    color: #59b9e2;
  }
  .send-success {
    color: #279b37;
  }
  .send-fail {
    color: #f44739;
  }
  .send-fail-cause {
    color: #a7a7a7;
  }
  .sendFax-box {
    padding: 10px 28px 0;
  }
  .sendFax-box > span {
    display: inline-block;
    font-weight: 700;
    color: #3e4a54;
    margin-bottom: 10px;
  }
  .history-box {
    padding: 0;
    margin: 0 auto;
  }
  .history-box .title:hover {
    background-color: #F1F8FF;
    cursor: pointer;
  }
  .history-box .title {
    padding: 15px 30px;
  }
  .history-box .title.el-row {
    margin-bottom: 0;
  }
  .history-table-box {
    padding: 0 30px 20px;
  }
  .preview-all {
    cursor: pointer;
    color: #59b9e2
  }
  .download-all {
    margin-left: 10px;
  }
  .edit-item {
    margin-right: 10px;
  }
  .authority-type {
    color: #a7a7a7;
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
</style>
<style>
  .check-apply-task-container .el-dialog__footer {
    text-align: center;
  }
  .check-apply-task-container .el-dialog__header {
    text-align: left;
  }
</style>
