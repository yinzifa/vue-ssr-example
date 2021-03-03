<template>
  <div class="addNotice-container" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/noticeManage'}">管制公告</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="details-box">
      <div class="notice-details">
        <div class="notice-other">
          <p>发布单位：{{organizationName ? organizationName : '--'}}</p>
          <p>分类：{{typeName ? typeName : '--'}}</p>
          <p>发布时间：{{publishTime ? publishTime : '--'}}</p>
        </div>
        <div class="notice-title">
          {{title ? title : '--'}}
        </div>
        <div class="notice-content">
          {{content ? content : '--'}}
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button type="primary" class="export" @click="onClickCancel">返回</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        id: "",
        title: "",        //标题
        typeName: "",     //类型
        organizationName: "", //发布对象
        content: "",      //正文
        publishTime: "",   //发布时间
        queryParams: {},   //列表页查询参数
        loading: true
      }
    },
    created () {
      this.queryParams = this.$route.query;
      this.id = this.$route.query.id;
      this.asyncGetNoticeById(this.id);
    },
    methods: {
      //获取公告信息
      asyncGetNoticeById(id) {
        this.$axios.get('/announcement/getBackAnnouncementInfo?id='+id).then(res => {
          if (res.data.code === 200) {
            let _data =  res.data.data;
            this.title = _data.title;
            this.typeName = _data.typeName;
            this.organizationName = _data.organizationName;
            this.content = _data.content;
            this.publishTime = _data.publishTime;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //返回
      onClickCancel() {
        this.$router.push({
          path: '/noticeManage',
          query: this.queryParams
        })
      },
    },

  }
</script>
<style scoped>
  .details-box {
    min-width: 1050px;
    background-color: #fff;
    border-radius: 4px;
    padding: 30px 0;
    margin: 0 auto;
    margin-bottom: 30px;
    font-size: 14px;
  }
  .notice-details {
    width: 800px;
    margin: 0 auto;
  }
  .notice-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 30px 0;
    text-align: center;
  }
  .notice-other {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 30px;
    border-bottom: 1px dashed #c2c2c2;
  }
  .notice-content {
    text-indent: 30px;
    line-height: 22px;
    white-space: pre-wrap;
  }
  .btn-box {
    text-align: center;
    margin: 0 auto 30px;
  }
</style>
<style>

</style>
