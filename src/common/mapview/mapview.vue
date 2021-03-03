<template>
  <el-dialog
    class="map-preview-pop"
    :title="mapInfo.title ? mapInfo.title : '空域预览'"
    @close="dialogClose"
    :before-close="handleClose"
    width="70%"
    :visible.sync="isMapPopShow">
    <div class="coord">GCJ-02坐标系 经度: {{mapInfo.moveLng}}, 纬度: {{mapInfo.moveLat}}</div>
    <div class="info" v-show="isMapInfo">
      <p>{{coordData.scopeName}}  <span>飞行高度：{{coordData.heightDesc}}</span></p>
      <p class="coord-list"></p>
    </div>
    <div id="js-container" class="map-preview"></div>
  </el-dialog>
</template>
<script>
import remoteLoad from '@/utils/remoteLoad.js';
export default {
  props: [
    'isMapPopShow',
    'mapInfo',
    'coordData',
    'gaodeCoordArr',
    'maptype'
  ],
  data(){
    return{
      markerArr:[],
      map:null,
      mapZoom:5,
      lng:null,
      lat:null,
      PaintOverlay:null, // 图层合集
      paintObj:{},// 图层对象
      mapDefaultSet:{strokeColor:'#35E5FF',fillColor:'#267BFF'},
      isMapInfo:true,
    }
  },
  methods: {
    dialogClose() {
      this.$emit('mapPreviewPass',false);
    },
    handleClose(){
      this.$emit('mapPreviewPass',false);
    },
    previewAll(){
      let coordObj = {
          minLng:180,
          minLat:90,
          maxLng:0,
          maxLat:0,
        },
        distance = 0,
        status = true,
        radius = 0,
        coord = this.maptype ? [this.coordData] : [...this.coordData],
        html = '';

      this.map.remove(this.markerArr); // 清除顶点

      if (this.maptype) { // 单个空域预览
        this.isMapInfo = true;
        this.mapInfo.title = this.coordData.scopeName;

        coord = this.gaodeCoordArr[this.maptype.index] ? [this.gaodeCoordArr[this.maptype.index]] : [this.coordData];

        let coordList = document.querySelector('.coord-list'),
            coordinateDescList = this.coordData.coordinateDescList;
        if (this.coordData.type == 'circle') {
            html+=`<span>中心点: ${coordinateDescList[0].lng} ${coordinateDescList[0].lat}</span><span>半径: ${coordinateDescList[0].radius}米</span>`
        }else{
          coord[0].coordinateDescList.map((v,n)=>{
            html+=`<span>顶点${n+1}:${v.lng} ${v.lat}</span>`
          })
        }
        coordList.innerHTML = html;
        if (coord[0].coordinateList.length === 0) {
          this.$message({
            message: '坐标缺失，暂时无法查看',
            type: 'error',
            center:true,
          });
          return;
        }
        this.createMarker(coord[0].coordinateList); // 创建顶点
      }else{ // 预览全部
        this.isMapInfo = false;
        coord.map((v,n)=>{
          if (this.gaodeCoordArr[n]) {
              coord[n] = this.gaodeCoordArr[n];
          }
        })
      }
      if (this.PaintOverlay) {
        this.PaintOverlay.setMap(null); // 清除trigger集合下的图层
        this.PaintOverlay.clearOverlays(); // 清空trigger集合
      }
      this.setMapZoomAndCenter(coord,true);
      this.createPaint(coord); // 创建空域
    },
    setMapZoomAndCenter(para,b){ // 设置中心点和地图缩放 b:是否是多个数组
      let coordObj = {
            minLng:180,
            minLat:90,
            maxLng:0,
            maxLat:0,
          },
          distance = 6,
          coord = b ? para :[para.coordinateList],
          radius = 0,
          [mapLng,mapLat] = ['',''];

        if (coord.length === 0) {
          this.$message({
            message: '坐标缺失，暂时无法查看',
            type: 'error',
            center:true,
          });
          return;
        }
        if (para.type == 'circle') {
            mapLng = para.coordinateList[0].lng;
            mapLat = para.coordinateList[0].lat;
            distance = para.coordinateList[0].radius*2;
        }else{
            coord.map((x)=>{
              let list = x.coordinateList;
              list.map((v)=>{
                if (v.radius && v.radius > radius) {
                  radius = v.radius*2;
                }
                if (v.lng > coordObj.maxLng) {
                  coordObj.maxLng = Number(v.lng)
                }
                if (v.lng < coordObj.minLng) {
                  coordObj.minLng = v.lng === '' ? 180 : Number(v.lng)
                }
                if (v.lat > coordObj.maxLat) {
                  coordObj.maxLat = Number(v.lat)
                }
                if (v.lat < coordObj.minLat) {
                  coordObj.minLat = v.lat === '' ? 90 : Number(v.lat)
                }
              })
            })
            mapLng = ((coordObj.minLng+coordObj.maxLng)/2).toFixed(7);
            mapLat = ((coordObj.minLat+coordObj.maxLat)/2).toFixed(7);
            if (coord[0].length == 1 && b && !radius) {
              distance = coord[0][0].radius ? coord[0][0].radius*2 : 10000;
            }else{
              distance = AMap.GeometryUtil.distance([coordObj.minLng,coordObj.minLat],[coordObj.maxLng,coordObj.maxLat]);
              if (radius > distance) {
                distance = Number(radius);
              }
            }
        }
        this.map.setCenter([mapLng,mapLat])
        this.map.setZoom(this.getMapZoom(distance))
    },
    getMapZoom(distance){ // 获取中心点和地图缩放级别
      let zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"],
          zoomLevel = 0;
      zoom.map((v,n)=>{
        if (v < distance) {
          zoomLevel++;
        }
      })
      return 18-zoomLevel+2;
    },
    preview(para,index) {
      let val = this.gaodeCoordArr[index] || para;
      let coordinateList = val.coordinateList,
          coordObj = {
            minLng:180,
            minLat:90,
            maxLng:0,
            maxLat:0,
          },
          distance = 0,
          coordList = document.querySelector('.coord-list'),
          html = '',
          coordinateDescList = val.coordinateDescList;

      if (!coordinateList && coordinateList !== 0) {
        this.$message.error('坐标缺失，暂时无法查看');
        return;
      }
      this.isMapInfo = true;
      this.mapInfo.title = val.scopeName;
      this.mapInfo.heightDesc = val.heightDesc;
      this.mapInfo.coord = val.coordinateList;
      if (val.type == 'circle') {
        this.lng = coordinateList[0].lng;
        this.lat = coordinateList[0].lat;
        distance = coordinateList[0].radius*2;
        html+=`<span>中心点: ${coordinateDescList[0].lng} ${coordinateDescList[0].lat}</span><span>半径: ${coordinateDescList[0].radius}米</span>`
      }else{
        coordinateList.map((v)=>{
          if (v.lng > coordObj.maxLng) {
            coordObj.maxLng = Number(v.lng)
          }
          if (v.lng < coordObj.minLng) {
            coordObj.minLng = v.lng === '' ? 180 : Number(v.lng)
          }
          if (v.lat > coordObj.maxLat) {
            coordObj.maxLat = Number(v.lat)
          }
          if (v.lat < coordObj.minLat) {
            coordObj.minLat = v.lat === '' ? 90 : Number(v.lat)
          }
        });
        this.mapInfo.moveLng = this.lng = ((coordObj.minLng+coordObj.maxLng)/2).toFixed(7);
        this.mapInfo.moveLat = this.lat = ((coordObj.minLat+coordObj.maxLat)/2).toFixed(7);

        distance = this.AMap.GeometryUtil.distance([coordObj.minLng,coordObj.minLat],[coordObj.maxLng,coordObj.maxLat]);
        coordinateDescList.map((v,n)=>{
          html+=`<span>顶点${n+1}:${v.lng} ${v.lat}</span>`
        })
      }
      coordList.innerHTML = html;
      this.mapZoom = this.getZoomAndCenter(distance);
      this.map.setCenter([this.lng,this.lat]);
      this.map.setZoom(this.mapZoom);
      if (this.PaintOverlay) {
        this.PaintOverlay.setMap(null); // 清除trigger集合下的图层
        this.PaintOverlay.clearOverlays(); // 清空trigger集合
      }
      this.map.remove(this.markerArr);
      this.createPaint([val]); // 创建空域
      this.createMarker(coordinateList); // 创建顶点
    },
    createPaint(graphData,typeName){ // 创建覆盖物
      let map = this.map,
          _this = this;
      function createPolygon(data){
        let strokeStyle = data.status == 2 ? 'dashed' : 'solid',
            strokeColor = _this.mapDefaultSet['strokeColor'],
            fillColor = _this.mapDefaultSet['fillColor'];
        if (data.scopeType) {
            strokeColor = _this.paintColor[data.scopeType]['strokeColor'];
            fillColor = _this.paintColor[data.scopeType]['fillColor'];
        }
        let polygon = new AMap.Polygon({
                path: data.arr,//设置多边形边界路径
                strokeColor: strokeColor, //线颜色
                strokeOpacity: .8, //线透明度
                strokeWeight: 1,    //线宽
                fillColor: fillColor, //填充色
                fillOpacity: 0.4,//填充透明度
                // extData:{id:data.id,cue:_cue},
                strokeStyle:strokeStyle,
                strokeDasharray:[4,4],
                // zIndex:_index,
            });
        polygon.setMap(map);
        return polygon;
      };
      function createLine(data){
        let strokeStyle = data.status == 2 ? 'dashed' : 'solid',
            strokeColor = _this.mapDefaultSet['strokeColor'];
        if (data.scopeType) {
            strokeColor = _this.paintColor[data.scopeType]['strokeColor'];
        }
        let polyline = new AMap.Polyline({
            path: data.arr,//设置多边形边界路径
            strokeColor: strokeColor, //线颜色
            strokeOpacity: .8, //线透明度
            strokeWeight: 1,    //线宽
            strokeStyle:strokeStyle,
            strokeDasharray:[4,4],
        });
        polyline.setMap(map);
        return polyline;
      };
      function createCircle(data){
        let strokeStyle = data.status == 2 ? 'dashed' : 'solid',
            strokeColor = _this.mapDefaultSet['strokeColor'],
            fillColor = _this.mapDefaultSet['fillColor'];
        if (data.scopeType) {
            strokeColor = _this.paintColor[data.scopeType]['strokeColor'];
            fillColor = _this.paintColor[data.scopeType]['fillColor'];
        }
        let circle = new AMap.Circle({
          center: new AMap.LngLat(data.lng, data.lat),// 圆心位置
          radius: data.radius, //半径
          strokeColor:strokeColor, //线颜色
          strokeOpacity: .8, //线透明度
          strokeWeight: 1, //线粗细度
          fillColor: fillColor, //填充颜色
          fillOpacity: 0.4,//填充透明度
          strokeStyle:strokeStyle,
          strokeDasharray:[4,4],
        });
       circle.setMap(map);
       return circle;
      }
      graphData.map((x,n)=>{
          let status = x.spaceStatus || '',// =2 待审核状态
              isClick = x.isClick || false; // 是否可以点击
            let d = x.coordinateList,
                arr = [],
                id = '';
              if (x.spaceStatus) {
                status = x.spaceStatus;
              }

            if (x.scopeId) {
                id = 't'+x.scopeId;
            }

            switch (x.type) {
              case 'polygon':
                d.map((z)=>{
                  if (!z.lng || !z.lat) {
                    return;
                  }
                  arr.push([z.lng,z.lat])
                })
                this.paintObj[id] = createPolygon({arr:arr,id:id,status:status});
                break;
              case 'line':
                d.map((z)=>{
                  if (!z.lng || !z.lat) {
                    return;
                  }
                  arr.push([z.lng,z.lat])
                })
                this.paintObj[id] = createLine({arr:arr,id:id,status:status});
                break;
              case 'circle':
                this.paintObj[id] = createCircle({lng:d[0].lng,id:id,status:status,lat:d[0].lat,radius:d[0].radius});
                break;
              default:
            }
            this.PaintOverlay.addOverlay(this.paintObj[id]);
      })
    },
    createMarker(para){ // 创建点
      var _this = this;
      AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
        para.map((v,n)=>{
          let mk = new SimpleMarker({
              iconTheme: 'numv1',
              iconStyle: 'red',
              iconLabel: {
                  innerHTML: n+1,
                  style: {
                      color: '#fff',
                      'font-size':'12px',
                      'line-height':'30px',
                  }
              },
              map: _this.map,
              position: [v.lng,v.lat],
          });
          _this.markerArr.push(mk);
        });
      });
    },
    pinitMap () { //地图初始化
      let AMapUI = this.AMapUI = window.AMapUI,
          AMap = this.AMap = window.AMap,
          mapConfig = {
            zoom: 8,
            zooms:[4,18],
            center:[116.423492,39.832653],
            mapStyle:'amap://styles/9aab470d382f0ac94978eb390283ef4e',
          },
          _this = this;
      let map = this.map = new AMap.Map('js-container', mapConfig);
      this.PaintOverlay = new AMap.OverlayGroup(); // 空域集合
      // 地图缩放
      AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
          let zoomCtrl1 = new BasicControl.Zoom({});
          map.addControl(zoomCtrl1);
      });
      // 基础图层
      const geoserverKeyAndVal = {'1':'air_nofly','2':'air_danger','3':'air_limit','4':'air_clear'};
      for(var i in geoserverKeyAndVal){
        this.setGeoserver(geoserverKeyAndVal[i])
      }
      //地图坐标显示
      AMap.event.addListener(map,'mousemove',function(e){
          _this.mapInfo.moveLng = e.lnglat.getLng();
          _this.mapInfo.moveLat = e.lnglat.getLat();
      });
    },
    setGeoserver(uav_amap){ // 设置基础图层
      var wms = new AMap.TileLayer.WMS({
          url:'//admin.yeahfei.com/geoserver/uav_amap/wms',
          blend:false,
          tileSize:256,
          zIndex:101,
          params:{'LAYERS':`uav_amap:${uav_amap}`,VERSION:'1.3.0'}
      });
      wms.setMap(this.map);
      return wms;
    },
  },
  watch:{
    isMapPopShow(val){
      if (val) {
        this.$nextTick(()=>{
          this.pinitMap();
          this.previewAll();
        })
      }
    }
  }
}
</script>
<style>
.map-preview-pop{}
.map-preview-pop header{font-size: 16px;line-height: 54px;height: 54px;color: #5b5b5b;padding: 0 24px 0 12px;}
.map-preview-pop header .el-icon-close{float:right;cursor: pointer;font-size: 24px;line-height: 54px;color: #c2c2c2;}
.map-preview-pop .map-preview{height: 100%;width: 100%;}
.map-preview-pop .coord{position: absolute;left: 10px;top: 8px;z-index: 10;font-size: 14px;line-height: 2;color: #fff;}
.map-preview-pop .info{position:absolute;bottom: 0;left: 0;width: 100%;background: rgba(0,0,0,.6);z-index: 10;color: #fff;font-size: 14px;line-height: 1.6;padding: 12px 0 20px;}
.map-preview-pop .info p{padding: 0 12px;}
.map-preview-pop .info p:nth-child(1){padding-bottom: 4px;}
.map-preview-pop .info p:nth-child(1) span{padding-left: 20px;}
.map-preview-pop .info span{display: inline-block;margin-right: 14px;}
.map-preview-pop .el-dialog__header{height: 54px;position: absolute;left: 0;top: -54px;background: #fff;width: 100%;padding: 0px;line-height: 54px;}
.map-preview-pop .el-dialog__title{padding-left: 10px;}
.map-preview-pop .el-dialog__body{position: relative;padding: 0;overflow: hidden;height: 100%;border:solid 2px #fff;}
.map-preview-pop .el-dialog{height: 80%;}
/* 地图标尺 */
.amap-logo{display: none;}
.amap-ui-control-position-rt .amap-ui-control-zoom{border: 0;border-radius: 0;width: 30px;}
.amap-ui-control-zoom .zoom-btn{width: 28px;height: 28px;border: solid 1px #59B9E2;border-radius: 6px;background: rgba(0,0,0,.6);color: rgba(255,255,255,.8);line-height: 26px;font-size: 20px;margin-top: 12px;transition: .5s;}
.amap-ui-control-zoom .zoom-btn:hover{color: #59B9E2;background-color:rgba(0,0,0,.6);}
.amap-ui-control-theme-light .amap-ui-control-zoom a.disabled{background: rgba(0,0,0,.6);}
.amap-ui-control-zoom .amap-ui-control-zoom-out,.amap-ui-control-theme-light .amap-ui-control-zoom a{border-bottom: solid 1px #59B9E2!important;}
</style>
