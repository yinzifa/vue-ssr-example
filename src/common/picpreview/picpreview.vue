<template>
  <div class="flyPopPreview">
    <el-dialog
      title="在线预览"
      :visible.sync="showPreview"
      width="70%"
      :before-close="handleClose"
      @close="closeDialog"
      :class="'flyPopPreview'"
    >
      <pdf :url="photoToShow" v-if="!isImage"></pdf>
      <img :src="photoToShow" alt="" class="digpic" v-else>
      <span slot="footer" class="dialog-footer" v-if="isImage">
        <el-button :class="'left'" @click="onClickPicRotate('right')"></el-button>
        <el-button :class="'right'" @click="onClickPicRotate('left')"></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import pdf from 'common/pdf/pdf';
  export default {
    components: {
      pdf
    },
    props: [
      'photoToShow', 'isImage', 'showPreview'
    ],
    data() {
      return {
        rotate: 0,
      }
    },
    methods: {
      handleClose(done) {
        this.$emit('imgPreviewPass', false);
        this.imageUrl = "";
        this.rotate = 0;
        document.querySelector('.digpic').style = "";
        document.querySelector('.el-dialog__body').style = "";
      },
      closeDialog() {
        this.$emit('imgPreviewPass', false);
      },
      //图片旋转
      onClickPicRotate(para) {
        let pic = document.querySelector('.digpic'),
          pop = document.querySelector('.el-dialog__body'),
          rotate = this.rotate,
          picHeight = pic.offsetHeight,
          picWidth = pic.offsetWidth,
          gap = (pic.offsetHeight - pic.offsetWidth) / 2;
        if (para === 'right') {
          this.rotate -= 90;
        } else {
          this.rotate += 90;
        }
        let direction = Math.abs((this.rotate / 90) % 4),
          translate = 0,
          popHeight = 0,
          basic = this.rotate >= 0 ? 1 : -1;
        switch (direction) {
          case 1:
            translate = -gap * basic;
            popHeight = picWidth;
            break;
          case 2:
            translate = 0;
            popHeight = picHeight;
            break;
          case 3:
            translate = gap * basic;
            popHeight = picWidth;
            break;
          default:
            translate = 0;
            popHeight = picHeight;
        }
        let translateY = translate;
        if (pic.offsetHeight - pic.offsetWidth < 0) {
          translateY = 0;
        }
        pic.style.transform = `rotate(${this.rotate}deg) translateX(${translate}px) translateY(${translateY}px)`;
        pop.style.height = popHeight + 'px';
        pop.onmousedown = function (ev) {
          ev.stopPropagation();
          ev = ev || event;
          var oLeft = pop.offsetLeft;
          var a = ev.clientX - oLeft;
          pop.onmousemove = function (ev) {
            ev = ev || event;
            pop.scrollLeft = pop.scrollLeft - (ev.clientX - a) / 2;
          }
        };
        document.onmouseup = function () {
          pop.onmousemove = function () {
            null;
          }
        }
      }
    }
  }
</script>
<style>
  .flyPopPreview .dialog-footer .el-button {
    padding: 0;
    border: 0;
  }

  .flyPopPreview .dialog-footer .el-button:hover, .flyPopPreview .dialog-footer .el-button:focus {
    background: #fff;
  }

  .flyPopPreview .dialog-footer .el-button:after {
    background: url('../../../static/images/icon_whirl.png') 0 top no-repeat;
    background-size: 100% auto;
    width: 24px;
    height: 24px;
    content: ' ';
    display: inline-block;
  }

  .flyPopPreview .dialog-footer .el-button:hover:after {
    background-position: 0 -24px;
  }

  .flyPopPreview .dialog-footer .left {
    transform: rotateY(180deg);
  }

  .flyPopPreview .el-dialog__body {
    overflow-x: auto;
    overflow-y: hidden;
  }

  .flyPopPreview img {
    margin: 0 auto;
    width: 100%;
  }

  .flyPopPreview .el-dialog__footer {
    text-align: center !important;
  }
</style>
