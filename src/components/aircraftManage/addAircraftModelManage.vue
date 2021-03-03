<template>
    <div class="addAircraft-container-box" v-loading="loading">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/aircraftManage' }">航空器管理</el-breadcrumb-item>
            <el-breadcrumb-item class="addAircraft-title" v-text="title"></el-breadcrumb-item>
        </el-breadcrumb>
        <div class="addAircraft-container">
            <el-form :model="info" ref="info" :rules="rules" label-width="190px" class="content-wrapper flex-center-col">
                <div class="item flex-start-start">
                    <el-form-item label="航空器属性:" prop="machineType">
                        <el-select v-model="info.machineType"  placeholder="请选择" @change="changeType" :disabled="disabled">
                            <el-option v-for="typeValue in machineTypeData" :key="typeValue.id" :label="typeValue.name"
                                        :value="typeValue.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="item flex-start-start around" v-if="info.machineType == 1">
                    <div class="item-col">
                        <el-form-item label="航空器型号:" prop="name">
                            <el-col :span="12">
                                <el-input v-model="info.name" placeholder="请输入航空器型号"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="制造厂商:" prop="aerocraftManufacturerId">
                            <el-col :span="16">
                                <el-select v-model="info.aerocraftManufacturerId"
                                        filterable
                                        clearable>
                                    <el-option v-for="(typeValue,index) in aerocraftManufacturerData" :key="index" :label="typeValue.name" :value="typeValue.id"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="航空器类型:" prop="aircraftType">
                            <el-col :span="16">
                                <el-select v-model="info.aircraftType" clearable placeholder="请选择">
                                <el-option v-for="typeValue in aircraftTypeData" :key="typeValue.id" :label="typeValue.name"
                                            :value="typeValue.id">
                                </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="理论配置驾驶员数量:" prop="driverCount">
                            <el-col :span="12">
                                <el-input v-model="info.driverCount"></el-input>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="座位:" prop="seatCount">
                            <el-col :span="12">
                                <el-input v-model="info.seatCount"></el-input>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="升限:" prop="maxHeight">
                            <el-col :span="12">
                                <el-input v-model="info.maxHeight"></el-input>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div class="item-col ">
                        <el-form-item label="净重:" prop="suttle">
                            <el-col :span="12">
                                <el-input v-model="info.suttle"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千克(kg)</span>
                        </el-form-item>

                        <el-form-item label="最大飞行速度:" prop="maxFlightSpeed">
                            <el-col :span="12">
                                <el-input v-model="info.maxFlightSpeed"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千米/小时(km/h)</span>
                        </el-form-item>

                        <el-form-item label="巡航速度:" prop="cruisingSpeed">
                            <el-col :span="12">
                                <el-input v-model="info.cruisingSpeed"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千米/小时(km/h)</span>
                        </el-form-item>

                        <el-form-item label="最大航程:" prop="maxFlightDistance">
                            <el-col :span="12">
                                <el-input v-model="info.maxFlightDistance"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千米(km)</span>
                        </el-form-item>

                        <el-form-item label="最大耗时:" prop="maxTimeConsuming">
                            <el-col :span="12">
                                <el-input v-model="info.maxTimeConsuming"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>h</span>
                        </el-form-item>

                        <el-form-item label="平均耗油量:" prop="averageOilConsuming">
                            <el-col :span="12">
                                <el-input v-model="info.averageOilConsuming"></el-input>
                            </el-col>
                        </el-form-item>
                    </div>
                </div>
                <div class="item flex-start-start around" v-else>
                    <div class="item-col">
                        <el-form-item label="航空器型号:" prop="name">
                            <el-col :span="12">
                                <el-input v-model="info.name" placeholder="请输入航空器型号"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="制造厂商:" prop="aerocraftManufacturerId">
                            <el-col :span="16">
                                <el-select v-model="info.aerocraftManufacturerId"
                                   
                                    filterable clearable>
                                <el-option v-for="(typeValue,index) in aerocraftManufacturerData" :key="index" :label="typeValue.name"
                                            :value="typeValue.id">
                                </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="航空器类型:" prop="aircraftType">
                            <el-col :span="16">
                                <el-select v-model="info.aircraftType" clearable placeholder="请选择">
                                <el-option v-for="typeValue in aircraftTypeData" :key="typeValue.id" :label="typeValue.name"
                                            :value="typeValue.id">
                                </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div class="item-col ">
                        <el-form-item label="净重:" prop="suttle">
                            <el-col :span="8">
                                <el-input v-model="info.suttle"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千克(kg)</span>
                        </el-form-item>

                        <el-form-item label="最大着陆重量:" prop="maxLandWeight">
                            <el-col :span="8">
                                <el-input v-model="info.maxLandWeight"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千克(kg)</span>
                        </el-form-item>

                        <el-form-item label="最大飞行速度:" prop="maxFlightSpeed">
                            <el-col :span="8">
                                <el-input v-model="info.maxFlightSpeed"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千米/小时(km/h)</span>
                        </el-form-item>

                        <el-form-item label="最大起飞重量:" prop="maxFlyWeight">
                            <el-col :span="8">
                                <el-input v-model="info.maxFlyWeight"></el-input>
                            </el-col>
                            <el-col class="line" :span="2"></el-col>
                            <span>千克(kg)</span>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="save_btns">
            <el-button type="primary" class="query" @click="saveData('info')" >保存</el-button>
            <el-button class="second-btn" @click="cancle('info')">返回</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            let validateInputNumber = (rule, value, callback) => {
                if (value) {
                if (isNaN(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
                } else {
                callback();
                }
            };
            let upload = (rule, value, callback) => {
                if (value.length === 0) {
                callback(new Error('请上传相关证件'));
                } else {
                callback();
                }
            };
            return {
                aircraftId: '',
                loading: false,
                disabled: false,
                title: '添加航空器类型',
                lockUp: false,
                info: {
                    machineType: '1', // 航空器属性
                    aerocraftManufacturerId: '', // 制造厂商id
                    aircraftType: '',//无人机类型（1=旋翼，2=固定翼，3=多旋翼）
                    name: '', // 型号id
                    suttle: '', // 净重
                    cruisingSpeed: '', // 巡航速度
                    maxFlightDistance: '', // 最大航程
                    maxFlightSpeed: '', // 最大飞行速度
                    maxTimeConsuming: '', // 最大耗时
                    maxHeight: '', // 升限
                    averageOilConsuming: '', // 平均油耗
                    driverCount: '', // 理论驾驶员数量
                    seatCount: '',//座位数
                    maxLandWeight: '', // 最大着陆重量
                    maxFlyWeight: '', // 最大起飞重量
                },
                rules: {
                    machineType: [
                        {required: true, message: '请选择航空器属性', trigger: 'change'}
                    ],
                    aircraftType: [
                        {required: true, message: '请选择航空器类型', trigger: 'blur,change'}
                    ],
                    name: [
                        {required: true, message: '请输入航空器型号', trigger: 'blur'}
                    ],
                    aerocraftManufacturerId: [
                        {required: true, message: '请选择制造厂商', trigger: 'blur'}
                    ],
                    suttle: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    cruisingSpeed: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    driverCount: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    maxFlightSpeed: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    maxFlightDistance: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    seatCount: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    maxTimeConsuming: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    maxHeight: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    averageOilConsuming: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    maxFlyWeight: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                    maxLandWeight: [
                        {validator: validateInputNumber, trigger: 'blur'},
                        {max: 20, message: '最多可输入20个字符', trigger: 'blur'}
                    ],
                },
                // 飞机类型（1=有人机；2=无人机）
                machineTypeData: [
                {
                    id: '1',
                    name: '有人机'
                },
                {
                    id: '2',
                    name: '无人机'
                }],
                showSearchIconCompany: false,
                showSearchIconManufacturer: false,
                aerocraftManufacturerData: [], // 厂商
                showSearchIconModel: false,
                //类型
                aircraftTypeData: [],
            }
        },
         created() {
            this.queryParams = this.$route.query;
            this.aircraftId = this.$route.query.id;
            this.initData();
        },
        methods: {
            //初始化需要接口
            initData() {
                if(this.aircraftId) {
                    this.getData();
                    this.title = '编辑航空器类型';
                    this.disabled = true;
                }else {
                    this.changeType();
                }
            },
            //切换有人机 无人机
            changeType() {
                this.info.aerocraftManufacturerId = '';
                this.info.suttle = ''; // 净重
                this.info.cruisingSpeed = ''; // 巡航速度
                this.info.maxFlightDistance = ''; // 最大航程
                this.info.maxFlightSpeed = ''; // 最大飞行速度
                this.info.maxTimeConsuming = ''; // 最大耗时
                this.info.maxHeight = ''; // 升限
                this.info.averageOilConsuming = ''; // 平均油耗
                this.info.driverCount = ''; // 理论驾驶员数量
                this.info.seatCount = ''; // 座位数
                this.info.maxLandWeight = ''; // 最大着陆重量
                this.info.maxFlyWeight = ''; // 最大起飞重量
                this.info.name = ''; // 航空器型号
                this.info.aerocraftManufacturer = ''; // 制造厂商
                this.info.aircraftType = '';//航空器类型

                if(this.info.machineType == 1) {
                    this.aircraftTypeData = [
                        {id: 1, name: '固定翼'},
                        {id: 2, name: '直升机'},
                        {id: 3, name: '超轻型'},
                        {id: 4, name: '其他'}
                    ]
                }else if(this.info.machineType == 2) {
                    this.aircraftTypeData = [
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
                    machineType: this.info.machineType
                }
                }).then((res) => {
                if(res.data.code == 200) {
                    this.aerocraftManufacturerData = [];
                    this.aerocraftManufacturerData = this.aerocraftManufacturerData.concat(res.data.data);
                }
                this.aerocraftManufacturerData.forEach(ele => {
                    if(ele.name == this.info.aerocraftManufacturerId) return this.info.aerocraftManufacturerId = ele.id;
                });
                this.loading = false;
                })
            },
            //回选数据
            getData() {
                this.$axios.get("/aerocraftModel/getAerocraftModelInfo?id=" + this.aircraftId).then(res => {
                if (res.data.code === 200) {
                    let data = res.data.data;
                    this.info.machineType = data.machineType ? (data.machineType).toString() : '';
                    this.info.aerocraftManufacturerId = data.aerocraftManufacturer ? data.aerocraftManufacturer : '';//制造厂商id
                    this.info.aircraftType = data.aircraftType ? (data.aircraftType) : '';//无人机类型（1=旋翼，2=固定翼，3=多旋翼）
                    this.info.name = data.name;//型号id
                    this.info.suttle = data.suttle ? (data.suttle).toString() : '';//净重
                    this.info.cruisingSpeed = data.cruisingSpeed ? (data.cruisingSpeed).toString() : '';//巡航速度
                    this.info.maxFlightDistance = data.maxFlightDistance ? (data.maxFlightDistance).toString() : '';//最大航程
                    this.info.maxFlightSpeed = data.maxFlightSpeed ? (data.maxFlightSpeed).toString() : '';//最大飞行速度
                    this.info.maxTimeConsuming = data.maxTimeConsuming ? (data.maxTimeConsuming).toString() : '';//最大耗时
                    this.info.maxHeight = data.maxHeight ? (data.maxHeight).toString() : '';//升限
                    this.info.averageOilConsuming = data.averageOilConsuming ? (data.averageOilConsuming).toString() : '';//平均油耗
                    this.info.driverCount = data.driverCount ? (data.driverCount).toString() : '';//理论驾驶员数量
                    this.info.seatCount = data.seatCount ? (data.seatCount).toString() : '';//座位数
                    this.info.maxLandWeight = data.maxLandWeight ? (data.maxLandWeight).toString() : '';//最大着陆重量
                    this.info.maxFlyWeight = data.maxFlyWeight ? (data.maxFlyWeight).toString() : '';//最大起飞重量
                    
                    if(this.info.machineType == 1) {
                        this.aircraftTypeData = [
                            {id: 1, name: '固定翼'},
                            {id: 2, name: '直升机'},
                            {id: 3, name: '超轻型'},
                            {id: 4, name: '其他'}
                        ]
                    }else if(this.info.machineType == 2) {
                        this.aircraftTypeData = [
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
                } else {
                    this.$message({
                    type: 'error',
                    message: res.data.msg
                    });
                }
                });
            },
            //提交 数据
            saveData(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _Url = '';
                        let _id = ''
                        if(this.aircraftId) {
                            _Url = '/aerocraftModel/updateAerocraftModel';
                            _id = this.aircraftId;
                        }else {
                             _Url = '/aerocraftModel/saveAerocraftModel';
                        }
                        this.$axios({
                            method: "POST",
                            url: _Url,
                            data: {
                                id: _id,
                                machineType: this.info.machineType,
                                aerocraftManufacturerId: this.info.aerocraftManufacturerId,//制造厂商id
                                aircraftType: this.info.aircraftType,//无人机类型（1=旋翼，2=固定翼，3=多旋翼）
                                name: this.info.name,//型号id
                                suttle: parseFloat(this.info.suttle),//净重
                                cruisingSpeed: parseFloat(this.info.cruisingSpeed),//巡航速度
                                maxFlightDistance: parseFloat(this.info.maxFlightDistance),//最大航程
                                maxFlightSpeed: parseFloat(this.info.maxFlightSpeed),//最大飞行速度
                                maxTimeConsuming: parseFloat(this.info.maxTimeConsuming),//最大耗时
                                maxHeight: parseFloat(this.info.maxHeight),//升限
                                averageOilConsuming: parseFloat(this.info.averageOilConsuming),//平均油耗
                                driverCount: parseFloat(this.info.driverCount),//理论驾驶员数量
                                seatCount: parseFloat(this.info.seatCount),//座位数
                                maxLandWeight: this.info.maxLandWeight,//最大着陆重量
                                maxFlyWeight: this.info.maxFlyWeight,//最大起飞重量
                            }
                        }).then((res) => {
                            if (res.data.code === 200) {
                            this.cancle();
                            } else {
                            this.$message.error(res.data.msg);
                            }
                        });
                    }
                });
            },
            //取消 返回 回到航空器列表
            cancle() {
                this.$router.push({
                    path:'/aircraftModelManage',
                    query: this.queryParams
                });
            }
        }
    }
</script>

<style scoped>
    .addAircraft-container-box {
        min-width: 1000px;
    }
    .addAircraft-title {
        color: #606266;
    }
    .addAircraft-container {
        position: relative;
        padding: 15px 20px 20px 20px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    .content-wrapper {
        max-width: 1200px;
        margin: 0 auto;
    }
    .addAircraft-container .flex-center-col {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .item {
        width: 100%;
        padding: 30px 20px;
        border-bottom: 1px dashed #c1c1c1;
        box-sizing: border-box;
    }
    .item .item-col {
        width: 40%;
        margin-right: 100px;
        box-sizing: border-box;
    }
    .addAircraft-container .flex-start-start {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .addAircraft-container .item .item-col {
        width: 50% !important;
        margin-right: 0 !important;
    }
    .line::after {
        content: '.';
        visibility: hidden;
    }
    .save_btns {
        text-align: center;
        margin: 30px 0;
    }
</style>