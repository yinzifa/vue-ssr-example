<template>
  <div class="privateLetter-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="breadcrumb-item-title">私信</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-box" v-loading="loading">
      <div class="letter-wrapper">
        <div class="letter-wrapper-content" v-for="(item,index) in privateLetterList" :key="index">
          <div class="wrapper-content-user">
            <img src="../../../static/images/icon-head-portrait.png" v-if="item.sendType === 1">
            <img src="../../../static/images/icon-head-traffic.png" v-else>
            <p class="content-user-type"  :title="item.sendCompanyName"  :class="{cursor:item.sendType !== 1}">{{item.sendName}}</p>
            <p class="content-user-type active" :title="item.creator" v-if="item.sendType !== 1">{{item.creator}}</p>
          </div>
          <div class="wrapper-content-desc">
            <h4 class="content-desc-title"  :title="item.acceptCompanyName">{{item.acceptName}} 您好：</h4>
            <p class="content-desc-msg">{{item.content}}</p>
            <p class="content-time">{{item.createdTime}}</p>
          </div>
          <div class="wrapper-content-del"></div>
        </div>
      </div>
      <el-pagination
        v-if="privateLetterList.length > 0"
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
</template>
<script>
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        privateLetterList: [],//私信数据
        loading: true
      }
    },
    created() {
      this.asyncGetPrivateLetterListData();
    },
    methods: {
      //获取私信列表数据
      asyncGetPrivateLetterListData() {
        this.$axios.get("/message/getAllPrivateMessage", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.privateLetterList = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //每页显示
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetPrivateLetterListData();
      },
      //当前页码改变
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetPrivateLetterListData();
      }
    },
    watch: {
      $route() {
        this.asyncGetPrivateLetterListData();
      }
    }
  }
</script>
<style scoped>
  .query-btn-box {
    margin-left: 17px;
  }

  .operate-btn-box {
    margin-bottom: 20px;
  }

  .tagStyle {
    display: inline-block;
    cursor: pointer;
  }
  .breadcrumb-item-title {
    display: inline-block;
    padding: 10px 0 5px 10px;
  }
  .privateLetter-container .el-pagination {
    text-align: center;
  }
  .table-box-add-btn{
    width: 120px;
    background: #5AB9E2;
    border-radius: 7px;
  }
  .table-box-border{
    height: 1px;
    margin: 30px 0 25px 0;
    border-bottom: 1px dashed #ccc;
  }
  .letter-wrapper-content {
    display: flex;
    margin-bottom: 20px;
    padding: 10px;
    background: #F6F6F6;
    border-radius: 6px;
  }
  .wrapper-content-user{
    flex: 0 0 100px;
    width: 100px;
    padding-top: 12px;
    margin-right: 15px;
    text-align: center;
  }
  .wrapper-content-desc{
    flex:1;
  }
  .wrapper-content-del{
    flex: 0 0 200px;
    width: 200px;
    text-align: right;
  }
  .content-del-btn{
    color: #F46054;
    padding-right: 10px;
    cursor: pointer;
  }
  .content-del-btn:hover .icon-delete{
    transition: all .5s;
    opacity: 1;
  }
  .icon-delete{
    position: relative;
    left: -5px;
    top: 3px;
    opacity: 0;
  }
  .content-desc-title{
    font-size: 15px;
    margin-top: 10px;
    cursor:pointer;
  }
  .content-desc-msg{
    text-align: justify;
    line-height: 22px;
    padding-top: 10px;
    font-size: 15px;
  }
  .content-time{
    padding: 10px 0;
    color: #B0B0B0;
    font-size: 15px;
  }
  .dialog-footer{
    text-align: center;
    margin-top: -20px;
    padding-bottom: 10px;
  }
  .content-user-type{
    font-size: 15px;
    padding-top: 5px;
  }
  .content-user-type.active{
    width: 100px;
    font-size: 14px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor:pointer;
  }
  .cursor{
    cursor:pointer;
  }
  .commonBtn{
    width: 120px;
    border-radius: 7px;
  }
</style>
<style>
  .privateLetter-container .el-button--small {
    font-size: 14px;
  }
</style>
