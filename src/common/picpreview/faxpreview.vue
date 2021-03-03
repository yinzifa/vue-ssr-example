<template>
  <div>
    <el-dialog
      :visible.sync="showFaxPreview"
      width="100%"
      :before-close="handleClose"
      @close="handleClose"
      class="faxPreviewDialog"
    >
      <div class="container">
        <div class="sidebar">
          <p class="sidebar-item" v-for="(item, index) in faxToShowList" :key="index">
            <pdf :url="item.url" v-if="!item.isImage"
                 @getPdfUrl="getPdfUrl(item.url, index)"
                 @getPdfLoaded="setFileStyle"
                 :class="['pdf-view-style', item.url === photoToShow || (!photoToShow && item.url === initialPhotoToShow) ? 'activeStyle' : '']"></pdf>
            <img :src="item.url" alt="" :class="item.url === photoToShow || (!photoToShow && item.url === initialPhotoToShow) ? 'activeStyle' : ''" style="" @click="onClickGetUrl(item.url, item.isImage, index)" v-else>
            <span class="sidebar-serial">{{ (index + 1) + (item.accessoryName ? '-' + item.accessoryName : '') }}</span>
          </p>
        </div>
        <div class="main" ref="main">
          <div class="operate-box">
            <span class="page-box">共{{ currentPage}} / {{ faxToShowList.length }}页</span>
            <el-button class="left" @click="picRotate('right')"></el-button>
            <span class="separate"></span>
            <el-button class="right" @click="picRotate('left')"></el-button>
            <a class="view-download" :href="photoToShow ? photoToShow : initialPhotoToShow"><img src="../../../static/images/icon-preview-download.png" alt=""></a>
          </div>
          <div :class="['main-content', reset ? 'initial-style' : '']">
            <pdf :url="photoToShow ? photoToShow : initialPhotoToShow" :class="['digpic', reset ? 'initial-img' : '']" v-if="!isImage"></pdf>
            <img :src="photoToShow ? photoToShow : initialPhotoToShow" alt="" :class="['digpic', reset ? 'initial-img' : '']" style="" v-else>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import pdf from 'common/pdf/pdf';

  export default {
    props: {
      faxToShow: {
        type: Array,
        required: true,
        default: []
      },
      showFaxPreview: {
        type: Boolean,
        required: true,
        default: false
      },
      initialPhotoToShow: {
        type: String,
        required: true,
        default: ''
      }
    },
    data() {
      return {
        rotate: 0,
        isImage: true,
        currentPage: 1,
        photoToShow: '',
        reset: false,
        initialType: true   //默认展示的大图是PDF还是图片
      }
    },
    methods: {
      handleClose(done) {
        this.$emit('faxPreviewPass', false);
        this.photoToShow = "";
        this.rotate = 0;
        this.currentPage = 1;
        this.reset = true;
        this.isImage = true;
        this.resetStyle();
      },
      //图片旋转
      picRotate(para) {
        this.reset = false;
        let pic = document.querySelector('.digpic'),
          pop = document.querySelector('.faxPreviewDialog .el-dialog__body'),
          picContainer = document.querySelector('.main-content'),
          rotate = this.rotate,
          picHeight = pic.offsetHeight,
          picWidth = pic.offsetWidth,
          gap = (pic.offsetHeight - pic.offsetWidth) / 2;
        if (para == 'right') {
          this.rotate -= 90;
        } else {
          this.rotate += 90;
        }
        let direction = Math.abs((this.rotate / 90) % 4),
          translate = 0,
          popheight = 0,
          basic = this.rotate >= 0 ? 1 : -1;
        switch (direction) {
          case 1:
            translate = -gap * basic;
            popheight = picWidth;
            break;
          case 2:
            translate = 0;
            popheight = picHeight;
            break;
          case 3:
            translate = gap * basic;
            popheight = picWidth;
            break;
          default:
            translate = 0;
            popheight = picHeight;
        }
        let translateY = translate;

        if (pic.offsetHeight - pic.offsetWidth < 0) {
          translateY = 0;
        }
        pic.style.transform = `rotate(${this.rotate}deg) translateX(${translate}px) translateY(${translateY}px)`;
        picContainer.style.height = popheight + 'px';
        picContainer.onmousedown = function (ev) {
          ev.stopPropagation();
          ev = ev || event;
          var oLeft = picContainer.offsetLeft;
          var a = ev.clientX - oLeft;
          picContainer.onmousemove = function (ev) {
            ev = ev || event;
            picContainer.scrollLeft = picContainer.scrollLeft - (ev.clientX - a) / 2;
          }
        };
        document.onmouseup = function () {
          picContainer.onmousemove = function () {
            null;
          }
        }
      },
      //点击获取图片地址
      onClickGetUrl(url, type, index) {
        this.photoToShow = url;
        this.isImage = type;
        this.currentPage = index + 1;
        this.reset = true;
        this.resetStyle();
      },
      //点击PDF获取地址
      getPdfUrl(url, index) {
        this.isImage = true;
        this.$nextTick(() => {
          this.photoToShow = url;
          this.isImage = false;
          this.currentPage = index + 1;
          this.reset = true;
        })
      },
      resetStyle() {
        this.$nextTick(() => {
          this.$refs.main.scrollTop = 0;
        })
      },
      setMenuStyle() {
        this.$nextTick(() => {
          let file = document.querySelector('img.activeStyle');
          if (file) {
            file.onload = () => {
              this.setFileStyle();
            }
          }
        })
      },
      setFileStyle() {
        this.$nextTick(() => {
          if (document.querySelector('.activeStyle')) {
            let activeFile = document.querySelector('.activeStyle').parentNode;
            setTimeout(() => {
              document.querySelector('.sidebar').scrollTop = activeFile.offsetTop - 100;
            }, 20)
          }
        })
      }
    },
    computed: {
      faxToShowList() {
        const imageExt = ["jpg", "jpeg", "gif", "bmp", "png"];
        let fileExt = "";
        this.faxToShow.forEach((item, index) => {
          if (item.url) {
            fileExt = item.url.substring(item.url.lastIndexOf(".") + 1).toLocaleLowerCase();
            const isImage = imageExt.some(imageItem => {
              return imageItem === fileExt;
            });
            this.$set(item, 'isImage', isImage);
            if (item.url === this.initialPhotoToShow) {
              this.currentPage = index + 1;
              this.initialType = item.isImage;
            }
          } else {
            this.$message.error('该用户暂未上传相关证件');
          }
        });
        return this.faxToShow;
      }
    },
    watch: {
      faxToShowList: {
        handler (val) {
          if (val && val.length > 0) {
            this.isImage = this.initialType;
            this.$nextTick(() => {
              this.setMenuStyle();
            })
          }
        },
        deep: true,
        immediate: true
      }
    },
    components: {
      pdf
    }
  }
</script>
<style scoped>
  .container {
    display: flex;
    height: 100%;
  }
  .sidebar {
    width: 156px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 20px 30px 20px 20px;
    overflow: auto;
    height: 100%;
  }
  .main {
    flex: 1;
    margin-top: 90px;
    overflow: auto;
  }
  .operate-box {
    width: 290px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 25px;
    position: absolute;
    top: 20px;
    left: 50%;
    color: #fff;
    z-index: 10000;
  }
  .page-box {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 25px;
    margin: 10px 0;
    border-right: 1px solid rgba(255, 255, 255 , 0.4);
  }
  .sidebar-item {
    text-align: center;
    margin-bottom: 20px;
  }
  .sidebar-item img, .sidebar-item .pdf-view {
    border: 5px solid transparent;
    cursor: pointer;
    width: 100%;
  }
  .sidebar-item img:hover, .sidebar-item .pdf-view:hover,
  .sidebar-item img.activeStyle, .sidebar-item .pdf-view.activeStyle {
    border: 5px solid #59b9e2;
  }
  .sidebar-serial {
    display: inline-block;
    width: 156px;
    word-wrap:break-word;
  }
  .separate {
    display: inline-block;
    width: 1px;
    height: 14px;
    background-color: rgba(255, 255, 255, 0.6);
    vertical-align: middle;
    margin: 0 5px;
  }
  .view-download {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-left: 20px;
    padding-left: 20px;
    border-left: 1px solid rgba(255, 255, 255 , 0.4);
  }
  .view-download img {
    vertical-align: top;
    margin-top: 7px;
  }
  .main-content {
    text-align: center;
    background-color: #595959;
  }
  .main-content.initial-style {
    height: 100%;
  }
  .main-content img {
    width: initial;
    max-width: 100%;
  }
  .pdf-view-style {
    max-height: 210px;
    overflow: hidden;
  }
  .digpic.initial-img {
    transform: rotate(0deg) translateX(0px) translateY(0px) !important;
  }
</style>
<style>
  .faxPreviewDialog .el-dialog {
    background-color: #595959;
    margin: 0 auto !important;
    height: 100%;
  }
  .faxPreviewDialog .el-button {
    padding: 0;
    border: 0;
    vertical-align: middle;
  }

  .faxPreviewDialog .el-button, .faxPreviewDialog .el-button:hover, .faxPreviewDialog .el-button:focus {
    background: transparent;
  }
  .faxPreviewDialog .el-button:after {
    background: url('../../../static/images/icon_whirl_fax.png') 0 top no-repeat;
    background-size: 100% auto;
    width: 24px;
    height: 24px;
    content: ' ';
    display: inline-block;
  }
  .faxPreviewDialog .el-button:hover:after {
    background-position: 0 -24px;
  }

  .faxPreviewDialog .left {
    margin-left: 20px;
    transform: rotateY(180deg);
  }
  .faxPreviewDialog .disable:after {
    background-position: 0 -48px;
    cursor: default;
  }
  .faxPreviewDialog .disable:hover:after {
    background-position: 0 -48px;
  }
  .faxPreviewDialog .el-dialog__body {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0;
    height: 100%;
  }
  .faxPreviewDialog .el-dialog__header,
  .faxPreviewDialog .el-dialog__footer{
    padding: 0;
  }
  .faxPreviewDialog .el-dialog__headerbtn {
    font-size: 30px;
    z-index: 10001;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 46px;
    width: 46px;
    height: 46px;
  }
  .faxPreviewDialog .el-dialog__headerbtn .el-dialog__close {
    vertical-align: top;
    padding-top: 2px;
  }
</style>
