<template>
  <div class="map-container">
    <baidu-map class="map" @click="onClickGetCurrentLngAndLat"
               :center="{lng: 116.404, lat: 39.915}"
               :zoom="zoom" :min-zoom="8" :max-zoom="30"
               :scroll-wheel-zoom="true"
               @ready="setMapReadyFlagTruth">
      <bm-control :offset="btnOffset">
        <el-button @click="addZoom(17)">缩放至最大</el-button>
        <el-button @click="addZoom(10)">还原</el-button>
        <el-button @click="addZoom(8)">缩放至最小</el-button>
        <el-button @click="clearPolygon">清除覆盖物</el-button>
      </bm-control>
      <bm-polygon :path="polygonPath"
                  fill-color="#f58d3a" :fill-opacity="0.2"
                  stroke-color="blue"
                  :stroke-opacity="0.5" :stroke-weight="2"
                  :editing="false">
      </bm-polygon>
    </baidu-map>
    <div v-for="item in polygonPath" v-if="polygonPath.length > 0">
      <el-input v-model="item.lng"></el-input>
      <el-input v-model="item.lat"></el-input>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        mapIsReady: false,
        polygonPath: [],
        btnOffset: {
          width: 20,
          height: 20
        },
        center: {
          lng: 116.404, lat: 39.915
        },
        zoom: 15,
        theme: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": {
              "hue": "#007fff",
              "saturation": 89
            }
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
              "color": "#fff"
            }
          }
        ]    //自定义主题
      }
    },
    methods: {
      setMapReadyFlagTruth() {
        this.mapIsReady = true;
      },
      addZoom(level) {
        this.zoom = level
      },
      //清除多边形
      clearPolygon() {
        this.polygonPath = []
      },
      //点击地图获取对应的点
      onClickGetCurrentLngAndLat(e) {
        if (this.mapIsReady) {
          const {lng, lat} = e.target.getCenter();
          this.center.lng = lng;
          this.center.lat = lat;
          this.zoom = e.target.getZoom();
          this.polygonPath.push(e.point);
        }
      }
    }
  }
</script>
<style scoped>
  .map-container {
    width: 100%;
    height: 100%;
  }

  .map {
    width: 100%;
    height: 100%;
  }
</style>
