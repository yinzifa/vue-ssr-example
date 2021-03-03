<template>
  <div class="pdf-view">
    <pdf
        v-for="i in numPages"
        :key="i"
        :src="src"
        :page="i"
        @loaded="pdfLoaded"
        @click.native="onClickGetUrl"
    ></pdf>
  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  const pdfPrdDomain = process.env.NODE_ENV !== 'production' ? '' : location.origin;
  export default {
    components: {
      pdf
    },
    props: {
      url: {
        type: String,
        default: '',
        required: true
      }
    },
    data () {
      return {
        pdfProgress: 0,
        numPages: undefined,
        src: null,
        isPdfLoaded: false
      }
    },
    mounted () {
      let url = `${pdfPrdDomain}${this.url.split('.com')[1]}`;
      if (url) {
        setTimeout(() => {
          this.src = pdf.createLoadingTask(url);
          this.src.then((pdfInstance) => {
            this.numPages = pdfInstance.numPages;
          })
        }, 20)
      }
    },
    methods: {
      pdfLoaded () {
        this.$emit('getPdfLoaded')
      },
      onClickGetUrl() {
        this.$emit('getPdfUrl');
      }
    }
  }
</script>

<style>

</style>
