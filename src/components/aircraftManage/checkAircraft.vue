<template>
  <div class="checkAircraft_container" :class="[{'agree': action==='核验' && !status} , {'disagree': action==='核验' && status}]"  v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/aircraftManage' }">航空器管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{action}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="craft_details">
      <div class="content-box">
        <div class="status">
          <div class="colorActiveW" v-if="isVerified === 4 ">
            <i class="el-icon-time"></i> 待审核
            <span v-show="description">({{description}})</span>
          </div>
          <div class="colorActiveS" v-else-if="isVerified === 1">
            <i class="el-icon-circle-check-outline"></i> 已通过
            <span v-show="description">({{description}})</span>
          </div>
          <div class="colorActiveNo" v-else-if="isVerified === 2">
            <i class="el-icon-error"></i> 未通过
            <span v-show="description">({{description}})</span>
          </div>
        </div>
        <el-row>
          <el-col :span="10" :offset="2">
            <span class="label">航空器属性 : </span>
            <span>{{machineTypeName ? machineTypeName : '--'}}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">航空器状态 : </span>
            <span v-show="aircraftStatus===1">启用</span>
            <span v-show="aircraftStatus===2">停用</span>
          </el-col>
        </el-row>
        <div v-if="machineType===1">
          <div class="top-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">航空器型号 : </span>
              <span>{{model ? model : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">航空器类型 : </span>
              <span>{{aircraftTypeName ? aircraftTypeName : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">制造厂商 : </span>
              <span>{{aerocraftManufacturer ? aerocraftManufacturer : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">民用航空电台执照 : </span>
              <span>{{radioLicense ? radioLicense : '--'}}</span>
              <span class="checkFile">
              <img src="../../../static/images/icon-check.png" alt="">
              <span @click="showPreviewDialog('', fileUrlOfRadioLicense, '民用航空电台执照')">预览</span>
            </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">国籍登记号(机号) : </span>
              <span>{{certificateNum ? certificateNum : '--'}}</span>
              <span class="checkFile">
              <img src="../../../static/images/icon-check.png" alt="">
              <span @click="showPreviewDialog('', fileUrlOfCertificateNum, '国籍登记号(机号)')">预览</span>
            </span>
            </el-col>
            <el-col :span="12">
              <span class="label">适航证号 : </span>
              <span>{{airworthinessCertificate ? airworthinessCertificate : '--'}}</span>
              <span class="checkFile">
                <img src="../../../static/images/icon-check.png" alt="">
                <span @click="showPreviewDialog(fileListOfAirworthiness, '', '适航证号')">预览</span>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">保险证明材料 : </span>
              <span class="checkFile" v-if="fileListOfAccessory && fileListOfAccessory.length > 0">
                <img src="../../../static/images/icon-check.png" alt="">
                <span @click="showPreviewDialog(fileListOfAccessory, '', '保险证明材料')">预览</span>
              </span>
              <span v-else> -- </span>
            </el-col>
          </el-row>
          <div class="bottom-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大飞行速度 : </span>
              <span>{{maxFlightSpeed ? maxFlightSpeed : '--'}} 千米/小时(km/h)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">净重 : </span>
              <span>{{suttle ? suttle : '--'}} 千克(kg)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">巡航速度 : </span>
              <span>{{cruisingSpeed ? cruisingSpeed : '--'}} 千米/小时(km/h)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">理论配置驾驶员数量 : </span>
              <span>{{driverCount ? driverCount : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大航程 : </span>
              <span>{{maxFlightDistance ? maxFlightDistance : '--'}} 千米(km)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">座位 : </span>
              <span>{{seatCount ? seatCount : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大耗时 : </span>
              <span>{{maxTimeConsuming ? maxTimeConsuming : '--'}} 小时(h)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">升限 : </span>
              <span>{{maxHeight ? maxHeight : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">平均耗油量 : </span>
              <span>{{averageOilConsuming ? averageOilConsuming : '--'}} 小时(h)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">机型图片 : </span>
              <span>
              <img v-if="!pictureUrl" src="../../../static/images/aircraft_img.png" width="106">
              <img v-else :src="pictureUrl" width="260" height="150">
          </span>
            </el-col>
          </el-row>
        </div>
        <div v-else-if="machineType===2">
          <div class="top-border-box"></div>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">航空器型号 : </span>
              <span>{{model ? model : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">航空器类型 : </span>
              <span>{{aircraftTypeName ? aircraftTypeName : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">制造厂商 : </span>
              <span>{{aerocraftManufacturer ? aerocraftManufacturer : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">无人机序列号(机身S/N码) : </span>
              <span>{{machineCode ? machineCode : '--'}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">国籍登记号(机号) : </span>
              <span>{{certificateNum ? certificateNum : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">净重 : </span>
              <span>{{suttle ? suttle : '--'}} 千克(kg)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">最大起飞重量 : </span>
              <span>{{maxFlyWeight ? maxFlyWeight : '--'}} 千克(kg)</span>
            </el-col>
            <el-col :span="12">
              <span class="label">最大着陆重量 : </span>
              <span>{{maxLandWeight ? maxLandWeight : '--'}} 千克(kg)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">监控设备号(IMEI) : </span>
              <span>{{imei ? imei : '--'}}</span>
            </el-col>
            <el-col :span="12">
              <span class="label">最大飞行速度 : </span>
              <span>{{maxFlightSpeed ? maxFlightSpeed : '--'}} 千米/小时(km/h)</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="label">机型图片 : </span>
              <span>
              <img v-if="!pictureUrl" src="../../../static/images/aircraft_img.png" width="106">
              <img v-else :src="pictureUrl" width="260" height="150">
          </span>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <div class="top-border-box"></div>
          <el-row>
            <el-col :span="20" :offset="2">
              <span class="label">备注说明 : </span>
              <div class="aircraft-desc">{{aircraftDesc ? aircraftDesc : '--'}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="btns-box" v-show="actionType==1">
      <el-button type="primary" class="query" @click="jumpToAircraftManage">返回</el-button>
    </div>
    <div class="fixed-box" v-show="actionType==2">
      <el-form ref="checkForm" label-width="100px">
        <el-form-item label="审批意见：" style="margin-bottom: 5px;">
          <el-radio v-model="status" :label="1">通过</el-radio>
          <el-radio v-model="status" :label="2">驳回</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;margin: 0 20px 10px;" v-show="status">
        <el-input v-model="remark" :rows="3" style="margin-bottom: 15px" type="textarea" auto-complete="off" :placeholder="status === 1 ? '' : '请输入驳回原因'"></el-input>
        <el-button class="query" type="primary" @click="onClickAuditAircraft">审核</el-button>
        <el-button class="second-btn" @click="jumpToAircraftManage" plain>取消</el-button>
      </div>
    </div>
    <faxpreview :fax-to-show="faxToShow" :show-fax-preview="showFaxPreview" :initial-photo-to-show="initialPhotoToShow" @faxPreviewPass="faxPreviewPass"></faxpreview>
  </div>
</template>
<script>
import faxpreview from 'common/picpreview/faxpreview';
  export default {
    components: {
      faxpreview
    },
    data () {
      return {
        isImage: false, // 是否是图片，用来判断dialog里面显示图片还是pdf
        action: "",
        id: "",
        showPreview: false, //是否显示预览弹框
        photoToShow: '',
        actionType: "",
        aircraftTypeName: "",//航空器类型名称
        status: "",
        radioLicense: "", //民用航空电台执照
        cruisingSpeed: "", //巡航速度
        machineTypeName:"", //航空器属性名称
        aircraftStatus: "", //航空器状态
        machineType: "",  //设备类型
        aerocraftManufacturer: "",  //制造厂商
        model: "", //航空器型号
        machineCode: "",  //设备号
        certificateNum: '', //机号（航空器登记号）
        airworthinessCertificate: "", //适航证编号
        companyName: "",   //所属企业
        createdTime: "",   //添加时间
        creator: "", //操作人
        approvalTime: "", //审核时间
        pictureUrl: "",   //机型图片
        maxFlightDistance: "", //航程
        maxFlightSpeed: "",  //最大飞行速度
        suttle: "",   //净重
        maxFlyWeight: "", //最大起飞重量
        maxLandWeight: "", //最大着陆重量
        driverCount: "", //理论配置驾驶员数量
        seatCount: "", //座位
        maxTimeConsuming: "", //最大耗时
        maxHeight: "", //升限
        averageOilConsuming: "", //平均耗油量
        aircraftType: "", //航空器类型
        remark: "", //驳回原因
        fileUrlOfCertificateNum: '', //航空器登记号上传文件
        fileNameOfCertificateNum: '',
        fileListOfAirworthiness: [],
        fileUrlOfAirworthiness: '',  //适航证号文件
        fileNameOfAirworthiness: '',
        fileNameOfRadioLicense: '',//民用航空电台执照文件
        fileUrlOfRadioLicense: '',// pdf
        fileListOfAccessory: [], //保险证明材料
        fileUrlOfAccessory: '',
        fileNameOfAccessory: '',
        queryParams: {}, //列表页查询参数
        isVerified: '', //核验状态
        description: '', //核验说明
        imei: '',        //监控设备号
        loading: true,
        showFaxPreview: false,         //是否显示图片预览
        faxToShow: [],                 //预览图片列表
        initialPhotoToShow: '',        //图片预览时默认显示的大图
        aircraftDesc: ''               //航空器备注说明
      }
    },
    created() {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.id;
      this.actionType = this.$route.query.actionType;
      if(this.actionType === 1) {
        this.action = "查看";
      }else {
        this.action = "核验";
      }
      this.asyncGetAircraftInfoById(this.id);
    },
    methods: {
      //点击预览
      showPreviewDialog(fileList, fileUrl, accessoryName) {
        let _fileList = [];
        if (fileList && fileList.length > 0) {
          fileList.forEach(item => {
            if (item.accessoryUrl) {
              this.$set(item, 'url', item.accessoryUrl);
            }
            this.$set(item, 'accessoryName', accessoryName ? accessoryName : '')
          });
          _fileList = fileList;
        } else {
          _fileList.push({
            url: fileUrl,
            accessoryName: accessoryName
          })
        }
        this.initialPhotoToShow = fileUrl ? fileUrl : _fileList[0].url;
        this.faxToShow = [];
        this.faxToShow = _fileList;
        this.showFaxPreview = true;
      },
      // 图片预览参数回传
      faxPreviewPass(data){
        this.showFaxPreview = data;
        this.faxToShow = [];
        this.initialPhotoToShow = "";
      },
      //获取航空器信息
      asyncGetAircraftInfoById(id) {
        this.$axios.get("/backstageaerocraft/getAerocraftInfo?id=" + id).then( res => {
          if(res.data.code === 200) {
            let data = res.data.data;
            this.machineTypeName = data.machineTypeName;
            this.aircraftStatus = data.aircraftStatus;
            this.cruisingSpeed = data.cruisingSpeed;
            this.machineType = data.machineType;
            this.aerocraftManufacturer = data.aerocraftManufacturer;
            this.model = data.model;
            this.machineCode = data.machineCode;
            this.certificateNum = data.certificateNum;
            this.airworthinessCertificate = data.airworthinessCertificate;
            this.companyName = data.companyName;
            this.createdTime = data.createdTime;
            this.creator = data.creator;
            this.approvalTime = data.approvalTime;
            this.pictureUrl = data.pictureUrl;
            this.maxFlightDistance = data.maxFlightDistance;
            this.maxFlightSpeed = data.maxFlightSpeed;
            this.maxHeight = data.maxHeight;
            this.maxFlyWeight = data.maxFlyWeight;
            this.maxLandWeight = data.maxLandWeight;
            this.driverCount = data.driverCount;
            this.seatCount = data.seatCount;
            this.maxTimeConsuming = data.maxTimeConsuming;
            this.maxHeight = data.maxHeight;
            this.averageOilConsuming = data.averageOilConsuming;
            this.aircraftType = data.aircraftType;
            this.radioLicense = data.radioLicense;
            this.suttle = data.suttle;
            this.aircraftTypeName = data.aircraftTypeName;
            this.fileNameOfCertificateNum = data.certificateNumName; //航空器登记号文件
            this.fileUrlOfCertificateNum = data.certificateNumUrl;
            this.fileNameOfRadioLicense = data.radioLicenseName; //民用航空执照文件
            this.fileUrlOfRadioLicense = data.radioLicenseUrl;
            this.isVerified = data.isVerified;
            this.description = data.remark;
            this.imei = data.imei;
            this.fileListOfAccessory = []; //保险证明文件
            this.fileListOfAccessory = this.fileListOfAccessory.concat(data.accessoryList);
            this.fileListOfAirworthiness = []; //适航证文件
            this.fileListOfAirworthiness = this.fileListOfAirworthiness.concat(data.airworthinessCertificateList);
            this.aircraftDesc = data.machineTypeRemark;
          }else {
              this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //点击--返回
      jumpToAircraftManage() {
        this.$router.push({
          path: '/aircraftManage',
          query: this.queryParams
        })
      },
      //点击--审核
      onClickAuditAircraft() {
        if(this.status === 2 && !this.remark) {
          this.$message.error('请输入驳回原因');
          return;
        }
        this.$axios.get('/backstageaerocraft/auditAerocraft', {
          params: {
            ids: this.id,
            isVerified: this.status,
            remark: this.remark
          }
        }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            this.jumpToAircraftManage();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  }
</script>
<style scoped>
  .checkAircraft_container {
    position: relative;
    min-width: 1050px;
    margin: 0 auto;
  }
  .checkAircraft_container.agree {
    padding-bottom: 90px;
  }
  .checkAircraft_container.disagree {
    padding-bottom: 230px;
  }
  .craft_details {
    font-size: 14px;
    min-width: 1050px;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 20px;
    margin: 0px auto;
  }
  .craft_details span img {
    vertical-align: top;
  }
  .craft_details .el-row {
    padding: 10px 0;
    color: #3e4a54;
  }
  .craft_details .label {
    display: inline-block;
    width: 170px;
    text-align: right;
    color: #3e4a54;
  }
  .btns-box {
    margin: 20px;
    text-align: center;
  }
  .fixed-box {
    position: fixed;
    left: 200px;
    right: 10px;
    bottom: 50px;
    padding: 5px 0 0;
    background: #fff;
    border-radius: 4px;
    border-top: 1px solid #d9d9d9;
    margin-top: 50px;
    z-index: 10;
    box-shadow: 0 -2px 5px #ccc;
  }

  .top-border-box,.bottom-border-box  {
    margin: 20px 0;
    border-top: 1px dashed #c2c2c2;
  }

  .checkFile {
    color: #59b9e2;
    cursor: pointer;
    width: 400px;
  }

  .craft_details .checkFile img {
    vertical-align: middle;
    margin-left: 5px;
  }

  .checkFile.multiple {
    margin-left: 162px;
    margin-top: -20px;
    line-height:24px;
    min-height: 21px;
  }

  .checkFile.airworthiness {
    margin-left: 258px;
    margin-top: -22px;
    line-height:24px;
  }

  .status {
    padding: 10px 0 10px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #ccc;
    font-weight: bold;
    font-size: 16px;
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

  .content-box {
    max-width: 1200px;
    margin: 0 auto;
  }

  .aircraft-desc {
    margin: -19px 0 0 176px;
    word-wrap:break-word;
    line-height: 20px;
  }
</style>
