<template>
  <div class="check-flight-schedule-container" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>飞行进程单</el-breadcrumb-item>
      <el-breadcrumb-item>{{baseInfo.planNumber}}详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top-box">
        <div class="top-box-content">
          <div class="top-left-box">
            <div class="item-box">
              <span class="item-label">计划编码：</span>
              <span class="item-text">{{baseInfo.planNumber ? baseInfo.planNumber : '--'}}</span>
            </div>
            <div class="item-box">
              <span class="item-label">作业性质：</span>
              <span class="item-text">{{baseInfo.taskTypeName ? baseInfo.taskTypeName : '--'}}</span>
            </div>
            <div class="item-box">
              <span class="item-label">飞行时间：</span>
              <span class="item-text">{{baseInfo.flightDate ? baseInfo.flightDate : '--'}}</span>
            </div>
          </div>
          <div class="top-right-box">
            <div class="item-box">
              <span class="item-label">飞行单位：</span>
              <span class="item-text">{{baseInfo.companyName ? baseInfo.companyName : '--'}}</span>
            </div>
            <div class="item-box">
              <span class="item-label">机号：</span>
              <span class="item-text">{{baseInfo.aerocraftInfoList.join(',')}}</span>
            </div>
            <div class="item-box">
              <span class="item-label">机组联系电话：</span>
              <span class="item-text">{{baseInfo.chiefCrewMobile ? baseInfo.chiefCrewMobile : '--'}}</span>
            </div>
          </div>
        </div>
    </div>
    <div class="system-record-box">
      <span class="block-title">系统报备记录</span>
      <div class="has-some-one-content-box" v-if="stepOneDataIsNull || stepTwoDataIsNull || stepThreeDataIsNull">
        <div class="step-box">
          <span class="step-box-title">放飞申请</span>
          <div class="step-content" :class="{'has-no-data': !stepOneDataIsNull}">
            <div v-if="stepOneDataIsNull">
              <div class="request-people-info">
                <p>
                  <span>报备人：</span>
                  <span>{{flightPreparationVo.applyOperatorName ? flightPreparationVo.applyOperatorName : '--'}}</span>
                </p>
                <p class="request-response-time">
                  <span>提交时间：</span>
                  <span>{{flightPreparationVo.applyTime ? flightPreparationVo.applyTime : '--'}}</span>
                </p>
              </div>
              <div class="request-info-box">
                <p>
                  <span class="request-info-box-label">开飞时间：</span>
                  <span>{{flightPreparationVo.takeoffTime ? flightPreparationVo.takeoffTime : '--'}}</span>
                </p>
                <p>
                  <span class="request-info-box-label">结束时间：</span>
                  <span>{{flightPreparationVo.landingTime ? flightPreparationVo.landingTime : '--'}}</span>
                </p>
                <p class="request-info-remark-box">
                  <span class="request-info-box-label active">备注：</span>
                  <span class="remark-text">
                    {{flightPreparationVo.applyRemark ? flightPreparationVo.applyRemark : '--'}}
                  </span>
                </p>
              </div>
              <div class="response-people-info">
                <div>
                  <p>
                    <span>受理人：</span>
                    <span>
                    {{flightPreparationVo.approvedOperatorName ? flightPreparationVo.approvedOperatorName : '--'}}
                  </span>
                  </p>
                  <p class="request-response-time">
                    <span>受理时间：</span>
                    <span>{{flightPreparationVo.approvedTime ? flightPreparationVo.approvedTime : '--'}}</span>
                  </p>
                </div>
              </div>
              <div class="response-info-box">
                <div v-if="flightPreparationVo">
                  <p>
                    <span class="request-info-box-label">受理意见：</span>
                    <span class="response-info-text" v-if="flightPreparationVo.status === 1">允许飞行</span>
                    <span class="response-info-text active" v-else-if="flightPreparationVo.status === 2">取消飞行</span>
                    <span v-else>--</span>
                  </p>
                  <p>
                    <span class="request-info-box-label">开飞时间：</span>
                    <span class="response-info-text " :class="{'black':flightPreparationVo.status !== 1}">
                      {{flightPreparationVo.approvedTakeoffTime ? flightPreparationVo.approvedTakeoffTime : '--'}}
                    </span>
                  </p>
                  <p>
                    <span class="request-info-box-label">结束时间：</span>
                    <span class="response-info-text" :class="{'black':flightPreparationVo.status !== 1}">
                      {{flightPreparationVo.approvedLandingTime ? flightPreparationVo.approvedLandingTime : '--'}}
                    </span>
                  </p>
                  <p class="request-info-remark-box">
                    <span class="request-info-box-label active">备注：</span>
                    <span class="remark-text">
                      {{flightPreparationVo.approvedRemark? flightPreparationVo.approvedRemark : '--'}}
                    </span>
                  </p>
                </div>
              </div>
              <div v-if="flightPreparationVo.periodPreparationList && flightPreparationVo.periodPreparationList.length >0">
                <div v-for="(item,index) in flightPreparationVo.periodPreparationList" :key="index">
                  <div class="response-people-info active">
                    <div>
                      <p>
                        <span>管制员：</span>
                        <span>{{item.regulatoryName ? item.regulatoryName : '--'}}</span>
                      </p>
                      <p class="request-response-time">
                        <span>操作时间：</span>
                        <span>{{item.regulatoryTime ? item.regulatoryTime : '--'}}</span>
                      </p>
                    </div>
                  </div>
                  <div class="response-info-box">
                    <p>
                      <span class="request-info-box-label">调配意见：</span>
                      <span class="remark-text">{{item.regulatoryRemark ? item.regulatoryRemark : '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="step-has-no-data">暂未报备</div>
          </div>
        </div>
        <div class="step-box">
          <span class="step-box-title">起飞报</span>
          <div class="step-content" :class="{'has-no-data': !stepTwoDataIsNull}">
            <div v-if="stepTwoDataIsNull">
              <div class="request-people-info">
                <p>
                  <span>报备人：</span>
                  <span>{{takeoffPreparationVo.applyOperatorName ? takeoffPreparationVo.applyOperatorName : '--'}}</span>
                </p>
                <p class="request-response-time">
                  <span>提交时间：</span>
                  <span>{{takeoffPreparationVo.applyTime ? takeoffPreparationVo.applyTime : '--'}}</span>
                </p>
              </div>
              <div class="request-info-box">
                <p>
                  <span class="request-info-box-label">开飞时间：</span>
                  <span>{{takeoffPreparationVo.takeoffTime ? takeoffPreparationVo.takeoffTime : '--'}}</span>
                </p>
                <p class="request-info-remark-box">
                  <span class="request-info-box-label active">备注：</span>
                  <span class="remark-text">
                    {{takeoffPreparationVo.applyRemark? takeoffPreparationVo.applyRemark : '--'}}
                  </span>
                </p>
              </div>
              <div v-if="takeoffPreparationVo.periodPreparationList && takeoffPreparationVo.periodPreparationList.length >0">
                <div v-for="(item,index) in takeoffPreparationVo.periodPreparationList" :key="index">
                  <div class="response-people-info active">
                    <div>
                      <p>
                        <span>管制员：</span>
                        <span>{{item.regulatoryName ? item.regulatoryName : '--'}}</span>
                      </p>
                      <p class="request-response-time">
                        <span>操作时间：</span>
                        <span>{{item.regulatoryTime ? item.regulatoryTime : '--'}}</span>
                      </p>
                    </div>
                  </div>
                  <div class="response-info-box">
                    <p>
                      <span class="request-info-box-label">调配意见：</span>
                      <span class="remark-text">{{item.regulatoryRemark ? item.regulatoryRemark : '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
            <div v-else class="step-has-no-data">暂未报告</div>
          </div>
        </div>
        <div class="step-box">
          <span class="step-box-title">降落报</span>
          <div class="step-content" :class="{'has-no-data': !stepThreeDataIsNull}">
            <div v-if="stepThreeDataIsNull">
              <div class="request-people-info">
                <p>
                  <span>报备人：</span>
                  <span>{{landPreparationVo.applyOperatorName ? landPreparationVo.applyOperatorName : '--'}}</span>
                </p>
                <p class="request-response-time">
                  <span>提交时间：</span>
                  <span>{{landPreparationVo.applyTime ? landPreparationVo.applyTime : '--'}}</span>
                </p>
              </div>
              <div class="request-info-box">
                <p>
                  <span class="request-info-box-label">结束时间：</span>
                  <span>{{landPreparationVo.landingTime ? landPreparationVo.landingTime : '--'}}</span>
                </p>
                <p class="request-info-remark-box">
                  <span class="request-info-box-label active">备注：</span>
                  <span class="remark-text">
                    {{landPreparationVo.applyRemark ? landPreparationVo.applyRemark : '--'}}</span>
                </p>
              </div>
            </div>
            <div v-else class="step-has-no-data">暂未报告</div>
          </div>
        </div>
      </div>
      <div class="all-has-no-data-box" v-else>
        暂无报备信息
      </div>
    </div>
    <div class="footer-btn-box">
      <el-button type="primary" class="query" @click="onClickCancelBtn">返回</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        flightPlanPeriodId: "",
        queryString: "",
        baseInfo: {
          planNumber: "",    //计划编号
          companyName: "",   //飞行单位
          taskTypeName: "",  //作业性质
          flightDate:  "",   //飞行时间
          chiefCrewMobile: "",//机组联系人电话,
          aerocraftInfoList: [] //机号
        },
        authorityPreparationList: [],  //管制值班记录
        stepOneDataIsNull: false,
        flightPreparationVo: {
          applyUserName: "",
          applyTakeoffTime: "",
          applyLandingTime: "",
          applyComment: "",
          applyTime: "",
          authorityMemberName: "",
          approvedTakeoffTime: "",
          approvedLandingTime: "",
          approvedTime: "",
          authorityComment: "",
          isApproved: ""
        },
        stepTwoDataIsNull: false,
        takeoffPreparationVo: {
          applyUserName: "",
          applyTakeoffTime: "",
          applyLandingTime: "",
          applyComment: "",
          applyTime: "",
          authorityMemberName: "",
          approvedTakeoffTime: "",
          approvedLandingTime: "",
          approvedTime: "",
          authorityComment: "",
          isApproved: ""
        },
        stepThreeDataIsNull: false,
        landPreparationVo: {
          applyUserName: "",
          applyTakeoffTime: "",
          applyLandingTime: "",
          applyComment: "",
          applyTime: "",
          authorityMemberName: "",
          approvedTakeoffTime: "",
          approvedLandingTime: "",
          approvedTime: "",
          authorityComment: "",
          isApproved: ""
        },
        loading: true
      }
    },
    created() {
      this.flightPlanPeriodId = this.$route.query.flightPlanPeriodId;
      this.queryString = this.$route.query.queryString;
      this.asyncgGetPeriodOperationVoById(this.flightPlanPeriodId);
    },
    methods: {
      onClickCancelBtn() {
        this.$router.push({
          path: "/flightSchedule",
          query: {
            queryString: this.queryString
          }
        })
      },
      //根据id查询进程单详情
      asyncgGetPeriodOperationVoById(id) {
        this.$axios.get('/flightPlan/getPeriodOperationVo?flightPlanPeriodId=' + id).then(res => {
          if (res.data.code === 200) {
            let _data = res.data.data;
            //基本信息
            this.baseInfo = {...this.baseInfo,
              planNumber: _data.planNumber,
              taskTypeName: _data.taskTypeName,
              companyName: _data.companyName,
              flightDate: _data.flightDate,
              chiefCrewMobile: _data.chiefCrewMobile,
              aerocraftInfoList: _data.aerocraftInfoList
            };
            //管制值班记录
            this.authorityPreparationList = [];
            this.authorityPreparationList = this.authorityPreparationList.concat(_data.authorityPreparationList)
            //系统报备记录
            if(!_data.flightPreparationVo) {
              this.stepOneDataIsNull = false;
            }else {
              this.flightPreparationVo = _data.flightPreparationVo;
              this.stepOneDataIsNull = true;
            }
            if(!_data.takeoffPreparationVo) {
              this.stepTwoDataIsNull = false;
            }else {
              this.takeoffPreparationVo = _data.takeoffPreparationVo;
              this.stepTwoDataIsNull = true;
            }
            if(!_data.landPreparationVo) {
              this.stepThreeDataIsNull = false;
            }else {
              this.landPreparationVo = _data.landPreparationVo;
              this.stepThreeDataIsNull = true;
            }
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      }
    }
  }
</script>
<style scoped>
  .top-box, .supervising-worker-record-box, .system-record-box {
    border-radius: 6px;
    background-color: #fff;
    margin-bottom: 20px;
  }
  .supervising-worker-record-box {
    padding-bottom: 30px;
  }
  .top-box-content {
    width: 950px;
    margin: 15px auto;
    padding: 25px 0 10px;
    overflow: hidden;
    font-size: 14px;
  }
  .item-box {
    margin-bottom: 15px;
  }
  .top-left-box {
    float: left;
  }
  .top-right-box {
    float: right;
    margin-right: 150px;
  }
  .item-label {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .item-text {
    color: #a7a7a7;
  }
  .has-some-one-content-box {
    width: 950px;
    margin: 0 auto;
    padding: 35px 0 0;
    font-size: 14px;
  }
  .all-has-no-data-box {
    width: 950px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    margin: 0 auto;
  }
  .step-box {
    display: flex;
  }
  .step-box-title {
    width: 100px;
    text-align: right;
    flex: 0 1 100px;
    position: relative;
    top: -4px;
  }
  .step-content {
    flex: 1;
    padding: 25px 0 30px 25px;
    margin-left: 25px;
    border-left: 2px solid #59b9e2;
    position: relative;
  }
  .step-has-no-data {
    flex: 1;
    position: absolute;
    top: -4px;
    left: 35px;
    color: #a7a7a7;
  }
  .step-content:before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #59b9e2;
    top: 0;
    left: -9px;
  }
  .step-content.has-no-data {
    border-left: 2px solid #ccc;
  }
  .step-content.has-no-data:before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #ccc;
    top: 0;
    left: -9px;
  }
  .step-box:last-child .step-content {
    border-left: none;
  }
  .step-box:last-child .step-content:before {
    left: -7px;
  }
  .request-people-info,
  .response-people-info {
    margin-bottom: 6px;
    position: relative;
    padding-left: 12px;
  }
  .request-people-info p,
  .response-people-info p{
    display: inline-block;
  }
  .request-info-box {
    border-radius: 6px;
    background-color: #f4f5f7;
    margin-bottom: 15px;
    padding: 10px 12px;
  }
  .request-info-box p,
  .response-info-box p {
    margin-bottom: 7px;
  }
  .request-response-time {
    position: absolute;
    right: 5px;
  }
  .response-info-box {
    background-color: #eef6f9;
    border-radius: 6px;
    padding: 10px 12px;
  }
  .request-info-box-label {
    font-weight: bold;
    font-size: 14px;
    width: 75px;
    text-align: right;
  }
  .response-info-text {
    color: #519800;
    font-weight: bold;
    font-size: 14px;
  }
  .request-info-remark-box {
    display: flex;
  }
  .request-info-remark-box .request-info-box-label {
    flex: 0 1 75px;
  }
  .request-info-remark-box .remark-text {
    flex: 1;
  }
  .footer-btn-box {
    margin: 20px 0;
    text-align: center;
  }
  .block-title {
    display: block;
    padding: 20px 0;
    margin: 0 20px;
    border-bottom: 1px dashed #ccc;
  }
  .record-list-box {
    width: 950px;
    padding-left: 40px;
    box-sizing: border-box;
    margin: 15px auto 0;
    font-size: 14px;
  }
  .check-flight-schedule-container {
    padding-top: 0;
  }
</style>
