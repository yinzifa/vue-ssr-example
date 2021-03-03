<template>
  <div class="noticeManage-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>管制公告</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-box">
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <div class="notice-title">
              <img src="../../../static/images/icon-notice.png" alt="">
              <span @click="jumpToCheckNotice(scope.row.id)" class="notice-title-item">{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="类型" align="center" width="200"></el-table-column>
        <el-table-column prop="organizationName" label="发布单位" align="center" width="200">
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" align="center" width="200"></el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length>0"
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
  import tool from "static/js/tool";
  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        loading: true
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
        this.getQueryParams();
        this.asyncGetNoticeListData();
      },
      //获取查询参数
      getQueryParams() {
        let params = this.$route.query;
        this.currentPage = params.currentPage ? parseInt(params.currentPage) : 1;
        this.pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
      },
      //获取公告列表
      asyncGetNoticeListData() {
        this.$axios.get('/announcement/getBackAnnouncementList', {
          params: {
            pageSize: this.pageSize,
            pageNum: this.currentPage,
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = [];
            this.tableData = this.tableData.concat(res.data.data.list);
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
          this.loading = false;
        })
      },
      //点击查看
      jumpToCheckNotice(id) {
        this.$router.push({
          path: '/noticeManage/check',
          query: {
            id: id,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        })
      },
      pageSizeChange(val) {
        this.pageSize = val;
        this.asyncGetNoticeListData();
      },
      currentPageChange(val) {
        this.currentPage = val;
        this.asyncGetNoticeListData();
      }
    },
    watch: {
      $route(to) {
        if (to.path === '/noticeManage') {
          this._initData();
        }
      }
    }

  }
</script>
<style scoped>
  .notice-title {
    text-align: left;
  }
  .notice-title img {
    vertical-align: top;
    margin-right: 20px;
  }
  .notice-title-item:hover {
    color: #59b9e2;
    text-decoration: underline;
    cursor: pointer;
  }
</style>

